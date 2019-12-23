import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Input, Checkbox, Button, Empty, Spin } from 'antd';
import IconFont from '@/components/IconFont';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;

const CONDITIONS = [
  { id: 1, name: 'EQUAL' },
  { id: 2, name: 'NOT EQUAL' },
  { id: 3, name: 'GREATER THAN' },
  { id: 4, name: 'GREATER THAN OR EQUAL' },
  { id: 5, name: 'LESS THAN' },
  { id: 6, name: 'LESS THAN OR EQUAL' },
  { id: 7, name: 'CONTAIN' },
];

export function FilterHeader() {
  function handleClear() {}
  return (
    <Row className={styles.title}>
      <Col span={12} align="left">
        <IconFont type="iconsort-asc" className={styles.icon} />
        <IconFont type="iconsort-desc" className={styles.icon} />
      </Col>
      <Col span={12} align="right">
        <span className={styles.clear} onClick={handleClear}>
          <IconFont type="icondelete" className={styles.icon} />
          <span className={styles.text}>CLEAR</span>
        </span>
      </Col>
    </Row>
  );
}

export function FilterFooter({ disabled, onCancel, onOk }) {
  return (
    <div className={styles['bottom-btns']}>
      <Button size="small" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="primary" disabled={disabled} onClick={onOk}>
        Commit
      </Button>
    </div>
  );
}

export function FilterType({ isNum, loading, handleTypeChange }) {
  const condition = ({ id }) => (isNum ? id !== 7 : [1, 2, 7].includes(id));
  return (
    <div className={styles['filter-type']}>
      <span>{isNum ? 'NUM' : 'TEXT'}</span>
      <Select
        ellipsis
        loading={loading}
        className={styles.type}
        defaultValue={isNum ? 1 : 7}
        onChange={val => handleTypeChange(val)}
      >
        {CONDITIONS.filter(condition).map(({ id, name }) => (
          <Option value={id} key={id}>
            {name}
          </Option>
        ))}
      </Select>
    </div>
  );
}

// type = [greater / less than] equal
export function FilterSelect({ filterList }) {
  function onSearch(val) {
    console.log('search:', val);
  }
  function onChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <div className={styles.selectbox}>
      <div className={styles.des}>Description</div>
      <Select
        showSearch
        allowClear
        placeholder="Select a item"
        className={styles.select}
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {filterList.map(item => (
          <Option value={item} key={item}>
            {item}
          </Option>
        ))}
      </Select>
    </div>
  );
}

// type = contain
export function FilterCheckbox({ loading, filterList, curColumn, conditions, onCheckedList }) {
  const [isCheckAll, setCheckAll] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkedList, setCheckedList] = useState([]);

  useEffect(() => {
    const curFilters = conditions.find(item => item.column === curColumn);
    if (curFilters) {
      setCheckedList(curFilters.value.split(','));
    } else {
      setCheckedList(filterList);
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
    console.log('value', value);
    // const sList = filterList.filter(item => item.toLowerCase() === value.toLowerCase());
    // setSearchList(sList || filterItems);
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
        {filterList.length > 0 ? (
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
              value={checkedList}
              onChange={handleChange}
            >
              {filterList.map(item => (
                <Row key={item}>
                  <Checkbox value={item}>{item}</Checkbox>
                </Row>
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
