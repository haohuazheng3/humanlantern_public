import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { after } from "next/server";
import Stripe from "stripe";
import { BookVisual } from "@/components/BookVisual";
import { LibraryActions } from "@/components/LibraryActions";
import { PurchaseEvents } from "@/components/PurchaseEvents";
import { Identify } from "@/components/Identify";
import { AutoRefresh } from "@/components/AutoRefresh";
import { CopyPageLink } from "@/components/CopyPageLink";
import { Container } from "@/components/ui";
import { rich } from "@/components/Rich";
import { grantFromCheckoutSession } from "@/lib/entitlements";
import { deliverOrder, emailDeliveryEnabled } from "@/lib/delivery";
import { createDownloadToken, DOWNLOAD_LINK_DAYS } from "@/lib/download-token";
import { stripe } from "@/lib/stripe";
import { captureError } from "@/lib/errors";
import { orderRef } from "@/lib/ids";
import { EDITIONS, SITE } from "@/lib/site";
import { book } from "@/content/book";
import { getDict } from "@/i18n";
import { LANG_META, LOCALES, isLang, localePath } from "@/i18n/config";
import { gap, stop } from "@/i18n/format";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/[lang]/checkout/success">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  return { title: getDict(lang).success.metaTitle, robots: { index: false, follow: false } };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Container className="pt-10 sm:pt-16">
      <div className="mx-auto max-w-3xl">{children}</div>
    </Container>
  );
}

/**
 * Primary unlock path: verify the Checkout Session with Stripe right here, grant the book to the
 * checkout email on the spot and show read/download for all three editions. The delivery email
 * (when configured) goes out after the response; the webhook and the reconcile job are the fallbacks.
 */
export default async function SuccessPage(props: PageProps<"/[lang]/checkout/success">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const s = t.success;
  const sp = await props.searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : "";
  if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId)) redirect(localePath(lang, "/book"));

  const mail = (
    <a href={`mailto:${SITE.email}`} className="text-accent-text underline">
      {SITE.email}
    </a>
  );

  let session;
  try {
    session = await stripe().checkout.sessions.retrieve(sessionId, { expand: ["payment_intent.latest_charge"] });
  } catch (err) {
    // A made-up or foreign session id is a 4xx from Stripe: worth a note, not a page to the owner.
    const expected = err instanceof Stripe.errors.StripeInvalidRequestError;
    await captureError(err, { route: "/checkout/success", severity: expected ? "warn" : "error", context: { sessionId } });
    return (
      <Shell>
        <div className="slab p-7 sm:p-10" role="alert">
          <h1 className="headline text-[1.8rem] text-ink">{s.failTitle}</h1>
          <p className="mt-3 text-[1rem] text-ink-3">
            {s.failBody}
            {gap(lang)}
            {mail}
            {gap(lang)}
            {s.failTail}
          </p>
        </div>
      </Shell>
    );
  }

  if (session.status === "open" || session.payment_status === "unpaid") {
    return (
      <Shell>
        <AutoRefresh seconds={4} max={20} />
        <div className="slab p-7 sm:p-10" role="status">
          <p className="tag tag-accent">{s.confirmTag}</p>
          <h1 className="headline mt-4 text-[1.8rem] text-ink">{s.confirmTitle}</h1>
          <p className="mt-3 text-[1rem] text-ink-3">{s.confirmBody}</p>
          <div className="mt-5 space-y-2">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-3/4" />
          </div>
        </div>
      </Shell>
    );
  }

  const grant = await grantFromCheckoutSession(session, "success_page");
  if (!grant.ok && (grant.reason === "order-refunded" || grant.reason === "order-disputed")) {
    // Expected states of a real order (the buyer reopened a bookmarked page): explain, don't alert.
    const refunded = grant.reason === "order-refunded";
    return (
      <Shell>
        <div className="slab p-7 sm:p-10" role="status">
          <h1 className="headline text-[1.8rem] text-ink">{refunded ? s.refundedTitle : s.disputedTitle}</h1>
          <p className="mt-3 text-[1rem] text-ink-3">
            {refunded ? (
              s.refundedBody
            ) : (
              <>
                {s.disputedBody}
                {gap(lang)}
                {mail}
                {gap(lang)}
                {s.oddTail}
              </>
            )}
          </p>
          {refunded ? (
            <Link href={localePath(lang, "/book")} className="btn btn-ghost mt-5">
              {t.checkout.back}
            </Link>
          ) : null}
        </div>
      </Shell>
    );
  }
  if (!grant.ok) {
    // Sessions of other brands on the shared Stripe account land here by mistake: a warning, not an outage.
    const foreign = grant.reason.startsWith("other-");
    await captureError(new Error(`success page could not grant: ${grant.reason}`), {
      route: "/checkout/success",
      severity: foreign ? "warn" : "error",
      context: { sessionId, reason: grant.reason },
    });
    return (
      <Shell>
        <div className="slab p-7 sm:p-10" role="alert">
          <h1 className="headline text-[1.8rem] text-ink">{s.oddTitle}</h1>
          <p className="mt-3 text-[1rem] text-ink-3">
            {s.oddBody}
            {gap(lang)}
            {mail}
            {gap(lang)}
            {s.oddTail}
          </p>
        </div>
      </Shell>
    );
  }

  // Email the personal copy after the page is sent (idempotent; the webhook may race us).
  after(async () => {
    await deliverOrder(grant.orderId).catch((err) => captureError(err, { route: "/checkout/success", context: { stage: "deliver", orderId: grant.orderId } }));
  });
  const token = createDownloadToken(grant.userId);
  const b = book(lang);
  const emailed = emailDeliveryEnabled();

  return (
    <Shell>
      <Identify userRef={grant.userId} email={grant.email} />
      <PurchaseEvents sessionId={session.id} orderId={grant.orderId} amount={grant.amountTotal} currency={grant.currency} />
      <div className="slab overflow-hidden p-6 sm:p-10">
        <div className="grid items-start gap-8 md:grid-cols-[200px_1fr] md:gap-12">
          <BookVisual b={b} alt={b.title} priority className="mx-auto w-[48%] max-w-[200px] md:w-full" sizes="200px" />
          <div className="min-w-0">
            <p className="tag tag-ok">{s.paidTag(orderRef(grant.orderId))}</p>
            <h1 className="display mt-4 text-[2.3rem] text-ink sm:text-[2.8rem]">{s.title}</h1>
            <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-3">{s.body}</p>
            <div className="mt-6">
              <LibraryActions
                token={token}
                initial={lang}
                editions={LOCALES.map((l) => ({ lang: l, name: LANG_META[l].name, title: EDITIONS[l].title }))}
                t={{ read: s.read, download: s.download, preparing: s.preparing, opening: s.opening, editionsLabel: s.editionsLabel }}
              />
            </div>
            <div className="slab-inset mt-6 p-4 text-[0.9rem] leading-relaxed text-ink-3">
              <p className="[&_strong]:break-all [&_strong]:text-ink">{rich(emailed ? s.emailed(grant.email) : s.notEmailed(grant.email), lang)}</p>
              {emailed ? (
                <>
                  <p className="mt-2">
                    {s.keep(DOWNLOAD_LINK_DAYS)}
                    {gap(lang)}
                    <Link href={localePath(lang, "/download")} className="underline underline-offset-4">
                      {SITE.domain}
                      {localePath(lang, "/download")}
                    </Link>
                    {stop(lang)}
                  </p>
                  <p className="mt-2 text-ink-4">{s.bookmark}</p>
                </>
              ) : (
                <>
                  {/* Without the delivery email this page is the buyer's way back to the book: never point to /download. */}
                  <p className="mt-2">
                    {s.keepNoEmail(DOWNLOAD_LINK_DAYS)}
                    {gap(lang)}
                    {mail}
                    {s.keepNoEmailTail}
                    {s.keepNoEmailTail ? null : stop(lang)}
                  </p>
                  <CopyPageLink label={s.copyLink} done={s.copied} />
                </>
              )}
              {grant.withdrawalWaiver ? <p className="mt-3 border-t border-[var(--line-2)] pt-3 text-ink-4">{s.waiverConfirm}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
