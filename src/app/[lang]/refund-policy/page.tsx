import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { getDict, getLegal } from "@/i18n";
import { isLang } from "@/i18n/config";

export async function generateMetadata(props: PageProps<"/[lang]/refund-policy">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const doc = getLegal(lang).refund;
  return pageMetadata({ lang, title: doc.title, description: doc.metaDescription, path: "/refund-policy" });
}

export default async function Page(props: PageProps<"/[lang]/refund-policy">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  return <LegalPage doc={getLegal(lang).refund} path="/refund-policy" lang={lang} t={getDict(lang)} />;
}
