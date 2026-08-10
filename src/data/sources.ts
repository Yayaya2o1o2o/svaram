/**
 * The archives Svaram's corpus is built on.
 *
 * Deliberate editorial rule: every entry in the corpus points at one of these.
 * We do not seed the database from lyrics aggregators, video titles or
 * streaming metadata — a centuries-old Mirabai pada picks up a modern singer's
 * name within two hops on those, and the attribution never recovers.
 */

export type SourceQuality = "primary" | "institutional" | "scholarly";

export interface Source {
  id: string;
  name: string;
  /** The body that publishes it. */
  org: string;
  url: string;
  quality: SourceQuality;
  /** What this archive is authoritative for. */
  covers: string;
  /** Scale, where the publisher states it. */
  scale?: string;
}

export const SOURCES: Record<string, Source> = {
  "gita-press": {
    id: "gita-press",
    name: "Aarti Sangrah & Bhajan Sangrah",
    org: "Gita Press, Gorakhpur",
    url: "https://gitapress.org/catalogue",
    quality: "institutional",
    covers:
      "The North Indian Hindi and Sanskrit devotional canon — aartis, and bhajans of Tulsidas, Surdas, Mirabai and other saint-poets. Publishing Sanatana Dharma literature since 1923.",
    scale: "Aarti Sangrah collects 102 aartis; Bhajan Sangrah runs to roughly 384 pages",
  },
  "sanskrit-documents": {
    id: "sanskrit-documents",
    name: "Sanskrit Documents",
    org: "sanskritdocuments.org",
    url: "https://sanskritdocuments.org/",
    quality: "scholarly",
    covers:
      "The deepest freely readable archive of stotras, sahasranamas, kavachas, suktas, chalisas and puja vidhi — usually with Devanagari, transliteration, source scans and proofreading notes attached.",
    scale: "Thousands of texts across dedicated Veda, aarti, puja, chalisa and per-deity collections",
  },
  "ttd-annamacharya": {
    id: "ttd-annamacharya",
    name: "Annamacharya Project",
    org: "Tirumala Tirupati Devasthanams",
    url: "https://www.tirumala.org/AnnamacharyaSankeerthanas.aspx",
    quality: "primary",
    covers:
      "Telugu and Sanskrit sankeertanas to Venkateswara by Annamacharya, maintained by the temple itself.",
    scale: "14,892 compositions searchable online; TTD records that roughly 32,000 were composed",
  },
  "ttd-divya-prabandham": {
    id: "ttd-divya-prabandham",
    name: "Alwar Divya Prabandha Project",
    org: "Tirumala Tirupati Devasthanams",
    url: "https://www.tirumala.org/RAAlwarDivyaPrabandhaProject.aspx",
    quality: "primary",
    covers:
      "The Nalayira Divya Prabandham — the Tamil pasurams of the Alvars, central to Sri Vaishnava temple liturgy.",
    scale: "4,000 Tamil hymns",
  },
  "ttd-dasa-sahitya": {
    id: "ttd-dasa-sahitya",
    name: "Dasa Sahitya Project",
    org: "Tirumala Tirupati Devasthanams",
    url: "https://www.tirumala.org/RADasaSahityaProject.aspx",
    quality: "primary",
    covers:
      "Kannada devaranamas of the Haridasa movement — Purandaradasa, Kanakadasa and after — with notation, recordings and rare works.",
  },
  ignca: {
    id: "ignca",
    name: "Bhakti literature archives",
    org: "IGNCA, Government of India",
    url: "https://ignca.gov.in/coilnet/meera.htm",
    quality: "institutional",
    covers:
      "State cultural archive for the Hindi Bhakti poets — Mirabai, Surdas, Kabir — and the best place to check what a saint-poet actually wrote before trusting a modern recording's credits.",
  },
  dlshq: {
    id: "dlshq",
    name: "Sivananda Ashram Devotional Songs",
    org: "The Divine Life Society",
    url: "https://www.dlshq.org/books/sivananda-ashram-devotional-songs/",
    quality: "institutional",
    covers:
      "A broad traditional bhajan and kirtan collection carrying transliteration and English translation throughout.",
    scale: "304 pages",
  },
  baps: {
    id: "baps",
    name: "Kirtan archive",
    org: "BAPS Swaminarayan Sanstha",
    url: "https://www.baps.org/Downloads/Kirtans.aspx",
    quality: "primary",
    covers:
      "Gujarati and Hindi Swaminarayan kirtans and aartis with composer, performer and recording metadata.",
    scale: "Around 66 aartis composed by the Swaminarayan paramhansas alone",
  },
  "belur-math": {
    id: "belur-math",
    name: "Devotional song archive",
    org: "Ramakrishna Math, Belur",
    url: "https://media.belurmath.org/tag/devotional-songs/",
    quality: "primary",
    covers:
      "Bengali and Hindi devotional music of the Ramakrishna order — Shyama Sangeet, Kali and Vedanta traditions, including the Aratrika vespers hymns.",
  },
  vedabase: {
    id: "vedabase",
    name: "Gaudiya Vaishnava song library",
    org: "Vedabase / Bhaktivedanta Archives",
    url: "https://vedabase.io/en/library/",
    quality: "primary",
    covers:
      "Songs of Narottama Dasa, Bhaktivinoda Thakura, Locana Dasa and Jayadeva, with the attribution the Gaudiya line itself keeps.",
  },
  hss: {
    id: "hss",
    name: "Prarthana & daily prayers",
    org: "Hindu Swayamsevak Sangh",
    url: "https://www.hssus.org/",
    quality: "institutional",
    covers:
      "The shakha prayer set as actually recited — Vishwa Prarthana and the Bhojan Mantra — where the wording is fixed by the organization rather than by a published edition.",
  },
  "krishna-com": {
    id: "krishna-com",
    name: "Arati reference & Hare Krishna Music Book",
    org: "Krishna.com",
    url: "https://krishna.com/topic-index/arati/",
    quality: "institutional",
    covers:
      "The daily temple arati cycle as actually performed — Mangala, Tulasi, Guru-puja, Raja Bhoga, Sandhya and Sayana — with the songs assigned to each.",
  },
};

export const SOURCE_LIST = Object.values(SOURCES);

export function sourceById(id: string): Source | undefined {
  return SOURCES[id];
}
