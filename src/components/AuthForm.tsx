"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authEnabled, createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!authEnabled) {
    return (
      <p className="border border-line-strong bg-canvas-raised p-4 text-sm text-ink-soft">
        Accounts are not configured on this deployment yet.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    const supabase = createClient();

    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setBusy(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    if (mode === "up") {
      setStatus("Check your email to confirm, then sign in.");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  const field = "w-full border border-line bg-canvas-raised px-3 py-2.5 text-sm outline-none focus:border-saffron";

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="flex border border-line">
        {(["in", "up"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setStatus(null); }}
            className={`flex-1 px-3 py-2 text-xs ${mode === m ? "bg-saffron-soft font-semibold text-maroon" : "text-ink-soft hover:text-saffron"}`}
          >
            {m === "in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <label className="grid gap-1">
        <span className="label">Email</span>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
      </label>

      <label className="grid gap-1">
        <span className="label">Password</span>
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={field} autoComplete={mode === "in" ? "current-password" : "new-password"} />
      </label>

      <button
        type="submit"
        disabled={busy}
        className="border border-saffron bg-saffron px-4 py-2.5 text-sm font-semibold text-canvas-raised hover:border-maroon hover:bg-maroon disabled:opacity-60"
      >
        {busy ? "…" : mode === "in" ? "Sign in" : "Create account"}
      </button>

      {status ? <p className="text-xs text-maroon">{status}</p> : null}
    </form>
  );
}
