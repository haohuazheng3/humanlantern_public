import "server-only";
import { and, count, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import { errorGroups } from "./db/schema";
import { missingEnv, pendingEnv, REQUIRED_ENV, VERCEL_ENV } from "./env";
import { stripeMode } from "./stripe";

export interface HealthReport {
  ok: boolean;
  env: string;
  commit: string;
  time: string;
  db: { ok: boolean; ms: number; error?: string };
  config: { required: number; missing: string[]; pendingOptional: string[] };
  stripe: { mode: string };
  errors: { unresolvedSevere: number };
  tookMs: number;
}

/**
 * Self-diagnosis, safe to expose: names only, never values. `ok` means the site can serve: the
 * database is reachable and every required variable is set. Unresolved errors in the inbox and
 * optional integrations that aren't switched on yet are reported for information only and never
 * make it fail (open errors reach the owner through the daily digest in /api/cron/watch).
 */
export async function healthReport(): Promise<HealthReport> {
  const started = Date.now();
  let dbOk = false;
  let dbMs = 0;
  let unresolved = -1;
  let dbError: string | undefined;
  try {
    const t = Date.now();
    const rows = await db
      .select({ n: count() })
      .from(errorGroups)
      .where(and(isNull(errorGroups.resolvedAt), eq(errorGroups.severity, "error")));
    dbMs = Date.now() - t;
    dbOk = true;
    unresolved = Number(rows[0]?.n ?? 0);
  } catch (e) {
    dbError = e instanceof Error ? e.message.slice(0, 120) : "unknown";
  }
  const missing = missingEnv();
  return {
    ok: dbOk && missing.length === 0,
    env: VERCEL_ENV,
    commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.VERCEL_DEPLOYMENT_ID ?? "local").slice(0, 12),
    time: new Date().toISOString(),
    db: { ok: dbOk, ms: dbMs, ...(dbError ? { error: dbError } : {}) },
    config: { required: REQUIRED_ENV.length, missing, pendingOptional: pendingEnv() },
    stripe: { mode: stripeMode() },
    errors: { unresolvedSevere: unresolved },
    tookMs: Date.now() - started,
  };
}
