import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EntryList } from "@/components/EntryRow";
import { createClient } from "@/lib/supabase/server";
import { authEnabled } from "@/lib/supabase/client";
import { entryBySlug } from "@/data/corpus";
import type { CorpusEntry } from "@/data/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "My shelf — Svaram" };

export default async function AccountPage() {
  if (!authEnabled) redirect("/");

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: saved } = await supabase
    .from("svaram_saved")
    .select("chant_slug, created_at")
    .order("created_at", { ascending: false });

  const entries = (saved ?? [])
    .map((row) => entryBySlug(row.chant_slug))
    .filter((e): e is CorpusEntry => Boolean(e));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">My shelf</h1>
        <p className="mt-2 text-sm text-ink-soft">Signed in as {auth.user.email}</p>

        <form action="/auth/signout" method="post" className="mt-4">
          <button className="border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-saffron hover:text-saffron">
            Sign out
          </button>
        </form>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Saved</h2>
          {entries.length ? (
            <div className="mt-4"><EntryList entries={entries} /></div>
          ) : (
            <p className="mt-4 border border-line-strong bg-canvas-raised p-5 text-sm text-ink-soft">
              Nothing saved yet. Open any chant and choose <em>Save to shelf</em> —{" "}
              <Link href="/today" className="text-saffron hover:underline">start with today&apos;s</Link>.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
