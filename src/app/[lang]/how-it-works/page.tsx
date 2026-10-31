import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CtaSlab, PageHero, Section } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { book, chapterCount } from "@/content/book";
import { pageMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang, LANG_META } from "@/i18n/config";

export async function generateMetadata(props: PageProps<"/[lang]/how-it-works">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return pageMetadata({ lang, title: t.how.metaTitle, description: t.how.metaDescription, path: "/how-it-works" });
}

export default async function HowItWorksPage(props: PageProps<"/[lang]/how-it-works">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const h = t.how;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: h.title,
          inLanguage: LANG_META[lang].htmlLang,
          step: h.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.body })),
        }}
      />
      <PageHero eyebrow={h.eyebrow} title={h.title} lede={h.lede} />
      <Section className="!pt-12">
        <ol className="grid gap-4 md:grid-cols-2">
          {h.steps.map((s, i) => (
            <li key={s.title} className="slab p-6 sm:p-8">
              <span className="numeral text-[2.6rem] text-accent-text">{String(i + 1).padStart(2, "0")}</span>
              <p className="headline mt-3 text-[1.35rem] text-ink">{s.title}</p>
              <p className="mt-2 text-[0.99rem] leading-relaxed text-ink-3">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section className="!pt-10">
        <div className="slab-inset p-6 sm:p-8">
          <p className="headline text-[1.4rem] text-ink">{h.afterTitle}</p>
          <p className="mt-2 text-[1rem] leading-relaxed text-ink-3">{h.afterBody}</p>
        </div>
      </Section>
      <Section>
        <CtaSlab lang={lang} t={t} bookTitle={book(lang).title} chapters={chapterCount(lang)} />
      </Section>
    </>
  );
}
