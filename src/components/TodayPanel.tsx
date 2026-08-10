import Link from "next/link";
import { CORPUS, readableFirst } from "@/data/corpus";
import { DEITIES, OCCASIONS } from "@/data/taxonomy";
import { getPanchang, getSegment, type CityKey } from "@/lib/panchang";
import type { CorpusEntry, Occasion } from "@/data/types";

/**
 * What today actually asks for.
 *
 * Three layers stack, most specific first: a festival if the tithi carries one,
 * the monthly tithi observance (Ekadashi, Pradosh, Sankashti), and the weekday's
 * deity — so this panel is never empty. Then the hour of the day narrows it
 * further, because the same person wants Suprabhatam at 6 am and the evening
 * aarti at 7 pm.
 */
export function selectForToday(occasions: Occasion[], deities: string[], limit = 8): CorpusEntry[] {
  const byOccasion = CORPUS.filter((e) => e.occasions.some((o) => occasions.includes(o)));
  const byDeity = CORPUS.filter((e) => e.deity.some((d) => deities.includes(d)));

  const seen = new Set<string>();
  const out: CorpusEntry[] = [];
  for (const entry of [...readableFirst(byOccasion), ...readableFirst(byDeity)]) {
    if (seen.has(entry.slug)) continue;
    seen.add(entry.slug);
    out.push(entry);
    if (out.length >= limit) break;
  }
  return out;
}

export function TodayPanel({ city, now = new Date() }: { city: CityKey; now?: Date }) {
  const panchang = getPanchang(now, city);
  const segment = getSegment(now, city);

  const headline = panchang.observances.find((o) => o.kind === "festival")
    ?? panchang.observances.find((o) => o.kind === "tithi")
    ?? panchang.observances[panchang.observances.length - 1];

  const deities = Array.from(new Set(panchang.observances.flatMap((o) => o.deity)));
  const picks = selectForToday([...panchang.occasions, ...segment.occasions], deities, 6);

  return (
    <section className="card border border-line-strong bg-canvas-raised shadow-[0_14px_40px_-30px_rgba(36,28,17,0.6)]">
      {/* Masthead: the panchang read as a dateline, not a widget. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line px-5 py-3 sm:px-7">
        <span className="label">Today · {panchang.cityLabel}</span>
        <span className="text-xs text-ink-soft">{panchang.gregorian}</span>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-4">
        {[
          { k: "Tithi", v: `${panchang.tithi.paksha} ${panchang.tithi.name}`, sub: panchang.tithi.endsAt ? `until ${panchang.tithi.endsAt}` : undefined },
          { k: "Nakshatra", v: panchang.nakshatra.name, sub: panchang.nakshatra.endsAt ? `until ${panchang.nakshatra.endsAt}` : undefined },
          { k: "Masa", v: panchang.masa.en, sub: panchang.masa.hi },
          { k: "Sun", v: `${panchang.sunrise ?? "—"} → ${panchang.sunset ?? "—"}`, sub: panchang.ritu },
        ].map((cell) => (
          <div key={cell.k} className="bg-canvas-raised px-5 py-4 sm:px-7">
            <div className="label">{cell.k}</div>
            <div className="mt-1 font-display text-base leading-tight font-semibold">{cell.v}</div>
            {cell.sub ? <div className="font-hi mt-0.5 text-xs text-ink-faint">{cell.sub}</div> : null}
          </div>
        ))}
      </div>

      {/* The reason someone opens this page. */}
      <div className="border-t border-line px-5 py-6 sm:px-7">
        <h2 className="font-display text-3xl leading-tight font-semibold text-maroon sm:text-4xl">
          {headline?.name}
        </h2>
        <p className="font-hi mt-1 text-lg text-ink-soft">{headline?.hi}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{headline?.note}</p>

        {panchang.observances.length > 1 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {panchang.observances.slice(0, 5).map((o) => (
              <li
                key={o.id}
                className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft"
                title={o.note}
              >
                {o.name}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Hour of the day. */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line bg-canvas-sunk px-5 py-3 sm:px-7">
        <span className="label">Right now</span>
        <span className="font-display text-sm font-semibold">{segment.name}</span>
        <span className="font-hi text-sm text-ink-soft">{segment.hi}</span>
        <span className="text-xs text-ink-faint">{segment.window}</span>
        <span className="w-full text-xs text-ink-soft sm:w-auto sm:border-l sm:border-line sm:pl-3">
          {segment.note}
        </span>
      </div>

      {/* What to open. */}
      <div className="border-t border-line">
        {picks.map((entry) => {
          const deity = DEITIES[entry.deity[0] ?? "general"];
          return (
            <Link
              key={entry.slug}
              href={`/chant/${entry.slug}`}
              className="group flex items-baseline gap-4 border-b border-line px-5 py-3 last:border-b-0 hover:bg-canvas-sunk sm:px-7"
            >
              <span aria-hidden className="font-hi w-6 text-lg text-line-strong group-hover:text-saffron">
                {deity.mark}
              </span>
              <span className="font-display text-base font-semibold group-hover:text-saffron">
                {entry.title.en}
              </span>
              <span className="font-hi text-sm text-ink-faint">{entry.title.hi}</span>
              <span className="ml-auto shrink-0 text-xs text-ink-faint">
                {entry.hasFullText ? "Read" : "Where to find it"}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line px-5 py-3 sm:px-7">
        <Link href="/today" className="text-sm text-saffron hover:underline">
          The full day →
        </Link>
        {panchang.occasions[0] ? (
          <Link
            href={`/browse/occasion/${panchang.occasions[0]}`}
            className="text-sm text-ink-soft hover:text-saffron"
          >
            Everything for {OCCASIONS[panchang.occasions[0]].en}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
