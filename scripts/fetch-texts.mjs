/**
 * Pulls the actual Devanagari text for catalogued entries out of the archives
 * and writes it into src/data/texts/.
 *
 * Why a fetcher and not typed-in text: the corpus needs the real words on the
 * page, but scripture typed from memory drifts. So we take it from the archive
 * that holds it, at build time, and keep the provenance. Run with:
 *
 *   node scripts/fetch-texts.mjs
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = path.join(ROOT, "src", "data", "texts");
mkdirSync(OUT_DIR, { recursive: true });

const INDEXES = [
  "https://sanskritdocuments.org/doc_shiva/",
  "https://sanskritdocuments.org/doc_devii/",
  "https://sanskritdocuments.org/doc_vishhnu/",
  "https://sanskritdocuments.org/doc_krishna/",
  "https://sanskritdocuments.org/doc_raama/",
  "https://sanskritdocuments.org/doc_hanumaan/",
  "https://sanskritdocuments.org/doc_ganesha/",
  "https://sanskritdocuments.org/doc_subrahmanya/",
  "https://sanskritdocuments.org/doc_deities_misc/",
  "https://sanskritdocuments.org/doc_z_misc_shankaracharya/",
  "https://sanskritdocuments.org/doc_z_misc_major_works/",
  "https://sanskritdocuments.org/sanskrit/chalisa/",
  "https://sanskritdocuments.org/sanskrit/arati/",
  "https://sanskritdocuments.org/sanskrit/veda/",
  "https://sanskritdocuments.org/sanskrit/puja/",
];

const UA = "SvaramCorpusFetcher/1.0 (devotional reference; contact via repo)";

async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
      if (res.ok) return await res.text();
      if (res.status === 404) return null;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
  }
  return null;
}

/** Normalizes a title or filename to comparable ASCII tokens. */
function norm(s) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

const STOP = /(stotram?|stotra|sahasranamavali|namavali|ashtottara|shatanamavali|hymn|sanskrit)/g;

function keyOf(s) {
  return norm(s).replace(STOP, "");
}

const devIndex = new Map(); // Devanagari label -> url

async function buildLinkIndex() {
  const map = new Map(); // normalized filename key -> url
  for (const index of INDEXES) {
    const html = await get(index);
    if (!html) {
      console.warn("index failed:", index);
      continue;
    }
    const anchors = [...html.matchAll(/href="([^"]+\.html)"[^>]*>([^<]{1,80})</g)];
    for (const [, href, label] of anchors) {
      const dev = label.replace(/[^\u0900-\u097F]/g, "");
      if (dev.length >= 4) {
        const url0 = href.startsWith("http") ? href : href.startsWith("/") ? `https://sanskritdocuments.org${href}` : new URL(href, index).toString();
        if (url0.includes("sanskritdocuments.org") && !devIndex.has(dev)) devIndex.set(dev, url0);
      }
    }
    const links = anchors.map((m) => m[1]);
    for (const href of links) {
      if (!href.includes("sanskritdocuments.org") && !href.startsWith("/") && !href.startsWith("http")) continue;
      const url = href.startsWith("http")
        ? href
        : href.startsWith("/")
          ? `https://sanskritdocuments.org${href}`
          : new URL(href, index).toString();
      if (!url.includes("sanskritdocuments.org")) continue;
      const file = url.split("/").pop().replace(/\.html$/, "");
      const key = keyOf(file);
      if (key.length < 4) continue;
      if (!map.has(key)) map.set(key, url);
    }
    console.log(`${index} → ${links.length} links`);
  }
  return map;
}

function extractDevanagari(html) {
  let t = html;
  t = t.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  t = t.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|h\d|li|tr)>/gi, "\n");
  t = t.replace(/<[^>]+>/g, "");
  t = t
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

  const lines = t
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => /[ऀ-ॿ]/.test(l))
    .filter((l) => l.length > 1);

  // Drop the archive's own boilerplate and encoding credits.
  const junk =
    /(sanskritdocuments|proofread|encoded|transliterat|pdf|itrans|please|website|comments|last updated|शुद्धिपत्रम्)/i;
  const cleaned = lines
    .filter((l) => !junk.test(l))
    // The archive interleaves editor's notes in Latin script ("or together ??
    // ... as ..."). Strip the note, keep the verse.
    .map((l) => l.replace(/\?\?/g, " ").replace(/\b(or together|as|variant|Note)\b/gi, " "))
    .map((l) => l.replace(/[A-Za-z]{2,}/g, " ").replace(/\s{2,}/g, " ").trim())
    .filter((l) => /[ऀ-ॿ]/.test(l) && l.length > 1);

  // Collapse repeated title lines at the head.
  const out = [];
  for (const line of cleaned) {
    if (out.length && out[out.length - 1] === line) continue;
    out.push(line);
  }
  return out;
}

/** Groups lines into verses: blank-ish boundaries are marked by ॥ endings. */
function toVerses(lines) {
  const verses = [];
  let current = [];
  for (const line of lines) {
    current.push(line);
    if (/॥\s*$|॥\s*\d+\s*॥\s*$/.test(line) || current.length >= 2) {
      verses.push(current.join("\n"));
      current = [];
    }
  }
  if (current.length) verses.push(current.join("\n"));
  return verses;
}

// ── entry list comes from the compiled catalogue seeds ───────────────────────
const catalogSrc = readFileSync(path.join(ROOT, "src", "data", "catalog.ts"), "utf8");
const entries = [...catalogSrc.matchAll(/\n {2}\["([a-z0-9-]+)", "([^"]+)", "([^"]+)"/g)].map((m) => ({
  slug: m[1],
  en: m[2],
  hi: m[3],
}));

console.log(`catalogue entries: ${entries.length}`);

const linkIndex = await buildLinkIndex();
console.log(`archive documents indexed: ${linkIndex.size}`);

/**
 * Filenames in the archive are ITRANS transliterations, so a title like
 * "Rudrashtakam" lives at shivarudrAShTakam.html. These are the tokens that
 * actually appear in the filename, for entries the generic matcher missed.
 */
const ALIASES = {
  "purusha-suktam": ["purushasukta"],
  "sri-suktam": ["shrisukta"],
  "devi-suktam": ["devIsukta", "devisukta"],
  "nila-suktam": ["nIlasukta", "nilasukta"],
  "nasadiya-suktam": ["nAsadIya", "nasadiya"],
  "aditya-hridayam": ["AdityahRidaya", "adityahridaya"],
  "om-purnamadah": ["pUrNamada", "purnamada", "IshopaniShad"],
  "asato-ma": ["asatoma"],
  "sarve-bhavantu-sukhinah": ["svastimantra", "shantimantra", "sarvebhavantu"],
  "om-bhadram-karnebhih": ["bhadraMkarNebhi", "bhadramkarnebhi"],
  rudrashtakam: ["rudrAShTaka", "rudrashtaka"],
  "chandrashekhara-ashtakam": ["chandrashekharAShTaka", "chandrashekharashtaka"],
  "shiva-chalisa": ["shivachAlIsA", "shivachalisa"],
  "jagannatha-ashtakam": ["jagannAthAShTaka", "jagannathashtaka"],
  "vishnu-shatpadi": ["ShaTpadI", "shatpadi"],
  "venkateshwara-suprabhatam": ["veNkaTeshasuprabhAta", "venkateshasuprabhata", "suprabhAta"],
  "krishna-ashtakam": ["kRiShNAShTaka", "krishnashtaka"],
  "nama-ramayanam": ["nAmarAmAyaNa", "namaramayana"],
  "rama-bhujanga-stotram": ["rAmabhujaN", "ramabhujan"],
  "bajrang-baan": ["bajaraN", "bajrang"],
  "hanuman-bahuk": ["hanumAnbAhuka", "hanumanbahuka", "bAhuka"],
  "hanuman-ashtak": ["saNkaTamochana", "sankatamochana", "hanumAnAShTaka"],
  "anjaneya-dandakam": ["AJNjaneyadaNDaka", "anjaneyadandaka"],
  "hanuman-kavacham": ["hanumatkavacha", "hanumAnkavacha"],
  "hanumat-pancharatnam": ["hanumatpaJNcharatna", "hanumatpancharatna"],
  "durga-chalisa": ["durgAchAlIsA", "durgachalisa"],
  "durga-saptashloki": ["saptashlokI", "saptashloki"],
  "saraswati-chalisa": ["sarasvatIchAlIsA", "sarasvatichalisa"],
  "surya-ashtakam": ["sUryAShTaka", "suryashtaka"],
  "surya-kavacham": ["sUryakavacha", "suryakavacha"],
  harivarasanam: ["harivarAsana", "harivarasana"],
  "shani-chalisa": ["shanichAlIsA", "shanichalisa"],
  "karpura-gauram": ["karpUragaura", "karpuragaura", "mantrapuShpa"],
  "gayatri-puja-vidhi": ["sandhyAvandana", "sandhyavandana", "gAyatrI"],
  "shivaratri-puja-vidhi": ["shivarAtripUjA", "shivaratripuja"],
  "ganesha-puja-vidhi": ["gaNeshapUjA", "ganeshapuja", "siddhivinAyaka"],
  "navaratri-puja-vidhi": ["navarAtripUjA", "navaratripuja", "durgApUjA"],
  "laghu-panchayatana-puja": ["paJNchAyatana", "panchayatana"],
  "shyama-sangeet-ramprasad": ["rAmaprasAda", "ramaprasada", "shyAmA"],
};

function findUrl(entry) {
  // Devanagari titles are the most reliable key the index offers.
  const hi = entry.hi.replace(/[^\u0900-\u097F]/g, "");
  if (hi.length >= 4) {
    if (devIndex.has(hi)) return devIndex.get(hi);
    for (const [label, url] of devIndex) {
      if (label.includes(hi) || hi.includes(label)) return url;
    }
  }

  const aliases = ALIASES[entry.slug] ?? [];
  for (const alias of aliases) {
    const k = keyOf(alias);
    if (linkIndex.has(k)) return linkIndex.get(k);
    for (const [key, url] of linkIndex) {
      if (key.includes(k) && k.length >= 5) return url;
    }
  }

  const candidates = [
    entry.en,
    entry.en.replace(/\s*[—(].*$/, ""),
    entry.en.replace(/\b(the|of|and|a)\b/gi, ""),
  ];
  for (const c of candidates) {
    const k = keyOf(c);
    if (k.length >= 5 && linkIndex.has(k)) return linkIndex.get(k);
  }
  // Fall back to the longest indexed key contained in the title, or vice versa.
  const target = keyOf(entry.en);
  let best = null;
  let bestLen = 0;
  for (const [key, url] of linkIndex) {
    if (key.length < 6) continue;
    if (target.includes(key) || key.includes(target)) {
      if (key.length > bestLen) {
        best = url;
        bestLen = key.length;
      }
    }
  }
  return best;
}

const results = {};
let hit = 0;
let miss = 0;
const missed = [];

const queue = [...entries];
const WORKERS = 6;

await Promise.all(
  Array.from({ length: WORKERS }, async () => {
    while (queue.length) {
      const entry = queue.shift();
      const url = findUrl(entry);
      if (!url) {
        miss++;
        missed.push(entry.slug);
        continue;
      }
      const html = await get(url);
      if (!html) {
        miss++;
        missed.push(entry.slug);
        continue;
      }
      const lines = extractDevanagari(html);
      if (lines.length < 4) {
        miss++;
        missed.push(entry.slug);
        continue;
      }
      results[entry.slug] = { url, verses: toVerses(lines).slice(0, 400) };
      hit++;
      console.log(`✓ ${entry.slug} (${lines.length} lines)`);
    }
  }),
);

writeFileSync(path.join(OUT_DIR, "fetched.json"), JSON.stringify(results, null, 1));
console.log(`\nfetched ${hit}, missing ${miss}`);
if (missed.length) console.log("missing:", missed.join(", "));
