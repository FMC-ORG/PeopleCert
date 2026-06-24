import { ArrowLeft, Calendar, Home as HomeIcon, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

import WasThisHelpful from '@/components/WasThisHelpful/index.jsx';
import { DEFAULT_IMAGE } from '@/data/constants';
import RelatedArticles from '@/widgets/RelatedArticles/index.jsx';
import { FilterEqual, WidgetDataType, useSearchResults, widget } from '@/sdk.js';
import PropTypes from 'prop-types';

export const ArticleDetailComponent = ({ id }) => {
  const {
    widgetRef,
    queryResult: { data: { content: articles = [] } = {}, isLoading },
  } = useSearchResults({
    query: (query) => {
      const equalFilter = new FilterEqual('id', id);
      query.getRequest().setSearchFilter(equalFilter);
    },
    state: {
      itemsPerPage: 1,
    },
  });
  const mainArticle = articles.length > 0 ? articles[0] : { id: '', title: '' };

  return (
    <article ref={widgetRef} className="pc-container py-8 md:py-10 animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-peoplecert-muted dark:text-gray-400">
          <li>
            <Link to="/" className="inline-flex items-center gap-1 hover:text-peoplecert-orange">
              <HomeIcon className="w-3.5 h-3.5" /> Help Center
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/search" className="hover:text-peoplecert-orange">
              Articles
            </Link>
          </li>
          {mainArticle.type && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  to={`/search?q=${encodeURIComponent(mainArticle.type)}`}
                  className="hover:text-peoplecert-orange"
                >
                  {mainArticle.type}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li className="text-peoplecert-navy dark:text-gray-100 font-medium truncate max-w-[60vw]">
            {mainArticle.title || '...'}
          </li>
        </ol>
      </nav>

      <Link
        to="/search"
        className="inline-flex items-center gap-1 text-sm font-medium text-peoplecert-orange hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to results
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
        <div className="pc-card p-6 md:p-10">
          {/* Header */}
          <header className="mb-6 pb-6 border-b border-peoplecert-border dark:border-peoplecert-navy-300">
            {mainArticle.type && (
              <div className="mb-3">
                <span className="pc-chip">
                  <Tag className="w-3 h-3" /> {mainArticle.type}
                </span>
              </div>
            )}
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-peoplecert-navy dark:text-white">
              {mainArticle.title || (isLoading ? 'Loading...' : 'Article not found')}
            </h1>
            {mainArticle.subtitle && (
              <p className="mt-3 text-lg text-peoplecert-muted dark:text-gray-300">{mainArticle.subtitle}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-peoplecert-muted dark:text-gray-400">
              {mainArticle.source_id && (
                <span className="inline-flex items-center gap-1">
                  Source: <span className="font-semibold">{mainArticle.source_id}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Updated recently
              </span>
            </div>
          </header>

          {/* Image */}
          {mainArticle.image_url && (
            <figure className="mb-6 -mx-2 md:-mx-4 rounded-lg overflow-hidden bg-peoplecert-surface dark:bg-peoplecert-navy-500">
              <img
                src={mainArticle.image_url || DEFAULT_IMAGE}
                alt={mainArticle.title || ''}
                className="w-full h-auto max-h-[420px] object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </figure>
          )}

          {/* Body */}
          <div className="prose max-w-none text-peoplecert-ink dark:text-gray-100 leading-relaxed text-[15px] md:text-base">
            {mainArticle.description ? (
              <p>{mainArticle.description}</p>
            ) : (
              !isLoading && (
                <p className="text-peoplecert-muted dark:text-gray-400 italic">
                  This article has no additional body text in the current index.
                </p>
              )
            )}
          </div>

          <WasThisHelpful articleId={mainArticle.id} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="pc-card p-5 lg:sticky lg:top-[96px]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-peoplecert-orange mb-3">
              In this article
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a href="#top" className="text-peoplecert-navy dark:text-gray-100 hover:text-peoplecert-orange">
                  Overview
                </a>
              </li>
              {mainArticle.subtitle && (
                <li>
                  <a
                    href="#details"
                    className="text-peoplecert-navy dark:text-gray-100 hover:text-peoplecert-orange"
                  >
                    Details
                  </a>
                </li>
              )}
              <li>
                <a
                  href="#feedback"
                  className="text-peoplecert-navy dark:text-gray-100 hover:text-peoplecert-orange"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          <div className="pc-card p-5 bg-gradient-to-br from-peoplecert-orange-50 to-white dark:from-peoplecert-navy-400 dark:to-peoplecert-navy-500">
            <h3 className="text-sm font-bold text-peoplecert-navy dark:text-white mb-2">
              Still need help?
            </h3>
            <p className="text-sm text-peoplecert-muted dark:text-gray-300 mb-3">
              Our support team is ready to assist.
            </p>
            <a href="#contact" className="pc-btn-primary w-full">
              Contact support
            </a>
          </div>
        </aside>
      </div>

      {mainArticle.id && (
        <RelatedArticles
          rfkId="rfkid_7"
          type={mainArticle.type}
          excludeId={mainArticle.id}
        />
      )}
    </article>
  );
};

ArticleDetailComponent.propTypes = {
  id: PropTypes.string,
};

const ArticleDetailWidget = widget(ArticleDetailComponent, WidgetDataType.SEARCH_RESULTS, 'content');

export default ArticleDetailWidget;
