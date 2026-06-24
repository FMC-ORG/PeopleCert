import { useSearchResultsActions } from '@/sdk.js';
import { Select, SortSelect } from '@sitecore-search/ui';
import PropTypes from 'prop-types';

const itemClass =
  'flex rounded-md items-center leading-none cursor-pointer select-none h-7 px-2 mx-0.5 text-sm text-peoplecert-navy dark:text-gray-100 hover:bg-peoplecert-surface dark:hover:bg-peoplecert-navy-500 data-[state=checked]:bg-peoplecert-orange-50 dark:data-[state=checked]:bg-peoplecert-navy-300 data-[state=checked]:text-peoplecert-orange focus:outline-none';

const ResultsPerPage = ({ defaultItemsPerPage }) => {
  const { onResultsPerPageChange } = useSearchResultsActions();
  return (
    <div className="flex items-center gap-2 text-sm">
      <label className="text-peoplecert-muted dark:text-gray-400">Results per page</label>
      <Select.Root
        defaultValue={String(defaultItemsPerPage)}
        onValueChange={(v) =>
          onResultsPerPageChange({
            numItems: Number(v),
          })
        }
      >
        <Select.Trigger className="cursor-pointer inline-flex items-center gap-1 h-9 py-1 px-3 text-sm font-medium text-peoplecert-navy dark:text-gray-100 bg-white dark:bg-peoplecert-navy-400 border border-peoplecert-border dark:border-peoplecert-navy-300 rounded-md hover:border-peoplecert-orange transition-colors focus:outline-none">
          <Select.SelectValue />
          <Select.Icon />
        </Select.Trigger>
        <Select.SelectContent className="bg-white dark:bg-peoplecert-navy-400 shadow-card-lg border border-peoplecert-border dark:border-peoplecert-navy-300 z-[100] min-w-[100px] rounded-lg overflow-hidden">
          <Select.Viewport className="p-1">
            {['10', '25', '50'].map((v) => (
              <Select.SelectItem key={v} value={v} className={itemClass}>
                <SortSelect.OptionText>{v}</SortSelect.OptionText>
              </Select.SelectItem>
            ))}
          </Select.Viewport>
        </Select.SelectContent>
      </Select.Root>
    </div>
  );
};

ResultsPerPage.propTypes = {
  defaultItemsPerPage: PropTypes.number.isRequired,
};

export default ResultsPerPage;
