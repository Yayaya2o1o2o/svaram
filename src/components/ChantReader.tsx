"use client";

import { useState } from "react";
import { LANGUAGES, type LanguageCode } from "@/data/taxonomy";
import { renderInScript } from "@/lib/transliterate";
import type { Chant } from "@/data/types";

const SCRIPT_CLASS: Record<LanguageCode, string> = {
  hi: "font-hi",
  en: "font-sans",
  ta: "font-ta",
  te: "font-te",
  kn: "font-kn",
};

export function ChantReader({ chant }: { chant: Chant }) {
  // Roman first: most readers here can sound it out but cannot read Devanagari.
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [scale, setScale] = useState(1.15);

  const lineFor = (index: number) => {
    const line = chant.lines[index];
    if (language === "en") return line.en;
    if (language === "hi") return line.hi;
    return renderInScript(line.hi, language);
  };

  return (
    <div>
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-y border-line bg-canvas/95 px-1 py-2 backdrop-blur">
        <div className="flex flex-wrap">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`border border-line px-3 py-1.5 text-xs ${
                language === l.code
                  ? "border-saffron bg-saffron-soft font-semibold text-maroon"
                  : "text-ink-soft hover:text-saffron"
              } ${SCRIPT_CLASS[l.code]}`}
            >
              {l.native}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <span className="label mr-1 hidden sm:inline">Size</span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.85, Number((s - 0.15).toFixed(2))))}
            className="border border-line px-2.5 py-1.5 text-xs hover:border-saffron hover:text-saffron"
            aria-label="Smaller text"
          >
            A−
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2.2, Number((s + 0.15).toFixed(2))))}
            className="border border-line px-2.5 py-1.5 text-xs hover:border-saffron hover:text-saffron"
            aria-label="Larger text"
          >
            A+
          </button>
        </div>
      </div>

      {language !== "hi" && language !== "en" ? (
        <p className="mt-4 border-l-2 border-line-strong pl-3 text-xs leading-relaxed text-ink-faint">
          Rendered from the Devanagari by script transliteration, so the sounds stay exact. Word
          breaks and orthography may differ from a hand-set {LANGUAGES.find((l) => l.code === language)?.label} edition.
        </p>
      ) : null}

      <div
        className={`mt-6 ${SCRIPT_CLASS[language]}`}
        style={{ fontSize: `${scale}rem`, lineHeight: 1.5 }}
      >
        {chant.lines.map((_, i) => (
          <p key={i} className="mb-9 whitespace-pre-line text-ink">
            {lineFor(i)}
          </p>
        ))}
      </div>
    </div>
  );
}
