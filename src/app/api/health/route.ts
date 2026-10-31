import { healthReport } from "@/lib/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Self-diagnosis: 200 when healthy, 503 otherwise. Names only, never values. */
export async function GET() {
  const body = await healthReport();
  return Response.json(body, { status: body.ok ? 200 : 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
