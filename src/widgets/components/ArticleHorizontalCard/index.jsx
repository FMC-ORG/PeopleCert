import { ArrowRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ArticleCard } from '@sitecore-search/ui';
import PropTypes from 'prop-types';

const DEFAULT_IMG_URL = 'https://placehold.co/500x300?text=No%20Image';

const ArticleHorizontalItemCard = ({ className = '', article, onItemClick, index }) => {
  const navigate = useNavigate();
  return (
    <ArticleCard.Root
      key={article.id}
      className={`group flex flex-row items-stretch gap-4 p-4 my-3 w-full relative pc-card hover:border-peoplecert-orange cursor-pointer focus-within:ring-2 focus-within:ring-peoplecert-orange ${className}`}
    >
      <div className="w-[140px] shrink-0 hidden sm:flex items-center justify-center overflow-hidden bg-peoplecert-surface dark:bg-peoplecert-navy-500 rounded-lg">
        {article?.image_url ? (
          <ArticleCard.Image
            src={article.image_url || DEFAULT_IMG_URL}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <FileText className="w-10 h-10 text-peoplecert-muted" />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <a
          className="focus:outline-none"
          href={article.url}
          onClick={(event) => {
            event.preventDefault();
            onItemClick({
              id: article.id,
              index,
              sourceId: article.source_id,
            });
            navigate(`/detail/${article.id}`);
          }}
        >
          <span aria-hidden="true" className="absolute inset-0"></span>
          <div className="flex items-center gap-2 mb-1.5">
            {article.type && <span className="pc-chip">{article.type}</span>}
            {article.source_id && (
              <span className="text-[11px] text-peoplecert-muted dark:text-gray-400">
                {article.source_id}
              </span>
            )}
          </div>
          <ArticleCard.Title className="text-base md:text-lg font-semibold text-peoplecert-navy dark:text-white group-hover:text-peoplecert-orange transition-colors line-clamp-2">
            {article.name || article.title}
          </ArticleCard.Title>
        </a>
        <ArticleCard.Subtitle className="mt-2 text-sm text-peoplecert-muted dark:text-gray-300 line-clamp-2">
          {article.subtitle || article.description}
        </ArticleCard.Subtitle>
        <div className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-peoplecert-orange">
          Open article <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </ArticleCard.Root>
  );
};

ArticleHorizontalItemCard.propTypes = {
  className: PropTypes.string,
  article: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    source_id: PropTypes.string,
    image_url: PropTypes.string,
    url: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
  }),
  onItemClick: PropTypes.func,
  index: PropTypes.number,
};

export default ArticleHorizontalItemCard;
