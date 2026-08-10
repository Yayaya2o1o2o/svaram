import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SOURCE_LIST } from "@/data/sources";
import { CORPUS, CORPUS_STATS } from "@/data/corpus";

export const metadata = {
  title: "Sources — Svaram",
  description: "The archives Svaram's corpus is built on, and the sourcing policy behind it.",
};

export default function SourcesPage() {
  const counts = new Map<string, number>();
  for (const e of CORPUS) for (const s of e.sources) counts.set(s.sourceId, (counts.get(s.sourceId) ?? 0) + 1);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Sources</h1>

        <div className="mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-ink-soft">
          <p>
            There is no official list of all Hindu bhajans, and there never was one. The repertoire
            is genuinely vast, and the same song travels under different names — kirtan, sankirtana,
            pada, abhang, pasuram, prabhatiya, bhakti geeti. Searching only for the word
            &ldquo;bhajan&rdquo; misses tens of thousands of compositions.
          </p>
          <p>
            So Svaram does not claim completeness. It claims provenance. Every one of the{" "}
            {CORPUS_STATS.total} entries names the archive that holds it, and the corpus is seeded
            from institutional publishers, temple projects and government cultural archives — not
            from lyrics aggregators, video titles or streaming metadata, where a centuries-old
            Mirabai pada acquires a modern singer&apos;s name within two hops and never recovers.
          </p>
          <p>
            Where a text is long or liturgically exact — a Sahasranama, the Rudram, a saint&apos;s
            padavali — the entry is catalogued rather than reproduced, and sends you to the archive.
            A drifted Rudram is worse than no Rudram.
          </p>
        </div>

        <div className="mt-10 rule-strong">
          {SOURCE_LIST.map((source) => (
            <article key={source.id} className="border-b border-line py-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-display text-xl font-semibold">{source.org}</h2>
                <span className="border border-line px-1.5 py-0.5 text-[0.65rem] tracking-wide text-ink-faint uppercase">
                  {source.quality}
                </span>
                <span className="ml-auto text-xs text-ink-faint">
                  {counts.get(source.id) ?? 0} entries cite this
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-faint">{source.name}</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{source.covers}</p>
              {source.scale ? (
                <p className="mt-2 border-l-2 border-line-strong pl-3 text-xs text-ink-soft">{source.scale}</p>
              ) : null}
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-block text-sm text-saffron hover:underline"
              >
                {new URL(source.url).hostname.replace("www.", "")} →
              </a>
            </article>
          ))}
        </div>

        <section className="mt-10 border border-line-strong bg-canvas-raised p-5">
          <h2 className="font-display text-lg font-semibold">What is deliberately not used</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Lyrics farms, blog aggregations, video and playlist metadata, and AI-generated song
            lists. They are useful for discovering spelling variants and nothing else — attribution
            on those surfaces is unreliable in a way that compounds silently.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
