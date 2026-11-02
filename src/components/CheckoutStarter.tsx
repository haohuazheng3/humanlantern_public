"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "./Consent";

type State =
  | { phase: "checking" }
  | { phase: "waiver" }
  | { phase: "starting" }
  | { phase: "redirecting" }
  | { phase: "error"; message: string };

export const CHECKOUT_STASH = "hl_checkout_url";
export const CHECKOUT_NONCE = "hl_checkout_nonce";
// An attempt (its stashed session URL and its idempotency key) is reused for 20 minutes at most.
const ATTEMPT_MS = 20 * 60 * 1000;

export interface CheckoutLabels {
  starting: string;
  retry: string;
  contact: string;
  errorGeneric: string;
  errorNetwork: string;
  waiverTitle: string;
  waiverText: string;
  waiverButton: string;
}

/** Attempts are per edition and waiver choice: switching language or ticking the box starts a new one. */
const slot = (base: string, lang: string, waiver: boolean) => `${base}:${lang}:${waiver ? 1 : 0}`;

function attemptNonce(lang: string, waiver: boolean): string {
  const name = slot(CHECKOUT_NONCE, lang, waiver);
  try {
    const kept = sessionStorage.getItem(name);
    if (kept) {
      const { value, at } = JSON.parse(kept) as { value: string; at: number };
      if (Date.now() - at < ATTEMPT_MS) return value;
    }
    const value = crypto.randomUUID();
    sessionStorage.setItem(name, JSON.stringify({ value, at: Date.now() }));
    return value;
  } catch {
    return crypto.randomUUID();
  }
}

function forgetAttempt(lang: string, waiver: boolean) {
  try {
    sessionStorage.removeItem(slot(CHECKOUT_STASH, lang, waiver));
    sessionStorage.removeItem(slot(CHECKOUT_NONCE, lang, waiver));
  } catch {
    /* fine */
  }
}

/**
 * Opens Stripe Checkout as soon as the page renders. A ref, a short-lived stash of the
 * session URL and a per-attempt nonce (the server's idempotency key) make it idempotent:
 * refreshes, double mounts and double taps all land on the same Checkout Session.
 * Visitors in the EU/EEA/UK/CH first confirm they want immediate access to the ebook
 * (digital content: the statutory withdrawal right ends once delivery begins).
 */
export function CheckoutStarter({ lang, t, contactHref }: { lang: string; t: CheckoutLabels; contactHref: string }) {
  const [state, setState] = useState<State>({ phase: "checking" });
  const [agreed, setAgreed] = useState(false);
  const started = useRef(false);

  const start = useCallback(
    async (waiver: boolean) => {
      setState({ phase: "starting" });
      try {
        const stashed = sessionStorage.getItem(slot(CHECKOUT_STASH, lang, waiver));
        if (stashed) {
          const { url, at } = JSON.parse(stashed) as { url: string; at: number };
          if (Date.now() - at < ATTEMPT_MS && url.startsWith("https://checkout.stripe.com/")) {
            setState({ phase: "redirecting" });
            window.location.assign(url);
            return;
          }
        }
      } catch {
        /* storage unavailable: just create a session */
      }
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nonce: attemptNonce(lang, waiver), lang, waiver }),
        });
        const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok || !body.url) {
          // Server messages are English; the buyer sees this edition's own wording.
          setState({ phase: "error", message: t.errorGeneric });
          return;
        }
        try {
          sessionStorage.setItem(slot(CHECKOUT_STASH, lang, waiver), JSON.stringify({ url: body.url, at: Date.now() }));
        } catch {
          /* fine */
        }
        track("checkout_start", { item: "book", lang });
        setState({ phase: "redirecting" });
        window.location.assign(body.url);
      } catch {
        setState({ phase: "error", message: t.errorNetwork });
      }
    },
    [lang, t.errorGeneric, t.errorNetwork],
  );

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    fetch("/api/geo", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { consentRequired: true }))
      .catch(() => ({ consentRequired: true }))
      .then((g: { consentRequired?: boolean }) => {
        if (g.consentRequired === false) void start(false);
        else setState({ phase: "waiver" });
      });
  }, [start]);

  if (state.phase === "error") {
    return (
      <div role="alert">
        <p className="rounded-2xl bg-bad-soft px-4 py-3 text-[0.95rem] text-bad">{state.message}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              forgetAttempt(lang, agreed);
              void start(agreed);
            }}
          >
            {t.retry}
          </button>
          <Link href={contactHref} className="btn btn-ghost btn-lg">
            {t.contact}
          </Link>
        </div>
      </div>
    );
  }

  if (state.phase === "waiver") {
    return (
      <div>
        <p className="text-[0.95rem] font-semibold text-ink">{t.waiverTitle}</p>
        <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl bg-slab-2 p-4 shadow-[inset_0_0_0_1px_var(--line)]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]"
          />
          <span className="text-[0.92rem] leading-relaxed text-ink-2">{t.waiverText}</span>
        </label>
        <button type="button" className="btn btn-primary btn-lg btn-block mt-4" disabled={!agreed} aria-disabled={!agreed} onClick={() => void start(true)}>
          {t.waiverButton}
        </button>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <div className="flex items-center gap-3 text-[1rem] text-ink-2">
        <span className="inline-block h-5 w-5 rounded-full border-2 border-accent border-r-transparent" style={{ animation: "spin .7s linear infinite" }} />
        {t.starting}
      </div>
      <div className="mt-5 space-y-2">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/5" />
      </div>
    </div>
  );
}
