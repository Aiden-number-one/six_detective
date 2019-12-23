import React, { PureComponent } from 'react';
import G2 from '@antv/g2';
import { Tabs, DatePicker } from 'antd';
import classNames from 'classnames';

import styles from './HomePage.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default class Monitor extends PureComponent {
  state = {
    alertState: 'ALL', // ALERT切换按钮
    textActive: 'Today', // today this week切换
  };

  componentDidMount() {
    const data = [
      { label: 'Outstanding', type: 'CLAIMED', value: 2800 },
      { label: 'Outstanding', type: 'PROCESSING', value: 2260 },
      { label: 'Alan', type: 'CLAIMED', value: 1800 },
      { label: 'Alan', type: 'PROCESSING', value: 1300 },
      { label: 'Thomas', type: 'CLAIMED', value: 950 },
      { label: 'Thomas', type: 'PROCESSING', value: 900 },
      { label: 'Alex', type: 'CLAIMED', value: 500 },
      { label: 'Alex', type: 'PROCESSING', value: 390 },
      { label: 'Fri.', type: 'CLAIMED', value: 170 },
      { label: 'Fri.', type: 'PROCESSING', value: 100 },
    ];
    const chart = new G2.Chart({
      container: 'container',
      forceFit: true,
      height: 250,
      padding: [20, 100, 20, 200],
    });
    chart.source(data);
    chart.legend({
      position: 'left-top', // 设置图例的显示位置
      itemGap: 20, // 图例项之间的间距
      label: {
        color: '#464C51',
      },
    });
    chart.axis('value', {
      position: 'right',
      label: {
        color: '#464C51',
      },
      line: {
        lineWidth: 0.5, // 设置线的宽度
      },
      grid: {
        lineStyle: {
          stroke: '#D4DDE3',
          lineWidth: 0.5,
          lineDash: [0],
        },
      },
    });
    chart.axis('label', {
      label: {
        offset: 12,
        color: '#464C51',
      },
      line: {
        lineWidth: 0.5, // 设置线的宽度
      },
    });
    chart
      .coord()
      .transpose()
      .scale(1, -1);
    chart
      .interval()
      .position('label*value')
      .color('type', ['#F4374C', '#0D87D4'])
      .adjust([
        {
          type: 'dodge',
          marginRatio: 1 / 32,
        },
      ]);
    chart.render();
  }

  render() {
    const { alertState, textActive } = this.state;

    return (
      <div>
        <div className={styles.homepageContent}>
          {/* 左侧 */}
          <div className={styles.leftSide}>
            {/* Statistical module */}
            <div className={styles.statisticalModule}>
              <Tabs defaultActiveKey="1">
                {/* ALERT */}
                <TabPane tab="ALERT" key="1">
                  <div className={styles.tabsHeader}>
                    <div className={styles.buttonGround}>
                      <span
                        className={classNames(
                          styles.switchButton,
                          alertState === 'ALL' ? styles.buttonActive : '',
                        )}
                        onClick={() => {
                          this.setState({
                            alertState: 'ALL',
                          });
                        }}
                      >
                        ALL
                      </span>
                      <span
                        className={classNames(
                          styles.switchButton,
                          alertState === 'PER' ? styles.buttonActive : '',
                        )}
                        onClick={() => {
                          this.setState({
                            alertState: 'PER',
                          });
                        }}
                      >
                        PERSONAL
                      </span>
                    </div>
                    <div className={styles.timepicker}>
                      <span
                        className={classNames(
                          styles.text,
                          textActive === 'Today' ? styles.textActive : '',
                        )}
                        onClick={() => {
                          this.setState({
                            textActive: 'Today',
                          });
                        }}
                      >
                        Today
                      </span>
                      <span
                        className={classNames(
                          styles.text,
                          textActive === 'Week' ? styles.textActive : '',
                        )}
                        onClick={() => {
                          this.setState({
                            textActive: 'Week',
                          });
                        }}
                      >
                        This Week
                      </span>
                      <RangePicker format="DD-MM-YYYY" />
                    </div>
                  </div>
                  <div className={styles.statisticalBox}>
                    <div className={styles.redBox}>
                      <div className={styles.leftBlock}>
                        <span className={styles.title}>TOTAL</span>
                        <span className={styles.value}>{100}</span>
                      </div>
                      <div className={styles.rightBlock}>
                        <span className={styles.title}>OUTSTANDING</span>
                        <span className={styles.value}>{50}</span>
                      </div>
                    </div>
                    <div className={styles.blackBox}>
                      <div className={styles.leftBlock}>
                        <span className={styles.title}>CLAIMED</span>
                        <span className={styles.value}>{300}</span>
                      </div>
                      <div className={styles.rightBlock}></div>
                    </div>
                    <div className={styles.blackBox}>
                      <div className={styles.leftBlock}>
                        <span className={styles.title}>PROCESSING</span>
                        <span className={styles.value}>{200}</span>
                      </div>
                      <div className={styles.rightBlock}></div>
                    </div>
                  </div>
                  <div id="container"></div>
                </TabPane>
                {/* APPROVAL PROCESS */}
                <TabPane tab="APPROVAL PROCESS" key="2">
                  Content of Tab Pane 2
                </TabPane>
                {/* DASHBOARD */}
                <TabPane tab="DASHBOARD" key="3">
                  Content of Tab Pane 3
                </TabPane>
              </Tabs>
            </div>
            {/* Pending tasks */}
            <div className={styles.pendingTasks}>
              <Tabs defaultActiveKey="1">
                {/* ALERT */}
                <TabPane tab="ALERT" key="1">
                  Content of Tab Pane 2
                </TabPane>
                {/* APPROVAL PROCESS */}
                <TabPane tab="TASK" key="2">
                  Content of Tab Pane 2
                </TabPane>
              </Tabs>
            </div>
          </div>
          <div className={styles.rightSide}></div>
        </div>
      </div>
    );
  }
}
