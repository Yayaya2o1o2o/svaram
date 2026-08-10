import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EntryList } from "@/components/EntryRow";
import { CORPUS, readableFirst } from "@/data/corpus";
import { CHANT_TYPES } from "@/data/taxonomy";
import type { ChantType } from "@/data/types";

export function generateStaticParams() {
  return Object.keys(CHANT_TYPES).map((type) => ({ type }));
}

export default async function TypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const meta = CHANT_TYPES[type as ChantType];
  if (!meta) notFound();
  const entries = readableFirst(CORPUS.filter((e) => e.type === (type as ChantType)));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{meta.en}</h1>
        <p className="font-hi mt-1 text-lg text-ink-soft">{meta.hi}</p>
        <p className="mt-4 max-w-2xl text-sm text-ink-soft">{meta.description}</p>
        <p className="label mt-6">{entries.length} entries</p>
        <div className="mt-3"><EntryList entries={entries} /></div>
      </main>
      <Footer />
    </div>
  );
}
