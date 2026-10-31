import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { localePath, type Lang } from "@/i18n/config";

/*
 * Tiny inline-markup renderer shared by the interface copy, the legal pages and the book
 * blocks: **bold**, *italic*, ==highlight==, `code`, [label](href). Anything else is text.
 * Internal links are mapped to the current edition (/download → /de/download).
 */

const TOKEN = /(\*\*[^*]+\*\*|==[^=]+==|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*)/g;

function localHref(href: string, lang?: Lang): string {
  if (!lang || !href.startsWith("/") || /^\/(de|ja)(\/|$)/.test(href)) return href;
  return localePath(lang, href);
}

export function rich(text: string, lang?: Lang, opts: { linkClass?: string; highlightClass?: string } = {}): ReactNode {
  const parts = text.split(TOKEN).filter((p) => p !== "");
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("==") && part.endsWith("==")) {
      return (
        <mark key={i} className={opts.highlightClass ?? "hl-mark"}>
          {part.slice(2, -2)}
        </mark>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const cls = opts.linkClass ?? "underline underline-offset-4";
      if (/^(https?:|mailto:)/.test(href)) {
        const external = href.startsWith("http");
        return (
          <a key={i} href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
            {label}
          </a>
        );
      }
      return (
        <Link key={i} href={localHref(href, lang)} className={cls}>
          {label}
        </Link>
      );
    }
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Strip the markup for plain-text contexts (meta descriptions, aria labels, JSON-LD). */
export function plain(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/==([^=]+)==/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/\*([^*\s][^*]*)\*/g, "$1");
}
