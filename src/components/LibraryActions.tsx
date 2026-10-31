"use client";

import { useState } from "react";
import { track } from "./Consent";

export interface LibraryLabels {
  read: string;
  download: string;
  preparing: string;
  opening: string;
  editionsLabel: string;
}

/**
 * Read / download buttons for a paid copy, for any of the three editions. The token is the
 * buyer's signed download link (no account); the route stamps the personal copy on first use,
 * so each button switches to its working state the moment it's pressed.
 */
export function LibraryActions({
  token,
  initial,
  editions,
  t,
}: {
  token: string;
  initial: string;
  editions: { lang: string; name: string; title: string }[];
  t: LibraryLabels;
}) {
  const [edition, setEdition] = useState(initial);
  const [busy, setBusy] = useState<null | "read" | "download">(null);

  const open = (mode: "read" | "download") => {
    setBusy(mode);
    track(mode === "read" ? "book_read_open" : "book_download", { edition });
    const url = `/api/library/file?mode=${mode}&ed=${edition}&t=${encodeURIComponent(token)}`;
    if (mode === "read") window.open(url, "_blank", "noopener");
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- an API route that 302s to a file, not a page
    else window.location.href = url;
    window.setTimeout(() => setBusy(null), 4000);
  };

  const current = editions.find((e) => e.lang === edition) ?? editions[0];

  return (
    <div>
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-ink-4">{t.editionsLabel}</p>
      <div role="radiogroup" aria-label={t.editionsLabel} className="mt-2 grid grid-cols-3 gap-1.5 rounded-[18px] bg-slab-2 p-1.5 shadow-[inset_0_0_0_1px_var(--line)]">
        {editions.map((e) => (
          <button
            key={e.lang}
            type="button"
            role="radio"
            aria-checked={edition === e.lang}
            lang={e.lang}
            onClick={() => setEdition(e.lang)}
            className={`min-h-[44px] rounded-[14px] px-2 text-[0.92rem] font-semibold transition-colors active:scale-[0.97] ${
              edition === e.lang ? "bg-slab text-ink shadow-[0_0_0_1px_var(--line-2)]" : "text-ink-3 hover:text-ink"
            }`}
          >
            {e.name}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[0.86rem] text-ink-3" lang={current.lang}>
        {current.title}
      </p>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <button type="button" className="btn btn-primary btn-lg" onClick={() => open("read")} aria-busy={busy === "read"}>
          {busy === "read" ? (
            <>
              <span className="spinner" aria-hidden /> {t.opening}
            </>
          ) : (
            t.read
          )}
        </button>
        <button type="button" className="btn btn-ghost btn-lg" onClick={() => open("download")} aria-busy={busy === "download"}>
          {busy === "download" ? (
            <>
              <span className="spinner" aria-hidden /> {t.preparing}
            </>
          ) : (
            t.download
          )}
        </button>
      </div>
    </div>
  );
}
