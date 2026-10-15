import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, SectionHeading, StatBlock } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { IMG } from "@/db/seed-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How a six-table kitchen with a borrowed tandoor became one of Karachi's favourite family restaurants.",
};

const timeline = [
  {
    year: "2014",
    title: "Six tables, one burnish",
    body: "Amna and Tariq rented a shop on Bukhari Lane and cooked whatever the family recipe book said.",
  },
  {
    year: "2017",
    title: "The tandoor arrives",
    body: "A clay oven was built on site by a craftsman from Multan. Bread sales tripled in a month.",
  },
  {
    year: "2020",
    title: "Cooking for the street",
    body: "Through the lockdown we prepared 400 free meals a day for neighbourhood families.",
  },
  {
    year: "2023",
    title: "The mezzanine",
    body: "We took over the floor above and added the private dining room and chef's counter.",
  },
];

const team = [
  {
    name: "Amna Siddiqui",
    role: "Founder & Head of Kitchen",
    note: "Third-generation cook. Believes every curry needs twenty minutes more than you think.",
  },
  {
    name: "Tariq Siddiqui",
    role: "Founder & Front of House",
    note: "Remembers names, allergies and which table you sat at last Eid.",
  },
  {
    name: "Chef Rehmat Ali",
    role: "Tandoor & Grill",
    note: "Twenty-two years on the clay wall. Measures nothing, gets it right every time.",
  },
  {
    name: "Hina Baig",
    role: "Pastry & Desserts",
    note: "Turns kheer, kulfi and falooda into the reason people skip the main course.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title={
          <>
            A family kitchen that grew one table at a{" "}
            <span className="italic text-gold">time</span>
          </>
        }
        description={`${site.name} was never meant to be a brand. It was a way for Amna to feed people without washing up alone.`}
        image={IMG.hall}
      />

      <section className="shell py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow={`Since ${site.established}`}
              title={
                <>
                  We never hired a consultant. We just kept{" "}
                  <span className="italic text-gold">cooking.</span>
                </>
              }
            />
            <p className="mt-6 text-base leading-relaxed text-cream/60">
              Our masala is ground each morning. The yoghurt is set on site. Meat arrives
              twice a day from two butchers we have used for a decade. Nothing is frozen,
              nothing is pre-portioned, and no dish leaves the pass without being tasted.
            </p>
            <p className="mt-5 text-base leading-relaxed text-cream/60">
              What has changed is the room: 120 covers indoors, a terrace for cooler
              evenings, a chef&apos;s counter facing the tandoor, and a private room where a
              dozen people can be as loud as they like.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <StatBlock value={12} label="Years open" suffix="+" />
              <StatBlock value={26} label="Dishes on card" />
              <StatBlock value={440} label="Events catered" suffix="+" />
              <StatBlock value={800} label="Largest event" />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-5">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={IMG.lights}
                  alt="Warm lighting at Zaiqa"
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={IMG.wine}
                  alt="Drinks service"
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-cream/10 bg-coal py-24">
        <Image src={IMG.candle} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-coal via-coal/85 to-coal" />
        <div className="shell relative">
          <Reveal>
            <SectionHeading
              eyebrow="Milestones"
              title={
                <>
                  Twelve years in <span className="italic text-gold">four chapters</span>
                </>
              }
            />
          </Reveal>
          <ol className="mt-14 grid gap-8 md:grid-cols-4">
            {timeline.map((entry, index) => (
              <Reveal key={entry.year} delay={index * 90}>
                <li className="relative border-l border-gold/30 pl-6">
                  <span className="font-display text-2xl text-gold">{entry.year}</span>
                  <h3 className="mt-3 font-display text-lg">{entry.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/55">{entry.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell py-24">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="The people"
            title={
              <>
                Four people you will probably <span className="italic text-gold">meet</span>
              </>
            }
          />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person, index) => (
            <Reveal key={person.name} delay={index * 90} className="h-full">
              <article className="card group h-full p-7 transition duration-500 hover:-translate-y-1.5 hover:border-gold/35">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 font-display text-xl text-gold transition duration-500 group-hover:bg-gold group-hover:text-ink">
                  {person.name.charAt(0)}
                </span>
                <h3 className="mt-5 font-display text-lg">{person.name}</h3>
                <p className="mt-1 text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">
                  {person.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-cream/55">{person.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell pb-28">
        <Reveal>
          <div className="card grain relative overflow-hidden p-10 text-center sm:p-16">
            <div className="glow-gold absolute -right-24 -top-24 h-72 w-72" />
            <div className="relative">
              <h2 className="display text-3xl sm:text-4xl">Come and eat with us</h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/60">
                {site.address.line1}, {site.address.line2}, {site.address.city}. Walk-ins are
                always welcome, but weekends get busy — Saturday evenings are usually gone
                by Tuesday.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Link href="/reservations" className="btn-gold">
                  Reserve a table
                </Link>
                <Link href="/menu" className="btn-ghost">
                  Browse the menu
                </Link>
                <Link href="/journal" className="btn-ghost !border-transparent !px-3 hover:!px-5">
                  Kitchen journal →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
