import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EntryList } from "@/components/EntryRow";
import { CORPUS, readableFirst } from "@/data/corpus";
import { OCCASIONS } from "@/data/taxonomy";
import type { Occasion } from "@/data/types";

export function generateStaticParams() {
  return Object.keys(OCCASIONS).map((occasion) => ({ occasion }));
}

export default async function OccasionPage({ params }: { params: Promise<{ occasion: string }> }) {
  const { occasion } = await params;
  const meta = OCCASIONS[occasion as Occasion];
  if (!meta) notFound();
  const entries = readableFirst(CORPUS.filter((e) => e.occasions.includes(occasion as Occasion)));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{meta.en}</h1>
        <p className="font-hi mt-1 text-lg text-ink-soft">{meta.hi}</p>
        <p className="label mt-6">{entries.length} entries</p>
        <div className="mt-3"><EntryList entries={entries} /></div>
      </main>
      <Footer />
    </div>
  );
}
