// Generates every raster icon from the logo mark (one source of truth).
// Usage: node scripts/gen-icons.mjs
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = (p) => path.join(root, "public", p);

const BG = "#16130f";
const BODY = "#f6f0e8";
const LIGHT = "#ff8a3d";

// The lantern on a 32-unit grid (same geometry as src/components/Logo.tsx).
const mark = (body = BODY, light = LIGHT, glow = true) => `
  ${glow ? `<circle cx="16" cy="18.4" r="7.6" fill="${light}" opacity=".18"/>` : ""}
  <path d="M12.6 6.2a3.4 3.4 0 0 1 6.8 0" fill="none" stroke="${body}" stroke-width="1.9" stroke-linecap="round"/>
  <rect x="10.2" y="6.4" width="11.6" height="2.7" rx="1.35" fill="${body}"/>
  <rect x="8.9" y="10.2" width="14.2" height="16.4" rx="5.2" fill="none" stroke="${body}" stroke-width="2.2"/>
  <circle cx="16" cy="18.4" r="3.5" fill="${light}"/>
  <rect x="10.6" y="27.4" width="10.8" height="2.6" rx="1.3" fill="${body}"/>`;

// Square tile with the mark scaled into a safe area.
function tile({ size = 512, radius = 0.22, pad = 0.16, bg = BG } = {}) {
  const r = size * radius;
  const inner = size * (1 - pad * 2);
  const scale = inner / 32;
  const off = (size - inner) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
  <g transform="translate(${off} ${off}) scale(${scale})">${mark()}</g>
</svg>`;
}

function png(svg, size) {
  return new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng();
}

// favicon.svg (crisp at any size, used by modern browsers)
fs.writeFileSync(pub("icon.svg"), tile({ size: 64, radius: 0.24, pad: 0.12 }));
// mono mark for print / one-colour uses
fs.writeFileSync(pub("brand/logo-mark.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${mark("#1b1611", "#1b1611", false)}</svg>`);
fs.writeFileSync(pub("brand/logo-tile.svg"), tile({ size: 512 }));

// PNGs
const sizes = { "apple-icon.png": [180, { radius: 0, pad: 0.17 }], "icon-192.png": [192, {}], "icon-512.png": [512, {}], "brand/logo-512.png": [512, {}], "brand/logo-1024.png": [1024, {}] };
for (const [file, [size, opts]] of Object.entries(sizes)) {
  fs.writeFileSync(pub(file), png(tile({ size, ...opts }), size));
}
// maskable icon: full-bleed background, mark inside the 80% safe zone
fs.writeFileSync(pub("icon-maskable-512.png"), png(tile({ size: 512, radius: 0, pad: 0.24 }), 512));

// favicon.ico with 16/32/48 PNG entries
const icoSizes = [16, 32, 48];
const images = icoSizes.map((s) => png(tile({ size: 64, radius: 0.24, pad: s <= 16 ? 0.06 : 0.1 }), s));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const dir = [];
images.forEach((buf, i) => {
  const e = Buffer.alloc(16);
  const s = icoSizes[i];
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(buf.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += buf.length;
  dir.push(e);
});
fs.writeFileSync(pub("favicon.ico"), Buffer.concat([header, ...dir, ...images]));
console.log("icons written");
