import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import type { Lang } from "@/i18n/config";

export const OG_SIZE = { width: 1200, height: 630 };

const FS_ROOT = path.join(process.cwd(), "node_modules", "@fontsource");

function file(pkg: string, name: string): Buffer {
  return fs.readFileSync(path.join(FS_ROOT, pkg, "files", name));
}

type OgFont = { name: string; data: Buffer; weight: 400 | 600 | 700; style: "normal" | "italic" };

/** Japanese glyphs come from just the Noto Sans JP subsets the card's text needs (satori falls back across fonts). */
function japaneseFonts(text: string): OgFont[] {
  const map = JSON.parse(fs.readFileSync(path.join(FS_ROOT, "noto-sans-jp", "unicode.json"), "utf8")) as Record<string, string>;
  const codes = new Set([...text].map((ch) => ch.codePointAt(0)!).filter((c) => c > 0x2fff));
  const out: OgFont[] = [];
  for (const [key, ranges] of Object.entries(map)) {
    const m = /^\[(\d+)\]$/.exec(key);
    if (!m) continue;
    const hit = ranges.split(",").some((r) => {
      const [a, b] = r.replace("U+", "").split("-").map((h) => parseInt(h, 16));
      for (const c of codes) if (c >= a && c <= (b ?? a)) return true;
      return false;
    });
    if (hit) out.push({ name: "JP", data: file("noto-sans-jp", `noto-sans-jp-${m[1]}-700-normal.woff`), weight: 700, style: "normal" });
  }
  return out;
}

function fonts(lang: Lang, text: string): OgFont[] {
  const base: OgFont[] = [
    { name: "Display", data: file("fraunces", "fraunces-latin-600-normal.woff"), weight: 600, style: "normal" },
    { name: "Display", data: file("fraunces", "fraunces-latin-400-italic.woff"), weight: 400, style: "italic" },
    { name: "Sans", data: file("instrument-sans", "instrument-sans-latin-600-normal.woff"), weight: 600, style: "normal" },
  ];
  return lang === "ja" ? [...base, ...japaneseFonts(text)] : base;
}

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <circle cx="16" cy="18.4" r="7.6" fill="#ff8a3d" opacity="0.18" />
      <path d="M12.6 6.2a3.4 3.4 0 0 1 6.8 0" fill="none" stroke="#f6f0e8" strokeWidth="1.9" strokeLinecap="round" />
      <rect x="10.2" y="6.4" width="11.6" height="2.7" rx="1.35" fill="#f6f0e8" />
      <rect x="8.9" y="10.2" width="14.2" height="16.4" rx="5.2" fill="none" stroke="#f6f0e8" strokeWidth="2.2" />
      <circle cx="16" cy="18.4" r="3.5" fill="#ff8a3d" />
      <rect x="10.6" y="27.4" width="10.8" height="2.6" rx="1.3" fill="#f6f0e8" />
    </svg>
  );
}

export function coverDataUri(lang: Lang): string | null {
  const p = path.join(process.cwd(), "public", "book-art", lang, "cover.png");
  if (!fs.existsSync(p)) return null;
  return `data:image/png;base64,${fs.readFileSync(p).toString("base64")}`;
}

/** Brand OG card: the warm void, one floating slab lit by a lantern glow, the words. */
export function ogCard({ lang, eyebrow, title, subtitle, withCover = false }: { lang: Lang; eyebrow: string; title: string; subtitle?: string; withCover?: boolean }) {
  const cover = withCover ? coverDataUri(lang) : null;
  const ja = lang === "ja";
  const family = (latin: string) => (ja ? `${latin}, JP` : latin);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "radial-gradient(900px 520px at 50% -12%, rgba(255,140,60,0.22), transparent 62%), #0c0a08",
          padding: 48,
          fontFamily: family("Sans"),
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            borderRadius: 40,
            background: "#16130f",
            boxShadow: "0 0 0 2px rgba(255,236,214,0.08), 0 40px 80px -30px rgba(0,0,0,0.9)",
            padding: "52px 60px",
            gap: 40,
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 24, letterSpacing: ja ? 1 : 4, textTransform: "uppercase", color: "#ff9b57" }}>{eyebrow}</div>
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontFamily: family("Display"),
                fontWeight: ja ? 700 : 600,
                fontSize: title.length > (ja ? 26 : 60) ? 52 : 64,
                lineHeight: ja ? 1.3 : 1.08,
                color: "#f6f0e8",
                letterSpacing: ja ? 0 : -1,
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div style={{ display: "flex", marginTop: 22, fontFamily: family("Display"), fontStyle: ja ? "normal" : "italic", fontWeight: ja ? 700 : 400, fontSize: ja ? 26 : 28, lineHeight: 1.35, color: "#c9bfb2" }}>
                {subtitle}
              </div>
            ) : null}
            <div style={{ display: "flex", marginTop: "auto", alignItems: "center", gap: 14 }}>
              <Mark size={46} />
              <div style={{ display: "flex", fontFamily: "Display", fontWeight: 600, fontSize: 30, color: "#f6f0e8" }}>Human Lantern</div>
              <div style={{ display: "flex", marginLeft: 14, fontSize: 22, color: "#938878" }}>humanlantern.com</div>
            </div>
          </div>
          {cover ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} width={300} height={450} style={{ borderRadius: 10, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.9)" }} alt="" />
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts(lang, `${eyebrow}${title}${subtitle ?? ""}`) },
  );
}
