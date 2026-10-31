import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AiHook } from "@/components/AiHook";
import { BookVisual } from "@/components/BookVisual";
import { SituationFinder } from "@/components/SituationFinder";
import { finderData, finderLabels } from "@/lib/finder";
import { BuyButton, Container, CtaSlab, FaqList, Principles, Section, SectionHead, TrustLine } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { rich } from "@/components/Rich";
import { book, chapterCount } from "@/content/book";
import { publishedPosts, postUrl } from "@/lib/blog";
import { categoryBySlug } from "@/content/categories";
import { faqLd, organizationLd, pageMetadata, websiteLd } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang, localePath } from "@/i18n/config";
import { chapterLabel, gap } from "@/i18n/format";
import { BOOK } from "@/lib/site";

export async function generateMetadata(props: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return pageMetadata({ lang, title: t.home.metaTitle, absoluteTitle: true, description: t.home.metaDescription, path: "/" });
}

export default async function HomePage(props: PageProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const h = t.home;
  const b = book(lang);
  const L = (p: string) => localePath(lang, p);
  const faqs = t.faqs.filter((f) => f.tags.includes("book") || f.tags.includes("buying")).slice(0, 5);
  const posts = publishedPosts(lang).slice(0, 6);
  const part1 = b.parts[0];
  const finder = finderData(lang);
  const firstSlug = finder.items[0]?.slug;

  return (
    <>
      <JsonLd data={[organizationLd(t.meta.siteDescription), websiteLd(lang), faqLd(faqs)]} />

      {/* ---------- Hero ---------- */}
      <Container className="pt-10 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow eyebrow-accent">{h.eyebrow}</p>
            <h1 className="display mt-5 text-[2.75rem] text-ink sm:text-[4.2rem] lg:text-[4.6rem]">{rich(h.h1, lang)}</h1>
            <p className="mt-6 max-w-xl text-[1.12rem] leading-relaxed text-ink-3 sm:text-[1.2rem]">{h.lede}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BuyButton lang={lang} t={t} />
              <Link href={L("/book/sample")} className="btn btn-ghost btn-lg">
                {h.sampleCta}
              </Link>
            </div>
            <TrustLine t={t} className="mt-6" />
          </div>
          <AiHook t={h.chat} href={`${L("/finder")}${firstSlug ? `#${firstSlug}` : ""}`} className="lg:animate-float" />
        </div>
      </Container>

      {/* ---------- Situation Finder ---------- */}
      <Section id="finder">
        <SectionHead eyebrow={h.finderEyebrow} title={h.finderTitle} lede={h.finderLede} />
        <SituationFinder {...finder} t={finderLabels(lang)} bookHref={L("/book")} sampleHref={L("/book/sample")} />
        <p className="mt-5 text-[0.92rem] text-ink-4">
          {h.finderMore(finder.items.length)}
          {gap(lang)}
          <Link href={L("/finder")} className="text-ink-3 underline underline-offset-4 hover:text-ink">
            {h.finderAll}
          </Link>
        </p>
      </Section>

      {/* ---------- The eight truths ---------- */}
      <Section>
        <SectionHead eyebrow={h.truthsEyebrow} title={h.truthsTitle} lede={h.truthsLede} />
        {/* phones: one swipeable row of floating cards; larger screens: a grid */}
        <div className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {part1.chapters.map((c) => (
            <Link key={c.id} href={`${L("/book/sample")}#chapter-${c.id}`} className="slab slab-hover flex w-[78%] shrink-0 snap-start flex-col p-6 sm:w-auto">
              <span className="text-[0.8rem] font-semibold text-accent-text">{chapterLabel(lang, c.id)}</span>
              <span className="headline mt-3 text-[1.22rem] text-ink">{c.title.replace(/\n/g, " ")}</span>
              <span className="truth-line mt-auto pt-6 text-[0.95rem] leading-relaxed text-ink-3">{c.truth}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* ---------- Two layers ---------- */}
      <Section>
        <SectionHead eyebrow={h.layersEyebrow} title={h.layersTitle} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="slab p-7 sm:p-9">
            <p className="eyebrow eyebrow-accent">{t.common.layers.field}</p>
            <p className="headline mt-3 text-[1.6rem] text-ink">{h.fieldTitle}</p>
            <p className="mt-3 text-[1rem] leading-relaxed text-ink-3">{h.fieldBody}</p>
            <p className="mt-5 text-[0.88rem] text-ink-4">{h.fieldParts}</p>
          </div>
          <div className="slab p-7 sm:p-9">
            <p className="eyebrow eyebrow-accent">{t.common.layers.clear}</p>
            <p className="headline mt-3 text-[1.6rem] text-ink">{h.clearTitle}</p>
            <p className="mt-3 text-[1rem] leading-relaxed text-ink-3">{h.clearBody}</p>
            <p className="mt-5 text-[0.88rem] text-ink-4">{h.clearParts}</p>
          </div>
        </div>
      </Section>

      {/* ---------- The book ---------- */}
      <Section>
        <div className="slab overflow-hidden p-6 sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <BookVisual b={b} alt={`${b.title}: ${b.subtitle}`} className="mx-auto w-[66%] max-w-[320px] lg:w-full" />
            <div className="min-w-0">
              <p className="eyebrow eyebrow-accent">{h.bookEyebrow(BOOK.edition)}</p>
              <h2 className="display mt-4 text-[2.3rem] text-ink sm:text-[3rem]">{b.title}</h2>
              <p className="dek mt-3 text-[1.2rem]">{b.subtitle}</p>
              <ul className="mt-6 grid gap-2.5">
                {b.coverCopy.promises.map((p) => (
                  <li key={p} className="flex gap-3 text-[1rem] text-ink-2">
                    <span aria-hidden className="mt-[0.5em] h-2 w-2 shrink-0 rounded-[2px] bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <BuyButton lang={lang} t={t} />
                <Link href={`${L("/book")}#contents`} className="btn btn-quiet btn-lg">
                  {h.seeAll(chapterCount(lang))}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Guides (only once published) ---------- */}
      {posts.length > 0 ? (
        <Section>
          <SectionHead eyebrow={h.guidesEyebrow} title={h.guidesTitle} />
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={postUrl(p)} href={postUrl(p)} className="slab slab-hover flex flex-col p-6">
                <span className="text-[0.8rem] font-semibold text-accent-text">{categoryBySlug(p.category)?.copy[lang].name}</span>
                <span className="headline mt-2 text-[1.2rem] text-ink">{p.title}</span>
                <span className="mt-3 line-clamp-3 text-[0.94rem] text-ink-3">{p.description}</span>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ---------- Three promises ---------- */}
      <Section>
        <SectionHead eyebrow={h.principlesEyebrow} title={h.principlesTitle} lede={h.principlesLede} />
        <Principles items={h.principles} />
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section>
        <SectionHead eyebrow={h.faqEyebrow} title={h.faqTitle} />
        <FaqList faqs={faqs} lang={lang} />
        <p className="mt-5 text-[0.92rem] text-ink-4">
          {h.faqMore}
          {gap(lang)}
          <Link href={L("/faq")} className="text-ink-3 underline underline-offset-4 hover:text-ink">
            {h.faqLink}
          </Link>
          {lang === "ja" ? "。" : "."}
        </p>
      </Section>

      <Section>
        <CtaSlab lang={lang} t={t} bookTitle={b.title} chapters={chapterCount(lang)} />
      </Section>
    </>
  );
}
