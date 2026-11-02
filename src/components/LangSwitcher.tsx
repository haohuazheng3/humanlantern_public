import Link from "next/link";
import { LANG_META, LOCALES, localePath, type Lang } from "@/i18n/config";

/** Pages that exist in only one edition fall back to that edition's equivalent hub. */
function targetPath(path: string, to: Lang): string {
  if (/^\/blog\/[^/]+\/.+/.test(path)) return "/blog"; // articles are per-language
  if (path === "/legal-notice" && to !== "ja") return "/terms"; // 特定商取引法に基づく表記 is Japanese only
  return path;
}

/**
 * Edition switch: plain links to the same page in the other languages, so it works
 * before hydration, for crawlers, and without any client state.
 */
export function LangSwitcher({ lang, path, label, className = "", variant = "pill" }: { lang: Lang; path: string; label: string; className?: string; variant?: "pill" | "row" }) {
  // The success page needs its ?session_id, which a plain link can't carry: buyers switch editions
  // with the picker on the page itself, so the header switch steps aside there.
  if (path === "/checkout/success") return null;
  const target = (l: Lang) => targetPath(path, l);
  if (variant === "row") {
    return (
      <div role="group" aria-label={label} className={`grid grid-cols-3 gap-1.5 ${className}`}>
        {LOCALES.map((l) => (
          <Link
            key={l}
            href={localePath(l, target(l))}
            hrefLang={LANG_META[l].hreflang}
            lang={LANG_META[l].htmlLang}
            aria-current={l === lang ? "true" : undefined}
            className={`flex min-h-[44px] items-center justify-center rounded-2xl text-[0.95rem] font-medium active:scale-[0.97] ${
              l === lang ? "bg-slab-3 text-ink shadow-[inset_0_0_0_1px_var(--line-2)]" : "bg-slab-2 text-ink-3"
            }`}
          >
            {LANG_META[l].name}
          </Link>
        ))}
      </div>
    );
  }
  return (
    <div role="group" aria-label={label} className={`items-center rounded-full bg-slab-2 p-1 shadow-[inset_0_0_0_1px_var(--line)] ${className}`}>
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={localePath(l, target(l))}
          hrefLang={LANG_META[l].hreflang}
          lang={LANG_META[l].htmlLang}
          title={LANG_META[l].name}
          aria-current={l === lang ? "true" : undefined}
          className={`inline-flex min-h-[32px] min-w-[36px] items-center justify-center rounded-full px-2 text-[0.78rem] font-semibold tracking-[0.04em] transition-colors active:scale-95 ${
            l === lang ? "bg-slab text-ink shadow-[0_0_0_1px_var(--line-2)]" : "text-ink-3 hover:text-ink"
          }`}
        >
          {LANG_META[l].short}
        </Link>
      ))}
    </div>
  );
}
