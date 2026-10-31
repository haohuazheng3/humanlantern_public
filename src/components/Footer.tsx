import Link from "next/link";
import { LogoMark, Wordmark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { CookieSettingsLink, DoNotTrackLink } from "./Consent";
import { LangSwitcher } from "./LangSwitcher";
import { localePath, type Lang } from "@/i18n/config";
import { gap } from "@/i18n/format";
import type { Dict } from "@/i18n/dict/en";
import { SITE } from "@/lib/site";

export function Footer({ lang, t, bookTitle }: { lang: Lang; t: Dict; bookTitle: string }) {
  const f = t.footer;
  const L = (p: string) => localePath(lang, p);
  const cols = [
    {
      title: f.colBook,
      links: [
        { href: "/book", label: bookTitle },
        { href: "/book/sample", label: f.readSample },
        { href: "/finder", label: t.nav.finder },
        { href: "/pricing", label: f.pricing },
      ],
    },
    {
      title: f.colBrand,
      links: [
        { href: "/about", label: f.about },
        { href: "/how-it-works", label: f.howItWorks },
        { href: "/faq", label: t.nav.faq },
        { href: "/blog", label: f.allGuides },
        { href: "/contact", label: f.contact },
      ],
    },
    {
      title: f.colLegal,
      links: [
        { href: "/privacy", label: f.privacy },
        { href: "/terms", label: f.terms },
        { href: "/refund-policy", label: f.refund },
        { href: "/cookie-policy", label: f.cookies },
        ...(f.commerce ? [{ href: "/legal-notice", label: f.commerce }] : []),
      ],
    },
  ];

  return (
    <footer className="px-3 pb-6 pt-16 sm:px-5 sm:pt-24">
      <div className="slab mx-auto max-w-[1120px] px-6 py-10 sm:px-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href={L("/")} className="inline-flex items-center gap-2.5" aria-label={t.nav.logoLabel}>
              <LogoMark size={30} />
              <Wordmark className="text-[1.25rem]" />
            </Link>
            <p className="mt-4 max-w-sm text-[0.96rem] leading-relaxed text-ink-3">{f.blurb}</p>
            <p className="mt-5 text-[0.95rem] text-ink-2">
              <a href={`mailto:${SITE.email}`} className="underline decoration-line-2 underline-offset-4 hover:text-ink">
                {SITE.email}
              </a>
            </p>
            <p className="mt-1 text-[0.85rem] text-ink-4">{f.replyTime}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="eyebrow">{c.title}</p>
                <ul className="mt-3 space-y-1">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={L(l.href)} className="inline-flex min-h-[36px] items-center text-[0.94rem] text-ink-2 transition-colors hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr className="hairline my-8" />
        <div className="flex flex-col-reverse gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[0.85rem] text-ink-4">
            © {SITE.foundingYear} {SITE.name}. {f.notAdvice}
            {gap(lang)}
            <Link href={L("/terms")} className="underline underline-offset-4 hover:text-ink-2">
              {f.termsWord}
            </Link>
            {lang === "ja" ? "をご覧ください。" : "."}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <LangSwitcher lang={lang} path="/" label={t.nav.switchLanguage} className="inline-flex" />
            <DoNotTrackLink label={f.doNotTrack} offLabel={f.trackingOff} />
            <CookieSettingsLink label={f.cookieSettings} />
            <ThemeToggle t={f.theme} />
          </div>
        </div>
      </div>
    </footer>
  );
}
