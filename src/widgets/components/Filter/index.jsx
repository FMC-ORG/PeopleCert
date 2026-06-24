import { X } from 'lucide-react';

import { useSearchResultsActions, useSearchResultsSelectedFilters } from '@/sdk.js';

const buildRangeLabel = (min, max) => {
  return typeof min === 'undefined' ? `< $${max}` : typeof max === 'undefined' ? ` > $${min}` : `$${min} - $${max}`;
};
const buildFacetLabel = (selectedFacet) => {
  if ('min' in selectedFacet || 'max' in selectedFacet) {
    return `${buildRangeLabel(selectedFacet.min, selectedFacet.max)}`;
  }
  return `${selectedFacet.valueLabel}`;
};

const Filter = () => {
  const selectedFacetsFromApi = useSearchResultsSelectedFilters();
  const { onRemoveFilter, onClearFilters } = useSearchResultsActions();
  if (selectedFacetsFromApi.length === 0) return null;
  return (
    <div className="mb-4 p-3 bg-peoplecert-orange-50 dark:bg-peoplecert-navy-500 rounded-lg border border-peoplecert-orange-100 dark:border-peoplecert-navy-300">
      <div className="flex flex-row justify-between items-center mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-peoplecert-orange-700 dark:text-peoplecert-orange">
          Active filters
        </h3>
        <button
          onClick={onClearFilters}
          className="text-xs font-semibold text-peoplecert-navy dark:text-gray-200 hover:text-peoplecert-orange transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {selectedFacetsFromApi.map((selectedFacet) => (
          <button
            key={`${selectedFacet.facetId}${selectedFacet.facetLabel}${selectedFacet.valueLabel}`}
            onClick={() => onRemoveFilter(selectedFacet)}
            className="inline-flex items-center gap-1 text-xs font-medium text-white bg-peoplecert-orange hover:bg-peoplecert-orange-600 rounded-full pl-2.5 pr-1.5 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-peoplecert-orange-200"
          >
            <span className="truncate max-w-[20ch]">{buildFacetLabel(selectedFacet)}</span>
            <X className="w-3 h-3" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;
