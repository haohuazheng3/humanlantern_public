import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs, Container, CtaSlab, Section } from "@/components/ui";
import { ChapterView } from "@/components/book/BookBlocks";
import { rich } from "@/components/Rich";
import { book, chapterCount } from "@/content/book";
import { pageMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang, localePath } from "@/i18n/config";

export async function generateMetadata(props: PageProps<"/[lang]/book/sample">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return pageMetadata({ lang, title: t.sample.metaTitle(book(lang).sample.chapters.length), description: t.sample.metaDescription, path: "/book/sample" });
}

/** Free sample: all of Part 1, rendered from the same data as the book's pages. */
export default async function SamplePage(props: PageProps<"/[lang]/book/sample">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const b = book(lang);
  const part = b.parts[0];
  const chapters = b.sample.chapters;
  const L = (p: string) => localePath(lang, p);
  const labels = { chapter: t.common.chapter, truth: t.finder.truth, source: t.sample.sources };

  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <Breadcrumbs
          items={[
            { name: t.common.home, path: L("/") },
            { name: t.nav.book, path: L("/book") },
            { name: t.nav.sample, path: L("/book/sample") },
          ]}
        />
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <p className="eyebrow eyebrow-accent">{t.sample.eyebrow}</p>
            <h1 className="display mt-4 text-[2.5rem] text-ink sm:text-[3.6rem]">{part.title}</h1>
            <p className="dek mt-4 max-w-2xl text-[1.2rem] leading-snug">{rich(part.intro, lang)}</p>
            <p className="mt-4 text-[0.95rem] text-ink-4">{t.sample.lede}</p>
          </div>
          <nav aria-label={t.sample.contents} className="slab h-fit p-5">
            <p className="eyebrow">{t.sample.contents}</p>
            <ol className="mt-3 space-y-1 text-[0.92rem]">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#chapter-${c.id}`} className="flex gap-3 rounded-lg px-2 py-1.5 text-ink-3 hover:bg-slab-2 hover:text-ink">
                    <span className="w-8 shrink-0 font-semibold text-accent-text">{c.id}</span>
                    <span>{c.title.replace(/\n/g, " ")}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </Container>

      <Section className="!pt-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 sm:gap-8">
          {chapters.map((c) => (
            <ChapterView key={c.id} c={c} lang={lang} labels={labels} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="headline text-[1.8rem] text-ink sm:text-[2.2rem]">{t.sample.endTitle}</p>
          <p className="mx-auto mt-3 max-w-xl text-[1.02rem] leading-relaxed text-ink-3">{t.sample.endBody(chapterCount(lang))}</p>
        </div>
        <div className="mt-10">
          <CtaSlab lang={lang} t={t} bookTitle={b.title} chapters={chapterCount(lang)} secondary={{ href: `${L("/book")}#contents`, label: t.home.seeAll(chapterCount(lang)) }} />
        </div>
        <p className="mt-6 text-center text-[0.9rem] text-ink-4">
          <Link href={L("/finder")} className="underline underline-offset-4 hover:text-ink-2">
            {t.nav.finder}
          </Link>
        </p>
      </Section>
    </>
  );
}
