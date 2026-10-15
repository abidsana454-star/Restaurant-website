import type { Metadata } from "next";
import Link from "next/link";
import { GalleryGrid } from "@/components/gallery-grid";
import { PageHero } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { IMG } from "@/db/seed-data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A look inside Zaiqa — the room, the tandoor and the plates.",
};

const shots = [
  { src: IMG.hero, alt: "Main dining room", span: "col-span-2 row-span-2" },
  { src: IMG.candle, alt: "Candlelit table", span: "" },
  { src: IMG.lounge, alt: "Leather seating corner", span: "" },
  { src: IMG.dining, alt: "Fine dining setup at night", span: "col-span-2" },
  { src: IMG.wine, alt: "Beverage service", span: "" },
  { src: IMG.lights, alt: "Warm hanging lights", span: "" },
  { src: IMG.guests, alt: "Guests enjoying dinner", span: "col-span-2" },
  { src: IMG.hall, alt: "Elegant seating", span: "" },
  { src: IMG.desserts, alt: "Dessert platter", span: "" },
  { src: IMG.tandoor, alt: "Grill platter from the tandoor", span: "" },
  { src: IMG.platter, alt: "Kebabs and seafood on the pass", span: "" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            The room, the fire and the{" "}
            <span className="italic text-gold">plates</span>
          </>
        }
        description="No filters, no food styling tricks. This is what the room and the food actually look like when service is running. Tap any photo to open it."
        image={IMG.lights}
      />

      <section className="shell py-20">
        <Reveal>
          <GalleryGrid shots={shots} />
        </Reveal>
      </section>

      <section className="border-t border-cream/10 bg-coal py-20">
        <div className="shell flex flex-col items-center gap-6 text-center">
          <p className="eyebrow">Tag us</p>
          <h2 className="display text-3xl sm:text-4xl">
            Photograph your plate, we don&apos;t{" "}
            <span className="italic text-gold">mind at all</span>
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-cream/55">
            Half our Instagram is guests&apos; photos. Lighting is set up for it on the
            terrace and the chef&apos;s counter.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link href="/reservations" className="btn-gold">
              Book a table
            </Link>
            <Link href="/order" className="btn-ghost">
              Order online
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
