import Link from "next/link";
import { Breadcrumbs, Container, CtaSlab, FaqList, Section } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { book, chapterById, chapterCount, thoughtSlug } from "@/content/book";
import type { Category } from "@/content/categories";
import { PILLARS } from "@/content/pillars";
import { rich } from "@/components/Rich";
import { PAGE_SIZE, postUrl, type Post } from "@/lib/blog";
import { absoluteUrl, faqLd } from "@/lib/seo";
import { getDict } from "@/i18n";
import { localePath, type Lang } from "@/i18n/config";

export function CategoryView({ cat, posts, page, lang }: { cat: Category; posts: Post[]; page: number; lang: Lang }) {
  const t = getDict(lang);
  const c = cat.copy[lang];
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const slice = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const base = localePath(lang, `/blog/${cat.slug}`);
  const pageHref = (n: number) => (n === 1 ? base : `${base}/page/${n}`);
  const b = book(lang);
  const finderItems = b.finder.groups
    .flatMap((g) => g.items)
    .map((it, i) => ({ ...it, slug: thoughtSlug(it.thought, i) }))
    .filter((it) => cat.chapters.includes(it.chapter))
    .slice(0, 6);
  // Pillar copy (answer, start-here guides, sections, FAQ) is English-only and sits on page 1.
  const pillar = lang === "en" && page === 1 && posts.length ? PILLARS[cat.slug] : undefined;
  const start = pillar ? pillar.start.map((s) => ({ ...s, post: posts.find((p) => p.slug === s.slug) })).filter((s) => s.post) : [];

  return (
    <>
      {slice.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: c.title,
            description: c.description,
            url: absoluteUrl(pageHref(page)),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: slice.map((p, i) => ({ "@type": "ListItem", position: (page - 1) * PAGE_SIZE + i + 1, url: absoluteUrl(postUrl(p)), name: p.title })),
            },
          }}
        />
      ) : null}
      <Container className="pt-10 sm:pt-14">
        <Breadcrumbs
          items={[
            { name: t.blog.eyebrow, path: localePath(lang, "/blog") },
            { name: c.name, path: base },
            ...(page > 1 ? [{ name: t.blog.pageN(page), path: pageHref(page) }] : []),
          ]}
        />
        <div className="mt-6 max-w-3xl">
          <p className="eyebrow eyebrow-accent">{c.name}</p>
          <h1 className="display mt-4 text-[2.3rem] text-ink sm:text-[3.3rem]">{c.title}</h1>
          <p className="mt-5 text-[1.1rem] leading-relaxed text-ink-3">{c.intro}</p>
        </div>
        {pillar ? (
          <div className="slab-inset mt-8 max-w-3xl px-5 py-5 sm:px-6">
            <p className="eyebrow eyebrow-accent">The short answer</p>
            <p className="mt-3 text-[1.06rem] leading-relaxed text-ink-2">{rich(pillar.answer, lang)}</p>
          </div>
        ) : null}
        {start.length ? (
          <div className="mt-8 max-w-3xl">
            <h2 className="headline text-[1.4rem] text-ink">Start here</h2>
            <ol className="mt-4 grid gap-3">
              {start.map((s, i) => (
                <li key={s.slug}>
                  <Link href={postUrl(s.post!)} className="slab slab-hover flex gap-4 px-5 py-4">
                    <span className="numeral text-[1.4rem] leading-none text-accent-text">{i + 1}</span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{s.post!.title}</span>
                      <span className="mt-1 block text-[0.94rem] text-ink-3">{s.why}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </Container>

      <Section className="!pt-12">
        {pillar && slice.length ? <h2 className="headline mb-5 text-[1.4rem] text-ink">All guides in {c.name}</h2> : null}
        {slice.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {slice.map((p) => (
              <Link key={postUrl(p)} href={postUrl(p)} className="slab slab-hover flex flex-col p-6 sm:p-7">
                <span className="headline text-[1.3rem] text-ink">{p.title}</span>
                <span className="mt-3 text-[0.96rem] leading-relaxed text-ink-3">{p.description}</span>
                <span className="mt-auto pt-5 text-[0.82rem] text-ink-4">
                  {t.blog.minRead(p.readingMinutes)} · {t.blog.updated} {p.updatedAt}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="slab-inset p-6 sm:p-8">
            <p className="text-[1.02rem] font-semibold text-ink">{t.blog.comingSoon}</p>
            <p className="mt-2 text-[0.98rem] text-ink-3">{t.blog.empty}</p>
          </div>
        )}

        {totalPages > 1 ? (
          <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className="btn btn-ghost btn-sm" rel="prev">
                ← {t.blog.newer}
              </Link>
            ) : null}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={pageHref(n)}
                aria-current={n === page ? "page" : undefined}
                className={`grid h-10 w-10 place-items-center rounded-full text-[0.92rem] font-semibold ${n === page ? "bg-ink text-void" : "bg-slab-2 text-ink-3 hover:text-ink"}`}
              >
                {n}
              </Link>
            ))}
            {page < totalPages ? (
              <Link href={pageHref(page + 1)} className="btn btn-ghost btn-sm" rel="next">
                {t.blog.older} →
              </Link>
            ) : null}
          </nav>
        ) : null}
      </Section>

      {pillar ? (
        <Section className="!pt-14">
          <div className="max-w-3xl">
            {pillar.sections.map((sec) => (
              <section key={sec.h2} className="mt-10 first:mt-0">
                <h2 className="headline text-[1.6rem] text-ink sm:text-[1.9rem]">{sec.h2}</h2>
                {sec.body.map((para, i) => (
                  <p key={i} className="mt-4 text-[1.04rem] leading-relaxed text-ink-2">
                    {rich(para, lang, { linkClass: "text-accent-text underline underline-offset-4" })}
                  </p>
                ))}
                {sec.bullets ? (
                  <ul className="mt-4 list-disc space-y-2 pl-6 text-[1.02rem] leading-relaxed text-ink-2">
                    {sec.bullets.map((b) => (
                      <li key={b}>{rich(b, lang)}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
            <h2 className="headline mt-12 text-[1.6rem] text-ink sm:text-[1.9rem]">Frequently asked questions</h2>
            <div className="mt-5">
              <FaqList faqs={pillar.faq} lang={lang} />
            </div>
            <JsonLd data={faqLd(pillar.faq)} />
          </div>
        </Section>
      ) : null}

      <Section className="!pt-14">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="slab p-6 sm:p-7">
            <p className="eyebrow">{t.blog.fromTheBook}</p>
            <ul className="mt-4 space-y-2">
              {cat.chapters.map((id) => {
                const ch = chapterById(lang, id);
                return ch ? (
                  <li key={id} className="flex gap-3 text-[0.95rem]">
                    <span className="w-10 shrink-0 font-semibold text-accent-text">{ch.id}</span>
                    <span className="text-ink-2">{ch.title.replace(/\n/g, " ")}</span>
                  </li>
                ) : null;
              })}
            </ul>
            <Link href={`${localePath(lang, "/book")}#contents`} className="mt-5 inline-flex min-h-[44px] items-center text-[0.95rem] font-semibold text-accent-text hover:underline">
              {t.home.seeAll(chapterCount(lang))}
            </Link>
          </div>
          {finderItems.length ? (
            <div className="slab p-6 sm:p-7">
              <p className="eyebrow">{t.finder.eyebrow}</p>
              <ul className="mt-4 space-y-4">
                {finderItems.map((s) => {
                  const ch = chapterById(lang, s.chapter);
                  return (
                    <li key={s.slug}>
                      <Link href={`${localePath(lang, "/finder")}#${s.slug}`} className="group block">
                        <span className="block text-[1rem] font-semibold text-ink group-hover:underline">{s.thought}</span>
                        {ch ? <span className="mt-1 line-clamp-2 block text-[0.9rem] text-ink-3">{ch.dek}</span> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      <Section>
        <CtaSlab lang={lang} t={t} bookTitle={b.title} chapters={chapterCount(lang)} />
      </Section>
    </>
  );
}
