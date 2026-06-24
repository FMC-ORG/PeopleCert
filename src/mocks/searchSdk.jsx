/**
 * Mock Sitecore Search SDK.
 *
 * Exposes the subset of the `@sitecore-search/react` surface that this
 * application uses, but resolves all data from the local CATALOG + QA
 * tables. Re-exported through `src/sdk.js` when VITE_MOCK_SEARCH is
 * set to `true`.
 *
 * Design:
 *  - `widget()` HOC wraps a component in a per-mount React context that
 *    holds the widget state store. `useSearchResults`, `usePreviewSearch`,
 *    `useQuestions` read/write the store.
 *  - `useSearchResultsActions` / `useSearchResultsSelectedFilters` read
 *    the same store so that facets, sort, pagination, and filter-chip
 *    child components stay in sync without any prop drilling.
 *  - Filters passed through `query(q => q.getRequest().setSearchFilter(...))`
 *    are captured into the store as pre-applied filters.
 *  - All calls are synchronous so there is no fake loading spinner.
 */

import React, { createContext, useContext, useMemo, useRef, useState, useSyncExternalStore } from 'react';

// The `@sitecore-search/ui` primitives (AccordionFacets, SortSelect,
// PreviewSearch, etc.) reach back into the real SDK's module-scoped
// WidgetContext for config information (facet types, selected facets,
// sort options). Our mock `widget()` HOC needs to populate that same
// context so the UI primitives keep working.
import { WidgetContext as RealWidgetContext } from '@sitecore-search/react';

import { CATALOG, CATALOG_BY_ID, SORT_CHOICES } from './catalog.js';
import { matchScenario } from './questions.js';

/* ------------------------------------------------------------------ */
/* Filter and WidgetDataType primitives                                */
/* ------------------------------------------------------------------ */

export class FilterEqual {
  constructor(name, value) {
    this.kind = 'equal';
    this.name = name;
    this.value = value;
  }
  match(article) {
    return String(article?.[this.name]) === String(this.value);
  }
}

export const WidgetDataType = {
  SEARCH_RESULTS: 'content',
  PREVIEW_SEARCH: 'preview_search',
  QUESTIONS: 'questions',
};

/* ------------------------------------------------------------------ */
/* Tiny observable store keyed per widget mount                        */
/* ------------------------------------------------------------------ */

const WidgetContext = createContext(null);

function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    getSnapshot: () => state,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    setState: (updater) => {
      const next =
        typeof updater === 'function' ? updater(state) : { ...state, ...updater };
      if (next === state) return;
      state = next;
      listeners.forEach((l) => l());
    },
  };
}

function useStore() {
  const ctx = useContext(WidgetContext);
  const store = ctx?.store;
  const snapshot = useSyncExternalStore(
    store ? store.subscribe : () => () => {},
    store ? store.getSnapshot : () => undefined,
    store ? store.getSnapshot : () => undefined,
  );
  return { store, state: snapshot, rfkId: ctx?.rfkId, dataType: ctx?.dataType };
}

/* ------------------------------------------------------------------ */
/* widget() HOC                                                        */
/* ------------------------------------------------------------------ */

// Minimal config value good enough for @sitecore-search/ui primitives
// that lookup facet types, sort options, or selected facets. We expose
// a reactive `config` and `response` keyed off the store, plus a few
// no-op action dispatchers.
function buildRealContextValue(dataType, store) {
  return {
    config: {
      facets: {},
      defaultFacetType: 'default',
      sort: { choices: SORT_CHOICES },
    },
    response: { data: store?.getSnapshot?.() ?? {} },
    dispatch: () => {},
    actions: {},
    type: dataType,
  };
}

export function widget(Component, dataType, entity) {
  function MockWidgetWrapper(props) {
    const [store] = useState(() =>
      createStore({
        sortType: 'featured_desc',
        page: 1,
        itemsPerPage: 10,
        keyphrase: '',
        selectedFilters: [],
        preAppliedFilters: [],
        preAppliedKeyphrase: undefined,
        suggestionsList: [],
      }),
    );
    const value = useMemo(
      () => ({ store, rfkId: props.rfkId, dataType, entity }),
      [store, props.rfkId],
    );
    const realCtxValue = useMemo(
      () => buildRealContextValue(dataType, store),
      [store],
    );
    return (
      <RealWidgetContext.Provider value={realCtxValue}>
        <WidgetContext.Provider value={value}>
          <Component {...props} />
        </WidgetContext.Provider>
      </RealWidgetContext.Provider>
    );
  }
  MockWidgetWrapper.displayName = `mockWidget(${Component.displayName || Component.name || 'Component'})`;
  return MockWidgetWrapper;
}

/* ------------------------------------------------------------------ */
/* Query execution                                                     */
/* ------------------------------------------------------------------ */

const FACET_DEFS = [
  { name: 'type', label: 'Content type', field: 'type' },
  { name: 'certification', label: 'Certification', field: 'certification' },
  { name: 'language', label: 'Language', field: 'language' },
  { name: 'audience', label: 'Audience', field: 'audience' },
  { name: 'source', label: 'Source', field: 'source_id' },
];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Matches `token` only at the start of a word in `text`. This allows
// genuine partial hits ("renew" -> "renewal process") while rejecting
// noise ("cat" -> "certificate", "photos" -> "photo ID"). Whole-word
// matches score higher than prefix matches.
function wordMatch(text, token) {
  if (!text || !token) return 0;
  const re = new RegExp(`\\b${escapeRegex(token)}(\\w*)`, 'i');
  const m = text.match(re);
  if (!m) return 0;
  return m[1] === '' ? 2 : 1; // 2 = exact word, 1 = prefix of a longer word
}

// Extra stopwords beyond length-2 common words. Keeps polite / filler
// tokens from blocking a query that is otherwise specific.
const EXTRA_STOPWORDS = new Set([
  'please',
  'help',
  'need',
  'want',
  'how',
  'what',
  'when',
  'where',
  'why',
  'which',
  'can',
  'could',
  'would',
  'should',
  'the',
  'and',
  'for',
  'with',
  'from',
  'into',
  'about',
  'this',
  'that',
  'these',
  'those',
  'your',
  'mine',
  'our',
  'their',
]);

function tokenScore(article, tokens) {
  if (tokens.length === 0) return 0.01; // show everything with a tiny base score
  // Tokens shorter than 3 chars are treated as stopwords and ignored.
  const useful = tokens.filter(
    (t) => t && t.length >= 3 && !EXTRA_STOPWORDS.has(t),
  );
  if (useful.length === 0) return 0;
  const title = article.title || '';
  const subtitle = article.subtitle || '';
  const description = article.description || '';
  const tags = article.tags || [];
  const meta = [article.type, article.certification, article.audience]
    .filter(Boolean)
    .join(' ');
  let score = 0;
  let matched = 0;
  for (const t of useful) {
    const tHit = wordMatch(title, t);
    const sHit = wordMatch(subtitle, t);
    const dHit = wordMatch(description, t);
    const tagHit = tags.some((tag) => wordMatch(tag, t) > 0) ? 1 : 0;
    const metaHit = wordMatch(meta, t);
    if (tHit) score += 10 * tHit;
    if (sHit) score += 4 * sHit;
    if (tagHit) score += 6;
    if (dHit) score += 1 * dHit;
    if (metaHit) score += 1 * metaHit;
    if (tHit || sHit || dHit || tagHit || metaHit) matched += 1;
  }
  // AND-style matching: every useful token must find at least one hit.
  // This keeps typo-heavy queries (e.g. "itl renew proces") in the
  // zero-result bucket where the recovery card belongs, instead of
  // limping through on a single partial match.
  if (matched < useful.length) return 0;
  return score;
}

function applyPreAppliedFilters(articles, filters) {
  if (!filters || filters.length === 0) return articles;
  return articles.filter((a) => filters.every((f) => f.match(a)));
}

function applySelectedFacets(articles, selected) {
  if (!selected || selected.length === 0) return articles;
  const byFacet = new Map();
  for (const s of selected) {
    const arr = byFacet.get(s.facetId) || [];
    arr.push(s);
    byFacet.set(s.facetId, arr);
  }
  return articles.filter((a) => {
    for (const [facetId, entries] of byFacet) {
      const def = FACET_DEFS.find((d) => d.name === facetId);
      if (!def) continue;
      const articleValue = String(a[def.field] ?? '');
      if (!entries.some((e) => e.valueLabel === articleValue)) return false;
    }
    return true;
  });
}

function buildFacets(articles) {
  return FACET_DEFS.map((def) => {
    const counts = new Map();
    for (const a of articles) {
      const v = a[def.field];
      if (!v) continue;
      counts.set(v, (counts.get(v) || 0) + 1);
    }
    const value = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([text, count]) => ({ id: text, text, count }));
    return { name: def.name, label: def.label, value };
  }).filter((f) => f.value.length > 0);
}

function sortArticles(articles, sortType, tokens) {
  const copy = [...articles];
  switch (sortType) {
    case 'title_asc':
      return copy.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'title_desc':
      return copy.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    case 'recent_desc':
      return copy.sort((a, b) => (a.id > b.id ? -1 : 1));
    case 'featured_desc':
    default:
      return copy.sort((a, b) => tokenScore(b, tokens) - tokenScore(a, tokens));
  }
}

function runSearch(state) {
  const { keyphrase, preAppliedFilters, preAppliedKeyphrase, selectedFilters, sortType, page, itemsPerPage } = state;
  const effectiveKeyphrase = keyphrase || preAppliedKeyphrase || '';
  // Split on anything that is not a word character so trailing
  // punctuation (e.g. "certificate?") does not leak into the token.
  const tokens = effectiveKeyphrase
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

  let list = applyPreAppliedFilters(CATALOG, preAppliedFilters);

  // Keyphrase filtering: keep anything with non-zero token score unless no tokens.
  if (tokens.length > 0) {
    list = list.filter((a) => tokenScore(a, tokens) > 0);
  }

  // Facet filtering (built from UI)
  list = applySelectedFacets(list, selectedFilters);

  const sorted = sortArticles(list, sortType, tokens);
  const facets = buildFacets(sorted);

  const start = (page - 1) * itemsPerPage;
  const paginated = sorted.slice(start, start + itemsPerPage).map((a, i) => ({
    ...a,
    name: a.title,
    index_name: 'peoplecert-mock',
    score: tokenScore(a, tokens),
    _position: start + i,
  }));

  return {
    isLoading: false,
    isFetching: false,
    data: {
      total_item: sorted.length,
      total_page: Math.max(1, Math.ceil(sorted.length / itemsPerPage)),
      sort: { choices: SORT_CHOICES },
      facet: facets,
      content: paginated,
    },
  };
}

function runPreview(state) {
  const { keyphrase, itemsPerPage, suggestionsList } = state;
  const tokens = (keyphrase || '')
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

  let list = CATALOG;
  if (tokens.length > 0) {
    list = CATALOG.filter((a) => tokenScore(a, tokens) > 0);
  }

  const sorted = sortArticles(list, 'featured_desc', tokens);
  const maxSuggestions = suggestionsList?.[0]?.max ?? 6;

  const suggestionBlocks = {};
  if (suggestionsList && suggestionsList.length > 0) {
    for (const s of suggestionsList) {
      suggestionBlocks[s.suggestion] = sorted.slice(0, s.max ?? maxSuggestions).map((a) => ({
        text: a.title,
        id: a.id,
        count: 1,
      }));
    }
  }

  return {
    isLoading: false,
    isFetching: false,
    data: {
      suggestion: suggestionBlocks,
      content: sorted.slice(0, itemsPerPage || 6).map((a) => ({
        ...a,
        name: a.title,
      })),
    },
  };
}

function runQuestions(state) {
  const scenario = matchScenario(state.keyphrase);
  if (!scenario) {
    // No match and no fallback — let the AI answer widget render the
    // zero-result recovery card.
    return {
      isLoading: false,
      isFetching: false,
      data: {
        answer: { question: undefined, answer: undefined },
        related_questions: [],
        sources: [],
      },
    };
  }
  const sourceArticles = (scenario.sourceIds || [])
    .map((id) => CATALOG_BY_ID[id])
    .filter(Boolean);
  return {
    isLoading: false,
    isFetching: false,
    data: {
      answer: {
        question: scenario.answer.question,
        answer: scenario.answer.answer,
      },
      related_questions: (scenario.related || []).slice(0, state.relatedQuestions ?? 4),
      sources: sourceArticles.map((a) => ({
        id: a.id,
        title: a.title,
        url: a.url,
        source_id: a.source_id,
        type: a.type,
      })),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Filter query capture: mimic the SDK's request builder               */
/* ------------------------------------------------------------------ */

function captureQuery(configQuery) {
  const captured = { filters: [], keyphrase: undefined };
  if (typeof configQuery !== 'function') return captured;
  const request = {
    setSearchFilter(filter) {
      if (filter instanceof FilterEqual) {
        captured.filters.push(filter);
      } else if (filter && typeof filter.match === 'function') {
        captured.filters.push(filter);
      }
      return request;
    },
    setSearchQueryKeyphrase(k) {
      captured.keyphrase = k;
      return request;
    },
  };
  const fakeQuery = { getRequest: () => request };
  try {
    configQuery(fakeQuery);
  } catch {
    /* tolerate unsupported calls */
  }
  return captured;
}

/* ------------------------------------------------------------------ */
/* Public hooks                                                        */
/* ------------------------------------------------------------------ */

export function useSearchResults(config = {}) {
  const { store, state } = useStore();
  const widgetRef = useRef(null);

  // Re-sync when the caller passes a new initial keyphrase / page etc.
  // (e.g. a new query in the URL). The sync is applied synchronously
  // during render the first time a configKey is seen so that the very
  // first paint already reflects the requested filters/keyphrase.
  const configKey = JSON.stringify([
    config?.state?.sortType,
    config?.state?.page,
    config?.state?.itemsPerPage,
    config?.state?.keyphrase,
  ]);
  const lastAppliedKey = useRef(null);
  if (store && lastAppliedKey.current !== configKey) {
    const captured = captureQuery(config.query);
    store.setState((prev) => ({
      ...prev,
      sortType: config?.state?.sortType ?? prev.sortType,
      page: config?.state?.page ?? 1,
      itemsPerPage: config?.state?.itemsPerPage ?? prev.itemsPerPage,
      keyphrase: config?.state?.keyphrase ?? prev.keyphrase,
      preAppliedFilters: captured.filters,
      preAppliedKeyphrase: captured.keyphrase,
      selectedFilters: [],
    }));
    lastAppliedKey.current = configKey;
  }

  const actions = useMemo(
    () => ({
      onItemClick: (_p) => {
        // Surface as a custom event so the EventMonitor can render it.
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('pc:mock-event', { detail: { type: 'item_click', ..._p } }));
        }
      },
      onFacetClick: (f) => {
        if (!store) return;
        store.setState((s) => {
          const isSelected = s.selectedFilters.some(
            (x) => x.facetId === f.facetId && x.valueLabel === f.valueLabel,
          );
          return {
            selectedFilters: isSelected
              ? s.selectedFilters.filter(
                  (x) => !(x.facetId === f.facetId && x.valueLabel === f.valueLabel),
                )
              : [
                  ...s.selectedFilters,
                  {
                    facetId: f.facetId,
                    facetLabel: f.facetLabel,
                    valueLabel: f.valueLabel,
                  },
                ],
            page: 1,
          };
        });
      },
      onSortChange: (sortType) => store?.setState({ sortType, page: 1 }),
      onPageNumberChange: ({ page }) => store?.setState({ page }),
      onResultsPerPageChange: ({ numItems }) =>
        store?.setState({ itemsPerPage: numItems, page: 1 }),
      onRemoveFilter: (f) =>
        store?.setState((s) => ({
          selectedFilters: s.selectedFilters.filter(
            (x) => !(x.facetId === f.facetId && x.valueLabel === f.valueLabel),
          ),
        })),
      onClearFilters: () => store?.setState({ selectedFilters: [] }),
    }),
    [store],
  );

  const queryResult = useMemo(() => {
    if (!state) {
      return { isLoading: true, isFetching: true, data: {} };
    }
    return runSearch(state);
  }, [state]);

  return {
    widgetRef,
    actions,
    state: {
      sortType: state?.sortType ?? 'featured_desc',
      page: state?.page ?? 1,
      itemsPerPage: state?.itemsPerPage ?? 10,
    },
    queryResult,
  };
}

export function usePreviewSearch(config = {}) {
  const { store, state } = useStore();
  const widgetRef = useRef(null);

  const applied = useRef(false);
  if (store && !applied.current) {
    store.setState((prev) => ({
      ...prev,
      suggestionsList: config?.state?.suggestionsList ?? prev.suggestionsList,
      itemsPerPage: config?.state?.itemsPerPage ?? prev.itemsPerPage,
    }));
    applied.current = true;
  }

  const actions = useMemo(
    () => ({
      onItemClick: () => {},
      onKeyphraseChange: ({ keyphrase }) => store?.setState({ keyphrase }),
    }),
    [store],
  );

  const queryResult = useMemo(() => {
    if (!state) return { isLoading: true, isFetching: false, data: {} };
    return runPreview(state);
  }, [state]);

  return { widgetRef, actions, queryResult };
}

export function useQuestions(config = {}) {
  const { store, state } = useStore();

  const cfgKey = JSON.stringify([config?.state?.keyphrase, config?.state?.relatedQuestions]);
  const lastKey = useRef(null);
  if (store && lastKey.current !== cfgKey) {
    store.setState((prev) => ({
      ...prev,
      keyphrase: config?.state?.keyphrase ?? prev.keyphrase,
      relatedQuestions: config?.state?.relatedQuestions ?? 4,
    }));
    lastKey.current = cfgKey;
  }

  const queryResult = useMemo(() => {
    if (!state) return { isLoading: true, isFetching: false, data: {} };
    return runQuestions(state);
  }, [state]);

  return { queryResult };
}

export function useSearchResultsActions() {
  const { store } = useStore();
  return useMemo(
    () => ({
      onFacetClick: (f) => {
        if (!store) return;
        store.setState((s) => {
          const isSelected = s.selectedFilters.some(
            (x) => x.facetId === f.facetId && x.valueLabel === f.valueLabel,
          );
          return {
            selectedFilters: isSelected
              ? s.selectedFilters.filter(
                  (x) => !(x.facetId === f.facetId && x.valueLabel === f.valueLabel),
                )
              : [
                  ...s.selectedFilters,
                  {
                    facetId: f.facetId,
                    facetLabel: f.facetLabel,
                    valueLabel: f.valueLabel,
                  },
                ],
            page: 1,
          };
        });
      },
      onSortChange: (sortType) => store?.setState({ sortType, page: 1 }),
      onPageNumberChange: ({ page }) => store?.setState({ page }),
      onResultsPerPageChange: ({ numItems }) =>
        store?.setState({ itemsPerPage: numItems, page: 1 }),
      onRemoveFilter: (f) =>
        store?.setState((s) => ({
          selectedFilters: s.selectedFilters.filter(
            (x) => !(x.facetId === f.facetId && x.valueLabel === f.valueLabel),
          ),
        })),
      onClearFilters: () => store?.setState({ selectedFilters: [] }),
    }),
    [store],
  );
}

export function useSearchResultsSelectedFilters() {
  const { state } = useStore();
  return state?.selectedFilters || [];
}

/* ------------------------------------------------------------------ */
/* Passthroughs for non-data SDK exports                               */
/* ------------------------------------------------------------------ */

export function WidgetsProvider({ children }) {
  // In mock mode the SDK context is not needed because no API calls
  // are made. Simply render children.
  return <>{children}</>;
}

export function SEOWidget() {
  return null;
}

const pageContext = {
  pageUri: '/',
  language: 'en',
  country: 'US',
  attributes: {},
  setPageUri(uri) {
    this.pageUri = uri;
  },
  setLocaleLanguage(l) {
    this.language = l;
  },
  setLocaleCountry(c) {
    this.country = c;
  },
  setAttribute(key, value) {
    this.attributes[key] = value;
    emitMockEvent({ type: 'page_attribute', key, value });
  },
  setUserContext(ctx) {
    this.attributes = { ...this.attributes, ...ctx };
    emitMockEvent({ type: 'user_context', ctx });
  },
};

function emitMockEvent(detail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('pc:mock-event', { detail }));
}

export const PageController = {
  getContext: () => pageContext,
  getDispatcher: () => ({
    dispatch: (payload) => emitMockEvent({ type: 'dispatcher', ...payload }),
  }),
};

export function trackPageViewEvent(pageType) {
  emitMockEvent({ type: 'page_view', pageType });
}

export function trackEntityPageViewEvent(entity, { items } = {}) {
  emitMockEvent({ type: 'entity_view', entity, items });
}

export const Logger = {
  setLogLevel: () => {},
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

export function usePreviewSearchActions() {
  return {
    onSuggestionClick: (payload) => emitMockEvent({ type: 'suggestion_click', ...payload }),
    onItemClick: (payload) => emitMockEvent({ type: 'item_click', ...payload }),
    onKeyphraseChange: () => {},
  };
}
