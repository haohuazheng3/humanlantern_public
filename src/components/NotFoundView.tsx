"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "./Logo";
import { localePath, stripLocale } from "@/i18n/config";

type Copy = { eyebrow: string; title: string; body: string; home: string; finder: string; book: string };

export function NotFoundView({ copy }: { copy: Record<string, Copy> }) {
  const { lang } = stripLocale(usePathname() ?? "/");
  const n = copy[lang] ?? copy.en;
  return (
    <div className="px-3 pt-16 sm:px-5 sm:pt-24">
      <div className="slab mx-auto max-w-2xl px-6 py-14 text-center sm:px-12">
        <div className="lantern-glow mx-auto w-fit animate-float">
          <LogoMark size={64} />
        </div>
        <p className="eyebrow mt-6">{n.eyebrow}</p>
        <h1 className="display mt-4 text-[2.4rem] text-ink sm:text-[3rem]">{n.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-[1.02rem] leading-relaxed text-ink-3">{n.body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={localePath(lang, "/")} className="btn btn-primary">
            {n.home}
          </Link>
          <Link href={localePath(lang, "/finder")} className="btn btn-ghost">
            {n.finder}
          </Link>
          <Link href={localePath(lang, "/book")} className="btn btn-quiet">
            {n.book}
          </Link>
        </div>
      </div>
    </div>
  );
}
