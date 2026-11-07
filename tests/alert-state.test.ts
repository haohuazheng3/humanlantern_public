import { afterEach, describe, expect, it, vi } from "vitest";
import { DOWN_AFTER, REMIND_EVERY_MS, normalizeAlertState, stepAlert, stepAlerts, utcDay, watchCoversIt } from "@/lib/alert-state";

const T0 = Date.UTC(2026, 10, 6, 12, 0, 0);
const MIN = 60_000;

/** Runs a sequence of probe results through the state machine and collects the emails it asks for. */
function emails(results: boolean[], stepMs = 30 * MIN, start: unknown = null): string[] {
  let state: unknown = start;
  const out: string[] = [];
  results.forEach((ok, i) => {
    const r = stepAlert(state, ok, T0 + i * stepMs);
    state = r.next;
    if (r.action) out.push(r.action);
  });
  return out;
}

describe("alert state machine", () => {
  it("sends nothing for a single failed probe that passes next time", () => {
    expect(emails([true, false, true, false, true])).toEqual([]);
  });

  it(`sends DOWN only after ${DOWN_AFTER} failed probes in a row, then RECOVERED once`, () => {
    expect(emails([false, false, false, false, true, true])).toEqual(["down", "recovered"]);
  });

  it("stays quiet while down except one reminder per day", () => {
    const day = REMIND_EVERY_MS / (30 * MIN);
    const down = Array.from({ length: 2 * day + 2 }, () => false);
    expect(emails([...down, true])).toEqual(["down", "reminder", "reminder", "recovered"]);
  });

  it("keeps the start of the streak for the duration in the RECOVERED mail", () => {
    const a = stepAlert(null, false, T0);
    const b = stepAlert(a.next, false, T0 + 30 * MIN);
    expect(b.action).toBe("down");
    expect(b.next.since).toBe(T0);
    expect(stepAlert(b.next, true, T0 + 90 * MIN)).toEqual({ next: { failing: false, fails: 0, since: 0, lastAlertAt: 0 }, action: "recovered" });
  });

  it("reads the older { failing, lastAlertAt, since } shape and junk safely", () => {
    expect(normalizeAlertState({ failing: true, lastAlertAt: T0, since: T0 })).toEqual({ failing: true, fails: DOWN_AFTER, since: T0, lastAlertAt: T0 });
    expect(normalizeAlertState({ failing: false })).toEqual({ failing: false, fails: 0, since: 0, lastAlertAt: 0 });
    expect(normalizeAlertState("nonsense")).toEqual({ failing: false, fails: 0, since: 0, lastAlertAt: 0 });
    // An alert already sent under the old 3-hour scheme is not repeated before a day has passed.
    expect(stepAlert({ failing: true, lastAlertAt: T0, since: T0 }, false, T0 + 4 * 60 * MIN).action).toBeNull();
    expect(stepAlert({ failing: true, lastAlertAt: T0, since: T0 }, true, T0 + 4 * 60 * MIN).action).toBe("recovered");
  });

  it("folds an in-run double probe into one DOWN", () => {
    expect(stepAlerts(null, [false, false], T0).actions).toEqual(["down"]);
    expect(stepAlerts(null, [true], T0).actions).toEqual([]);
    const down = stepAlerts(null, [false, false], T0).next;
    expect(stepAlerts(down, [false, false], T0 + 6 * 60 * MIN).actions).toEqual([]);
    expect(stepAlerts(down, [true], T0 + 6 * 60 * MIN).actions).toEqual(["recovered"]);
  });

  it("formats the UTC day", () => {
    expect(utcDay(Date.UTC(2026, 10, 6, 23, 59))).toBe("2026-11-06");
  });
});

describe("external probe vs in-app watch", () => {
  const report = (db: boolean, missing: string[]) => ({ ok: false, db: { ok: db }, config: { missing } });

  it("leaves a not-ok report with a reachable database to the in-app watch", () => {
    expect(watchCoversIt(503, report(true, ["STRIPE_PRICE_BOOK"]))).toBe(true);
  });

  it("alerts itself when the site, the database or the watch's own config is down", () => {
    expect(watchCoversIt(0, null)).toBe(false);
    expect(watchCoversIt(502, "<html>Bad gateway</html>")).toBe(false);
    expect(watchCoversIt(503, report(false, []))).toBe(false);
    expect(watchCoversIt(503, report(true, ["CRON_SECRET"]))).toBe(false);
    expect(watchCoversIt(503, report(true, ["MAIL_WORKER_TOKEN"]))).toBe(false);
    expect(watchCoversIt(503, { db: { ok: true } })).toBe(false);
  });
});

describe("health semantics", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock("@/lib/db");
    vi.resetModules();
  });

  async function reportWith(unresolved: number | Error, missingName?: string) {
    vi.resetModules();
    vi.doMock("@/lib/db", () => ({
      db: {
        select: () => ({
          from: () => ({
            where: async () => {
              if (unresolved instanceof Error) throw unresolved;
              return [{ n: unresolved }];
            },
          }),
        }),
      },
    }));
    const { REQUIRED_ENV } = await import("@/lib/env");
    for (const n of REQUIRED_ENV) vi.stubEnv(n, n === missingName ? "" : `test-${n.toLowerCase()}`);
    const { healthReport } = await import("@/lib/health");
    return healthReport();
  }

  it("stays ok with unresolved severe errors and still reports the count", async () => {
    const r = await reportWith(3);
    expect(r.ok).toBe(true);
    expect(r.errors.unresolvedSevere).toBe(3);
  });

  it("fails when the database is unreachable", async () => {
    const r = await reportWith(new Error("connect ETIMEDOUT"));
    expect(r.ok).toBe(false);
    expect(r.db.ok).toBe(false);
  });

  it("fails when a required variable is missing", async () => {
    const r = await reportWith(0, "CRON_SECRET");
    expect(r.ok).toBe(false);
    expect(r.config.missing).toContain("CRON_SECRET");
  });
});
