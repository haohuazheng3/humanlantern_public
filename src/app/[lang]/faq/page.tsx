import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CtaSlab, FaqList, PageHero, Section } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { book, chapterCount } from "@/content/book";
import { faqLd, pageMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang, localePath } from "@/i18n/config";
import { gap } from "@/i18n/format";

export async function generateMetadata(props: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return pageMetadata({ lang, title: t.faqPage.metaTitle, description: t.faqPage.metaDescription, path: "/faq" });
}

export default async function FaqPage(props: PageProps<"/[lang]/faq">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  return (
    <>
      <JsonLd data={faqLd(t.faqs)} />
      <PageHero eyebrow={t.faqPage.eyebrow} title={t.faqPage.title}>
        <p className="mt-5 text-[1.08rem] text-ink-3">
          {t.faqPage.lede}
          {gap(lang)}
          <Link href={localePath(lang, "/contact")} className="text-accent-text underline underline-offset-4">
            {t.faqPage.ledeLink}
          </Link>
          {gap(lang)}
          {t.faqPage.ledeTail}
        </p>
      </PageHero>
      <Section className="!pt-10">
        <div className="mx-auto max-w-3xl">
          <FaqList faqs={t.faqs} lang={lang} />
        </div>
      </Section>
      <Section>
        <CtaSlab lang={lang} t={t} bookTitle={book(lang).title} chapters={chapterCount(lang)} />
      </Section>
    </>
  );
}
