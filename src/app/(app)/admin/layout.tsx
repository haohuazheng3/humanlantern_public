import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { Identify } from "@/components/Identify";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/errors", label: "Errors" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/inbox", label: "Test inbox" },
  { href: "/admin/diagnostics", label: "Diagnostics" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, email } = await requireAdmin();
  return (
    <div className="mx-auto max-w-[1120px] px-3 pt-8 sm:px-5">
      <Identify userRef={userId} email={email} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow eyebrow-accent">Admin</p>
          <p className="text-[0.85rem] text-ink-4">{email}</p>
        </div>
        <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none]" aria-label="Admin">
          {TABS.map((t) => (
            <Link key={t.href} href={t.href} className="shrink-0 rounded-full bg-slab-2 px-3.5 py-2 text-[0.88rem] font-semibold text-ink-3 hover:text-ink">
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
