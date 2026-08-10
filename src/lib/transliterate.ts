import Sanscript from "@indic-transliteration/sanscript";
import type { LanguageCode } from "@/data/taxonomy";

const SCRIPT_BY_LANGUAGE: Partial<Record<LanguageCode, string>> = {
  ta: "tamil",
  te: "telugu",
  kn: "kannada",
};

/**
 * Roman for texts that arrived as Devanagari only (the fetched half of the
 * corpus). IAST is deterministic from Devanagari, so this is a rendering of the
 * same text rather than a second-hand romanization.
 */
export function toRoman(devanagari: string): string {
  return Sanscript.t(devanagari, "devanagari", "iast");
}

/**
 * Renders Devanagari source text in another Indic script.
 * Tamil/Telugu/Kannada are derived deterministically from the Devanagari
 * original so every script stays phonetically faithful without needing a
 * hand-typed (and hand-proofread) copy in each script.
 */
export function renderInScript(devanagari: string, language: LanguageCode): string {
  const scheme = SCRIPT_BY_LANGUAGE[language];
  if (!scheme) return devanagari;
  return Sanscript.t(devanagari, "devanagari", scheme);
}
