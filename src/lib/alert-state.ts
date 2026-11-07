/**
 * Owner alerting state machine, shared by the in-app watch (Vercel Cron, state in app_state) and the
 * external GitHub Actions probes (state in the Actions cache; scripts/ops/gh-alert.mjs imports this
 * file with Node's type stripping, so it stays dependency-free and uses erasable TypeScript only).
 *
 * Rules: a DOWN email only after DOWN_AFTER consecutive failed probes; silence while it stays down
 * except one reminder per REMIND_EVERY_MS; one RECOVERED email on the first passing probe after a
 * DOWN email. A single failed probe that passes next time sends nothing.
 */

export interface AlertState {
  /** A DOWN email went out and no RECOVERED email yet. */
  failing: boolean;
  /** Consecutive failed probes. */
  fails: number;
  /** First failed probe of the current streak (ms epoch, 0 while passing). */
  since: number;
  /** Last DOWN or reminder email (ms epoch, 0 while passing). */
  lastAlertAt: number;
}

export type AlertAction = "down" | "reminder" | "recovered" | null;

export const DOWN_AFTER = 2;
export const REMIND_EVERY_MS = 24 * 60 * 60 * 1000;

const PASSING: AlertState = { failing: false, fails: 0, since: 0, lastAlertAt: 0 };

/** Accepts anything read back from a store (including the older `{ failing, lastAlertAt, since }` shape). */
export function normalizeAlertState(raw: unknown): AlertState {
  if (!raw || typeof raw !== "object") return { ...PASSING };
  const o = raw as Record<string, unknown>;
  const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : 0);
  const failing = o.failing === true;
  const fails = Math.floor(num(o.fails)) || (failing ? DOWN_AFTER : 0);
  return { failing, fails, since: num(o.since), lastAlertAt: num(o.lastAlertAt) };
}

export function stepAlert(prevRaw: unknown, ok: boolean, now: number, opts: { downAfter?: number; remindEveryMs?: number } = {}): { next: AlertState; action: AlertAction } {
  const downAfter = opts.downAfter ?? DOWN_AFTER;
  const remindEveryMs = opts.remindEveryMs ?? REMIND_EVERY_MS;
  const prev = normalizeAlertState(prevRaw);
  if (ok) return { next: { ...PASSING }, action: prev.failing ? "recovered" : null };
  const fails = prev.fails + 1;
  const since = prev.fails > 0 && prev.since ? prev.since : now;
  if (prev.failing) {
    if (now - prev.lastAlertAt >= remindEveryMs) return { next: { failing: true, fails, since, lastAlertAt: now }, action: "reminder" };
    return { next: { ...prev, fails, since }, action: null };
  }
  if (fails >= downAfter) return { next: { failing: true, fails, since, lastAlertAt: now }, action: "down" };
  return { next: { failing: false, fails, since, lastAlertAt: 0 }, action: null };
}

/** Folds several probe results (oldest first); at most one action comes out of a [fail, fail] or [ok] run. */
export function stepAlerts(prevRaw: unknown, results: boolean[], now: number): { next: AlertState; actions: Exclude<AlertAction, null>[] } {
  let state = normalizeAlertState(prevRaw);
  const actions: Exclude<AlertAction, null>[] = [];
  for (const ok of results) {
    const r = stepAlert(state, ok, now);
    state = r.next;
    if (r.action) actions.push(r.action);
  }
  return { next: state, actions };
}

/** Env names the in-app watch needs to run and to send mail. */
export const WATCH_DEPENDS_ON = ["DATABASE_URL", "CRON_SECRET", "MAIL_WORKER_URL", "MAIL_WORKER_TOKEN"];

/**
 * The external probe stays quiet when the in-app watch will alert about the same incident: the
 * site answered with its own health report, the database is reachable (the watch keeps its state
 * there) and nothing the watch needs is missing. Unreachable, timeouts, non-JSON answers and a
 * database outage are the external probe's to report.
 */
export function watchCoversIt(status: number, body: unknown): boolean {
  if (status === 200 || status === 0) return false;
  if (!body || typeof body !== "object") return false;
  const b = body as { db?: { ok?: unknown }; config?: { missing?: unknown } };
  if (b.db?.ok !== true) return false;
  const missing: unknown = b.config?.missing;
  if (!Array.isArray(missing)) return false;
  return !missing.some((n) => typeof n === "string" && WATCH_DEPENDS_ON.includes(n));
}

/** "2026-11-06" for a ms epoch, in UTC. */
export function utcDay(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}
