import React, { useState } from 'react';
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

function TypeSelect({ isNum, handleTypeChange }) {
  const condition = ({ id }) => (isNum ? id !== 7 : [1, 2, 7].includes(id));
  return (
    <Select
      ellipsis
      defaultValue={isNum ? 1 : 7}
      style={{ width: '100%' }}
      onChange={val => handleTypeChange(val)}
    >
      {CONDITIONS.filter(condition).map(({ id, name }) => (
        <Option value={id} key={id}>
          {name}
        </Option>
      ))}
    </Select>
  );
}

function SingelItem({ filterItems }) {
  function onSearch(val) {
    console.log('search:', val);
  }
  function onChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <>
      <div className={styles.des}>Description</div>
      <Select
        showSearch
        className={styles['scroll-container']}
        placeholder="Select a item"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {filterItems.map(item => (
          <Option value={item} key={item}>
            {item}
          </Option>
        ))}
      </Select>
    </>
  );
}

function MultipleItem({ loading, filterItems }) {
  const [isCheckAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkedList, setcheckedList] = useState([]);

  function handleChange(cList) {
    setcheckedList(cList);
    setIndeterminate(!!cList.length && cList.length < filterItems.length);
    setCheckAll(cList.length === filterItems.length);
  }

  function handleCheckAllChange(e) {
    const { checked } = e.target;
    setcheckedList(checked ? filterItems : []);
    setIndeterminate(false);
    setCheckAll(checked);
  }

  function handleSearch(value) {
    console.log(value);
  }
  return (
    <>
      <Search placeholder="input search text" className={styles.search} onSearch={handleSearch} />
      <div className={styles.des}>Description</div>
      <Spin spinning={loading}>
        {filterItems.length > 0 ? (
          <div>
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
              {filterItems.map(item => (
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
    </>
  );
}
export default function({ isNum, hidePop, loading, filterItems = [], getFilteredState }) {
  const [curSelectType, setSelectType] = useState('1');

  function handleClear() {
    getFilteredState(false);
    hidePop();
  }

  function handleFilter() {
    hidePop();
  }

  return (
    <div className={styles.content}>
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
      <Row className={styles.filter}>
        <TypeSelect isNum={isNum} handleTypeChange={val => setSelectType(val)} />
        {[1, 3, 4, 5, 6].some(v => v === curSelectType) ? (
          <SingelItem loading={loading} filterItems={filterItems} />
        ) : (
          <MultipleItem loading={loading} filterItems={filterItems} />
        )}
        <div className={styles['bottom-btns']}>
          <Button size="small" onClick={hidePop}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleFilter}>
            Commit
          </Button>
        </div>
      </Row>
    </div>
  );
}
