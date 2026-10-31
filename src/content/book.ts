import type { Lang } from "@/i18n/config";
import en from "../../content/book/public/en.json";
import de from "../../content/book/public/de.json";
import ja from "../../content/book/public/ja.json";

/*
 * The book, as the website sees it. scripts/book/build.mjs lays out the three editions and
 * writes content/book/public/<lang>.json: the table of contents with real page numbers, the
 * opening pages, the Situation Finder and Part 1 (the free sample). The rest of the book only
 * exists in the private part files and the paid PDFs, never in the site bundle.
 */

export type Inline = string;

export type Block =
  | { type: "p"; text: Inline }
  | { type: "h3"; text: Inline }
  | { type: "list"; items: Inline[] }
  | { type: "evidence"; title: string; text: Inline; source?: { cite: string; url?: string } }
  | { type: "prompt"; title: string; text: string }
  | { type: "say"; label: string; tone?: string; lines: { from: "them" | "you" | "note"; text: string }[] }
  | { type: "drill"; title: string; text: Inline }
  | { type: "mistake"; title: string; text: Inline }
  | { type: "compare"; left: string; right: string; rows: [string, string][] }
  | { type: "truth"; text: Inline };

export interface Chapter {
  id: string;
  title: string;
  dek: string;
  blocks: Block[];
}

export interface TocChapter {
  id: string;
  title: string;
  dek: string;
  truth: string;
  page: number;
}

export interface Part {
  n: number;
  title: string;
  layer: "clear" | "field";
  intro: string;
  page: number;
  chapters: TocChapter[];
}

export interface FinderGroup {
  name: string;
  items: { thought: string; chapter: string }[];
}

export interface PublicBook {
  lang: Lang;
  title: string;
  subtitle: string;
  pages: number;
  cover: { image: string; png: string; width: number; height: number };
  coverCopy: { kicker: string; promises: string[]; tagline: string };
  readFirst: { title: string; page: number; blocks: Block[] };
  howToUse: {
    title: string;
    intro: string;
    tools: { type: string; name: string; text: string }[];
    layers: { name: string; parts: string; text: string }[];
    hurry: string;
    page: number;
  };
  finder: { title: string; intro: string; page: number; groups: FinderGroup[] };
  parts: Part[];
  sample: { part: number; chapters: Chapter[] };
  lookInside: { page: number; label: string; image: string }[];
}

const BOOKS = { en, de, ja } as unknown as Record<Lang, PublicBook>;

export function book(lang: Lang): PublicBook {
  return BOOKS[lang];
}

export function allChapters(lang: Lang): (TocChapter & { part: number })[] {
  return book(lang).parts.flatMap((p) => p.chapters.map((c) => ({ ...c, part: p.n })));
}

export function chapterById(lang: Lang, id: string): (TocChapter & { part: number }) | undefined {
  return allChapters(lang).find((c) => c.id === id);
}

export function chapterCount(lang: Lang): number {
  return allChapters(lang).length;
}

/** Stable slug for a finder thought, used for deep links (#will-ai-take-my-job). */
export function thoughtSlug(thought: string, index: number): string {
  const ascii = thought
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return ascii.length >= 4 ? ascii : `s${index + 1}`;
}
