import { SOURCES } from "@/data/sources";
import type { CorpusEntry } from "@/data/types";

/** Provenance, printed rather than hidden behind a tooltip. */
export function SourceBlock({ entry }: { entry: CorpusEntry }) {
  return (
    <section className="card border border-line-strong bg-canvas-raised">
      <h2 className="label border-b border-line px-4 py-2">Provenance</h2>
      <dl className="grid gap-px bg-line sm:grid-cols-2">
        {entry.composer ? (
          <Field k="Attributed to" v={entry.composer} sub={entry.era} />
        ) : null}
        {entry.textSource ? <Field k="Text sits inside" v={entry.textSource} /> : null}
        {!entry.hasFullText && entry.extent ? <Field k="Extent" v={entry.extent} /> : null}
        {"source" in entry && entry.source ? <Field k="Note" v={entry.source} /> : null}
      </dl>

      <ul className="border-t border-line">
        {entry.sources.map((ref) => {
          const source = SOURCES[ref.sourceId];
          if (!source) return null;
          return (
            <li key={`${ref.sourceId}-${ref.ref ?? ""}`} className="border-b border-line px-4 py-3 last:border-b-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-sm font-semibold">{source.org}</span>
                <span className="text-xs text-ink-faint">{source.name}</span>
                <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-[0.65rem] tracking-wide text-ink-faint uppercase">
                  {source.quality}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{source.covers}</p>
              <a
                href={ref.url ?? source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1.5 inline-block text-xs text-saffron hover:underline"
              >
                Open at {new URL(ref.url ?? source.url).hostname.replace("www.", "")} →
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Field({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="bg-canvas-raised px-4 py-3">
      <dt className="label">{k}</dt>
      <dd className="mt-0.5 text-sm text-ink">
        {v}
        {sub ? <span className="text-ink-faint"> · {sub}</span> : null}
      </dd>
    </div>
  );
}
