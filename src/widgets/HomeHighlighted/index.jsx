import { ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_IMAGE } from '@/data/constants';
import { FilterEqual, WidgetDataType, useSearchResults, widget } from '@/sdk.js';

export const HomeHighlightedComponent = () => {
  const navigate = useNavigate();
  const {
    widgetRef,
    actions: { onItemClick },
    queryResult: { data: { content: articles = [] } = {} },
  } = useSearchResults({
    query: (query) => {
      query.getRequest().setSearchFilter(new FilterEqual('type', 'Article'));
    },
    state: { itemsPerPage: 6 },
  });
  const articlesToShow = articles.slice(0, 6);

  if (articlesToShow.length === 0) return null;

  const handleClick = (article, index) => {
    onItemClick({ id: article.id, index, sourceId: article.source_id });
    navigate(`/detail/${article.id}`);
  };

  return (
    <section className="pc-container py-10 md:py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="pc-section-title">Popular solutions</h2>
          <p className="pc-section-sub mt-1">Trending articles, hand-picked from your content index.</p>
        </div>
        <TrendingUp className="w-6 h-6 text-peoplecert-orange hidden sm:block" />
      </div>

      <div ref={widgetRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articlesToShow.map((article, index) => (
          <button
            key={article.id}
            onClick={() => handleClick(article, index)}
            className="pc-card p-0 text-left flex flex-col overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-peoplecert-orange"
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-peoplecert-surface dark:bg-peoplecert-navy-500 flex items-center justify-center">
              <img
                src={article.image_url || DEFAULT_IMAGE}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMAGE;
                }}
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              {article.type && <span className="pc-chip self-start mb-2">{article.type}</span>}
              <h3 className="font-semibold text-peoplecert-navy dark:text-white group-hover:text-peoplecert-orange transition-colors line-clamp-2">
                {article.name || article.title}
              </h3>
              {article.description && (
                <p className="mt-2 text-sm text-peoplecert-muted dark:text-gray-300 line-clamp-2">
                  {article.description}
                </p>
              )}
              <div className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-peoplecert-orange">
                Read article <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default widget(HomeHighlightedComponent, WidgetDataType.SEARCH_RESULTS, 'content');
