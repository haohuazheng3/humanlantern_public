"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { reportClientError } from "@/instrumentation-client";
import { localePath, stripLocale } from "@/i18n/config";

const COPY = {
  en: { eyebrow: "Something broke", title: "That one’s on us.", body: "The error has been logged and we’ll look at it. Try again, or head back home.", reference: "Reference", retry: "Try again", home: "Home" },
  de: { eyebrow: "Etwas ist schiefgelaufen", title: "Das geht auf uns.", body: "Der Fehler wurde protokolliert und wir sehen ihn uns an. Versuch es noch einmal oder geh zur Startseite.", reference: "Referenz", retry: "Erneut versuchen", home: "Startseite" },
  ja: { eyebrow: "エラーが発生しました", title: "申し訳ありません。", body: "エラーは記録され、確認します。もう一度お試しいただくか、ホームにお戻りください。", reference: "参照番号", retry: "もう一度試す", home: "ホーム" },
};

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = stripLocale(usePathname() ?? "/");
  const c = COPY[lang];
  useEffect(() => {
    reportClientError(error, "error-boundary");
  }, [error]);

  return (
    <div className="px-3 pt-24 sm:px-5">
      <div className="slab mx-auto max-w-xl px-6 py-12 text-center sm:px-10">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="display mt-4 text-[2.2rem] text-ink">{c.title}</h1>
        <p className="mx-auto mt-4 max-w-sm text-[1rem] leading-relaxed text-ink-3">
          {c.body}
          {error.digest ? (
            <span className="mt-2 block text-[0.8rem] text-ink-4">
              {c.reference}: {error.digest}
            </span>
          ) : null}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" className="btn btn-primary" onClick={() => reset()}>
            {c.retry}
          </button>
          <Link href={localePath(lang, "/")} className="btn btn-ghost">
            {c.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
