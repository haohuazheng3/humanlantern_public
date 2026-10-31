import "server-only";
import { en, type Dict } from "./dict/en";
import { de } from "./dict/de";
import { ja } from "./dict/ja";
import { legalEn } from "./legal/en";
import { legalDe } from "./legal/de";
import { legalJa } from "./legal/ja";
import type { LegalSet } from "./legal/types";
import { isLang, type Lang } from "./config";

const DICTS: Record<Lang, Dict> = { en, de, ja };
const LEGAL: Record<Lang, LegalSet> = { en: legalEn, de: legalDe, ja: legalJa };

/** Interface copy for an edition. Server-only: client components receive the slices they need as props. */
export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}

export function getLegal(lang: Lang): LegalSet {
  return LEGAL[lang];
}

/** Resolve the [lang] route param; anything unknown is a 404 at the call site. */
export async function langFrom(params: Promise<{ lang: string }>): Promise<Lang | null> {
  const { lang } = await params;
  return isLang(lang) ? lang : null;
}
