import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EntryList } from "@/components/EntryRow";
import { TodayPanel, selectForToday } from "@/components/TodayPanel";
import { ALL_SEGMENTS, CITIES, DEFAULT_CITY, getPanchang, type CityKey } from "@/lib/panchang";
import { DEITIES } from "@/data/taxonomy";

export const revalidate = 900;

export const metadata = {
  title: "Today — Svaram",
  description:
    "Today's tithi, nakshatra and observance from the Hindu calendar, with the chants each hour of the day calls for.",
};

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const activeCity: CityKey = city && city in CITIES ? (city as CityKey) : DEFAULT_CITY;
  const panchang = getPanchang(new Date(), activeCity);
  const deities = Array.from(new Set(panchang.observances.flatMap((o) => o.deity)));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="font-display text-4xl leading-tight font-semibold sm:text-5xl">Today</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Computed astronomically for {panchang.cityLabel} rather than read off a fixed table, so
          the festivals resolve for any year. A tithi turns at a moment in time — which day that
          lands on depends where you are standing.
        </p>

        <form action="/today" className="mt-4 flex items-center gap-2 text-xs text-ink-faint">
          <label htmlFor="city">Location</label>
          <select id="city" name="city" defaultValue={activeCity} className="border border-line bg-canvas-raised px-2 py-1 text-xs">
            {Object.entries(CITIES).map(([key, c]) => (
              <option key={key} value={key}>{c.label}</option>
            ))}
          </select>
          <button type="submit" className="border border-line-strong px-2 py-1 hover:border-saffron hover:text-saffron">Set</button>
        </form>

        <div className="mt-8">
          <TodayPanel city={activeCity} />
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Hour by hour</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            The same person wants Suprabhatam at six in the morning and the evening aarti at seven.
            Each window below opens what belongs to it.
          </p>
          <div className="mt-6 rule-strong">
            {ALL_SEGMENTS.map((segment) => {
              const picks = selectForToday([...segment.occasions, ...panchang.occasions], deities, 3);
              return (
                <div key={segment.id} className="grid gap-3 border-b border-line py-5 sm:grid-cols-[14rem_1fr]">
                  <div>
                    <div className="font-display text-lg font-semibold">{segment.name}</div>
                    <div className="font-hi text-sm text-ink-soft">{segment.hi}</div>
                    <div className="label mt-1">{segment.window}</div>
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed text-ink-soft">{segment.note}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {picks.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/chant/${p.slug}`}
                            className="flex items-baseline gap-2 border border-line px-2.5 py-1.5 text-xs hover:border-saffron hover:text-saffron"
                          >
                            <span aria-hidden className="font-hi text-sm text-line-strong">
                              {DEITIES[p.deity[0] ?? "general"].mark}
                            </span>
                            {p.title.en}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Everything for today</h2>
          <div className="mt-5">
            <EntryList entries={selectForToday(panchang.occasions, deities, 40)} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
