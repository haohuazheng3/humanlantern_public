"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoLink } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { localePath, stripLocale, type Lang } from "@/i18n/config";

export interface HeaderLabels {
  book: string;
  finder: string;
  sample: string;
  guides: string;
  myCopy: string;
  getBook: string;
  menu: string;
  openMenu: string;
  closeMenu: string;
  faq: string;
  getCopyAgain: string;
  home: string;
  logoLabel: string;
  switchLanguage: string;
}

export function Header({ lang, t, priceLabel }: { lang: Lang; t: HeaderLabels; priceLabel: string }) {
  const pathname = usePathname();
  const { path } = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const L = (p: string) => localePath(lang, p);

  const NAV = [
    { href: "/book", label: t.book },
    { href: "/finder", label: t.finder },
    { href: "/book/sample", label: t.sample },
    { href: "/blog", label: t.guides },
  ];

  // close the mobile sheet on navigation (state adjusted during render, no effect needed)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const isActive = (href: string) => (href === "/book" ? path === "/book" : path === href || path.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="pill mx-auto flex h-[60px] max-w-[1120px] items-center justify-between gap-2 pl-4 pr-2 sm:pl-5">
        <LogoLink href={L("/")} label={t.logoLabel} />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={L(n.href)}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors active:scale-95 ${
                isActive(n.href) ? "bg-slab-2 text-ink" : "text-ink-3 hover:text-ink"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <LangSwitcher lang={lang} path={path} label={t.switchLanguage} className="hidden sm:inline-flex" />
          <Link
            href={L("/download")}
            className="hidden rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-ink-3 transition-colors hover:text-ink xl:inline-flex"
          >
            {t.myCopy}
          </Link>
          <Link href={L("/checkout")} prefetch={false} className="btn btn-primary btn-sm">
            {t.getBook}
            <span className="hidden font-normal opacity-70 sm:inline">· {priceLabel}</span>
          </Link>
          <button
            type="button"
            className="btn btn-quiet btn-sm !px-3 lg:hidden"
            aria-label={t.openMenu}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M3 6h14M3 10h14M3 14h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
        className="m-0 mt-3 w-[calc(100%-24px)] max-w-none translate-x-3 bg-transparent p-0 backdrop:bg-[rgba(8,5,2,0.6)] backdrop:backdrop-blur-sm"
      >
        <div className="slab animate-rise p-3">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="eyebrow">{t.menu}</span>
            <button type="button" className="btn btn-quiet btn-sm !px-3" aria-label={t.closeMenu} onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col">
            {[{ href: "/", label: t.home }, ...NAV, { href: "/download", label: t.getCopyAgain }, { href: "/faq", label: t.faq }].map((n) => (
              <Link
                key={n.href}
                href={L(n.href)}
                onClick={() => setOpen(false)}
                className={`flex min-h-[52px] items-center justify-between rounded-2xl px-4 text-[1.08rem] font-medium active:bg-slab-3 ${
                  path === n.href ? "bg-slab-2 text-ink" : "text-ink-2"
                }`}
              >
                {n.label}
                <span aria-hidden className="text-ink-4">
                  →
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-2 px-2">
            <LangSwitcher lang={lang} path={path} label={t.switchLanguage} variant="row" />
          </div>
          <Link href={L("/checkout")} prefetch={false} onClick={() => setOpen(false)} className="btn btn-primary btn-lg btn-block mt-3">
            {t.getBook} · {priceLabel}
          </Link>
        </div>
      </dialog>
    </header>
  );
}
