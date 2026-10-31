import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Instrument_Sans, Source_Serif_4 } from "next/font/google";
import "../globals.css";
import { ConsentManager } from "@/components/Consent";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { THEME_SCRIPT } from "@/components/ThemeToggle";
import { getDict } from "@/i18n";
import { LANG_META, LOCALES, isLang, localePath } from "@/i18n/config";
import { book } from "@/content/book";
import { BOOK, SITE } from "@/lib/site";
import { isIndexable } from "@/lib/env";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal"],
  axes: ["opsz"],
  variable: "--font-source-serif",
  display: "swap",
  preload: false, // long-form reading only, never the first paint
});

const sourceSerifItalic = Source_Serif_4({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz"],
  variable: "--font-source-serif-italic",
  display: "swap",
  preload: false,
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(props: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  const indexable = isIndexable();
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t.meta.siteTitle, template: t.meta.titleTemplate },
    description: t.meta.siteDescription,
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    formatDetection: { telephone: false, email: false, address: false },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
      : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    openGraph: { type: "website", siteName: SITE.name, locale: LANG_META[lang].ogLocale, url: `${SITE.url}${localePath(lang, "/")}` },
    twitter: { card: "summary_large_image" },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
    category: "careers",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0a08" },
    { media: "(prefers-color-scheme: light)", color: "#efeae3" },
  ],
};

export default async function SiteLayout(props: LayoutProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const b = book(lang);
  return (
    <html
      lang={LANG_META[lang].htmlLang}
      suppressHydrationWarning
      className={`${instrument.variable} ${fraunces.variable} ${sourceSerif.variable} ${sourceSerifItalic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <div className="void-bg" aria-hidden="true" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          {t.common.skip}
        </a>
        <Header lang={lang} t={t.nav} priceLabel={BOOK.priceLabel} />
        <main id="main" className="min-h-[60vh]">
          {props.children}
        </main>
        <Footer lang={lang} t={t} bookTitle={b.title} />
        <ConsentManager t={t.consent} policyHref={localePath(lang, "/cookie-policy")} />
      </body>
    </html>
  );
}
