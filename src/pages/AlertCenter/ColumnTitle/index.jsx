import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Popover, Button } from 'antd';
import classNames from 'classnames';
import IconFont from '@/components/IconFont';
import { FilterHeader, FilterType, FilterSelect, FilterCheckbox } from './FilterContent';
import styles from './index.less';

export { useColumnFilter, actionType } from './hooks';

function ColumnTitle({
  dispatch,
  loading,
  children,
  isNum,
  sort,
  onSort,
  onCommit,
  curColumn,
  conditions,
  tableName = 'SLOP_BIZ.V_ALERT_CENTER',
}) {
  const defaultFilterType = isNum ? 1 : 7;
  const [filterItems, setFilterItems] = useState([]);
  const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filterType, setFilterType] = useState(defaultFilterType);
  const [checkedList, setCheckedList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(''); // filterType == 1/3/4/5/6

  // reset all state
  useEffect(() => {
    if (conditions.length === 0) {
      resetState();
    }
  }, [conditions]);

  async function handleVisibleChange(v) {
    setVisible(v);
    if (v) {
      setFilterType(defaultFilterType);
      const filters = await dispatch({
        type: 'global/fetchTableFilterItems',
        payload: {
          tableName,
          tableColumn: curColumn,
        },
      });
      setFilterItems(filters || []);
      if (!checkedList.length) {
        setCheckedList(filters || []);
      }
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

  function resetState() {
    setCheckedList(filterItems);
    setSelectedItem('');
    setFiltered(false);
    setVisible(false);
  }

  async function handleClear() {
    const updatedConditions = conditions.filter(item => item.column !== curColumn);
    await onCommit(curColumn, updatedConditions);
    resetState();
  }

  async function handleSort(s) {
    if (s !== sort) {
      await onSort(curColumn, s);
    }
    setVisible(false);
  }

  async function handleOk() {
    const isCheckbox = filterType === 2 || filterType === 7;
    const values = isCheckbox ? checkedList : [selectedItem];

    const condition = {
      column: curColumn,
      value: values.map(item => encodeURIComponent(item)).toString(),
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
            sort={sort}
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
              <Button type="primary" disabled={loading || !checkedList.length} onClick={handleOk}>
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

const mapStateToProps = ({ loading }) => ({
  loading: loading.effects['global/fetchTableFilterItems'],
});
export default connect(mapStateToProps)(ColumnTitle);
