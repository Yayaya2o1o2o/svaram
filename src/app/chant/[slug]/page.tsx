import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChantReader } from "@/components/ChantReader";
import { ArchiveReader } from "@/components/ArchiveReader";
import { fetchedTextFor } from "@/data/texts";
import { SourceBlock } from "@/components/SourceBlock";
import { EntryList } from "@/components/EntryRow";
import { CORPUS, entryBySlug, readableFirst } from "@/data/corpus";
import { CHANT_TYPES, CORPUS_LANGUAGES, DEITIES, OCCASIONS, TRADITIONS } from "@/data/taxonomy";
import { SOURCES } from "@/data/sources";

export function generateStaticParams() {
  return CORPUS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = entryBySlug(slug);
  if (!entry) return { title: "Not found — Svaram" };
  return {
    title: `${entry.title.en} (${entry.title.hi}) — Svaram`,
    description: entry.hasFullText ? entry.meaningEn : entry.note,
  };
}

export default async function ChantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = entryBySlug(slug);
  if (!entry) notFound();

  const archiveText = entry.hasFullText ? undefined : fetchedTextFor(entry.slug);

  const related = readableFirst(
    CORPUS.filter(
      (e) => e.slug !== entry.slug && e.deity.some((d) => entry.deity.includes(d)),
    ),
  ).slice(0, 6);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <nav className="label">
          <Link href="/browse" className="hover:text-saffron">Browse</Link>
          {" / "}
          <Link href={`/browse/deity/${entry.deity[0]}`} className="hover:text-saffron">
            {DEITIES[entry.deity[0] ?? "general"].en}
          </Link>
        </nav>

        <header className="mt-4 border-b border-line-strong pb-6">
          <h1 className="font-display text-4xl leading-tight font-semibold sm:text-5xl">
            {entry.title.en}
          </h1>
          <p className="font-hi mt-2 text-xl text-ink-soft">{entry.title.hi}</p>
          {entry.altTitles?.length ? (
            <p className="mt-1 text-xs text-ink-faint">Also known as {entry.altTitles.join(", ")}</p>
          ) : null}

          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            <Meta k="Form" v={CHANT_TYPES[entry.type].en} />
            <Meta k="Language" v={CORPUS_LANGUAGES[entry.language].en} />
            <Meta k="Tradition" v={entry.tradition.map((t) => TRADITIONS[t].en).join(", ")} />
            {entry.composer ? <Meta k="Composer" v={entry.composer} /> : null}
            {entry.hasFullText ? <Meta k="Length" v={`${entry.durationMin} min`} /> : null}
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {entry.occasions.slice(0, 4).map((o) => (
              <Link
                key={o}
                href={`/browse/occasion/${o}`}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-saffron hover:text-saffron"
              >
                {OCCASIONS[o].en}
              </Link>
            ))}
          </div>
        </header>

        {entry.hasFullText ? (
          <>
            <p className="mt-6 text-sm leading-relaxed text-ink-soft">{entry.meaningEn}</p>
            <ChantReader chant={entry} />
          </>
        ) : archiveText ? (
          <>
            <p className="mt-6 text-sm leading-relaxed text-ink-soft">{entry.note}</p>
            <p className="mt-3 text-xs text-ink-faint">
              Text as published by {SOURCES[entry.sources[0]?.sourceId ?? ""]?.org ?? "the archive"},
              rendered here in five scripts from the one Devanagari original.
            </p>
            <ArchiveReader text={archiveText} />
          </>
        ) : (
          <section className="card mt-6 border border-line-strong bg-canvas-raised p-5">
            <p className="text-sm leading-relaxed text-ink">{entry.note}</p>
            <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">
              This entry is a whole corpus rather than a single composition
              {entry.extent ? ` (${entry.extent})` : ""} — there is no one text to print. Its
              provenance is below.
            </p>
          </section>
        )}

        <div className="mt-10">
          <SourceBlock entry={entry} />
        </div>

        {related.length ? (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">
              Also for {DEITIES[entry.deity[0] ?? "general"].en}
            </h2>
            <div className="mt-4">
              <EntryList entries={related} />
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="label">{k}</dt>
      <dd className="mt-0.5 text-sm">{v}</dd>
    </div>
  );
}
