import Link from "next/link";
import { CHANT_TYPES, CORPUS_LANGUAGES, DEITIES } from "@/data/taxonomy";
import { FETCHED_TEXTS } from "@/data/texts";
import type { CorpusEntry } from "@/data/types";

/**
 * The index row. Deliberately not a card: the corpus reads as a table of
 * contents — hairline rules, a Devanagari letterform for the deity, and the
 * metadata that lets you judge an entry before opening it.
 */
export function EntryRow({ entry }: { entry: CorpusEntry }) {
  const deity = DEITIES[entry.deity[0] ?? "general"];
  const type = CHANT_TYPES[entry.type];
  const language = CORPUS_LANGUAGES[entry.language];
  const readable = entry.hasFullText || Boolean(FETCHED_TEXTS[entry.slug]);

  return (
    <Link
      href={`/chant/${entry.slug}`}
      className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1 rounded-xl border-b border-line px-2 py-4 hover:bg-canvas-raised sm:grid-cols-[3.25rem_1fr_auto] sm:px-3"
    >
      <span
        aria-hidden
        className="font-hi text-2xl leading-none text-line-strong group-hover:text-saffron"
      >
        {deity.mark}
      </span>

      <span className="min-w-0">
        <span className="block font-display text-lg leading-snug font-semibold group-hover:text-saffron">
          {entry.title.en}
        </span>
        <span className="font-hi mt-0.5 block text-sm text-ink-soft">{entry.title.hi}</span>
        <span className="mt-1.5 block text-xs text-ink-faint">
          {type.en} · {language.en}
          {entry.composer ? <> · {entry.composer}</> : null}
        </span>
      </span>

      <span className="col-start-2 flex items-center gap-2 sm:col-start-3 sm:justify-end">
        {readable ? (
          <span className="rounded-full border border-saffron/40 bg-saffron-soft px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-maroon uppercase">
            Full text
          </span>
        ) : (
          <span className="rounded-full border border-line-strong px-2.5 py-0.5 text-[0.65rem] tracking-wide text-ink-faint uppercase">
            Corpus entry
          </span>
        )}
        {entry.hasFullText ? (
          <span className="text-xs text-ink-faint">{entry.durationMin} min</span>
        ) : entry.extent ? (
          <span className="hidden text-xs text-ink-faint sm:inline">{entry.extent}</span>
        ) : null}
      </span>
    </Link>
  );
}

export function EntryList({ entries }: { entries: CorpusEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="border-t border-line py-10 text-center text-sm text-ink-soft">
        Nothing here yet.
      </p>
    );
  }
  return (
    <div className="rule-strong">
      {entries.map((e) => (
        <EntryRow key={e.slug} entry={e} />
      ))}
    </div>
  );
}
