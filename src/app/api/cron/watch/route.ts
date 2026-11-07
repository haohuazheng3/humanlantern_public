import { timingSafeEqual } from "node:crypto";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { appState, errorGroups } from "@/lib/db/schema";
import { healthReport, type HealthReport } from "@/lib/health";
import { notifyOwner } from "@/lib/notify";
import { captureError } from "@/lib/errors";
import { env } from "@/lib/env";
import { SITE } from "@/lib/site";
import { stepAlert, utcDay, type AlertAction, type AlertState } from "@/lib/alert-state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "health-watch";
const DIGEST_KEY = "error-digest";
/** The digest goes out with the first run of the UTC day at or after this hour (same morning slot as reconcile). */
const DIGEST_HOUR_UTC = 8;
const DIGEST_TOP = 10;

function authorized(req: Request): boolean {
  const secret = env("CRON_SECRET");
  const got = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!secret || !got || got.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(secret));
}

async function readState(key: string): Promise<unknown> {
  return (await db.select().from(appState).where(eq(appState.key, key)).limit(1))[0]?.value ?? null;
}

async function writeState(key: string, value: unknown): Promise<void> {
  await db.insert(appState).values({ key, value }).onConflictDoUpdate({ target: appState.key, set: { value, updatedAt: sql`now()` } });
}

function minutes(ms: number): string {
  const m = Math.max(0, Math.round(ms / 60000));
  return m < 120 ? `${m} minutes` : `${Math.round(m / 6) / 10} hours`;
}

function alertMail(action: Exclude<AlertAction, null>, report: HealthReport, state: AlertState, now: number): { subject: string; text: string } {
  const why = [!report.db.ok && `database unreachable${report.db.error ? ` (${report.db.error})` : ""}`, report.config.missing.length > 0 && `missing config: ${report.config.missing.join(", ")}`]
    .filter(Boolean)
    .join("; ");
  if (action === "recovered") {
    return { subject: "RECOVERED: health check passing", text: `${SITE.url}/api/health is 200 again after ${minutes(now - state.since)}.` };
  }
  const head =
    action === "down"
      ? `${SITE.url}/api/health has failed ${state.fails} checks in a row: ${why || "not ok"}.`
      : `${SITE.url}/api/health is still failing after ${minutes(now - state.since)}: ${why || "not ok"}.`;
  return {
    subject: action === "down" ? "DOWN: health check failing" : "Still down: health check failing",
    text: `${head}\n\n${JSON.stringify(report, null, 2)}\n\nNo more mail while it stays down except one reminder a day; one email when it recovers.`,
  };
}

/** Once per UTC day: a summary of unresolved severe errors in the inbox. Nothing when there are none. */
async function errorDigest(now: number): Promise<"sent" | "none" | "skipped" | "failed"> {
  const day = utcDay(now);
  if (new Date(now).getUTCHours() < DIGEST_HOUR_UTC) return "skipped";
  const prev = (await readState(DIGEST_KEY)) as { day?: string } | null;
  if (prev?.day === day) return "skipped";
  const open = and(isNull(errorGroups.resolvedAt), eq(errorGroups.severity, "error"));
  const [{ n: severe }] = await db.select({ n: count() }).from(errorGroups).where(open);
  if (Number(severe) === 0) {
    await writeState(DIGEST_KEY, { day, severe: 0 });
    return "none";
  }
  const [{ n: warnings }] = await db
    .select({ n: count() })
    .from(errorGroups)
    .where(and(isNull(errorGroups.resolvedAt), eq(errorGroups.severity, "warn")));
  const top = await db
    .select({
      name: errorGroups.name,
      message: errorGroups.message,
      route: errorGroups.route,
      source: errorGroups.source,
      count: errorGroups.count,
      firstSeen: errorGroups.firstSeen,
      lastSeen: errorGroups.lastSeen,
    })
    .from(errorGroups)
    .where(open)
    .orderBy(desc(errorGroups.lastSeen))
    .limit(DIGEST_TOP);
  const iso = (d: Date) => new Date(d).toISOString().slice(0, 16).replace("T", " ");
  const lines = top.map(
    (e, i) =>
      `${i + 1}. ${e.name}: ${e.message.replace(/\s+/g, " ").slice(0, 160)}\n   ${e.route ?? "-"} (${e.source}) · ${e.count}× · first ${iso(e.firstSeen)} · last ${iso(e.lastSeen)} UTC`,
  );
  const sent = await notifyOwner({
    subject: `Daily digest: ${severe} unresolved error${Number(severe) === 1 ? "" : "s"}`,
    text: [
      `${severe} unresolved severe error group(s)${Number(warnings) ? ` and ${warnings} open warning(s)` : ""} in the error inbox. The site is serving normally; these don't affect /api/health.`,
      "",
      ...lines,
      ...(Number(severe) > top.length ? ["", `…and ${Number(severe) - top.length} more.`] : []),
      "",
      `Inbox: ${SITE.url}/admin/errors (resolve a group there to drop it from tomorrow's digest).`,
    ].join("\n"),
  });
  if (!sent) return "failed";
  await writeState(DIGEST_KEY, { day, severe: Number(severe) });
  return "sent";
}

/**
 * Every 30 minutes (Vercel Cron): run the health self-check and email the owner on state changes
 * only: DOWN after 2 failed checks in a row, one reminder a day while it stays down, RECOVERED when
 * it passes again. Plus the daily error digest. The GitHub Actions health job covers what this can't
 * see from inside (site unreachable, database down).
 */
async function run(req: Request): Promise<Response> {
  if (!authorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    const now = Date.now();
    const report = await healthReport();
    const prev = await readState(KEY);
    const { next, action } = stepAlert(prev, report.ok, now);
    // An email that didn't go out isn't recorded, so the next run tries again.
    const sent = action ? await notifyOwner(alertMail(action, report, next, now)) : true;
    if (sent && JSON.stringify(next) !== JSON.stringify(prev)) await writeState(KEY, next);
    const digest = await errorDigest(now);
    return Response.json({ ok: report.ok, action, alerted: Boolean(action && sent), digest });
  } catch (err) {
    await captureError(err, { route: "/api/cron/watch", source: "cron" });
    return Response.json({ error: "watch failed" }, { status: 500 });
  }
}

export const GET = run;
export const POST = run;
