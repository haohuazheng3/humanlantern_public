import { requireAdmin } from "@/lib/admin";
import { DiagnosticsButtons } from "./DiagnosticsButtons";

export const dynamic = "force-dynamic";

async function throwServerError() {
  "use server";
  await requireAdmin();
  throw new Error(`Diagnostics: deliberate server error at ${new Date().toISOString()}`);
}

export default async function DiagnosticsPage() {
  await requireAdmin();
  return (
    <div className="slab p-6 sm:p-8">
      <h1 className="headline text-[1.6rem] text-ink">Diagnostics</h1>
      <p className="mt-2 max-w-2xl text-[0.95rem] text-ink-3">
        Fire a deliberate error to prove the pipeline end to end: it should appear in the error inbox and send one error email
        (first time only), then show up in the daily digest until you resolve it. /api/health stays 200 and only counts it.
      </p>
      <DiagnosticsButtons serverAction={throwServerError} />
    </div>
  );
}
