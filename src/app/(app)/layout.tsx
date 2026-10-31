import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { THEME_SCRIPT } from "@/components/ThemeToggle";
import { ConsentManager } from "@/components/Consent";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { getDict } from "@/i18n";
import { book } from "@/content/book";
import { BOOK, SITE } from "@/lib/site";

const instrument = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-instrument", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz", "SOFT"], variable: "--font-fraunces", display: "swap" });

/* The owner's admin area and its sign-in (English only): never indexed, never cached. Clerk's JS only loads here. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Admin", template: "%s · Human Lantern" },
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const t = getDict("en");
  return (
    <html lang="en" suppressHydrationWarning className={`${instrument.variable} ${fraunces.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <div className="void-bg" aria-hidden="true" />
        <ClerkProvider appearance={clerkAppearance} signInUrl="/sign-in" signInFallbackRedirectUrl="/admin" afterSignOutUrl="/">
          <Header lang="en" t={t.nav} priceLabel={BOOK.priceLabel} />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <Footer lang="en" t={t} bookTitle={book("en").title} />
        </ClerkProvider>
        <ConsentManager t={t.consent} policyHref="/cookie-policy" />
      </body>
    </html>
  );
}
