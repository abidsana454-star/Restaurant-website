import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getPosts } from "@/lib/queries";
import { IMG } from "@/db/seed-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Kitchen notes, recipes and behind-the-scenes writing from the team at Zaiqa Kitchen & Grill.",
};

export default async function JournalPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title={
          <>
            Notes from a kitchen that{" "}
            <span className="italic text-gold">writes things down</span>
          </>
        }
        description="Recipes, arguments about spice, and the occasional admission that we got it wrong. Written by the people doing the cooking."
        image={IMG.wine}
      />

      {lead ? (
        <section className="shell py-20">
          <Reveal>
            <Link
              href={`/journal/${lead.slug}`}
              className="card group grid overflow-hidden lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="relative h-72 lg:h-full">
                {lead.imageUrl ? (
                  <Image
                    src={lead.imageUrl}
                    alt={lead.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition duration-[1100ms] group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-coal/70 to-transparent lg:bg-gradient-to-r" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="tag">{lead.category}</span>
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-cream/40">
                    {lead.readMinutes} min read
                  </span>
                </div>
                <h2 className="display mt-5 text-3xl leading-tight transition group-hover:text-gold sm:text-4xl">
                  {lead.title}
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-cream/60 sm:text-base">
                  {lead.excerpt}
                </p>
                <p className="mt-7 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">
                  {lead.author}
                  <span className="h-px w-8 bg-gold/50" />
                  Read article →
                </p>
              </div>
            </Link>
          </Reveal>
        </section>
      ) : null}

      <section className="shell pb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="chip">
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="shell pb-28">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, index) => (
            <Reveal key={post.id} delay={Math.min(index * 90, 300)} className="h-full">
              <Link
                href={`/journal/${post.slug}`}
                className="card group flex h-full flex-col overflow-hidden transition duration-500 hover:-translate-y-1.5 hover:border-gold/35"
              >
                <div className="relative h-48 overflow-hidden">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-[900ms] group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-coal to-transparent" />
                  <span className="tag absolute left-5 top-5 !bg-ink/80">{post.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="display text-xl leading-snug transition group-hover:text-gold">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/55">
                    {post.excerpt}
                  </p>
                  <p className="mt-6 text-[0.6rem] uppercase tracking-[0.2em] text-cream/40">
                    {post.author} · {post.readMinutes} min
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
