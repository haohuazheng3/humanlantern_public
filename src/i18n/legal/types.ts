export type LegalBlock =
  | { p: string }
  | { h3: string }
  | { ul: string[] }
  | { ol: string[] }
  | { table: { head: string[]; rows: string[][] } }
  | { dl: [string, string][] }
  | { controls: true };

export interface LegalDoc {
  title: string;
  metaDescription: string;
  /** ISO date of the last substantive change. */
  updated: string;
  intro: string;
  /** Translations say which version governs. */
  governing?: string;
  sections: { h: string; blocks: LegalBlock[] }[];
}

export interface LegalSet {
  privacy: LegalDoc;
  terms: LegalDoc;
  refund: LegalDoc;
  cookies: LegalDoc;
  /** Japan only: 特定商取引法に基づく表記 (null elsewhere). */
  commerce: LegalDoc | null;
}
