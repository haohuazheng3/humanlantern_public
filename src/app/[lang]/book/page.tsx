import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookVisual, LookInside } from "@/components/BookVisual";
import { BuyButton, Container, CtaSlab, DeliveryNote, FaqList, PartsAccordion, Principles, Section, SectionHead, TrustLine } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { CheckoutNotice } from "@/components/CheckoutNotice";
import { BlockView } from "@/components/book/BookBlocks";
import { rich } from "@/components/Rich";
import { book, chapterCount } from "@/content/book";
import { bookLd, breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang, localePath } from "@/i18n/config";
import { gap } from "@/i18n/format";
import { BOOK } from "@/lib/site";
import { emailDeliveryEnabled } from "@/lib/delivery";

export async function generateMetadata(props: PageProps<"/[lang]/book">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  const b = book(lang);
  return pageMetadata({ lang, title: t.book.metaTitle(b.title), description: t.book.metaDescription(chapterCount(lang), BOOK.priceLabel), path: "/book", image: `/og/${lang}/book` });
}

const TOOL_BAR: Record<string, string> = {
  evidence: "bg-info",
  prompt: "bg-accent",
  say: "bg-accent-2",
  drill: "bg-ok",
  mistake: "bg-bad",
  truth: "bg-ink",
};

export default async function BookPage(props: PageProps<"/[lang]/book">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const k = t.book;
  const b = book(lang);
  const L = (p: string) => localePath(lang, p);
  const chapters = chapterCount(lang);
  const faqs = t.faqs.filter((f) => f.tags.includes("buying"));
  const opening = b.readFirst.blocks.filter((x) => x.type === "p").slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          ...bookLd({ lang, title: b.title, subtitle: b.subtitle, pages: b.pages, description: t.book.metaDescription(chapters, BOOK.priceLabel), cover: b.cover.png }),
          faqLd(faqs),
          breadcrumbLd([
            { name: t.common.home, path: L("/") },
            { name: t.nav.book, path: L("/book") },
          ]),
        ]}
      />
      <Suspense fallback={null}>
        <CheckoutNotice lang={lang} t={{ cancelled: k.cancelled, tryAgain: k.tryAgain, dismiss: k.dismiss }} />
      </Suspense>

      {/* ---------- Hero ---------- */}
      <Container className="pt-10 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <BookVisual b={b} alt={`${b.title}: ${b.subtitle}`} priority className="mx-auto w-[64%] max-w-[360px] lg:w-full" sizes="(max-width: 1024px) 64vw, 400px" />
          <div className="min-w-0">
            <p className="eyebrow eyebrow-accent">{k.eyebrow}</p>
            <h1 className="display mt-4 text-[2.6rem] text-ink sm:text-[3.8rem]">{b.title}</h1>
            <p className="dek mt-4 text-[1.25rem]">{b.subtitle}</p>
            <ul className="mt-6 grid gap-2.5">
              {b.coverCopy.promises.map((p) => (
                <li key={p} className="flex gap-3 text-[1.02rem] text-ink-2">
                  <span aria-hidden className="mt-[0.5em] h-2 w-2 shrink-0 rounded-[2px] bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="slab mt-8 p-5 sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[0.85rem] text-ink-3">{k.priceNote}</p>
                  <p className="numeral text-[2.9rem] !font-medium text-ink">{BOOK.priceLabel}</p>
                </div>
                <p className="text-right text-[0.85rem] text-ink-3">
                  {k.format(b.pages)}
                  <br />
                  {k.formatLine2(chapters, b.parts.length)}
                </p>
              </div>
              <p className="mt-3 rounded-2xl bg-slab-2 px-4 py-2.5 text-[0.88rem] text-ink-2">{k.editions}</p>
              <BuyButton lang={lang} t={t} className="btn-block mt-4" label={t.buy.getBookNow} />
              <TrustLine t={t} className="mt-4 justify-center" />
              <DeliveryNote t={t} emailDelivery={emailDeliveryEnabled()} className="mt-4" />
            </div>
          </div>
        </div>
      </Container>

      {/* ---------- Opening page ---------- */}
      <Section>
        <div className="slab mx-auto max-w-3xl px-6 py-10 sm:px-12 sm:py-14">
          <p className="eyebrow">{k.openingEyebrow}</p>
          <h2 className="display mt-4 text-[2.2rem] text-ink sm:text-[2.8rem]">{b.readFirst.title}</h2>
          <div className="prose-book mt-6">
            {opening.map((x, i) => (
              <BlockView key={i} b={x} lang={lang} sourceLabel={t.sample.sources} />
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- Look inside ---------- */}
      {b.lookInside.length ? (
        <Section>
          <SectionHead eyebrow={k.lookEyebrow} title={k.lookTitle} lede={k.lookLede} />
          <LookInside b={b} caption={k.lookCaption} />
        </Section>
      ) : null}

      {/* ---------- Tools ---------- */}
      <Section>
        <SectionHead eyebrow={k.toolsEyebrow} title={k.toolsTitle} lede={b.howToUse.intro} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {b.howToUse.tools.map((tool) => (
            <div key={tool.name} className="slab relative overflow-hidden p-6">
              <span aria-hidden className={`absolute inset-y-6 left-0 w-[3px] rounded-r-full ${TOOL_BAR[tool.type] ?? "bg-accent"}`} />
              <p className="text-[1.08rem] font-semibold text-ink">{tool.name}</p>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-ink-3">{rich(tool.text, lang)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Contents ---------- */}
      <Section id="contents">
        <SectionHead eyebrow={k.contentsEyebrow} title={k.contentsTitle(b.parts.length, chapters)} lede={k.contentsLede} />
        <PartsAccordion parts={b.parts} t={t} openFirst />
      </Section>

      {/* ---------- For / not for ---------- */}
      <Section>
        <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
          <div className="slab p-7 sm:p-9">
            <p className="eyebrow eyebrow-accent">{k.forTitle}</p>
            <ul className="mt-5 space-y-3">
              {k.for.map((f) => (
                <li key={f} className="flex gap-3 text-[1rem] text-ink-2">
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="mt-1 shrink-0 text-ok">
                    <path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="slab p-7 sm:p-9">
            <p className="eyebrow">{k.notForTitle}</p>
            <ul className="mt-5 space-y-3">
              {k.notFor.map((f) => (
                <li key={f} className="flex gap-3 text-[1rem] text-ink-3">
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="mt-1 shrink-0 text-bad">
                    <path d="M5 5l8 8M13 5l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow={t.home.principlesEyebrow} title={t.home.principlesTitle} />
        <Principles items={t.home.principles} />
      </Section>

      <Section>
        <SectionHead eyebrow={k.buyingEyebrow} title={k.buyingTitle} />
        <FaqList faqs={faqs} lang={lang} />
        <p className="mt-5 text-[0.92rem] text-ink-4">
          {k.notSure}
          {gap(lang)}
          <Link href={L("/book/sample")} className="text-ink-3 underline underline-offset-4 hover:text-ink">
            {k.notSureLink}
          </Link>
          {lang === "ja" ? "。" : " "}
          {k.notSureTail}
        </p>
      </Section>

      <Section>
        <CtaSlab lang={lang} t={t} bookTitle={b.title} chapters={chapters} />
      </Section>
    </>
  );
}
