"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const SUGGESTIONS = ["Hanuman Chalisa", "evening aarti", "Ekadashi", "Annamacharya", "Tulsidas", "Durga"];

export function PillSearch({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }}
        className="flex items-stretch border border-line-strong bg-canvas-raised"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search an aarti, deity, saint-poet or occasion"
          aria-label="Search the corpus"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink-faint"
        />
        <button
          type="submit"
          className="border-l border-line-strong bg-saffron px-5 text-sm font-semibold text-canvas-raised hover:bg-maroon"
        >
          Find
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
            className="border border-line px-2.5 py-1 text-ink-soft hover:border-saffron hover:text-saffron"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
