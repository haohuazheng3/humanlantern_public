import { BOOK, SITE } from "@/lib/site";
import { book, chapterCount } from "@/content/book";
import { CATEGORIES } from "@/content/categories";
import { postUrl, publishedPosts } from "@/lib/blog";
import { getDict } from "@/i18n";
import { localePath } from "@/i18n/config";

export const dynamic = "force-static";

/** llms.txt: a plain-text map of the site for language models and answer engines (English, with the other editions linked). */
export function GET() {
  const t = getDict("en");
  const b = book("en");
  const posts = publishedPosts();
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${t.meta.siteDescription}`,
    "",
    `${SITE.name} publishes ${b.title} (${b.subtitle}), a ${b.pages}-page field manual in ${b.parts.length} parts (${chapterCount("en")} one-page chapters), in English, German (${book("de").title}) and Japanese (${book("ja").title}), and free guides. Principles: no hype, no doom, no invented numbers; every statistic names its source, and debated findings are flagged.`,
    "",
    "## Key pages",
    `- [The book](${SITE.url}/book): ${BOOK.priceLabel}, one-time, PDF, all three editions included.`,
    `- [Free sample, Part 1](${SITE.url}/book/sample): ${b.parts[0].title}, eight chapters on what the research shows about AI and work, free to read.`,
    `- [Situation Finder](${SITE.url}/finder): 36 common AI-era career worries, each with a short answer and the chapter that covers it.`,
    `- [Guides](${SITE.url}/blog): articles by topic.`,
    `- [FAQ](${SITE.url}/faq) · [Pricing](${SITE.url}/pricing) · [About](${SITE.url}/about) · [Contact](${SITE.url}/contact)`,
    `- Other editions: [Deutsch](${SITE.url}${localePath("de", "/")}) · [日本語](${SITE.url}${localePath("ja", "/")})`,
    "",
    "## Book contents",
    ...b.parts.map((p) => `- Part ${p.n}, ${p.title}: ${p.chapters.map((c) => `${c.id} ${c.title.replace(/\n/g, " ")}`).join("; ")}`),
    "",
    "## Guide topics",
    ...CATEGORIES.map((c) => `- [${c.copy.en.name}](${SITE.url}/blog/${c.slug}): ${c.copy.en.description}`),
    ...(posts.length ? ["", "## Guides", ...posts.map((p) => `- [${p.title}](${SITE.url}${postUrl(p)}): ${p.description}`)] : []),
    "",
    `Contact: ${SITE.email}`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
