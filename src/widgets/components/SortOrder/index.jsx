import { useSearchResultsActions } from '@/sdk.js';
import { SortSelect } from '@sitecore-search/ui';
import PropTypes from 'prop-types';

const SortOrder = ({ options, selected }) => {
  const selectedSortIndex = options.findIndex((s) => s.name === selected);
  const { onSortChange } = useSearchResultsActions();
  return (
    <SortSelect.Root defaultValue={options[selectedSortIndex]?.name} onValueChange={onSortChange}>
      <SortSelect.Trigger className="cursor-pointer inline-flex items-center gap-1.5 h-9 py-1 px-3 text-sm font-medium text-peoplecert-navy dark:text-gray-100 bg-white dark:bg-peoplecert-navy-400 border border-peoplecert-border dark:border-peoplecert-navy-300 rounded-md hover:border-peoplecert-orange transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-peoplecert-orange-200">
        <span className="text-peoplecert-muted dark:text-gray-400 text-xs">Sort:</span>
        <SortSelect.SelectValue>
          {selectedSortIndex > -1 ? options[selectedSortIndex].label : ''}
        </SortSelect.SelectValue>
        <SortSelect.Icon />
      </SortSelect.Trigger>
      <SortSelect.Content className="bg-white dark:bg-peoplecert-navy-400 shadow-card-lg border border-peoplecert-border dark:border-peoplecert-navy-300 z-[100] min-w-[180px] rounded-lg overflow-hidden">
        <SortSelect.Viewport className="p-1 z-[50000]">
          {options.map((option) => (
            <SortSelect.Option
              value={option}
              key={option.name}
              className="flex rounded-md items-center px-2 py-1.5 m-0.5 text-sm leading-none cursor-pointer select-none hover:bg-peoplecert-surface dark:hover:bg-peoplecert-navy-500 text-peoplecert-navy dark:text-gray-100 data-[state=checked]:bg-peoplecert-orange-50 dark:data-[state=checked]:bg-peoplecert-navy-300 data-[state=checked]:text-peoplecert-orange focus:outline-none"
            >
              <SortSelect.OptionText>{option.label}</SortSelect.OptionText>
            </SortSelect.Option>
          ))}
        </SortSelect.Viewport>
      </SortSelect.Content>
    </SortSelect.Root>
  );
};

SortOrder.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
};

export default SortOrder;
