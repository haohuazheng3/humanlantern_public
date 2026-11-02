import { z } from "zod";
import Stripe from "stripe";
import { CHECKOUT_BRAND, paymentsEnabled, stripe, stripeEnvTag } from "@/lib/stripe";
import { captureError } from "@/lib/errors";
import { clientIp, ipHash, rateLimit, tooMany } from "@/lib/ratelimit";
import { newToken } from "@/lib/ids";
import { env, IS_PRODUCTION_DEPLOY, requireEnv } from "@/lib/env";
import { BOOK, PRODUCT_ID, SITE } from "@/lib/site";
import { getDict } from "@/i18n";
import { DEFAULT_LANG, isLang, localePath, STRIPE_LOCALE } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A per-attempt nonce from the browser: double taps and retries of one attempt reuse one session.
 * `lang` picks the edition the buyer came from (Checkout language, return pages, delivery email);
 * `waiver` records that an EU/UK buyer asked for immediate access before paying.
 */
const Body = z.object({
  nonce: z.string().regex(/^[A-Za-z0-9_-]{16,64}$/).optional(),
  lang: z.string().optional(),
  waiver: z.boolean().optional(),
});

/**
 * Guest checkout: no account. Stripe collects the buyer's email; the success page, the
 * webhook and the reconcile job grant the book to that email.
 */
export async function POST(req: Request) {
  try {
    const rl = await rateLimit(`checkout:${ipHash(clientIp(req.headers))}`, 10, 300);
    if (!rl.ok) return tooMany(rl);

    const payments = paymentsEnabled();
    if (!payments.ok) return Response.json({ error: payments.reason }, { status: 503 });

    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    const data = parsed.success ? parsed.data : {};
    const nonce = data.nonce ?? newToken(12);
    const lang = isLang(data.lang) ? data.lang : DEFAULT_LANG;
    const t = getDict(lang);

    const origin = IS_PRODUCTION_DEPLOY ? SITE.url : new URL(req.url).origin;
    const metadata: Record<string, string> = { product: PRODUCT_ID, site: CHECKOUT_BRAND.site, env: stripeEnvTag(), lang };
    if (data.waiver) metadata.withdrawal_waiver = "accepted-before-checkout";

  const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [{ price: requireEnv("STRIPE_PRICE_BOOK"), quantity: 1 }],
      customer_creation: "always",
      locale: STRIPE_LOCALE[lang],
      metadata,
      payment_intent_data: {
        metadata,
        description: `${BOOK.title} (ebook)`,
        statement_descriptor_suffix: CHECKOUT_BRAND.statementSuffix,
      },
      allow_promotion_codes: true,
      success_url: `${origin}${localePath(lang, "/checkout/success")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${localePath(lang, "/book")}?checkout=cancelled`,
      // No expires_at: Stripe's default (24 h) keeps the parameters identical for every retry of one attempt,
      // which the idempotency key requires.
      branding_settings: {
        display_name: CHECKOUT_BRAND.displayName,
        button_color: CHECKOUT_BRAND.buttonColor,
        border_style: "rounded",
        icon: { type: "url", url: CHECKOUT_BRAND.iconUrl },
      },
        custom_text: { submit: { message: env("RESEND_API_KEY") ? t.buy.deliveryWithEmail : t.buy.delivery } },
    };
    // One key per attempt, edition and waiver choice: a retry of the same attempt gets the same session back.
    const key = `hl-co-${nonce}-${lang}-${data.waiver ? 1 : 0}`;
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe().checkout.sessions.create(params, { idempotencyKey: key });
    } catch (err) {
      // Same key, different parameters (e.g. the delivery email was switched on mid-attempt): start a fresh attempt.
      if (!(err instanceof Stripe.errors.StripeIdempotencyError)) throw err;
      await captureError(err, { route: "/api/checkout", severity: "warn", context: { stage: "idempotency-retry" } });
      session = await stripe().checkout.sessions.create(params, { idempotencyKey: `${key}-${newToken(6)}` });
    }

    if (!session.url) throw new Error("Stripe returned a session without a URL");
    return Response.json({ url: session.url });
  } catch (err) {
    await captureError(err, { route: "/api/checkout" });
    return Response.json({ error: "We couldn’t open checkout. Please try again in a moment." }, { status: 500 });
  }
}
