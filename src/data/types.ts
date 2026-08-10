export type Deity =
  | "ganesha"
  | "shiva"
  | "vishnu"
  | "rama"
  | "krishna"
  | "radha-krishna"
  | "venkateshwara"
  | "vitthala"
  | "narasimha"
  | "jagannath"
  | "chaitanya"
  | "swaminarayan"
  | "hanuman"
  | "devi"
  | "durga"
  | "kali"
  | "lakshmi"
  | "saraswati"
  | "parvati"
  | "lalita"
  | "ganga"
  | "tulasi"
  | "surya"
  | "shani"
  | "navagraha"
  | "dattatreya"
  | "ayyappa"
  | "skanda"
  | "sai-baba"
  | "guru"
  | "general";

export type ChantType =
  | "aarti"
  | "chalisa"
  | "mantra"
  | "stotra"
  | "bhajan"
  | "mangalacharan"
  | "ashtakam"
  | "suprabhatam"
  | "suktam"
  | "sahasranama"
  | "kavacham"
  | "kirtan"
  | "abhang"
  | "pada"
  | "pasuram"
  | "keertana"
  | "devaranama"
  | "prabhatiya"
  | "shyama-sangeet"
  | "vrata";

/**
 * The devotional lineage a composition belongs to. A chant can sit in more
 * than one — Hanuman Chalisa is read across Vaishnava and pan-Hindu practice.
 */
export type Tradition =
  | "vedic"
  | "vaishnava"
  | "gaudiya"
  | "sri-vaishnava"
  | "haridasa"
  | "shaiva"
  | "shakta"
  | "smarta"
  | "swaminarayan"
  | "sant"
  | "pan-hindu";

export type CorpusLanguage =
  | "sanskrit"
  | "hindi"
  | "braj"
  | "awadhi"
  | "tamil"
  | "telugu"
  | "kannada"
  | "marathi"
  | "gujarati"
  | "bengali"
  | "odia"
  | "assamese";

export type Occasion =
  | "daily-morning"
  | "daily-evening"
  | "daily-night"
  | "ekadashi"
  | "purnima"
  | "amavasya"
  | "pradosh"
  | "sankashti"
  | "masik-shivratri"
  | "skanda-shashti"
  | "diwali"
  | "dhanteras"
  | "govardhan"
  | "navratri"
  | "durga-ashtami"
  | "dussehra"
  | "ganesh-chaturthi"
  | "anant-chaturdashi"
  | "maha-shivratri"
  | "ram-navami"
  | "janmashtami"
  | "radhashtami"
  | "hanuman-jayanti"
  | "vasant-panchami"
  | "guru-purnima"
  | "karva-chauth"
  | "raksha-bandhan"
  | "nag-panchami"
  | "makar-sankranti"
  | "holi"
  | "ugadi"
  | "akshaya-tritiya"
  | "rath-yatra"
  | "tulsi-vivah"
  | "kartik-purnima"
  | "gita-jayanti"
  | "dattatreya-jayanti"
  | "narasimha-jayanti"
  | "varalakshmi"
  | "satyanarayana"
  | "kali-puja"
  | "general-puja";

/** A pointer back to the institutional archive an entry was taken from. */
export interface SourceRef {
  /** Key into SOURCES in data/sources.ts */
  sourceId: string;
  /** Where inside that source — a book, project or section. */
  ref?: string;
  /** Direct link, when the source publishes one. */
  url?: string;
}

/**
 * `hi` holds the canonical Devanagari text (Sanskrit or Hindi).
 * `en` is a rhythmic, easy-to-read Roman transliteration for chanting aloud.
 * Tamil / Telugu / Kannada renderings are derived from `hi` at runtime via
 * script transliteration (see lib/transliterate.ts) rather than hand-authored,
 * since script-to-script conversion is phonetically deterministic and this
 * avoids introducing typos in scripts we can't easily proofread.
 */
export interface ChantLine {
  hi: string;
  en: string;
}

/**
 * Shared metadata for everything in the corpus, whether or not we hold the
 * full text. Catalogue-only entries carry the same attribution as full-text
 * ones — the difference is only whether `lines` is present.
 */
export interface CorpusEntryBase {
  slug: string;
  title: { hi: string; en: string };
  /** Other names the same composition circulates under. */
  altTitles?: string[];
  deity: Deity[];
  type: ChantType;
  tradition: Tradition[];
  language: CorpusLanguage;
  occasions: Occasion[];
  tags: string[];
  /** Saint-poet or attributed author, where the tradition names one. */
  composer?: string;
  /** Rough period, e.g. "15th c." or "Vedic". */
  era?: string;
  /** The scripture or book the text sits inside, when it has one. */
  textSource?: string;
  /** Institutional archives that carry this composition. */
  sources: SourceRef[];
}

export interface Chant extends CorpusEntryBase {
  durationMin: number;
  lines: ChantLine[];
  /** Plain-English meaning / summary of what the chant says and when it's used. */
  meaningEn: string;
  /** Short note on the traditional source / attribution. */
  source: string;
}

/**
 * A corpus entry we can attribute and categorize with confidence but whose
 * full text we deliberately do not reproduce from memory — the reader is sent
 * to the institutional archive instead. Keeping these separate from `Chant`
 * is the whole point: it means nothing in the reader is invented.
 */
export interface CatalogEntry extends CorpusEntryBase {
  /** One line on what it is and when it is used. */
  note: string;
  /** Approximate length, where the tradition fixes it (e.g. 40 verses). */
  extent?: string;
}

export type CorpusEntry =
  | (Chant & { hasFullText: true })
  | (CatalogEntry & { hasFullText: false });
