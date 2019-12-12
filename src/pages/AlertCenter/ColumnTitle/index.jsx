import React, { useState } from 'react';
import { Popover } from 'antd';
import classNames from 'classnames';
import IconFont from '@/components/IconFont';
import Content from './FilterContent';
import styles from './index.less';

export default function ColumnTitle({ children, loading, filterItems, isNum, getFilterItems }) {
  const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);

  function hanldeFilterItems() {
    if (!visible) {
      getFilterItems();
    }
  }
  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      visible={visible}
      onVisibleChange={v => setVisible(v)}
      content={
        <Content
          isNum={isNum}
          hidePop={() => setVisible(false)}
          loading={loading}
          filterItems={filterItems}
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
          onClick={hanldeFilterItems}
        />
        {children}
      </div>
    </Popover>
  );
}
