import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatPrice } from "@/lib/site";
import type { MenuItemWithCategory } from "@/lib/queries";
import { AddToCartButton } from "@/components/add-to-cart";
import { Counter, Reveal } from "@/components/motion";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  image: string;
  align?: "left" | "center";
}) {
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/78 to-ink/45" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      <div
        className={`shell relative z-10 pb-16 pt-44 ${
          align === "center" ? "mx-auto max-w-3xl text-center" : ""
        }`}
      >
        <p className="eyebrow rise-in">{eyebrow}</p>
        <h1
          className="display rise-in mt-5 text-4xl sm:text-5xl lg:text-[4rem]"
          style={{ animationDelay: "90ms" }}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={`rise-in mt-6 max-w-xl text-base leading-relaxed text-cream/65 ${
              align === "center" ? "mx-auto" : ""
            }`}
            style={{ animationDelay: "180ms" }}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-[2.85rem]">{title}</h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-cream/60">{description}</p>
      ) : null}
    </div>
  );
}

function SpiceDots({ level }: { level: number }) {
  if (level <= 0)
    return <span className="text-[0.6rem] uppercase tracking-[0.2em] text-cream/30">Mild</span>;
  return (
    <span className="inline-flex items-center gap-1" title={`Spice level ${level} of 3`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <span
          key={index}
          className={`h-1.5 w-1.5 rounded-full ${
            index < level ? "bg-clay" : "bg-cream/15"
          }`}
        />
      ))}
    </span>
  );
}

export function DishCard({ item }: { item: MenuItemWithCategory }) {
  return (
    <Reveal className="h-full">
      <article className="card group relative flex h-full flex-col overflow-hidden transition duration-500 hover:-translate-y-1.5 hover:border-gold/35">
        <Link href={`/menu/${item.slug}`} className="relative block h-56 overflow-hidden">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-[900ms] group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-ash" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/25 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {item.isSignature ? <span className="tag">Signature</span> : null}
            {item.isVegetarian ? (
              <span className="tag !border-olive/50 !text-olive">Veg</span>
            ) : null}
          </div>
          <span className="absolute bottom-4 right-4 rounded-full bg-ink/80 px-3 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-cream/70 backdrop-blur">
            {item.prepMinutes} min
          </span>
        </Link>
        <div className="flex flex-1 flex-col p-6">
          <p className="text-[0.6rem] uppercase tracking-[0.24em] text-cream/40">
            {item.categoryName}
          </p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h3 className="font-display text-xl leading-snug">
              <Link href={`/menu/${item.slug}`} className="transition hover:text-gold">
                {item.name}
              </Link>
            </h3>
            <span className="whitespace-nowrap font-display text-lg text-gold">
              {formatPrice(item.price)}
            </span>
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cream/55">
            {item.description}
          </p>
          <div className="mt-auto pt-5">
            <div className="flex items-center justify-between">
              <SpiceDots level={item.spiceLevel} />
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-cream/30">
                {item.isAvailable ? "Available" : "Sold out"}
              </span>
            </div>
            <AddToCartButton item={item} className="mt-5 w-full" disabled={!item.isAvailable} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold" aria-label={`${rating} out of 5`}>
      {"★".repeat(rating)}
      <span className="text-cream/15">{"★".repeat(Math.max(0, 5 - rating))}</span>
    </span>
  );
}

export function StatBlock({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="border-l border-gold/30 pl-5">
      <p className="display text-4xl text-gold">
        <Counter to={value} suffix={suffix} />
      </p>
      <p className="mt-2 text-[0.62rem] uppercase tracking-[0.22em] text-cream/45">{label}</p>
    </div>
  );
}
