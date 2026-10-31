import { ogCard } from "@/lib/og";
import { getPost, publishedPosts } from "@/lib/blog";
import { categoryBySlug } from "@/content/categories";
import { isLang } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = publishedPosts().map((p) => ({ lang: p.lang, category: p.category, slug: p.slug }));
  return posts.length ? posts : [{ lang: "en", category: "ai-and-jobs", slug: "coming-soon" }];
}

/** Stable per-article share image: /og/post/<lang>/<category>/<slug>. */
export async function GET(_req: Request, ctx: { params: Promise<{ lang: string; category: string; slug: string }> }) {
  const { lang: raw, category, slug } = await ctx.params;
  const lang = isLang(raw) ? raw : "en";
  const post = getPost(lang, category, slug);
  return ogCard({
    lang,
    eyebrow: categoryBySlug(category)?.copy[lang].name ?? "Human Lantern",
    title: post?.title ?? "Human Lantern",
    subtitle: post?.description ? post.description.slice(0, 120) : undefined,
  });
}
