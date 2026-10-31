import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryView } from "@/components/blog/CategoryView";
import { CATEGORIES, categoryBySlug } from "@/content/categories";
import { postsInCategory } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { isLang } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: PageProps<"/[lang]/blog/[category]">): Promise<Metadata> {
  const { lang, category } = await props.params;
  const cat = categoryBySlug(category);
  if (!cat || !isLang(lang)) return {};
  const c = cat.copy[lang];
  // An empty hub is thin content: keep it out of the index until it has guides.
  return pageMetadata({ lang, title: c.title, description: c.description, path: `/blog/${cat.slug}`, noindex: postsInCategory(lang, cat.slug).length === 0 });
}

export default async function CategoryPage(props: PageProps<"/[lang]/blog/[category]">) {
  const { lang, category } = await props.params;
  const cat = categoryBySlug(category);
  if (!cat || !isLang(lang)) notFound();
  return <CategoryView cat={cat} posts={postsInCategory(lang, cat.slug)} page={1} lang={lang} />;
}
