import { CHANTS } from "./chants";
import { CATALOG } from "./catalog";
import type {
  Chant,
  CorpusEntry,
  CorpusLanguage,
  Deity,
  Occasion,
  SourceRef,
  Tradition,
} from "./types";

/**
 * Attribution for the full-text half of the corpus.
 *
 * chants.ts carries the words; this carries where the words come from. Kept
 * apart so text and provenance can be reviewed independently — a wrong source
 * line is a citation bug, a wrong chant line is a liturgical one.
 */
type Attribution = {
  tradition: Tradition[];
  language: CorpusLanguage;
  sources: SourceRef[];
  composer?: string;
  era?: string;
  textSource?: string;
};

const sd = (path: string): SourceRef => ({
  sourceId: "sanskrit-documents",
  ref: path,
  url: `https://sanskritdocuments.org/${path}`,
});
const gp: SourceRef = { sourceId: "gita-press", ref: "Aarti Sangrah / Bhajan Sangrah" };

const ATTRIBUTION: Record<string, Attribution> = {
  "om-jai-jagdish-hare": {
    tradition: ["vaishnava", "pan-hindu"], language: "hindi",
    sources: [gp, sd("sanskrit/arati/")],
    composer: "Shraddha Ram Phillauri", era: "19th c.",
  },
  "hanuman-chalisa": {
    tradition: ["pan-hindu"], language: "awadhi",
    sources: [gp, sd("sanskrit/chalisa/")],
    composer: "Tulsidas", era: "16th c.",
  },
  "om-jai-shiv-omkara": {
    tradition: ["shaiva", "pan-hindu"], language: "hindi",
    sources: [gp, sd("sanskrit/arati/")],
  },
  "jai-ambe-gauri": {
    tradition: ["shakta"], language: "hindi",
    sources: [gp, sd("sanskrit/arati/")],
  },
  "om-jai-lakshmi-mata": {
    tradition: ["vaishnava", "shakta"], language: "hindi",
    sources: [gp, sd("sanskrit/arati/")],
  },
  "sukhkarta-dukhharta": {
    tradition: ["pan-hindu"], language: "marathi",
    sources: [gp],
    composer: "Samarth Ramdas", era: "17th c.",
  },
  "jai-ganesh-deva": {
    tradition: ["pan-hindu"], language: "hindi",
    sources: [gp, sd("sanskrit/arati/")],
  },
  "aarti-sai-baba": {
    tradition: ["pan-hindu"], language: "marathi",
    sources: [gp],
  },
  "saraswati-vandana": {
    tradition: ["smarta", "pan-hindu"], language: "sanskrit",
    sources: [sd("doc_devii/")],
  },
  "gayatri-mantra": {
    tradition: ["vedic"], language: "sanskrit",
    sources: [sd("sanskrit/veda/")],
    era: "Vedic", textSource: "Rigveda 3.62.10",
  },
  "mahamrityunjaya-mantra": {
    tradition: ["vedic", "shaiva"], language: "sanskrit",
    sources: [sd("doc_shiva/")],
    era: "Vedic", textSource: "Rigveda 7.59.12 (Tryambakam)",
  },
  "vakratunda-mahakaya": {
    tradition: ["smarta", "pan-hindu"], language: "sanskrit",
    sources: [sd("doc_ganesha/")],
  },
  "om-sahana-vavatu": {
    tradition: ["vedic"], language: "sanskrit",
    sources: [sd("sanskrit/veda/")],
    era: "Vedic", textSource: "Taittiriya & Katha Upanishad",
  },
  "vaishnav-jan-to": {
    tradition: ["sant", "vaishnava"], language: "gujarati",
    sources: [gp, { sourceId: "ignca" }],
    composer: "Narsinh Mehta", era: "15th c.",
  },
  "raghupati-raghava-raja-ram": {
    tradition: ["sant", "pan-hindu"], language: "hindi",
    sources: [gp, { sourceId: "dlshq" }],
    composer: "Traditional; the sung setting is credited to Vishnu Digambar Paluskar",
  },
  "shri-ramchandra-kripalu": {
    tradition: ["sant", "vaishnava"], language: "awadhi",
    sources: [gp, sd("doc_raama/")],
    composer: "Tulsidas", era: "16th c.",
  },
  "achyutam-keshavam": {
    tradition: ["vaishnava"], language: "sanskrit",
    sources: [sd("doc_vishhnu/")],
  },
  "hare-krishna-maha-mantra": {
    tradition: ["gaudiya"], language: "sanskrit",
    sources: [{ sourceId: "vedabase" }, { sourceId: "krishna-com" }],
    textSource: "Kali-santarana Upanishad",
  },
  "vishwa-prarthana": {
    tradition: ["pan-hindu"], language: "sanskrit",
    sources: [{ sourceId: "hss" }],
  },
  "bhojan-mantra": {
    tradition: ["pan-hindu", "vedic"], language: "sanskrit",
    sources: [{ sourceId: "hss" }, sd("doc_z_misc_major_works/")],
    textSource: "Bhagavad Gita 4.24",
  },
  "ya-devi-sarva-bhuteshu": {
    tradition: ["shakta"], language: "sanskrit",
    sources: [sd("doc_devii/")],
    textSource: "Durga Saptashati, ch. 5",
  },
  "guru-mantra": {
    tradition: ["pan-hindu"], language: "sanskrit",
    sources: [sd("doc_z_misc_major_works/"), { sourceId: "dlshq" }],
  },
  "raksha-bandhan-mantra": {
    tradition: ["pan-hindu"], language: "sanskrit",
    sources: [sd("sanskrit/puja/")],
  },
  "surya-namaskar-mantra": {
    tradition: ["vedic", "smarta"], language: "sanskrit",
    sources: [sd("doc_deities_misc/")],
  },
  "om-gan-ganapataye-namah": {
    tradition: ["smarta", "pan-hindu"], language: "sanskrit",
    sources: [sd("doc_ganesha/")],
  },
  "om-namah-shivaya": {
    tradition: ["shaiva"], language: "sanskrit",
    sources: [sd("doc_shiva/")],
    era: "Vedic", textSource: "Krishna Yajurveda (within Sri Rudram)",
  },
};

const FALLBACK: Attribution = {
  tradition: ["pan-hindu"],
  language: "sanskrit",
  sources: [{ sourceId: "sanskrit-documents" }],
};

/** The 26 chants we hold in full, with provenance attached. */
export const FULL_TEXT_CHANTS: Chant[] = CHANTS.map((c) => {
  const a = ATTRIBUTION[c.slug] ?? FALLBACK;
  return {
    ...c,
    tradition: a.tradition,
    language: a.language,
    sources: a.sources,
    composer: a.composer,
    era: a.era,
    textSource: a.textSource,
  };
});

/** Everything: text we hold, plus everything we can only point at. */
export const CORPUS: CorpusEntry[] = [
  ...FULL_TEXT_CHANTS.map((c) => ({ ...c, hasFullText: true as const })),
  ...CATALOG.map((c) => ({ ...c, hasFullText: false as const })),
];

export const CORPUS_BY_SLUG = new Map(CORPUS.map((e) => [e.slug, e] as const));

export function entryBySlug(slug: string): CorpusEntry | undefined {
  return CORPUS_BY_SLUG.get(slug);
}

export function entriesForOccasion(occasion: Occasion): CorpusEntry[] {
  return CORPUS.filter((e) => e.occasions.includes(occasion));
}

export function entriesForDeity(deity: Deity): CorpusEntry[] {
  return CORPUS.filter((e) => e.deity.includes(deity));
}

/** Full-text entries sort first — they are the ones you can actually read here. */
export function readableFirst(entries: CorpusEntry[]): CorpusEntry[] {
  return [...entries].sort((a, b) => Number(b.hasFullText) - Number(a.hasFullText));
}

export const CORPUS_STATS = {
  total: CORPUS.length,
  withText: FULL_TEXT_CHANTS.length,
  catalogued: CATALOG.length,
  deities: new Set(CORPUS.flatMap((e) => e.deity)).size,
  languages: new Set(CORPUS.map((e) => e.language)).size,
  traditions: new Set(CORPUS.flatMap((e) => e.tradition)).size,
};
