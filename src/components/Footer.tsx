import Link from "next/link";
import { CORPUS_STATS } from "@/data/corpus";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line-strong bg-canvas-raised">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6 px-5 py-8 sm:px-8">
        <div className="max-w-md">
          <div className="flex items-baseline gap-2">
            <span className="font-hi text-lg text-saffron">ॐ</span>
            <span className="font-display text-base font-semibold">Svaram</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-soft">
            {CORPUS_STATS.total} compositions across {CORPUS_STATS.traditions} traditions and{" "}
            {CORPUS_STATS.languages} languages, each attributed to a published archive. There is no
            complete list of Hindu devotional song — this is a sourced reference, not a claim to one.
          </p>
        </div>
        <nav className="flex gap-8 text-xs">
          <span className="grid gap-2">
            <Link href="/today" className="hover:text-saffron">Today</Link>
            <Link href="/browse" className="hover:text-saffron">Browse</Link>
            <Link href="/search" className="hover:text-saffron">Search</Link>
          </span>
          <span className="grid gap-2">
            <Link href="/sources" className="hover:text-saffron">Sources</Link>
          </span>
        </nav>
      </div>
    </footer>
  );
}
