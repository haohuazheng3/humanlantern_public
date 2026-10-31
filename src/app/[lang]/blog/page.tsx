import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs, Container, CtaSlab, Section } from "@/components/ui";
import { categoriesWithCounts, postUrl, publishedPosts } from "@/lib/blog";
import { categoryBySlug } from "@/content/categories";
import { book, chapterCount } from "@/content/book";
import { pageMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang, localePath } from "@/i18n/config";

export async function generateMetadata(props: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  // An empty hub is thin content: keep it out of the index until it has guides.
  return pageMetadata({ lang, title: t.blog.metaTitle, description: t.blog.metaDescription, path: "/blog", noindex: publishedPosts(lang).length === 0 });
}

export default async function BlogHub(props: PageProps<"/[lang]/blog">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const cats = categoriesWithCounts(lang);
  const posts = publishedPosts(lang);
  const featured = posts.filter((p) => p.featured).slice(0, 3);
  const latest = posts.slice(0, 6);

  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <Breadcrumbs
          items={[
            { name: t.common.home, path: localePath(lang, "/") },
            { name: t.blog.eyebrow, path: localePath(lang, "/blog") },
          ]}
        />
        <div className="mt-6 max-w-3xl">
          <p className="eyebrow eyebrow-accent">{t.blog.eyebrow}</p>
          <h1 className="display mt-4 text-[2.6rem] text-ink sm:text-[3.8rem]">{t.blog.title}</h1>
          <p className="mt-5 text-[1.12rem] leading-relaxed text-ink-3">{t.blog.lede}</p>
        </div>
      </Container>

      {featured.length ? (
        <Section className="!pt-14">
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((p) => (
              <Link key={postUrl(p)} href={postUrl(p)} className="slab slab-hover p-6">
                <span className="text-[0.8rem] font-semibold text-accent-text">{categoryBySlug(p.category)?.copy[lang].name}</span>
                <span className="headline mt-2 block text-[1.3rem] text-ink">{p.title}</span>
                <span className="mt-3 block text-[0.94rem] text-ink-3">{p.description}</span>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <Section className="!pt-14">
        <h2 className="eyebrow">{t.blog.topics}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((c) => (
            <Link key={c.slug} href={localePath(lang, `/blog/${c.slug}`)} className="slab slab-hover flex flex-col p-6">
              <span className="text-[1.08rem] font-semibold text-ink">{c.copy[lang].name}</span>
              <span className="mt-2 line-clamp-3 text-[0.92rem] leading-relaxed text-ink-3">{c.copy[lang].description}</span>
              <span className="mt-auto pt-4 text-[0.82rem] text-ink-4">{c.count ? t.blog.guidesN(c.count) : t.blog.comingSoon}</span>
            </Link>
          ))}
        </div>
        {!posts.length ? (
          <div className="slab-inset mt-6 p-6 sm:p-7">
            <p className="text-[1rem] leading-relaxed text-ink-2">{t.blog.empty}</p>
            <Link href={localePath(lang, "/finder")} className="btn btn-ghost btn-sm mt-4">
              {t.nav.finder} →
            </Link>
          </div>
        ) : null}
      </Section>

      {latest.length ? (
        <Section className="!pt-14">
          <div className="grid gap-4 md:grid-cols-2">
            {latest.map((p) => (
              <Link key={postUrl(p)} href={postUrl(p)} className="slab slab-hover p-6">
                <span className="text-[0.8rem] font-semibold text-accent-text">{categoryBySlug(p.category)?.copy[lang].name}</span>
                <span className="headline mt-2 block text-[1.25rem] text-ink">{p.title}</span>
                <span className="mt-3 line-clamp-2 block text-[0.94rem] text-ink-3">{p.description}</span>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <Section>
        <CtaSlab lang={lang} t={t} bookTitle={book(lang).title} chapters={chapterCount(lang)} />
      </Section>
    </>
  );
}
