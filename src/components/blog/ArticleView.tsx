import Link from "next/link";
import Image from "next/image";
import type { ComponentType, ReactNode } from "react";
import { Breadcrumbs, BuyButton, Container, FaqList } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { BookVisual } from "@/components/BookVisual";
import { BlockView } from "@/components/book/BookBlocks";
import { categoryBySlug } from "@/content/categories";
import { book, chapterById, chapterCount } from "@/content/book";
import { toolById, toolChapters } from "@/content/tools";
import { ToolRunner, type ChapterInfo } from "@/components/tools/ToolRunner";
import { CATALOG_ID, ToolCatalog } from "@/components/tools/ToolCatalog";
import { autolinkTerms, postUrl, relatedPosts, type Post } from "@/lib/blog";
import { renderMdx } from "@/lib/mdx";
import { articleLd, faqLd, webAppLd } from "@/lib/seo";
import { BOOK } from "@/lib/site";
import { getDict } from "@/i18n";
import { LANG_META, localePath, type Lang } from "@/i18n/config";
import { chapterLabel } from "@/i18n/format";
import type { Block } from "@/content/book";

function formatDate(iso: string, lang: Lang) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(LANG_META[lang].dateLocale, { year: "numeric", month: "long", day: "numeric" });
}

/*
 * MDX components available to articles (see content/blog/en/ai-and-jobs/article-template.mdx).
 * They reuse the book's own blocks, so a guide reads like a page of the book.
 */
function mdxComponents(lang: Lang): Record<string, ComponentType<Record<string, unknown>>> {
  const t = getDict(lang);
  const block = (b: Block) => <BlockView b={b} lang={lang} sourceLabel={t.sample.sources} />;
  const textOf = (children: ReactNode) => (typeof children === "string" ? children : "");
  const Evidence = ({ title, source, url, children }: { title: string; source?: string; url?: string; children: ReactNode }) => (
    <div className="not-prose">{block({ type: "evidence", title, text: textOf(children), source: source ? { cite: source, url } : undefined })}</div>
  );
  const Prompt = ({ title, children }: { title: string; children: ReactNode }) => <div className="not-prose">{block({ type: "prompt", title, text: textOf(children) })}</div>;
  const Drill = ({ title, children }: { title: string; children: ReactNode }) => <div className="not-prose">{block({ type: "drill", title, text: textOf(children) })}</div>;
  const Mistake = ({ title, children }: { title: string; children: ReactNode }) => <div className="not-prose">{block({ type: "mistake", title, text: textOf(children) })}</div>;
  const Compare = ({ left, right, rows }: { left: string; right: string; rows: [string, string][] }) => <div className="not-prose">{block({ type: "compare", left, right, rows })}</div>;
  const Say = ({ label, tone, lines }: { label: string; tone?: string; lines: { from: "them" | "you" | "note"; text: string }[] }) => (
    <div className="not-prose">{block({ type: "say", label, tone, lines })}</div>
  );
  const Truth = ({ children }: { children: ReactNode }) => (
    <div className="not-prose slab-ink my-8 px-5 py-5 sm:px-6">
      <div className="border-l-2 border-[#ff8a3d] pl-4">
        <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#ff9b57]">{t.finder.truth}</p>
        <p className="truth-line mt-2 text-[1.2rem] leading-snug text-[#f6f0e8]">{children}</p>
      </div>
    </div>
  );
  const Callout = ({ title, children }: { title?: string; children: ReactNode }) => (
    <aside className="not-prose slab-inset my-6 px-5 py-4 font-sans text-[0.98rem] leading-relaxed text-ink-2">
      {title ? <p className="mb-1 font-semibold text-ink">{title}</p> : null}
      {children}
    </aside>
  );
  /** A Pexels photo: Pexels' CDN does the resizing, so no image optimization runs on our side. */
  const Photo = ({ id, alt, credit, href, w = 1260, h = 840 }: { id: string; alt: string; credit: string; href: string; w?: number; h?: number }) => {
    const base = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb`;
    return (
      <figure className="not-prose my-8">
        {/* eslint-disable-next-line @next/next/no-img-element -- Pexels CDN serves the sizes; keeps Vercel image optimization out of the bill */}
        <img
          src={`${base}&w=960`}
          srcSet={`${base}&w=640 640w, ${base}&w=960 960w, ${base}&w=1280 1280w`}
          sizes="(max-width: 1024px) 92vw, 720px"
          alt={alt}
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-[22px] bg-slab-2"
        />
        <figcaption className="mt-2 px-1 font-sans text-[0.78rem] text-ink-4">
          Photo:{" "}
          <a href={href} rel="nofollow noopener" target="_blank" className="underline hover:text-ink-2">
            {credit}
          </a>{" "}
          · Pexels
        </figcaption>
      </figure>
    );
  };
  const BookCTA = ({ chapter }: { chapter?: string }) => <BookCard lang={lang} chapter={chapter} />;
  return { Evidence, Prompt, Drill, Mistake, Compare, Say, Truth, Callout, Photo, BookCTA } as unknown as Record<string, ComponentType<Record<string, unknown>>>;
}

function BookCard({ lang, chapter }: { lang: Lang; chapter?: string }) {
  const t = getDict(lang);
  const b = book(lang);
  const ch = chapter ? chapterById(lang, chapter) : undefined;
  return (
    <aside className="slab-ink not-prose my-8 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
      <div className="w-24 shrink-0">
        <BookVisual b={b} alt={b.title} sizes="96px" />
      </div>
      <div className="font-sans">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#ff9b57]">{ch ? `${chapterLabel(lang, ch.id)} · ${b.title}` : b.title}</p>
        <p className="mt-2 text-[1.05rem] font-semibold text-[#f6f0e8]">{ch ? ch.title.replace(/\n/g, " ") : b.subtitle}</p>
        {ch?.truth ? <blockquote className="truth-line mt-2 border-l-2 border-[#ff9b57]/60 pl-3 text-[0.98rem] leading-relaxed text-[#d8cec2]">{ch.truth}</blockquote> : null}
        <Link href={localePath(lang, "/book")} className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-[0.95rem] font-semibold text-[#ff9b57] hover:text-[#ffb27f]">
          {t.buy.getBookPrice(BOOK.priceLabel)} <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}

function VerdictCard({ answer, points, lang }: { answer: string; points: string[]; lang: Lang }) {
  const t = getDict(lang);
  return (
    <section aria-label={t.finder.shortAnswer} className="slab mt-8 p-5 sm:p-7">
      <p className="eyebrow eyebrow-accent">{t.finder.shortAnswer}</p>
      <p className="mt-3 text-[1.12rem] font-semibold leading-snug text-ink sm:text-[1.2rem]">{answer}</p>
      {points.length ? (
        <ul className="mt-4 space-y-2">
          {points.map((pt) => (
            <li key={pt} className="flex gap-3 text-[0.98rem] leading-relaxed text-ink-2">
              <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        <BuyButton lang={lang} t={t} size="md" />
        <Link href={localePath(lang, "/book/sample")} className="btn btn-ghost">
          {t.buy.readSample}
        </Link>
      </div>
    </section>
  );
}

export async function ArticleView({ post, preview = false }: { post: Post; preview?: boolean }) {
  const lang = post.lang;
  const t = getDict(lang);
  const cat = categoryBySlug(post.category)!;
  const catName = cat.copy[lang].name;
  const url = postUrl(post);
  const body = await renderMdx(post.body, { format: post.format, components: mdxComponents(lang), autolink: autolinkTerms(lang), self: url });
  const related = relatedPosts(post, 3);
  const chapter = post.chapters[0];
  const tool = toolById(post.tool);
  const catalog = tool?.kind === "generator" && tool.catalog ? tool : null;
  const toc = catalog ? [{ id: CATALOG_ID, text: catalog.catalog!.title }, ...post.headings] : post.headings;
  const chapterMap: Record<string, ChapterInfo> = {};
  if (tool) {
    for (const id of toolChapters(tool)) {
      const c = chapterById(lang, id);
      if (c) chapterMap[id] = { id: c.id, title: c.title.replace(/\n/g, " "), page: c.page, teaser: c.truth };
    }
  }
  const blogHref = localePath(lang, "/blog");
  const catHref = localePath(lang, `/blog/${cat.slug}`);
  const byline = (
    <>
      <span>
        <Link href={localePath(lang, "/about")} className="text-ink-3 hover:text-ink">
          Human Lantern
        </Link>
      </span>
      <span>
        {t.blog.published} <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time>
      </span>
      {post.updatedAt !== post.publishedAt ? (
        <span>
          {t.blog.updated} <time dateTime={post.updatedAt}>{formatDate(post.updatedAt, lang)}</time>
        </span>
      ) : null}
    </>
  );

  return (
    <>
      {!preview ? (
        <JsonLd data={[articleLd(post, url), ...(tool ? [webAppLd(tool.name, post.description, url, lang)] : []), ...(post.faq.length ? [faqLd(post.faq)] : [])]} />
      ) : null}
      <Container className="pt-10 sm:pt-14">
        {preview ? <p className="tag tag-accent mb-4">Preview · {post.draft ? "draft" : `scheduled ${post.publishedAt}`} · not public</p> : null}
        <Breadcrumbs
          compact={Boolean(tool)}
          items={[
            { name: t.blog.eyebrow, path: blogHref },
            { name: catName, path: catHref },
            { name: post.title, path: url },
          ]}
        />
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="min-w-0">
            <header className="max-w-3xl">
              <Link href={catHref} className="eyebrow eyebrow-accent hover:underline">
                {catName}
              </Link>
              <h1 className={`display text-ink ${tool ? "mt-3 text-[1.75rem] leading-[1.12] sm:text-[2.6rem]" : "mt-4 text-[2.3rem] sm:text-[3.2rem]"}`}>{post.title}</h1>
              {post.description && !tool ? <p className="dek mt-4 text-[1.2rem] leading-snug">{post.description}</p> : null}
              {!tool ? (
                <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[0.86rem] text-ink-4">
                  {byline}
                  <span>{t.blog.minRead(post.readingMinutes)}</span>
                </p>
              ) : null}
            </header>

            {tool ? (
              <>
                <div className="mt-5">
                  <ToolRunner tool={tool} chapters={chapterMap} price={BOOK.priceLabel} base={lang === "en" ? "" : `/${lang}`} />
                </div>
                {post.description ? <p className="dek mt-8 max-w-3xl text-[1.12rem] leading-snug">{post.description}</p> : null}
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.86rem] text-ink-4">{byline}</p>
              </>
            ) : null}

            {post.verdict ? <VerdictCard answer={post.verdict.answer} points={post.verdict.points} lang={lang} /> : null}

            {post.image && !tool && !post.verdict ? (
              <figure className="slab mt-8 overflow-hidden p-2">
                <Image
                  src={post.image.src}
                  alt={post.image.alt}
                  width={post.image.width ?? 1600}
                  height={post.image.height ?? 1000}
                  priority
                  sizes="(max-width: 1024px) 100vw, 780px"
                  className="h-auto w-full rounded-[22px]"
                />
                {post.image.credit ? (
                  <figcaption className="px-3 pb-1 pt-2 text-[0.78rem] text-ink-4">
                    Photo:{" "}
                    {post.image.creditUrl ? (
                      <a href={post.image.creditUrl} rel="nofollow noopener" target="_blank" className="underline">
                        {post.image.credit}
                      </a>
                    ) : (
                      post.image.credit
                    )}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            {toc.length >= 3 ? (
              <nav aria-label={t.blog.onThisPage} className="slab-inset mt-8 p-5 lg:hidden">
                <p className="eyebrow">{t.blog.onThisPage}</p>
                <ol className="mt-2 space-y-1 text-[0.95rem]">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-ink-3 hover:text-ink">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            {catalog ? <ToolCatalog tool={catalog} /> : null}

            <div className="slab mt-8 px-5 py-8 sm:px-10 sm:py-12">
              <div className="prose-book">{body}</div>
            </div>

            {post.faq.length ? (
              <section className="mt-10" aria-labelledby="faq">
                <h2 id="faq" className="headline mb-5 text-[1.7rem] text-ink">
                  {t.blog.faq}
                </h2>
                <FaqList faqs={post.faq} lang={lang} />
              </section>
            ) : null}

            <BookCard lang={lang} chapter={chapter} />

            {related.length ? (
              <section className="mt-10" aria-labelledby="related">
                <h2 id="related" className="eyebrow">
                  {t.blog.related}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {related.map((r) => (
                    <Link key={postUrl(r)} href={postUrl(r)} className="slab slab-hover p-5">
                      <span className="text-[0.78rem] font-semibold text-accent-text">{categoryBySlug(r.category)?.copy[lang].name}</span>
                      <span className="mt-2 block text-[1.02rem] font-semibold leading-snug text-ink">{r.title}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              {toc.length >= 3 ? (
                <nav aria-label={t.blog.onThisPage} className="slab p-5">
                  <p className="eyebrow">{t.blog.onThisPage}</p>
                  <ol className="mt-3 space-y-1.5 text-[0.9rem]">
                    {toc.map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="block rounded-lg px-2 py-1 text-ink-3 hover:bg-slab-2 hover:text-ink">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}
              <div className="slab p-5">
                <p className="text-[0.95rem] font-semibold text-ink">{book(lang).title}</p>
                <p className="mt-1 text-[0.86rem] text-ink-3">{t.common.chaptersN(chapterCount(lang))}</p>
                <BuyButton lang={lang} t={t} size="md" className="btn-block mt-4" />
                <Link href={localePath(lang, "/book/sample")} className="btn btn-quiet btn-sm btn-block mt-2">
                  {t.buy.readSample}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
