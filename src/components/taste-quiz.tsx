"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-context";
import { Reveal } from "@/components/motion";
import { formatPrice } from "@/lib/site";
import type { MenuItemWithCategory } from "@/lib/queries";

type Answer = { id: string; label: string; hint: string; emoji: string };

type Question = {
  id: string;
  prompt: string;
  caption: string;
  options: Answer[];
};

const questions: Question[] = [
  {
    id: "heat",
    prompt: "How much heat can you actually handle?",
    caption: "Be honest. We will not judge, but your tongue might.",
    options: [
      { id: "mild", label: "Keep it gentle", hint: "Flavour over fire", emoji: "🥛" },
      { id: "medium", label: "A proper warmth", hint: "Sweat, but enjoy it", emoji: "🌤" },
      { id: "brave", label: "Make me suffer", hint: "Chilli is the point", emoji: "🌶" },
    ],
  },
  {
    id: "craving",
    prompt: "What are you in the mood for right now?",
    caption: "This decides which part of the kitchen we wake up.",
    options: [
      { id: "charcoal", label: "Smoke and charcoal", hint: "Straight off the coals", emoji: "🔥" },
      { id: "gravy", label: "Something to mop up", hint: "Rich, slow gravy", emoji: "🥘" },
      { id: "rice", label: "A full plate of rice", hint: "One pot, no rules", emoji: "🍚" },
      { id: "light", label: "Small and fresh", hint: "Start light", emoji: "🥗" },
    ],
  },
  {
    id: "time",
    prompt: "How long are you willing to wait?",
    caption: "Good karahi cannot be hurried. Bread cannot be slowed.",
    options: [
      { id: "fast", label: "I am hungry now", hint: "Under 20 minutes", emoji: "⚡" },
      { id: "patient", label: "It is worth the wait", hint: "Let it take its time", emoji: "⏳" },
    ],
  },
  {
    id: "diet",
    prompt: "Any lines we should not cross?",
    caption: "We cook vegetarian in separate pans with separate oil.",
    options: [
      { id: "veg", label: "Vegetarian only", hint: "No meat at all", emoji: "🌿" },
      { id: "anything", label: "Everything is fine", hint: "Surprise me", emoji: "🍽" },
    ],
  },
  {
    id: "company",
    prompt: "Who is eating?",
    caption: "A table of one and a table of ten order very differently.",
    options: [
      { id: "solo", label: "Just me", hint: "A quiet plate", emoji: "🙋" },
      { id: "duo", label: "Two of us", hint: "Sharing, probably", emoji: "👥" },
      { id: "crowd", label: "A whole table", hint: "Lots of everything", emoji: "🎉" },
    ],
  },
];

type Scores = Record<string, number>;

function scoreDish(dish: MenuItemWithCategory, answers: Record<string, string>) {
  let score = 40;

  if (answers.heat === "mild") score += dish.spiceLevel === 0 ? 30 : dish.spiceLevel === 1 ? 18 : -22;
  if (answers.heat === "medium") score += dish.spiceLevel === 2 ? 26 : dish.spiceLevel === 1 ? 20 : 4;
  if (answers.heat === "brave") score += dish.spiceLevel === 3 ? 32 : dish.spiceLevel === 2 ? 16 : -14;

  if (answers.craving === "charcoal") {
    score += dish.categorySlug === "tandoor-grill" ? 30 : dish.categorySlug === "starters" ? 10 : -10;
  }
  if (answers.craving === "gravy") {
    score += dish.categorySlug === "curries-karahi" ? 30 : dish.categorySlug === "breads" ? 12 : -8;
  }
  if (answers.craving === "rice") {
    score += dish.categorySlug === "biryani-rice" ? 32 : dish.categorySlug === "breads" ? 6 : -8;
  }
  if (answers.craving === "light") {
    score += dish.categorySlug === "starters" ? 26 : dish.categorySlug === "beverages" ? 18 : -10;
  }

  if (answers.time === "fast") score += dish.prepMinutes <= 15 ? 24 : dish.prepMinutes >= 45 ? -26 : 2;
  if (answers.time === "patient") {
    score += dish.prepMinutes >= 40 ? 26 : dish.prepMinutes <= 8 ? -6 : 8;
  }

  if (answers.diet === "veg") score += dish.isVegetarian ? 60 : -100;

  if (answers.company === "solo") score += dish.price <= 1500 ? 18 : dish.price >= 3000 ? -18 : 4;
  if (answers.company === "duo") score += dish.price >= 1400 && dish.price <= 3400 ? 20 : 2;
  if (answers.company === "crowd") score += dish.price >= 1800 ? 22 : dish.categorySlug === "breads" ? 14 : 0;

  if (dish.isSignature) score += 8;
  if (!dish.isAvailable) score -= 45;

  return Math.max(0, Math.min(99, Math.round(score)));
}

export function TasteQuiz({ items }: { items: MenuItemWithCategory[] }) {
  const { add } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const results = useMemo(() => {
    if (!done) return [];
    return items
      .map((dish) => ({ dish, match: scoreDish(dish, answers) }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);
  }, [done, answers, items]);

  const progress = done ? 100 : Math.round((step / questions.length) * 100);
  const active = done ? null : questions[step];

  function choose(questionId: string, optionId: string) {
    const next = { ...answers, [questionId]: optionId };
    setAnswers(next);
    if (step + 1 >= questions.length) setDone(true);
    else setStep(step + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  const answeredLabel = (question: Question) => {
    const picked = answers[question.id];
    return question.options.find((option) => option.id === picked)?.label ?? "";
  };

  return (
    <div className="card grain relative overflow-hidden">
      <div className="glow-gold absolute -right-32 -top-32 h-80 w-80 opacity-60" />

      {/* PROGRESS */}
      <div className="relative h-1 w-full bg-cream/10">
        <div
          className="h-full bg-gold transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative p-8 sm:p-12">
        {!done && active ? (
          <div key={active.id} className="rise-in">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow">
                Question {step + 1} of {questions.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {questions.slice(0, step).map((question, index) => (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => {
                      setStep(index);
                    }}
                    className="chip !px-3 !py-1 !text-[0.55rem]"
                  >
                    ✓ {answeredLabel(question).split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="display mt-6 text-3xl sm:text-4xl">{active.prompt}</h2>
            <p className="mt-3 text-sm text-cream/50">{active.caption}</p>

            <div
              className={`mt-9 grid gap-4 ${
                active.options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
              }`}
            >
              {active.options.map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choose(active.id, option.id)}
                  className="group rounded-2xl border border-cream/12 p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold/5"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <span className="block text-3xl transition duration-300 group-hover:scale-125">
                    {option.emoji}
                  </span>
                  <span className="mt-4 block font-display text-lg">{option.label}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-cream/40">
                    {option.hint}
                  </span>
                </button>
              ))}
            </div>

            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="mt-8 text-[0.65rem] uppercase tracking-[0.2em] text-cream/40 transition hover:text-gold"
              >
                ← Back
              </button>
            ) : null}
          </div>
        ) : (
          <div className="rise-in">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Your matches</p>
                <h2 className="display mt-3 text-3xl sm:text-4xl">
                  {results[0]?.match && results[0].match > 85
                    ? "We are almost certain about this one"
                    : "Here is what we would order for you"}
                </h2>
              </div>
              <button type="button" onClick={restart} className="btn-ghost !px-5 !py-2.5 !text-[0.62rem]">
                ↻ Take it again
              </button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {results.map((result, index) => (
                <Reveal key={result.dish.id} delay={index * 110} className="h-full">
                  <article
                    className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-0 ${
                      index === 0 ? "border-gold/50" : "border-cream/12"
                    }`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      {result.dish.imageUrl ? (
                        <Image
                          src={result.dish.imageUrl}
                          alt={result.dish.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-ash" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-coal to-transparent" />
                      {index === 0 ? (
                        <span className="tag absolute left-4 top-4 !bg-gold !text-ink">
                          Best match
                        </span>
                      ) : null}
                      <span className="absolute bottom-3 right-4 rounded-full bg-ink/80 px-3 py-1 font-display text-sm text-gold backdrop-blur">
                        {result.match}% match
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-[0.58rem] uppercase tracking-[0.22em] text-cream/40">
                        {result.dish.categoryName}
                      </p>
                      <h3 className="mt-2 font-display text-xl leading-snug">
                        <Link
                          href={`/menu/${result.dish.slug}`}
                          className="transition hover:text-gold"
                        >
                          {result.dish.name}
                        </Link>
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-cream/55">
                        {result.dish.description}
                      </p>

                      {/* MATCH BAR */}
                      <div className="mt-5">
                        <div className="h-1 w-full overflow-hidden rounded-full bg-cream/10">
                          <div
                            className="h-full rounded-full bg-gold transition-all duration-1000"
                            style={{ width: `${result.match}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="font-display text-lg text-gold">
                          {formatPrice(result.dish.price)}
                        </span>
                        <button
                          type="button"
                          disabled={!result.dish.isAvailable}
                          onClick={() =>
                            add({
                              id: result.dish.id,
                              slug: result.dish.slug,
                              name: result.dish.name,
                              price: result.dish.price,
                              imageUrl: result.dish.imageUrl,
                            })
                          }
                          className="btn-gold !px-5 !py-2.5 !text-[0.6rem] disabled:opacity-50"
                        >
                          {result.dish.isAvailable ? "Add to bag" : "Sold out"}
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <p className="mt-9 text-center text-xs leading-relaxed text-cream/40">
              Scoring is based on spice tolerance, craving, wait time, diet and table size —{" "}
              {items.length} dishes considered.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
