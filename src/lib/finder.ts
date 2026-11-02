import "server-only";
import type { FinderChapter, FinderItem } from "@/components/SituationFinder";
import { allChapters, book, thoughtSlug } from "@/content/book";
import { getDict } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { chapterLabel } from "@/i18n/format";
import { plain } from "@/components/Rich";

/** Finder data for the client component: only what the answers show, never chapter bodies. */
export function finderData(lang: Lang) {
  const b = book(lang);
  let i = 0;
  const items: FinderItem[] = b.finder.groups.flatMap((g, gi) => g.items.map((it) => ({ slug: thoughtSlug(it.thought, i++), thought: it.thought, chapter: it.chapter, group: gi })));
  const used = new Set(items.map((s) => s.chapter));
  const chapters: Record<string, FinderChapter> = Object.fromEntries(
    allChapters(lang)
      .filter((c) => used.has(c.id))
      .map((c) => [c.id, { id: c.id, title: c.title, dek: c.dek, truth: plain(c.truth), page: c.page }]),
  );
  return { groups: b.finder.groups.map((g) => g.name), items, chapters };
}

export function finderLabels(lang: Lang) {
  const t = getDict(lang);
  return {
    tabsLabel: t.finder.tabsLabel,
    ifThinking: t.finder.ifThinking,
    shortAnswer: t.finder.shortAnswer,
    truth: t.finder.truth,
    fullChapter: t.finder.fullChapter,
    chapter: chapterLabel(lang, "{id}"),
    onPage: t.finder.onPage(987654).replace("987654", "{page}"),
    getFull: t.finder.getFull,
    readSample: t.finder.readSample,
  };
}

