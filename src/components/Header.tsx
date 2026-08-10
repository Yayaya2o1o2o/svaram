import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-canvas-raised">
      <div className="mx-auto flex max-w-6xl items-baseline gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-hi text-xl leading-none text-saffron">ॐ</span>
          <span className="font-display text-lg font-semibold tracking-tight">Svaram</span>
        </Link>

        <nav className="ml-auto flex items-center gap-6 text-sm">
          <Link href="/today" className="hover:text-saffron">Today</Link>
          <Link href="/browse" className="hover:text-saffron">Browse</Link>
          <Link href="/sources" className="hidden hover:text-saffron sm:inline">Sources</Link>
          <Link href="/search" className="hover:text-saffron">Search</Link>
        </nav>
      </div>
    </header>
  );
}
