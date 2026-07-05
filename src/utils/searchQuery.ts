const PHRASE_RE = /["“]([^"”]+)["”]|['‘]([^'’]+)['’]/g;

// Splits a search query into terms: quoted segments become exact-phrase
// terms, everything else is split on whitespace into individual word terms.
export function parseSearchTerms(raw: string): string[] {
  const terms: string[] = [];

  for (const match of raw.matchAll(PHRASE_RE)) {
    const phrase = (match[1] ?? match[2]).trim().toLowerCase();
    if (phrase) terms.push(phrase);
  }

  const rest = raw.replace(PHRASE_RE, ' ');
  for (const word of rest.split(/\s+/)) {
    const trimmed = word.trim().toLowerCase();
    if (trimmed) terms.push(trimmed);
  }

  return terms;
}

// True if `text` contains every term (case-insensitive substring match, AND across terms).
export function matchesAllTerms(text: string, terms: string[]): boolean {
  if (terms.length === 0) return true;
  const lower = text.toLowerCase();
  return terms.every((term) => lower.includes(term));
}
