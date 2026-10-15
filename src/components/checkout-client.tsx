"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { orderPolicies, pickupSlots, site, todayISO } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

export function CheckoutClient() {
  const { lines, subtotal, deliveryFee, total, setQty, remove, clear, ready } = useCart();
  const [fulfilment, setFulfilment] = useState<"pickup" | "delivery">("pickup");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ ref: string; total: number; items: number } | null>(
    null,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) {
      setError("Your bag is empty — add a dish or two first.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fulfilment,
          items: lines.map((line) => ({ id: line.id, qty: line.qty })),
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        order?: { id: number; total: number };
      };

      if (!response.ok || !payload.ok || !payload.order) {
        setError(payload.error ?? "We could not place that order.");
        setStatus("error");
        return;
      }

      setReceipt({
        ref: `ZQO-${String(payload.order.id).padStart(4, "0")}`,
        total: payload.order.total,
        items: lines.reduce((sum, line) => sum + line.qty, 0),
      });
      clear();
      form.reset();
      setStatus("success");
    } catch {
      setError("Network problem. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success" && receipt) {
    return (
      <div className="card grain relative overflow-hidden p-10 text-center sm:p-14">
        <div className="glow-gold absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2" />
        <div className="relative">
          <span className="pulse-ring mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/50 text-3xl text-gold">
            ✓
          </span>
          <h2 className="display mt-7 text-3xl">Order placed</h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            Reference{" "}
            <span className="font-display text-lg text-gold">{receipt.ref}</span> ·{" "}
            {receipt.items} items · Rs {receipt.total.toLocaleString("en-PK")}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/55">
            The kitchen has your ticket. Our front desk will call to confirm{" "}
            {fulfilment === "delivery" ? "the delivery window" : "your pickup time"} shortly.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setReceipt(null);
              }}
              className="btn-gold"
            >
              Order something else
            </button>
            <Link href="/menu" className="btn-ghost">
              Back to the menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="card p-12 text-center text-sm text-cream/50">Loading your bag…</div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="card p-12 text-center sm:p-16">
        <span className="text-5xl">🛍</span>
        <h2 className="display mt-6 text-3xl">Your bag is empty</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/55">
          Pick a karahi, add bread, and do not skip the kheer. Everything is cooked to
          order, so nothing sits around waiting.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="/menu" className="btn-gold">
            Browse the menu
          </Link>
          <Link href="/reservations" className="btn-ghost">
            Reserve a table instead
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      {/* BAG */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
          <h2 className="display text-2xl">Your bag</h2>
          <button
            type="button"
            onClick={clear}
            className="text-[0.62rem] uppercase tracking-[0.18em] text-cream/40 transition hover:text-clay"
          >
            Empty bag
          </button>
        </div>
        <ul className="divide-y divide-cream/5">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-4 p-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                {line.imageUrl ? (
                  <Image
                    src={line.imageUrl}
                    alt={line.name}
                    fill
                    sizes="90px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-ash" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-base leading-snug">{line.name}</p>
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    aria-label={`Remove ${line.name}`}
                    className="text-cream/35 transition hover:text-clay"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-1 text-xs text-cream/45">
                  Rs {line.price.toLocaleString("en-PK")} each
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 rounded-full border border-cream/15 p-1">
                    <button
                      type="button"
                      aria-label="Decrease"
                      onClick={() => setQty(line.id, line.qty - 1)}
                      className="grid h-7 w-7 place-items-center rounded-full text-cream/70 transition hover:bg-cream/10 hover:text-gold"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{line.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase"
                      onClick={() => setQty(line.id, line.qty + 1)}
                      className="grid h-7 w-7 place-items-center rounded-full text-cream/70 transition hover:bg-cream/10 hover:text-gold"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-display text-base text-gold">
                    Rs {(line.price * line.qty).toLocaleString("en-PK")}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="space-y-3 border-t border-cream/10 px-6 py-5 text-sm">
          <div className="flex justify-between text-cream/65">
            <span>Subtotal</span>
            <span>Rs {subtotal.toLocaleString("en-PK")}</span>
          </div>
          <div className="flex justify-between text-cream/65">
            <span>{fulfilment === "delivery" ? "Delivery" : "Pickup"}</span>
            <span className={deliveryFee === 0 ? "text-olive" : ""}>
              {deliveryFee === 0
                ? "Free"
                : `Rs ${deliveryFee.toLocaleString("en-PK")}`}
            </span>
          </div>
          {subtotal < site.freeDeliveryOver && fulfilment === "delivery" ? (
            <p className="rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 text-xs text-gold-soft">
              Add Rs {(site.freeDeliveryOver - subtotal).toLocaleString("en-PK")} more for
              free delivery.
            </p>
          ) : null}
          <div className="flex items-baseline justify-between border-t border-cream/10 pt-4">
            <span className="eyebrow !text-[0.65rem]">Total</span>
            <span className="display text-2xl text-gold">
              Rs {total.toLocaleString("en-PK")}
            </span>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <form onSubmit={onSubmit} className="card p-7 sm:p-8">
        <h2 className="display text-2xl">How do you want it?</h2>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {(["pickup", "delivery"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFulfilment(mode)}
              className={`rounded-2xl border p-4 text-left transition ${
                fulfilment === mode
                  ? "border-gold bg-gold/10"
                  : "border-cream/12 hover:border-cream/25"
              }`}
            >
              <span className="block font-display text-base capitalize">{mode}</span>
              <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.16em] text-cream/45">
                {mode === "pickup" ? "Ready in ~25 min" : site.deliveryRadius}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="o-name">
              Name
            </label>
            <input id="o-name" name="customerName" required className="field" placeholder="Your name" />
          </div>
          <div>
            <label className="label" htmlFor="o-phone">
              Phone
            </label>
            <input id="o-phone" name="phone" required className="field" placeholder="+92 300 0000000" />
          </div>
          <div>
            <label className="label" htmlFor="o-email">
              Email
            </label>
            <input
              id="o-email"
              name="email"
              type="email"
              required
              className="field"
              placeholder="you@example.com"
            />
          </div>

          {fulfilment === "delivery" ? (
            <div className="sm:col-span-2">
              <label className="label" htmlFor="o-address">
                Delivery address
              </label>
              <textarea
                id="o-address"
                name="address"
                rows={3}
                required
                className="field resize-none"
                placeholder="House / flat, street, landmark…"
              />
            </div>
          ) : null}

          <div className="sm:col-span-2">
            <label className="label" htmlFor="o-when">
              When
            </label>
            <select id="o-when" name="scheduledFor" className="field" defaultValue={pickupSlots[0]}>
              {pickupSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="o-pay">
              Payment
            </label>
            <select id="o-pay" name="paymentMethod" className="field" defaultValue="cash">
              <option value="cash">Cash on {fulfilment}</option>
              <option value="card">Card at the counter</option>
              <option value="transfer">Bank transfer / JazzCash</option>
            </select>
          </div>
        </div>

        {status === "error" ? (
          <p className="mt-6 rounded-xl border border-clay/50 bg-clay/10 px-4 py-3 text-sm text-clay">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-gold mt-7 w-full disabled:opacity-60"
        >
          {status === "loading"
            ? "Placing order…"
            : `Place order · Rs ${total.toLocaleString("en-PK")}`}
        </button>

        <ul className="mt-7 space-y-2.5 text-xs leading-relaxed text-cream/45">
          {orderPolicies.map((policy) => (
            <li key={policy} className="flex gap-2.5">
              <span className="text-gold">◆</span>
              {policy}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.6rem] uppercase tracking-[0.18em] text-cream/30">
          Ordered on {todayISO()}
        </p>
      </form>
    </div>
  );
}
