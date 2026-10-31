import "server-only";
import { and, eq, gte, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "./db";
import { orders } from "./db/schema";
import { licensedCopyKey } from "./library";
import { readFile } from "./files";
import { sendEmail } from "./mailer";
import { createDownloadToken, downloadPath, DOWNLOAD_LINK_DAYS } from "./download-token";
import { activeEntitlement } from "./entitlements";
import { buyerIdFor, normalizeEmail } from "./buyers";
import { captureError } from "./errors";
import { orderRef } from "./ids";
import { BOOK, EDITIONS, SITE } from "./site";
import { env } from "./env";
import { DELIVERY_EMAIL } from "@/i18n/email";
import { LANG_META, LOCALES, isLang, localePath, type Lang } from "@/i18n/config";
import { book } from "@/content/book";

/*
 * After payment the personal (watermarked) PDF of the buyer's edition is emailed to the checkout
 * address, with links to all three editions. Optional until RESEND_API_KEY is set.
 * deliverOrder is safe to call from the success page, the webhook and the reconcile
 * job at the same time: an order is claimed before sending, marked once sent, and
 * Resend's idempotency key drops any duplicate that slips through.
 */

export type DeliveryResult = "sent" | "already-sent" | "busy" | "not-deliverable" | "not-configured" | "failed";

/** Email delivery is optional until the Resend key is configured; the success page and /download links work without it. */
export function emailDeliveryEnabled(): boolean {
  return Boolean(env("RESEND_API_KEY"));
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** The delivery email, exported for tests. */
export function deliveryMessage({
  ref,
  lang,
  links,
  pages,
  waiver,
}: {
  ref: string;
  lang: Lang;
  links: Record<Lang, string>;
  pages: number;
  waiver: boolean;
}): { subject: string; text: string; html: string } {
  const c = DELIVERY_EMAIL[lang];
  const title = EDITIONS[lang].title;
  const againUrl = `${SITE.url}${localePath(lang, "/download")}`;
  const editionLines = LOCALES.map((l) => `${LANG_META[l].name}: ${links[l]}`);
  const subject = c.subject(title);
  const text = [
    c.thanks(title),
    "",
    c.attached(pages),
    "",
    `${c.button}: ${links[lang]}`,
    c.linkNote(DOWNLOAD_LINK_DAYS),
    "",
    c.editions,
    ...editionLines,
    "",
    c.start,
    "",
    c.order(ref),
    `${c.again} ${againUrl}`,
    c.refund(BOOK.refundDays),
    ...(waiver ? ["", c.waiver] : []),
    "",
    SITE.name,
    SITE.url,
  ].join("\n");

  const p = (s: string) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1b1611">${s}</p>`;
  const small = (s: string) => `<p style="margin:0 0 6px;font-size:14px;line-height:1.55;color:#5d544b">${s}</p>`;
  const html = `<!doctype html><html lang="${LANG_META[lang].htmlLang}"><body style="margin:0;background:#efeae3;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,'Hiragino Sans','Yu Gothic',sans-serif">
<div style="display:none;max-height:0;overflow:hidden">${escapeHtml(c.preheader(ref))}</div>
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:22px;padding:32px 28px">
<p style="margin:0 0 20px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#ad480b">${escapeHtml(SITE.name)}</p>
${p(escapeHtml(c.thanks(title)))}
${p(escapeHtml(c.attached(pages)))}
<p style="margin:24px 0"><a href="${escapeHtml(links[lang])}" style="display:inline-block;background:#f07a2e;color:#1f0e03;text-decoration:none;font-weight:600;padding:13px 22px;border-radius:999px">${escapeHtml(c.button)}</a></p>
${p(escapeHtml(c.linkNote(DOWNLOAD_LINK_DAYS)))}
${p(escapeHtml(c.editions))}
<ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.7;color:#1b1611">${LOCALES.map((l) => `<li><a href="${escapeHtml(links[l])}" style="color:#ad480b">${escapeHtml(EDITIONS[l].title)}</a> (${escapeHtml(LANG_META[l].name)})</li>`).join("")}</ul>
${p(escapeHtml(c.start))}
<hr style="border:none;border-top:1px solid #e8e1d8;margin:24px 0">
${small(escapeHtml(c.order(ref)))}
${small(`${escapeHtml(c.again)} <a href="${escapeHtml(againUrl)}" style="color:#ad480b">${escapeHtml(c.againLink)}</a>`)}
${small(escapeHtml(c.refund(BOOK.refundDays)))}
${waiver ? small(escapeHtml(c.waiver)) : ""}
</div></body></html>`;
  return { subject, text, html };
}

async function sendCopy(buyerId: string, email: string, ref: string, lang: Lang, waiver: boolean, idempotencyKey: string): Promise<void> {
  const { key } = await licensedCopyKey(buyerId, email, lang);
  const pdf = await readFile(key);
  const token = createDownloadToken(buyerId);
  const links = Object.fromEntries(LOCALES.map((l) => [l, `${SITE.url}${downloadPath(token, "download", l)}`])) as Record<Lang, string>;
  await sendEmail({
    to: email,
    ...deliveryMessage({ ref, lang, links, pages: book(lang).pages, waiver }),
    attachments: [{ filename: EDITIONS[lang].fileName, content: pdf, contentType: "application/pdf" }],
    idempotencyKey,
  });
}

/** Rejects when `p` takes longer than `ms`, so the caller's catch still runs inside the function's lifetime. */
export function withDeadline<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} took longer than ${Math.round(ms / 1000)}s`)), ms);
  });
  return Promise.race([p, deadline]).finally(() => clearTimeout(timer));
}

/** Delivery runs inside routes capped at 60 s; stop at 40 s so the failure is recorded and the claim released. */
const DELIVERY_DEADLINE_MS = 40_000;

/** Emails the personal copy for a paid order, exactly once. */
export async function deliverOrder(orderId: string): Promise<DeliveryResult> {
  if (!emailDeliveryEnabled()) return "not-configured";
  const claimed = await db
    .update(orders)
    .set({ emailClaimedAt: sql`now()`, emailAttempts: sql`${orders.emailAttempts} + 1`, updatedAt: sql`now()` })
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.status, "paid"),
        isNull(orders.emailSentAt),
        // A claim can only be live for one capped function run (60 s); older ones belong to a run that died.
        or(isNull(orders.emailClaimedAt), lt(orders.emailClaimedAt, sql`now() - interval '2 minutes'`)),
      ),
    )
    .returning();
  const order = claimed[0];
  if (!order) {
    const row = (await db.select({ sent: orders.emailSentAt, status: orders.status }).from(orders).where(eq(orders.id, orderId)).limit(1))[0];
    if (!row || row.status !== "paid") return "not-deliverable";
    return row.sent ? "already-sent" : "busy";
  }
  if (!order.email) {
    await db.update(orders).set({ emailError: "no email on the order", emailClaimedAt: null }).where(eq(orders.id, order.id));
    return "not-deliverable";
  }

  try {
    const lang = isLang(order.lang) ? order.lang : "en";
    await withDeadline(
      sendCopy(order.userId, order.email, orderRef(order.id), lang, Boolean(order.withdrawalWaiver), `hl-deliver-${order.id}`),
      DELIVERY_DEADLINE_MS,
      "delivery email",
    );
    await db.update(orders).set({ emailSentAt: sql`now()`, emailError: null, emailClaimedAt: null, updatedAt: sql`now()` }).where(eq(orders.id, order.id));
    return "sent";
  } catch (err) {
    const message = err instanceof Error ? err.message.slice(0, 500) : String(err);
    await db
      .update(orders)
      .set({ emailError: message, emailClaimedAt: null, updatedAt: sql`now()` })
      .where(eq(orders.id, order.id))
      .catch(() => {});
    // The buyer already has the download on the success page; page the owner once retries keep failing.
    await captureError(err, {
      route: "delivery.deliverOrder",
      // The every-30-minutes retry gives one free pass; a second failure turns health red, which pages the owner.
      severity: order.emailAttempts >= 2 ? "error" : "warn",
      context: { orderId: order.id, attempt: order.emailAttempts },
    });
    return "failed";
  }
}

/** "Send it again": a fresh copy for an email that owns the book. Callers rate-limit. */
export async function resendCopy(email: string, lang: Lang): Promise<"sent" | "not-owned" | "not-configured"> {
  if (!emailDeliveryEnabled()) return "not-configured";
  const address = normalizeEmail(email);
  const buyerId = buyerIdFor(address);
  const ent = await activeEntitlement(buyerId);
  if (!ent) return "not-owned";
  const hour = Math.floor(Date.now() / 3_600_000);
  await sendCopy(buyerId, address, orderRef(ent.orderId), lang, false, `hl-resend-${buyerId}-${lang}-${hour}`);
  return "sent";
}

/**
 * Paid orders from the last 30 days whose email hasn't gone out yet. Run every 30 minutes by
 * /api/cron/deliver and daily by reconcile. Stops starting new sends once `budgetMs` is spent,
 * so a run never outlives its function.
 */
export async function deliverPending(limit = 25, budgetMs = 80_000): Promise<{ sent: string[]; failed: string[]; deferred: number }> {
  const started = Date.now();
  if (!emailDeliveryEnabled()) return { sent: [], failed: [], deferred: 0 };
  const rows = await db
    .select({ id: orders.id })
    .from(orders)
    .where(
      and(
        eq(orders.status, "paid"),
        isNull(orders.emailSentAt),
        lt(orders.emailAttempts, 8),
        gte(orders.createdAt, new Date(Date.now() - 30 * 86400 * 1000)),
      ),
    )
    .limit(limit);
  const out = { sent: [] as string[], failed: [] as string[], deferred: 0 };
  for (const r of rows) {
    if (Date.now() - started > budgetMs - DELIVERY_DEADLINE_MS) {
      out.deferred++;
      continue;
    }
    const result = await deliverOrder(r.id);
    if (result === "sent") out.sent.push(r.id);
    else if (result === "failed") out.failed.push(r.id);
  }
  return out;
}
