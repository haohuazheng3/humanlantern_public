import { Breadcrumbs, Container } from "./ui";
import { rich } from "./Rich";
import { CookieSettingsLink, DoNotTrackLink } from "./Consent";
import type { LegalDoc } from "@/i18n/legal/types";
import { LANG_META, localePath, type Lang } from "@/i18n/config";
import type { Dict } from "@/i18n/dict/en";

/** A legal page rendered from data, so every edition carries the same structure. */
export function LegalPage({ doc, path, lang, t }: { doc: LegalDoc; path: string; lang: Lang; t: Dict }) {
  const updated = new Date(`${doc.updated}T12:00:00Z`).toLocaleDateString(LANG_META[lang].dateLocale, { year: "numeric", month: "long", day: "numeric" });
  return (
    <Container className="pt-10 sm:pt-14">
      <Breadcrumbs
        items={[
          { name: t.common.home, path: localePath(lang, "/") },
          { name: doc.title, path: localePath(lang, path) },
        ]}
      />
      <div className="mx-auto mt-6 max-w-3xl">
        <h1 className="display text-[2.4rem] text-ink sm:text-[3.2rem]">{doc.title}</h1>
        <p className="mt-3 text-[0.9rem] text-ink-4">
          <time dateTime={doc.updated}>{updated}</time>
        </p>
        <p className="mt-5 text-[1.08rem] leading-relaxed text-ink-3">{rich(doc.intro, lang)}</p>
        {doc.governing ? <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-4">{doc.governing}</p> : null}
        <div className="slab mt-8 px-6 py-8 sm:px-10 sm:py-10">
          <div className="prose-ui">
            {doc.sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.blocks.map((b, i) => {
                  if ("p" in b) return <p key={i}>{rich(b.p, lang)}</p>;
                  if ("h3" in b) return <h3 key={i}>{rich(b.h3, lang)}</h3>;
                  if ("ul" in b)
                    return (
                      <ul key={i}>
                        {b.ul.map((x, j) => (
                          <li key={j}>{rich(x, lang)}</li>
                        ))}
                      </ul>
                    );
                  if ("ol" in b)
                    return (
                      <ol key={i}>
                        {b.ol.map((x, j) => (
                          <li key={j}>{rich(x, lang)}</li>
                        ))}
                      </ol>
                    );
                  if ("dl" in b)
                    return (
                      <dl key={i} className="divide-y divide-[var(--line)] rounded-[18px] shadow-[inset_0_0_0_1px_var(--line)]">
                        {b.dl.map(([k, v]) => (
                          <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
                            <dt className="text-[0.9rem] font-semibold text-ink">{k}</dt>
                            <dd className="text-[0.95rem] text-ink-2">{rich(v, lang)}</dd>
                          </div>
                        ))}
                      </dl>
                    );
                  if ("table" in b)
                    return (
                      <div key={i} className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left text-[0.92rem]">
                          <thead>
                            <tr className="border-b border-line text-ink">
                              {b.table.head.map((h) => (
                                <th key={h} className="py-2 pr-3">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {b.table.rows.map((r) => (
                              <tr key={r[0]} className="border-b border-line align-top">
                                {r.map((c, j) => (
                                  <td key={j} className={`py-2.5 pr-3 ${j === 0 ? "font-medium text-ink-2" : ""}`}>
                                    {rich(c, lang)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  if ("controls" in b)
                    return (
                      <p key={i} className="flex flex-wrap items-center gap-1">
                        <DoNotTrackLink label={t.footer.doNotTrack} offLabel={t.footer.trackingOff} />
                        <CookieSettingsLink label={t.footer.cookieSettings} />
                      </p>
                    );
                  return null;
                })}
              </section>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
