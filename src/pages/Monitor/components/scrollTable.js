/*
 * @Description: 滚动表格
 * @Author: lan
 * @Date: 2019-10-21 14:10:56
 * @LastEditTime: 2019-10-21 16:41:42
 * @LastEditors: lan
 */
import React, { PureComponent } from 'react';
import { Table, Layout, Card, Icon } from 'antd';
import styles from '../Monitor.less';

export default class ScrollTable extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.scrollTable}>
        <div className={styles.lineHeader}>
          <div className={styles.columnTitle} style={{ width: '10%' }}>
            Level
          </div>
          <div className={styles.columnTitle} style={{ width: '25%' }}>
            Alert Time
          </div>
          <div className={styles.columnTitle} style={{ width: '55%' }}>
            Alert Content
          </div>
          <div className={styles.columnTitle} style={{ width: '10%' }}>
            Status
          </div>
        </div>
        <div className={styles.lineHeader1}></div>
        <div className={styles.rowsContainer}>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:38:20
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level1
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level2
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level3
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level4
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level5
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level6
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level7
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level1
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level2
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level3
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level4
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level5
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level6
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level7
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              Alert Time
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              Alert Content
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Status
            </div>
          </div>
        </div>
      </div>
    );
  }
}
