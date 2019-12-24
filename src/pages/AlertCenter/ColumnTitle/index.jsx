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

let conditions = [];

export default function ColumnTitle({
  children,
  isNum,
  loading,
  curColumn,
  filterItems,
  onFilters,
  onSort,
  onCommit,
}) {
  const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filterType, setFilterType] = useState(isNum ? 1 : 7);
  const [checkedList, setCheckedList] = useState([]);
  const isFilterSelect = [1, 3, 4, 5, 6].includes(filterType);

  function handleVisibleChange(v) {
    setVisible(v);
    if (v) {
      onFilters();
    }
  }

  async function handleClear() {
    conditions = conditions.filter(item => item.column !== curColumn);
    await onCommit(conditions);
    setCheckedList(filterItems);
    setFiltered(false);
    setVisible(false);
  }

  async function handleSort(sort) {
    await onSort(conditions, sort);
    setVisible(false);
  }

  async function handleOk() {
    const condition = {
      column: curColumn,
      value: checkedList.toString(),
      condition: filterType.toString(),
    };
    const curCondition = conditions.find(item => item.column === curColumn);
    if (curCondition) {
      conditions = conditions.map(item => {
        if (item.column === curColumn) {
          return Object.assign(item, condition);
        }
        return item;
      });
    } else {
      conditions.push(condition);
    }
    // filter icon change
    setFiltered(checkedList.toString() !== filterItems.toString());
    await onCommit(conditions);
    setVisible(false);
  }

  function handleSelect() {}

  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      overlayClassName={styles.container}
      overlayStyle={{ width: 260 }}
      content={
        <>
          <FilterHeader
            disabled={checkedList.length === filterItems.length}
            onClear={handleClear}
            onSort={handleSort}
          />
          <div className={styles.content}>
            <FilterType isNum={isNum} handleTypeChange={type => setFilterType(type)} />
            {isFilterSelect ? (
              <FilterSelect
                loading={loading}
                filterList={filterItems}
                curColumn={curColumn}
                conditions={conditions}
                onSelect={handleSelect}
              />
            ) : (
              <FilterCheckbox
                loading={loading}
                filterList={filterItems}
                curColumn={curColumn}
                conditions={conditions}
                onCheckedList={c => setCheckedList(c)}
              />
            )}
            <FilterFooter
              disabled={!checkedList.length}
              onCancel={() => setVisible(false)}
              onOk={handleOk}
            />
          </div>
        </>
      }
    >
      <div>
        <IconFont
          type="iconfilter1"
          className={classNames(styles['filter-icon'], {
            [styles.active]: isFiltered,
          })}
        />
        {children}
      </div>
    </Popover>
  );
}
