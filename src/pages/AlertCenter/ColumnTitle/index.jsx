import React, { useState } from 'react';
import { connect } from 'dva';
import { Popover, Button } from 'antd';
import classNames from 'classnames';
import IconFont from '@/components/IconFont';
import { FilterHeader, FilterType, FilterSelect, FilterCheckbox } from './FilterContent';
import styles from './index.less';

function ColumnTitle({
  dispatch,
  children,
  isNum,
  loading,
  curColumn,
  filterItems,
  conditions,
  onSort,
  onCommit,
}) {
  const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filterType, setFilterType] = useState(isNum ? 1 : 7);
  const [checkedList, setCheckedList] = useState(filterItems);
  const isFilterSelect = [1, 3, 4, 5, 6].includes(filterType);

  function handleVisibleChange(v) {
    setVisible(v);
    if (v) {
      dispatch({
        type: 'global/fetchTableFilterItems',
        payload: {
          tableName: 'slop_biz.v_alert_center',
          tableColumn: curColumn,
        },
      });
    }
  }

  async function handleClear() {
    await onCommit(curColumn);
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
    let updatedConditions = conditions;
    const curCondition = conditions.find(item => item.column === curColumn);
    if (curCondition) {
      updatedConditions = conditions.map(item => {
        if (item.column === curColumn) {
          return Object.assign(item, condition);
        }
        return item;
      });
    } else {
      updatedConditions.push(condition);
    }
    // filter icon change
    setFiltered(checkedList.toString() !== filterItems.toString());
    await onCommit(curColumn, updatedConditions);
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
            <div className={styles['bottom-btns']}>
              <Button size="small" onClick={() => setVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" disabled={!checkedList.length} onClick={handleOk}>
                Commit
              </Button>
            </div>
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

const mapStateToProps = ({ loading, global: { filterItems = [] } }) => ({
  loading: loading.effects['global/fetchTableFilterItems'],
  filterItems,
});
export default connect(mapStateToProps)(ColumnTitle);
