import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CtaSlab, PageHero, Section } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { LogoMark } from "@/components/Logo";
import { book, chapterCount } from "@/content/book";
import { organizationLd, pageMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang } from "@/i18n/config";
import { gap, stop } from "@/i18n/format";
import { SITE } from "@/lib/site";

export async function generateMetadata(props: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return pageMetadata({ lang, title: t.about.metaTitle, description: t.about.metaDescription, path: "/about" });
}

export default async function AboutPage(props: PageProps<"/[lang]/about">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const a = t.about;
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", about: organizationLd(t.meta.siteDescription) }} />
      <PageHero eyebrow={a.eyebrow} title={a.title} />
      <Section className="!pt-12">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="slab p-7 sm:p-10">
            <div className="prose-book">
              {a.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className="slab-ink flex flex-col justify-between p-7 sm:p-9">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(255,138,61,0.3),transparent)] blur-2xl" />
            <div className="relative">
              <LogoMark size={56} mono className="text-[#f6f0e8]" />
              <p className="headline mt-6 text-[1.5rem] text-[#f6f0e8]">{a.nameTitle}</p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-[#d0c6ba]">{a.nameBody}</p>
            </div>
          </div>
        </div>
      </Section>
      <Section className="!pt-10">
        <div className="slab p-7 sm:p-9">
          <p className="eyebrow eyebrow-accent">{a.principlesTitle}</p>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {a.principles.map((p) => (
              <li key={p} className="flex gap-3 text-[1rem] leading-relaxed text-ink-2">
                <span aria-hidden className="mt-[0.55em] h-2 w-2 shrink-0 rounded-[2px] bg-accent" />
                {p}
              </li>
            ))}
          </ul>
          <hr className="hairline my-7" />
          <p className="text-[1rem] text-ink-3">
            {a.contactBody}
            {gap(lang)}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-accent-text underline underline-offset-4">
              {SITE.email}
            </a>
            {stop(lang)}
          </p>
        </div>
      </Section>
      <Section>
        <CtaSlab lang={lang} t={t} bookTitle={book(lang).title} chapters={chapterCount(lang)} />
      </Section>
    </>
  );
}
