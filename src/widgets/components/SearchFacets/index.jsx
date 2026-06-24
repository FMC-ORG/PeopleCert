import { CheckIcon } from '@radix-ui/react-icons';
import { useSearchResultsActions } from '@/sdk.js';
import {
  AccordionFacets,
  FacetItem,
  RangeFacet,
  SearchResultsAccordionFacets,
  SearchResultsFacetValueRange,
} from '@sitecore-search/ui';
import PropTypes from 'prop-types';

const PriceFacet = ({ min, max }) => {
  return (
    <SearchResultsFacetValueRange
      max={max}
      min={min}
      autoAdjustValues={false}
      className="relative flex items-center select-none touch-none w-full h-5 mb-8"
    >
      <RangeFacet.Track className="relative grow h-[3px] rounded-full bg-peoplecert-border">
        <RangeFacet.Range className="absolute h-full bg-peoplecert-orange rounded-full" />
      </RangeFacet.Track>
      <RangeFacet.Start className="block w-5 h-5 bg-white shadow-sm text-[10px] leading-5 text-center cursor-pointer rounded-full border border-peoplecert-border hover:border-peoplecert-orange focus:shadow-[0_0_0_3px_rgba(227,93,58,0.3)]">
        {(value) => <span className="absolute text-xs left-0 top-[24px] text-peoplecert-muted">${value}</span>}
      </RangeFacet.Start>
      <RangeFacet.End className="block w-5 h-5 bg-white shadow-sm text-[10px] leading-5 text-center cursor-pointer rounded-full border border-peoplecert-border hover:border-peoplecert-orange focus:shadow-[0_0_0_3px_rgba(227,93,58,0.3)]">
        {(value) => <span className="absolute text-xs left-0 top-[24px] text-peoplecert-muted">${value}</span>}
      </RangeFacet.End>
    </SearchResultsFacetValueRange>
  );
};

PriceFacet.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
};

const SearchFacets = ({ facets }) => {
  const { onFacetClick } = useSearchResultsActions();
  return (
    <SearchResultsAccordionFacets
      defaultFacetTypesExpandedList={facets.slice(0, 2).map((f) => f.name)}
      onFacetTypesExpandedListChange={() => {}}
      onFacetValueClick={onFacetClick}
      className="w-full"
    >
      {facets.map((f) => (
        <AccordionFacets.Facet
          facetId={f.name}
          key={f.name}
          className="block border-b last:border-b-0 border-peoplecert-border dark:border-peoplecert-navy-300 py-4 first:pt-0"
        >
          <AccordionFacets.Header className="flex">
            <AccordionFacets.Trigger className="w-full flex items-center justify-between text-left text-sm font-semibold text-peoplecert-navy dark:text-white hover:text-peoplecert-orange focus:outline-none">
              {f.label}
            </AccordionFacets.Trigger>
          </AccordionFacets.Header>
          <AccordionFacets.Content className="mt-3">
            {f.name !== 'price' ? (
              <AccordionFacets.ValueList className="list-none flex flex-col space-y-1.5">
                {f.value.map((v, index) => (
                  <FacetItem
                    {...{
                      index,
                      facetValueId: v.id,
                    }}
                    key={v.id}
                    className="group flex items-center text-sm cursor-pointer py-0.5"
                  >
                    <AccordionFacets.ItemCheckbox className="form-checkbox flex-none w-4 h-4 border border-peoplecert-border dark:border-peoplecert-navy-300 rounded cursor-pointer transition duration-150 hover:border-peoplecert-orange focus:outline-none aria-checked:bg-peoplecert-orange aria-checked:border-peoplecert-orange">
                      <AccordionFacets.ItemCheckboxIndicator className="text-white w-4 h-4 flex items-center justify-center">
                        <CheckIcon />
                      </AccordionFacets.ItemCheckboxIndicator>
                    </AccordionFacets.ItemCheckbox>
                    <AccordionFacets.ItemLabel className="text-sm ms-2.5 text-peoplecert-ink dark:text-gray-200 group-hover:text-peoplecert-orange transition-colors">
                      {v.text}{' '}
                      {v.count && (
                        <span className="text-peoplecert-muted dark:text-gray-400">({v.count})</span>
                      )}
                    </AccordionFacets.ItemLabel>
                  </FacetItem>
                ))}
              </AccordionFacets.ValueList>
            ) : (
              <PriceFacet min={Math.floor(f.value[0].min)} max={Math.floor(f.value[f.value.length - 1].max)} />
            )}
          </AccordionFacets.Content>
        </AccordionFacets.Facet>
      ))}
    </SearchResultsAccordionFacets>
  );
};
SearchFacets.propTypes = {
  facets: PropTypes.array.isRequired,
};
export default SearchFacets;
