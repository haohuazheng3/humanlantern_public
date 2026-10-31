import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/content/categories";
import { PAGE_SIZE, postUrl, publishedPosts } from "@/lib/blog";
import { CONTENT_UPDATED, SITE } from "@/lib/site";
import { LANG_META, LOCALES, localePath } from "@/i18n/config";

const STATIC: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/book", priority: 0.9, changeFrequency: "monthly" },
  { path: "/book/sample", priority: 0.8, changeFrequency: "monthly" },
  { path: "/finder", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.5, changeFrequency: "monthly" },
  { path: "/how-it-works", priority: 0.4, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.2, changeFrequency: "yearly" },
];

const url = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;

/** Every edition of every page that exists in all three, with hreflang alternates; empty hubs and private pages never appear. */
export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const s of STATIC) {
    const languages = Object.fromEntries(LOCALES.map((l) => [LANG_META[l].hreflang, url(localePath(l, s.path))]));
    for (const lang of LOCALES) {
      out.push({ url: url(localePath(lang, s.path)), lastModified: CONTENT_UPDATED, changeFrequency: s.changeFrequency, priority: s.priority, alternates: { languages } });
    }
  }
  out.push({ url: url("/ja/legal-notice"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.2 });

  for (const lang of LOCALES) {
    const posts = publishedPosts(lang);
    if (!posts.length) continue;
    const newest = posts.reduce((m, p) => (p.updatedAt > m ? p.updatedAt : m), posts[0].updatedAt);
    out.push({ url: url(localePath(lang, "/blog")), lastModified: newest, changeFrequency: "weekly", priority: 0.7 });
    for (const c of CATEGORIES) {
      const inCat = posts.filter((p) => p.category === c.slug);
      if (!inCat.length) continue;
      const latest = inCat.reduce((m, p) => (p.updatedAt > m ? p.updatedAt : m), inCat[0].updatedAt);
      out.push({ url: url(localePath(lang, `/blog/${c.slug}`)), lastModified: latest, changeFrequency: "weekly", priority: 0.7 });
      const pages = Math.ceil(inCat.length / PAGE_SIZE);
      for (let n = 2; n <= pages; n++) out.push({ url: url(localePath(lang, `/blog/${c.slug}/page/${n}`)), lastModified: latest, changeFrequency: "weekly", priority: 0.4 });
    }
    for (const p of posts) out.push({ url: url(postUrl(p)), lastModified: p.updatedAt, changeFrequency: "monthly", priority: p.featured ? 0.8 : 0.6 });
  }
  return out;
}
