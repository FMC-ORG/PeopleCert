import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import NoResultsRecovery from '@/components/NoResultsRecovery/index.jsx';
import ArticleHorizontalItemCard from '@/widgets/components/ArticleHorizontalCard';
import Filter from '@/widgets/components/Filter';
import QueryResultsSummary from '@/widgets/components/QueryResultsSummary';
import ResultsPerPage from '@/widgets/components/ResultsPerPage';
import SearchFacets from '@/widgets/components/SearchFacets';
import SearchPagination from '@/widgets/components/SearchPagination';
import SortOrder from '@/widgets/components/SortOrder';
import Spinner from '@/widgets/components/Spinner';
import { WidgetDataType, useSearchResults, widget } from '@/sdk.js';
import PropTypes from 'prop-types';

export const SearchResultsComponent = ({
  defaultSortType = 'featured_desc',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = 10,
}) => {
  const {
    widgetRef,
    actions: { onItemClick },
    state: { sortType, page, itemsPerPage },
    queryResult: {
      isLoading,
      isFetching,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: articles = [],
      } = {},
    },
  } = useSearchResults({
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: defaultItemsPerPage,
      keyphrase: defaultKeyphrase,
    },
  });
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [facetsOpen, setFacetsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 w-full">
        <Spinner loading />
      </div>
    );
  }

  return (
    <div ref={widgetRef} className="relative">
      {isFetching && (
        <div className="w-full h-full fixed top-0 left-0 bottom-0 right-0 z-30 bg-white/50 dark:bg-peoplecert-navy/50 pointer-events-none">
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center z-40">
            <Spinner loading />
          </div>
        </div>
      )}

      {totalItems > 0 && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Facets column */}
          <aside
            className={`${facetsOpen ? 'block' : 'hidden'} lg:block lg:w-[280px] shrink-0`}
          >
            <div className="pc-card p-5 sticky top-[96px]">
              <Filter />
              <SearchFacets facets={facets} />
            </div>
          </aside>

          {/* Results column */}
          <section className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-peoplecert-border dark:border-peoplecert-navy-300">
              <QueryResultsSummary
                currentPage={page}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                totalItemsReturned={articles.length}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFacetsOpen((v) => !v)}
                  className="pc-btn-secondary lg:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                {sortChoices.length > 0 && <SortOrder options={sortChoices} selected={sortType} />}
              </div>
            </div>

            <div className="w-full">
              {articles.map((a, index) => (
                <ArticleHorizontalItemCard
                  key={a.id}
                  article={a}
                  index={index}
                  onItemClick={onItemClick}
                  displayText={true}
                />
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mt-6 pt-4 border-t border-peoplecert-border dark:border-peoplecert-navy-300">
              <ResultsPerPage defaultItemsPerPage={defaultItemsPerPage} />
              <SearchPagination currentPage={page} totalPages={totalPages} />
            </div>
          </section>
        </div>
      )}

      {totalItems <= 0 && !isFetching && (
        <NoResultsRecovery query={defaultKeyphrase} variant="full" />
      )}
    </div>
  );
};

SearchResultsComponent.propTypes = {
  defaultSortType: PropTypes.string,
  defaultPage: PropTypes.number,
  defaultKeyphrase: PropTypes.string,
  defaultItemsPerPage: PropTypes.number,
};

const SearchResultsWidget = widget(SearchResultsComponent, WidgetDataType.SEARCH_RESULTS, 'content');
export default SearchResultsWidget;
