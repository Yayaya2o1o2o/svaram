"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authEnabled, createClient } from "@/lib/supabase/client";

/** Saving is the one thing an account buys you. Everything else reads signed out. */
export function SaveButton({ slug }: { slug: string }) {
  const [state, setState] = useState<"loading" | "anon" | "saved" | "unsaved" | "error">("loading");

  useEffect(() => {
    if (!authEnabled) {
      setState("anon");
      return;
    }
    const supabase = createClient();
    let cancelled = false;

    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!auth.user) {
        setState("anon");
        return;
      }
      const { data } = await supabase
        .from("svaram_saved")
        .select("id")
        .eq("chant_slug", slug)
        .maybeSingle();
      if (!cancelled) setState(data ? "saved" : "unsaved");
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state === "loading") {
    return <span className="text-xs text-ink-faint">…</span>;
  }

  if (state === "anon") {
    return (
      <Link href="/login" className="border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-saffron hover:text-saffron">
        Sign in to save
      </Link>
    );
  }

  async function toggle() {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setState("anon");
      return;
    }
    if (state === "saved") {
      const { error } = await supabase.from("svaram_saved").delete().eq("chant_slug", slug).eq("user_id", auth.user.id);
      setState(error ? "error" : "unsaved");
    } else {
      const { error } = await supabase.from("svaram_saved").insert({ chant_slug: slug, user_id: auth.user.id });
      setState(error ? "error" : "saved");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`border px-3 py-1.5 text-xs ${
        state === "saved"
          ? "border-saffron bg-saffron-soft font-semibold text-maroon"
          : "border-line text-ink-soft hover:border-saffron hover:text-saffron"
      }`}
    >
      {state === "saved" ? "On your shelf" : state === "error" ? "Try again" : "Save to shelf"}
    </button>
  );
}
