import React, { PureComponent } from 'react';
import G2 from '@antv/g2';
import moment from 'moment';
import { Tabs, DatePicker, List, Row, Col, Empty } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';

import { timestampFormat, dateFormat } from '@/pages/DataImportLog/constants';
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
  myAlertData: perAlert.myAlertData, // My Alert 的表格数据
}))
export default class HomePage extends PureComponent {
  state = {
    alertState: 'ALL', // ALERT切换按钮
    textActive: 'Today', // ALERT today this week切换
    approvalState: 'ALL', // APPROVAL PROCESS切换按钮
    approvalTextActive: 'Today', // APPROVAL PROCESS today this week切换
    targetData: [], // 快捷菜单
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
    // 获取个人 Alert Claim total
    dispatch({
      type: 'perAlert/getPerClaimAlertCount',
      payload: {
        isPersonal: '1',
      },
    });
    // 获取个人 Alert processing total
    dispatch({
      type: 'perAlert/getPerProcessingAlertCount',
      payload: {},
    });
    // 获取个人 Alert Closed total
    dispatch({
      type: 'perAlert/getPerClosedAlterCount',
      payload: {},
    });
    // 获取My alert的数据
    dispatch({
      type: 'perAlert/getMyAlert',
      payload: {
        pageNumber: 1,
        pageSize: 3,
      },
    });
    // 获取快捷菜单
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
    // 获取information
    dispatch({
      type: 'information/getInformation',
      payload: {
        pageNumber: 1,
        pageSize: 4,
        dataTable: 'SLOP_BIZ.V_INFO',
      },
    });
  }

  // tabs 切换
  onTabsChange = activeKey => {
    if (activeKey === '2') {
      setTimeout(() => {
        if (document.getElementById('ApprovalAll')) {
          this.renderApprovalAllChart();
        }
      }, 0);
    }
  };

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
      container: 'AlterAll', // div ID
      forceFit: true, // 是否自适应宽度
      height: 250, // 画布高度
      padding: [20, 100, 20, 200], // 上下左右的padding
    });
    alterAllChart.source(AlterAll);
    alterAllChart.legend({
      position: 'left-top', // 设置图例的显示位置
      itemGap: 20, // 图例项之间的间距
      label: {
        color: '#464C51', // 图例的字体颜色
      },
    });
    // 柱图value坐标
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
    // 将柱图转为条形图
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
    alterAllChart.on('interval:click', ev => {
      // alertOwnerId
      const clickData = ev.data;
      if (clickData) {
        // eslint-disable-next-line no-underscore-dangle
        const alertOwnerId = clickData._origin.label;
        // eslint-disable-next-line no-underscore-dangle
        const alertStatusDesc = clickData._origin.type;
        router.push(
          `/homepage/alert-center?alertOwnerId=${alertOwnerId}&alertStatusDesc=${alertStatusDesc}`,
        );
      }
    });
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
    alterPersonalChart.on('interval:click', ev => {
      const clickData = ev.data;
      if (clickData) {
        // eslint-disable-next-line no-underscore-dangle
        const alertOwnerId = localStorage.getItem('loginName');
        // eslint-disable-next-line no-underscore-dangle
        const alertStatusDesc = clickData._origin.label;
        router.push(
          `/homepage/alert-center?alertOwnerId=${alertOwnerId}&alertStatusDesc=${alertStatusDesc}`,
        );
      }
    });
  };

  renderApprovalAllChart = () => {
    // const ApprovalAll = [];
    // data.forEach(item => {
    //   ApprovalAll.push({
    //     label: item.userName, // 纵坐标
    //     type: 'CLAIMED', // 分类
    //     value: item.claimedCount, // 已认领数
    //   });
    // });
    // data.forEach(item => {
    //   ApprovalAll.push({
    //     label: item.userName, // 纵坐标
    //     type: 'PROCESSING', // 分类
    //     value: item.processingCount, // 处理中数
    //   });
    // });
    const ApprovalAll = [
      { label: 'Outstanding', type: 'CLAIMED', value: 2800 },
      { label: 'Alan', type: 'CLAIMED', value: 1800 },
      { label: 'Outstanding', type: 'PROCESSING', value: 2260 },
      { label: 'Alan', type: 'PROCESSING', value: 1300 },
      { label: 'Thomas', type: 'CLAIMED', value: 950 },
      { label: 'Thomas', type: 'PROCESSING', value: 900 },
      { label: 'Alex', type: 'CLAIMED', value: 500 },
      { label: 'Alex', type: 'PROCESSING', value: 390 },
      { label: 'Fri.', type: 'CLAIMED', value: 170 },
      { label: 'Fri.', type: 'PROCESSING', value: 100 },
    ];
    const approvalAllChart = new G2.Chart({
      container: 'ApprovalAll',
      forceFit: true,
      height: 250,
      padding: [20, 100, 20, 150],
    });
    approvalAllChart.source(ApprovalAll);
    approvalAllChart.legend({
      position: 'left-top', // 设置图例的显示位置
      itemGap: 20, // 图例项之间的间距
      label: {
        color: '#464C51',
      },
    });
    approvalAllChart.axis('value', {
      position: 'left',
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
    approvalAllChart.axis('label', {
      label: {
        offset: 12,
        color: '#464C51',
      },
      line: {
        lineWidth: 0.5, // 设置线的宽度
      },
    });
    approvalAllChart
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
    approvalAllChart.render();
    approvalAllChart.on('interval:click', ev => {
      // alertOwnerId
      const clickData = ev.data;
      if (clickData) {
        // eslint-disable-next-line no-underscore-dangle
        const alertOwnerId = clickData._origin.label;
        // eslint-disable-next-line no-underscore-dangle
        const alertStatusDesc = clickData._origin.type;
        router.push(
          `/homepage/Approval-Process-Center?alertOwnerId=${alertOwnerId}&alertStatusDesc=${alertStatusDesc}`,
        );
      }
    });
  };

  renderApprovalPerChart = () => {
    // const {
    //   allOutstandingALertCount,
    //   perClaimAlertCount,
    //   perProcessingAlertCount,
    //   perClosedAlertCount,
    // } = this.props;
    // Approval Personal 的条形图
    const ApprovalPersonal = [
      { label: 'Outstanding', value: 1 },
      { label: 'Calimed', value: 2 },
      { label: 'Processing', value: 3 },
      { label: 'Finished', value: 4 },
    ];
    const approvalPersonalChart = new G2.Chart({
      container: 'ApprovalPersonal',
      forceFit: true,
      height: 250,
      padding: [20, 50, 30, 50],
    });
    approvalPersonalChart.source(ApprovalPersonal);
    approvalPersonalChart.legend(false);
    approvalPersonalChart.axis('value', {
      position: 'left',
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
    approvalPersonalChart.axis('label', {
      label: {
        offset: 12,
        color: '#464C51',
      },
      line: {
        lineWidth: 0.5, // 设置线的宽度
      },
    });
    approvalPersonalChart
      .interval()
      .position('label*value')
      .label('value', {
        textStyle: {
          fill: '#464C51',
          fontSize: 12,
        },
        offset: 10,
      })
      .color('label', ['#0D87D4'])
      .size(15)
      .adjust([
        {
          type: 'dodge',
          marginRatio: 1 / 32,
        },
      ]);
    approvalPersonalChart.render();
    approvalPersonalChart.on('interval:click', ev => {
      const clickData = ev.data;
      if (clickData) {
        // eslint-disable-next-line no-underscore-dangle
        const alertOwnerId = localStorage.getItem('loginName');
        // eslint-disable-next-line no-underscore-dangle
        const alertStatusDesc = clickData._origin.label;
        router.push(
          `/homepage/Approval-Process-Center?alertOwnerId=${alertOwnerId}&alertStatusDesc=${alertStatusDesc}`,
        );
      }
    });
  };

  // ApprovalPersonalPie
  renderApprovalPerPieChart = () => {
    // const {
    //   allOutstandingALertCount,
    //   perClaimAlertCount,
    //   perProcessingAlertCount,
    //   perClosedAlertCount,
    // } = this.props;
    // Approval Personal 的饼图图
    const ApprovalPersonalPie = [
      { label: 'Approved', value: 3, percent: 0.3 },
      { label: 'Rejected', value: 3, percent: 0.3 },
      { label: 'Terminated', value: 4, percent: 0.4 },
    ];
    const approvalPersonalPieChart = new G2.Chart({
      container: 'ApprovalPersonalPie',
      forceFit: true,
      height: 250,
      padding: [20, 0, 20, 70],
    });
    approvalPersonalPieChart.source(ApprovalPersonalPie, {
      percent: {
        formatter: val => {
          const value = `${val * 100}%`;
          return value;
        },
      },
    });
    approvalPersonalPieChart.coord('theta');
    approvalPersonalPieChart.tooltip({
      showTitle: false,
    });
    approvalPersonalPieChart.legend({
      position: 'left-top',
      // itemFormatter: (a, b) => {
      //   console.log(a, b);
      //   debugger
      // }
    });
    approvalPersonalPieChart
      .intervalStack()
      .position('percent')
      // .label('value', {
      //   textStyle: {
      //     fill: '#464C51',
      //     fontSize: 12,
      //   },
      //   offset: 10,
      // })
      .label('percent', {
        offset: -40,
      })
      .tooltip('label*percent', (label, percent) => {
        const value = `${percent * 100}%`;
        return {
          name: label,
          value,
        };
      })
      .color('label', ['#0D87D4', '#F4374C', '#10416C'])
      .style({
        lineWidth: 1,
        stroke: '#fff',
      });
    // .size(15)
    // .adjust([
    //   {
    //     type: 'dodge',
    //     marginRatio: 1 / 32,
    //   },
    // ]);
    approvalPersonalPieChart.render();
    // approvalPersonalPieChart.on('interval:click', ev => {
    //   const clickData = ev.data;
    //   if (clickData) {
    //     // eslint-disable-next-line no-underscore-dangle
    //     const alertOwnerId = localStorage.getItem('loginName');
    //     // eslint-disable-next-line no-underscore-dangle
    //     const alertStatusDesc = clickData._origin.label;
    //     router.push(`/homepage/Approval-Process-Center?alertOwnerId=
    // ${alertOwnerId}&alertStatusDesc=${alertStatusDesc}`);
    //   }
    // });
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
      myAlertData,
    } = this.props;

    const { alertState, textActive, approvalState, approvalTextActive, targetData } = this.state;

    return (
      <div>
        <div className={styles.homepage}>
          <Tabs defaultActiveKey="1" onChange={this.onTabsChange}>
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
                            dataSource={myAlertData}
                            renderItem={item => (
                              <List.Item>
                                <span
                                  title={item.alertDesc}
                                  className={styles.description}
                                  style={{ maxWidth: 500 }}
                                >
                                  {item.alertDesc}
                                </span>
                                <span className={styles.date}>
                                  {/* {item.updateTime} */}
                                  {moment(item.updateTime).format(dateFormat)}
                                </span>
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
                            dataSource={[{}, {}, {}]}
                            renderItem={() => (
                              <List.Item>
                                <span title="" className={styles.description}>
                                  NO. matches withexisting A/C NO. , with discrepancy in prA/C
                                </span>
                                <span className={styles.date}>12/Nov/2019</span>
                                <span className={classNames(styles.user, styles.yellow)}>TC</span>
                              </List.Item>
                            )}
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
                    <h3 className={styles.groupTitle}>
                      Information
                      <span
                        className={styles.more}
                        onClick={() => {
                          router.push('/homepage/information');
                        }}
                      >
                        More
                      </span>
                    </h3>
                    <List
                      itemLayout="horizontal"
                      dataSource={informationData}
                      renderItem={item => (
                        <List.Item>
                          <span className={styles.icon}>
                            <IconFont type="icon-sound" />
                          </span>
                          <span
                            title={item.informationDetail}
                            className="description"
                            onClick={() => {
                              router.push(
                                `/homepage/information?informationNo=${item.informationNo}`,
                              );
                            }}
                          >
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
                            approvalState === 'ALL' ? styles.buttonActive : '',
                          )}
                          onClick={() => {
                            this.setState(
                              {
                                approvalState: 'ALL',
                              },
                              () => {
                                this.renderApprovalAllChart(allAlterData);
                              },
                            );
                          }}
                        >
                          ALL
                        </span>
                        <span
                          className={classNames(
                            styles.switchButton,
                            approvalState === 'PER' ? styles.buttonActive : '',
                          )}
                          onClick={() => {
                            this.setState(
                              {
                                approvalState: 'PER',
                              },
                              () => {
                                this.renderApprovalPerChart();
                                this.renderApprovalPerPieChart();
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
                            approvalTextActive === 'Today' ? styles.textActive : '',
                          )}
                          onClick={() => {
                            this.setState({
                              approvalTextActive: 'Today',
                            });
                          }}
                        >
                          Today
                        </span>
                        <span
                          className={classNames(
                            styles.text,
                            approvalTextActive === 'Week' ? styles.textActive : '',
                          )}
                          onClick={() => {
                            this.setState({
                              approvalTextActive: 'Week',
                            });
                          }}
                        >
                          This Week
                        </span>
                        <RangePicker format="DD-MM-YYYY" />
                      </div>
                    </div>
                    {/* ALTER ALL */}
                    {approvalState === 'ALL' && (
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
                        <div id="ApprovalAll" style={{ minHeight: 250 }}></div>
                      </>
                    )}
                    {/* ALTER PERSONAL */}
                    {approvalState === 'PER' && (
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
                        <div
                          style={{
                            display: 'flex',
                          }}
                        >
                          <div id="ApprovalPersonal" style={{ flex: 3, minHeight: 250 }}></div>
                          <div id="ApprovalPersonalPie" style={{ flex: 2, minHeight: 250 }}></div>
                        </div>
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
                            dataSource={myAlertData}
                            renderItem={item => (
                              <List.Item>
                                <span title={item.alertDesc} className={styles.description}>
                                  {item.alertDesc}
                                </span>
                                <span className={styles.date}>
                                  {/* {item.updateTime} */}
                                  {moment(item.updateTime).format(dateFormat)}
                                </span>
                                <span className={classNames(styles.user, styles.yellow)}>TC</span>
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
                            dataSource={[{}, {}, {}]}
                            renderItem={() => (
                              <List.Item>
                                <span title="" className={styles.description}>
                                  NO. matches withexisting A/C NO. , with discrepancy in prA/C
                                </span>
                                <span className={styles.date}>12/Nov/2019</span>
                                <span className={classNames(styles.user, styles.yellow)}>TC</span>
                              </List.Item>
                            )}
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
                    <h3 className={styles.groupTitle}>
                      Information
                      <span
                        className={styles.more}
                        onClick={() => {
                          router.push('/homepage/information');
                        }}
                      >
                        More
                      </span>
                    </h3>
                    <List
                      itemLayout="horizontal"
                      dataSource={informationData}
                      renderItem={item => (
                        <List.Item>
                          <span className={styles.icon}>
                            <IconFont type="icon-sound" />
                          </span>
                          <span
                            title={item.informationDetail}
                            className="description"
                            onClick={() => {
                              router.push(
                                `/homepage/information?informationNo=${item.informationNo}`,
                              );
                            }}
                          >
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
            {/* DASHBOARD */}
            <TabPane tab="DASHBOARD" key="3">
              暂未开发
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
