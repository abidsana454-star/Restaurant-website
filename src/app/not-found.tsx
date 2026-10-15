import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-5 text-4xl sm:text-5xl">
        That page left the <span className="italic text-gold">kitchen</span>
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/60">
        The link is broken or the dish has been taken off the menu. Try the food instead.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-gold">
          Back home
        </Link>
        <Link href="/menu" className="btn-ghost">
          See the menu
        </Link>
      </div>
    </section>
  );
}
