"use client";

import { useState } from "react";
import { track } from "./Consent";

export interface ContactLabels {
  name: string;
  email: string;
  topic: string;
  topics: { order: string; refund: string; book: string; correction: string; other: string };
  message: string;
  send: string;
  sending: string;
  sent: string;
  sentTitle: string;
  another: string;
  error: string;
  invalidEmail: string;
  tooShort: string;
}

type State = { status: "idle" } | { status: "sending" } | { status: "sent"; email: string } | { status: "error"; message: string };

export function ContactForm({ t, replyTime }: { t: ContactLabels; replyTime: string }) {
  const [state, setState] = useState<State>({ status: "idle" });
  const topics = Object.entries(t.topics) as [keyof ContactLabels["topics"], string][];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) return setState({ status: "error", message: t.invalidEmail });
    if ((data.message ?? "").trim().length < 10) return setState({ status: "error", message: t.tooShort });
    setState({ status: "sending" }); // instant feedback, before the network
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) {
        setState({ status: "error", message: t.error });
        return;
      }
      track("contact_submit", { topic: data.topic });
      setState({ status: "sent", email: data.email });
      form.reset();
    } catch {
      setState({ status: "error", message: t.error });
    }
  }

  if (state.status === "sent") {
    return (
      <div className="slab animate-rise p-7 sm:p-9" role="status">
        <p className="tag tag-ok">{t.sentTitle}</p>
        <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-2">{t.sent}</p>
        <p className="mt-2 break-all text-[0.95rem] font-semibold text-ink">{state.email}</p>
        <button type="button" className="btn btn-ghost btn-sm mt-6" onClick={() => setState({ status: "idle" })}>
          {t.another}
        </button>
      </div>
    );
  }

  const sending = state.status === "sending";
  return (
    <form onSubmit={onSubmit} className="slab p-6 sm:p-9" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="field-label">
            {t.name}
          </label>
          <input id="c-name" name="name" autoComplete="name" maxLength={120} className="input" />
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">
            {t.email}
          </label>
          <input id="c-email" name="email" type="email" required autoComplete="email" maxLength={254} className="input" placeholder="you@example.com" />
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="c-topic" className="field-label">
          {t.topic}
        </label>
        <select id="c-topic" name="topic" className="input appearance-none" defaultValue="book">
          {topics.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-5">
        <label htmlFor="c-message" className="field-label">
          {t.message}
        </label>
        <textarea id="c-message" name="message" required minLength={10} maxLength={5000} className="input" />
      </div>
      {/* honeypot: real people never see or fill this */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state.status === "error" ? (
        <p role="alert" className="mt-5 rounded-2xl bg-bad-soft px-4 py-3 text-[0.95rem] text-bad">
          {state.message}
        </p>
      ) : null}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.85rem] text-ink-4">{replyTime}</p>
        <button type="submit" className="btn btn-primary btn-lg shrink-0" aria-disabled={sending} disabled={sending}>
          {sending ? (
            <>
              <span className="spinner" aria-hidden /> {t.sending}
            </>
          ) : (
            t.send
          )}
        </button>
      </div>
    </form>
  );
}
