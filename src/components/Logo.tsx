import Link from "next/link";

/**
 * The mark: a lantern. A housing with a cap and a ring, and one warm light inside. In the
 * dark a lantern can't show the whole road, only the next few steps, which is the whole
 * brand in one shape. Pure geometry: it holds in one colour, at 16px, and on a stage screen.
 */
export function LogoMark({ size = 28, className = "", mono = false }: { size?: number; className?: string; mono?: boolean }) {
  const body = mono ? "currentColor" : "var(--ink)";
  const light = mono ? "currentColor" : "var(--accent)";
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      {!mono ? <circle cx="16" cy="18.4" r="7.6" fill="var(--accent)" opacity="0.16" /> : null}
      <path d="M12.6 6.2a3.4 3.4 0 0 1 6.8 0" fill="none" stroke={body} strokeWidth="1.9" strokeLinecap="round" />
      <rect x="10.2" y="6.4" width="11.6" height="2.7" rx="1.35" fill={body} />
      <rect x="8.9" y="10.2" width="14.2" height="16.4" rx="5.2" fill="none" stroke={body} strokeWidth="2.2" />
      <circle cx="16" cy="18.4" r="3.5" fill={light} />
      <rect x="10.6" y="27.4" width="10.8" height="2.6" rx="1.3" fill={body} />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-[family-name:var(--font-fraunces)] font-semibold tracking-[-0.018em] text-ink ${className}`} style={{ fontVariationSettings: '"opsz" 36, "SOFT" 70' }}>
      Human Lantern
    </span>
  );
}

export function LogoLink({ href = "/", label, className = "", size = 26 }: { href?: string; label: string; className?: string; size?: number }) {
  return (
    <Link href={href} aria-label={label} className={`group inline-flex min-h-[44px] items-center gap-2 rounded-full pr-1 ${className}`}>
      <LogoMark size={size} className="transition-transform duration-500 group-hover:-translate-y-[1px]" />
      <Wordmark className="whitespace-nowrap text-[1.05rem] leading-none sm:text-[1.12rem]" />
    </Link>
  );
}
