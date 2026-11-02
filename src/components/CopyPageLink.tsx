"use client";

import { useState } from "react";

/** Copies the current page's URL (the success page is the buyer's way back to the book while delivery email is off). */
export function CopyPageLink({ label, done }: { label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-quiet btn-sm mt-3"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch (e) {
          console.warn("[copy-link] clipboard unavailable", e);
        }
      }}
    >
      {copied ? done : label}
    </button>
  );
}
