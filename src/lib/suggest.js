/**
 * Pure, dependency-free helpers for the zero-result recovery flow.
 *
 * Exposes three primitives used by `NoResultsRecovery`:
 *   - `didYouMean(query, phrases, opts)` - returns top candidate phrases
 *     using a blend of token overlap and Levenshtein distance.
 *   - `detectCertification(query)` - maps free text to one of our five
 *     certification buckets (or null).
 *   - `disambiguationChips(query, detected)` - builds certification
 *     disambiguation chips when the query has no cert token.
 *
 * These are intentionally tiny and deterministic so they can be swapped
 * out later for a real Sitecore Search "spell" or "similar_keyphrases"
 * call without touching the calling component.
 */

// --- Tokenization ---------------------------------------------------------

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'to', 'for',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'it', 'its',
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'they', 'their',
  'do', 'does', 'did', 'how', 'what', 'when', 'where', 'why', 'which',
  'can', 'could', 'would', 'should', 'shall', 'may', 'might', 'will',
]);

const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (s) =>
  normalize(s)
    .split(' ')
    .filter((t) => t && t.length > 1 && !STOPWORDS.has(t));

// --- Levenshtein ---------------------------------------------------------

/**
 * Classic Levenshtein distance. Small strings only - we cap at 32 chars
 * to keep this O(n*m) bounded for the demo.
 */
const levenshtein = (a, b) => {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;
  const la = Math.min(a.length, 32);
  const lb = Math.min(b.length, 32);
  const aa = a.slice(0, la);
  const bb = b.slice(0, lb);
  const prev = new Array(lb + 1);
  const curr = new Array(lb + 1);
  for (let j = 0; j <= lb; j += 1) prev[j] = j;
  for (let i = 1; i <= la; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= lb; j += 1) {
      const cost = aa[i - 1] === bb[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= lb; j += 1) prev[j] = curr[j];
  }
  return prev[lb];
};

// True when `a` is a plausible typo of `b` (edit distance tolerant on length).
const isTypoOf = (a, b) => {
  if (!a || !b) return false;
  if (a === b) return true;
  const dist = levenshtein(a, b);
  if (a.length <= 4 || b.length <= 4) return dist <= 1;
  if (a.length <= 7 || b.length <= 7) return dist <= 2;
  return dist <= 3;
};

// --- Scoring -------------------------------------------------------------

/**
 * Score a candidate phrase against a query. Range 0..1.
 *
 * Combines:
 *  - token overlap (Jaccard-like)
 *  - typo-tolerant token matches (covers "itl" ~ "itil")
 *  - a bonus when the first token matches
 */
const scorePhrase = (queryTokens, candidateTokens) => {
  if (!queryTokens.length || !candidateTokens.length) return 0;
  const candSet = new Set(candidateTokens);
  let exact = 0;
  let fuzzy = 0;
  for (const qt of queryTokens) {
    if (candSet.has(qt)) {
      exact += 1;
      continue;
    }
    if (candidateTokens.some((ct) => isTypoOf(qt, ct))) {
      fuzzy += 1;
    }
  }
  const overlap = exact + fuzzy * 0.7;
  const union = new Set([...queryTokens, ...candidateTokens]).size || 1;
  const jaccardish = overlap / union;
  const firstMatchBonus =
    queryTokens[0] &&
    candidateTokens[0] &&
    (queryTokens[0] === candidateTokens[0] || isTypoOf(queryTokens[0], candidateTokens[0]))
      ? 0.1
      : 0;
  return Math.min(1, jaccardish + firstMatchBonus);
};

/**
 * Find the best alternative phrases for a query that returned nothing.
 *
 * @param {string} query       - the user's failing query
 * @param {string[]} phrases   - the curated known-good phrase pool
 * @param {{ max?: number, minScore?: number }} [opts]
 * @returns {{ phrase: string, score: number }[]}
 */
export function didYouMean(query, phrases, opts = {}) {
  const { max = 3, minScore = 0.3 } = opts;
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];
  const seen = new Set();
  const scored = [];
  for (const phrase of phrases || []) {
    const key = normalize(phrase);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const candidateTokens = tokenize(phrase);
    if (!candidateTokens.length) continue;
    const score = scorePhrase(queryTokens, candidateTokens);
    if (score >= minScore) scored.push({ phrase, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, max);
}

// --- Certification detection --------------------------------------------

/**
 * Maps free-text tokens to our five certification buckets. Returns the
 * canonical label (so it can feed straight into Sitecore Search facets)
 * or null when the query mentions no certification.
 */
const CERT_PATTERNS = [
  { label: 'ITIL', re: /\bitil\b/i },
  { label: 'PRINCE2', re: /\bprince ?2?\b/i },
  { label: 'DevOps', re: /\bdev ?ops\b|\bdofd\b|\bdol\b|\bsre\b|\bdevsecops\b/i },
  { label: 'LanguageCert', re: /\blanguage ?cert\b|\besol\b|\blcb\b|\bcefr\b/i },
  { label: 'LeanSixSigma', re: /\b(lean|six ?sigma|lss)\b/i },
];

export function detectCertification(query) {
  const q = String(query || '');
  for (const { label, re } of CERT_PATTERNS) {
    if (re.test(q)) return label;
  }
  return null;
}

/**
 * Build certification disambiguation chips for a query that has no cert
 * token. When the query is blank we still offer the five top-level chips
 * so the user has somewhere to land.
 *
 * Each chip returns a navigable query string of form `{label} {query}`
 * that can be dropped straight into `/search?q=...`.
 */
export function disambiguationChips(query, detected) {
  if (detected) return [];
  const labels = ['ITIL', 'PRINCE2', 'DevOps', 'LanguageCert', 'Lean Six Sigma'];
  const trimmed = String(query || '').trim();
  return labels.map((label) => ({
    label,
    query: trimmed ? `${label} ${trimmed}` : label,
  }));
}

// Re-exported for tests / future reuse.
export const __internals = { normalize, tokenize, levenshtein, scorePhrase, isTypoOf };
