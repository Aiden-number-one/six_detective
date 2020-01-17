import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Row, Col, Select, Input, Checkbox, Empty, Spin, Typography } from 'antd';
import IconFont from '@/components/IconFont';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

const types = [
  { id: 1, name: 'EQUAL' },
  { id: 2, name: 'NOT EQUAL' },
  { id: 3, name: 'GREATER THAN' },
  { id: 4, name: 'GREATER THAN OR EQUAL' },
  { id: 5, name: 'LESS THAN' },
  { id: 6, name: 'LESS THAN OR EQUAL' },
  { id: 7, name: 'CONTAIN' },
];

const textTypes = types.filter(({ id }) => id === 7 || id === 1 || id === 2);
const numTypes = types.filter(({ id }) => id !== 7);

export function FilterHeader({ disabled, onSort, sort, onClear }) {
  return (
    <Row className={styles.title} type="flex" justify="space-between" align="middle">
      <Col>
        <IconFont
          type="iconsort-asc"
          onClick={() => onSort('1')}
          style={{ marginRight: 8 }}
          className={classNames(styles.icon, { [styles.active]: sort === '1' })}
        />
        <IconFont
          type="iconsort-desc"
          onClick={() => onSort('0')}
          className={classNames(styles.icon, { [styles.active]: sort === '0' })}
        />
      </Col>
      <Col>
        <span
          onClick={onClear}
          className={classNames(styles.clear, { [styles.disabled]: disabled })}
        >
          <IconFont type="icondelete" className={styles.icon} />
          <span className={styles.text}>Clear</span>
        </span>
      </Col>
    </Row>
  );
}

export function FilterType({ isNum, type, onChange }) {
  const curTypes = isNum ? numTypes : textTypes;
  const curType = curTypes.find(({ id }) => id === type);

  return (
    <div className={styles['filter-type']}>
      <span>{isNum ? 'NUM' : 'TEXT'}</span>
      <Select ellipsis className={styles.type} value={curType.name} onChange={val => onChange(val)}>
        {curTypes.map(({ id, name }) => (
          <Option value={id} key={id}>
            {name}
          </Option>
        ))}
      </Select>
    </div>
  );
}

// type = [greater / less than] equal (never save last filter state)
export function FilterSelect({ loading, filterList, onChange }) {
  return (
    <div className={styles.selectbox}>
      <div className={styles.des}>Description</div>
      <Select
        showSearch
        allowClear
        loading={loading}
        placeholder="please select a item"
        className={styles.select}
        optionFilterProp="children"
        dropdownMenuStyle={{ maxHeight: 160 }}
        onChange={val => onChange(val)}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {filterList.map(item => (
          <Option value={decodeURIComponent(item)} key={item}>
            {item}
          </Option>
        ))}
      </Select>
    </div>
  );
}

// type = contain
export function FilterCheckbox({
  loading,
  filterList,
  selectedItem,
  onCheckedList,
  curColumn,
  conditions,
}) {
  const [isCheckAll, setCheckAll] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [searchList, setSearchList] = useState(filterList);

  useEffect(() => {
    const curFilters = conditions.find(item => item.column === curColumn);
    if (curFilters) {
      setCheckedList(curFilters.value.split(','));
      if (selectedItem) {
        setIndeterminate(true);
        setCheckAll(false);
      }
    } else {
      // reset
      setCheckedList(filterList);
      setSearchList(filterList);
      setIndeterminate(false);
      setCheckAll(true);
    }
  }, [filterList, curColumn, conditions]);

  function handleChange(cList) {
    setCheckedList(cList);
    onCheckedList(cList);
    setIndeterminate(cList.length && cList.length < filterList.length);
    setCheckAll(cList.length === filterList.length);
  }

  function handleCheckAllChange(e) {
    const { checked } = e.target;
    const cList = checked ? filterList : [];
    setCheckedList(cList);
    onCheckedList(cList);
    setIndeterminate(false);
    setCheckAll(checked);
  }

  function handleSearch(value) {
    const sList = filterList.filter(item => item.toLowerCase().includes(value.toLowerCase()));
    setSearchList(sList);
  }

  return (
    <div className={styles.checkbox}>
      <Search
        placeholder="input search keyword"
        className={styles.search}
        onSearch={handleSearch}
      />
      <div className={styles.des}>Description</div>
      <Spin spinning={loading}>
        {searchList.length > 0 ? (
          <div className={styles['check-content']}>
            <Row>
              <Checkbox
                indeterminate={indeterminate}
                onChange={handleCheckAllChange}
                checked={isCheckAll}
              >
                Select All
              </Checkbox>
            </Row>
            <Checkbox.Group
              className={styles['scroll-container']}
              value={checkedList.map(item => decodeURIComponent(item))}
              onChange={handleChange}
            >
              {searchList.map(item => (
                <Checkbox value={item} key={String(item)} className="checkbox-item">
                  <Text ellipsis title={String(item)}>
                    {item && item.length > 23 ? `${item.slice(0, 23)}...` : item}
                  </Text>
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </div>
  );
}
