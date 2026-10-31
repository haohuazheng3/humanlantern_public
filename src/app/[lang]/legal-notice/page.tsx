import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { getDict, getLegal } from "@/i18n";
import { isLang } from "@/i18n/config";

/** Japan's 特定商取引法に基づく表記. Only the Japanese edition has this page; elsewhere it 404s. */
export async function generateMetadata(props: PageProps<"/[lang]/legal-notice">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const doc = getLegal(lang).commerce;
  if (!doc) return { robots: { index: false, follow: false } };
  return pageMetadata({ lang, title: doc.title, description: doc.metaDescription, path: "/legal-notice", allEditions: false });
}

export default async function Page(props: PageProps<"/[lang]/legal-notice">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const doc = getLegal(lang).commerce;
  if (!doc) notFound();
  return <LegalPage doc={doc} path="/legal-notice" lang={lang} t={getDict(lang)} />;
}
