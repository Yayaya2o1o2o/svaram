import fetched from "./fetched.json";

/**
 * Devanagari text pulled from the archives by scripts/fetch-texts.mjs.
 *
 * Not typed from memory and not paraphrased — each record keeps the source URL
 * it came from, so what renders on the page is what the archive publishes.
 */
export interface FetchedText {
  url: string;
  verses: string[];
}

export const FETCHED_TEXTS = fetched as Record<string, FetchedText>;

export function fetchedTextFor(slug: string): FetchedText | undefined {
  return FETCHED_TEXTS[slug];
}
