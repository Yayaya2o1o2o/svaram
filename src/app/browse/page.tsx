import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CORPUS, CORPUS_STATS } from "@/data/corpus";
import { CHANT_TYPES, CORPUS_LANGUAGES, DEITIES, OCCASIONS, TRADITIONS } from "@/data/taxonomy";
import type { ChantType, CorpusLanguage, Deity, Occasion, Tradition } from "@/data/types";

export const metadata = { title: "Browse — Svaram" };

const countBy = <T extends string>(pick: (e: (typeof CORPUS)[number]) => T[]) => {
  const counts = new Map<T, number>();
  for (const entry of CORPUS) for (const key of pick(entry)) counts.set(key, (counts.get(key) ?? 0) + 1);
  return counts;
};

export default function BrowsePage() {
  const byDeity = countBy<Deity>((e) => e.deity);
  const byType = countBy<ChantType>((e) => [e.type]);
  const byOccasion = countBy<Occasion>((e) => e.occasions);
  const byTradition = countBy<Tradition>((e) => e.tradition);
  const byLanguage = countBy<CorpusLanguage>((e) => [e.language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Browse</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
          {CORPUS_STATS.total} compositions, {CORPUS_STATS.withText} of them readable here in full.
          The rest are catalogued with their attribution and a link to the archive that holds the text.
        </p>

        <Group title="Deity" note="The letterform is the first syllable of the name.">
          {[...byDeity.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([key, n]) => (
              <Row key={key} href={`/browse/deity/${key}`} mark={DEITIES[key].mark} label={DEITIES[key].en} hi={DEITIES[key].hi} n={n} sub={DEITIES[key].blurb} />
            ))}
        </Group>

        <Group title="Form" note="Aarti, bhajan, mantra and stotra are different things.">
          {[...byType.entries()].sort((a, b) => b[1] - a[1]).map(([key, n]) => (
            <Row key={key} href={`/browse/type/${key}`} label={CHANT_TYPES[key].en} hi={CHANT_TYPES[key].hi} n={n} sub={CHANT_TYPES[key].description} />
          ))}
        </Group>

        <Group title="Occasion" note="Festivals, monthly tithis and the hours of the day.">
          {[...byOccasion.entries()].sort((a, b) => b[1] - a[1]).map(([key, n]) => (
            <Row key={key} href={`/browse/occasion/${key}`} label={OCCASIONS[key].en} hi={OCCASIONS[key].hi} n={n} />
          ))}
        </Group>

        <Group title="Tradition" note="Which lineage keeps the composition.">
          {[...byTradition.entries()].sort((a, b) => b[1] - a[1]).map(([key, n]) => (
            <Row key={key} label={TRADITIONS[key].en} n={n} sub={TRADITIONS[key].note} />
          ))}
        </Group>

        <Group title="Language" note="Sanskrit is not the whole story.">
          {[...byLanguage.entries()].sort((a, b) => b[1] - a[1]).map(([key, n]) => (
            <Row key={key} label={CORPUS_LANGUAGES[key].en} hi={CORPUS_LANGUAGES[key].native} n={n} />
          ))}
        </Group>
      </main>
      <Footer />
    </div>
  );
}

function Group({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{note}</p>
      <div className="mt-5 rule-strong">{children}</div>
    </section>
  );
}

function Row({ href, mark, label, hi, sub, n }: { href?: string; mark?: string; label: string; hi?: string; sub?: string; n: number }) {
  const inner = (
    <>
      {mark ? <span aria-hidden className="font-hi w-8 text-xl text-line-strong group-hover:text-saffron">{mark}</span> : null}
      <span className="font-display w-44 text-base font-semibold group-hover:text-saffron">{label}</span>
      {hi ? <span className="font-hi w-24 text-sm text-ink-faint">{hi}</span> : null}
      {sub ? <span className="hidden flex-1 text-sm text-ink-soft sm:inline">{sub}</span> : <span className="flex-1" />}
      <span className="ml-auto text-xs text-ink-faint">{n}</span>
    </>
  );
  const cls = "group flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line px-2 py-3 sm:px-3";
  return href ? (
    <Link href={href} className={`${cls} hover:bg-canvas-raised`}>{inner}</Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
