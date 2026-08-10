import { createBrowserClient } from "@supabase/ssr";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Accounts are optional in Svaram — everything reads fine signed out. */
export const authEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
