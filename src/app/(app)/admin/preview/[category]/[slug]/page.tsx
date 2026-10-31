import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { getPost } from "@/lib/blog";
import { ArticleView } from "@/components/blog/ArticleView";
import { isLang } from "@/i18n/config";

export const dynamic = "force-dynamic";

/** Owner-only preview of drafts and scheduled articles (?lang=de|ja for other editions), rendered with the real article template. */
export default async function PreviewPage(props: PageProps<"/admin/preview/[category]/[slug]">) {
  await requireAdmin();
  const { category, slug } = await props.params;
  const sp = await props.searchParams;
  const lang = isLang(sp.lang) ? sp.lang : "en";
  const post = getPost(lang, category, slug, { includeDrafts: true });
  if (!post) notFound();
  return <ArticleView post={post} preview />;
}
