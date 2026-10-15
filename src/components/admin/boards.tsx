"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { formatDateLabel, formatPrice } from "@/lib/site";
import type { Enquiry, Order, Reservation } from "@/db/schema";
import type { MenuItemWithCategory } from "@/lib/queries";
import type { Category } from "@/db/schema";

function useAction() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  async function run(url: string, init: RequestInit) {
    setBusy(true);
    await fetch(url, init);
    setBusy(false);
    startTransition(() => router.refresh());
  }

  return { run, loading: busy || pending };
}

const resStatuses = ["pending", "confirmed", "seated", "cancelled"] as const;
const resStyle: Record<string, string> = {
  pending: "border-gold/50 bg-gold/10 text-gold",
  confirmed: "border-olive/50 bg-olive/10 text-olive",
  seated: "border-cream/30 bg-cream/10 text-cream",
  cancelled: "border-clay/50 bg-clay/10 text-clay",
};

const orderStatuses = [
  "received",
  "cooking",
  "ready",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;
const orderStyle: Record<string, string> = {
  received: "border-gold/50 bg-gold/10 text-gold",
  cooking: "border-clay/50 bg-clay/10 text-clay",
  ready: "border-cream/30 bg-cream/10 text-cream",
  "out-for-delivery": "border-gold-soft/50 bg-gold-soft/10 text-gold-soft",
  delivered: "border-olive/50 bg-olive/10 text-olive",
  cancelled: "border-clay/50 bg-clay/10 text-clay",
};

function Pill({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-[0.58rem] uppercase tracking-[0.16em] ${tone}`}
    >
      {label}
    </span>
  );
}

function PillButton({
  label,
  onClick,
  loading,
  tone = "neutral",
}: {
  label: string;
  onClick: () => void;
  loading: boolean;
  tone?: "neutral" | "danger";
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.16em] transition disabled:opacity-50 ${
        tone === "danger"
          ? "border-clay/40 text-clay hover:bg-clay/10"
          : "border-cream/15 text-cream/70 hover:border-gold hover:text-gold"
      }`}
    >
      {label}
    </button>
  );
}

export function ReservationsBoard({ rows }: { rows: Reservation[] }) {
  const { run, loading } = useAction();

  if (rows.length === 0) {
    return (
      <div className="card p-10 text-center text-sm text-cream/50">
        No bookings yet. New reservations from the website appear here instantly.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="hidden grid-cols-[1.3fr_1fr_0.6fr_0.9fr_1.4fr] gap-4 border-b border-cream/10 px-6 py-4 text-[0.6rem] uppercase tracking-[0.2em] text-cream/40 lg:grid">
        <span>Guest</span>
        <span>When</span>
        <span>Guests</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <ul className="divide-y divide-cream/5">
        {rows.map((row) => (
          <li
            key={row.id}
            className="grid gap-4 px-6 py-5 text-sm lg:grid-cols-[1.3fr_1fr_0.6fr_0.9fr_1.4fr] lg:items-center"
          >
            <div>
              <p className="font-display text-base">{row.name}</p>
              <p className="text-xs text-cream/45">{row.email}</p>
              <p className="text-xs text-cream/45">{row.phone}</p>
              <p className="mt-1 text-[0.55rem] uppercase tracking-[0.18em] text-cream/30">
                Ref ZQ-{String(row.id).padStart(4, "0")}
              </p>
            </div>
            <div>
              <p>{formatDateLabel(row.date)}</p>
              <p className="text-gold">{row.time}</p>
              {row.seating ? <p className="text-xs text-cream/40">{row.seating}</p> : null}
            </div>
            <div>{row.guests}</div>
            <div>
              <Pill label={row.status} tone={resStyle[row.status] ?? resStyle.pending} />
            </div>
            <div className="flex flex-wrap gap-2">
              {resStatuses
                .filter((status) => status !== row.status)
                .map((status) => (
                  <PillButton
                    key={status}
                    label={status}
                    loading={loading}
                    onClick={() =>
                      run(`/api/reservations/${row.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status }),
                      })
                    }
                  />
                ))}
              <PillButton
                label="Delete"
                tone="danger"
                loading={loading}
                onClick={() => run(`/api/reservations/${row.id}`, { method: "DELETE" })}
              />
            </div>
            {row.occasion || row.notes ? (
              <p className="text-xs italic leading-relaxed text-cream/45 lg:col-span-5">
                {row.occasion ? <span className="not-italic text-gold">{row.occasion} · </span> : null}
                {row.notes ? `“${row.notes}”` : null}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OrdersBoard({ rows }: { rows: Order[] }) {
  const { run, loading } = useAction();

  if (rows.length === 0) {
    return (
      <div className="card p-10 text-center text-sm text-cream/50">
        No online orders yet. Pickup and delivery orders land here as soon as they are placed.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="hidden grid-cols-[1.3fr_1.6fr_0.9fr_0.9fr_1.2fr] gap-4 border-b border-cream/10 px-6 py-4 text-[0.6rem] uppercase tracking-[0.2em] text-cream/40 lg:grid">
        <span>Customer</span>
        <span>Items</span>
        <span>Total</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <ul className="divide-y divide-cream/5">
        {rows.map((row) => (
          <li
            key={row.id}
            className="grid gap-4 px-6 py-5 text-sm lg:grid-cols-[1.3fr_1.6fr_0.9fr_0.9fr_1.2fr] lg:items-center"
          >
            <div>
              <p className="font-display text-base">{row.customerName}</p>
              <p className="text-xs text-cream/45">{row.phone}</p>
              <p className="text-xs text-cream/45">{row.email}</p>
              <p className="mt-1 text-[0.55rem] uppercase tracking-[0.18em] text-cream/30">
                {row.fulfilment === "delivery" ? "🛵 Delivery" : "🏃 Pickup"} · Ref ZQO-
                {String(row.id).padStart(4, "0")}
              </p>
            </div>
            <div className="text-xs text-cream/65">
              <ul className="space-y-0.5">
                {row.items.map((line) => (
                  <li key={`${row.id}-${line.id}`}>
                    {line.qty} × {line.name}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-cream/40">
                {row.scheduledFor ?? "ASAP"}
                {row.address ? ` · ${row.address}` : ""}
                {row.deliveryFee > 0
                  ? ` · delivery ${formatPrice(row.deliveryFee)}`
                  : " · free delivery"}
              </p>
            </div>
            <div>
              <p className="font-display text-base text-gold">{formatPrice(row.total)}</p>
              <p className="text-[0.58rem] uppercase tracking-[0.16em] text-cream/40">
                {row.paymentMethod}
              </p>
            </div>
            <div>
              <Pill label={row.status.replace(/-/g, " ")} tone={orderStyle[row.status] ?? orderStyle.received} />
            </div>
            <div className="flex flex-wrap gap-2">
              {orderStatuses
                .filter((status) => status !== row.status)
                .map((status) => (
                  <PillButton
                    key={status}
                    label={status === "out-for-delivery" ? "out" : status}
                    loading={loading}
                    onClick={() =>
                      run(`/api/orders/${row.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status }),
                      })
                    }
                  />
                ))}
              <PillButton
                label="Delete"
                tone="danger"
                loading={loading}
                onClick={() => run(`/api/orders/${row.id}`, { method: "DELETE" })}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EnquiriesBoard({ rows }: { rows: Enquiry[] }) {
  const { run, loading } = useAction();

  if (rows.length === 0) {
    return (
      <div className="card p-10 text-center text-sm text-cream/50">
        No messages yet. The contact form and events form both send into this list.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {rows.map((row) => (
        <li key={row.id} className={`card p-6 ${row.isRead ? "opacity-60" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-base">{row.name}</p>
              <p className="text-xs text-cream/45">
                {row.email}
                {row.phone ? ` · ${row.phone}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill
                label={row.kind}
                tone="border-gold/50 bg-gold/10 text-gold"
              />
              {row.eventType ? <Pill label={row.eventType} tone="border-cream/20 text-cream/60" /> : null}
              <span className="text-[0.55rem] uppercase tracking-[0.18em] text-cream/35">
                {new Date(row.createdAt).toLocaleString("en-GB")}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.58rem] uppercase tracking-[0.16em] text-cream/40">
            {row.guests ? <span>{row.guests} guests</span> : null}
            {row.budget ? <span>{row.budget}</span> : null}
            {row.eventDate ? <span>{row.eventDate}</span> : null}
            {row.subject ? <span className="text-gold">{row.subject}</span> : null}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-cream/70">{row.body}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <PillButton
              label={`Mark as ${row.isRead ? "unread" : "read"}`}
              loading={loading}
              onClick={() =>
                run(`/api/enquiries/${row.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ isRead: !row.isRead }),
                })
              }
            />
            <a
              href={`mailto:${row.email}?subject=Re: ${encodeURIComponent(
                row.subject ?? row.eventType ?? "your enquiry",
              )}`}
              className="rounded-full border border-cream/15 px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.16em] text-cream/70 transition hover:border-gold hover:text-gold"
            >
              Reply by email
            </a>
            <PillButton
              label="Delete"
              tone="danger"
              loading={loading}
              onClick={() => run(`/api/enquiries/${row.id}`, { method: "DELETE" })}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DishManager({
  items,
  categories,
}: {
  items: MenuItemWithCategory[];
  categories: Category[];
}) {
  const router = useRouter();
  const { run, loading } = useAction();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const response = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await response.json()) as { ok?: boolean; error?: string };

    if (!response.ok || !payload.ok) {
      setError(payload.error ?? "Could not add dish.");
      return;
    }

    setError("");
    form.reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-cream/55">
          {items.length} dishes on the website. Toggle availability, flag signatures, or add
          a new special.
        </p>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="btn-gold !px-5 !py-2.5 !text-[0.62rem]"
        >
          {open ? "Close form" : "Add dish"}
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="card mt-6 grid gap-5 p-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="d-name">
              Dish name
            </label>
            <input id="d-name" name="name" required className="field" placeholder="Anda Shami" />
          </div>
          <div>
            <label className="label" htmlFor="d-category">
              Category
            </label>
            <select id="d-category" name="categoryId" required className="field">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="d-price">
              Price (PKR)
            </label>
            <input
              id="d-price"
              name="price"
              type="number"
              min={1}
              required
              className="field"
              placeholder="1250"
            />
          </div>
          <div>
            <label className="label" htmlFor="d-spice">
              Spice level (0–3)
            </label>
            <input
              id="d-spice"
              name="spiceLevel"
              type="number"
              min={0}
              max={3}
              defaultValue={0}
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="d-prep">
              Prep time (minutes)
            </label>
            <input
              id="d-prep"
              name="prepMinutes"
              type="number"
              min={1}
              defaultValue={20}
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="d-image">
              Image URL (optional)
            </label>
            <input
              id="d-image"
              name="imageUrl"
              className="field"
              placeholder="https://images.pexels.com/…"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="d-desc">
              Description
            </label>
            <textarea
              id="d-desc"
              name="description"
              rows={2}
              required
              className="field resize-none"
              placeholder="What is in it, and how is it cooked?"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="d-story">
              Kitchen story (optional)
            </label>
            <textarea
              id="d-story"
              name="story"
              rows={2}
              className="field resize-none"
              placeholder="Why it tastes the way it does."
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-cream/70">
            <input type="checkbox" name="isVegetarian" className="h-4 w-4 accent-[#e0a94f]" />
            Vegetarian
          </label>
          <label className="flex items-center gap-3 text-sm text-cream/70">
            <input type="checkbox" name="isSignature" className="h-4 w-4 accent-[#e0a94f]" />
            Chef&apos;s signature
          </label>

          {error ? (
            <p className="sm:col-span-2 rounded-xl border border-clay/50 bg-clay/10 px-4 py-3 text-sm text-clay">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold sm:col-span-2 disabled:opacity-60"
          >
            Save dish
          </button>
        </form>
      ) : null}

      <div className="card mt-8 overflow-hidden">
        <ul className="divide-y divide-cream/5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 text-sm"
            >
              <div className="min-w-0">
                <p className="font-display text-base">
                  {item.name}
                  {item.isSignature ? (
                    <span className="ml-2 text-[0.58rem] uppercase tracking-[0.16em] text-gold">
                      ★
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-cream/40">
                  {item.categoryName} · {formatPrice(item.price)} · {item.prepMinutes} min
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    run(`/api/menu/${item.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ isAvailable: !item.isAvailable }),
                    })
                  }
                  className={`rounded-full border px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.16em] transition disabled:opacity-50 ${
                    item.isAvailable
                      ? "border-olive/50 text-olive hover:bg-olive/10"
                      : "border-cream/20 text-cream/50 hover:border-gold hover:text-gold"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Sold out"}
                </button>
                <PillButton
                  label="Signature"
                  loading={loading}
                  onClick={() =>
                    run(`/api/menu/${item.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ isSignature: !item.isSignature }),
                    })
                  }
                />
                <PillButton
                  label="Delete"
                  tone="danger"
                  loading={loading}
                  onClick={() => run(`/api/menu/${item.id}`, { method: "DELETE" })}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/admin/session", { method: "DELETE" });
        router.refresh();
        setLoading(false);
      }}
      className="btn-ghost !px-5 !py-2.5 !text-[0.62rem]"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
