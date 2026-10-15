"use client";

import { useState } from "react";
import { budgets, eventTypes, occasions, seatingOptions } from "@/lib/site";
import { todayISO } from "@/lib/site";

type Variant = "general" | "event";

const config: Record<
  Variant,
  { kind: string; title: string; intro: string; cta: string; success: string }
> = {
  general: {
    kind: "general",
    title: "Questions, feedback, careers?",
    intro: "We reply within one working day. Press enquiries welcome too.",
    cta: "Send message",
    success: "Thank you — your message is with us. We reply within one working day.",
  },
  event: {
    kind: "event",
    title: "Tell us about your event",
    intro:
      "Share the date, the guest count and the vibe. Our events desk will send a proposal and a tasting invite.",
    cta: "Request proposal",
    success:
      "Proposal requested. Our events desk will be in touch within 24 hours with availability and a tasting invite.",
  },
};

export function EnquiryForm({ variant = "general" }: { variant?: Variant }) {
  const copy = config[variant];
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(new FormData(form).entries()),
          kind: copy.kind,
        }),
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
      <p className="eyebrow">{variant === "event" ? "Enquiry" : "Contact"}</p>
      <h2 className="display mt-3 text-3xl">{copy.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-cream/55">{copy.intro}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${variant}-name`}>
            Name
          </label>
          <input
            id={`${variant}-name`}
            name="name"
            required
            className="field"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="label" htmlFor={`${variant}-email`}>
            Email
          </label>
          <input
            id={`${variant}-email`}
            name="email"
            type="email"
            required
            className="field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label" htmlFor={`${variant}-phone`}>
            Phone
          </label>
          <input
            id={`${variant}-phone`}
            name="phone"
            className="field"
            placeholder="+92 300 0000000"
          />
        </div>

        {variant === "general" ? (
          <div>
            <label className="label" htmlFor={`${variant}-subject`}>
              Subject
            </label>
            <input
              id={`${variant}-subject`}
              name="subject"
              className="field"
              placeholder="Catering, feedback, careers…"
            />
          </div>
        ) : (
          <div>
            <label className="label" htmlFor={`${variant}-type`}>
              Type of event
            </label>
            <select
              id={`${variant}-type`}
              name="eventType"
              className="field"
              defaultValue={eventTypes[0]}
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {variant === "event" ? (
          <>
            <div>
              <label className="label" htmlFor={`${variant}-guests`}>
                Guest count
              </label>
              <input
                id={`${variant}-guests`}
                name="guests"
                type="number"
                min={10}
                className="field"
                placeholder="150"
              />
            </div>
            <div>
              <label className="label" htmlFor={`${variant}-date`}>
                Preferred date
              </label>
              <input
                id={`${variant}-date`}
                name="eventDate"
                type="date"
                min={todayISO()}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor={`${variant}-budget`}>
                Budget per head
              </label>
              <select
                id={`${variant}-budget`}
                name="budget"
                className="field"
                defaultValue={budgets[budgets.length - 1]}
              >
                {budgets.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor={`${variant}-venue`}>
                Venue preference
              </label>
              <select id={`${variant}-venue`} name="seating" className="field">
                {["At Zaiqa", "At our own venue", "Outdoor / marquee", "Not sure yet"].map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ),
                )}
              </select>
            </div>
          </>
        ) : (
          <div>
            <label className="label" htmlFor={`${variant}-seating`}>
              Seating preference
            </label>
            <select
              id={`${variant}-seating`}
              name="seating"
              className="field"
              defaultValue={seatingOptions[0]}
            >
              {seatingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="label" htmlFor={`${variant}-body`}>
            {variant === "event" ? "Tell us the plan" : "Message"}
          </label>
          <textarea
            id={`${variant}-body`}
            name="body"
            rows={variant === "event" ? 5 : 6}
            required
            className="field resize-none"
            placeholder={
              variant === "event"
                ? "Roughly how many guests, indoor or outdoor, and anything you definitely want on the menu…"
                : "Tell us what you need…"
            }
          />
        </div>
      </div>

      {status === "success" ? (
        <p className="mt-6 rounded-xl border border-olive/50 bg-olive/10 px-4 py-3 text-sm text-olive">
          {copy.success}
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
        {status === "loading" ? "Sending…" : copy.cta}
      </button>

      {variant === "general" ? (
        <p className="mt-6 text-xs leading-relaxed text-cream/40">
          For a table booking it is faster to use the{" "}
          <span className="text-gold">reservations</span> form — those go straight to the
          front desk.
        </p>
      ) : (
        <p className="mt-6 text-xs leading-relaxed text-cream/40">
          Occasions we regularly host: {occasions.slice(1).join(", ")}.
        </p>
      )}
    </form>
  );
}
