import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, CtaSlab, PageHero, Section } from "@/components/ui";
import { SituationFinder } from "@/components/SituationFinder";
import { JsonLd } from "@/components/JsonLd";
import { book, chapterById, chapterCount } from "@/content/book";
import { finderData, finderLabels } from "@/lib/finder";
import { faqLd, pageMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang, localePath } from "@/i18n/config";
import { chapterLabel } from "@/i18n/format";

export async function generateMetadata(props: PageProps<"/[lang]/finder">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return pageMetadata({ lang, title: t.finder.metaTitle(finderData(lang).items.length), description: t.finder.metaDescription, path: "/finder" });
}

export default async function FinderPage(props: PageProps<"/[lang]/finder">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const b = book(lang);
  const finder = finderData(lang);
  const L = (p: string) => localePath(lang, p);
  // Every situation as a question + short answer: the page reads fully without JavaScript too.
  const qa = finder.items.map((s) => ({ s, ch: chapterById(lang, s.chapter) })).filter((x) => x.ch);

  return (
    <>
      <JsonLd data={faqLd(qa.map(({ s, ch }) => ({ q: s.thought, a: `${ch!.dek} ${ch!.truth}`.trim() })))} />
      <PageHero eyebrow={t.finder.eyebrow} title={t.finder.title} lede={t.finder.lede} />
      <Section className="!pt-10">
        <SituationFinder {...finder} t={finderLabels(lang)} bookHref={L("/book")} sampleHref={L("/book/sample")} />
      </Section>

      <Section>
        <h2 className="headline text-[1.8rem] text-ink sm:text-[2.2rem]">{t.finder.allTitle}</h2>
        <div className="mt-8 grid gap-6">
          {b.finder.groups.map((g, gi) => (
            <section key={g.name} className="slab p-6 sm:p-8">
              <h3 className="eyebrow eyebrow-accent">{g.name}</h3>
              <ul className="mt-4 divide-y divide-[var(--line)]">
                {finder.items
                  .filter((s) => s.group === gi)
                  .map((s) => {
                    const ch = chapterById(lang, s.chapter);
                    return (
                      <li key={s.slug} id={`q-${s.slug}`} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-6">
                        <a href={`#${s.slug}`} className="text-[1.02rem] font-semibold text-ink hover:underline">
                          “{s.thought}”
                        </a>
                        {ch ? (
                          <div className="text-[0.95rem] leading-relaxed text-ink-3">
                            <p>{ch.dek}</p>
                            <p className="mt-1 text-[0.85rem] text-ink-4">
                              {chapterLabel(lang, ch.id)} · {ch.title.replace(/\n/g, " ")} · {t.finder.onPage(ch.page).split("·")[0].trim()}
                            </p>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <Section>
        <CtaSlab lang={lang} t={t} bookTitle={b.title} chapters={chapterCount(lang)} />
        <Container>
          <p className="mt-6 text-center text-[0.9rem] text-ink-4">
            <Link href={L("/book/sample")} className="underline underline-offset-4 hover:text-ink-2">
              {t.buy.readSample}
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}
