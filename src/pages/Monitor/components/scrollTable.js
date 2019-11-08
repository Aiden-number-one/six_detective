/*
 * @Description: 滚动表格
 * @Author: lan
 * @Date: 2019-10-21 14:10:56
 * @LastEditTime: 2019-11-08 13:27:13
 * @LastEditors: lan
 */
import React, { PureComponent } from 'react';
import styles from '../Monitor.less';

export default class ScrollTable extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.scrollTables}>
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
              20190823 15:26:00
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [KSF] Reported LOP of BI/TO dropped 2000 contracts
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Overdue
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level1
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190823 15:38:54
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [LFK] 1/2 NRM and 1/7 TMR Working Capital
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              pending
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level2
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190823 15:47:00
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [SHK] Working Capital ten million HKD
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Overdue
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level3
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:00:00
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [ASA] Position on HSI position limit
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              pending
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level4
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:10:20
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [BNP] UNC accounts with delta of HSI/HHI 500 delta
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              pending
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level5
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:18:32
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [BOC] Record with reported LOP EP OI by EP Total
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Completed
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level6
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:38:20
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [HNT] Position 80% of position limit
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              processing
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level7
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:40:15
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [JPM] Individual investor 5% of position limit
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Completed
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190823 15:26:00
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [KSF] Reported LOP of BI/TO dropped 2000 contracts
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Overdue
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level1
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190823 15:38:54
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [LFK] 1/2 NRM and 1/7 TMR Working Capital
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              pending
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level2
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190823 15:47:00
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [SHK] Working Capital ten million HKD
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Overdue
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level3
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:00:00
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [ASA] Position on HSI position limit
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              pending
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level4
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:10:20
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [BNP] UNC accounts with delta of HSI/HHI 500 delta
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              pending
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level5
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:18:32
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [BOC] Record with reported LOP EP OI by EP Total
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Completed
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level6
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:38:20
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [HNT] Position 80% of position limit
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              processing
            </div>
          </div>
          <div className={styles.rowContent}>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Level7
            </div>
            <div className={styles.columnTitle} style={{ width: '25%' }}>
              20190824 15:40:15
            </div>
            <div className={styles.columnTitle} style={{ width: '55%' }}>
              [JPM] Individual investor 5% of position limit
            </div>
            <div className={styles.columnTitle} style={{ width: '10%' }}>
              Completed
            </div>
          </div>
        </div>
      </div>
    );
  }
}
