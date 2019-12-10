import React, { useState } from 'react';
import { Popover, Row, Col, Select, Input, Checkbox, Button } from 'antd';
import classNames from 'classnames';
import IconFont from '@/components/IconFont';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;

function Content({ hidePop, filterList, getFilteredState }) {
  const [isCheckAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkedList, setcheckedList] = useState([]);

  function handleClear() {
    setcheckedList([]);
    setIndeterminate(false);
    setCheckAll(false);
    getFilteredState(false);
    hidePop();
  }

  function handleChange(cList) {
    setcheckedList(cList);
    setIndeterminate(!!cList.length && cList.length < filterList.length);
    setCheckAll(cList.length === filterList.length);
  }

  function handleCheckAllChange(e) {
    const { checked } = e.target;
    setcheckedList(checked ? filterList : []);
    setIndeterminate(false);
    setCheckAll(checked);
  }

  function handleSearch(value) {
    console.log(value);
  }

  function handleFilter() {
    console.log(checkedList);
    getFilteredState(!!checkedList.length);
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
        <Select defaultValue="1" ellipsis style={{ width: '100%' }}>
          <Option value="1">contain</Option>
          <Option value="2">equal</Option>
          <Option value="3">not equal</Option>
        </Select>
        <Search placeholder="input search text" className={styles.search} onSearch={handleSearch} />
        <div className={styles.des}>Description</div>
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
          className={styles['check-container']}
          value={checkedList}
          onChange={handleChange}
        >
          {filterList.map(item => (
            <Row key={item}>
              <Checkbox value={item}>{item}</Checkbox>
            </Row>
          ))}
        </Checkbox.Group>
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

export default function ColumnTitle({ children }) {
  const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      visible={visible}
      content={
        <Content
          hidePop={() => setVisible(false)}
          filterList={[...Array(50).keys()]}
          getFilteredState={state => setFiltered(state)}
        />
      }
    >
      <div className={styles.container}>
        <IconFont
          type="iconfilter1"
          className={classNames(styles.icon, styles['filter-icon'], {
            [styles.active]: isFiltered,
          })}
          onClick={() => setVisible(!visible)}
        />
        {children}
      </div>
    </Popover>
  );
}
