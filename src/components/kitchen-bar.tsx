"use client";

import { useEffect, useState } from "react";
import {
  clockLabel,
  countdown,
  getKitchenStatus,
  type KitchenStatus,
} from "@/lib/kitchen";

const candles = ["🔥", "🕯", "✦"];

export function KitchenBar({
  initial,
  initialClock,
}: {
  /** Computed on the server so the widget is visible before hydration. */
  initial?: KitchenStatus;
  initialClock?: string;
}) {
  const [status, setStatus] = useState<KitchenStatus | null>(initial ?? null);
  const [clock, setClock] = useState(initialClock ?? "");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setStatus(getKitchenStatus(now));
      setClock(clockLabel(now));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!status) {
    return <div className="h-[104px] border-y border-cream/10 bg-coal" />;
  }

  return (
    <div className="relative overflow-hidden border-y border-cream/10 bg-coal">
      <div
        className={`absolute inset-0 opacity-25 transition-opacity duration-1000 ${
          status.isOpen ? "glow-gold" : ""
        }`}
      />
      <div className="shell relative grid gap-6 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {/* OPEN / CLOSED */}
        <div className="flex items-center gap-4">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border text-lg ${
              status.isOpen
                ? "border-olive/60 bg-olive/10 text-olive"
                : "border-clay/50 bg-clay/10 text-clay"
            }`}
          >
            {status.isOpen ? "🔥" : "🌙"}
          </span>
          <div>
            <p className="flex items-center gap-2 font-display text-base" suppressHydrationWarning>
              {status.headline}
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status.isOpen ? "bg-olive pulse-ring" : "bg-clay"
                }`}
              />
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-cream/45" suppressHydrationWarning>
              {status.detail}
            </p>
          </div>
        </div>

        {/* CLOCK */}
        <div className="flex items-center gap-4 sm:border-l sm:border-cream/10 sm:pl-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cream/15 text-base">
            🕐
          </span>
          <div>
            <p className="font-display text-base tabular-nums" suppressHydrationWarning>
              {clock || "--:--:--"}
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-cream/45" suppressHydrationWarning>
              {status.isOpen
                ? `${countdown(status.minutesUntilChange)} of service left`
                : `Opens in ${countdown(status.minutesUntilChange)}`}
            </p>
          </div>
        </div>

        {/* TANDOOR */}
        <div className="flex items-center gap-4 sm:border-l sm:border-cream/10 sm:pl-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-clay/40 bg-clay/5 text-base">
            {candles[status.tandoorCelsius % candles.length]}
          </span>
          <div>
            <p className="font-display text-base tabular-nums text-gold" suppressHydrationWarning>
              {status.tandoorCelsius}°C
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-cream/45">
              Clay oven temperature
            </p>
          </div>
        </div>

        {/* WAIT */}
        <div className="flex items-center gap-4 sm:border-l sm:border-cream/10 sm:pl-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/5 text-base">
            ⏱
          </span>
          <div>
            <p className="font-display text-base tabular-nums" suppressHydrationWarning>
              {status.isOpen ? `~${status.waitMinutes} min` : "Pre-order"}
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-cream/45" suppressHydrationWarning>
              {status.isOpen ? "Current wait for a table" : `${status.platesToday} plates yesterday`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
