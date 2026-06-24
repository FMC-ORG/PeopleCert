import { Home } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import { PAGE_EVENTS_SEARCH } from '@/data/constants';
import withPageTracking from '@/hocs/withPageTracking';
import QuestionsAnswers from '@/widgets/QuestionsAnswers/index.jsx';
import SearchResults from '@/widgets/SearchResults/index.jsx';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="pc-container py-8 md:py-10 animate-fade-in">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <ol className="flex items-center gap-1.5 text-peoplecert-muted dark:text-gray-400">
          <li>
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-peoplecert-orange"
            >
              <Home className="w-3.5 h-3.5" /> Help Center
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-peoplecert-navy dark:text-gray-100 font-medium truncate max-w-[60vw]">
            Search
          </li>
        </ol>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-peoplecert-navy dark:text-white">
          {query ? (
            <>
              Results for{' '}
              <span className="text-peoplecert-orange">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            'Browse the Help Center'
          )}
        </h1>
      </header>

      {query && (
        <div className="mb-8">
          <QuestionsAnswers
            key={`${query}-questions`}
            rfkId="rfkid_qa"
            defaultKeyphrase={query}
            defaultRelatedQuestions={4}
            variant="answer"
          />
        </div>
      )}

      <SearchResults key={`${query}-search`} rfkId="rfkid_7" defaultKeyphrase={query} />
    </div>
  );
};

export default withPageTracking(Search, PAGE_EVENTS_SEARCH);
