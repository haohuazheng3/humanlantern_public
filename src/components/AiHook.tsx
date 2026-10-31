import Link from "next/link";

/**
 * The book's cover moment, replayed: a late-night question to an AI assistant, a calm and
 * honest answer, the follow-up everyone has… and the assistant still typing. Pure CSS timing
 * (no JS), so it costs nothing to hydrate and becomes a still frame for reduced motion.
 */
export function AiHook({
  t,
  href,
  className = "",
}: {
  t: { header: string; time: string; lines: string[]; typing: string; question: string; link: string };
  href: string;
  className?: string;
}) {
  const [ask, answer, follow] = t.lines;
  return (
    <div className={`slab-ink overflow-hidden p-5 sm:p-7 ${className}`}>
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(255,138,61,0.32),transparent)] blur-2xl" />
      <div className="relative flex items-center justify-between font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#a1968a]">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff8a3d]" aria-hidden />
          {t.header}
        </span>
        <span>{t.time}</span>
      </div>

      <div className="relative mt-6 flex flex-col gap-2.5 font-sans" role="log" aria-label={t.header}>
        <p className="bubble bubble-out bubble-enter self-end" style={{ animationDelay: "0.2s" }}>
          {ask}
        </p>
        <p className="bubble bubble-in bubble-enter self-start" style={{ animationDelay: "1.2s" }}>
          {answer}
        </p>
        <p className="bubble bubble-out bubble-enter self-end" style={{ animationDelay: "2.3s" }}>
          {follow}
        </p>
        <div className="bubble-enter self-start" style={{ animationDelay: "3.1s" }}>
          <span className="bubble bubble-in inline-flex items-center gap-1.5 !px-4 !py-3.5">
            <span className="sr-only">{t.typing}</span>
            <span className="typing-dot" aria-hidden="true" />
            <span className="typing-dot" aria-hidden="true" />
            <span className="typing-dot" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="relative mt-7 border-t border-white/10 pt-5">
        <p className="headline text-[1.18rem] leading-snug text-[#f6f0e8]">{t.question}</p>
        <Link href={href} className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-[0.95rem] font-semibold text-[#ff9b57] hover:text-[#ffb27f]">
          {t.link} <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
