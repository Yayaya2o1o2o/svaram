import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { authEnabled } from "@/lib/supabase/client";

export async function Header() {
  let email: string | null = null;

  if (authEnabled) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      email = data.user?.email ?? null;
    } catch {
      email = null;
    }
  }

  return (
    <header className="rule-strong border-t-0 border-b border-line bg-canvas-raised">
      <div className="mx-auto flex max-w-6xl items-baseline gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-hi text-xl leading-none text-saffron">ॐ</span>
          <span className="font-display text-lg font-semibold tracking-tight">Svaram</span>
        </Link>

        <nav className="ml-auto flex items-center gap-5 text-sm">
          <Link href="/today" className="hover:text-saffron">Today</Link>
          <Link href="/browse" className="hover:text-saffron">Browse</Link>
          <Link href="/sources" className="hidden hover:text-saffron sm:inline">Sources</Link>
          <Link href="/search" className="hover:text-saffron">Search</Link>
          {authEnabled ? (
            <Link
              href="/account"
              className="border border-line-strong px-3 py-1.5 text-xs hover:border-saffron hover:text-saffron"
            >
              {email ? "My shelf" : "Sign in"}
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
