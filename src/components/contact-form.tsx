"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Message could not be sent.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setError("Network problem. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-8 sm:p-10">
      <p className="eyebrow">Send a message</p>
      <h2 className="display mt-3 text-3xl">Questions, feedback, catering?</h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">
            Name
          </label>
          <input id="c-name" name="name" required className="field" placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="c-email">
            Email
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            className="field"
            placeholder="you@example.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="c-subject">
            Subject
          </label>
          <input
            id="c-subject"
            name="subject"
            className="field"
            placeholder="Catering for 150 guests"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="c-body">
            Message
          </label>
          <textarea
            id="c-body"
            name="body"
            rows={6}
            required
            className="field resize-none"
            placeholder="Tell us what you need…"
          />
        </div>
      </div>

      {status === "success" ? (
        <p className="mt-6 rounded-xl border border-olive/50 bg-olive/10 px-4 py-3 text-sm text-olive">
          Thank you — your message is with us. We reply within one working day.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="mt-6 rounded-xl border border-clay/50 bg-clay/10 px-4 py-3 text-sm text-clay">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gold mt-8 disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
