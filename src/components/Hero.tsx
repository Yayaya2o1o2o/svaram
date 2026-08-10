"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The landing headline types its way through what the corpus actually holds,
 * so the page says what it is without a paragraph explaining itself.
 */
const WORDS = ["chant", "mantra", "bhajan", "aarti", "chalisa", "stotra"];

const TYPE_MS = 85;
const DELETE_MS = 40;
const HOLD_MS = 1500;

function useTypewriter(words: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];

    if (!deleting && text === word) {
      const hold = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(hold);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const tick = setTimeout(
      () => {
        setText((current) =>
          deleting ? word.slice(0, current.length - 1) : word.slice(0, current.length + 1),
        );
      },
      deleting ? DELETE_MS : TYPE_MS,
    );

    return () => clearTimeout(tick);
  }, [text, deleting, index, words]);

  return text;
}

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const typed = useTypewriter(WORDS);

  return (
    <div className="rise rise-1">
      <p className="font-hi text-sm tracking-[0.28em] text-saffron">
        आरती · भजन · चालीसा · मंत्र · स्तोत्र
      </p>

      <h1 className="mt-5 font-display text-5xl leading-[1.02] font-semibold tracking-tight sm:text-7xl">
        Search any
        <br />
        <span className="inline-flex items-center text-maroon">
          {typed}
          <span className="caret" aria-hidden />
        </span>
        {/* The rotating word is decorative motion; screen readers get the plain sentence. */}
        <span className="sr-only">chant, mantra, bhajan, aarti, chalisa or stotra.</span>
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }}
        className="mt-9 flex max-w-xl items-stretch gap-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hanuman Chalisa, Ekadashi, Tulsidas…"
          aria-label="Search chants, mantras and bhajans"
          className="min-w-0 flex-1 rounded-full border border-line-strong bg-canvas-raised px-6 py-4 text-base shadow-sm outline-none placeholder:text-ink-faint hover:border-saffron focus:border-saffron"
        />
        <button
          type="submit"
          className="rounded-full border border-saffron bg-saffron px-7 text-base font-semibold text-canvas-raised hover:border-maroon hover:bg-maroon"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex max-w-xl flex-wrap gap-2 text-xs">
        {["Hanuman Chalisa", "evening aarti", "Ekadashi", "Annamacharya", "Durga"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
            className="rounded-full border border-line px-3 py-1.5 text-ink-soft hover:-translate-y-0.5 hover:border-saffron hover:text-saffron"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
