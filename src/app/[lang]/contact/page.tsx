import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, organizationLd, pageMetadata } from "@/lib/seo";
import { getDict } from "@/i18n";
import { isLang, localePath } from "@/i18n/config";
import { SITE } from "@/lib/site";

export async function generateMetadata(props: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return pageMetadata({ lang, title: t.contact.metaTitle, description: t.contact.metaDescription, path: "/contact" });
}

export default async function ContactPage(props: PageProps<"/[lang]/contact">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const c = t.contact;
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", url: absoluteUrl(localePath(lang, "/contact")), about: organizationLd(t.meta.siteDescription) }} />
      <Container className="pt-10 sm:pt-16">
        <div className="mx-auto grid max-w-[1000px] items-start gap-8 lg:grid-cols-[1fr_520px] lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow eyebrow-accent">{c.eyebrow}</p>
            <h1 className="display mt-4 text-[2.3rem] text-ink sm:text-[3.1rem]">{c.title}</h1>
            <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-3">{c.lede}</p>
            <p className="mt-6 text-[0.95rem] text-ink-3">
              {c.emailLabel}{" "}
              <a href={`mailto:${SITE.email}`} className="font-semibold text-accent-text underline underline-offset-4">
                {SITE.email}
              </a>
            </p>
          </div>
          <div className="min-w-0">
            <ContactForm t={c.form} replyTime={t.footer.replyTime} />
          </div>
        </div>
      </Container>
    </>
  );
}
