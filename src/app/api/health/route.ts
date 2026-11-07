import { healthReport } from "@/lib/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Self-diagnosis: 200 when the site can serve (database reachable, required config present), 503
 * otherwise. Error-inbox counts are informational fields only. Names only, never values.
 */
export async function GET() {
  const body = await healthReport();
  return Response.json(body, { status: body.ok ? 200 : 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
