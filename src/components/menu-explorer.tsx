"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/site";
import type { MenuItemWithCategory } from "@/lib/queries";
import type { Category } from "@/db/schema";
import { AddToCartButton } from "@/components/add-to-cart";
import { Reveal } from "@/components/motion";

type Filter = "all" | "signature" | "veg" | "mild";

export function MenuExplorer({
  items,
  categories,
}: {
  items: MenuItemWithCategory[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (activeCategory !== "all" && item.categorySlug !== activeCategory) return false;
      if (filter === "signature" && !item.isSignature) return false;
      if (filter === "veg" && !item.isVegetarian) return false;
      if (filter === "mild" && item.spiceLevel > 1) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q)
      );
    });
  }, [items, activeCategory, filter, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, MenuItemWithCategory[]>();
    for (const category of categories) map.set(category.slug, []);
    for (const item of visible) {
      const bucket = map.get(item.categorySlug);
      if (bucket) bucket.push(item);
      else map.set(item.categorySlug, [item]);
    }
    return categories
      .map((category) => ({ category, items: map.get(category.slug) ?? [] }))
      .filter((group) => group.items.length > 0);
  }, [categories, visible]);

  return (
    <div>
      <div className="glass sticky top-24 z-30 -mx-5 px-5 py-4 md:mx-0 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`chip ${activeCategory === "all" ? "chip-active" : ""}`}
            >
              Everything
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                className={`chip ${activeCategory === category.slug ? "chip-active" : ""}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dishes…"
              className="field !w-full !py-2.5 lg:!w-48"
              aria-label="Search dishes"
            />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as Filter)}
              className="field !w-auto !py-2.5"
              aria-label="Filter dishes"
            >
              <option value="all">All dishes</option>
              <option value="signature">Signature</option>
              <option value="veg">Vegetarian</option>
              <option value="mild">Mild spice</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[0.65rem] uppercase tracking-[0.24em] text-cream/40">
        {visible.length} {visible.length === 1 ? "dish" : "dishes"} shown
      </p>

      {visible.length === 0 ? (
        <div className="card mt-10 p-14 text-center">
          <p className="display text-2xl">Nothing matched that.</p>
          <p className="mt-3 text-sm text-cream/55">
            Try clearing the search or picking another course.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
              setActiveCategory("all");
            }}
            className="btn-ghost mt-8"
          >
            Reset filters
          </button>
        </div>
      ) : null}

      <div className="mt-14 space-y-24">
        {grouped.map(({ category, items: groupItems }) => (
          <section key={category.slug} id={category.slug} className="scroll-mt-32">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="display text-3xl text-gold-soft sm:text-4xl">
                    {category.name}
                  </h2>
                  {category.tagline ? (
                    <p className="mt-2 text-sm text-cream/50">{category.tagline}</p>
                  ) : null}
                </div>
                <span className="text-[0.62rem] uppercase tracking-[0.24em] text-cream/35">
                  {groupItems.length} items
                </span>
              </div>
              <div className="rule mt-6" />
            </Reveal>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {groupItems.map((item, index) => (
                <Reveal key={item.id} delay={Math.min(index * 70, 280)}>
                  <div className="group flex gap-5">
                    <Link
                      href={`/menu/${item.slug}`}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="120px"
                          className="object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full w-full bg-ash" />
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-lg leading-snug">
                          <Link href={`/menu/${item.slug}`} className="transition hover:text-gold">
                            {item.name}
                          </Link>
                          {item.isSignature ? (
                            <span className="ml-2 align-middle text-[0.58rem] uppercase tracking-[0.16em] text-gold">
                              ★ signature
                            </span>
                          ) : null}
                        </h3>
                        <span className="whitespace-nowrap font-display text-base text-gold">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-cream/55">
                        {item.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.6rem] uppercase tracking-[0.18em]">
                        {item.isVegetarian ? <span className="text-olive">Vegetarian</span> : null}
                        {item.spiceLevel > 0 ? (
                          <span className="text-clay">{"🌶".repeat(item.spiceLevel)} spice</span>
                        ) : (
                          <span className="text-cream/35">Mild</span>
                        )}
                        <span className="text-cream/35">{item.prepMinutes} min</span>
                        {!item.isAvailable ? (
                          <span className="text-clay">Sold out</span>
                        ) : null}
                      </div>
                      <AddToCartButton
                        item={item}
                        disabled={!item.isAvailable}
                        className="mt-4 !px-5 !py-2.5 !text-[0.62rem]"
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
