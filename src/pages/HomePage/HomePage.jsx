import React, { PureComponent } from 'react';
import G2 from '@antv/g2';
import { Tabs, DatePicker, List, Row, Col } from 'antd';
import classNames from 'classnames';

import IconFont from '@/components/IconFont';

import styles from './HomePage.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const MenuItem = [
  {
    title: 'LOP Data Import',
    icon: 'icon-data',
  },
  {
    title: 'Alert Model  Management',
    icon: 'icon-data',
  },
  {
    title: 'Market Data Import',
    icon: 'icon-data',
  },
  {
    title: 'EP Code',
    icon: 'icon-data',
  },
  {
    title: 'LOP Data Import',
    icon: 'icon-data',
  },
  {
    title: 'Product Code',
    icon: 'icon-data',
  },
  {
    title: 'Submitter  Information',
    icon: 'icon-data',
  },
  {
    title: 'Rule  Maintenance',
    icon: 'icon-data',
  },
  {
    title: 'Parameter Maintenance',
    icon: 'icon-data',
  },
  {
    title: 'Position Data',
    icon: 'icon-data',
  },
  {
    title: 'Market Data Import',
    icon: 'icon-data',
  },
  {
    title: 'EP Code',
    icon: 'icon-data',
  },
];

export default class Monitor extends PureComponent {
  state = {
    alertState: 'ALL', // ALERT切换按钮
    textActive: 'Today', // today this week切换
  };

  componentDidMount() {
    this.renderAlterAllChart();
  }

  // 渲染Alter ALL条形图
  renderAlterAllChart = () => {
    // Alter ALL 的条形图
    const AlterAll = [
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
    const alterAllChart = new G2.Chart({
      container: 'AlterAll',
      forceFit: true,
      height: 250,
      padding: [20, 100, 20, 200],
    });
    alterAllChart.source(AlterAll);
    alterAllChart.legend({
      position: 'left-top', // 设置图例的显示位置
      itemGap: 20, // 图例项之间的间距
      label: {
        color: '#464C51',
      },
    });
    alterAllChart.axis('value', {
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
    alterAllChart.axis('label', {
      label: {
        offset: 12,
        color: '#464C51',
      },
      line: {
        lineWidth: 0.5, // 设置线的宽度
      },
    });
    alterAllChart
      .coord()
      .transpose()
      .scale(1, -1);
    alterAllChart
      .interval()
      .position('label*value')
      .color('type', ['#F4374C', '#0D87D4'])
      .label('value', {
        textStyle: {
          fill: '#464C51',
          fontSize: 11,
        },
        offset: 10,
      })
      .adjust([
        {
          type: 'dodge',
          marginRatio: 1 / 32,
        },
      ]);
    alterAllChart.render();
  };

  // 渲染Alter Personal条形图
  renderAlterPerChart = () => {
    // Alter Personal 的条形图
    const AlterPersonal = [
      { label: 'Outstanding', value: 2800 },
      { label: 'Calimed', value: 1800 },
      { label: 'Processing', value: 950 },
      { label: 'Finished', value: 500 },
    ];
    const alterPersonalChart = new G2.Chart({
      container: 'AlterPersonal',
      forceFit: true,
      height: 250,
      padding: [20, 100, 20, 100],
    });
    alterPersonalChart.source(AlterPersonal);
    alterPersonalChart.legend(false);
    alterPersonalChart.axis('value', {
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
    alterPersonalChart.axis('label', {
      label: {
        offset: 12,
        color: '#464C51',
      },
      line: {
        lineWidth: 0.5, // 设置线的宽度
      },
    });
    alterPersonalChart
      .coord()
      .transpose()
      .scale(1, -1);
    alterPersonalChart
      .interval()
      .position('label*value')
      .color('#F4374C')
      .label('value', {
        textStyle: {
          fill: '#464C51',
          fontSize: 12,
        },
        offset: 10,
      })
      .size(15)
      .adjust([
        {
          type: 'dodge',
          marginRatio: 1 / 32,
        },
      ]);
    alterPersonalChart.render();
  };

  render() {
    const { alertState, textActive } = this.state;

    return (
      <div>
        <div className={styles.homepage}>
          <Tabs defaultActiveKey="1">
            {/* ALERT */}
            <TabPane tab="ALERT" key="1">
              <div className={styles.homepageContent}>
                {/* 左侧 */}
                <div className={styles.leftSide}>
                  {/* Statistical module */}
                  <div className={styles.statisticalModule}>
                    <div className={styles.tabsHeader}>
                      <div className={styles.buttonGround}>
                        <span
                          className={classNames(
                            styles.switchButton,
                            alertState === 'ALL' ? styles.buttonActive : '',
                          )}
                          onClick={() => {
                            this.setState(
                              {
                                alertState: 'ALL',
                              },
                              () => {
                                this.renderAlterAllChart();
                              },
                            );
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
                            this.setState(
                              {
                                alertState: 'PER',
                              },
                              () => {
                                this.renderAlterPerChart();
                              },
                            );
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
                    {/* ALTER ALL */}
                    {alertState === 'ALL' && (
                      <>
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
                        <div id="AlterAll"></div>
                      </>
                    )}
                    {/* ALTER PERSONAL */}
                    {alertState === 'PER' && (
                      <>
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
                        <div id="AlterPersonal"></div>
                      </>
                    )}
                  </div>
                  {/* Pending tasks */}
                  <div className={styles.pendingTasks}>
                    <Tabs
                      defaultActiveKey="1"
                      tabBarExtraContent={<span className={styles.more}>More</span>}
                    >
                      {/* ALERT */}
                      <TabPane tab="ALERT" key="1">
                        <div className={styles.infoList}>
                          <h3 className={styles.groupTitle}>Authorizing access to menus</h3>
                          <List
                            itemLayout="horizontal"
                            dataSource={[{}, {}, {}]}
                            renderItem={() => (
                              <List.Item>
                                <div title="" className={styles.description}>
                                  A/C NO. matches with existing A/C NO. , with discrepancy in pr
                                </div>
                                <div className={styles.date}>12/Nov/2019</div>
                                <div className={classNames(styles.user, styles.yellow)}>TC</div>
                              </List.Item>
                            )}
                          />
                        </div>
                      </TabPane>
                      {/* APPROVAL PROCESS */}
                      <TabPane tab="TASK" key="2">
                        <div className={styles.infoList}>
                          <h3 className={styles.groupTitle}>Authorizing access to menus</h3>
                          <List
                            itemLayout="horizontal"
                            // dataSource={[{}, {}, {}]}
                            // renderItem={item => (
                            //   <List.Item>
                            //     <div title="" className={styles.description}>A/C NO. matches with
                            // existing A/C NO. , with discrepancy in pr</div>
                            //     <div className={styles.date}>12/Nov/2019</div>
                            //     <div className={classNames(styles.user, styles.yellow)}>TC</div>
                            //   </List.Item>
                            // )}
                          />
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
                {/* 右侧 */}
                <div className={styles.rightSide}>
                  {/* Quick Menu */}
                  <div className={styles.quickMenu}>
                    <h3 className={styles.groupTitle}>Quick Menu</h3>
                    <Row>
                      {MenuItem.map(item => (
                        <Col span={11} className={styles.menuItem}>
                          <IconFont type={item.icon} className={styles.icon} />
                          <span>{item.title}</span>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  {/* Information */}
                  <div className={styles.information}>
                    <h3 className={styles.groupTitle}>Information</h3>
                    <List
                      itemLayout="horizontal"
                      dataSource={[{}, {}, {}, {}]}
                      renderItem={() => (
                        <List.Item>
                          <span className={styles.icon}>
                            <IconFont />
                          </span>
                          <span title="" className={styles.description}>
                            A/C NO. matches with existing A/C NO. , with discrepancy in pr
                          </span>
                          <span className={styles.date}>12/Nov/2019 13:30</span>
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
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
      </div>
    );
  }
}
