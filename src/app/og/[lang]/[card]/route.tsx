import { ogCard } from "@/lib/og";
import { book } from "@/content/book";
import { getDict } from "@/i18n";
import { LOCALES, isLang } from "@/i18n/config";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => ["home", "book"].map((card) => ({ lang, card })));
}

/** Stable share images per edition: /og/<lang>/home and /og/<lang>/book (file-based OG routes get hashed URLs in Next 16). */
export async function GET(_req: Request, ctx: { params: Promise<{ lang: string; card: string }> }) {
  const { lang: raw, card } = await ctx.params;
  const lang = isLang(raw) ? raw : "en";
  const t = getDict(lang);
  const b = book(lang);
  if (card === "book") return ogCard({ lang, eyebrow: t.book.eyebrow, title: b.title, subtitle: b.coverCopy.tagline, withCover: true });
  return ogCard({ lang, eyebrow: t.home.eyebrow, title: t.home.h1.replace(/\*/g, ""), subtitle: undefined });
}
