/**
 * Brand and product constants. Everything user-facing that names the brand or the
 * book reads from here, so the entity stays consistent across pages, schema and emails.
 * Language-specific wording lives in src/i18n; these are the facts.
 */

import type { Lang } from "@/i18n/config";

export const SITE = {
  name: "Human Lantern",
  legalName: "Human Lantern",
  domain: "humanlantern.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://humanlantern.com").replace(/\/$/, ""),
  email: "contact@humanlantern.com",
  /** Sender of the book delivery email (Resend); replies go to `email`. */
  deliveryEmail: "books@humanlantern.com",
  foundingYear: 2026,
} as const;

/** Card-statement suffix after the shared Stripe account's 10-character prefix (22 characters in total). */
export const STATEMENT_SUFFIX = "HMNLANTERN";

export const BOOK = {
  title: "What AI Can't Take From You",
  displayTitle: "What AI Can’t Take From You",
  edition: "First edition, 2026",
  price: 7.99,
  priceLabel: "$7.99",
  currency: "USD",
  chapters: 88,
  parts: 12,
  situations: 36,
  format: "PDF",
  sku: "hl-ebook-v1",
  refundDays: 7,
} as const;

/** Each edition is its own master PDF in the private R2 bucket; a purchase unlocks all three. */
export const EDITIONS: Record<Lang, { title: string; fileKey: string; fileName: string; pages: number }> = {
  en: { title: "What AI Can’t Take From You", fileKey: "books/hl-v1/en.pdf", fileName: "What-AI-Cant-Take-From-You.pdf", pages: 0 },
  de: { title: "Was KI dir nicht nehmen kann", fileKey: "books/hl-v1/de.pdf", fileName: "Was-KI-dir-nicht-nehmen-kann.pdf", pages: 0 },
  ja: { title: "AIがあなたから奪えないもの", fileKey: "books/hl-v1/ja.pdf", fileName: "AI-ga-anata-kara-ubaenai-mono.pdf", pages: 0 },
};

export const PRODUCT_ID = BOOK.sku;

/** Pages that must never be indexed or listed in the sitemap (every edition). */
/** Never crawled: the owner's area and the API. */
export const PRIVATE_PATHS = ["/admin", "/sign-in", "/api/"] as const;

/**
 * Personal pages every page links to (Get the book, My copy). They stay crawlable on purpose: a
 * robots.txt block would hide their noindex (meta + X-Robots-Tag from next.config) and Google can
 * index a blocked URL from links alone.
 */
export const NOINDEX_PATHS = ["/checkout", "/download", "/unsubscribed"] as const;

export const CONTENT_UPDATED = "2026-10-31";
