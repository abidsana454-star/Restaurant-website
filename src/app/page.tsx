import Image from "next/image";
import Link from "next/link";
import { DishCard, SectionHeading, StatBlock, Stars } from "@/components/ui";
import { GhostWord, Marquee, Reveal } from "@/components/motion";
import { KitchenBar } from "@/components/kitchen-bar";
import { DishRoulette } from "@/components/dish-roulette";
import { getMenu, getPosts, getSignatureDishes, getTestimonials } from "@/lib/queries";
import { IMG } from "@/db/seed-data";
import { site } from "@/lib/site";
import { clockLabel, getKitchenStatus } from "@/lib/kitchen";

export const dynamic = "force-dynamic";

const craft = [
  {
    step: "01",
    title: "Spice at dawn",
    body: "Whole spices roasted separately and ground by hand at 6am. Nothing pre-mixed, ever.",
  },
  {
    step: "02",
    title: "One clay tandoor",
    body: "Lit once, at nine in the morning, and kept at temperature for the whole service.",
  },
  {
    step: "03",
    title: "Cooked to order",
    body: "No hot hold, no heat lamps. Your karahi starts when you order it, not before.",
  },
  {
    step: "04",
    title: "Tasted at the pass",
    body: "Nothing leaves the kitchen until somebody with a spoon has signed off on it.",
  },
];

export default async function HomePage() {
  const [signatures, quotes, menu, journal] = await Promise.all([
    getSignatureDishes(6),
    getTestimonials(),
    getMenu(),
    getPosts(2),
  ]);

  const dishCount = menu.items.filter((item) => item.isAvailable).length;
  const vegCount = menu.items.filter((item) => item.isVegetarian).length;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <Image
          src={IMG.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />

        <div className="shell relative z-10 py-32">
          <div className="max-w-3xl">
            <div className="rise-in inline-flex items-center gap-3 rounded-full border border-gold/30 bg-ink/50 py-2 pl-2 pr-5 backdrop-blur">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gold text-[0.55rem] text-ink">
                ★
              </span>
              <span className="text-[0.62rem] uppercase tracking-[0.28em] text-cream/70">
                Karachi · Since {site.established} · 4.9 guest rating
              </span>
            </div>

            <h1
              className="display rise-in mt-8 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[5.2rem]"
              style={{ animationDelay: "100ms" }}
            >
              Slow fire,
              <br />
              <span className="italic text-gold">big flavour,</span>
              <br />
              and a table waiting.
            </h1>

            <p
              className="rise-in mt-8 max-w-lg text-base leading-relaxed text-cream/70 sm:text-lg"
              style={{ animationDelay: "200ms" }}
            >
              {site.blurb}
            </p>

            <div
              className="rise-in mt-10 flex flex-wrap gap-4"
              style={{ animationDelay: "300ms" }}
            >
              <Link href="/order" className="btn-gold">
                Order online →
              </Link>
              <Link href="/reservations" className="btn-ghost">
                Reserve a table
              </Link>
              <Link href="/menu" className="btn-ghost !border-transparent !px-3 hover:!px-5">
                See the menu
              </Link>
            </div>

            <dl
              className="rise-in mt-16 grid max-w-2xl grid-cols-2 gap-8 border-t border-cream/10 pt-9 sm:grid-cols-4"
              style={{ animationDelay: "400ms" }}
            >
              <StatBlock value={dishCount} label="Dishes live" />
              <StatBlock value={12} label="Years on the lane" suffix="+" />
              <StatBlock value={120} label="Seats indoors" />
              <StatBlock value={vegCount} label="Vegetarian dishes" />
            </dl>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden lg:block">
          <div className="float-slow flex flex-col items-center gap-3 text-cream/40">
            <span className="text-[0.6rem] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
              Scroll
            </span>
            <span className="h-16 w-px bg-gradient-to-b from-gold to-transparent" />
          </div>
        </div>
      </section>

      {/* LIVE KITCHEN STATUS */}
      <KitchenBar initial={getKitchenStatus()} initialClock={clockLabel(new Date())} />

      <Marquee
        items={[
          "Ground spice every morning",
          "Dum-sealed biryani",
          "Ninety-minute mutton karahi",
          "Naan off the clay wall",
          "Free delivery over Rs 2,500",
        ]}
      />

      {/* ============ STORY ============ */}
      <section className="relative overflow-hidden py-28">
        <GhostWord word="ZAIQA" />
        <div className="shell relative grid items-center gap-16 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src={IMG.lounge}
                alt="Inside Zaiqa"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="glass absolute -bottom-8 -right-4 max-w-[15rem] p-6 sm:-right-8">
              <p className="display text-3xl text-gold">90 min</p>
              <p className="mt-2 text-xs leading-relaxed text-cream/60">
                That is how long our mutton karahi takes. We do not own a shortcut.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SectionHeading
              eyebrow="Our story"
              title={
                <>
                  Six tables, one burnish, and a recipe book nobody was allowed to{" "}
                  <span className="italic text-gold">change</span>
                </>
              }
            />
            <p className="mt-6 text-base leading-relaxed text-cream/60">
              Amna and Tariq opened Zaiqa in 2014 with six tables and borrowed crockery.
              Twelve years later the room is bigger, but the masala is still ground by hand
              at dawn and somebody from the family is in the kitchen every service.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {craft.map((entry) => (
                <div key={entry.step} className="flex gap-4">
                  <span className="font-display text-sm text-gold">{entry.step}</span>
                  <div>
                    <h3 className="font-display text-lg">{entry.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-cream/55">
                      {entry.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/about" className="btn-ghost">
                Read the whole story
              </Link>
              <Link href="/journal" className="btn-ghost !border-transparent !px-3 hover:!px-5">
                Kitchen journal →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SIGNATURES ============ */}
      <section className="relative border-y border-cream/10 bg-coal py-28">
        <div className="shell">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <SectionHeading
                eyebrow="Chef's signatures"
                title={
                  <>
                    If it is your first visit,{" "}
                    <span className="italic text-gold">start here</span>
                  </>
                }
                description="Six dishes the kitchen is known for. Add them straight to your bag for pickup or delivery."
              />
              <Link href="/menu" className="btn-ghost">
                All {dishCount} dishes
              </Link>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {signatures.map((item, index) => (
              <DishCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CAN'T DECIDE / INTERACTIVE ============ */}
      <section className="relative py-24">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <div className="card grain relative h-full overflow-hidden p-9 sm:p-11">
                <div className="glow-gold absolute -left-24 -top-24 h-72 w-72 opacity-60" />
                <div className="relative">
                  <p className="eyebrow">Cannot decide?</p>
                  <h2 className="display mt-4 text-3xl sm:text-4xl">
                    Let us choose. We are{" "}
                    <span className="italic text-gold">very good at it.</span>
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream/60">
                    Five questions and we will tell you exactly what to order, or spin the
                    wheel and let the tandoor decide. Both take under thirty seconds.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href="/quiz" className="btn-gold">
                      🎯 Take the taste quiz
                    </Link>
                    <DishRoulette items={menu.items.filter((item) => item.isAvailable)} />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={130}>
              <div className="card relative h-full overflow-hidden p-9">
                <span className="text-4xl">🫓</span>
                <h3 className="display mt-5 text-2xl">Build your own thali</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">
                  Six wedges on a plate — base, main, bread, starter, dessert, drink. Fill
                  them all and get 12% off at the counter.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-cream/50">
                  <li>◆ Visual plate fills as you pick</li>
                  <li>◆ Chef can auto-fill for you</li>
                  <li>◆ Swap any dish before ordering</li>
                </ul>
                <Link href="/thali" className="btn-ghost mt-7 w-full">
                  Start building →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ ORDER ONLINE BANNER ============ */}
      <section className="relative overflow-hidden py-24">
        <Image src={IMG.platter} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/88" />
        <div className="shell relative z-10">
          <Reveal>
            <div className="glass grain relative overflow-hidden p-10 sm:p-14">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <p className="eyebrow">Delivery & pickup</p>
                  <h2 className="display mt-4 text-3xl sm:text-4xl">
                    The same kitchen, brought to your{" "}
                    <span className="italic text-gold">door</span>
                  </h2>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-cream/60">
                    Naan travels in paper, never foil, so it reaches you warm instead of
                    steamed. Curries are sealed separately. {site.deliveryRadius}.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href="/order" className="btn-gold">
                      Build your order
                    </Link>
                    <a
                      href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost"
                    >
                      WhatsApp us
                    </a>
                  </div>
                </div>
                <ul className="grid gap-4 text-sm">
                  {[
                    {
                      t: "Free delivery",
                      d: `On every order above Rs ${site.freeDeliveryOver.toLocaleString("en-PK")}.`,
                    },
                    {
                      t: "Live order tracking",
                      d: "Your reference updates from received to out for delivery.",
                    },
                    {
                      t: "Card, cash or transfer",
                      d: "Pay however you like. No minimum order for pickup.",
                    },
                  ].map((row) => (
                    <li key={row.t} className="flex gap-4 rounded-2xl border border-cream/10 p-5">
                      <span className="mt-0.5 text-gold">◆</span>
                      <div>
                        <p className="font-display text-base">{row.t}</p>
                        <p className="mt-1 text-xs leading-relaxed text-cream/55">{row.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ EXPERIENCE ============ */}
      <section className="relative py-28">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="The rooms"
              title={
                <>
                  Four ways to spend an evening{" "}
                  <span className="italic text-gold">here</span>
                </>
              }
            />
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { img: IMG.candle, t: "The Terrace", d: "Forty seats under string lights, October to March." },
              { img: IMG.hall, t: "Mezzanine Hall", d: "Seventy covers with its own bar and washroom." },
              { img: IMG.dining, t: "Chef's Counter", d: "Four stools facing the tandoor wall." },
              { img: IMG.lights, t: "Private Room", d: "Twelve people, closed doors, own service team." },
            ].map((room, index) => (
              <Reveal key={room.t} delay={index * 90}>
                <figure className="group relative h-80 overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={room.img}
                    alt={room.t}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition duration-[1100ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6">
                    <p className="display text-xl">{room.t}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-cream/60">{room.d}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EVENTS TEASER ============ */}
      <section className="relative overflow-hidden border-y border-cream/10 bg-coal py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Events & catering"
              title={
                <>
                  From twelve people to{" "}
                  <span className="italic text-gold">eight hundred</span>
                </>
              }
              description="Live tandoor counters, full staffing, crockery and site survey included. Menu tasting for the larger ones."
            />
            <Link href="/events" className="btn-gold mt-9">
              See event packages
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { n: "800", l: "Largest event catered" },
                { n: "440+", l: "Events since 2014" },
                { n: "1:8", l: "Waiter to guest ratio" },
              ].map((stat) => (
                <div key={stat.l} className="card p-7">
                  <p className="display text-4xl text-gold">{stat.n}</p>
                  <p className="mt-3 text-[0.62rem] uppercase tracking-[0.2em] text-cream/45">
                    {stat.l}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-28">
        <div className="shell">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Guest book"
              title={
                <>
                  What people actually <span className="italic text-gold">say</span>
                </>
              }
            />
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quotes.map((quote, index) => (
              <Reveal key={quote.id} delay={index * 80} className="h-full">
                <figure className="card flex h-full flex-col p-7 transition duration-500 hover:border-gold/30">
                  <Stars rating={quote.rating} />
                  <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-cream/70">
                    “{quote.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-cream/10 pt-5">
                    <span className="block font-display text-base">{quote.name}</span>
                    <span className="text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">
                      {quote.role}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ JOURNAL ============ */}
      <section className="border-y border-cream/10 bg-coal py-28">
        <div className="shell">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="From the journal"
                title={
                  <>
                    Notes from a kitchen that{" "}
                    <span className="italic text-gold">writes things down</span>
                  </>
                }
              />
              <Link href="/journal" className="btn-ghost">
                All articles
              </Link>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-7 md:grid-cols-2">
            {journal.map((post, index) => (
              <Reveal key={post.id} delay={index * 100}>
                <Link
                  href={`/journal/${post.slug}`}
                  className="card group flex h-full flex-col overflow-hidden transition duration-500 hover:-translate-y-1.5 hover:border-gold/35"
                >
                  <div className="relative h-52 overflow-hidden">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition duration-[900ms] group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-coal to-transparent" />
                    <span className="tag absolute left-5 top-5 !bg-ink/80">{post.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="display text-2xl leading-snug transition group-hover:text-gold">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/55">
                      {post.excerpt}
                    </p>
                    <p className="mt-6 text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">
                      {post.author} · {post.readMinutes} min read
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ZAIQA CLUB ============ */}
      <section className="relative overflow-hidden py-24">
        <div className="shell">
          <Reveal>
            <div className="card grain relative overflow-hidden p-9 sm:p-12">
              <GhostWord word="CLUB" />
              <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="eyebrow">Zaiqa Club</p>
                  <h2 className="display mt-4 text-3xl sm:text-4xl">
                    Twelve visits earns you a{" "}
                    <span className="italic text-gold">free karahi</span>
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/60">
                    No app, no barcode, no emails you will never open. We keep a card behind
                    the bar with your name on it, the way it has worked since 2014.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href="/reservations" className="btn-gold">
                      Start a card
                    </Link>
                    <Link href="/contact" className="btn-ghost">
                      Ask about it
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { tier: "Bronze", visits: "3 visits", perks: ["Free lassi", "Priority waitlist"] },
                    { tier: "Silver", visits: "7 visits", perks: ["Free dessert", "Terrace first refusal"] },
                    {
                      tier: "Gold",
                      visits: "12 visits",
                      perks: ["Free mutton karahi", "Chef's counter seat", "Name on the wall"],
                    },
                  ].map((tier, index) => (
                    <div
                      key={tier.tier}
                      className={`rounded-2xl border p-6 ${
                        index === 2 ? "border-gold/50 bg-gold/5" : "border-cream/12"
                      }`}
                    >
                      <p className="text-[0.58rem] uppercase tracking-[0.2em] text-cream/40">
                        {tier.visits}
                      </p>
                      <p className="display mt-2 text-xl text-gold">{tier.tier}</p>
                      <ul className="mt-4 space-y-2 text-xs text-cream/55">
                        {tier.perks.map((perk) => (
                          <li key={perk} className="flex gap-2">
                            <span className="text-gold">◆</span>
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ HOURS + CTA ============ */}
      <section className="py-28">
        <div className="shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Opening hours"
              title={
                <>
                  Closed on <span className="italic text-gold">Mondays</span>, otherwise
                  we are here
                </>
              }
              description="Kitchen takes the last order 45 minutes before closing. Saturday evenings fill up by Thursday."
            />
            <ul className="mt-10 divide-y divide-cream/10 border-y border-cream/10">
              {site.hours.map((entry) => (
                <li key={entry.day} className="flex items-center justify-between py-4 text-sm">
                  <span className="uppercase tracking-[0.16em] text-cream/70">{entry.day}</span>
                  <span className={entry.value === "Closed" ? "text-clay" : "text-gold"}>
                    {entry.value}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="card grain relative h-full overflow-hidden p-10">
              <div className="glow-gold absolute -right-24 -top-24 h-72 w-72" />
              <div className="relative">
                <p className="eyebrow">Reservations</p>
                <h3 className="display mt-4 text-3xl">
                  Save your table in under a minute.
                </h3>
                <ul className="mt-7 space-y-3 text-sm text-cream/60">
                  {[
                    "Zero booking fee, zero deposit",
                    "Free cancellation up to 2 hours before",
                    "Birthday dessert on the house",
                    "Terrace seats released in November",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="text-gold">◆</span>
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Link href="/reservations" className="btn-gold">
                    Book now
                  </Link>
                  <Link href="/contact" className="btn-ghost">
                    Get directions
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
