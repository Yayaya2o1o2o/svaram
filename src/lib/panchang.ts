import { MhahPanchang } from "mhah-panchang";
import type { Deity, Occasion } from "@/data/types";

/**
 * The Hindu calendar layer.
 *
 * Panchang elements (tithi, paksha, nakshatra, masa) are computed astronomically
 * with mhah-panchang rather than read from a hardcoded festival list, so the
 * observances below resolve for any date in any year instead of expiring at the
 * end of a table someone typed out.
 *
 * Panchang is location-dependent — a tithi turns at a moment in time, and which
 * calendar day that lands on depends where you stand. We compute for a chosen
 * city, defaulting to New Delhi, which is what most published panchangs do.
 */

export const CITIES = {
  "new-delhi": { label: "New Delhi", lat: 28.6139, lng: 77.209, tz: "Asia/Kolkata" },
  mumbai: { label: "Mumbai", lat: 19.076, lng: 72.8777, tz: "Asia/Kolkata" },
  chennai: { label: "Chennai", lat: 13.0827, lng: 80.2707, tz: "Asia/Kolkata" },
  kolkata: { label: "Kolkata", lat: 22.5726, lng: 88.3639, tz: "Asia/Kolkata" },
  bengaluru: { label: "Bengaluru", lat: 12.9716, lng: 77.5946, tz: "Asia/Kolkata" },
  ahmedabad: { label: "Ahmedabad", lat: 23.0225, lng: 72.5714, tz: "Asia/Kolkata" },
  varanasi: { label: "Varanasi", lat: 25.3176, lng: 82.9739, tz: "Asia/Kolkata" },
  "new-york": { label: "New York", lat: 40.7128, lng: -74.006, tz: "America/New_York" },
  "san-francisco": { label: "San Francisco", lat: 37.7749, lng: -122.4194, tz: "America/Los_Angeles" },
  chicago: { label: "Chicago", lat: 41.8781, lng: -87.6298, tz: "America/Chicago" },
  houston: { label: "Houston", lat: 29.7604, lng: -95.3698, tz: "America/Chicago" },
  london: { label: "London", lat: 51.5072, lng: -0.1276, tz: "Europe/London" },
  toronto: { label: "Toronto", lat: 43.6532, lng: -79.3832, tz: "America/Toronto" },
  sydney: { label: "Sydney", lat: -33.8688, lng: 151.2093, tz: "Australia/Sydney" },
} as const;

export type CityKey = keyof typeof CITIES;
export const DEFAULT_CITY: CityKey = "new-delhi";

/** Masa index as returned by mhah-panchang: 0 = Vaishakha … 11 = Chaitra. */
const MASA_NAMES = [
  "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashvina",
  "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna", "Chaitra",
] as const;

const MASA_HI = [
  "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन",
  "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन", "चैत्र",
] as const;

const TITHI_NAMES = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dvadashi",
  "Trayodashi", "Chaturdashi", "Purnima",
] as const;

const WEEKDAYS = [
  { en: "Sunday", hi: "रविवार", deity: "surya" as Deity, note: "Surya's day — sun offerings at dawn." },
  { en: "Monday", hi: "सोमवार", deity: "shiva" as Deity, note: "Shiva's day — abhishekam and the Shiva Chalisa." },
  { en: "Tuesday", hi: "मंगलवार", deity: "hanuman" as Deity, note: "Hanuman's day — the Chalisa and Bajrang Baan." },
  { en: "Wednesday", hi: "बुधवार", deity: "ganesha" as Deity, note: "Ganesha's day — for beginnings and clearing the way." },
  { en: "Thursday", hi: "गुरुवार", deity: "vishnu" as Deity, note: "Vishnu and the guru — Sai Baba aarti in many homes." },
  { en: "Friday", hi: "शुक्रवार", deity: "lakshmi" as Deity, note: "Lakshmi and the Devi — Sri Suktam and Santoshi Mata." },
  { en: "Saturday", hi: "शनिवार", deity: "shani" as Deity, note: "Shani's day — also Hanuman, who shields from his gaze." },
];

export type ObservanceKind = "festival" | "tithi" | "weekday";

export interface Observance {
  id: string;
  name: string;
  hi: string;
  kind: ObservanceKind;
  deity: Deity[];
  occasion?: Occasion;
  note: string;
}

/** Festivals as calendar rules: [masaIndex, paksha, tithi 1–15]. */
interface FestivalRule {
  masa: number;
  paksha: "Shukla" | "Krishna";
  tithi: number;
  o: Omit<Observance, "kind">;
}

const f = (
  masa: number,
  paksha: "Shukla" | "Krishna",
  tithi: number,
  id: string,
  name: string,
  hi: string,
  deity: Deity[],
  note: string,
  occasion?: Occasion,
): FestivalRule => ({ masa, paksha, tithi, o: { id, name, hi, deity, note, occasion } });

const FESTIVALS: FestivalRule[] = [
  // Chaitra (11)
  f(11, "Shukla", 1, "ugadi", "Ugadi / Gudi Padwa", "उगादि", ["general", "durga"], "The lunar new year in the Deccan and Maharashtra.", "ugadi"),
  f(11, "Shukla", 9, "ram-navami", "Ram Navami", "राम नवमी", ["rama"], "The birth of Rama at midday.", "ram-navami"),
  f(11, "Shukla", 15, "hanuman-jayanti", "Hanuman Jayanti", "हनुमान जयंती", ["hanuman"], "Hanuman's appearance day, on the Chaitra full moon.", "hanuman-jayanti"),
  // Vaishakha (0)
  f(0, "Shukla", 3, "akshaya-tritiya", "Akshaya Tritiya", "अक्षय तृतीया", ["lakshmi", "vishnu"], "A day whose merit is said never to diminish.", "akshaya-tritiya"),
  f(0, "Shukla", 14, "narasimha-jayanti", "Narasimha Jayanti", "नृसिंह जयंती", ["narasimha"], "The man-lion's appearance at dusk.", "narasimha-jayanti"),
  // Ashadha (2)
  f(2, "Shukla", 2, "rath-yatra", "Rath Yatra", "रथ यात्रा", ["jagannath"], "Jagannath rides out from the Puri temple.", "rath-yatra"),
  f(2, "Shukla", 15, "guru-purnima", "Guru Purnima", "गुरु पूर्णिमा", ["guru"], "The full moon given to the teacher.", "guru-purnima"),
  // Shravana (3)
  f(3, "Shukla", 5, "nag-panchami", "Nag Panchami", "नाग पंचमी", ["shiva"], "Milk offered to the serpents.", "nag-panchami"),
  f(3, "Shukla", 15, "raksha-bandhan", "Raksha Bandhan", "रक्षा बंधन", ["general"], "The thread tied for protection.", "raksha-bandhan"),
  f(3, "Krishna", 8, "janmashtami", "Krishna Janmashtami", "जन्माष्टमी", ["krishna"], "Krishna's birth at midnight.", "janmashtami"),
  // Bhadrapada (4)
  f(4, "Shukla", 4, "ganesh-chaturthi", "Ganesh Chaturthi", "गणेश चतुर्थी", ["ganesha"], "Ganesha is installed at home for ten days.", "ganesh-chaturthi"),
  f(4, "Shukla", 8, "radhashtami", "Radhashtami", "राधाष्टमी", ["radha-krishna"], "Radha's appearance day.", "radhashtami"),
  f(4, "Shukla", 14, "anant-chaturdashi", "Anant Chaturdashi", "अनंत चतुर्दशी", ["vishnu", "ganesha"], "Ganesha is given to the water; Ananta is worshipped.", "anant-chaturdashi"),
  // Ashvina (5)
  f(5, "Shukla", 1, "navratri", "Navratri begins", "नवरात्रि आरंभ", ["durga"], "Nine nights of the Goddess open today.", "navratri"),
  f(5, "Shukla", 8, "durga-ashtami", "Durga Ashtami", "दुर्गाष्टमी", ["durga"], "The great eighth night; Kanya Puja.", "durga-ashtami"),
  f(5, "Shukla", 9, "maha-navami", "Maha Navami", "महानवमी", ["durga"], "The ninth night, and Ayudha Puja.", "navratri"),
  f(5, "Shukla", 10, "dussehra", "Dussehra / Vijayadashami", "दशहरा", ["rama", "durga"], "Rama's victory, and the Goddess's.", "dussehra"),
  f(5, "Shukla", 15, "sharad-purnima", "Sharad Purnima", "शरद पूर्णिमा", ["krishna", "lakshmi"], "The autumn full moon and the raas of Vrindavan.", "purnima"),
  // Kartika (6)
  f(6, "Krishna", 13, "dhanteras", "Dhanteras", "धनतेरस", ["lakshmi"], "Dhanvantari's day, opening the Diwali sequence.", "dhanteras"),
  f(6, "Krishna", 14, "narak-chaturdashi", "Narak Chaturdashi", "नरक चतुर्दशी", ["krishna"], "Chhoti Diwali — the oil bath before dawn.", "diwali"),
  f(6, "Krishna", 15, "diwali", "Diwali / Lakshmi Puja", "दीवाली", ["lakshmi", "ganesha"], "The new-moon night of lamps and Lakshmi Puja.", "diwali"),
  f(6, "Shukla", 1, "govardhan", "Govardhan Puja", "गोवर्धन पूजा", ["krishna"], "The hill lifted on one finger.", "govardhan"),
  f(6, "Shukla", 2, "bhai-dooj", "Bhai Dooj", "भाई दूज", ["general"], "Sisters and brothers, and Yama's visit to Yami.", "general-puja"),
  f(6, "Shukla", 6, "chhath", "Chhath Puja", "छठ पूजा", ["surya"], "Standing in water at sunset and sunrise for Surya.", "makar-sankranti"),
  f(6, "Shukla", 11, "tulsi-vivah", "Tulsi Vivah / Devutthana Ekadashi", "तुलसी विवाह", ["tulasi", "vishnu"], "Vishnu wakes; the marriage of Tulasi.", "tulsi-vivah"),
  f(6, "Shukla", 15, "kartik-purnima", "Kartik Purnima / Dev Deepavali", "कार्तिक पूर्णिमा", ["shiva", "vishnu"], "The ghats of Kashi are lit end to end.", "kartik-purnima"),
  // Margashirsha (7)
  f(7, "Shukla", 11, "gita-jayanti", "Gita Jayanti", "गीता जयंती", ["krishna"], "The day the Gita was spoken.", "gita-jayanti"),
  f(7, "Shukla", 15, "datta-jayanti", "Dattatreya Jayanti", "दत्त जयंती", ["dattatreya"], "The appearance of the three-in-one guru.", "dattatreya-jayanti"),
  // Magha (9)
  f(9, "Shukla", 5, "vasant-panchami", "Vasant Panchami", "वसंत पंचमी", ["saraswati"], "Saraswati's day; children are taught their first letters.", "vasant-panchami"),
  f(9, "Shukla", 15, "magha-purnima", "Magha Purnima", "माघ पूर्णिमा", ["vishnu"], "The bathing full moon of Magha.", "purnima"),
  // Phalguna (10)
  f(10, "Krishna", 14, "maha-shivratri", "Maha Shivratri", "महाशिवरात्रि", ["shiva"], "The great night of Shiva, kept through four watches.", "maha-shivratri"),
  f(10, "Shukla", 15, "holi", "Holika Dahan / Holi", "होली", ["krishna"], "The bonfire tonight, colour tomorrow.", "holi"),
];

/** Monthly observances that recur on a tithi regardless of month. */
function tithiObservances(paksha: "Shukla" | "Krishna", tithi: number): Observance[] {
  const out: Observance[] = [];
  const add = (id: string, name: string, hi: string, deity: Deity[], note: string, occasion?: Occasion) =>
    out.push({ id, name, hi, kind: "tithi", deity, note, occasion });

  if (tithi === 11) add("ekadashi", "Ekadashi", "एकादशी", ["vishnu"], "The fasting day of Vishnu, twice each month.", "ekadashi");
  if (tithi === 13) add("pradosh", "Pradosh Vrat", "प्रदोष व्रत", ["shiva"], "Worship in the twilight hour and a half before sunset.", "pradosh");
  if (paksha === "Krishna" && tithi === 14) add("masik-shivratri", "Masik Shivratri", "मासिक शिवरात्रि", ["shiva"], "The monthly night of Shiva.", "masik-shivratri");
  if (paksha === "Krishna" && tithi === 15) add("amavasya", "Amavasya", "अमावस्या", ["general"], "The new moon; offerings to the ancestors.", "amavasya");
  if (paksha === "Shukla" && tithi === 15) add("purnima", "Purnima", "पूर्णिमा", ["vishnu", "guru"], "The full moon; Satyanarayana Puja in many homes.", "purnima");
  if (paksha === "Krishna" && tithi === 4) add("sankashti", "Sankashti Chaturthi", "संकष्टी चतुर्थी", ["ganesha"], "Ganesha's monthly fast, broken at moonrise.", "sankashti");
  if (paksha === "Shukla" && tithi === 4) add("vinayaka-chaturthi", "Vinayaka Chaturthi", "विनायक चतुर्थी", ["ganesha"], "The bright-fortnight Ganesha day.", "sankashti");
  if (paksha === "Shukla" && tithi === 6) add("skanda-shashti", "Skanda Shashti", "स्कंद षष्ठी", ["skanda"], "Murugan's monthly day.", "skanda-shashti");
  if (paksha === "Krishna" && tithi === 8) add("kalashtami", "Kalashtami", "कालाष्टमी", ["shiva"], "The monthly day of Kala Bhairava.", "general-puja");
  return out;
}

export interface PanchangDay {
  city: CityKey;
  cityLabel: string;
  /** Gregorian date rendered in the city's timezone. */
  gregorian: string;
  weekday: { en: string; hi: string };
  tithi: { name: string; number: number; paksha: "Shukla" | "Krishna"; endsAt?: string };
  nakshatra: { name: string; endsAt?: string };
  masa: { en: string; hi: string };
  ritu?: string;
  sunrise?: string;
  sunset?: string;
  observances: Observance[];
  /** Occasions to pull chants for, most specific first. */
  occasions: Occasion[];
}

export function getPanchang(date: Date = new Date(), city: CityKey = DEFAULT_CITY): PanchangDay {
  const place = CITIES[city];
  const engine = new MhahPanchang();
  const basic = engine.calculate(date);
  const cal = engine.calendar(date, place.lat, place.lng);
  const sun = engine.sunTimer(date, place.lat, place.lng) as Record<string, Date | undefined>;

  const paksha: "Shukla" | "Krishna" = basic.Paksha?.name_en_IN === "Krishna" ? "Krishna" : "Shukla";
  const tithiIndex = typeof basic.Tithi?.ino === "number" ? basic.Tithi.ino : 0;
  const tithiNumber = (tithiIndex % 15) + 1;
  const masaIndex = typeof cal.Masa?.ino === "number" ? cal.Masa.ino : 0;

  const short = new Intl.DateTimeFormat("en-US", { timeZone: place.tz, weekday: "short" }).format(date);
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(short);
  const weekday = WEEKDAYS[weekdayIndex === -1 ? 0 : weekdayIndex];

  const festivals: Observance[] = FESTIVALS.filter(
    (r) => r.masa === masaIndex && r.paksha === paksha && r.tithi === tithiNumber,
  ).map((r) => ({ ...r.o, kind: "festival" as const }));

  // Navratri runs nine nights, not one.
  if (masaIndex === 5 && paksha === "Shukla" && tithiNumber >= 2 && tithiNumber <= 9) {
    festivals.push({
      id: `navratri-day-${tithiNumber}`,
      name: `Navratri — night ${tithiNumber}`,
      hi: "नवरात्रि",
      kind: "festival",
      deity: ["durga"],
      note: "One of the nine nights of the Goddess.",
      occasion: "navratri",
    });
  }

  const observances: Observance[] = [
    ...festivals,
    ...tithiObservances(paksha, tithiNumber),
    {
      id: `weekday-${weekday.en.toLowerCase()}`,
      name: `${weekday.en} — ${weekday.deity}`,
      hi: weekday.hi,
      kind: "weekday",
      deity: [weekday.deity],
      note: weekday.note,
    },
  ];

  const fmt = (d?: Date) =>
    d instanceof Date && !Number.isNaN(d.valueOf())
      ? new Intl.DateTimeFormat("en-US", { timeZone: place.tz, hour: "numeric", minute: "2-digit" }).format(d)
      : undefined;

  return {
    city,
    cityLabel: place.label,
    gregorian: new Intl.DateTimeFormat("en-US", {
      timeZone: place.tz, weekday: "long", day: "numeric", month: "long", year: "numeric",
    }).format(date),
    weekday: { en: weekday.en, hi: weekday.hi },
    tithi: {
      name: TITHI_NAMES[tithiNumber - 1] ?? "Pratipada",
      number: tithiNumber,
      paksha,
      endsAt: fmt(basic.Tithi?.end ? new Date(basic.Tithi.end) : undefined),
    },
    nakshatra: {
      name: basic.Nakshatra?.name_en_IN ?? "—",
      endsAt: fmt(basic.Nakshatra?.end ? new Date(basic.Nakshatra.end) : undefined),
    },
    masa: { en: MASA_NAMES[masaIndex] ?? "Chaitra", hi: MASA_HI[masaIndex] ?? "चैत्र" },
    ritu: cal.Ritu?.name_en_UK,
    sunrise: fmt(sun?.sunRise),
    sunset: fmt(sun?.sunSet),
    observances,
    occasions: observances.map((o) => o.occasion).filter((o): o is Occasion => Boolean(o)),
  };
}

// ─── Time of day ──────────────────────────────────────────────────────────

export interface DaySegment {
  id: string;
  name: string;
  hi: string;
  window: string;
  note: string;
  occasions: Occasion[];
}

const SEGMENTS: (DaySegment & { from: number; to: number })[] = [
  { id: "brahma-muhurta", from: 4, to: 6, name: "Brahma Muhurta", hi: "ब्रह्म मुहूर्त", window: "4–6 am", note: "The hour and a half before sunrise, kept for japa and the Gayatri.", occasions: ["daily-morning"] },
  { id: "pratah", from: 6, to: 10, name: "Pratah Kala", hi: "प्रातःकाल", window: "6–10 am", note: "Morning puja — the lamp lit, Suprabhatam and the day's first aarti.", occasions: ["daily-morning"] },
  { id: "madhyahna", from: 10, to: 16, name: "Madhyahna", hi: "मध्याह्न", window: "10 am–4 pm", note: "Midday. Longer readings sit well here — a Sahasranama or a Chalisa.", occasions: ["general-puja"] },
  { id: "sandhya", from: 16, to: 20, name: "Sandhya Kala", hi: "संध्याकाल", window: "4–8 pm", note: "The junction hour: evening aarti, Pradosh, the lamp at the threshold.", occasions: ["daily-evening", "pradosh"] },
  { id: "ratri", from: 20, to: 22, name: "Ratri", hi: "रात्रि", window: "8–10 pm", note: "Bhajan hour, when singing together is easiest.", occasions: ["daily-evening"] },
  { id: "shayana", from: 22, to: 28, name: "Shayana", hi: "शयन", window: "10 pm–4 am", note: "The deity is put to rest; Harivarasanam and quiet japa.", occasions: ["daily-night"] },
];

export function getSegment(date: Date = new Date(), city: CityKey = DEFAULT_CITY): DaySegment {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: CITIES[city].tz, hour: "numeric", hour12: false }).format(date),
  );
  const h = Number.isFinite(hour) ? hour : 9;
  const found = SEGMENTS.find((s) => (h >= s.from && h < s.to) || (s.to > 24 && h < s.to - 24));
  const { from: _f, to: _t, ...segment } = found ?? SEGMENTS[1];
  void _f;
  void _t;
  return segment;
}

export const ALL_SEGMENTS: DaySegment[] = SEGMENTS.map(({ from: _f, to: _t, ...s }) => s);
