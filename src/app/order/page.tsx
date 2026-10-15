import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckoutClient } from "@/components/checkout-client";
import { DishCard } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getSignatureDishes } from "@/lib/queries";
import { IMG } from "@/db/seed-data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Online",
  description:
    "Pickup or delivery from Zaiqa Kitchen & Grill. Cooked to order, packed in paper so the naan stays warm.",
};

const steps = [
  { n: "01", t: "Fill the bag", d: "Add dishes from the menu. Quantities are up to you." },
  { n: "02", t: "Pick or deliver", d: "Pickup is ready in about 25 minutes. Delivery in ~45." },
  { n: "03", t: "Get a reference", d: "We call to confirm, then the kitchen fires your ticket." },
];

export default async function OrderPage() {
  const popular = await getSignatureDishes(3);

  return (
    <>
      <section className="relative flex min-h-[52vh] items-end overflow-hidden">
        <Image src={IMG.platter} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/45" />
        <div className="shell relative z-10 pb-14 pt-44">
          <p className="eyebrow rise-in">Order online</p>
          <h1
            className="display rise-in mt-5 max-w-2xl text-4xl sm:text-5xl lg:text-[4rem]"
            style={{ animationDelay: "90ms" }}
          >
            Same kitchen. <span className="italic text-gold">Your table.</span>
          </h1>
          <p
            className="rise-in mt-6 max-w-xl text-cream/65"
            style={{ animationDelay: "180ms" }}
          >
            Everything is cooked when you order it, then packed so it survives the journey.
            {site.deliveryRadius}.
          </p>
        </div>
      </section>

      <section className="shell py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.n} delay={index * 90}>
              <div className="card h-full p-7">
                <span className="font-display text-sm text-gold">{step.n}</span>
                <h2 className="display mt-3 text-xl">{step.t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-cream/55">{step.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <CheckoutClient />
        </div>
      </section>

      <section className="border-t border-cream/10 bg-coal py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Most ordered</p>
              <h2 className="display mt-4 text-3xl">
                Start with these <span className="italic text-gold">three</span>
              </h2>
            </div>
            <Link href="/menu" className="btn-ghost">
              Full menu
            </Link>
          </div>
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((item) => (
              <DishCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
