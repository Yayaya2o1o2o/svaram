import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PillSearch } from "@/components/PillSearch";
import { TodayPanel } from "@/components/TodayPanel";
import { CORPUS_STATS, readableFirst, CORPUS } from "@/data/corpus";
import { CHANT_TYPES, DEITIES } from "@/data/taxonomy";
import { SOURCE_LIST } from "@/data/sources";
import { DEFAULT_CITY, type CityKey, CITIES } from "@/lib/panchang";
import type { Deity } from "@/data/types";

/** The panchang turns over daily, so the shell is revalidated rather than frozen. */
export const revalidate = 900;

const PRIMARY_DEITIES: Deity[] = [
  "ganesha", "shiva", "vishnu", "rama", "krishna", "hanuman",
  "durga", "lakshmi", "saraswati", "devi", "surya", "venkateshwara",
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const activeCity: CityKey = city && city in CITIES ? (city as CityKey) : DEFAULT_CITY;

  const readable = readableFirst(CORPUS).slice(0, 8);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Masthead */}
        <section className="border-b border-line py-12 sm:py-16">
          <p className="font-hi text-sm tracking-[0.3em] text-saffron">
            आरती · भजन · चालीसा · मंत्र · स्तोत्र
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
            Every chant, and the day
            <br />
            it belongs to.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            A sourced reference for Hindu aartis, bhajans, chalisas, mantras and stotras — organized
            by deity, by tradition, and by the Hindu calendar, so the page already knows what today
            is when you open it.
          </p>

          <div className="mt-8 max-w-2xl">
            <PillSearch />
          </div>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
            {[
              { k: "Compositions", v: CORPUS_STATS.total },
              { k: "Readable in full", v: CORPUS_STATS.withText },
              { k: "Deities", v: CORPUS_STATS.deities },
              { k: "Languages", v: CORPUS_STATS.languages },
              { k: "Archives cited", v: SOURCE_LIST.length },
            ].map((s) => (
              <div key={s.k}>
                <dt className="label">{s.k}</dt>
                <dd className="font-display text-2xl font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Today */}
        <section className="py-10 sm:py-14">
          <TodayPanel city={activeCity} />
          <form action="/" className="mt-3 flex items-center gap-2 text-xs text-ink-faint">
            <label htmlFor="city">Panchang computed for</label>
            <select
              id="city"
              name="city"
              defaultValue={activeCity}
              className="border border-line bg-canvas-raised px-2 py-1 text-xs"
            >
              {Object.entries(CITIES).map(([key, c]) => (
                <option key={key} value={key}>{c.label}</option>
              ))}
            </select>
            <button type="submit" className="border border-line-strong px-2 py-1 hover:border-saffron hover:text-saffron">
              Set
            </button>
          </form>
        </section>

        {/* Deity index — letterforms, not icons */}
        <section className="border-t border-line-strong py-10 sm:py-14">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold">By deity</h2>
            <Link href="/browse" className="text-sm text-saffron hover:underline">All categories →</Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
            {PRIMARY_DEITIES.map((d) => {
              const meta = DEITIES[d];
              return (
                <Link
                  key={d}
                  href={`/browse/deity/${d}`}
                  className="group flex items-baseline gap-3 bg-canvas px-4 py-4 hover:bg-canvas-raised"
                >
                  <span aria-hidden className="font-hi text-2xl leading-none text-line-strong group-hover:text-saffron">
                    {meta.mark}
                  </span>
                  <span>
                    <span className="block font-display text-base font-semibold group-hover:text-saffron">
                      {meta.en}
                    </span>
                    <span className="font-hi block text-xs text-ink-faint">{meta.hi}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* By form */}
        <section className="border-t border-line-strong py-10 sm:py-14">
          <h2 className="font-display text-2xl font-semibold">By form</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Aarti, bhajan, mantra and stotra are not synonyms — and neither are abhang, pasuram,
            keertana and devaranama. Searching only for the word &ldquo;bhajan&rdquo; misses most of
            the tradition.
          </p>
          <div className="mt-6 rule-strong">
            {Object.entries(CHANT_TYPES).map(([key, t]) => (
              <Link
                key={key}
                href={`/browse/type/${key}`}
                className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line px-2 py-3 hover:bg-canvas-raised sm:px-3"
              >
                <span className="font-display w-40 text-base font-semibold group-hover:text-saffron">
                  {t.en}
                </span>
                <span className="font-hi w-24 text-sm text-ink-faint">{t.hi}</span>
                <span className="flex-1 text-sm text-ink-soft">{t.description}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Readable now */}
        <section className="border-t border-line-strong py-10 sm:py-14">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold">Readable in full here</h2>
            <Link href="/browse" className="text-sm text-saffron hover:underline">Browse all →</Link>
          </div>
          <div className="mt-6 rule-strong">
            {readable.map((entry) => (
              <Link
                key={entry.slug}
                href={`/chant/${entry.slug}`}
                className="group flex items-baseline gap-4 border-b border-line px-2 py-3 hover:bg-canvas-raised sm:px-3"
              >
                <span aria-hidden className="font-hi w-7 text-lg text-line-strong group-hover:text-saffron">
                  {DEITIES[entry.deity[0] ?? "general"].mark}
                </span>
                <span className="font-display text-base font-semibold group-hover:text-saffron">
                  {entry.title.en}
                </span>
                <span className="font-hi hidden text-sm text-ink-faint sm:inline">{entry.title.hi}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Sourcing */}
        <section className="border-t border-line-strong py-10 sm:py-14">
          <h2 className="font-display text-2xl font-semibold">Where the texts come from</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Every entry names the archive that holds it — Gita Press, Sanskrit Documents, the TTD
            projects, IGNCA and the sampradaya's own publisher. Nothing here is seeded from lyrics
            aggregators, where a Mirabai pada picks up a modern singer&apos;s name within two hops.
          </p>
          <ul className="mt-6 grid gap-px bg-line sm:grid-cols-2">
            {SOURCE_LIST.slice(0, 8).map((s) => (
              <li key={s.id} className="bg-canvas px-4 py-4">
                <div className="font-display text-sm font-semibold">{s.org}</div>
                <div className="mt-0.5 text-xs text-ink-faint">{s.name}</div>
                {s.scale ? <div className="mt-1.5 text-xs text-ink-soft">{s.scale}</div> : null}
              </li>
            ))}
          </ul>
          <Link href="/sources" className="mt-5 inline-block text-sm text-saffron hover:underline">
            Read the sourcing policy →
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
