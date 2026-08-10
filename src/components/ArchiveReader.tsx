"use client";

import { useState } from "react";
import { LANGUAGES, type LanguageCode } from "@/data/taxonomy";
import { renderInScript, toRoman } from "@/lib/transliterate";
import type { FetchedText } from "@/data/texts";

const SCRIPT_CLASS: Record<LanguageCode, string> = {
  hi: "font-hi",
  en: "font-sans",
  ta: "font-ta",
  te: "font-te",
  kn: "font-kn",
};

/**
 * Reader for text that came from an archive as Devanagari only. Roman is IAST
 * generated from the same source, so every tab shows one text in five scripts
 * rather than five separately-typed versions that can drift apart.
 */
export function ArchiveReader({ text }: { text: FetchedText }) {
  const [language, setLanguage] = useState<LanguageCode>("hi");
  const [scale, setScale] = useState(1);

  const render = (verse: string) => {
    if (language === "hi") return verse;
    if (language === "en") return toRoman(verse);
    return renderInScript(verse, language);
  };

  return (
    <div>
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-y border-line bg-canvas/95 px-1 py-2 backdrop-blur">
        <div className="flex flex-wrap gap-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`rounded-full border px-3.5 py-1.5 text-xs ${
                language === l.code
                  ? "border-saffron bg-saffron-soft font-semibold text-maroon"
                  : "border-line text-ink-soft hover:border-saffron hover:text-saffron"
              } ${SCRIPT_CLASS[l.code]}`}
            >
              {l.code === "en" ? "IAST" : l.native}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.8, Number((s - 0.15).toFixed(2))))}
            className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-saffron hover:text-saffron"
            aria-label="Smaller text"
          >
            A−
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2, Number((s + 0.15).toFixed(2))))}
            className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-saffron hover:text-saffron"
            aria-label="Larger text"
          >
            A+
          </button>
        </div>
      </div>

      <div
        className={`mt-6 ${SCRIPT_CLASS[language]}`}
        style={{ fontSize: `${scale}rem`, lineHeight: 1.5 }}
      >
        {text.verses.map((verse, i) => (
          <p key={i} className="mb-9 whitespace-pre-line text-ink">
            {render(verse)}
          </p>
        ))}
      </div>
    </div>
  );
}
