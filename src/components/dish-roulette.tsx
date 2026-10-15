"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/site";
import type { MenuItemWithCategory } from "@/lib/queries";

export function DishRoulette({ items }: { items: MenuItemWithCategory[] }) {
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<MenuItemWithCategory | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function spin() {
    if (items.length === 0) return;
    setOpen(true);
    setSpinning(true);
    setLanded(false);
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];

    // Weighted pool: signature dishes show up twice as often.
    const pool = items.flatMap((item) => (item.isSignature ? [item, item] : [item]));

    let delay = 60;
    const ticks: number[] = [];
    for (let i = 0; i < 22; i += 1) {
      ticks.push(delay);
      delay = Math.round(delay * 1.19);
    }

    ticks.forEach((ms, index) => {
      const id = window.setTimeout(() => {
        setCurrent(pool[Math.floor(Math.random() * pool.length)] ?? null);
        if (index === ticks.length - 1) {
          setSpinning(false);
          setLanded(true);
        }
      }, ms);
      timers.current.push(id);
    });
  }

  function reset() {
    setLanded(false);
    setSpinning(false);
    setCurrent(null);
  }

  return (
    <>
      <button type="button" onClick={spin} className="btn-gold group relative overflow-hidden">
        <span className="relative z-10">🎰 Surprise me</span>
        <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-full" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-5 backdrop-blur-lg"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-cream/70 transition hover:border-gold hover:text-gold"
          >
            ✕
          </button>

          <div
            className="w-full max-w-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow text-center">Let the kitchen decide</p>

            <div className="card mt-5 overflow-hidden">
              <div className="relative h-64 overflow-hidden bg-ash">
                {current?.imageUrl ? (
                  <Image
                    key={current.id}
                    src={current.imageUrl}
                    alt={current.name}
                    fill
                    sizes="512px"
                    className={`object-cover ${spinning ? "scale-110 blur-[2px]" : "scale-100"} transition-all duration-200`}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/30 to-transparent" />
                {spinning ? (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="display animate-pulse text-4xl text-cream/85">rolling…</span>
                  </span>
                ) : null}
              </div>

              <div className="p-7">
                {landed && current ? (
                  <div className="rise-in text-center">
                    <span className="tag !bg-gold !text-ink">Your dish tonight</span>
                    <p className="mt-4 text-[0.62rem] uppercase tracking-[0.24em] text-cream/45">
                      {current.categoryName}
                    </p>
                    <h3 className="display mt-2 text-3xl">{current.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-cream/60">
                      {current.description}
                    </p>
                    <p className="mt-4 font-display text-2xl text-gold">
                      {formatPrice(current.price)}
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          add({
                            id: current.id,
                            slug: current.slug,
                            name: current.name,
                            price: current.price,
                            imageUrl: current.imageUrl,
                          });
                          setOpen(false);
                        }}
                        className="btn-gold"
                      >
                        Add to bag
                      </button>
                      <Link href={`/menu/${current.slug}`} className="btn-ghost">
                        Read about it
                      </Link>
                      <button type="button" onClick={reset} className="btn-ghost !px-4">
                        ↻ Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-cream/45">
                    Spinning through {items.length} dishes…
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
