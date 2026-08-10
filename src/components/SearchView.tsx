"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EntryList } from "@/components/EntryRow";
import { searchCorpus } from "@/lib/search";
import { CHANT_TYPES, CORPUS_LANGUAGES, DEITIES, TRADITIONS } from "@/data/taxonomy";
import type { ChantType, CorpusLanguage, Deity, Tradition } from "@/data/types";

type Facet = "all" | "text";

export function SearchView() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [deity, setDeity] = useState<Deity | "">("");
  const [type, setType] = useState<ChantType | "">("");
  const [tradition, setTradition] = useState<Tradition | "">("");
  const [language, setLanguage] = useState<CorpusLanguage | "">("");
  const [facet, setFacet] = useState<Facet>("all");

  const results = useMemo(() => {
    let out = searchCorpus(query);
    if (deity) out = out.filter((e) => e.deity.includes(deity));
    if (type) out = out.filter((e) => e.type === type);
    if (tradition) out = out.filter((e) => e.tradition.includes(tradition));
    if (language) out = out.filter((e) => e.language === language);
    if (facet === "text") out = out.filter((e) => e.hasFullText);
    return out;
  }, [query, deity, type, tradition, language, facet]);

  const selectClass =
    "border border-line bg-canvas-raised px-2.5 py-2 text-xs text-ink-soft outline-none hover:border-line-strong";

  return (
    <div>
      <div className="flex items-stretch border border-line-strong bg-canvas-raised">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, deity, saint-poet, occasion or archive"
          aria-label="Search the corpus"
          autoFocus
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink-faint"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <select value={deity} onChange={(e) => setDeity(e.target.value as Deity | "")} className={selectClass} aria-label="Filter by deity">
          <option value="">All deities</option>
          {Object.entries(DEITIES).map(([k, v]) => (
            <option key={k} value={k}>{v.en}</option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value as ChantType | "")} className={selectClass} aria-label="Filter by form">
          <option value="">All forms</option>
          {Object.entries(CHANT_TYPES).map(([k, v]) => (
            <option key={k} value={k}>{v.en}</option>
          ))}
        </select>

        <select value={tradition} onChange={(e) => setTradition(e.target.value as Tradition | "")} className={selectClass} aria-label="Filter by tradition">
          <option value="">All traditions</option>
          {Object.entries(TRADITIONS).map(([k, v]) => (
            <option key={k} value={k}>{v.en}</option>
          ))}
        </select>

        <select value={language} onChange={(e) => setLanguage(e.target.value as CorpusLanguage | "")} className={selectClass} aria-label="Filter by language">
          <option value="">All languages</option>
          {Object.entries(CORPUS_LANGUAGES).map(([k, v]) => (
            <option key={k} value={k}>{v.en}</option>
          ))}
        </select>

        <div className="flex border border-line">
          {(["all", "text"] as Facet[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFacet(f)}
              className={`px-3 py-2 text-xs ${
                facet === f ? "bg-saffron-soft text-maroon" : "text-ink-soft hover:text-saffron"
              }`}
            >
              {f === "all" ? "Everything" : "Full text only"}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 label">
        {results.length} {results.length === 1 ? "entry" : "entries"}
      </p>

      <div className="mt-3">
        <EntryList entries={results} />
      </div>
    </div>
  );
}
