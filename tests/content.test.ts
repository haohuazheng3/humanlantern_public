import { describe, expect, it } from "vitest";
import { extractHeadings } from "@/lib/blog";
import { maskEmail } from "@/lib/watermark";
import { allChapters, book } from "@/content/book";
import { CATEGORIES } from "@/content/categories";
import { LOCALES } from "@/i18n/config";

describe("content integrity", () => {
  it("has the same 12 parts and 88 chapters in every edition", () => {
    const ids = allChapters("en").map((c) => c.id);
    expect(book("en").parts).toHaveLength(12);
    expect(ids).toHaveLength(88);
    for (const l of LOCALES) expect(allChapters(l).map((c) => c.id)).toEqual(ids);
  });
  it("maps all 36 finder thoughts to real chapters, in every edition", () => {
    for (const l of LOCALES) {
      const ids = new Set(allChapters(l).map((c) => c.id));
      const items = book(l).finder.groups.flatMap((g) => g.items);
      expect(items).toHaveLength(36);
      for (const s of items) expect(ids.has(s.chapter)).toBe(true);
    }
  });
  it("gives every chapter a title, a standfirst and a truth line, with increasing page numbers", () => {
    for (const l of LOCALES) {
      let last = 0;
      for (const c of allChapters(l)) {
        expect(c.title.length).toBeGreaterThan(2);
        expect(c.dek.length).toBeGreaterThan(10);
        expect(c.truth.length).toBeGreaterThan(5);
        expect(c.page).toBeGreaterThan(last);
        last = c.page;
      }
    }
  });
  it("ships Part 1 in full as the free sample", () => {
    for (const l of LOCALES) {
      const sample = book(l).sample.chapters;
      expect(sample.map((c) => c.id)).toEqual(book(l).parts[0].chapters.map((c) => c.id));
      for (const c of sample) expect(c.blocks.length).toBeGreaterThan(2);
    }
  });
  it("points every category at real chapters", () => {
    const ids = new Set(allChapters("en").map((c) => c.id));
    for (const c of CATEGORIES) for (const ch of c.chapters) expect(ids.has(ch)).toBe(true);
  });
  it("extracts H2 headings with GitHub-style ids", () => {
    expect(extractHeadings("intro\n## What it means\ntext\n```\n## not a heading\n```\n## What to do next?")).toEqual([
      { id: "what-it-means", text: "What it means" },
      { id: "what-to-do-next", text: "What to do next?" },
    ]);
  });
  it("masks emails for the PDF stamp", () => {
    expect(maskEmail("jonathan@gmail.com")).toBe("j***n@gmail.com");
    expect(maskEmail("ab@x.io")).toBe("a***@x.io");
  });
});
