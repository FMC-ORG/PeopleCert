import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_IMAGE } from '@/data/constants';
import { FilterEqual, WidgetDataType, useSearchResults, widget } from '@/sdk.js';
import PropTypes from 'prop-types';

export const RelatedArticlesComponent = ({ type, excludeId }) => {
  const navigate = useNavigate();
  const {
    widgetRef,
    actions: { onItemClick },
    queryResult: { data: { content: articles = [] } = {} },
  } = useSearchResults({
    query: (query) => {
      if (type) {
        query.getRequest().setSearchFilter(new FilterEqual('type', type));
      }
    },
    state: {
      itemsPerPage: 4,
    },
  });

  const filtered = articles.filter((a) => a.id !== excludeId).slice(0, 3);
  if (filtered.length === 0) return null;

  return (
    <section ref={widgetRef} className="mt-12">
      <h2 className="pc-section-title mb-1">Related articles</h2>
      <p className="pc-section-sub mb-5">More from your knowledge base on this topic.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((article, index) => (
          <button
            key={article.id}
            onClick={() => {
              onItemClick({ id: article.id, index, sourceId: article.source_id });
              navigate(`/detail/${article.id}`);
            }}
            className="pc-card p-0 text-left overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-peoplecert-orange"
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-peoplecert-surface dark:bg-peoplecert-navy-500">
              <img
                src={article.image_url || DEFAULT_IMAGE}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMAGE;
                }}
              />
            </div>
            <div className="p-4">
              {article.type && <span className="pc-chip mb-2">{article.type}</span>}
              <h3 className="font-semibold text-peoplecert-navy dark:text-white group-hover:text-peoplecert-orange transition-colors line-clamp-2">
                {article.name || article.title}
              </h3>
              <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-peoplecert-orange">
                Read <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

RelatedArticlesComponent.propTypes = {
  type: PropTypes.string,
  excludeId: PropTypes.string,
};

const RelatedArticlesWidget = widget(RelatedArticlesComponent, WidgetDataType.SEARCH_RESULTS, 'content');
export default RelatedArticlesWidget;
