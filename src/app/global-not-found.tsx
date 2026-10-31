import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = { title: "Page not found · Human Lantern", robots: { index: false, follow: false } };

/** Unmatched URLs outside the editions (rare: most paths are rewritten into an edition and get its own 404). */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="void-bg" aria-hidden="true" />
        <main className="px-3 pt-24 sm:px-5">
          <div className="slab mx-auto max-w-xl px-6 py-14 text-center sm:px-12">
            <div className="mx-auto w-fit">
              <LogoMark size={64} />
            </div>
            <p className="eyebrow mt-6">404</p>
            <h1 className="display mt-4 text-[2.4rem] text-ink">This page wandered off the map.</h1>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/" className="btn btn-primary">
                Home
              </Link>
              <Link href="/book" className="btn btn-ghost">
                The book
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
