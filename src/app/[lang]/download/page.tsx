import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ResendForm } from "@/components/ResendForm";
import { Container } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang, localePath } from "@/i18n/config";
import { BOOK } from "@/lib/site";

export async function generateMetadata(props: PageProps<"/[lang]/download">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return { ...pageMetadata({ lang, title: t.download.metaTitle, description: t.download.metaDescription, path: "/download" }), robots: { index: false, follow: true } };
}

export default async function DownloadPage(props: PageProps<"/[lang]/download">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const d = t.download;
  return (
    <Container className="pt-10 sm:pt-16">
      <div className="mx-auto grid max-w-[1000px] items-start gap-8 lg:grid-cols-[1fr_440px] lg:gap-14">
        <div className="min-w-0">
          <p className="eyebrow eyebrow-accent">{d.eyebrow}</p>
          <h1 className="display mt-4 text-[2.3rem] text-ink sm:text-[3.1rem]">{d.title}</h1>
          <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-3">{d.lede}</p>
          <ul className="mt-6 space-y-2 text-[0.95rem] text-ink-3">
            {d.tips.map((tip) => (
              <li key={tip}>· {tip}</li>
            ))}
          </ul>
          <p className="mt-6 text-[0.9rem] text-ink-4">
            <Link href={localePath(lang, "/contact")} className="underline underline-offset-4">
              {d.contact}
            </Link>{" "}
            · {d.refundNote(BOOK.refundDays)}
          </p>
        </div>
        <div className="min-w-0">
          <ResendForm t={d.form} lang={lang} />
        </div>
      </div>
    </Container>
  );
}
