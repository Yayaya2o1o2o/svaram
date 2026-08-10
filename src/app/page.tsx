import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { CORPUS_STATS, readableFirst, CORPUS } from "@/data/corpus";
import { CHANT_TYPES, DEITIES } from "@/data/taxonomy";
import { SOURCE_LIST } from "@/data/sources";
import type { Deity } from "@/data/types";

export const revalidate = 900;

const PRIMARY_DEITIES: Deity[] = [
  "ganesha", "shiva", "vishnu", "rama", "krishna", "hanuman",
  "durga", "lakshmi", "saraswati", "devi", "surya", "venkateshwara",
];

export default function Home() {
  const readable = readableFirst(CORPUS).slice(0, 8);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Landing: the search is the whole proposition, the painting carries the rest. */}
        <section className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <Hero />

          <div className="rise rise-2 order-first lg:order-none">
            <div className="card overflow-hidden border-2 border-indigo shadow-[0_18px_50px_-24px_rgba(36,28,17,0.5)]">
              <Image
                src="/krishna-pichwai.jpg"
                alt="Pichwai painting of Krishna with cows beside the Yamuna at sunset"
                width={1200}
                height={1800}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-line py-8">
          <dl className="flex flex-wrap gap-x-12 gap-y-4">
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
            <div className="ml-auto self-end">
              <Link
                href="/today"
                className="inline-block rounded-full border border-line-strong px-4 py-2 text-sm hover:-translate-y-0.5 hover:border-saffron hover:text-saffron"
              >
                What today calls for →
              </Link>
            </div>
          </dl>
        </section>

        {/* Deity index — letterforms, not icons */}
        <section className="border-t border-line-strong py-10 sm:py-14">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold">By deity</h2>
            <Link href="/browse" className="text-sm text-saffron hover:underline">All categories →</Link>
          </div>
          <div className="card mt-6 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
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
            keertana and devaranama.
          </p>
          <div className="mt-6 rule-strong">
            {Object.entries(CHANT_TYPES).map(([key, t]) => (
              <Link
                key={key}
                href={`/browse/type/${key}`}
                className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-lg border-b border-line px-2 py-3 hover:bg-canvas-raised sm:px-3"
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
                className="group flex items-baseline gap-4 rounded-lg border-b border-line px-2 py-3 hover:bg-canvas-raised sm:px-3"
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
            projects, IGNCA and the sampradaya&apos;s own publisher.
          </p>
          <ul className="card mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
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
