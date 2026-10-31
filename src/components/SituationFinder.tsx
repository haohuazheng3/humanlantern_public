"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "./Consent";

export interface FinderItem {
  slug: string;
  thought: string;
  chapter: string;
  group: number;
}

export interface FinderChapter {
  id: string;
  title: string;
  dek: string;
  truth: string;
  page: number;
}

export interface FinderLabels {
  tabsLabel: string;
  ifThinking: string;
  shortAnswer: string;
  truth: string;
  fullChapter: string;
  chapter: string;
  /** Template with a {page} placeholder (functions can’t cross into client components). */
  onPage: string;
  getFull: string;
  readSample: string;
}

/**
 * Pick the thought that's keeping you up → the honest short answer, the one line to keep,
 * and the chapter that holds the full plan. Selection is local state: the answer swaps the
 * instant a chip is tapped, with no network involved.
 */
export function SituationFinder({
  groups,
  items,
  chapters,
  t,
  bookHref,
  sampleHref,
  initial,
}: {
  groups: string[];
  items: FinderItem[];
  chapters: Record<string, FinderChapter>;
  t: FinderLabels;
  bookHref: string;
  sampleHref: string;
  initial?: string;
}) {
  const find = useMemo(() => (slug?: string) => items.find((s) => s.slug === slug) ?? items[0], [items]);
  const [selected, setSelected] = useState<FinderItem>(() => find(initial));
  const [group, setGroup] = useState<number>(() => find(initial).group);
  const answerRef = useRef<HTMLDivElement>(null);

  // deep link: /finder#will-ai-take-my-job
  useEffect(() => {
    const fromHash = (e?: Event) => {
      const slug = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      const hit = items.find((s) => s.slug === slug);
      if (hit) {
        setSelected(hit);
        setGroup(hit.group);
        // a link elsewhere on the page picked this thought: bring the answer into view
        if (e) requestAnimationFrame(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
      }
    };
    fromHash();
    const onChange = (e: Event) => fromHash(e);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, [items]);

  const choose = (s: FinderItem) => {
    setSelected(s);
    track("situation_select", { slug: s.slug, chapter: s.chapter });
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    }
  };

  const ch = chapters[selected.chapter];
  const inGroup = items.filter((s) => s.group === group);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
      <div className="slab min-w-0 p-4 sm:p-6">
        <div role="tablist" aria-label={t.tabsLabel} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {groups.map((g, i) => (
            <button
              key={g}
              role="tab"
              type="button"
              aria-selected={group === i}
              onClick={() => setGroup(i)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[0.85rem] font-semibold transition-colors active:scale-95 ${
                group === i ? "bg-ink text-void" : "bg-slab-2 text-ink-3 hover:text-ink"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-2 sm:gap-2.5" aria-label={groups[group]}>
          {inGroup.map((s) => (
            <li key={s.slug}>
              <button type="button" className="chip" data-selected={selected.slug === s.slug} aria-pressed={selected.slug === s.slug} onClick={() => choose(s)}>
                {s.thought}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div ref={answerRef} className="slab-ink min-w-0 scroll-mt-28 p-6 sm:p-8" aria-live="polite">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-60 w-60 rounded-full bg-[radial-gradient(closest-side,rgba(255,138,61,0.26),transparent)] blur-2xl" />
        <p className="relative font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#ff9b57]">{t.ifThinking}</p>
        <p key={selected.slug} className="headline animate-rise relative mt-3 text-[1.55rem] leading-tight text-[#f6f0e8] sm:text-[1.8rem]">
          “{selected.thought}”
        </p>
        {ch ? (
          <>
            <p className="relative mt-5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#a1968a]">{t.shortAnswer}</p>
            <p key={`${selected.slug}-a`} className="relative mt-2 font-sans text-[1.02rem] leading-relaxed text-[#d8cec2]">
              {ch.dek}
            </p>
            {ch.truth ? (
              <div className="relative mt-5 border-l-2 border-[#ff8a3d] pl-4">
                <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#ff9b57]">{t.truth}</p>
                <p className="finder-truth mt-1 text-[1.08rem] leading-snug text-[#f6f0e8]">{ch.truth}</p>
              </div>
            ) : null}
            <div className="relative mt-6 rounded-[18px] bg-white/[0.06] p-4 ring-1 ring-white/10">
              <p className="font-sans text-[0.78rem] text-[#a1968a]">{t.fullChapter}</p>
              <p className="mt-1 font-sans text-[0.98rem] font-semibold text-[#f6f0e8]">
                {t.chapter.replace("{id}", ch.id)}: {ch.title.replace(/\n/g, " ")}
              </p>
              <p className="mt-2 font-sans text-[0.82rem] text-[#a1968a]">{t.onPage.replace("{page}", String(ch.page))}</p>
            </div>
          </>
        ) : null}
        <div className="relative mt-6 flex flex-wrap gap-2.5">
          <Link href={bookHref} className="btn btn-primary">
            {t.getFull}
          </Link>
          <Link href={sampleHref} className="btn btn-ink !bg-white/10 !text-[#f6f0e8] hover:!bg-white/15">
            {t.readSample}
          </Link>
        </div>
      </div>
    </div>
  );
}
