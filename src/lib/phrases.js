/**
 * Curated "known-good" phrase pool for the Did-you-mean suggester.
 *
 * Aggregates three sources that already exist in the demo:
 *   - Every question from the Q&A scenarios (KNOWN_QA_PHRASES).
 *   - The hero's popular-query pills (POPULAR_QUERIES).
 *   - Article titles from the mock catalog (short, human-readable).
 *
 * The list is deduped case-insensitively so the suggester does not
 * show two variants of the same phrase.
 */

import { CATALOG } from '@/mocks/catalog.js';
import { KNOWN_QA_PHRASES } from '@/mocks/questions.js';
import { POPULAR_QUERIES } from '@/widgets/SupportHero/index.jsx';

const dedupe = (arr) => {
  const seen = new Set();
  const out = [];
  for (const p of arr) {
    const key = String(p || '').trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
};

export const KNOWN_PHRASES = dedupe([
  ...KNOWN_QA_PHRASES,
  ...POPULAR_QUERIES,
  ...CATALOG.map((a) => a.title).filter(Boolean),
]);
