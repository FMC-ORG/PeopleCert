import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { useSearchResultsActions } from '@/sdk.js';
import { Pagination } from '@sitecore-search/ui';
import PropTypes from 'prop-types';

const pageClass =
  'cursor-pointer inline-flex items-center justify-center min-w-[36px] h-9 px-2 mx-0.5 rounded-md text-sm font-medium text-peoplecert-navy dark:text-gray-200 hover:bg-peoplecert-surface dark:hover:bg-peoplecert-navy-400 data-[current=true]:bg-peoplecert-orange data-[current=true]:text-white data-[current=true]:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-peoplecert-orange-200';

const SearchPagination = ({ currentPage, totalPages }) => {
  const { onPageNumberChange } = useSearchResultsActions();
  if (totalPages <= 1) return null;
  return (
    <Pagination.Root
      currentPage={currentPage}
      defaultCurrentPage={1}
      totalPages={totalPages}
      onPageChange={(v) =>
        onPageNumberChange({
          page: v,
        })
      }
      className="mt-6 flex items-center justify-center"
    >
      <Pagination.PrevPage
        onClick={(e) => e.preventDefault()}
        className={`${pageClass} data-[current=true]:hidden`}
      >
        <ArrowLeftIcon />
      </Pagination.PrevPage>
      <Pagination.Pages>
        {(pagination) =>
          Pagination.paginationLayout(pagination, {
            boundaryCount: 1,
            siblingCount: 1,
          }).map(({ page, type }) =>
            type === 'page' ? (
              <Pagination.Page
                key={page}
                aria-label={`Page ${page}`}
                page={page}
                onClick={(e) => e.preventDefault()}
                className={pageClass}
              >
                {page}
              </Pagination.Page>
            ) : (
              <span key={type} className="px-2 text-peoplecert-muted">
                ...
              </span>
            ),
          )
        }
      </Pagination.Pages>
      <Pagination.NextPage
        onClick={(e) => e.preventDefault()}
        className={`${pageClass} data-[current=true]:hidden`}
      >
        <ArrowRightIcon />
      </Pagination.NextPage>
    </Pagination.Root>
  );
};

SearchPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default SearchPagination;
