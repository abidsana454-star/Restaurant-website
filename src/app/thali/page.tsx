import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThaliBuilder } from "@/components/thali-builder";
import { PageHero } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getMenu } from "@/lib/queries";
import { IMG } from "@/db/seed-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Build Your Thali",
  description:
    "Pick a base, a main, a bread, a starter, a dessert and a drink. Complete the plate and get 12% off at the counter.",
};

const rules = [
  { t: "Six choices", d: "Base, main, bread, starter, dessert and a drink. That is a thali." },
  { t: "12% off", d: "Fill all six wedges and quote THALI12 at the counter." },
  { t: "Separate pans", d: "Every vegetarian pick is cooked in its own pan and oil." },
  { t: "Swap any time", d: "Change your mind before ordering — nothing is locked in." },
];

export default async function ThaliPage() {
  const { items, categories } = await getMenu();

  return (
    <>
      <PageHero
        eyebrow="Build your thali"
        title={
          <>
            Six wedges. One very full{" "}
            <span className="italic text-gold">plate.</span>
          </>
        }
        description="Our chefs assemble a thali around balance — something fried, something saucy, something cool, something sweet. Now you can do it yourself and watch the plate fill up."
        image={IMG.platter}
      />

      <section className="shell py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rules.map((rule, index) => (
            <Reveal key={rule.t} delay={index * 80}>
              <div className="card h-full p-6">
                <p className="font-display text-base text-gold">{rule.t}</p>
                <p className="mt-2 text-xs leading-relaxed text-cream/55">{rule.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <ThaliBuilder items={items} categories={categories} />
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-cream/10 bg-coal py-24">
        <Image src={IMG.candle} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-coal via-coal/90 to-coal" />
        <div className="shell relative flex flex-col items-center gap-6 text-center">
          <p className="eyebrow">Rather not decide?</p>
          <h2 className="display max-w-2xl text-3xl sm:text-4xl">
            Ask for the chef&apos;s thali and let Amna{" "}
            <span className="italic text-gold">choose for you</span>
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-cream/60">
            Tell the server your spice level and how hungry you are. The kitchen sends six
            dishes it feels like cooking that day — usually the best meal on the menu.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link href="/reservations" className="btn-gold">
              Book a table
            </Link>
            <Link href="/quiz" className="btn-ghost">
              Take the taste quiz
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
