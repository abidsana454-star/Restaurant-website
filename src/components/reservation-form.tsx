"use client";

import { useState } from "react";
import Link from "next/link";
import { occasions, seatingOptions, timeSlots, todayISO } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

export function ReservationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<{
    reference: string;
    date: string;
    time: string;
    guests: number;
  } | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        reservation?: { id: number; date: string; time: string; guests: number };
      };

      if (!response.ok || !payload.ok || !payload.reservation) {
        setError(payload.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setBooking({
        reference: `ZQ-${String(payload.reservation.id).padStart(4, "0")}`,
        date: payload.reservation.date,
        time: payload.reservation.time,
        guests: payload.reservation.guests,
      });
      form.reset();
      setStatus("success");
    } catch {
      setError("Network problem. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success" && booking) {
    return (
      <div className="card grain relative overflow-hidden p-10 text-center sm:p-14">
        <div className="glow-gold absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2" />
        <div className="relative">
          <span className="pulse-ring mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/50 text-3xl text-gold">
            ✓
          </span>
          <h2 className="display mt-7 text-3xl">Table requested</h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            Reference <span className="font-display text-lg text-gold">{booking.reference}</span>{" "}
            · {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-cream/55">
            We have you down for {booking.date} at {booking.time}. The front desk will
            confirm by phone or email the same day.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setBooking(null);
              }}
              className="btn-gold"
            >
              Make another booking
            </button>
            <Link href="/order" className="btn-ghost">
              Pre-order your food
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-8 sm:p-10">
      <div className="flex items-center gap-3">
        <p className="eyebrow">Reservations</p>
        <span className="h-px flex-1 bg-cream/10" />
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input id="name" name="name" required className="field" placeholder="Ayesha Khan" />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            required
            className="field"
            placeholder="+92 300 0000000"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            min={todayISO()}
            defaultValue={todayISO()}
            className="field"
          />
        </div>
        <div>
          <label className="label" htmlFor="time">
            Time
          </label>
          <select id="time" name="time" required className="field" defaultValue="8:30 PM">
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="guests">
            Guests
          </label>
          <select id="guests" name="guests" required className="field" defaultValue="2">
            {Array.from({ length: 8 }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1} {index === 0 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="seating">
            Where would you like to sit?
          </label>
          <select id="seating" name="seating" className="field" defaultValue={seatingOptions[0]}>
            {seatingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="occasion">
            Occasion
          </label>
          <select id="occasion" name="occasion" className="field" defaultValue={occasions[0]}>
            {occasions.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="notes">
            Anything we should know?
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="field resize-none"
            placeholder="High chair needed, nut allergy, window table if possible…"
          />
        </div>
      </div>

      {status === "error" ? (
        <p className="mt-6 rounded-xl border border-clay/50 bg-clay/10 px-4 py-3 text-sm text-clay">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-gold disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Request table"}
        </button>
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-cream/40">
          No booking fee, no deposit
        </p>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-cream/40">
        By booking you accept our table policy: held for 20 minutes, free cancellation up
        to 2 hours before. For groups of 9+ please{" "}
        <Link href="/events" className="text-gold">
          contact our events desk
        </Link>
        .
      </p>
    </form>
  );
}
