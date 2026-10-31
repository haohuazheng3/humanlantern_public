import type { Metadata } from "next";
import { BOOK, SITE } from "./site";
import type { Post } from "./blog";
import { LANG_META, LOCALES, localePath, type Lang } from "@/i18n/config";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** hreflang alternates for a page that exists in every edition (`path` is the unprefixed path). */
export function languageAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[LANG_META[l].hreflang] = absoluteUrl(localePath(l, path));
  out["x-default"] = absoluteUrl(localePath("en", path));
  return out;
}

export function pageMetadata(input: {
  lang: Lang;
  title: string;
  description: string;
  /** Unprefixed path, e.g. "/book": the edition prefix is added here. */
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article" | "book";
  absoluteTitle?: boolean;
  /** Page exists in all three editions (default). Articles exist in one. */
  allEditions?: boolean;
}): Metadata {
  const url = absoluteUrl(localePath(input.lang, input.path));
  // A page-level openGraph object replaces the inherited one, so every page names its image.
  const image = input.image ?? `/og/${input.lang}/home`;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: {
      canonical: url,
      ...(input.allEditions === false ? {} : { languages: languageAlternates(input.path) }),
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE.name,
      type: input.type === "article" ? "article" : "website",
      locale: LANG_META[input.lang].ogLocale,
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [absoluteUrl(image)],
    },
    ...(input.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;

export function organizationLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo-512.png"), width: 512, height: 512 },
    email: SITE.email,
    description,
    foundingDate: String(SITE.foundingYear),
    contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", email: SITE.email, availableLanguage: ["English", "German", "Japanese"] }],
  };
}

export function websiteLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE.name,
    url: SITE.url,
    inLanguage: LOCALES.map((l) => LANG_META[l].htmlLang),
    publisher: { "@id": ORG_ID },
    ...(lang ? {} : {}),
  };
}

export function bookLd(input: { lang: Lang; title: string; subtitle: string; pages: number; description: string; cover: string }) {
  const bookUrl = absoluteUrl(localePath(input.lang, "/book"));
  const offer = {
    "@type": "Offer",
    price: BOOK.price.toFixed(2),
    priceCurrency: BOOK.currency,
    availability: "https://schema.org/InStock",
    url: bookUrl,
    seller: { "@id": ORG_ID },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: ["US", "DE", "AT", "CH", "JP", "GB"],
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: BOOK.refundDays,
      returnFees: "https://schema.org/FreeReturn",
      refundType: "https://schema.org/FullRefund",
      returnMethod: "https://schema.org/ReturnByMail",
    },
  };
  return [
    {
      "@context": "https://schema.org",
      "@type": "Book",
      "@id": `${bookUrl}#book`,
      name: input.title,
      alternateName: input.subtitle,
      url: bookUrl,
      image: [absoluteUrl(input.cover), absoluteUrl(`/og/${input.lang}/book`)],
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      bookFormat: "https://schema.org/EBook",
      numberOfPages: input.pages,
      inLanguage: LANG_META[input.lang].htmlLang,
      datePublished: "2026",
      bookEdition: BOOK.edition,
      description: input.description,
      offers: offer,
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${bookUrl}#product`,
      name: `${input.title} (ebook)`,
      description: input.subtitle,
      image: absoluteUrl(input.cover),
      sku: BOOK.sku,
      brand: { "@type": "Brand", name: SITE.name },
      offers: offer,
    },
  ];
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function articleLd(post: Post, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(url) },
    url: absoluteUrl(url),
    image: absoluteUrl(post.image?.src ?? `/og/post/${post.lang}/${post.category}/${post.slug}`),
    author: { "@type": "Organization", "@id": ORG_ID, name: SITE.name, url: SITE.url },
    publisher: { "@id": ORG_ID },
    inLanguage: LANG_META[post.lang].htmlLang,
    wordCount: post.wordCount,
    keywords: post.keywords.join(", ") || undefined,
    isPartOf: { "@id": SITE_ID },
  };
}

export function serializeLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Free interactive tool at the top of a guide. No ratings: we never publish ones we didn't collect. */
export function webAppLd(name: string, description: string, url: string, lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: absoluteUrl(url),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    inLanguage: LANG_META[lang].htmlLang,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": ORG_ID },
  };
}
