/**
 * Sitecore Search SDK facade.
 *
 * This module re-exports the subset of `@sitecore-search/react` that the
 * application uses. When `VITE_MOCK_SEARCH=true`, the exports are swapped
 * out for a local, in-memory implementation (src/mocks/searchSdk.jsx).
 * This lets the demo run with zero network calls against a deterministic
 * PeopleCert knowledge base without touching any widget code.
 *
 * Every widget and hook in this codebase imports from `@/sdk` rather than
 * directly from `@sitecore-search/react` so that the toggle is truly
 * global.
 */

import * as real from '@sitecore-search/react';
import * as mock from '@/mocks/searchSdk.jsx';

export const IS_MOCK_SEARCH = import.meta.env.VITE_MOCK_SEARCH === 'true';

const source = IS_MOCK_SEARCH ? { ...real, ...mock } : real;

export const WidgetsProvider = source.WidgetsProvider;
export const SEOWidget = source.SEOWidget;
export const PageController = source.PageController;
export const trackPageViewEvent = source.trackPageViewEvent;
export const trackEntityPageViewEvent = source.trackEntityPageViewEvent;

export const WidgetDataType = source.WidgetDataType;
export const widget = source.widget;
export const FilterEqual = source.FilterEqual;

export const useSearchResults = source.useSearchResults;
export const usePreviewSearch = source.usePreviewSearch;
export const useQuestions = source.useQuestions;
export const useSearchResultsActions = source.useSearchResultsActions;
export const useSearchResultsSelectedFilters = source.useSearchResultsSelectedFilters;
export const usePreviewSearchActions = source.usePreviewSearchActions;

export const Logger = source.Logger;
