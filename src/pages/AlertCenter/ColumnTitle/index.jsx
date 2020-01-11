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
  const defaultFilterType = isNum ? 1 : 7;

  const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filterType, setFilterType] = useState(defaultFilterType);
  const [checkedList, setCheckedList] = useState(filterItems);
  const [selectedItem, setSelectedItem] = useState(''); // filterType == 1/3/4/5/6

  function handleVisibleChange(v) {
    setVisible(v);
    if (v) {
      setFilterType(defaultFilterType);
      dispatch({
        type: 'global/fetchTableFilterItems',
        payload: {
          tableName: 'slop_biz.v_alert_center',
          tableColumn: curColumn,
        },
      });
    }
  }

  function handleCheckList(val) {
    setCheckedList(val);
    setSelectedItem('');
  }
  function handleSelect(val) {
    setSelectedItem(val);
    setCheckedList([val]);
  }

  async function handleClear() {
    await onCommit(curColumn);
    setCheckedList(filterItems);
    setFiltered(false);
    setVisible(false);
  }

  async function handleSort(sort) {
    await onSort(curColumn, sort);
    setVisible(false);
  }

  async function handleOk() {
    const isCheckbox = filterType === 2 || filterType === 7;
    const value = isCheckbox ? checkedList : [selectedItem];
    const condition = {
      column: curColumn,
      value: value.toString(),
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
            <FilterType isNum={isNum} type={filterType} onChange={type => setFilterType(type)} />
            {filterType === 2 || filterType === 7 ? (
              <FilterCheckbox
                loading={loading}
                filterList={filterItems}
                curColumn={curColumn}
                conditions={conditions}
                onCheckedList={handleCheckList}
              />
            ) : (
              <FilterSelect
                loading={loading}
                filterList={filterItems}
                curColumn={curColumn}
                conditions={conditions}
                onChange={handleSelect}
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
