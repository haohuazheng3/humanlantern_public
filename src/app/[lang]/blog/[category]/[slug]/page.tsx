import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleView } from "@/components/blog/ArticleView";
import { getPost, postUrl, publishedPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { isLang } from "@/i18n/config";

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const posts = publishedPosts(isLang(params.lang) ? params.lang : "en").map((p) => ({ category: p.category, slug: p.slug }));
  // Sentinel keeps the route buildable before the first article exists; it 404s.
  return posts.length ? posts : [{ category: "ai-and-jobs", slug: "coming-soon" }];
}

export async function generateMetadata(props: PageProps<"/[lang]/blog/[category]/[slug]">): Promise<Metadata> {
  const { lang, category, slug } = await props.params;
  if (!isLang(lang)) return {};
  const post = getPost(lang, category, slug);
  if (!post) return {};
  const meta = pageMetadata({
    lang,
    title: post.title,
    // Google shows the site name above every result already; a brand suffix only pushes titles past the cut-off.
    absoluteTitle: true,
    description: post.description,
    path: `/blog/${post.category}/${post.slug}`,
    type: "article",
    image: post.image?.src ?? `/og/post/${post.lang}/${post.category}/${post.slug}`,
    allEditions: false,
  });
  return {
    ...meta,
    keywords: post.keywords,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: ["Human Lantern"] },
  };
}

export default async function ArticlePage(props: PageProps<"/[lang]/blog/[category]/[slug]">) {
  const { lang, category, slug } = await props.params;
  if (!isLang(lang)) notFound();
  const post = getPost(lang, category, slug);
  if (!post || postUrl(post) === "") notFound();
  return <ArticleView post={post} />;
}
