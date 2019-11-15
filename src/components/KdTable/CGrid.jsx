// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from 'react';
import { cheetahGrid } from './utils';
import styles from './KdTable.less';

export function setGridHeader(elements) {
  return React.Children.map(elements, item => {
    // console.log(item);

    const { field, children, ...others } = item.props;
    const { createColumn, getPropsObjectInternal } = item.type;

    const headerProps = {
      field,
      caption: typeof children === 'string' ? children : '',
      width: 'auto',
      ...others,
    };
    const nestOptions = getPropsObjectInternal ? getPropsObjectInternal(children) : {};
    const options = createColumn ? createColumn(headerProps) : headerProps;
    return { ...options, ...nestOptions };
  });
}

export function setGridData(grid, data, filter) {
  let dataSource;
  if (Array.isArray(data)) {
    if (filter) {
      dataSource = cheetahGrid.data.CachedDataSource.ofArray(data);
    } else {
      grid.records = data;
      return;
    }
  } else if (data instanceof cheetahGrid.data.DataSource) {
    dataSource = data;
  } else {
    dataSource = new cheetahGrid.data.CachedDataSource(data);
  }
  if (filter) {
    if (dataSource instanceof cheetahGrid.data.FilterDataSource) {
      dataSource.filter = filter;
    } else {
      dataSource = new cheetahGrid.data.FilterDataSource(dataSource, filter);
    }
  }
  grid.dataSource = dataSource;
}

// function bindEvent(grid) {
//   const { EVENT_TYPE } = cheetahGrid.ListGrid;
// }
const CGrid = props => {
  const {
    children,
    data = [],
    theme = null,
    frozenColCount = 0,
    filterHandler = null,
    options = {},
  } = props;

  const containerEl = useRef(null);

  const header = setGridHeader(children);

  // console.log('header', header);

  useEffect(() => {
    const grid = new cheetahGrid.ListGrid({
      parentElement: containerEl.current,
      frozenColCount,
      theme,
      header,
      ...options,
    });
    setGridData(grid, data, filterHandler);
  }, []);

  return (
    <div className={styles['c-grid']} ref={containerEl}>
      {/* define table header */}
      <div className={styles.define}>{children}</div>
    </div>
  );
};

export default CGrid;
