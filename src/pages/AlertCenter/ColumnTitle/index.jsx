import React, { useState } from 'react';
import { Popover, Row } from 'antd';
import classNames from 'classnames';
import IconFont from '@/components/IconFont';
import {
  FilterHeader,
  FilterFooter,
  FilterType,
  FilterSelect,
  FilterCheckbox,
} from './FilterContent';
import styles from './index.less';

export default function ColumnTitle({
  children,
  isNum,
  loading,
  filterItems = [],
  getFilterItems,
}) {
  // const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filterType, setFilterType] = useState(1);

  const isFilterSelect = [1, 3, 4, 5, 6].includes(filterType);

  function hanldeFilterItems() {
    if (!visible) {
      getFilterItems();
    }
  }

  function handleCommit() {
    setVisible(false);
  }
  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      visible={visible}
      onVisibleChange={v => setVisible(v)}
      content={
        <div className={styles.content}>
          <FilterHeader />
          <Row className={styles.filter}>
            <FilterType isNum={isNum} handleTypeChange={type => setFilterType(type)} />
            {isFilterSelect ? (
              <FilterSelect filterItems={filterItems} />
            ) : (
              <FilterCheckbox loading={loading} filterItems={filterItems} />
            )}
            <FilterFooter onCancel={() => setVisible(false)} onOk={handleCommit} />
          </Row>
        </div>
      }
    >
      <Row onClick={hanldeFilterItems} type="flex" align="middle" justify="space-around">
        <IconFont
          type="iconfilter1"
          className={classNames(
            styles.icon,
            styles['filter-icon'] /* {
            [styles.active]: isFiltered,
          } */,
          )}
        />
        {children}
      </Row>
    </Popover>
  );
}
