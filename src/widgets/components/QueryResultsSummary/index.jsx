import PropTypes from 'prop-types';

const QueryResultsSummary = ({ currentPage, itemsPerPage, totalItems, totalItemsReturned }) => {
  const start = itemsPerPage * (currentPage - 1) + 1;
  const end = itemsPerPage * (currentPage - 1) + totalItemsReturned;
  return (
    <div className="text-sm text-peoplecert-muted dark:text-gray-300">
      Showing{' '}
      <span className="font-semibold text-peoplecert-navy dark:text-white">
        {start}-{end}
      </span>{' '}
      of{' '}
      <span className="font-semibold text-peoplecert-navy dark:text-white">{totalItems}</span> results
    </div>
  );
};

QueryResultsSummary.propTypes = {
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  totalItemsReturned: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
};

export default QueryResultsSummary;
