import React, { PureComponent } from 'react';
import G2 from '@antv/g2';
import moment from 'moment';
import { Tabs, DatePicker, List, Row, Col, Empty } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';

import { timestampFormat } from '@/pages/DataImportLog/constants';
import IconFont from '@/components/IconFont';
import ring from '@/assets/images/ring.png';

import styles from './HomePage.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect(({ allAlert, perAlert, information }) => ({
  allAlterData: allAlert.allAlterData, // 全部的alert的数据
  allAlertCount: allAlert.allAlertCount, // 全部alert总数
  allOutstandingALertCount: allAlert.allOutstandingALertCount, // 全部未认领的alert的总数
  allClaimAlertCount: allAlert.allClaimAlertCount, // 全部已认领的alert总数
  allProcessingAlertCount: allAlert.allProcessingAlertCount, // 全部处理中的alert总数
  perClaimAlertCount: perAlert.perClaimAlertCount, //  personal Claim alert 总数
  perProcessingAlertCount: perAlert.perProcessingAlertCount, // personal Processing alert 总数
  perClosedAlertCount: perAlert.perClosedAlertCount, // personal Closed Alert 总数
  informationData: information.informationData, // information Data
}))
export default class HomePage extends PureComponent {
  state = {
    alertState: 'ALL', // ALERT切换按钮
    textActive: 'Today', // today this week切换
    targetData: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取All alert 条形图数据
    dispatch({
      type: 'allAlert/getAllAlterData',
      payload: {},
      callback: data => {
        this.renderAlterAllChart(data);
      },
    });
    // 获取All alert total
    dispatch({
      type: 'allAlert/getAllAlertCount',
      payload: {},
    });
    // 获取All outstanding alert total
    dispatch({
      type: 'allAlert/getAllOutstandingALertCount',
      payload: {
        isClaimed: 0,
      },
    });
    // 获取All Claim alert total
    dispatch({
      type: 'allAlert/getAllClaimAlertCount',
      payload: {},
    });
    // 获取All processing alert total
    dispatch({
      type: 'allAlert/getAllProcessingAlertCount',
      payload: {},
    });
    dispatch({
      type: 'perAlert/getPerClaimAlertCount',
      payload: {
        isPersonal: '1',
      },
    });
    dispatch({
      type: 'perAlert/getPerProcessingAlertCount',
      payload: {},
    });
    dispatch({
      type: 'perAlert/getPerClosedAlterCount',
      payload: {},
    });
    dispatch({
      type: 'quickMenu/getQuickMenu',
      payload: {},
      callback: values => {
        const targetData = this.TreeFolderTrans(values);
        this.setState({
          targetData,
        });
      },
    });
    dispatch({
      type: 'information/getInformation',
      payload: {
        pageNumber: 1,
        pageSize: 4,
        dataTable: 'SLOP_BIZ.V_INFO',
      },
    });
  }

  // 接口菜单数据转化为Ant Tree所需数据
  TreeFolderTrans = value => {
    const dataList = [];
    value.forEach(item => {
      if (item.children) {
        item.children = this.TreeFolderTrans(item.children);
      }
      const param = {
        key: item.menuid,
        value: item.menuid,
        title: item.menuname,
        children: item.children,
        ...item,
      };
      dataList.push(param);
    });
    return dataList;
  };

  // 渲染Alter ALL条形图
  renderAlterAllChart = data => {
    // Alter ALL 的条形图
    const AlterAll = [];
    data.forEach(item => {
      AlterAll.push({
        label: item.userName, // 纵坐标
        type: 'CLAIMED', // 分类
        value: item.claimedCount, // 已认领数
      });
    });
    data.forEach(item => {
      AlterAll.push({
        label: item.userName, // 纵坐标
        type: 'PROCESSING', // 分类
        value: item.processingCount, // 处理中数
      });
    });
    // AlterAll = [
    //   { label: 'Outstanding', type: 'CLAIMED', value: 2800 },
    //   { label: 'Alan', type: 'CLAIMED', value: 1800 },
    //   { label: 'Outstanding', type: 'PROCESSING', value: 2260 },
    //   { label: 'Alan', type: 'PROCESSING', value: 1300 },
    //   { label: 'Thomas', type: 'CLAIMED', value: 950 },
    //   { label: 'Thomas', type: 'PROCESSING', value: 900 },
    //   { label: 'Alex', type: 'CLAIMED', value: 500 },
    //   { label: 'Alex', type: 'PROCESSING', value: 390 },
    //   { label: 'Fri.', type: 'CLAIMED', value: 170 },
    //   { label: 'Fri.', type: 'PROCESSING', value: 100 },
    // ];
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
    const {
      allOutstandingALertCount,
      perClaimAlertCount,
      perProcessingAlertCount,
      perClosedAlertCount,
    } = this.props;
    // Alter Personal 的条形图
    const AlterPersonal = [
      { label: 'Outstanding', value: allOutstandingALertCount },
      { label: 'Calimed', value: perClaimAlertCount },
      { label: 'Processing', value: perProcessingAlertCount },
      { label: 'Finished', value: perClosedAlertCount },
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
      .color('label', ['#10416C', '#F4374C', '#0D87D4', '#36BB3D'])
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
    const {
      allAlertCount,
      allOutstandingALertCount,
      allClaimAlertCount,
      allProcessingAlertCount,
      allAlterData,

      perClaimAlertCount, //  personal Claim alert 总数
      perProcessingAlertCount, // personal Processing alert 总数
      // perClosedAlertCount, // personal Closed Alert 总数

      informationData,
    } = this.props;

    const { alertState, textActive, targetData } = this.state;

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
                                this.renderAlterAllChart(allAlterData);
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
                              <span className={styles.value}>{allAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <span className={styles.title}>OUTSTANDING</span>
                              <span className={styles.value}>{allOutstandingALertCount}</span>
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>CLAIMED</span>
                              <span className={styles.value}>{allClaimAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <img src={ring} alt="" width={70} />
                              <span>{(allClaimAlertCount / allAlertCount).toFixed(2)}%</span>
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>PROCESSING</span>
                              <span className={styles.value}>{allProcessingAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <img src={ring} alt="" width={70} />
                              <span>{(allProcessingAlertCount / allAlertCount).toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                        <div id="AlterAll" style={{ minHeight: 250 }}></div>
                      </>
                    )}
                    {/* ALTER PERSONAL */}
                    {alertState === 'PER' && (
                      <>
                        <div className={styles.statisticalBox}>
                          <div className={styles.redBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>TOTAL</span>
                              <span className={styles.value}>{allAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <span className={styles.title}>OUTSTANDING</span>
                              <span className={styles.value}>{allOutstandingALertCount}</span>
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>CLAIMED</span>
                              <span className={styles.value}>{perClaimAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <img src={ring} alt="" width={70} />
                              <span>{(perClaimAlertCount / allAlertCount).toFixed(2)}%</span>
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>PROCESSING</span>
                              <span className={styles.value}>{perProcessingAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <img src={ring} alt="" width={70} />
                              <span>{(perProcessingAlertCount / allAlertCount).toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                        <div id="AlterPersonal" style={{ minHeight: 250 }}></div>
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
                    <h3 className={styles.groupTitle}>
                      Quick Menu
                      <IconFont
                        type="iconliangduanduiqi"
                        className={styles.quickMenuIcon}
                        onClick={() => {
                          router.push('/homepage/quick-menu-management');
                        }}
                      />
                    </h3>
                    <Row>
                      {targetData.map(item => (
                        <Col span={11} className={styles.menuItem}>
                          {/* <IconFont type={item.icon} className={styles.icon} /> */}
                          <span
                            onClick={() => {
                              router.push(item.menuurl);
                            }}
                          >
                            {item.title}
                          </span>
                        </Col>
                      ))}
                      {!targetData[0] && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                    </Row>
                  </div>
                  {/* Information */}
                  <div className={styles.information}>
                    <h3 className={styles.groupTitle}>Information</h3>
                    <List
                      itemLayout="horizontal"
                      dataSource={informationData}
                      renderItem={item => (
                        <List.Item>
                          <span className={styles.icon}>
                            <IconFont type="icon-sound" />
                          </span>
                          <span title="" className={styles.description}>
                            {item.informationDetail}
                          </span>
                          <span className={styles.date}>
                            {moment(item.timestamp).format(timestampFormat)}
                          </span>
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
