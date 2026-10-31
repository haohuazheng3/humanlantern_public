import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckoutStarter } from "@/components/CheckoutStarter";
import { BookVisual } from "@/components/BookVisual";
import { Container, DeliveryNote } from "@/components/ui";
import { paymentsEnabled } from "@/lib/stripe";
import { emailDeliveryEnabled } from "@/lib/delivery";
import { book, chapterCount } from "@/content/book";
import { getDict } from "@/i18n";
import { isLang, localePath } from "@/i18n/config";
import { BOOK } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/[lang]/checkout">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLang(lang)) return {};
  return { title: getDict(lang).checkout.metaTitle, robots: { index: false, follow: false } };
}

/** No account needed: this page only hands over to Stripe, where the buyer enters their email. */
export default async function CheckoutPage(props: PageProps<"/[lang]/checkout">) {
  const { lang } = await props.params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const c = t.checkout;
  const b = book(lang);
  const payments = paymentsEnabled();

  return (
    <Container className="pt-10 sm:pt-16">
      <div className="mx-auto max-w-2xl">
        <div className="slab p-6 sm:p-9">
          <p className="eyebrow eyebrow-accent">{c.eyebrow}</p>
          <div className="mt-5 flex gap-5">
            <div className="w-20 shrink-0 sm:w-24">
              <BookVisual b={b} alt={b.title} sizes="96px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[1.1rem] font-semibold text-ink">{b.title}</p>
              <p className="text-[0.9rem] text-ink-3">{c.format(b.pages, chapterCount(lang))}</p>
              <p className="numeral mt-3 text-[2.2rem] !font-medium text-ink">{BOOK.priceLabel}</p>
              <p className="text-[0.82rem] text-ink-4">{c.oneTime}</p>
            </div>
          </div>
          <p className="mt-4 rounded-2xl bg-slab-2 px-4 py-2.5 text-[0.88rem] text-ink-2">{t.book.editions}</p>
          <hr className="hairline my-6" />
          {payments.ok ? (
            <CheckoutStarter
              lang={lang}
              contactHref={localePath(lang, "/contact")}
              t={{
                starting: c.starting,
                retry: c.retry,
                contact: c.contact,
                errorGeneric: c.errorGeneric,
                errorNetwork: c.errorNetwork,
                waiverTitle: c.waiverTitle,
                waiverText: c.waiverText,
                waiverButton: c.waiverButton,
              }}
            />
          ) : (
            <div role="status">
              <p className="text-[1rem] text-ink-2">{c.unavailable}</p>
              <Link href={localePath(lang, "/book")} className="btn btn-ghost mt-4">
                {c.back}
              </Link>
            </div>
          )}
          <DeliveryNote t={t} emailDelivery={emailDeliveryEnabled()} className="mt-6" />
          <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-4">{c.fine(BOOK.refundDays)}</p>
        </div>
      </div>
    </Container>
  );
}
