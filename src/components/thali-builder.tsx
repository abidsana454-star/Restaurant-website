"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-context";
import { Reveal } from "@/components/motion";
import { formatPrice } from "@/lib/site";
import type { Category } from "@/db/schema";
import type { MenuItemWithCategory } from "@/lib/queries";

type Slot = {
  key: string;
  label: string;
  caption: string;
  emoji: string;
  categorySlugs: string[];
};

const slots: Slot[] = [
  {
    key: "base",
    label: "The base",
    caption: "Rice, or nothing at all",
    emoji: "🍚",
    categorySlugs: ["biryani-rice"],
  },
  {
    key: "main",
    label: "The main",
    caption: "One thing to build the plate around",
    emoji: "🥘",
    categorySlugs: ["curries-karahi", "tandoor-grill"],
  },
  {
    key: "bread",
    label: "The bread",
    caption: "Pulled off the clay wall",
    emoji: "🫓",
    categorySlugs: ["breads"],
  },
  {
    key: "starter",
    label: "The starter",
    caption: "Something to open with",
    emoji: "🥗",
    categorySlugs: ["starters"],
  },
  {
    key: "sweet",
    label: "The sweet",
    caption: "How it should end",
    emoji: "🍮",
    categorySlugs: ["desserts"],
  },
  {
    key: "drink",
    label: "The drink",
    caption: "Cool it all down",
    emoji: "🥤",
    categorySlugs: ["beverages"],
  },
];

const COMBO_DISCOUNT = 0.12;

const wedgeColors = ["#e0a94f", "#d2552f", "#93a46a", "#c98a4b", "#b56fa8", "#6f9bb5"];

export function ThaliBuilder({
  items,
  categories,
}: {
  items: MenuItemWithCategory[];
  categories: Category[];
}) {
  const { add } = useCart();
  const [picks, setPicks] = useState<Record<string, MenuItemWithCategory | null>>({});
  const [activeSlot, setActiveSlot] = useState<string>("base");

  const bySlug = useMemo(() => {
    const map = new Map<string, MenuItemWithCategory[]>();
    for (const category of categories) map.set(category.slug, []);
    for (const item of items) {
      const bucket = map.get(item.categorySlug);
      if (bucket) bucket.push(item);
    }
    return map;
  }, [items, categories]);

  const optionsFor = (slot: Slot) =>
    slot.categorySlugs.flatMap((slug) => bySlug.get(slug) ?? []);

  const filled = slots.filter((slot) => picks[slot.key]);
  const filledCount = filled.length;
  const complete = filledCount === slots.length;

  const subtotal = filled.reduce((sum, slot) => sum + (picks[slot.key]?.price ?? 0), 0);
  const saving = complete ? Math.round(subtotal * COMBO_DISCOUNT) : 0;
  const thaliPrice = subtotal - saving;

  function pick(slot: Slot, item: MenuItemWithCategory) {
    setPicks((prev) => ({ ...prev, [slot.key]: item }));
    const currentIndex = slots.findIndex((entry) => entry.key === slot.key);
    const next = slots[currentIndex + 1];
    if (next) setActiveSlot(next.key);
  }

  function clearSlot(key: string) {
    setPicks((prev) => ({ ...prev, [key]: null }));
  }

  function clearAll() {
    setPicks({});
    setActiveSlot("base");
  }

  function autoFill() {
    const next: Record<string, MenuItemWithCategory | null> = {};
    for (const slot of slots) {
      const options = optionsFor(slot).filter((item) => item.isAvailable);
      if (options.length === 0) continue;
      const signature = options.filter((item) => item.isSignature);
      const pool = signature.length > 0 ? signature : options;
      next[slot.key] = pool[Math.floor(Math.random() * pool.length)];
    }
    setPicks(next);
    setActiveSlot("sweet");
  }

  function addThaliToBag() {
    for (const slot of filled) {
      const item = picks[slot.key];
      if (!item) continue;
      add({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
      });
    }
  }

  const activeSlotData = slots.find((slot) => slot.key === activeSlot) ?? slots[0];

  // Plate geometry: wedges drawn for each filled slot.
  const radius = 46;
  const centre = 50;
  const wedgeAngle = 360 / slots.length;

  function wedgePath(index: number) {
    const start = index * wedgeAngle - 90;
    const end = start + wedgeAngle;
    const toXY = (angle: number, r: number) => {
      const rad = (angle * Math.PI) / 180;
      return { x: centre + r * Math.cos(rad), y: centre + r * Math.sin(rad) };
    };
    const p1 = toXY(start, radius);
    const p2 = toXY(end, radius);
    const large = wedgeAngle > 180 ? 1 : 0;
    return `M ${centre} ${centre} L ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      {/* ---------- PLATE ---------- */}
      <div className="lg:sticky lg:top-28">
        <div className="card grain relative overflow-hidden p-8">
          <div className="glow-gold absolute -left-24 -top-24 h-64 w-64 opacity-70" />

          <div className="relative flex flex-col items-center">
            <svg viewBox="0 0 100 100" className="h-64 w-64 sm:h-72 sm:w-72" aria-hidden>
              <circle cx="50" cy="50" r="49" fill="#100e13" stroke="#e0a94f55" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="41" fill="#0c0a0f" stroke="#f8f3ea18" strokeWidth="0.4" />
              {slots.map((slot, index) => {
                const chosen = picks[slot.key];
                return (
                  <path
                    key={slot.key}
                    d={wedgePath(index)}
                    fill={chosen ? wedgeColors[index % wedgeColors.length] : "#1a1720"}
                    fillOpacity={chosen ? 0.85 : 0.5}
                    stroke="#08070a"
                    strokeWidth="0.6"
                    className={
                      activeSlot === slot.key && !chosen
                        ? "animate-pulse cursor-pointer"
                        : "cursor-pointer"
                    }
                    onClick={() => setActiveSlot(slot.key)}
                  />
                );
              })}
              <circle cx="50" cy="50" r="15" fill="#08070a" stroke="#e0a94f66" strokeWidth="0.4" />
              <text
                x="50"
                y="48.5"
                textAnchor="middle"
                fill="#e0a94f"
                fontSize="7"
                fontFamily="Georgia, serif"
              >
                {filledCount}/6
              </text>
              <text
                x="50"
                y="57"
                textAnchor="middle"
                fill="#f8f3ea99"
                fontSize="3.4"
                letterSpacing="0.6"
              >
                THALI
              </text>
            </svg>

            <p className="mt-6 text-center text-sm leading-relaxed text-cream/55">
              {complete
                ? "That is a proper thali. Twelve per cent off at the counter."
                : filledCount === 0
                  ? "Tap a wedge to start. Six choices make a full plate."
                  : `${slots.length - filledCount} choice${
                      slots.length - filledCount === 1 ? "" : "s"
                    } left. Keep going.`}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={autoFill} className="btn-ghost !px-5 !py-2.5 !text-[0.62rem]">
                🎲 Chef picks for me
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="btn-ghost !px-5 !py-2.5 !text-[0.62rem]"
              >
                Empty plate
              </button>
            </div>
          </div>
        </div>

        {/* TICKET */}
        <div className="card mt-6 p-7">
          <p className="eyebrow">Your ticket</p>
          <ul className="mt-4 space-y-3 text-sm">
            {slots.map((slot) => {
              const item = picks[slot.key];
              return (
                <li key={slot.key} className="flex items-start justify-between gap-3 border-b border-cream/5 pb-3">
                  <span className="text-[0.6rem] uppercase tracking-[0.18em] text-cream/40">
                    {slot.emoji} {slot.label}
                  </span>
                  {item ? (
                    <span className="flex items-center gap-2 text-right">
                      <span className="text-cream/85">{item.name}</span>
                      <span className="text-gold">{formatPrice(item.price)}</span>
                    </span>
                  ) : (
                    <span className="text-cream/25">—</span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between text-cream/55">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {complete ? (
              <div className="flex justify-between text-olive">
                <span>Thali combo −12%</span>
                <span>−{formatPrice(saving)}</span>
              </div>
            ) : null}
            <div className="flex items-baseline justify-between border-t border-cream/10 pt-3">
              <span className="eyebrow !text-[0.62rem]">Plate total</span>
              <span className="display text-2xl text-gold">{formatPrice(thaliPrice)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={addThaliToBag}
            disabled={filledCount === 0}
            className="btn-gold mt-6 w-full disabled:opacity-50"
          >
            {filledCount === 0
              ? "Pick something first"
              : `Add ${filledCount} dish${filledCount === 1 ? "" : "es"} to bag`}
          </button>
          <p className="mt-3 text-[0.6rem] leading-relaxed text-cream/35">
            Dishes are added individually — show the combo code{" "}
            <span className="text-gold">THALI12</span> at the counter for the discount.
          </p>
        </div>
      </div>

      {/* ---------- CHOOSER ---------- */}
      <div>
        <Reveal>
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <button
                key={slot.key}
                type="button"
                onClick={() => setActiveSlot(slot.key)}
                className={`chip ${activeSlot === slot.key ? "chip-active" : ""}`}
              >
                {slot.emoji} {slot.label}
                {picks[slot.key] ? " ✓" : ""}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8">
          <p className="eyebrow">{activeSlotData.label}</p>
          <h2 className="display mt-3 text-2xl">{activeSlotData.caption}</h2>
          {picks[activeSlotData.key] ? (
            <button
              type="button"
              onClick={() => clearSlot(activeSlotData.key)}
              className="mt-3 text-[0.62rem] uppercase tracking-[0.18em] text-cream/40 transition hover:text-clay"
            >
              Clear this choice ✕
            </button>
          ) : null}
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {optionsFor(activeSlotData).map((item, index) => {
            const selected = picks[activeSlotData.key]?.id === item.id;
            return (
              <Reveal key={item.id} delay={Math.min(index * 60, 240)} className="h-full">
                <button
                  type="button"
                  onClick={() => pick(activeSlotData, item)}
                  disabled={!item.isAvailable}
                  className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border p-0 text-left transition duration-300 hover:-translate-y-1 disabled:opacity-45 ${
                    selected ? "border-gold bg-gold/8" : "border-cream/12 hover:border-gold/50"
                  }`}
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-ash" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-coal to-transparent" />
                    {selected ? (
                      <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-gold text-xs text-ink">
                        ✓
                      </span>
                    ) : null}
                    {item.isSignature ? (
                      <span className="tag absolute left-3 top-3 !bg-ink/85">★ Signature</span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-base leading-snug">{item.name}</h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-cream/50">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-display text-base text-gold">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-[0.55rem] uppercase tracking-[0.18em] text-cream/35">
                        {item.prepMinutes} min
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {complete ? (
          <Reveal>
            <div className="card mt-8 flex flex-wrap items-center justify-between gap-5 border-gold/40 p-7">
              <div>
                <p className="eyebrow">Thali complete</p>
                <p className="display mt-2 text-2xl">
                  {formatPrice(thaliPrice)}{" "}
                  <span className="text-sm text-cream/40 line-through">
                    {formatPrice(subtotal)}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={addThaliToBag} className="btn-gold">
                  Add all to bag
                </button>
                <Link href="/order" className="btn-ghost">
                  Go to bag →
                </Link>
              </div>
            </div>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
