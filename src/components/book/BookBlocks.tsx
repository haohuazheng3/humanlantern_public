import type { ReactNode } from "react";
import { rich } from "@/components/Rich";
import type { Block, Chapter } from "@/content/book";
import type { Lang } from "@/i18n/config";
import { chapterLabel } from "@/i18n/format";

/*
 * The book's six recurring tools, rendered as nested slabs so a sample chapter on the site
 * reads like the page in the PDF: The evidence · Prompt · Say this · Field drill · Mistake · The truth.
 * Labels come from the block titles themselves ("The evidence: exposure is partial"), so every
 * edition shows its own words.
 */

export function Box({ title, tone, children }: { title: string; tone: "evidence" | "drill" | "mistake"; children: ReactNode }) {
  const bar = { evidence: "before:bg-info", drill: "before:bg-ok", mistake: "before:bg-bad" }[tone];
  const [label, rest] = splitTitle(title);
  return (
    <aside className={`slab-inset relative my-6 overflow-hidden px-5 py-4 font-sans before:absolute before:inset-y-4 before:left-0 before:w-[3px] before:rounded-r-full sm:px-6 sm:py-5 ${bar}`}>
      <p className="eyebrow">
        {label}
        {rest ? <span className="font-semibold normal-case tracking-normal text-ink-2">: {rest}</span> : null}
      </p>
      <div className="mt-2 text-[0.98rem] leading-relaxed text-ink-2 [&_strong]:text-ink">{children}</div>
    </aside>
  );
}

/** "The evidence: exposure is partial" → ["The evidence", "exposure is partial"]; also handles the Japanese colon. */
function splitTitle(title: string): [string, string] {
  const m = /^(.+?)\s*[:：]\s*(.+)$/.exec(title);
  return m ? [m[1], m[2]] : [title, ""];
}

export function BlockView({ b, lang, sourceLabel }: { b: Block; lang: Lang; sourceLabel: string }) {
  switch (b.type) {
    case "p":
      return <p>{rich(b.text, lang)}</p>;
    case "h3":
      return <h3>{rich(b.text, lang)}</h3>;
    case "list":
      return (
        <ul>
          {b.items.map((it, i) => (
            <li key={i}>{rich(it, lang)}</li>
          ))}
        </ul>
      );
    case "evidence":
      return (
        <Box title={b.title} tone="evidence">
          <p>{rich(b.text, lang)}</p>
          {b.source ? (
            <p className="mt-2 text-[0.82rem] leading-snug text-ink-4">
              {sourceLabel}:{" "}
              {b.source.url ? (
                <a href={b.source.url} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink-3">
                  {b.source.cite}
                </a>
              ) : (
                b.source.cite
              )}
            </p>
          ) : null}
        </Box>
      );
    case "drill":
      return (
        <Box title={b.title} tone="drill">
          <p>{rich(b.text, lang)}</p>
        </Box>
      );
    case "mistake":
      return (
        <Box title={b.title} tone="mistake">
          <p>{rich(b.text, lang)}</p>
        </Box>
      );
    case "prompt": {
      const [label, rest] = splitTitle(b.title);
      return (
        <figure className="my-6 overflow-hidden rounded-[22px] bg-slab-2 font-sans shadow-[inset_0_0_0_1px_var(--line-2)]">
          <figcaption className="flex items-center gap-2 px-5 pt-4 text-[0.78rem] font-semibold text-ink-3">
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-accent-text">{label}</span>
            {rest}
          </figcaption>
          <div className="flex items-end gap-3 px-5 pb-4 pt-3">
            <p className="flex-1 whitespace-pre-line text-[0.95rem] leading-relaxed text-ink-2">{b.text}</p>
            <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </figure>
      );
    }
    case "say":
      return (
        <figure className="slab-ink my-6 px-4 py-4 sm:px-5" aria-label={b.label}>
          <figcaption className="mb-3 flex items-center justify-between gap-2 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#a1968a]">
            <span>{b.label}</span>
            {b.tone ? <span className="rounded-full bg-white/10 px-2 py-0.5 normal-case tracking-normal text-[#ff9b57]">{b.tone}</span> : null}
          </figcaption>
          <div className="flex flex-col gap-2 font-sans">
            {b.lines.map((l, i) =>
              l.from === "note" ? (
                <p key={i} className="py-1 text-center text-[0.78rem] italic text-[#a1968a]">
                  {l.text}
                </p>
              ) : (
                <p key={i} className={l.from === "you" ? "bubble bubble-out self-end" : "bubble bubble-in self-start"}>
                  {l.text}
                </p>
              ),
            )}
          </div>
        </figure>
      );
    case "compare":
      return (
        <div className="my-6 overflow-hidden rounded-[20px] font-sans text-[0.95rem] shadow-[inset_0_0_0_1px_var(--line)]">
          <div className="grid grid-cols-2 bg-slab-2 text-ink">
            <p className="px-4 py-3 font-semibold text-ink-3">{b.left}</p>
            <p className="px-4 py-3 font-semibold text-ink">{b.right}</p>
          </div>
          {b.rows.map(([a, c], i) => (
            <div key={i} className="grid grid-cols-2 border-t border-line">
              <p className="px-4 py-3 text-ink-3">{a}</p>
              <p className="px-4 py-3 text-ink-2">{c}</p>
            </div>
          ))}
        </div>
      );
    case "truth":
      return null; // rendered by ChapterView at the foot of the chapter
    default:
      return null;
  }
}

export function ChapterView({ c, lang, labels }: { c: Chapter; lang: Lang; labels: { chapter: string; truth: string; source: string } }) {
  const truth = c.blocks.find((b) => b.type === "truth");
  return (
    <article id={`chapter-${c.id}`} className="slab scroll-mt-28 px-5 py-8 sm:px-10 sm:py-12">
      <p className="eyebrow eyebrow-accent">{chapterLabel(lang, c.id)}</p>
      <h2 className="headline mt-3 whitespace-pre-line text-[2rem] text-ink sm:text-[2.5rem]">{c.title}</h2>
      <p className="dek mt-4 text-[1.18rem] leading-snug">{c.dek}</p>
      <div className="prose-book mt-6">
        {c.blocks.map((b, i) => (
          <BlockView key={i} b={b} lang={lang} sourceLabel={labels.source} />
        ))}
      </div>
      {truth && truth.type === "truth" ? (
        <div className="slab-ink mt-8 px-5 py-5 sm:px-6">
          <div className="border-l-2 border-[#ff8a3d] pl-4">
            <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#ff9b57]">{labels.truth}</p>
            <p className="truth-line mt-2 text-[1.25rem] leading-snug text-[#f6f0e8]">{rich(truth.text, lang)}</p>
          </div>
        </div>
      ) : null}
    </article>
  );
}
