import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart";
import { DishCard } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getDishBySlug } from "@/lib/queries";
import { formatPrice, site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDishBySlug(slug);
  if (!data) return { title: "Dish not found" };
  return {
    title: data.dish.name,
    description: data.dish.description,
  };
}

export default async function DishPage({ params }: Props) {
  const { slug } = await params;
  const data = await getDishBySlug(slug);
  if (!data) notFound();

  const { dish, related } = data;

  const facts = [
    { k: "Course", v: dish.categoryName },
    { k: "Time to table", v: `${dish.prepMinutes} minutes` },
    { k: "Spice", v: dish.spiceLevel === 0 ? "Mild" : `${dish.spiceLevel} of 3` },
    { k: "Diet", v: dish.isVegetarian ? "Vegetarian" : "Non-vegetarian" },
  ];

  return (
    <>
      <section className="relative pt-32">
        <div className="shell">
          <nav className="flex flex-wrap items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">
            <Link href="/" className="transition hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <Link href="/menu" className="transition hover:text-gold">
              Menu
            </Link>
            <span>/</span>
            <Link
              href={`/menu?course=${dish.categorySlug}`}
              className="transition hover:text-gold"
            >
              {dish.categoryName}
            </Link>
          </nav>
        </div>
      </section>

      <section className="shell grid gap-12 py-12 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            {dish.imageUrl ? (
              <Image
                src={dish.imageUrl}
                alt={dish.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-ash" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              {dish.isSignature ? <span className="tag">Signature</span> : null}
              {dish.isVegetarian ? (
                <span className="tag !border-olive/50 !text-olive">Veg</span>
              ) : null}
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="eyebrow">{dish.categoryName}</p>
          <h1 className="display mt-4 text-4xl sm:text-5xl">{dish.name}</h1>
          <p className="mt-6 text-base leading-relaxed text-cream/70">{dish.description}</p>

          {dish.story ? (
            <div className="card mt-8 border-l-2 border-l-gold/60 p-6">
              <p className="eyebrow !text-[0.6rem]">Why it tastes like this</p>
              <p className="mt-3 text-sm leading-relaxed text-cream/65">{dish.story}</p>
            </div>
          ) : null}

          <div className="mt-8 flex items-baseline gap-4">
            <span className="display text-4xl text-gold">{formatPrice(dish.price)}</span>
            <span className="text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">
              incl. tax
            </span>
          </div>

          <div className="mt-7">
            <AddToCartButton
              item={dish}
              disabled={!dish.isAvailable}
              withQuantity
              className="!px-8 !py-4"
            />
            {!dish.isAvailable ? (
              <p className="mt-3 text-xs text-clay">
                Sold out for today — it is usually back by tomorrow evening.
              </p>
            ) : null}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.k} className="rounded-2xl border border-cream/10 p-4">
                <dt className="text-[0.58rem] uppercase tracking-[0.2em] text-cream/40">
                  {fact.k}
                </dt>
                <dd className="mt-2 text-sm text-cream/85">{fact.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3 text-sm">
            <Link href="/order" className="btn-ghost !px-6 !py-3 !text-[0.65rem]">
              Go to bag
            </Link>
            <Link href="/thali" className="btn-ghost !px-6 !py-3 !text-[0.65rem]">
              🫓 Add it to a thali
            </Link>
            <Link href="/quiz" className="btn-ghost !px-6 !py-3 !text-[0.65rem]">
              🎯 Is this my dish?
            </Link>
            <Link href="/reservations" className="btn-ghost !px-6 !py-3 !text-[0.65rem]">
              Eat it at the restaurant
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost !px-6 !py-3 !text-[0.65rem]"
            >
              Ask the kitchen
            </a>
          </div>
        </Reveal>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-cream/10 bg-coal py-24">
          <div className="shell">
            <p className="eyebrow">Goes well with</p>
            <h2 className="display mt-4 text-3xl">
              More from <span className="italic text-gold">{dish.categoryName}</span>
            </h2>
            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <DishCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
