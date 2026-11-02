"use client";

import { usePathname } from "next/navigation";
import { stripLocale } from "@/i18n/config";

/**
 * loading.tsx gets no route params, so a loading state renders all three editions' strings
 * on the server and this picks the one for the URL being loaded.
 */
export function useEditionText<T>(byLang: Record<string, T>): T {
  const { lang } = stripLocale(usePathname() ?? "/");
  return byLang[lang] ?? byLang.en;
}

export function LocalizedText({ byLang }: { byLang: Record<string, string> }) {
  return <>{useEditionText(byLang)}</>;
}

export function LocalizedBusy({ labels, className, children }: { labels: Record<string, string>; className?: string; children: React.ReactNode }) {
  return (
    <div className={className} aria-busy="true" aria-label={useEditionText(labels)}>
      {children}
    </div>
  );
}
