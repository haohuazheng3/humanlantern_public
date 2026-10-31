import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { getDict, getLegal } from "@/i18n";
import { isLang } from "@/i18n/config";

export async function generateMetadata(props: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const doc = getLegal(lang).terms;
  return pageMetadata({ lang, title: doc.title, description: doc.metaDescription, path: "/terms" });
}

export default async function Page(props: PageProps<"/[lang]/terms">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  return <LegalPage doc={getLegal(lang).terms} path="/terms" lang={lang} t={getDict(lang)} />;
}
