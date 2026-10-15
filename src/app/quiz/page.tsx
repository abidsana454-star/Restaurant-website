import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TasteQuiz } from "@/components/taste-quiz";
import { PageHero } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getMenu } from "@/lib/queries";
import { IMG } from "@/db/seed-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find Your Dish",
  description:
    "Five quick questions and we will tell you exactly what to order at Zaiqa — based on your spice tolerance, craving and table size.",
};

const steps = [
  { n: "01", t: "Heat", d: "How much chilli you can genuinely take." },
  { n: "02", t: "Craving", d: "Charcoal, gravy, rice, or something light." },
  { n: "03", t: "Time", d: "Hungry now, or happy to wait for a slow karahi." },
  { n: "04", t: "Diet", d: "Vegetarian, or everything on the table." },
  { n: "05", t: "Company", d: "A quiet plate for one, or a full table." },
];

export default async function QuizPage() {
  const { items } = await getMenu();
  const available = items.filter((item) => item.isAvailable);

  return (
    <>
      <PageHero
        eyebrow="Find your dish"
        title={
          <>
            Five questions. <span className="italic text-gold">One perfect plate.</span>
          </>
        }
        description="Our staff asks these exact questions at the counter a dozen times a night. Answer them and the kitchen's recommendation lands instantly."
        image={IMG.platter}
      />

      <section className="shell py-16">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {steps.map((step, index) => (
            <Reveal key={step.n} delay={index * 70}>
              <div className="card h-full p-5">
                <span className="font-display text-xs text-gold">{step.n}</span>
                <p className="mt-2 font-display text-base">{step.t}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-cream/50">{step.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <TasteQuiz items={available.length > 0 ? available : items} />
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-cream/10 bg-coal py-24">
        <Image src={IMG.tandoor} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-coal via-coal/88 to-coal" />
        <div className="shell relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="eyebrow">Still stuck?</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl">
              Let the tandoor pick <span className="italic text-gold">for you</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-cream/60">
              If the quiz feels too much like decision-making, spin the wheel. It is weighted
              towards our signature dishes, so you will rarely land on something boring.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/menu" className="btn-gold">
                Browse the full menu
              </Link>
              <Link href="/thali" className="btn-ghost">
                Build a thali instead
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { n: "3", l: "Matches shown" },
                { n: `${items.length}`, l: "Dishes scored" },
                { n: "5", l: "Questions asked" },
                { n: "0", l: "Wrong answers" },
              ].map((stat) => (
                <div key={stat.l} className="card p-6">
                  <p className="display text-3xl text-gold">{stat.n}</p>
                  <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-cream/45">
                    {stat.l}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
