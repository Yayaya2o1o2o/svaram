import Fuse from "fuse.js";
import { CORPUS } from "@/data/corpus";
import { CHANT_TYPES, CORPUS_LANGUAGES, DEITIES, OCCASIONS, TRADITIONS } from "@/data/taxonomy";
import { SOURCES } from "@/data/sources";
import type { CorpusEntry } from "@/data/types";

const searchDocs = CORPUS.map((entry) => ({
  entry,
  titleEn: entry.title.en,
  titleHi: entry.title.hi,
  altTitles: (entry.altTitles ?? []).join(" "),
  tags: entry.tags.join(" "),
  deityNames: entry.deity.map((d) => DEITIES[d].en).join(" "),
  occasionNames: entry.occasions.map((o) => OCCASIONS[o].en).join(" "),
  typeName: CHANT_TYPES[entry.type].en,
  traditionNames: entry.tradition.map((t) => TRADITIONS[t].en).join(" "),
  languageName: CORPUS_LANGUAGES[entry.language].en,
  composer: entry.composer ?? "",
  textSource: entry.textSource ?? "",
  sourceNames: entry.sources.map((s) => SOURCES[s.sourceId]?.org ?? "").join(" "),
  body: entry.hasFullText ? entry.meaningEn : entry.note,
}));

const fuse = new Fuse(searchDocs, {
  keys: [
    { name: "titleEn", weight: 3 },
    { name: "titleHi", weight: 3 },
    { name: "altTitles", weight: 2.5 },
    { name: "composer", weight: 2 },
    { name: "tags", weight: 2 },
    { name: "deityNames", weight: 2 },
    { name: "occasionNames", weight: 1.5 },
    { name: "typeName", weight: 1.2 },
    { name: "traditionNames", weight: 1 },
    { name: "languageName", weight: 1 },
    { name: "textSource", weight: 0.8 },
    { name: "sourceNames", weight: 0.6 },
    { name: "body", weight: 0.5 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

export function searchCorpus(query: string): CorpusEntry[] {
  const trimmed = query.trim();
  if (!trimmed) return CORPUS;
  return fuse.search(trimmed).map((r) => r.item.entry);
}

export function getEntryBySlug(slug: string): CorpusEntry | undefined {
  return CORPUS.find((c) => c.slug === slug);
}
