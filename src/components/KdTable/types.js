import PropTypes from 'prop-types';

export const stdColumnType = {
  field: PropTypes.string,
  filter: PropTypes.string,
  width: PropTypes.number,
};

export const columnType = {
  caption: PropTypes.oneOfType([PropTypes.string]),
  sort: PropTypes.bool,
  columnType: PropTypes.string,
  headerStyle: PropTypes.object,
  headerField: PropTypes.string,
  headerType: PropTypes.string,
  headerAction: PropTypes.func,
};
