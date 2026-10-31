import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "./JsonLd";
import { rich } from "./Rich";
import { breadcrumbLd } from "@/lib/seo";
import { localePath, type Lang } from "@/i18n/config";
import type { Dict } from "@/i18n/dict/en";
import type { Part } from "@/content/book";
import { BOOK } from "@/lib/site";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1120px] px-3 sm:px-5 ${className}`}>{children}</div>;
}

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 pt-20 sm:pt-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Section heading: lives in the void, deliberately quiet, so the slabs below carry the weight. */
export function SectionHead({ eyebrow, title, lede, align = "left" }: { eyebrow?: string; title: ReactNode; lede?: ReactNode; align?: "left" | "center" }) {
  return (
    <div className={`mb-8 sm:mb-10 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="headline mt-3 text-[1.9rem] text-ink sm:text-[2.4rem]">{title}</h2>
      {lede ? <p className="mt-3 text-[1.04rem] leading-relaxed text-ink-3">{lede}</p> : null}
    </div>
  );
}

export function PageHero({ eyebrow, title, lede, children }: { eyebrow?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <Container className="pt-12 sm:pt-20">
      <div className="max-w-3xl">
        {eyebrow ? <p className="eyebrow eyebrow-accent">{eyebrow}</p> : null}
        <h1 className="display mt-4 text-[2.5rem] text-ink sm:text-[3.6rem]">{title}</h1>
        {lede ? <p className="mt-5 max-w-2xl text-[1.12rem] leading-relaxed text-ink-3">{lede}</p> : null}
        {children}
      </div>
    </Container>
  );
}

export function Breadcrumbs({ items, compact = false }: { items: { name: string; path: string }[]; compact?: boolean }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-[0.85rem] text-ink-4">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((it, i) => (
            <li key={it.path} className={`items-center gap-1.5 ${compact && i === items.length - 1 ? "hidden sm:flex" : "flex"}`}>
              {i > 0 ? <span aria-hidden>/</span> : null}
              {i < items.length - 1 ? (
                <Link href={it.path} className="hover:text-ink-2">
                  {it.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink-3">
                  {it.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(items)} />
    </>
  );
}

export function FaqList({ faqs, lang }: { faqs: { q: string; a: string }[]; lang: Lang }) {
  return (
    <div className="slab divide-y divide-[var(--line)] px-2 sm:px-3">
      {faqs.map((f) => (
        <details key={f.q} className="group px-3 py-1 sm:px-4">
          <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-[1.04rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              aria-hidden
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slab-2 text-ink-3 transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-5 pr-10 text-[0.99rem] leading-relaxed text-ink-3">{rich(f.a, lang)}</p>
        </details>
      ))}
    </div>
  );
}

export function BuyButton({ lang, t, className = "", label, size = "lg" }: { lang: Lang; t: Dict; className?: string; label?: string; size?: "sm" | "lg" | "md" }) {
  return (
    <Link href={localePath(lang, "/checkout")} prefetch={false} className={`btn btn-primary ${size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : ""} ${className}`}>
      {label ?? t.buy.getBookPrice(BOOK.priceLabel)}
    </Link>
  );
}

/** The delivery promise, shown wherever someone is about to pay. */
export function DeliveryNote({ t, emailDelivery, className = "" }: { t: Dict; emailDelivery: boolean; className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-[0.85rem] leading-relaxed text-ink-3 ${className}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="mt-[3px] shrink-0 text-accent-text">
        <path d="M8 1.75v8.5M4.5 7l3.5 3.5L11.5 7M2.5 13.75h11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{emailDelivery ? t.buy.deliveryWithEmail : t.buy.delivery}</span>
    </p>
  );
}

export function TrustLine({ t, className = "" }: { t: Dict; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-[0.86rem] text-ink-3 ${className}`}>
      {t.buy.trust.map((x) => (
        <li key={x} className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="text-ok">
            <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {x}
        </li>
      ))}
    </ul>
  );
}

/** The always-dark closing slab: the lantern moment at the bottom of a page. */
export function CtaSlab({ lang, t, bookTitle, chapters, secondary }: { lang: Lang; t: Dict; bookTitle: string; chapters: number; secondary?: { href: string; label: string } }) {
  const alt = secondary ?? { href: localePath(lang, "/book/sample"), label: t.buy.readSample };
  return (
    <div className="slab-ink overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-140px] h-[280px] w-[520px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,138,61,0.28),transparent)] blur-2xl" />
      <p className="relative font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#ff9b57]">{bookTitle}</p>
      <h2 className="display relative mx-auto mt-4 max-w-2xl text-[2.1rem] text-[#f6f0e8] sm:text-[3rem] [&_em]:!text-[#ff9b57]">{rich(t.buy.ctaTitle, lang)}</h2>
      <p className="relative mx-auto mt-4 max-w-xl text-[1.04rem] leading-relaxed text-[#c9bfb2]">{t.buy.ctaBody(chapters, BOOK.priceLabel)}</p>
      <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <BuyButton lang={lang} t={t} />
        <Link href={alt.href} className="btn btn-lg !bg-white/10 !text-[#f6f0e8] hover:!bg-white/15">
          {alt.label}
        </Link>
      </div>
      <p className="relative mt-6 text-[0.82rem] text-[#a1968a]">{t.buy.ctaFoot(BOOK.refundDays)}</p>
    </div>
  );
}

export function PartsAccordion({ parts, t, openFirst = false }: { parts: Part[]; t: Dict; openFirst?: boolean }) {
  return (
    <div className="grid gap-3">
      {parts.map((p, i) => (
        <details key={p.n} className="slab group px-5 sm:px-7" open={openFirst && i === 0}>
          <summary className="flex min-h-[76px] cursor-pointer list-none items-center gap-4 py-4 [&::-webkit-details-marker]:hidden">
            <span className="numeral w-11 shrink-0 text-[2rem] text-ink-4">{String(p.n).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[1.08rem] font-semibold text-ink">{p.title}</span>
              <span className="mt-0.5 block text-[0.82rem] text-ink-3">
                {t.common.layers[p.layer]} · {t.common.chaptersN(p.chapters.length)}
              </span>
            </span>
            <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slab-2 text-ink-3 transition-transform duration-200 group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="pb-6 pl-0 sm:pl-[3.75rem]">
            <p className="max-w-2xl text-[0.98rem] leading-relaxed text-ink-3">{rich(p.intro)}</p>
            <ol className="mt-4 grid gap-1.5 sm:grid-cols-2">
              {p.chapters.map((c) => (
                <li key={c.id} className="flex gap-3 rounded-xl px-2 py-1.5 text-[0.95rem]">
                  <span className="w-10 shrink-0 font-semibold text-accent-text">{c.id}</span>
                  <span className="text-ink-2">{c.title.replace(/\n/g, " ")}</span>
                </li>
              ))}
            </ol>
          </div>
        </details>
      ))}
    </div>
  );
}

export function Principles({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((r, i) => (
        <div key={r.title} className="slab p-6 sm:p-7">
          <span className="numeral text-[2.4rem] text-accent-text">{String(i + 1).padStart(2, "0")}</span>
          <p className="headline mt-3 text-[1.35rem] text-ink">{r.title}</p>
          <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-3">{r.body}</p>
        </div>
      ))}
    </div>
  );
}
