import React, { useState } from 'react';
import { Popover } from 'antd';
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
  tableColumn,
  filterItems = [],
  getFilterItems,
  handleCommit,
}) {
  // const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filterType, setFilterType] = useState(isNum ? 1 : 7);
  const [checkedList, setcheckedList] = useState([]);
  const isFilterSelect = [1, 3, 4, 5, 6].includes(filterType);
  // const [conditions, setConditions] = useState([]);

  function hanldeFilterItems() {
    if (!visible) {
      getFilterItems();
    }
  }

  async function handleOk() {
    const condition = {
      column: tableColumn,
      value: checkedList.toString(),
      condition: filterType.toString(),
    };
    await handleCommit(condition);
    setVisible(false);
  }

  function handleCheckList(cList) {
    setcheckedList(cList);
  }
  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      visible={visible}
      onVisibleChange={v => setVisible(v)}
      overlayClassName={styles.container}
      overlayStyle={{ width: 260 }}
      content={
        <>
          <FilterHeader />
          <div className={styles.content}>
            <FilterType isNum={isNum} handleTypeChange={type => setFilterType(type)} />
            {isFilterSelect ? (
              <FilterSelect filterItems={filterItems} />
            ) : (
              <FilterCheckbox
                loading={loading}
                filterItems={filterItems}
                getCheckList={handleCheckList}
              />
            )}
            <FilterFooter onCancel={() => setVisible(false)} onOk={handleOk} />
          </div>
        </>
      }
    >
      <div onClick={hanldeFilterItems}>
        <IconFont type="iconfilter1" className={classNames(styles.icon, styles['filter-icon'])} />
        {children}
      </div>
    </Popover>
  );
}
