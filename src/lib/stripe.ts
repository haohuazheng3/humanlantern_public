import "server-only";
import Stripe from "stripe";
import { env, IS_PRODUCTION_DEPLOY, VERCEL_ENV } from "./env";
import { SITE, STATEMENT_SUFFIX } from "./site";

let client: Stripe | null = null;

/** An organization API key (`sk_org…`) works for every account in the organization. */
function isOrgKey(key: string): boolean {
  return key.startsWith("sk_org");
}

/**
 * The account every request acts on. Required with an organization key, which Stripe
 * only accepts together with a `Stripe-Context` header naming the target account.
 */
export function stripeContext(): string | undefined {
  return env("STRIPE_CONTEXT");
}

export function stripe(): Stripe {
  if (!client) {
    const key = env("STRIPE_SECRET_KEY");
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    const context = stripeContext();
    if (isOrgKey(key) && !context) throw new Error("STRIPE_CONTEXT (acct_…) is required with an organization key");
    client = new Stripe(key, {
      typescript: true,
      maxNetworkRetries: 2,
      appInfo: { name: "humanlantern.com" },
      ...(context ? { stripeContext: context } : {}),
    });
  }
  return client;
}

/** Test-mode keys carry `_test_` in their prefix; live and organization keys are treated as live. */
export function stripeMode(): "live" | "test" | "missing" {
  const key = env("STRIPE_SECRET_KEY") ?? "";
  if (!key) return "missing";
  return key.includes("_test_") ? "test" : "live";
}

/** Tag written into every session's metadata; the webhook ignores sessions from other environments. */
export function stripeEnvTag(): string {
  return VERCEL_ENV;
}

/**
 * Live keys only take money on the production deployment. Preview/dev deployments
 * refuse to open a live Checkout unless explicitly allowed for a supervised test.
 */
export function paymentsEnabled(): { ok: true } | { ok: false; reason: string } {
  const mode = stripeMode();
  if (mode === "missing") return { ok: false, reason: "Payments are not configured yet." };
  if (!env("STRIPE_PRICE_BOOK")) return { ok: false, reason: "Pricing is not configured yet." };
  if (mode === "live" && !IS_PRODUCTION_DEPLOY && process.env.ALLOW_LIVE_CHECKOUT_NONPROD !== "1") {
    return { ok: false, reason: "Checkout is only open on humanlantern.com." };
  }
  return { ok: true };
}

/**
 * Brand shown on Stripe Checkout. This is a server-side whitelist: the browser can
 * never choose which name appears on the payment page or the card statement.
 */
export const CHECKOUT_BRAND = {
  site: "humanlantern",
  displayName: "Human Lantern",
  buttonColor: "#F07A2E",
  /** Square brand mark next to the name at the top of Checkout (Stripe fetches it from our own domain). Never a logo: a logo replaces the name. */
  iconUrl: `${SITE.url}/brand/logo-512.png`,
  /** Our name on card statements after the account's fixed prefix: "<PREFIX>* HMNLANTERN" (22 characters in total). */
  statementSuffix: STATEMENT_SUFFIX,
} as const;
