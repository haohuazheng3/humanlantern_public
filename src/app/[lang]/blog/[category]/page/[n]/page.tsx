import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryView } from "@/components/blog/CategoryView";
import { CATEGORIES, categoryBySlug } from "@/content/categories";
import { PAGE_SIZE, postsInCategory } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { isLang, type Lang } from "@/i18n/config";

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const lang = (isLang(params.lang) ? params.lang : "en") as Lang;
  const out: { category: string; n: string }[] = [];
  for (const c of CATEGORIES) {
    const pages = Math.ceil(postsInCategory(lang, c.slug).length / PAGE_SIZE);
    for (let n = 2; n <= pages; n++) out.push({ category: c.slug, n: String(n) });
  }
  // Next requires at least one entry to prerender; a sentinel that 404s keeps the route valid while every hub fits on one page.
  return out.length ? out : [{ category: CATEGORIES[0].slug, n: "2" }];
}

export async function generateMetadata(props: PageProps<"/[lang]/blog/[category]/page/[n]">): Promise<Metadata> {
  const { lang, category, n } = await props.params;
  const cat = categoryBySlug(category);
  if (!cat || !isLang(lang)) return {};
  const c = cat.copy[lang];
  return pageMetadata({ lang, title: `${c.title} (${n})`, description: c.description, path: `/blog/${cat.slug}/page/${n}`, allEditions: false });
}

export default async function CategoryPaged(props: PageProps<"/[lang]/blog/[category]/page/[n]">) {
  const { lang, category, n } = await props.params;
  const cat = categoryBySlug(category);
  const page = Number(n);
  if (!cat || !isLang(lang) || !Number.isInteger(page) || page < 2) notFound();
  const posts = postsInCategory(lang, cat.slug);
  if ((page - 1) * PAGE_SIZE >= posts.length) notFound();
  return <CategoryView cat={cat} posts={posts} page={page} lang={lang} />;
}
