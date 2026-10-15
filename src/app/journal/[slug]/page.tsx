import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { getPostBySlug, getPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

/** Very small paragraph renderer: splits on blank lines and handles **bold**. */
function Article({ body }: { body: string }) {
  return (
    <div className="space-y-6">
      {body.split("\n\n").map((paragraph, index) => {
        const blocks = paragraph.split("**");
        return (
          <p key={index} className="text-base leading-[1.85] text-cream/70">
            {blocks.map((chunk, chunkIndex) =>
              chunkIndex % 2 === 1 ? (
                <strong key={chunkIndex} className="font-medium text-cream">
                  {chunk}
                </strong>
              ) : (
                <span key={chunkIndex}>{chunk}</span>
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getPosts();
  const more = all.filter((entry) => entry.slug !== slug).slice(0, 2);

  return (
    <>
      <section className="relative flex min-h-[64vh] items-end overflow-hidden">
        {post.imageUrl ? (
          <Image src={post.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/82 to-ink/45" />
        <div className="shell relative z-10 pb-16 pt-44">
          <nav className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-cream/45">
            <Link href="/journal" className="transition hover:text-gold">
              Journal
            </Link>
            <span>/</span>
            <span className="text-gold">{post.category}</span>
          </nav>
          <h1
            className="display rise-in mt-6 max-w-3xl text-3xl sm:text-5xl lg:text-[3.6rem]"
            style={{ animationDelay: "80ms" }}
          >
            {post.title}
          </h1>
          <div
            className="rise-in mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.62rem] uppercase tracking-[0.2em] text-cream/45"
            style={{ animationDelay: "160ms" }}
          >
            <span className="text-gold">{post.author}</span>
            <span>{post.readMinutes} min read</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      <section className="shell py-16">
        <div className="mx-auto max-w-2xl">
          <p className="display border-l-2 border-gold/60 pl-6 text-xl italic leading-relaxed text-cream/85">
            {post.excerpt}
          </p>
          <div className="my-10">
            <Article body={post.body} />
          </div>

          <div className="card mt-12 p-8 text-center">
            <p className="eyebrow !text-[0.6rem]">Taste it, don&apos;t just read it</p>
            <h2 className="display mt-3 text-2xl">Come and eat with us</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-cream/55">
              Everything in this article is on the card, cooked the same way, every day.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link href="/menu" className="btn-gold">
                See the menu
              </Link>
              <Link href="/reservations" className="btn-ghost">
                Reserve a table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {more.length > 0 ? (
        <section className="border-t border-cream/10 bg-coal py-24">
          <div className="shell">
            <p className="eyebrow">Keep reading</p>
            <div className="mt-10 grid gap-7 md:grid-cols-2">
              {more.map((entry, index) => (
                <Reveal key={entry.id} delay={index * 100}>
                  <Link
                    href={`/journal/${entry.slug}`}
                    className="card group flex gap-5 overflow-hidden p-5 transition duration-500 hover:-translate-y-1.5 hover:border-gold/35"
                  >
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
                      {entry.imageUrl ? (
                        <Image
                          src={entry.imageUrl}
                          alt={entry.title}
                          fill
                          sizes="120px"
                          className="object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[0.58rem] uppercase tracking-[0.2em] text-gold">
                        {entry.category}
                      </span>
                      <h3 className="display mt-2 text-lg leading-snug transition group-hover:text-gold">
                        {entry.title}
                      </h3>
                      <p className="mt-2 text-[0.6rem] uppercase tracking-[0.18em] text-cream/40">
                        {entry.readMinutes} min read
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
