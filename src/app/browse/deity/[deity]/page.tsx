import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EntryList } from "@/components/EntryRow";
import { CORPUS, readableFirst } from "@/data/corpus";
import { DEITIES } from "@/data/taxonomy";
import type { Deity } from "@/data/types";

export function generateStaticParams() {
  return Object.keys(DEITIES).map((deity) => ({ deity }));
}

export default async function DeityPage({ params }: { params: Promise<{ deity: string }> }) {
  const { deity } = await params;
  const meta = DEITIES[deity as Deity];
  if (!meta) notFound();
  const entries = readableFirst(CORPUS.filter((e) => e.deity.includes(deity as Deity)));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex items-baseline gap-4 border-b border-line-strong pb-6">
          <span aria-hidden className="font-hi text-5xl leading-none text-saffron">{meta.mark}</span>
          <div>
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">{meta.en}</h1>
            <p className="font-hi mt-1 text-lg text-ink-soft">{meta.hi}</p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-ink-soft">{meta.blurb}</p>
        <p className="label mt-6">{entries.length} entries</p>
        <div className="mt-3"><EntryList entries={entries} /></div>
      </main>
      <Footer />
    </div>
  );
}
