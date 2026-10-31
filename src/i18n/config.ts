/**
 * Three editions of the site: English at the root, German under /de, Japanese under /ja.
 * Pages live once under app/[lang]; next.config rewrites unprefixed URLs to /en internally
 * (and redirects /en/* back to the root), so no middleware runs on public pages.
 */

export const LOCALES = ["en", "de", "ja"] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = "en";

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}

/** Path for a page in a given edition: `/book` → `/de/book`; English stays unprefixed. */
export function localePath(lang: Lang, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (lang === DEFAULT_LANG) return p;
  return p === "/" ? `/${lang}` : `/${lang}${p}`;
}

/** The unprefixed page path of a pathname from the browser: `/de/book` → `/book`. */
export function stripLocale(pathname: string): { lang: Lang; path: string } {
  const m = /^\/(en|de|ja)(?=\/|$)(.*)$/.exec(pathname);
  if (m) return { lang: m[1] as Lang, path: m[2] || "/" };
  return { lang: DEFAULT_LANG, path: pathname || "/" };
}

export const LANG_META: Record<Lang, { name: string; short: string; htmlLang: string; ogLocale: string; dateLocale: string; hreflang: string }> = {
  en: { name: "English", short: "EN", htmlLang: "en", ogLocale: "en_US", dateLocale: "en-US", hreflang: "en" },
  de: { name: "Deutsch", short: "DE", htmlLang: "de", ogLocale: "de_DE", dateLocale: "de-DE", hreflang: "de" },
  ja: { name: "日本語", short: "JA", htmlLang: "ja", ogLocale: "ja_JP", dateLocale: "ja-JP", hreflang: "ja" },
};

/** Stripe Checkout speaks the visitor's language too. */
export const STRIPE_LOCALE: Record<Lang, "en" | "de" | "ja"> = { en: "en", de: "de", ja: "ja" };
