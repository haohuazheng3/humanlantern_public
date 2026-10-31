import type { Lang } from "./config";

/** "Chapter 1.1" / "Kapitel 1.1" / "1.1章": word order differs, so labels are formatted, never concatenated. */
export function chapterLabel(lang: Lang, id: string): string {
  if (lang === "ja") return `${id}章`;
  if (lang === "de") return `Kapitel ${id}`;
  return `Chapter ${id}`;
}

/** Space between a sentence fragment and the link that continues it (Japanese runs on without one). */
export function gap(lang: Lang): string {
  return lang === "ja" ? "" : " ";
}

/** Full stop after a link that ends a sentence (the Japanese strings already carry their own punctuation). */
export function stop(lang: Lang): string {
  return lang === "ja" ? "" : ".";
}
