import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchView } from "@/components/SearchView";

export const metadata = { title: "Search — Svaram" };

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Search</h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-soft">
          Titles in Devanagari or Roman, deities, saint-poets, occasions, traditions, languages and
          the archives themselves are all searchable.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-ink-faint">Loading…</p>}>
            <SearchView />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
