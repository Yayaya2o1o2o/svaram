import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Sign in — Svaram" };

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-md px-5 py-14 sm:px-8">
        <h1 className="font-display text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          An account is optional. Everything on Svaram reads without one — an account only keeps a
          shelf of the chants you return to, and remembers the city your panchang is computed for.
        </p>
        <div className="mt-8">
          <Suspense fallback={null}>
            <AuthForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
