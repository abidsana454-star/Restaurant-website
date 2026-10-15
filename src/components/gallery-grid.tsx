"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Shot = { src: string; alt: string; span: string };

export function GalleryGrid({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (index === null) return;
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") setIndex((value) => ((value ?? 0) + 1) % shots.length);
      if (event.key === "ArrowLeft")
        setIndex((value) => ((value ?? 0) - 1 + shots.length) % shots.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, shots.length]);

  const active = index === null ? null : shots[index];

  return (
    <>
      <div className="grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] sm:grid-cols-4">
        {shots.map((shot, shotIndex) => (
          <button
            key={shot.alt}
            type="button"
            onClick={() => setIndex(shotIndex)}
            className={`group relative overflow-hidden rounded-[1.35rem] ${shot.span}`}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 640px) 50vw, 50vw"
              className="object-cover transition duration-[1000ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            <span className="absolute bottom-4 left-4 translate-y-3 text-left text-[0.6rem] uppercase tracking-[0.2em] text-cream opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {shot.alt}
              <span className="mt-1 block text-gold">View →</span>
            </span>
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/96 p-5 backdrop-blur-md"
          onClick={() => setIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setIndex(null)}
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-cream/70 transition hover:border-gold hover:text-gold"
          >
            ✕
          </button>
          <button
            type="button"
            aria-label="Previous"
            onClick={(event) => {
              event.stopPropagation();
              setIndex((value) => ((value ?? 0) - 1 + shots.length) % shots.length);
            }}
            className="absolute left-4 grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-cream/70 transition hover:border-gold hover:text-gold sm:left-10"
          >
            ←
          </button>
          <figure
            className="relative max-h-[80vh] w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem]">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-center text-[0.62rem] uppercase tracking-[0.24em] text-cream/55">
              {active.alt} · {(index ?? 0) + 1} / {shots.length}
            </figcaption>
          </figure>
          <button
            type="button"
            aria-label="Next"
            onClick={(event) => {
              event.stopPropagation();
              setIndex((value) => ((value ?? 0) + 1) % shots.length);
            }}
            className="absolute right-4 grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-cream/70 transition hover:border-gold hover:text-gold sm:right-10"
          >
            →
          </button>
        </div>
      ) : null}
    </>
  );
}
