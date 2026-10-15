import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MenuExplorer } from "@/components/menu-explorer";
import { DishRoulette } from "@/components/dish-roulette";
import { PageHero, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getMenu } from "@/lib/queries";
import { IMG } from "@/db/seed-data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Starters, tandoor grills, karahi, biryani, breads, desserts and drinks — cooked to order at Zaiqa.",
};

export default async function MenuPage() {
  const { categories, items } = await getMenu();
  const veg = items.filter((item) => item.isVegetarian).length;
  const signature = items.filter((item) => item.isSignature).length;

  return (
    <>
      <PageHero
        eyebrow="The menu"
        title={
          <>
            Everything we cook,{" "}
            <span className="italic text-gold">all in one place</span>
          </>
        }
        description={`${items.length} dishes across ${categories.length} courses. Prices in Pakistani Rupees, tax included. Add anything to your bag for pickup or delivery.`}
        image={IMG.dining}
      />

      <section className="shell py-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { k: `${items.length}`, v: "Dishes on the card" },
            { k: `${veg}`, v: "Fully vegetarian" },
            { k: `${signature}`, v: "Chef's signatures" },
          ].map((stat, index) => (
            <Reveal key={stat.v} delay={index * 90}>
              <div className="card flex items-baseline gap-4 p-6">
                <span className="display text-4xl text-gold">{stat.k}</span>
                <span className="text-[0.62rem] uppercase tracking-[0.2em] text-cream/45">
                  {stat.v}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <p className="text-sm text-cream/50">Overwhelmed by {items.length} options?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/quiz" className="btn-gold !px-6 !py-3 !text-[0.65rem]">
              🎯 Find my dish
            </Link>
            <DishRoulette items={items.filter((item) => item.isAvailable)} />
            <Link href="/thali" className="btn-ghost !px-6 !py-3 !text-[0.65rem]">
              🫓 Build a thali
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <MenuExplorer items={items} categories={categories} />
        </div>
      </section>

      <section className="border-y border-cream/10 bg-coal py-24">
        <div className="shell grid gap-12 lg:grid-cols-3">
          <Reveal>
            <SectionHeading
              eyebrow="Good to know"
              title={
                <>
                  Dietary <span className="italic text-gold">notes</span>
                </>
              }
            />
          </Reveal>
          <div className="grid gap-8 text-sm leading-relaxed text-cream/60 sm:grid-cols-2 lg:col-span-2">
            <Reveal delay={80}>
              <p>
                Every vegetarian dish is cooked in a separate pan with its own oil. Nut
                allergies: our makhani gravy uses cashew, so please flag it before ordering
                and we will build a seed-based version.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p>
                Gluten-free guests can pair any curry with plain tandoori roti or a side of
                saffron rice. Tell the server and the kitchen will keep the board separate.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p>
                Want something not on the card? Our chef still cooks family recipes on
                request — give us a day&apos;s notice and we will shop for it.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <p>
                Kids under six eat free from the little-plates menu on weekdays before 6 PM.
                Ask for the crayons; they are always slightly lost.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="shell py-24">
        <Reveal>
          <div className="card grain relative overflow-hidden p-10 text-center sm:p-14">
            <div className="glow-gold absolute -left-20 -top-20 h-72 w-72" />
            <div className="relative">
              <h2 className="display text-3xl">Hungry yet?</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/60">
                Call us on{" "}
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-gold">
                  {site.phone}
                </a>{" "}
                for takeaway, or add dishes to your bag and let the bread come to you warm.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Link href="/order" className="btn-gold">
                  Order online
                </Link>
                <Link href="/reservations" className="btn-ghost">
                  Reserve a table
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="relative h-64 overflow-hidden">
        <Image src={IMG.tandoor} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/70" />
      </div>
    </>
  );
}
