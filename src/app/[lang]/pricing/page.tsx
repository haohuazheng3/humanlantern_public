import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BuyButton, CtaSlab, DeliveryNote, FaqList, PageHero, Section, SectionHead, TrustLine } from "@/components/ui";
import { BookVisual } from "@/components/BookVisual";
import { JsonLd } from "@/components/JsonLd";
import { book, chapterCount } from "@/content/book";
import { bookLd, faqLd, pageMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang } from "@/i18n/config";
import { BOOK } from "@/lib/site";
import { emailDeliveryEnabled } from "@/lib/delivery";

export async function generateMetadata(props: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return pageMetadata({ lang, title: t.pricing.metaTitle, description: t.pricing.metaDescription(BOOK.priceLabel, BOOK.refundDays), path: "/pricing" });
}

export default async function PricingPage(props: PageProps<"/[lang]/pricing">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const p = t.pricing;
  const b = book(lang);
  const chapters = chapterCount(lang);
  const faqs = t.faqs.filter((f) => f.tags.includes("buying"));
  return (
    <>
      <JsonLd data={[...bookLd({ lang, title: b.title, subtitle: b.subtitle, pages: b.pages, description: b.subtitle, cover: b.cover.png }), faqLd(faqs)]} />
      <PageHero eyebrow={p.eyebrow} title={p.title} lede={p.lede} />
      <Section className="!pt-12">
        <div className="slab overflow-hidden p-6 sm:p-10">
          <div className="grid items-center gap-10 md:grid-cols-[0.7fr_1.3fr]">
            <BookVisual b={b} alt={b.title} className="mx-auto w-[56%] max-w-[260px] md:w-full" sizes="260px" />
            <div className="min-w-0">
              <p className="text-[1.05rem] font-semibold text-ink">{b.title}</p>
              <p className="numeral mt-2 text-[3.4rem] !font-medium text-ink">{BOOK.priceLabel}</p>
              <p className="text-[0.88rem] text-ink-4">{t.common.oneTime} · {t.common.usd}</p>
              <p className="mt-6 eyebrow">{p.includedTitle}</p>
              <ul className="mt-3 grid gap-2">
                {p.included(chapters).map((x) => (
                  <li key={x} className="flex gap-3 text-[0.98rem] text-ink-2">
                    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="mt-0.5 shrink-0 text-ok">
                      <path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {x}
                  </li>
                ))}
              </ul>
              <BuyButton lang={lang} t={t} className="btn-block mt-7 sm:w-auto" label={t.buy.getBookNow} />
              <TrustLine t={t} className="mt-4" />
              <DeliveryNote t={t} emailDelivery={emailDeliveryEnabled()} className="mt-4" />
            </div>
          </div>
        </div>
      </Section>
      <Section className="!pt-10">
        <div className="slab-inset p-6 sm:p-8">
          <p className="headline text-[1.4rem] text-ink">{p.guaranteeTitle(BOOK.refundDays)}</p>
          <p className="mt-2 text-[1rem] leading-relaxed text-ink-3">{p.guaranteeBody(BOOK.refundDays)}</p>
        </div>
      </Section>
      <Section>
        <SectionHead title={p.faqTitle} />
        <FaqList faqs={faqs} lang={lang} />
      </Section>
      <Section>
        <CtaSlab lang={lang} t={t} bookTitle={b.title} chapters={chapters} />
      </Section>
    </>
  );
}
