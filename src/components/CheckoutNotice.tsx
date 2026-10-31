"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/** Shown on /book when a buyer comes back from Stripe without paying (?checkout=cancelled). */
export function CheckoutNotice({ lang, t }: { lang: string; t: { cancelled: string; tryAgain: string; dismiss: string } }) {
  const params = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || params.get("checkout") !== "cancelled") return null;
  const [lead, rest] = t.cancelled.replace(/^\*\*/, "").split("**");
  return (
    <div className="mx-auto max-w-[1120px] px-3 pt-4 sm:px-5">
      <div className="slab flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between" role="status">
        <p className="text-[0.98rem] text-ink-2">
          <strong className="text-ink">{lead}</strong>
          {rest}
        </p>
        <div className="flex gap-2">
          <Link href={lang === "en" ? "/checkout" : `/${lang}/checkout`} prefetch={false} className="btn btn-primary btn-sm">
            {t.tryAgain}
          </Link>
          <button type="button" className="btn btn-quiet btn-sm" onClick={() => setDismissed(true)}>
            {t.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
