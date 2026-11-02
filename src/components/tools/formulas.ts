import type { Formula } from "@/content/tools/types";

export type FormulaOutput = { result: string; lines: { label: string; value: string }[] };

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const years = (n: number) => (n >= 100 ? "never at this gap" : n < 1 ? `${Math.max(1, Math.round(n * 12))} months` : `${n.toFixed(1)} years`);

/**
 * Calculator formulas. Each one is small and transparent on purpose: the page's
 * "How this result is worked out" note says exactly what it does, in the same order.
 */
export const FORMULAS: Record<Formula, (v: Record<string, number>) => FormulaOutput> = {
  /**
   * Severance estimate. No U.S. federal law requires severance, and formulas vary, so this shows
   * the reader's own policy (if known) next to the two common rules of thumb, 1 and 2 weeks of base
   * pay per year of service, each with a 4-week floor and the reader's cap, plus unused PTO.
   */
  severance: (v) => {
    const salary = pos(v.salary);
    const yrs = Math.max(0, v.years || 0);
    const cap = pos(v.cap) || 26;
    if (!salary) return { result: "missing", lines: [] };
    const weekly = salary / 52;
    const weeks = (perYear: number) => Math.min(cap, Math.max(4, yrs * perYear));
    const line = (label: string, w: number) => ({ label, value: `${usd(w * weekly)} (${w.toFixed(1)} weeks)` });
    const lines = [{ label: "Weekly base pay", value: usd(weekly) }];
    if (pos(v.policy)) lines.push(line(`Your policy: ${v.policy} week${v.policy === 1 ? "" : "s"} per year`, weeks(v.policy)));
    lines.push(line("At 1 week per year (4-week minimum)", weeks(1)));
    lines.push(line("At 2 weeks per year (4-week minimum)", weeks(2)));
    lines.push({ label: "Unused PTO payout", value: usd(pos(v.pto) * (salary / 260)) });
    lines.push(line("A reasonable first ask", Math.min(cap, Math.max(weeks(2), weeks(pos(v.policy) || 1) * 1.5))));
    if (yrs < 1) return { result: "under-a-year", lines };
    if (yrs >= 10) return { result: "long", lines };
    return { result: "estimate", lines };
  },

  /**
   * Bachelor's payback: total cost = net price you pay + pay you give up while studying.
   * Payback years = total cost ÷ yearly earnings premium. Pre-tax, today's dollars.
   */
  degreePayback: (v) => {
    const cost = pos(v.cost);
    const study = pos(v.study) || 4;
    const withDeg = pos(v.withDegree);
    const without = pos(v.withoutDegree);
    if (!withDeg || !without) return { result: "missing", lines: [] };
    const forgone = study * without * (v.working >= 1 ? 0.5 : 1);
    const total = cost + forgone;
    const premium = withDeg - without;
    const payback = premium > 0 ? total / premium : 999;
    const lines = [
      { label: "What you pay (after aid)", value: usd(cost) },
      { label: "Pay you give up while studying", value: usd(forgone) },
      { label: "Yearly earnings premium", value: premium > 0 ? usd(premium) : "none" },
      { label: "Payback time", value: years(payback) },
      { label: "Premium over a 40-year career", value: premium > 0 ? usd(premium * 40 - total) : "negative" },
    ];
    if (payback <= 8) return { result: "fast", lines };
    if (payback <= 16) return { result: "slow", lines };
    return { result: "weak", lines };
  },

  /** Master's payback: same logic, with part-time study keeping your salary. */
  mastersPayback: (v) => {
    const cost = pos(v.cost);
    const months = pos(v.months) || 24;
    const now = pos(v.salaryNow);
    const after = pos(v.salaryAfter);
    if (!now || !after) return { result: "missing", lines: [] };
    const forgone = v.fullTime >= 1 ? (months / 12) * now : 0;
    const total = cost + forgone;
    const premium = after - now;
    const payback = premium > 0 ? total / premium : 999;
    const lines = [
      { label: "Tuition and fees", value: usd(cost) },
      { label: "Salary you give up", value: usd(forgone) },
      { label: "Yearly raise you expect from the degree", value: premium > 0 ? usd(premium) : "none" },
      { label: "Payback time", value: years(payback) },
    ];
    if (payback <= 4) return { result: "fast", lines };
    if (payback <= 10) return { result: "slow", lines };
    return { result: "weak", lines };
  },

  /** Runway: (savings + severance) ÷ (monthly spending − monthly income while between jobs). */
  savingsRunway: (v) => {
    const pot = pos(v.savings) + pos(v.severance);
    const spend = pos(v.spending);
    const income = pos(v.income);
    if (!spend) return { result: "missing", lines: [] };
    const burn = spend - income;
    if (burn <= 0) {
      return { result: "covered", lines: [{ label: "Monthly gap", value: "none: income covers spending" }] };
    }
    const months = pot / burn;
    const trimmed = pot / Math.max(1, spend * 0.85 - income);
    const lines = [
      { label: "Money you can draw on", value: usd(pot) },
      { label: "Monthly gap to cover", value: usd(burn) },
      { label: "Your runway", value: `${months.toFixed(1)} months` },
      { label: "If you cut spending 15%", value: `${trimmed.toFixed(1)} months` },
    ];
    if (months < 3) return { result: "short", lines };
    if (months < 6) return { result: "medium", lines };
    return { result: "long", lines };
  },

  /**
   * Emergency fund target: 3 months of essential expenses, plus a month for each risk
   * factor (one income, unstable or commission/freelance pay, dependents, a job search in
   * a slow field): at most 8 months.
   */
  savingsTarget: (v) => {
    const essentials = pos(v.essentials);
    if (!essentials) return { result: "missing", lines: [] };
    const months = Math.min(8, 3 + (v.oneIncome >= 1 ? 1 : 0) + (v.stability >= 1 ? v.stability : 0) + (v.dependents >= 1 ? 1 : 0) + (v.slowSearch >= 1 ? 1 : 0));
    const target = months * essentials;
    const have = pos(v.saved);
    const gap = Math.max(0, target - have);
    const lines = [
      { label: "Months of essentials to hold", value: `${months}` },
      { label: "Your target", value: usd(target) },
      { label: "Still to save", value: usd(gap) },
      { label: "Monthly to get there in a year", value: usd(gap / 12) },
    ];
    if (have >= target) return { result: "funded", lines };
    if (have >= target / 3) return { result: "partway", lines };
    return { result: "start", lines };
  },

  /** Raise: new pay, raise in money, the raise after inflation, and the saved share of it. */
  raise: (v) => {
    const pay = pos(v.salary);
    const pct = Number.isFinite(v.percent) ? v.percent : 0;
    const infl = Number.isFinite(v.inflation) ? v.inflation : 3;
    const keep = Math.min(100, Math.max(0, Number.isFinite(v.keep) ? v.keep : 50));
    if (!pay) return { result: "missing", lines: [] };
    const next = pay * (1 + pct / 100);
    const diff = next - pay;
    const real = ((1 + pct / 100) / (1 + infl / 100) - 1) * 100;
    const lines = [
      { label: "New yearly pay", value: usd(next) },
      { label: "Raise per year / per month", value: `${usd(diff)} / ${usd(diff / 12)}` },
      { label: "New hourly (2,080 hours)", value: `$${(next / 2080).toFixed(2)}` },
      { label: "Raise after inflation", value: `${real >= 0 ? "+" : ""}${real.toFixed(1)}%` },
      { label: `Save ${keep}% of the raise`, value: `${usd((diff / 12) * (keep / 100))} a month` },
    ];
    if (real >= 1) return { result: "real", lines };
    if (real >= 0) return { result: "flat", lines };
    return { result: "cut", lines };
  },

  /**
   * Freelance rate: the take-home goal grossed up for tax, plus business costs (deductible,
   * so not grossed up), divided by the hours you can actually bill in a year.
   */
  freelanceRate: (v) => {
    const goal = pos(v.income);
    const costs = pos(v.costs);
    const tax = Math.min(60, Math.max(0, Number.isFinite(v.tax) ? v.tax : 30));
    const hours = pos(v.hours);
    const weeksOff = Math.min(20, Math.max(0, Number.isFinite(v.weeksOff) ? v.weeksOff : 6));
    if (!goal || !hours) return { result: "missing", lines: [] };
    const billable = hours * (52 - weeksOff);
    const gross = goal / (1 - tax / 100) + costs;
    const hourly = gross / billable;
    const lines = [
      { label: "Billable hours a year", value: Math.round(billable).toLocaleString("en-US") },
      { label: "Revenue you need", value: usd(gross) },
      { label: "Minimum hourly rate", value: `$${Math.ceil(hourly)}` },
      { label: "Day rate (7 billable hours)", value: usd(hourly * 7) },
      { label: "A 20-hour project at that rate", value: usd(hourly * 20) },
    ];
    if (hours > 32) return { result: "too-many-hours", lines };
    return { result: "rate", lines };
  },

  /**
   * Logo price: estimated hours for the scope × an hourly rate (yours, or a typical rate for
   * the experience level), with a ±20% range.
   */
  logoPrice: (v) => {
    const rate = pos(v.rate) || [0, 25, 50, 90][Math.round(v.level)] || 25;
    const concepts = Math.max(1, Math.round(v.concepts || 3));
    const rounds = Math.max(0, Math.round(Number.isFinite(v.rounds) ? v.rounds : 2));
    const kit = v.kit >= 1;
    const hours = 4 + concepts * 3 + rounds * 2 + (kit ? 8 : 0) + (v.client >= 2 ? 4 : 0);
    const mid = hours * rate;
    const lines = [
      { label: "Hours this scope usually takes", value: `${hours}` },
      { label: "Hourly rate used", value: `$${rate}` },
      { label: "Quote range", value: `${usd(mid * 0.8)} – ${usd(mid * 1.2)}` },
      { label: "Deposit before you start (50%)", value: usd(mid / 2) },
    ];
    if (mid < 300) return { result: "low", lines };
    if (mid < 1500) return { result: "mid", lines };
    return { result: "high", lines };
  },
};
