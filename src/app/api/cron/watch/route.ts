import { timingSafeEqual } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { appState } from "@/lib/db/schema";
import { healthReport } from "@/lib/health";
import { notifyOwner } from "@/lib/notify";
import { captureError } from "@/lib/errors";
import { env } from "@/lib/env";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALERT_EVERY_MS = 3 * 60 * 60 * 1000;
const KEY = "health-watch";

function authorized(req: Request): boolean {
  const secret = env("CRON_SECRET");
  const got = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!secret || !got || got.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(secret));
}

/**
 * Every 30 minutes (Vercel Cron): run the health self-check and email the owner through the mail
 * worker when it turns red (again every 3 hours while it stays red), and once when it recovers.
 * The GitHub Actions health job covers the case where the site can't run at all.
 */
async function run(req: Request): Promise<Response> {
  if (!authorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    const report = await healthReport();
    const prev = ((await db.select().from(appState).where(eq(appState.key, KEY)).limit(1))[0]?.value ?? {}) as { failing?: boolean; lastAlertAt?: number; since?: number };
    const now = Date.now();
    let next = prev;
    if (!report.ok) {
      if (!prev.failing || now - (prev.lastAlertAt ?? 0) > ALERT_EVERY_MS) {
        await notifyOwner({ subject: "ALERT: health check failing", text: `${SITE.url}/api/health is red.\n\n${JSON.stringify(report, null, 2)}\n\nError inbox: ${SITE.url}/admin/errors` });
        next = { failing: true, lastAlertAt: now, since: prev.failing ? prev.since : now };
      }
    } else if (prev.failing) {
      await notifyOwner({ subject: "Recovered: health check passing", text: `Health is green again after ${Math.round((now - (prev.since ?? now)) / 60000)} minutes.` });
      next = { failing: false };
    }
    if (next !== prev) {
      await db.insert(appState).values({ key: KEY, value: next }).onConflictDoUpdate({ target: appState.key, set: { value: next, updatedAt: sql`now()` } });
    }
    return Response.json({ ok: report.ok, alerted: next !== prev });
  } catch (err) {
    await captureError(err, { route: "/api/cron/watch", source: "cron" });
    return Response.json({ error: "watch failed" }, { status: 500 });
  }
}

export const GET = run;
export const POST = run;
