import { Search } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Spinner from '@/widgets/components/Spinner';
import SuggestionBlock from '@/widgets/components/SuggestionBlock';
import { WidgetDataType, usePreviewSearch, widget } from '@/sdk.js';
import { ArticleCard, Presence, PreviewSearch } from '@sitecore-search/ui';
import PropTypes from 'prop-types';

export const PreviewSearchComponent = ({ defaultItemsPerPage = 6, variant = 'compact' }) => {
  const navigate = useNavigate();
  const {
    widgetRef,
    actions: { onItemClick, onKeyphraseChange },
    queryResult,
    queryResult: {
      isFetching,
      isLoading,
      data: { suggestion: { title_context_aware: articleSuggestions = [] } = {} } = {},
    },
  } = usePreviewSearch({
    state: {
      suggestionsList: [{ suggestion: 'title_context_aware', max: 6 }],
      itemsPerPage: defaultItemsPerPage,
    },
  });

  const loading = isLoading || isFetching;
  const keyphraseHandler = useCallback(
    (event) => {
      const target = event.target;
      onKeyphraseChange({ keyphrase: target.value });
    },
    [onKeyphraseChange],
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    const target = e.target.query;
    if (!target.value?.trim()) return;
    navigate(`/search?q=${encodeURIComponent(target.value)}`);
    target.value = '';
  };

  const isHero = variant === 'hero';

  return (
    <PreviewSearch.Root>
      <form onSubmit={handleSubmit} className="relative w-full">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-peoplecert-muted ${
            isHero ? 'w-6 h-6' : 'w-4 h-4'
          }`}
        />
        <PreviewSearch.Input
          name="query"
          className={`w-full rounded-full box-border bg-white dark:bg-peoplecert-navy-400 text-peoplecert-navy dark:text-gray-100 border border-peoplecert-border dark:border-peoplecert-navy-300 focus:outline-none focus:ring-2 focus:ring-peoplecert-orange/40 focus:border-peoplecert-orange placeholder:text-peoplecert-muted ${
            isHero
              ? 'text-base md:text-lg py-4 md:py-5 pl-12 pr-28 shadow-card-lg'
              : 'text-sm py-2 pl-9 pr-3'
          }`}
          onChange={keyphraseHandler}
          autoComplete="off"
          placeholder={
            isHero
              ? 'Ask a question, e.g. “How do I reschedule my ITIL exam?”'
              : 'Search help articles...'
          }
        />
        {isHero && (
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 pc-btn-primary text-sm md:text-base"
          >
            Search
          </button>
        )}
      </form>
      <PreviewSearch.Content
        ref={widgetRef}
        className={`flex justify-center pt-0 shadow-card-lg transition-opacity bg-white dark:bg-peoplecert-navy-400 border border-peoplecert-border dark:border-peoplecert-navy-300 rounded-xl overflow-hidden z-[600] ${
          isHero
            ? 'w-[min(900px,calc(100vw-3rem))] h-[440px] mt-3'
            : 'w-[min(720px,calc(100vw-3rem))] h-[400px] mt-2'
        }`}
      >
        <Spinner loading={loading} />

        <Presence present={!loading}>
          <div className="flex flex-row w-full">
            {articleSuggestions.length > 0 && (
              <PreviewSearch.Suggestions className="block box-border list-none w-[14rem] p-3 text-sm bg-peoplecert-surface dark:bg-peoplecert-navy-500 border-r border-peoplecert-border dark:border-peoplecert-navy-300">
                <SuggestionBlock blockId={'title_context_aware'} items={articleSuggestions} title={'Top suggestions'} />
              </PreviewSearch.Suggestions>
            )}
            <PreviewSearch.Results defaultQueryResult={queryResult}>
              {({ isFetching: loading, data: { content: articles = [] } = {} }) => (
                <PreviewSearch.Items
                  data-loading={loading}
                  className="flex flex-[3] bg-white dark:bg-peoplecert-navy-400 overflow-y-auto data-[loading=false]:grid data-[loading=false]:list-none data-[loading=false]:m-0 data-[loading=false]:p-3 data-[loading=false]:gap-3 data-[loading=false]:grid-cols-3"
                >
                  <Spinner loading={loading} />
                  {!loading &&
                    articles.map((article, index) => (
                      <PreviewSearch.Item key={article.id} asChild>
                        <PreviewSearch.ItemLink
                          href={article.url}
                          onClick={() => {
                            onItemClick({ id: article.id, index, sourceId: article.source_id });
                            navigate('/detail/' + article.id);
                          }}
                          className="flex box-border no-underline w-full text-peoplecert-navy dark:text-gray-100 focus:shadow-md"
                        >
                          <ArticleCard.Root className="w-full rounded-lg p-2 cursor-pointer block border border-peoplecert-border dark:border-peoplecert-navy-300 hover:border-peoplecert-orange transition-colors text-left">
                            <div className="m-auto mb-2 relative h-[5em] flex justify-center items-center overflow-hidden bg-peoplecert-surface dark:bg-peoplecert-navy-500 rounded">
                              <ArticleCard.Image
                                src={article.image_url}
                                className="block w-auto max-w-full h-auto max-h-full"
                              />
                            </div>
                            <ArticleCard.Title className="max-h-[2.4rem] overflow-hidden m-0 text-[11px] font-semibold leading-snug">
                              {article.title}
                            </ArticleCard.Title>
                          </ArticleCard.Root>
                        </PreviewSearch.ItemLink>
                      </PreviewSearch.Item>
                    ))}
                </PreviewSearch.Items>
              )}
            </PreviewSearch.Results>
          </div>
        </Presence>
      </PreviewSearch.Content>
    </PreviewSearch.Root>
  );
};

PreviewSearchComponent.propTypes = {
  defaultItemsPerPage: PropTypes.number.isRequired,
  variant: PropTypes.oneOf(['compact', 'hero']),
};

const PreviewSearchWidget = widget(PreviewSearchComponent, WidgetDataType.PREVIEW_SEARCH, 'content');
export default PreviewSearchWidget;
