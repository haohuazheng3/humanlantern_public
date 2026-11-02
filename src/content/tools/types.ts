/**
 * Interactive tools that sit at the top of a guide (the "tool-first" pages).
 *
 * A tool is plain data, so the server hands the one tool a page needs to the client
 * renderer as props: no page ships the other tools. Every result ends the same way the
 * Situation Finder does: an honest verdict, the first move, and the chapter that holds
 * the full playbook.
 */

export type Tone = "good" | "mixed" | "low" | "stop";

/** The obvious next step after a tool (e.g. picked prompts → write the answers). */
export interface ToolNext {
  href: string;
  label: string;
}

export interface ToolResult {
  id: string;
  /** The verdict in a few words: "She's interested." */
  title: string;
  /** One or two sentences: the honest read of the answers. */
  verdict: string;
  /** What to do now. */
  move: string;
  /** Optional exact words to adapt. */
  say?: string;
  /** Book chapter with the full playbook, e.g. "5.1". */
  chapter: string;
  tone: Tone;
  /** Overrides the tool's next step for this result. */
  next?: ToolNext;
  /** Hide the book card, e.g. on a result that points to crisis support. */
  noBook?: boolean;
}

export interface QuizOption {
  label: string;
  points: number;
  /** A deciding answer (e.g. she said no): sends straight to `flags[flag]`. */
  flag?: string;
}

export interface QuizQuestion {
  q: string;
  help?: string;
  /** For two-axis quizzes: which axis this question's points count toward. */
  axis?: "x" | "y";
  options: QuizOption[];
}

/**
 * Two-axis scoring (e.g. attachment anxiety × avoidance). Each axis total is compared
 * with its cut-off (high = total ≥ cut) and the pair picks one of four results.
 */
export interface QuizAxes {
  cut: { x: number; y: number };
  cells: { lowLow: string; highLow: string; lowHigh: string; highHigh: string };
}

export interface QuizTool {
  kind: "quiz";
  id: string;
  name: string;
  /** One line under the tool name. */
  intro: string;
  questions: QuizQuestion[];
  /** Score ranges (inclusive) → result id. Scores are the sum of the chosen points. */
  bands: { min: number; max: number; result: string }[];
  /** When set, results come from the two axis totals instead of `bands`. */
  axes?: QuizAxes;
  /** flag → result id, checked in this order before the score. */
  flags?: { flag: string; result: string }[];
  results: ToolResult[];
  /** How the score works, shown under the result. */
  method: string;
  next?: ToolNext;
  /** Health or wellbeing answers: analytics record that the quiz was finished, never the result. */
  private?: boolean;
}

export interface DecisionNode {
  id: string;
  q: string;
  help?: string;
  /** `next` is another node id, or "result:<id>". */
  options: { label: string; next: string }[];
}

export interface DecisionTool {
  kind: "decision";
  id: string;
  name: string;
  intro: string;
  start: string;
  nodes: DecisionNode[];
  results: ToolResult[];
  method: string;
  next?: ToolNext;
}

export interface CalcInput {
  id: string;
  label: string;
  help?: string;
  type: "number" | "select";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** null leaves an optional number field empty. */
  default: number | null;
  /** For selects: value is a number the formula reads. */
  options?: { label: string; value: number }[];
}

/** Calculators are fixed formulas implemented in the renderer; the data only names one. */
export type Formula =
  | "severance"
  | "degreePayback"
  | "mastersPayback"
  | "savingsRunway"
  | "savingsTarget"
  | "raise"
  | "freelanceRate"
  | "logoPrice";

export interface CalculatorTool {
  kind: "calculator";
  id: string;
  name: string;
  intro: string;
  formula: Formula;
  inputs: CalcInput[];
  /** Results the formula can point to (by id), each with the honest framing. */
  results: ToolResult[];
  method: string;
  next?: ToolNext;
}

export interface GeneratorItem {
  text: string;
  /** Filter values this item belongs to. Items without a value for a filter match any choice. */
  tags: string[];
  /** Why it works, one short line. */
  why?: string;
  /** Catalog group id (see GeneratorTool.catalog). */
  group?: string;
}

/**
 * The full list, rendered on the server below the tool: grouped by the moments people
 * search for, so every item is readable (and indexable) without using the tool.
 */
export interface GeneratorCatalog {
  /** Section heading, e.g. "All 80 flirty texts, by moment". */
  title: string;
  intro?: string;
  /** Group by an existing filter's values instead of item.group. */
  groupBy?: string;
  /** heading = the searched phrase (H3); label = the short jump-chip text. */
  groups: { id: string; heading: string; label?: string; intro?: string }[];
}

export interface GeneratorTool {
  kind: "generator";
  id: string;
  name: string;
  intro: string;
  filters: { id: string; label: string; options: { value: string; label: string }[] }[];
  items: GeneratorItem[];
  /** How many to show at once. */
  show: number;
  /** Items are things to send or say: offer a copy button. */
  copyable: boolean;
  /** Shown under the list. */
  note: string;
  /** Label of the per-item explanation toggle (default "Why it works"). */
  whyLabel?: string;
  /** A checklist: keep the authored order, show every match and no "shuffle" button. */
  ordered?: boolean;
  next?: ToolNext;
  catalog?: GeneratorCatalog;
  chapter: string;
}

export interface CheckerRule {
  id: string;
  /** Regex source tested against the text (case-insensitive), or a length rule. */
  test: { pattern?: string; minChars?: number; maxChars?: number; minMatches?: number };
  /** true: the rule passing is good (e.g. "mentions a specific plan"); false: passing is a problem. */
  good: boolean;
  weight: number;
  label: string;
  fix: string;
}

export interface CheckerTool {
  kind: "checker";
  id: string;
  name: string;
  intro: string;
  input: { label: string; placeholder: string; maxLength: number };
  rules: CheckerRule[];
  /** Score bands (0–100) → result id. */
  bands: { min: number; max: number; result: string }[];
  results: ToolResult[];
  method: string;
  next?: ToolNext;
}

/**
 * How much of a task today's AI tools can carry: "automate" = a tool can already produce
 * work you'd accept with a quick check; "assist" = it drafts or speeds the task, a person
 * still decides; "human" = presence, trust, hands or accountability the task can't do without.
 */
export type Exposure = "automate" | "assist" | "human";

export interface AuditTask {
  task: string;
  exposure: Exposure;
  /** One line: why the task sits in its band. */
  why: string;
}

/**
 * Task audit: the reader says how much of a normal week each task takes; the tool adds up
 * the share AI can already do, the share it drafts for a person to finish, and the share
 * that stays human, then picks a result from the AI-carried share (automate + half of assist).
 */
export interface AuditTool {
  kind: "audit";
  id: string;
  name: string;
  intro: string;
  tasks: AuditTask[];
  /** AI-carried share in percent (0–100) → result id. */
  bands: { min: number; max: number; result: string }[];
  results: ToolResult[];
  method: string;
  next?: ToolNext;
}

export type Tool = QuizTool | DecisionTool | CalculatorTool | GeneratorTool | CheckerTool | AuditTool;
