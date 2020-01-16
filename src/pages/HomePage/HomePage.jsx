import React, { PureComponent } from 'react';
import G2 from '@antv/g2';
import moment from 'moment';
import { Tabs, DatePicker, List, Row, Col, Empty } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';

import { timestampFormat } from '@/pages/DataImportLog/constants';
import IconFont from '@/components/IconFont';
// import ring from '@/assets/images/ring.png';

import styles from './HomePage.less';
import QuickMenu from './QuickMenu';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

let interval;

@connect(({ allAlert, perAlert, information, dashboard, approval, refresh }) => ({
  allAlterData: allAlert.allAlterData, // all alert的图表数据
  allAlertCount: allAlert.allAlertCount, // all alert总数
  allOutstandingALertCount: allAlert.allOutstandingALertCount, // 全部未认领的alert的总数
  allClaimAlertCount: allAlert.allClaimAlertCount, // 全部已认领的alert总数
  allProcessingAlertCount: allAlert.allProcessingAlertCount, // 全部处理中的alert总数
  perClaimAlertCount: perAlert.perClaimAlertCount, //  personal Claim alert 总数
  perProcessingAlertCount: perAlert.perProcessingAlertCount, // personal Processing alert 总数
  perAlertData: perAlert.perAlertData, // Personal Alert 图表数据
  informationData: information.informationData, // information table Data
  myAlertData: perAlert.myAlertData, // My Alert 的表格数据
  fileCountData: dashboard.fileCountData, // submission status 图表数据
  marketData: dashboard.marketData, // 全部 marketData 图表数据
  marketDataByCategory: dashboard.marketDataByCategory, // 单个marketData图表数据
  processingStageData: dashboard.processingStageData, //
  // lateReportFileCount: dashboard.lateReportFileCount, //
  // outstandingReportFileCount: dashboard.outstandingReportFileCount, //
  reportFilesData: dashboard.reportFilesData,
  outstandingCasesData: dashboard.outstandingCasesData,
  allApprovalData: approval.allApprovalData, // 全部流程图表相关数据
  perApprovalData: approval.perApprovalData, // 个人流程相关数据
  allTaskData: approval.allTaskData, // my Task表格数据
  refreshTime: refresh.refreshTime, // 刷新时间
}))
export default class HomePage extends PureComponent {
  state = {
    alertState: 'ALL', // ALERT切换按钮
    textActive: 'Today', // ALERT today this week切换
    approvalState: 'ALL', // APPROVAL PROCESS切换按钮
    approvalTextActive: 'Today', // APPROVAL PROCESS today this week切换
    targetData: [], // 快捷菜单
    renderProcess: true, // 是否渲染
    renderDashboard: true, // 是否渲染
    activeKey: '1', // pending task在哪个页面
    startDate: moment().format('YYYYMMDD'), // alert查询的开始时间
    endDate: moment().format('YYYYMMDD'), // alert查询的截至时间
    proStartDate: moment().format('YYYYMMDD'), // approval查询的开始时间
    proEndDate: moment().format('YYYYMMDD'), // approval查询的截至时间

    // 首页的全部图表
    alterAllChart: '',
    alterPersonalChart: '',
    approvalAllChart: '',
    approvalPersonalChart: '',
    approvalPersonalPieChart: '',
    submissionStatusPieChart: '',
    submissionStatusBarChart: '',
    marketPieChart: '',
    marketRoseChart: '',
    outstandingCasesLineChart: '',
    processingStageBarChart: '',

    otherChart1: '',
    otherChart2: '',
    otherChart3: '',
    otherChart4: '',
    otherChart5: '',
    otherChart6: '',
    otherChart7: '',
    otherChart8: '',

    isRenderAlterAllChart: true,
    isRenderAlterPersonalChart: true,
    isRenderApprovalAllChart: true,
    isRenderApprovalPersonalChart: true,
    isRenderSubmissionStatusPieChart: true,
    isRenderMarketPieChart: true,

    visible: {
      quickMenu: false,
    },
  };

  componentDidMount() {
    const { startDate, endDate, proStartDate, proEndDate } = this.state;
    // 初始alert参数
    const alertParams = {
      startDate,
      endDate,
    };
    // 初始approval参数
    const proParams = {
      startDate: proStartDate,
      endDate: proEndDate,
    };
    const { dispatch } = this.props;
    // 获取All alert 条形图数据
    dispatch({
      type: 'allAlert/getAllAlterData',
      payload: {
        ...alertParams,
      },
      callback: data => {
        this.renderAlterAllChart(data);
      },
    });
    // 获取个人 alert柱状图数据
    dispatch({
      type: 'perAlert/getPerAlertData',
      payload: {
        ...alertParams,
      },
    });
    // 获取alert 统计数据
    this.getAlertData1(alertParams);
    // 获取alert表格的数据
    dispatch({
      type: 'perAlert/getMyAlert',
      payload: {
        pageNumber: 1,
        pageSize: 4,
        dataTable: 'SLOP_BIZ.V_ALERT_CENTER',
      },
    });
    // 获取ALL Task表格数据
    dispatch({
      type: 'approval/getAllTask',
      payload: {
        pageNumber: '1',
        pageSize: '4',
        type: 'all',
        taskCode: '',
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
    // 获取information 列表数据
    dispatch({
      type: 'information/getInformation',
      payload: {
        pageNumber: 1,
        pageSize: 4,
        dataTable: 'SLOP_BIZ.V_INFO',
      },
    });
    // 获取approval process全部数据
    dispatch({
      type: 'approval/getAllApproval',
      payload: {
        ...proParams,
      },
    });
    // 获取approval process个人数据
    dispatch({
      type: 'approval/getPerApproval',
      payload: {
        ...proParams,
      },
    });
    // 获取dashboard相关数据
    dispatch({
      type: 'dashboard/getFileCountByDate',
      payload: {},
    });
    dispatch({
      type: 'dashboard/getOutstandingCasesData',
      payload: {},
    });
    dispatch({
      type: 'dashboard/getMarketData',
      payload: {},
    });
    dispatch({
      type: 'dashboard/getMarketDataByCategory',
      payload: {
        market: 'HKFE',
      },
    });
    dispatch({
      type: 'dashboard/getProcessingStageData',
      payload: {},
    });

    // 刷新
    dispatch({
      type: 'refresh/getRefreshTime',
      payload: {
        parameterKey: 'home.page.refresh',
        pageNumber: '1',
        pageSize: '1',
      },
      callback: time => {
        this.refreshPage(time);
      },
    });
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  quickMenuCallback = values => {
    const targetData = this.TreeFolderTrans(values);
    this.setState({
      targetData,
    });
  };

  refreshPage = value => {
    interval = setInterval(() => {
      const { dispatch } = this.props;
      const { startDate, endDate, proStartDate, proEndDate } = this.state;
      // 初始alert参数
      const alertParams = {
        startDate,
        endDate,
      };
      // 初始approval参数
      const proParams = {
        startDate: proStartDate,
        endDate: proEndDate,
      };
      // 获取All alert 条形图数据
      dispatch({
        type: 'allAlert/getAllAlterData',
        payload: {
          ...alertParams,
        },
        callback: data => {
          if (this.state.alterAllChart) {
            this.state.alterAllChart.clear();
            this.renderAlterAllChart(data);
          }
        },
      });
      // 获取个人 alert柱状图数据
      dispatch({
        type: 'perAlert/getPerAlertData',
        payload: {
          ...alertParams,
        },
        callback: () => {
          if (this.state.alterPersonalChart) {
            this.state.alterPersonalChart.clear();
            this.renderAlterPerChart();
          }
        },
      });
      // 获取alert 统计数据
      this.getAlertData(alertParams);
      // 获取alert表格的数据
      dispatch({
        type: 'perAlert/getMyAlert',
        payload: {
          pageNumber: 1,
          pageSize: 4,
          dataTable: 'SLOP_BIZ.V_ALERT_CENTER',
        },
      });
      // 获取ALL Task表格数据
      dispatch({
        type: 'approval/getAllTask',
        payload: {
          pageNumber: '1',
          pageSize: '4',
          type: 'all',
          taskCode: '',
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
      // 获取information 列表数据
      dispatch({
        type: 'information/getInformation',
        payload: {
          pageNumber: 1,
          pageSize: 4,
          dataTable: 'SLOP_BIZ.V_INFO',
        },
      });
      this.getApprovalData(proParams);
      // 获取dashboard相关数据
      dispatch({
        type: 'dashboard/getFileCountByDate',
        payload: {},
        callback: () => {
          if (this.state.submissionStatusPieChart) {
            this.state.submissionStatusPieChart.clear();
            this.renderSubmissionStatusPieChart();
          }
          if (this.state.submissionStatusBarChart) {
            this.state.submissionStatusBarChart.clear();
            this.renderSubmissionStatusBarChart();
          }
        },
      });
      dispatch({
        type: 'dashboard/getOutstandingCasesData',
        payload: {},
        callback: () => {
          if (this.state.outstandingCasesLineChart) {
            this.state.outstandingCasesLineChart.clear();
            this.renderOutstandingCasesLineChart();
          }
        },
      });
      dispatch({
        type: 'dashboard/getMarketData',
        payload: {},
        callback: () => {
          if (this.state.marketPieChart) {
            this.state.marketPieChart.clear();
            this.renderMarketPieChart();
          }
        },
      });
      dispatch({
        type: 'dashboard/getMarketDataByCategory',
        payload: {
          market: 'HKFE',
        },
        callback: () => {
          if (this.state.marketRoseChart) {
            this.state.marketRoseChart.clear();
            this.renderMarketRoseChart();
          }
        },
      });
      dispatch({
        type: 'dashboard/getProcessingStageData',
        payload: {},
        callback: () => {
          if (this.state.processingStageBarChart) {
            this.state.processingStageBarChart.clear();
            this.renderProcessingStageBarChart();
          }
        },
      });
    }, value * 1000);
  };

  // 显示关闭抽屉
  toggleModal = key => {
    const { visible } = this.state;
    this.setState({
      visible: {
        ...visible,
        [key]: !visible[key],
      },
    });
  };

  // 根据日期选择更新approval的数据
  getApprovalData = (params = {}) => {
    const { dispatch } = this.props;
    // 获取approval process全部数据
    dispatch({
      type: 'approval/getAllApproval',
      payload: {
        ...params,
      },
      callback: () => {
        if (this.state.approvalAllChart) {
          this.state.approvalAllChart.clear();
          this.renderApprovalAllChart();
        }
        if (this.state.otherChart5) {
          this.state.otherChart5.clear();
          this.renderOtherChart5();
        }
        if (this.state.otherChart6) {
          this.state.otherChart6.clear();
          this.renderOtherChart6();
        }
      },
    });
    // 获取approval process个人数据
    dispatch({
      type: 'approval/getPerApproval',
      payload: {
        ...params,
      },
      callback: () => {
        if (this.state.approvalPersonalChart) {
          this.state.approvalPersonalChart.clear();
          this.renderApprovalPerChart();
        }
        if (this.state.approvalPersonalPieChart) {
          this.state.approvalPersonalPieChart.clear();
          this.renderApprovalPerPieChart();
        }
        if (this.state.otherChart7) {
          this.state.otherChart7.clear();
          this.renderOtherChart7();
        }
        if (this.state.otherChart8) {
          this.state.otherChart8.clear();
          this.renderOtherChart8();
        }
      },
    });
  };

  // 获取alert相关数据
  getAlertData1 = (params = {}) => {
    const { dispatch } = this.props;
    // 获取All alert total
    dispatch({
      type: 'allAlert/getAllAlertCount',
      payload: {
        ...params,
      },
      callback: () => {
        // 获取All Claim alert total
        dispatch({
          type: 'allAlert/getAllClaimAlertCount',
          payload: {
            ...params,
            isClaimed: 1,
          },
          callback: () => {
            this.renderOtherChart1();
          },
        });
        // 获取All processing alert total
        dispatch({
          type: 'allAlert/getAllProcessingAlertCount',
          payload: {
            ...params,
          },
          callback: () => {
            this.renderOtherChart2();
          },
        });
      },
    });
    // 获取All outstanding alert total
    dispatch({
      type: 'allAlert/getAllOutstandingALertCount',
      payload: {
        ...params,
        isClaimed: 0,
      },
    });
    // 获取个人 Alert Claim total
    dispatch({
      type: 'perAlert/getPerClaimAlertCount',
      payload: {
        ...params,
        isPersonal: '1',
      },
    });
    // 获取个人 Alert processing total
    dispatch({
      type: 'perAlert/getPerProcessingAlertCount',
      payload: {
        ...params,
      },
    });
  };

  // 获取alert相关数据
  getAlertData = (params = {}) => {
    const { dispatch } = this.props;
    // 获取All alert total
    dispatch({
      type: 'allAlert/getAllAlertCount',
      payload: {
        ...params,
      },
      callback: () => {
        // 获取All Claim alert total
        dispatch({
          type: 'allAlert/getAllClaimAlertCount',
          payload: {
            ...params,
            isClaimed: 1,
          },
          callback: () => {
            if (this.state.otherChart1) {
              this.state.otherChart1.clear();
              this.renderOtherChart1();
            }
          },
        });
        // 获取All processing alert total
        dispatch({
          type: 'allAlert/getAllProcessingAlertCount',
          payload: {
            ...params,
          },
          callback: () => {
            if (this.state.otherChart2) {
              this.state.otherChart2.clear();
              this.renderOtherChart2();
            }
          },
        });
        // 获取个人 Alert Claim total
        dispatch({
          type: 'perAlert/getPerClaimAlertCount',
          payload: {
            ...params,
            isPersonal: '1',
          },
          callback: () => {
            if (this.state.otherChart3) {
              this.state.otherChart3.clear();
              this.renderOtherChart3();
            }
          },
        });
        // 获取个人 Alert processing total
        dispatch({
          type: 'perAlert/getPerProcessingAlertCount',
          payload: {
            ...params,
          },
          callback: () => {
            if (this.state.otherChart4) {
              this.state.otherChart4.clear();
              this.renderOtherChart4();
            }
          },
        });
      },
    });
    // 获取All outstanding alert total
    dispatch({
      type: 'allAlert/getAllOutstandingALertCount',
      payload: {
        ...params,
        isClaimed: 0,
      },
    });
  };

  // 获取alert图表相关数据
  getAlertDataByDate = (params = {}) => {
    const { dispatch } = this.props;
    // 获取All alert 条形图数据
    dispatch({
      type: 'allAlert/getAllAlterData',
      payload: {
        ...params,
      },
      callback: data => {
        if (this.state.alterAllChart) {
          this.state.alterAllChart.clear();
          this.renderAlterAllChart(data);
        }
      },
    });
    dispatch({
      type: 'perAlert/getPerAlertData',
      payload: {
        ...params,
      },
      callback: () => {
        if (this.state.alterPersonalChart) {
          this.state.alterPersonalChart.clear();
          this.renderAlterPerChart();
        }
      },
    });
    this.getAlertData(params);
  };

  // tabs 切换
  onTabsChange = activeKey => {
    const { renderProcess, renderDashboard } = this.state;
    if (activeKey === '2') {
      setTimeout(() => {
        if (document.getElementById('ApprovalAll') && renderProcess) {
          this.renderApprovalAllChart();
          this.renderOtherChart5();
          this.renderOtherChart6();
          this.setState({
            renderProcess: false,
          });
        }
      }, 0);
    }
    if (activeKey === '3') {
      setTimeout(() => {
        if (renderDashboard) {
          this.renderSubmissionStatusPieChart();
          this.renderSubmissionStatusBarChart();
          this.renderMarketPieChart();
          this.renderMarketRoseChart();
          this.renderProcessingStageBarChart();
          this.renderOutstandingCasesLineChart();
          this.setState({
            renderDashboard: false,
          });
        }
      }, 0);
    }
  };

  // 接口菜单数据转化为Ant Tree所需数据
  TreeFolderTrans = value => {
    const dataList = [];
    value.forEach(item => {
      if (item.children) {
        // eslint-disable-next-line no-param-reassign
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

  compare = key => (value1, value2) => {
    const val1 = value1[key];
    const val2 = value2[key];
    return val2 - val1;
  };

  renderOtherChart1 = () => {
    const { allAlertCount, allClaimAlertCount } = this.props;
    let otherChart1;
    if (this.state.otherChart1) {
      // eslint-disable-next-line prefer-destructuring
      otherChart1 = this.state.otherChart1;
    } else {
      otherChart1 = new G2.Chart({
        container: 'otherChart1',
        forceFit: true, // 是否自适应宽度
        height: 70,
        padding: 0,
      });
    }
    const data = [
      {
        gender: 'a',
        value:
          allAlertCount === 0 ? 0 : Number((allClaimAlertCount / allAlertCount).toFixed(2)) * 100,
      },
    ];
    otherChart1.source(data, {
      value: {
        min: 0,
        max: 100,
      },
    });
    otherChart1.legend(false);
    otherChart1.axis(false);
    otherChart1.tooltip(false);
    otherChart1
      .interval()
      .position('gender*value')
      .color('gender')
      .shape('liquid-fill-gauge')
      .style({
        lineWidth: 1.5,
        opacity: 0.75,
      });
    data.forEach(row => {
      otherChart1.guide().text({
        top: true,
        position: {
          gender: row.gender,
          value: 50,
        },
        content: `${row.value.toFixed()}%`,
        style: {
          opacity: 0.75,
          fontSize: 12,
          fill: '#fff',
          textAlign: 'center',
        },
      });
    });
    otherChart1.render();
    this.setState({ otherChart1 });
  };

  renderOtherChart2 = () => {
    const { allAlertCount, allProcessingAlertCount } = this.props;
    let otherChart2;
    if (this.state.otherChart2) {
      // eslint-disable-next-line prefer-destructuring
      otherChart2 = this.state.otherChart2;
    } else {
      otherChart2 = new G2.Chart({
        container: 'otherChart2',
        forceFit: true, // 是否自适应宽度
        height: 70,
        padding: 0,
      });
    }
    const data = [
      {
        gender: '',
        value:
          allAlertCount === 0
            ? 0
            : Number((allProcessingAlertCount / allAlertCount).toFixed(2)) * 100,
      },
    ];
    otherChart2.source(data, {
      value: {
        min: 0,
        max: 100,
      },
    });
    otherChart2.legend(false);
    otherChart2.axis(false);
    otherChart2.tooltip(false);
    otherChart2
      .interval()
      .position('gender*value')
      .color('gender', ['#F4394E'])
      .shape('liquid-fill-gauge')
      .style({
        lineWidth: 1.5,
        opacity: 0.75,
      });
    data.forEach(row => {
      otherChart2.guide().text({
        top: true,
        position: {
          gender: row.gender,
          value: 50,
        },
        content: `${row.value.toFixed()}%`,
        style: {
          opacity: 0.75,
          fontSize: 12,
          fill: '#fff',
          textAlign: 'center',
        },
      });
    });
    otherChart2.render();
    this.setState({ otherChart2 });
  };

  renderOtherChart3 = () => {
    const { allAlertCount, perClaimAlertCount } = this.props;
    let otherChart3;
    if (this.state.otherChart3) {
      // eslint-disable-next-line prefer-destructuring
      otherChart3 = this.state.otherChart3;
    } else {
      otherChart3 = new G2.Chart({
        container: 'otherChart3',
        forceFit: true, // 是否自适应宽度
        height: 70,
        padding: 0,
      });
    }
    const data = [
      {
        gender: '',
        value:
          allAlertCount === 0 ? 0 : Number((perClaimAlertCount / allAlertCount).toFixed(2)) * 100,
      },
    ];
    otherChart3.source(data, {
      value: {
        min: 0,
        max: 100,
      },
    });
    otherChart3.legend(false);
    otherChart3.axis(false);
    otherChart3.tooltip(false);
    otherChart3
      .interval()
      .position('gender*value')
      .color('gender')
      .shape('liquid-fill-gauge')
      .style({
        lineWidth: 1.5,
        opacity: 0.75,
      });
    data.forEach(row => {
      otherChart3.guide().text({
        top: true,
        position: {
          gender: row.gender,
          value: 50,
        },
        content: `${row.value.toFixed()}%`,
        style: {
          opacity: 0.75,
          fontSize: 12,
          fill: '#fff',
          textAlign: 'center',
        },
      });
    });
    otherChart3.render();
    this.setState({ otherChart3 });
  };

  renderOtherChart4 = () => {
    const { allAlertCount, perProcessingAlertCount } = this.props;
    let otherChart4;
    if (this.state.otherChart4) {
      // eslint-disable-next-line prefer-destructuring
      otherChart4 = this.state.otherChart4;
    } else {
      otherChart4 = new G2.Chart({
        container: 'otherChart4',
        forceFit: true, // 是否自适应宽度
        height: 70,
        padding: 0,
      });
    }
    const data = [
      {
        gender: '',
        value:
          allAlertCount === 0
            ? 0
            : Number((perProcessingAlertCount / allAlertCount).toFixed(2)) * 100,
      },
    ];
    otherChart4.source(data, {
      value: {
        min: 0,
        max: 100,
      },
    });
    otherChart4.legend(false);
    otherChart4.axis(false);
    otherChart4.tooltip(false);
    otherChart4
      .interval()
      .position('gender*value')
      .color('gender', ['#F4394E'])
      .shape('liquid-fill-gauge')
      .style({
        lineWidth: 1.5,
        opacity: 0.75,
      });
    data.forEach(row => {
      otherChart4.guide().text({
        top: true,
        position: {
          gender: row.gender,
          value: 50,
        },
        content: `${row.value.toFixed()}%`,
        style: {
          opacity: 0.75,
          fontSize: 12,
          fill: '#fff',
          textAlign: 'center',
        },
      });
    });
    otherChart4.render();
    this.setState({ otherChart4 });
  };

  renderOtherChart5 = () => {
    const { allApprovalData } = this.props;
    let otherChart5;
    if (this.state.otherChart5) {
      // eslint-disable-next-line prefer-destructuring
      otherChart5 = this.state.otherChart5;
    } else {
      otherChart5 = new G2.Chart({
        container: 'otherChart5',
        forceFit: true, // 是否自适应宽度
        height: 70,
        padding: 0,
      });
    }
    let num = 0;
    if (allApprovalData[0] && allApprovalData[0].allTotalNum !== 0) {
      num =
        Number((allApprovalData[0].allClaimedNum / allApprovalData[0].allTotalNum).toFixed(2)) *
        100;
    }
    const data = [
      {
        gender: '',
        value: num,
      },
    ];
    otherChart5.source(data, {
      value: {
        min: 0,
        max: 100,
      },
    });
    otherChart5.legend(false);
    otherChart5.axis(false);
    otherChart5.tooltip(false);
    otherChart5
      .interval()
      .position('gender*value')
      .color('gender')
      .shape('liquid-fill-gauge')
      .style({
        lineWidth: 1.5,
        opacity: 0.75,
      });
    data.forEach(row => {
      otherChart5.guide().text({
        top: true,
        position: {
          gender: row.gender,
          value: 50,
        },
        content: `${row.value.toFixed()}%`,
        style: {
          opacity: 0.75,
          fontSize: 12,
          fill: '#fff',
          textAlign: 'center',
        },
      });
    });
    otherChart5.render();
    this.setState({ otherChart5 });
  };

  renderOtherChart6 = () => {
    const { allApprovalData } = this.props;
    let otherChart6;
    if (this.state.otherChart6) {
      // eslint-disable-next-line prefer-destructuring
      otherChart6 = this.state.otherChart6;
    } else {
      otherChart6 = new G2.Chart({
        container: 'otherChart6',
        forceFit: true, // 是否自适应宽度
        height: 70,
        padding: 0,
      });
    }
    let num = 0;
    if (allApprovalData[0] && allApprovalData[0].allTotalNum !== 0) {
      num =
        Number((allApprovalData[0].allProcessingNum / allApprovalData[0].allTotalNum).toFixed(2)) *
        100;
    }
    const data = [
      {
        gender: '',
        value: num,
      },
    ];
    otherChart6.source(data, {
      value: {
        min: 0,
        max: 100,
      },
    });
    otherChart6.legend(false);
    otherChart6.axis(false);
    otherChart6.tooltip(false);
    otherChart6
      .interval()
      .position('gender*value')
      .color('gender', ['#F4394E'])
      .shape('liquid-fill-gauge')
      .style({
        lineWidth: 1.5,
        opacity: 0.75,
      });
    data.forEach(row => {
      otherChart6.guide().text({
        top: true,
        position: {
          gender: row.gender,
          value: 50,
        },
        content: `${row.value.toFixed()}%`,
        style: {
          opacity: 0.75,
          fontSize: 12,
          fill: '#fff',
          textAlign: 'center',
        },
      });
    });
    otherChart6.render();
    this.setState({ otherChart6 });
  };

  renderOtherChart7 = () => {
    const { perApprovalData } = this.props;
    let otherChart7;
    if (this.state.otherChart7) {
      // eslint-disable-next-line prefer-destructuring
      otherChart7 = this.state.otherChart7;
    } else {
      otherChart7 = new G2.Chart({
        container: 'otherChart7',
        forceFit: true, // 是否自适应宽度
        height: 70,
        padding: 0,
      });
    }
    let num = 0;
    if (perApprovalData[0] && perApprovalData[0].allTotalNum !== 0) {
      num =
        Number((perApprovalData[0].myClaimedNum / perApprovalData[0].allTotalNum).toFixed(2)) * 100;
    }
    const data = [
      {
        gender: '',
        value: num,
      },
    ];
    otherChart7.source(data, {
      value: {
        min: 0,
        max: 100,
      },
    });
    otherChart7.legend(false);
    otherChart7.axis(false);
    otherChart7.tooltip(false);
    otherChart7
      .interval()
      .position('gender*value')
      .color('gender')
      .shape('liquid-fill-gauge')
      .style({
        lineWidth: 1.5,
        opacity: 0.75,
      });
    data.forEach(row => {
      otherChart7.guide().text({
        top: true,
        position: {
          gender: row.gender,
          value: 50,
        },
        content: `${row.value.toFixed()}%`,
        style: {
          opacity: 0.75,
          fontSize: 12,
          fill: '#fff',
          textAlign: 'center',
        },
      });
    });
    otherChart7.render();
    this.setState({ otherChart7 });
  };

  renderOtherChart8 = () => {
    const { perApprovalData } = this.props;
    let otherChart8;
    if (this.state.otherChart8) {
      // eslint-disable-next-line prefer-destructuring
      otherChart8 = this.state.otherChart8;
    } else {
      otherChart8 = new G2.Chart({
        container: 'otherChart8',
        forceFit: true, // 是否自适应宽度
        height: 70,
        padding: 0,
      });
    }
    let num = 0;
    if (perApprovalData[0] && perApprovalData[0].allTotalNum !== 0) {
      num =
        Number((perApprovalData[0].myProcessingNum / perApprovalData[0].allTotalNum).toFixed(2)) *
        100;
    }
    const data = [
      {
        gender: '',
        value: num,
      },
    ];
    otherChart8.source(data, {
      value: {
        min: 0,
        max: 100,
      },
    });
    otherChart8.legend(false);
    otherChart8.axis(false);
    otherChart8.tooltip(false);
    otherChart8
      .interval()
      .position('gender*value')
      .color('gender', ['#F4394E'])
      .shape('liquid-fill-gauge')
      .style({
        lineWidth: 1.5,
        opacity: 0.75,
      });
    data.forEach(row => {
      otherChart8.guide().text({
        top: true,
        position: {
          gender: row.gender,
          value: 50,
        },
        content: `${row.value.toFixed()}%`,
        style: {
          opacity: 0.75,
          fontSize: 12,
          fill: '#fff',
          textAlign: 'center',
        },
      });
    });
    otherChart8.render();
    this.setState({ otherChart8 });
  };

  // 渲染Alter ALL条形图
  renderAlterAllChart = data => {
    // const { startDate, endDate } = this.state;
    // Alter ALL 的条形图
    let alterAllChart;
    if (this.state.alterAllChart) {
      // eslint-disable-next-line prefer-destructuring
      alterAllChart = this.state.alterAllChart;
    } else {
      alterAllChart = new G2.Chart({
        container: 'AlterAll', // div ID
        forceFit: true, // 是否自适应宽度
        height: 250, // 画布高度
        padding: [20, 50, 30, 100], // 上下左右的padding
      });
    }

    let AlterAll = [];
    let count = 0;
    if (data[0]) {
      data.forEach(item => {
        AlterAll.push({
          label: item.userName, // 纵坐标
          type: 'Claimed', // 分类
          value: item.claimedCount, // 已认领数
        });
        if (item.claimedCount > count) {
          count = item.claimedCount;
        }
      });
      data.forEach(item => {
        AlterAll.push({
          label: item.userName, // 纵坐标
          type: 'Processing', // 分类
          value: item.processingCount, // 处理中数
        });
        if (item.claimedCount > count) {
          count = item.processingCount;
        }
      });
      alterAllChart.source(AlterAll, {
        value: {
          // eslint-disable-next-line no-nested-ternary
          max: count < 5 ? 5 : count < 10 ? 10 : count + 5,
        },
      });
      alterAllChart.legend({
        position: 'top-center', // 设置图例的显示位置
        label: {
          color: '#464C51', // 图例的字体颜色
          fontSize: 12,
        },
        marker: 'square',
      });
      // 柱图value坐标
      alterAllChart.axis('value', {
        position: 'right',
        label: {
          color: '#464C51',
          fontSize: 12,
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
          fontSize: 12,
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
            fill: '#7F91A4',
            fontSize: 11,
          },
          offset: 2,
        })
        .style({
          lineWidth: 1,
        })
        // eslint-disable-next-line consistent-return
        // .size('', () => {
        //   if (AlterAll.length / 2 < 5) {
        //     return 15;
        //   }
        //   return false;
        // })
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]);
    } else {
      AlterAll = [
        { label: 'Thomas.', type: 'Claimed', value: 4 },
        { label: 'Thomas.', type: 'Processing', value: 3 },
        { label: 'Alan.', type: 'Claimed', value: 2 },
        { label: 'Alan.', type: 'Processing', value: 2 },
        { label: 'Alex.', type: 'Claimed', value: 3 },
        { label: 'Alex.', type: 'Processing', value: 4 },
      ];
      alterAllChart.source(AlterAll, {
        value: {
          max: 5,
        },
      });
      alterAllChart.legend(false);
      alterAllChart.axis('value', {
        position: 'right',
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
        grid: false,
      });
      alterAllChart.axis('label', {
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
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
        .style({
          lineWidth: 1,
        })
        // eslint-disable-next-line consistent-return
        // .size('', () => {
        //   if (AlterAll.length / 2 < 5) {
        //     return 15;
        //   }
        // })
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]);
    }
    alterAllChart.render();
    if (this.state.isRenderAlterAllChart) {
      alterAllChart.on('interval:click', ev => {
        // alertOwnerId
        const clickData = ev.data;
        if (clickData) {
          // eslint-disable-next-line no-underscore-dangle
          const alertOwnerId = clickData._origin.label;
          // eslint-disable-next-line no-underscore-dangle
          // const alertStatusDesc = clickData._origin.type;
          router.push(
            `/homepage/alert-center?owner=${alertOwnerId}&timestamp=${this.state.startDate},${this.state.endDate}`,
          );
        }
      });
    }
    this.setState({
      alterAllChart,
      isRenderAlterAllChart: false,
    });
  };

  // 渲染Alter Personal条形图
  renderAlterPerChart = () => {
    // const { startDate, endDate } = this.state;
    const { perAlertData } = this.props;
    let alterPersonalChart;
    if (this.state.alterPersonalChart) {
      // eslint-disable-next-line prefer-destructuring
      alterPersonalChart = this.state.alterPersonalChart;
    } else {
      alterPersonalChart = new G2.Chart({
        container: 'AlterPersonal',
        forceFit: true,
        height: 250,
        padding: [10, 50, 30, 100],
      });
    }
    if (
      perAlertData[0] &&
      (perAlertData[0].Claimed !== 0 ||
        perAlertData[0].Finished !== 0 ||
        perAlertData[0].Outstanding !== 0 ||
        perAlertData[0].Processing !== 0)
    ) {
      let count = 0;
      Object.keys(perAlertData[0]).forEach(item => {
        if (perAlertData[0][item] > count) {
          count = perAlertData[0][item];
        }
      });
      const AlterPersonal = [
        { label: 'Outstanding', value: perAlertData[0].Outstanding },
        { label: 'Calimed', value: perAlertData[0].Claimed },
        { label: 'Processing', value: perAlertData[0].Processing },
        { label: 'Finished', value: perAlertData[0].Finished },
      ];
      alterPersonalChart.source(AlterPersonal, {
        value: {
          // eslint-disable-next-line no-nested-ternary
          max: count < 5 ? 5 : count < 10 ? 10 : count + 5,
        },
      });
      alterPersonalChart.legend(false);
      alterPersonalChart.tooltip({
        showTitle: false,
      });
      alterPersonalChart.axis('value', {
        position: 'right',
        label: {
          color: '#464C51',
          fontSize: 12,
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
          fontSize: 12,
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
            fill: '#7F91A4',
            fontSize: 12,
          },
          offset: 10,
        })
        .color('label', ['#10416C', '#F4374C', '#0D87D4', '#36BB3D'])
        .size(20)
        .style({
          lineWidth: 1,
        })
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]);
    } else {
      const AlterPersonal = [
        { label: 'Outstanding', value: 4 },
        { label: 'Calimed', value: 3 },
        { label: 'Processing', value: 2 },
        { label: 'Finished', value: 4 },
      ];
      alterPersonalChart.source(AlterPersonal, {
        value: {
          max: 5,
        },
      });
      alterPersonalChart.legend(false);
      alterPersonalChart.axis('value', {
        position: 'right',
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
        grid: false,
      });
      alterPersonalChart.axis('label', {
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
      });
      alterPersonalChart
        .coord()
        .transpose()
        .scale(1, -1);
      alterPersonalChart
        .interval()
        .position('label*value')
        .color('label', ['#10416C', '#F4374C', '#0D87D4', '#36BB3D'])
        .size(20)
        .style({
          lineWidth: 1,
        })
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]);
    }
    alterPersonalChart.render();
    if (this.state.isRenderAlterPersonalChart) {
      alterPersonalChart.on('interval:click', ev => {
        const clickData = ev.data;
        if (clickData) {
          // eslint-disable-next-line no-underscore-dangle
          const alertOwnerId = localStorage.getItem('loginName');
          // eslint-disable-next-line no-underscore-dangle
          // const alertStatusDesc = clickData._origin.label;
          router.push(
            `/homepage/alert-center?owner=${alertOwnerId}&timestamp=${this.state.startDate},${this.state.endDate}`,
          );
        }
      });
    }
    this.setState({
      alterPersonalChart,
      isRenderAlterPersonalChart: false,
    });
  };

  // 渲染Approval All柱状图
  renderApprovalAllChart = () => {
    // const { proStartDate, proEndDate } = this.state;
    const { allApprovalData } = this.props;
    let approvalAllChart;
    if (this.state.approvalAllChart) {
      // eslint-disable-next-line prefer-destructuring
      approvalAllChart = this.state.approvalAllChart;
    } else {
      approvalAllChart = new G2.Chart({
        container: 'ApprovalAll',
        forceFit: true,
        height: 250,
        padding: [30, 100, 30, 50],
      });
    }
    if (allApprovalData[0] && allApprovalData[0].userInfo && allApprovalData[0].userInfo[0]) {
      const { userInfo } = allApprovalData[0];
      const ApprovalAll = [];
      let count = 0;
      userInfo.forEach(item => {
        ApprovalAll.push({
          label: item.userId,
          type: 'Claimed',
          value: item.userClaimedNum,
        });
        if (item.userClaimedNum > count) {
          count = item.userClaimedNum;
        }
      });
      userInfo.forEach(item => {
        ApprovalAll.push({
          label: item.userId,
          type: 'Processing',
          value: item.userProcessingNum,
        });
        if (item.userProcessingNum > count) {
          count = item.userProcessingNum;
        }
      });
      approvalAllChart.source(ApprovalAll, {
        value: {
          // eslint-disable-next-line no-nested-ternary
          max: count < 5 ? 5 : count < 10 ? 10 : count + 5,
        },
      });
      approvalAllChart.legend({
        position: 'top-center', // 设置图例的显示位置
        label: {
          color: '#464C51',
          fontSize: 12,
        },
        marker: 'square',
        offset: 10,
      });
      approvalAllChart.axis('value', {
        position: 'left',
        label: {
          color: '#464C51',
          fontSize: 12,
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
          fontSize: 12,
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
            fill: '#7F91A4',
            fontSize: 12,
          },
          offset: 10,
        })
        .size(25)
        .style({
          lineWidth: 1,
        })
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]);
    } else {
      const ApprovalAll = [
        { label: 'Thomas.', type: 'Claimed', value: 4 },
        { label: 'Thomas.', type: 'Processing', value: 3 },
        { label: 'Alan.', type: 'Claimed', value: 2 },
        { label: 'Alan.', type: 'Processing', value: 2 },
        { label: 'Alex.', type: 'Claimed', value: 3 },
        { label: 'Alex.', type: 'Processing', value: 4 },
      ];
      approvalAllChart.source(ApprovalAll, {
        value: {
          max: 5,
        },
      });
      approvalAllChart.legend(false);
      approvalAllChart.axis('value', {
        position: 'left',
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
        grid: false,
      });
      approvalAllChart.axis('label', {
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
      });
      approvalAllChart
        .interval()
        .position('label*value')
        .color('type', ['#F4374C', '#0D87D4'])
        .size(25)
        .style({
          lineWidth: 1,
        })
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]);
    }
    approvalAllChart.render();
    if (this.state.isRenderApprovalAllChart) {
      approvalAllChart.on('interval:click', ev => {
        // alertOwnerId
        const clickData = ev.data;
        if (clickData) {
          // eslint-disable-next-line no-underscore-dangle
          const alertOwnerId = clickData._origin.label;
          // eslint-disable-next-line no-underscore-dangle
          // const alertStatusDesc = clickData._origin.type;
          router.push(
            `/homepage/Approval-Process-Center?owner=${alertOwnerId}&tradeDate=${this.state.proStartDate},${this.state.proEndDate}`,
          );
        }
      });
    }
    this.setState({
      approvalAllChart,
      isRenderApprovalAllChart: false,
    });
  };

  // 渲染Approval Personal柱状图
  renderApprovalPerChart = () => {
    // const { proStartDate, proEndDate } = this.state;
    const { perApprovalData } = this.props;
    let approvalPersonalChart;
    if (this.state.approvalPersonalChart) {
      // eslint-disable-next-line prefer-destructuring
      approvalPersonalChart = this.state.approvalPersonalChart;
    } else {
      approvalPersonalChart = new G2.Chart({
        container: 'ApprovalPersonal',
        forceFit: true,
        height: 250,
        padding: [20, 50, 30, 50],
      });
    }
    if (
      perApprovalData[0] &&
      (!!perApprovalData[0].allOutstandingNum ||
        !!perApprovalData[0].myClaimedNum ||
        !!perApprovalData[0].myProcessingNum ||
        !!perApprovalData[0].myFinishedNum)
    ) {
      const keys = {
        allOutstandingNum: '',
        myClaimedNum: '',
        myProcessingNum: '',
        myFinishedNum: '',
      };
      let count = 0;
      Object.keys(keys).forEach(item => {
        if (perApprovalData[0][item] > count) {
          count = perApprovalData[0][item];
        }
      });
      const ApprovalPersonal = [
        { label: 'Outstanding', value: perApprovalData[0].allOutstandingNum },
        { label: 'Calimed', value: perApprovalData[0].myClaimedNum },
        { label: 'Processing', value: perApprovalData[0].myProcessingNum },
        { label: 'Finished', value: perApprovalData[0].myFinishedNum },
      ];
      approvalPersonalChart.source(ApprovalPersonal, {
        value: {
          // eslint-disable-next-line no-nested-ternary
          max: count < 5 ? 5 : count < 10 ? 10 : count + 5,
        },
      });
      approvalPersonalChart.legend(false);
      approvalPersonalChart.tooltip({
        showTitle: false,
      });
      approvalPersonalChart.axis('value', {
        position: 'left',
        label: {
          color: '#464C51',
          fontSize: 12,
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
          fontSize: 12,
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
            fill: '#7F91A4',
            fontSize: 12,
          },
          offset: 10,
        })
        .color('label', ['#10416C', '#F4374C', '#0D87D4', '#36BB3D'])
        .size(20)
        .style({
          lineWidth: 1,
        })
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]);
    } else {
      const ApprovalPersonal = [
        { label: 'Outstanding', value: 4 },
        { label: 'Calimed', value: 3 },
        { label: 'Processing', value: 3 },
        { label: 'Finished', value: 4 },
      ];
      approvalPersonalChart.source(ApprovalPersonal, {
        value: {
          max: 5,
        },
      });
      approvalPersonalChart.legend(false);
      approvalPersonalChart.axis('value', {
        position: 'left',
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
        grid: false,
      });
      approvalPersonalChart.axis('label', {
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
      });
      approvalPersonalChart
        .interval()
        .position('label*value')
        .color('label', ['#10416C', '#F4374C', '#0D87D4', '#36BB3D'])
        .size(20)
        .style({
          lineWidth: 1,
        })
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]);
    }
    approvalPersonalChart.render();
    if (this.state.isRenderApprovalPersonalChart) {
      approvalPersonalChart.on('interval:click', ev => {
        const clickData = ev.data;
        if (clickData) {
          // eslint-disable-next-line no-underscore-dangle
          const alertOwnerId = localStorage.getItem('loginName');
          // eslint-disable-next-line no-underscore-dangle
          // const alertStatusDesc = clickData._origin.label;
          router.push(
            `/homepage/Approval-Process-Center/my?owner=${alertOwnerId}&tradeDate=${this.state.proStartDate},${this.state.proEndDate}`,
          );
        }
      });
    }
    this.setState({
      approvalPersonalChart,
      isRenderApprovalPersonalChart: false,
    });
  };

  // 渲染Approval Personal饼图
  renderApprovalPerPieChart = () => {
    const { perApprovalData } = this.props;
    let approvalPersonalPieChart;
    if (this.state.approvalPersonalPieChart) {
      // eslint-disable-next-line prefer-destructuring
      approvalPersonalPieChart = this.state.approvalPersonalPieChart;
    } else {
      approvalPersonalPieChart = new G2.Chart({
        container: 'ApprovalPersonalPie',
        forceFit: true,
        height: 250,
        padding: [20, 0, 20, 70],
      });
    }
    if (
      perApprovalData[0] &&
      (!!perApprovalData[0].myApprovedNum ||
        !!perApprovalData[0].myRejectedNum ||
        !!perApprovalData[0].myTerminatedNum)
    ) {
      const { myApprovedNum, myRejectedNum, myTerminatedNum } = perApprovalData[0];
      const count = myApprovedNum + myRejectedNum + myTerminatedNum;
      const ApprovalPersonalPie = [
        {
          label: 'Approved',
          value: myApprovedNum,
          percent: Number((myApprovedNum / count).toFixed(4)),
        },
        {
          label: 'Rejected',
          value: myRejectedNum,
          percent: Number((myRejectedNum / count).toFixed(4)),
        },
        {
          label: 'Terminated',
          value: myTerminatedNum,
          percent: Number((myTerminatedNum / count).toFixed(4)),
        },
      ];
      ApprovalPersonalPie.sort(this.compare('value'));
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
        label: {
          color: '#464C51',
          fontSize: 12,
        },
      });
      approvalPersonalPieChart
        .intervalStack()
        .position('percent')
        .label('percent', {
          offset: 10,
          useHtml: true,
          htmlTemplate: val => `<div style="font-size: 12px;">${val}</div>`,
          color: '#464C51',
          fontSize: 12,
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
    } else {
      const ApprovalPersonalPie = [
        {
          label: 'Approved',
          value: 3,
          percent: 0.33,
        },
        {
          label: 'Rejected',
          value: 3,
          percent: 0.33,
        },
        {
          label: 'Terminated',
          value: 3,
          percent: 0.33,
        },
      ];
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
      approvalPersonalPieChart.legend(false);
      approvalPersonalPieChart
        .intervalStack()
        .position('percent')
        .color('label', ['#0D87D4', '#F4374C', '#10416C'])
        .style({
          lineWidth: 1,
          stroke: '#fff',
        });
    }
    approvalPersonalPieChart.render();
    this.setState({ approvalPersonalPieChart });
  };

  // 渲染Submission Status饼图
  renderSubmissionStatusPieChart = () => {
    const { fileCountData } = this.props;
    let submissionStatusPieChart;
    if (this.state.submissionStatusPieChart) {
      // eslint-disable-next-line prefer-destructuring
      submissionStatusPieChart = this.state.submissionStatusPieChart;
    } else {
      submissionStatusPieChart = new G2.Chart({
        container: 'submissionStatusPie',
        forceFit: true,
        height: 330,
        padding: [50, 20, 20, 0],
      });
    }
    let currentTradeDate;
    let lastTradeDate;
    let currentDate;
    let lastDate;
    if (fileCountData[0]) {
      // eslint-disable-next-line prefer-destructuring
      currentTradeDate = fileCountData[0].currentTradeDate;
      // eslint-disable-next-line prefer-destructuring
      lastTradeDate = fileCountData[0].lastTradeDate;
    }
    if (currentTradeDate) {
      // eslint-disable-next-line prefer-destructuring
      currentDate = Object.keys(currentTradeDate)[0];
    }
    if (lastTradeDate) {
      // eslint-disable-next-line prefer-destructuring
      lastDate = Object.keys(lastTradeDate)[0];
    }
    if (
      currentTradeDate &&
      lastTradeDate &&
      currentDate &&
      lastDate &&
      (currentTradeDate[currentDate] !== 0 || lastTradeDate[lastDate] !== 0)
    ) {
      let submissionStatusCount = 0;
      let submissionStatusPie = [];
      submissionStatusCount = currentTradeDate[currentDate] + lastTradeDate[lastDate];
      submissionStatusPie = [
        {
          label: 'Current Trade Day',
          value: currentTradeDate[currentDate],
          percent: Number((currentTradeDate[currentDate] / submissionStatusCount).toFixed(4)),
          date: currentDate,
        },
        {
          label: 'Last Trade Date',
          value: lastTradeDate[lastDate],
          percent: Number((lastTradeDate[lastDate] / submissionStatusCount).toFixed(4)),
          date: lastDate,
        },
      ];
      submissionStatusPie.sort(this.compare('value'));
      submissionStatusPieChart.source(submissionStatusPie, {
        percent: {
          formatter: val => {
            const value = `${(val * 100).toFixed(2)}%`;
            return value;
          },
        },
      });
      submissionStatusPieChart.coord('theta', {
        radius: 0.5,
      });
      // .rotate(90);
      submissionStatusPieChart.tooltip({
        showTitle: false,
      });
      submissionStatusPieChart.legend({
        position: 'top-center',
        marker: 'square',
        label: {
          color: '#464C51',
          fontSize: 12,
        },
      });
      submissionStatusPieChart
        .intervalStack()
        .position('percent')
        .label('percent', {
          useHtml: true,
          htmlTemplate: (val, item) =>
            `<div style="font-size: 12px;">${item.point.value}(${val})</div><div style="font-size: 12px;white-space:nowrap;text-align: center;">${item.point.label}</div>`,
        })
        .tooltip('label*percent', (label, percent) => {
          const value = `${(percent * 100).toFixed(2)}%`;
          return {
            name: label,
            value,
          };
        })
        .color('label', ['#0D87D4', '#F4374C'])
        .style({
          lineWidth: 1,
          stroke: '#fff',
        });
    } else {
      const submissionStatusPie = [
        {
          label: 'Current Trade Day',
          value: 3,
          percent: 0.3,
          date: 20200113,
        },
        {
          label: 'Last Trade Date',
          value: 7,
          percent: 0.7,
          date: 20200110,
        },
      ];
      submissionStatusPieChart.source(submissionStatusPie);
      submissionStatusPieChart.coord('theta', {
        radius: 0.5,
      });
      submissionStatusPieChart.tooltip({
        showTitle: false,
      });
      submissionStatusPieChart.legend(false);
      submissionStatusPieChart
        .intervalStack()
        .position('percent')
        .color('label', ['#0D87D4', '#F4374C'])
        .style({
          lineWidth: 1,
          stroke: '#fff',
        });
    }
    submissionStatusPieChart.render();
    if (this.state.isRenderSubmissionStatusPieChart) {
      submissionStatusPieChart.on('interval:click', ev => {
        const clickData = ev.data;
        if (clickData) {
          // eslint-disable-next-line no-underscore-dangle
          const tradeDate = clickData._origin.date;
          const { dispatch } = this.props;
          dispatch({
            type: 'dashboard/getReportFiles',
            payload: {
              tradeDate,
            },
            callback: () => {
              if (this.state.submissionStatusBarChart) {
                this.state.submissionStatusBarChart.clear();
                this.renderSubmissionStatusBarChart();
              }
            },
          });
          // dispatch({
          //   type: 'dashboard/getOutstandingReportFileCount',
          //   payload: {
          //     tradeDate,
          //   },
          //   callback: () => {
          //     if (this.state.submissionStatusBarChart) {
          //       setTimeout(() => {
          //         if (this.state.submissionStatusBarChart) {
          //           this.state.submissionStatusBarChart.clear();
          //           this.renderSubmissionStatusBarChart();
          //         }
          //       }, 0);
          //     }
          //   },
          // });
          // dispatch({
          //   type: 'dashboard/getLateReportFileCount',
          //   payload: {
          //     tradeDate,
          //   },
          //   callback: () => {
          //     setTimeout(() => {
          //       if (this.state.submissionStatusBarChart) {
          //         this.state.submissionStatusBarChart.clear();
          //         this.renderSubmissionStatusBarChart();
          //       }
          //     }, 0);
          //   },
          // });
        }
      });
    }
    this.setState({
      submissionStatusPieChart,
      isRenderSubmissionStatusPieChart: false,
    });
  };

  // 渲染Submission Status柱图
  renderSubmissionStatusBarChart = () => {
    const { reportFilesData } = this.props;
    let submissionStatusBarChart;
    if (this.state.submissionStatusBarChart) {
      // eslint-disable-next-line prefer-destructuring
      submissionStatusBarChart = this.state.submissionStatusBarChart;
    } else {
      submissionStatusBarChart = new G2.Chart({
        container: 'submissionStatusBar',
        forceFit: true,
        height: 366,
        padding: [100, 20, 45, 70],
      });
    }
    let isRender = false;
    if (reportFilesData[0]) {
      const { lateReportFileCount, outstandingReportFileCount } = reportFilesData[0];
      lateReportFileCount.forEach(item => {
        if (item.count > 0) {
          isRender = true;
        }
      });
      outstandingReportFileCount.forEach(item => {
        if (item.count > 0) {
          isRender = true;
        }
      });
    }
    if (isRender) {
      const { lateReportFileCount, outstandingReportFileCount } = reportFilesData[0];
      const submissionStatusBar = [];
      let count = 0;
      lateReportFileCount.forEach(item => {
        submissionStatusBar.push({
          label: 'Late report',
          value: item.count,
          type: item.market,
        });
        if (item.count > count) {
          // eslint-disable-next-line prefer-destructuring
          count = item.count;
        }
      });
      outstandingReportFileCount.forEach(item => {
        submissionStatusBar.push({
          label: 'Outstanding reports',
          value: item.count,
          type: item.market,
        });
        if (item.count > count) {
          // eslint-disable-next-line prefer-destructuring
          count = item.count;
        }
      });
      submissionStatusBarChart.source(submissionStatusBar, {
        value: {
          // eslint-disable-next-line no-nested-ternary
          max: count < 5 ? 5 : count < 10 ? 10 : count + 5,
        },
      });
      submissionStatusBarChart.legend({
        position: 'top-right', // 设置图例的显示位置
        itemGap: 20, // 图例项之间的间距
        offsetY: -10,
        label: {
          color: '#464C51',
          fontSize: 12,
        },
      });
      submissionStatusBarChart.axis('value', {
        position: 'left',
        label: {
          color: '#464C51',
          fontSize: 12,
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
        title: {
          textStyle: {
            fontSize: 12, // 文本大小
            textAlign: 'center', // 文本对齐方式
            fill: '#e3e3e3', // 文本颜色
          },
          offset: 50,
        },
      });
      submissionStatusBarChart.axis('label', {
        label: {
          offset: 12,
          color: '#464C51',
          fontSize: 12,
        },
        line: {
          lineWidth: 0.5, // 设置线的宽度
        },
        title: {
          textStyle: {
            fontSize: 12, // 文本大小
            textAlign: 'center', // 文本对齐方式
            fill: '#e3e3e3', // 文本颜色
          },
          offset: 30,
        },
      });
      submissionStatusBarChart.scale('value', {
        alias: 'Number Of Reports',
        // eslint-disable-next-line no-nested-ternary
        max: count < 5 ? 5 : count < 10 ? 10 : count + 5,
      });
      submissionStatusBarChart.scale('label', {
        alias: 'Submission Type',
      });
      submissionStatusBarChart
        .interval()
        .position('label*value')
        .color('type', ['#F4374C', '#0D87D4'])
        .label('value', {
          textStyle: {
            fill: '#7F91A4',
            fontSize: 12,
          },
          offset: 10,
        })
        .size(30)
        .style({
          lineWidth: 1,
        })
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]);
    } else {
      const submissionStatusBar = [
        { label: 'Late reports', value: 8, type: 'HKFE' },
        { label: 'Late reports', value: 6, type: 'SEHK' },
        { label: 'Outstanding reports', value: 6, type: 'HKFE' },
        { label: 'Outstanding reports', value: 8, type: 'SEHK' },
      ];
      submissionStatusBarChart.source(submissionStatusBar, {
        value: {
          max: 10,
        },
      });
      submissionStatusBarChart.legend(false);
      submissionStatusBarChart.axis('value', {
        position: 'left',
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
        grid: false,
      });
      submissionStatusBarChart.axis('label', {
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
      });
      submissionStatusBarChart
        .interval()
        .position('label*value')
        .color('type', ['#F4374C', '#0D87D4'])
        .style({
          lineWidth: 1,
        })
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]);
    }
    submissionStatusBarChart.render();
    this.setState({ submissionStatusBarChart });
  };

  // 渲染market饼图
  renderMarketPieChart = () => {
    const { marketData } = this.props;
    let marketPieChart;
    if (this.state.marketPieChart) {
      // eslint-disable-next-line prefer-destructuring
      marketPieChart = this.state.marketPieChart;
    } else {
      marketPieChart = new G2.Chart({
        container: 'marketPie',
        forceFit: true,
        height: 180,
        padding: [10, 5, 10, 5],
      });
    }
    if (marketData[0]) {
      const marketPie = [];
      let marketDataCount = 0;
      marketData.forEach(item => {
        marketDataCount += Number(item.count);
      });
      marketData.forEach(item => {
        marketPie.push({
          label: item.market,
          value: Number(item.count),
          percent:
            marketDataCount === 0
              ? marketDataCount
              : Number((Number(item.count) / marketDataCount).toFixed(4)),
        });
      });
      marketPie.sort(this.compare('value'));
      marketPieChart.source(marketPie, {
        percent: {
          formatter: val => {
            const value = `${(val * 100).toFixed(2)}%`;
            return value;
          },
        },
      });
      marketPieChart.coord('theta', {
        radius: 0.8,
        innerRadius: 0.7,
      });
      marketPieChart.tooltip({
        showTitle: false,
      });
      marketPieChart.legend({
        position: 'left-top',
        marker: 'square',
        offsetX: 10,
        offsetY: 20,
      });
      marketPieChart
        .intervalStack()
        .position('percent')
        .label('percent', {
          useHtml: true,
          htmlTemplate: (val, item) =>
            `<div style="white-space:nowrap;text-align: center;font-size:12px;">(${item.point.label})</div><div style="font-size:12px;">${item.point.value}(${val})</div>`,
        })
        .tooltip('label*percent', (label, percent) => {
          const value = `${(percent * 100).toFixed(2)}%`;
          return {
            name: label,
            value,
          };
        })
        .color('label', ['#10416C', '#0D87D4'])
        .style({
          lineWidth: 1,
          stroke: '#fff',
        });
    } else {
      const marketPie = [
        { label: 'HKFE', value: 1, percent: 0.5 },
        { label: 'SEHK', value: 1, percent: 0.5 },
      ];
      marketPieChart.source(marketPie);
      marketPieChart.coord('theta', {
        radius: 0.8,
        innerRadius: 0.7,
      });
      marketPieChart.tooltip({
        showTitle: false,
      });
      marketPieChart.legend(false);
      marketPieChart
        .intervalStack()
        .position('percent')
        .color('label', ['#10416C', '#0D87D4'])
        .style({
          lineWidth: 1,
          stroke: '#fff',
        });
    }
    marketPieChart.render();
    if (this.state.isRenderMarketPieChart) {
      marketPieChart.on('interval:click', ev => {
        const clickData = ev.data;
        if (clickData) {
          // eslint-disable-next-line no-underscore-dangle
          const market = clickData._origin.label;
          const { dispatch } = this.props;
          dispatch({
            type: 'dashboard/getMarketDataByCategory',
            payload: {
              market,
            },
            callback: () => {
              if (this.state.marketRoseChart) {
                this.state.marketRoseChart.clear();
                this.renderMarketRoseChart();
              }
            },
          });
        }
      });
    }
    this.setState({
      marketPieChart,
      isRenderMarketPieChart: false,
    });
  };

  // 渲染market南丁格尔玫瑰图
  renderMarketRoseChart = () => {
    const { marketDataByCategory } = this.props;
    let marketRoseChart;
    if (this.state.marketRoseChart) {
      // eslint-disable-next-line prefer-destructuring
      marketRoseChart = this.state.marketRoseChart;
    } else {
      marketRoseChart = new G2.Chart({
        container: 'marketRose',
        forceFit: true,
        height: 210,
        padding: [10, 75, 10, 75],
      });
    }
    if (marketDataByCategory[0]) {
      const marketRose = [];
      let count = 0;
      marketDataByCategory.forEach(item => {
        // eslint-disable-next-line no-const-assign
        count += item.count;
      });
      marketDataByCategory.forEach(item => {
        marketRose.push({
          label: item.biCategory,
          value: Number(item.count),
          percent: (item.count / count).toFixed(4),
        });
      });
      marketRoseChart.source(marketRose);
      marketRoseChart.coord('polar', {
        innerRadius: 0.2,
      });
      marketRoseChart.tooltip({
        showTitle: false,
      });
      marketRoseChart.legend({
        position: 'left-top',
        offsetX: -10,
        offsetY: 20,
      });
      marketRoseChart.axis(false);
      marketRoseChart
        .interval()
        .position('label*value')
        .tooltip('label*percent*value', (label, percent, value) => {
          const a = `${(percent * 100).toFixed(2)}%`;
          return {
            name: label,
            value: `${value}(${a})`,
          };
        })
        .style({
          lineWidth: 1,
        })
        .color('label', [
          '#10416C',
          '#0D87D4',
          '#36BB3D',
          '#ebca57',
          '#ff9f7f',
          '#F4374C',
          '#705dc8',
        ]);
    } else {
      const marketRose = [
        { label: 'Individual', value: 7 },
        { label: 'Institution', value: 3 },
        { label: 'Investment Bank', value: 1 },
        { label: 'Group Proprietary', value: 3 },
        { label: 'Hedge Fund', value: 5 },
        { label: 'Omnibus A/C', value: 4 },
      ];
      marketRoseChart.source(marketRose);
      marketRoseChart.coord('polar', {
        innerRadius: 0.2,
      });
      marketRoseChart.tooltip({
        showTitle: false,
      });
      marketRoseChart.legend(false);
      marketRoseChart.axis(false);
      marketRoseChart
        .interval()
        .position('label*value')
        .style({
          lineWidth: 1,
        })
        .color('label', [
          '#10416C',
          '#0D87D4',
          '#36BB3D',
          '#ebca57',
          '#ff9f7f',
          '#F4374C',
          '#705dc8',
        ]);
    }
    marketRoseChart.render();
    this.setState({ marketRoseChart });
  };

  renderOutstandingCasesLineChart = () => {
    const { outstandingCasesData } = this.props;
    let outstandingCasesLineChart;
    if (this.state.outstandingCasesLineChart) {
      // eslint-disable-next-line prefer-destructuring
      outstandingCasesLineChart = this.state.outstandingCasesLineChart;
    } else {
      outstandingCasesLineChart = new G2.Chart({
        container: 'outstandingCasesLine', // div ID
        forceFit: true, // 是否自适应宽度
        height: 226, // 画布高度
        padding: [20, 20, 45, 70], // 上下左右的padding
      });
    }
    let isRender = false;
    outstandingCasesData.forEach(item => {
      if (item.count > 0) {
        isRender = true;
      }
    });
    if (isRender) {
      const outstandingCasesLine = [];
      let count = 0;
      outstandingCasesData.forEach(item => {
        outstandingCasesLine.push({
          label: item.tradeDate,
          value: item.count,
          type: item.isProces,
        });
        if (item.count > count) {
          // eslint-disable-next-line prefer-destructuring
          count = item.count;
        }
      });
      outstandingCasesLineChart.source(outstandingCasesLine, {
        value: {
          // eslint-disable-next-line no-nested-ternary
          max: count < 5 ? 5 : count < 10 ? 10 : count + 5,
        },
      });
      outstandingCasesLineChart.legend({
        position: 'top-center', // 设置图例的显示位置
        label: {
          color: '#464C51', // 图例的字体颜色
          fontSize: 12,
        },
      });
      // 柱图value坐标
      outstandingCasesLineChart.axis('value', {
        position: 'left',
        label: {
          color: '#464C51',
          fontSize: 12,
        },
        line: {
          lineWidth: 0.5, // 设置线的宽度
        },
        grid: {
          lineStyle: {
            lineWidth: 0,
          },
        },
        title: {
          textStyle: {
            fontSize: 12, // 文本大小
            textAlign: 'center', // 文本对齐方式
            fill: '#e3e3e3', // 文本颜色
          },
          offset: 50,
        },
      });
      outstandingCasesLineChart.axis('label', {
        label: {
          color: '#464C51',
          fontSize: 12,
        },
        line: {
          lineWidth: 0.5, // 设置线的宽度
        },
        title: {
          textStyle: {
            fontSize: 12, // 文本大小
            textAlign: 'center', // 文本对齐方式
            fill: '#e3e3e3', // 文本颜色
          },
          offset: 30,
        },
      });
      outstandingCasesLineChart.scale('value', {
        alias: 'Number Of Alerts',
        // eslint-disable-next-line no-nested-ternary
        max: count < 5 ? 5 : count < 10 ? 10 : count + 5,
      });
      outstandingCasesLineChart.scale('label', {
        alias: 'Trade Date',
      });
      outstandingCasesLineChart
        .line()
        .position('label*value')
        .color('type')
        .shape('smooth');
      outstandingCasesLineChart
        .point()
        .position('label*value')
        .color('type')
        .size(4)
        .shape('circle')
        .style({
          stroke: '#fff',
          lineWidth: 1,
        });
    } else {
      const outstandingCasesLine = [
        { label: '20200101', value: 2, type: 'Alert_only' },
        { label: '20200102', value: 4, type: 'Alert_only' },
        { label: '20200103', value: 6, type: 'Alert_only' },
        { label: '20200104', value: 8, type: 'Alert_only' },
        { label: '20200105', value: 6, type: 'Alert_only' },
        { label: '20200106', value: 4, type: 'Alert_only' },
        { label: '20200101', value: 4, type: 'With_Approval_Process' },
        { label: '20200102', value: 6, type: 'With_Approval_Process' },
        { label: '20200103', value: 8, type: 'With_Approval_Process' },
        { label: '20200104', value: 10, type: 'With_Approval_Process' },
        { label: '20200105', value: 8, type: 'With_Approval_Process' },
        { label: '20200106', value: 6, type: 'With_Approval_Process' },
      ];
      outstandingCasesLineChart.source(outstandingCasesLine, {
        value: {
          max: 12,
        },
      });
      outstandingCasesLineChart.legend(false);
      // 柱图value坐标
      outstandingCasesLineChart.axis('value', {
        position: 'left',
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
        grid: false,
      });
      outstandingCasesLineChart.axis('label', {
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
      });
      outstandingCasesLineChart
        .line()
        .position('label*value')
        .color('type')
        .shape('smooth');
      outstandingCasesLineChart
        .point()
        .position('label*value')
        .color('type')
        .size(4)
        .shape('circle')
        .style({
          stroke: '#fff',
          lineWidth: 1,
        });
    }
    outstandingCasesLineChart.render();
    this.setState({ outstandingCasesLineChart });
  };

  // 渲染 processing stage 条形图
  renderProcessingStageBarChart = () => {
    const { processingStageData } = this.props;
    let processingStageBarChart;
    if (this.state.processingStageBarChart) {
      // eslint-disable-next-line prefer-destructuring
      processingStageBarChart = this.state.processingStageBarChart;
    } else {
      processingStageBarChart = new G2.Chart({
        container: 'processingStageBar', // div ID
        forceFit: true, // 是否自适应宽度
        height: 170, // 画布高度
        padding: [20, 20, 40, 140], // 上下左右的padding
      });
    }
    let isRender1 = false;
    let count = 0;
    if (processingStageData[0]) {
      Object.keys(processingStageData[0]).forEach(item => {
        if (processingStageData[0][item] > 0) {
          isRender1 = true;
        }
        if (processingStageData[0][item] > count) {
          count = processingStageData[0][item];
        }
      });
    }
    if (isRender1) {
      const processingStageBar = [];
      Object.keys(processingStageData[0]).forEach(item => {
        processingStageBar.push({
          label: item,
          type: 'Number Of Files',
          value: processingStageData[0][item],
        });
      });
      // const processingStageBar = [
      //   {
      //     label: 'Fail Submission',
      //     type: 'Number Of Files',
      //     value: processingStageData[0]['Fail Submission'],
      //   },
      //   {
      //     label: 'Failed Validation',
      //     type: 'Number Of Files',
      //     value: processingStageData[0]['Failed Validation'],
      //   },
      //   {
      //     label: 'In Validation',
      //     type: 'Number Of Files',
      //     value: processingStageData[0]['In Validation'],
      //   },
      //   { label: 'Processed', type: 'Number Of Files', value: processingStageData[0].Processed },
      //   {
      //     label: 'Ready for Process',
      //     type: 'Number Of Files',
      //     value: processingStageData[0]['Ready for Process'],
      //   },
      // ];
      processingStageBarChart.source(processingStageBar, {
        value: {
          // eslint-disable-next-line no-nested-ternary
          max: count < 5 ? 5 : count < 10 ? 10 : count + 5,
        },
      });
      processingStageBarChart.legend({
        position: 'top-center', // 设置图例的显示位置
        label: {
          color: '#464C51', // 图例的字体颜色
          fontSize: 12,
        },
      });
      // 柱图value坐标
      processingStageBarChart.axis('value', {
        position: 'right',
        label: {
          color: '#464C51',
          fontSize: 12,
        },
        line: {
          lineWidth: 0.5, // 设置线的宽度
        },
        grid: {
          lineStyle: {
            lineWidth: 0,
          },
        },
        title: {
          textStyle: {
            fontSize: 12, // 文本大小
            textAlign: 'center', // 文本对齐方式
            fill: '#e3e3e3', // 文本颜色
          },
          offset: 25,
        },
      });
      processingStageBarChart.axis('label', {
        label: {
          color: '#464C51',
          fontSize: 12,
          offset: 2,
        },
        line: {
          lineWidth: 0.5, // 设置线的宽度
        },
        title: {
          textStyle: {
            fontSize: 12, // 文本大小
            textAlign: 'center', // 文本对齐方式
            fill: '#e3e3e3', // 文本颜色
          },
          offset: 130,
        },
      });
      processingStageBarChart.scale('value', {
        alias: 'Number Of Files',
        // eslint-disable-next-line no-nested-ternary
        max: count < 5 ? 5 : count < 10 ? 10 : count + 5,
      });
      processingStageBarChart.scale('label', {
        alias: 'Processing_Stage',
      });
      // 将柱图转为条形图
      processingStageBarChart
        .coord()
        .transpose()
        .scale(1, -1);
      processingStageBarChart
        .interval()
        .position('label*value')
        .color('type', ['#10416c'])
        .size(12)
        .style({
          lineWidth: 1,
        })
        .label('value', {
          textStyle: {
            fill: '#464C51',
            fontSize: 11,
          },
          offset: 2,
        });
    } else {
      const processingStageBar = [
        {
          label: 'Fail submission',
          type: 'Number Of Files',
          value: 4,
        },
        {
          label: 'Failed validation',
          type: 'Number Of Files',
          value: 3,
        },
        {
          label: 'In validation',
          type: 'Number Of Files',
          value: 2,
        },
        { label: 'Processed', type: 'Number Of Files', value: 3 },
        {
          label: 'Ready for Processing',
          type: 'Number Of Files',
          value: 4,
        },
      ];
      processingStageBarChart.source(processingStageBar, {
        value: {
          max: 5,
        },
      });
      processingStageBarChart.legend(false);
      // 柱图value坐标
      processingStageBarChart.axis('value', {
        position: 'right',
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
        grid: false,
      });
      processingStageBarChart.axis('label', {
        label: false,
        line: {
          lineWidth: 1, // 设置线的宽度
        },
      });
      // 将柱图转为条形图
      processingStageBarChart
        .coord()
        .transpose()
        .scale(1, -1);
      processingStageBarChart
        .interval()
        .position('label*value')
        .color('type', ['#10416c'])
        .style({
          lineWidth: 1,
        })
        .size(12);
    }
    processingStageBarChart.render();
    this.setState({ processingStageBarChart });
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
      perAlertData,

      informationData,
      myAlertData,
      allTaskData,

      fileCountData,
      // lateReportFileCount,
      // outstandingReportFileCount,
      reportFilesData,
      marketData,
      marketDataByCategory,
      outstandingCasesData,
      processingStageData,

      allApprovalData,
      perApprovalData,
    } = this.props;

    const colorMap = {};
    allTaskData.forEach((item, index) => {
      colorMap[item.owner] = `color${index}`;
    });

    let currentTradeDate;
    let lastTradeDate;
    let currentDate;
    let lastDate;
    if (fileCountData[0]) {
      // eslint-disable-next-line prefer-destructuring
      currentTradeDate = fileCountData[0].currentTradeDate;
      // eslint-disable-next-line prefer-destructuring
      lastTradeDate = fileCountData[0].lastTradeDate;
      // eslint-disable-next-line prefer-destructuring
      currentDate = Object.keys(currentTradeDate)[0];
      // eslint-disable-next-line prefer-destructuring
      lastDate = Object.keys(lastTradeDate)[0];
    }

    let isRender = false;
    if (reportFilesData[0]) {
      const { lateReportFileCount, outstandingReportFileCount } = reportFilesData[0];
      lateReportFileCount.forEach(item => {
        if (item.count > 0) {
          isRender = true;
        }
      });
      outstandingReportFileCount.forEach(item => {
        if (item.count > 0) {
          isRender = true;
        }
      });
    }

    let isRender1 = false;
    if (processingStageData[0]) {
      Object.keys(processingStageData[0]).forEach(item => {
        if (processingStageData[0][item] > 0) {
          isRender1 = true;
        }
      });
    }

    let isRender2 = false;
    outstandingCasesData.forEach(item => {
      if (item.count > 0) {
        isRender2 = true;
      }
    });

    const {
      alertState,
      textActive,
      approvalState,
      approvalTextActive,
      targetData,
      proStartDate,
      proEndDate,
      startDate,
      endDate,
      // submissionStatusPieChart,
      // marketPieChart,
      // outstandingCasesLineChart,
      // processingStageBarChart,
    } = this.state;
    return (
      <div>
        <div className={styles.homepage}>
          <Tabs defaultActiveKey="1" onChange={this.onTabsChange}>
            {/* ALERT */}
            <TabPane tab="Alert" key="1">
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
                            if (this.state.alertState !== 'ALL') {
                              this.setState(
                                {
                                  alertState: 'ALL',
                                  alterAllChart: '',
                                  isRenderAlterAllChart: true,
                                  otherChart1: '',
                                  otherChart2: '',
                                },
                                () => {
                                  this.renderAlterAllChart(allAlterData);
                                  this.renderOtherChart1();
                                  this.renderOtherChart2();
                                },
                              );
                            }
                          }}
                        >
                          All
                        </span>
                        <span
                          className={classNames(
                            styles.switchButton,
                            alertState === 'PER' ? styles.buttonActive : '',
                          )}
                          onClick={() => {
                            if (this.state.alertState !== 'PER') {
                              this.setState(
                                {
                                  alertState: 'PER',
                                  alterPersonalChart: '',
                                  isRenderAlterPersonalChart: true,
                                  otherChart3: '',
                                  otherChart4: '',
                                },
                                () => {
                                  this.renderAlterPerChart();
                                  this.renderOtherChart3();
                                  this.renderOtherChart4();
                                },
                              );
                            }
                          }}
                        >
                          Personal
                        </span>
                      </div>
                      <div className={styles.timepicker}>
                        <span
                          className={classNames(
                            styles.text,
                            textActive === 'Today' ? styles.textActive : '',
                          )}
                          onClick={() => {
                            this.setState(
                              {
                                textActive: textActive === 'Today' ? '' : 'Today',
                              },
                              () => {
                                const params = {};
                                if (this.state.textActive === 'Today') {
                                  const startDate1 = moment().format('YYYYMMDD');
                                  const endDate1 = moment().format('YYYYMMDD');
                                  this.setState({
                                    startDate: startDate1,
                                    endDate: endDate1,
                                  });
                                  params.startDate = startDate1;
                                  params.endDate = endDate1;
                                } else {
                                  this.setState({
                                    startDate: '',
                                    endDate: '',
                                  });
                                }
                                this.getAlertDataByDate(params);
                              },
                            );
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
                            this.setState(
                              {
                                textActive: textActive === 'Week' ? '' : 'Week',
                              },
                              () => {
                                const params = {};
                                if (this.state.textActive === 'Week') {
                                  const startDate1 = moment(
                                    new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
                                  ).format('YYYYMMDD');
                                  const endDate1 = moment().format('YYYYMMDD');
                                  this.setState({
                                    startDate: startDate1,
                                    endDate: endDate1,
                                  });
                                  params.startDate = startDate1;
                                  params.endDate = endDate1;
                                } else {
                                  this.setState({
                                    startDate: '',
                                    endDate: '',
                                  });
                                }
                                this.getAlertDataByDate(params);
                              },
                            );
                          }}
                        >
                          This Week
                        </span>
                        <RangePicker
                          style={{ width: 250 }}
                          format="DD-MMM-YYYY"
                          value={
                            startDate
                              ? [moment(startDate, 'YYYYMMDD'), moment(endDate, 'YYYYMMDD')]
                              : undefined
                          }
                          onChange={dates => {
                            const params = {};
                            if (dates[0]) {
                              const today = moment().format('YYYYMMDD');
                              const lastWeekDay = moment(
                                new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
                              ).format('YYYYMMDD');
                              const startDate1 = moment(dates[0]).format('YYYYMMDD');
                              const endDate1 = moment(dates[1]).format('YYYYMMDD');
                              if (startDate1 === today && endDate1 === today) {
                                this.setState({
                                  textActive: 'Today',
                                });
                              } else if (startDate1 === lastWeekDay && endDate1 === today) {
                                this.setState({
                                  textActive: 'Week',
                                });
                              } else {
                                this.setState({
                                  textActive: '',
                                });
                              }
                              this.setState({
                                startDate: startDate1,
                                endDate: endDate1,
                              });
                              params.startDate = startDate1;
                              params.endDate = endDate1;
                            } else {
                              this.setState({
                                startDate: '',
                                endDate: '',
                                textActive: '',
                              });
                            }
                            this.getAlertDataByDate(params);
                          }}
                        />
                      </div>
                    </div>
                    {/* ALTER ALL */}
                    {alertState === 'ALL' && (
                      <>
                        <div className={styles.statisticalBox}>
                          <div className={styles.redBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Total</span>
                              <span className={styles.value}>{allAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <span className={styles.title}>Outstanding</span>
                              <span className={styles.value}>{allOutstandingALertCount}</span>
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Claimed</span>
                              <span className={styles.value}>{allClaimAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <div id="otherChart1" style={{ width: 107 }}></div>
                              {/* <img src={ring} alt="" width={70} />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 26,
                                  right: 13,
                                }}
                              >
                                {(allAlertCount === 0
                                  ? allAlertCount
                                  : (allClaimAlertCount / allAlertCount) * 100
                                ).toFixed(2)}
                                %
                              </span> */}
                              {/* <div id="allClaimed"></div> */}
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Processing</span>
                              <span className={styles.value}>{allProcessingAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <div id="otherChart2" style={{ width: 107 }}></div>
                              {/* <img src={ring} alt="" width={70} />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 26,
                                  right: 13,
                                }}
                              >
                                {(allAlertCount === 0
                                  ? allAlertCount
                                  : (allProcessingAlertCount / allAlertCount) * 100
                                ).toFixed(2)}
                                %
                              </span> */}
                            </div>
                          </div>
                        </div>
                        <div style={{ position: 'relative', height: 250 }}>
                          {!allAlterData[0] && (
                            <div
                              style={{
                                width: '100%',
                                height: 250,
                                position: 'absolute',
                                zIndex: 1,
                                background: 'hsla(0,0%,100%,.7)',
                              }}
                            ></div>
                          )}
                          <div id="AlterAll"></div>
                        </div>
                      </>
                    )}
                    {/* ALTER PERSONAL */}
                    {alertState === 'PER' && (
                      <>
                        <div className={styles.statisticalBox}>
                          <div className={styles.redBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Total</span>
                              <span className={styles.value}>{allAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <span className={styles.title}>Outstanding</span>
                              <span className={styles.value}>{allOutstandingALertCount}</span>
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Claimed</span>
                              <span className={styles.value}>{perClaimAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <div id="otherChart3" style={{ width: 107 }}></div>
                              {/* <img src={ring} alt="" width={70} />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 26,
                                  right: 13,
                                }}
                              >
                                {(allAlertCount === 0
                                  ? allAlertCount
                                  : (perClaimAlertCount / allAlertCount) * 100
                                ).toFixed(2)}
                                %
                              </span> */}
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Processing</span>
                              <span className={styles.value}>{perProcessingAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <div id="otherChart4" style={{ width: 107 }}></div>
                              {/* <img src={ring} alt="" width={70} />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 26,
                                  right: 13,
                                }}
                              >
                                {(allAlertCount === 0
                                  ? allAlertCount
                                  : (perProcessingAlertCount / allAlertCount) * 100
                                ).toFixed(2)}
                                %
                              </span> */}
                            </div>
                          </div>
                        </div>
                        <div style={{ position: 'relative', height: 250 }}>
                          {!(
                            perAlertData[0] &&
                            (perAlertData[0].Claimed !== 0 ||
                              perAlertData[0].Finished !== 0 ||
                              perAlertData[0].Outstanding !== 0 ||
                              perAlertData[0].Processing !== 0)
                          ) && (
                            <div
                              style={{
                                width: '100%',
                                height: 250,
                                position: 'absolute',
                                zIndex: 1,
                                background: 'hsla(0,0%,100%,.7)',
                              }}
                            ></div>
                          )}
                          <div id="AlterPersonal"></div>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Pending tasks */}
                  <div className={styles.pendingTasks}>
                    <Tabs
                      // defaultActiveKey="1"
                      activeKey={this.state.activeKey}
                      tabBarExtraContent={
                        <span
                          className={styles.more}
                          onClick={() => {
                            if (this.state.activeKey === '1') {
                              router.push('/homepage/alert-center');
                            }
                            if (this.state.activeKey === '2') {
                              router.push('/homepage/Approval-Process-Center');
                            }
                          }}
                        >
                          More
                        </span>
                      }
                      onChange={activeKey => {
                        this.setState({
                          activeKey,
                        });
                      }}
                    >
                      {/* ALERT */}
                      <TabPane tab="Alert" key="1">
                        <div className={styles.infoList}>
                          <List
                            itemLayout="horizontal"
                            dataSource={myAlertData}
                            renderItem={item => (
                              <List.Item>
                                <span
                                  title={item.alertDesc}
                                  className={styles.description}
                                  onClick={() => {
                                    router.push(`/homepage/alert-center?alertId=${item.alertNo}`);
                                  }}
                                >
                                  {item.alertDesc}
                                </span>
                                <span className={styles.date}>
                                  {/* {item.updateTime} */}
                                  {item.alertTime &&
                                    moment(item.alertTime, timestampFormat).format(timestampFormat)}
                                </span>
                              </List.Item>
                            )}
                          />
                        </div>
                      </TabPane>
                      {/* APPROVAL PROCESS */}
                      <TabPane tab="Task" key="2">
                        <div className={styles.infoList}>
                          <List
                            itemLayout="horizontal"
                            dataSource={allTaskData}
                            renderItem={item => (
                              <List.Item>
                                <span
                                  title={`${item.classification} ${item.details}`}
                                  className={styles.description}
                                  onClick={() => {
                                    router.push(
                                      `/homepage/Approval-Process-Center?taskCode=${item.taskCode}`,
                                    );
                                  }}
                                >
                                  {item.classification} {item.details}
                                </span>
                                {item.owner && (
                                  <span
                                    className={classNames(
                                      styles.user,
                                      styles[colorMap[item.owner]],
                                    )}
                                  >
                                    {item.owner &&
                                      item.owner.match(/[A-Z]/g) &&
                                      item.owner.match(/[A-Z]/g).join('')}
                                  </span>
                                )}
                                <span className={styles.date}>
                                  {item.updateDate &&
                                    moment(item.updateDate).format(timestampFormat)}
                                </span>
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
                        type="iconshezhi"
                        className={styles.quickMenuIcon}
                        onClick={() => {
                          this.toggleModal('quickMenu');
                          // router.push('/homepage/quick-menu-management');
                        }}
                      />
                    </h3>
                    <Row>
                      {targetData.map(item => (
                        <Col span={11} className={styles.menuItem}>
                          <IconFont
                            // type={item.icon}
                            type="iconkuaijiecaidan"
                            className={styles.icon}
                          />
                          <span
                            onClick={() => {
                              router.push(item.menuurl);
                            }}
                          >
                            {item.title}
                          </span>
                        </Col>
                      ))}
                      {!targetData[0] && (
                        <div className={styles.empty}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
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
                          <span
                            title={item.informationDetail}
                            className={styles.description}
                            onClick={() => {
                              router.push(
                                `/homepage/information?informationNo=${item.informationNo}`,
                              );
                            }}
                          >
                            <span className={styles.icon}>
                              <IconFont type="icon-sound" />
                            </span>
                            {item.informationDetail &&
                              `${item.informationDetail.substring(0, 70)}...`}
                          </span>
                          <span className={styles.date}>
                            {moment(item.timestamp).format('DD-MMM-YYYY HH:mm')}
                          </span>
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
            {/* APPROVAL PROCESS */}
            <TabPane tab="Approval Process" key="2">
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
                            if (this.state.approvalState !== 'ALL') {
                              this.setState(
                                {
                                  approvalState: 'ALL',
                                  approvalAllChart: '',
                                  isRenderApprovalAllChart: true,
                                  otherChart5: '',
                                  otherChart6: '',
                                },
                                () => {
                                  this.renderApprovalAllChart();
                                  this.renderOtherChart5();
                                  this.renderOtherChart6();
                                },
                              );
                            }
                          }}
                        >
                          All
                        </span>
                        <span
                          className={classNames(
                            styles.switchButton,
                            approvalState === 'PER' ? styles.buttonActive : '',
                          )}
                          onClick={() => {
                            if (this.state.approvalState !== 'PER') {
                              this.setState(
                                {
                                  approvalState: 'PER',
                                  approvalPersonalChart: '',
                                  isRenderApprovalPersonalChart: true,
                                  approvalPersonalPieChart: '',
                                  otherChart7: '',
                                  otherChart8: '',
                                },
                                () => {
                                  this.renderApprovalPerChart();
                                  this.renderApprovalPerPieChart();
                                  this.renderOtherChart7();
                                  this.renderOtherChart8();
                                },
                              );
                            }
                          }}
                        >
                          Personal
                        </span>
                      </div>
                      <div className={styles.timepicker}>
                        <span
                          className={classNames(
                            styles.text,
                            approvalTextActive === 'Today' ? styles.textActive : '',
                          )}
                          onClick={() => {
                            this.setState(
                              {
                                approvalTextActive: approvalTextActive === 'Today' ? '' : 'Today',
                              },
                              () => {
                                const params = {};
                                if (this.state.approvalTextActive === 'Today') {
                                  const startDate1 = moment().format('YYYYMMDD');
                                  const endDate1 = moment().format('YYYYMMDD');
                                  params.startDate = startDate1;
                                  params.endDate = endDate1;
                                  this.setState({
                                    proStartDate: startDate1,
                                    proEndDate: endDate1,
                                  });
                                } else {
                                  this.setState({
                                    proStartDate: '',
                                    proEndDate: '',
                                  });
                                }
                                this.getApprovalData(params);
                              },
                            );
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
                            this.setState(
                              {
                                approvalTextActive: approvalTextActive === 'Week' ? '' : 'Week',
                              },
                              () => {
                                const params = {};
                                if (this.state.approvalTextActive === 'Week') {
                                  const startDate1 = moment(
                                    new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
                                  ).format('YYYYMMDD');
                                  const endDate1 = moment().format('YYYYMMDD');
                                  params.startDate = startDate1;
                                  params.endDate = endDate1;
                                  this.setState({
                                    proStartDate: startDate1,
                                    proEndDate: endDate1,
                                  });
                                } else {
                                  this.setState({
                                    proStartDate: '',
                                    proEndDate: '',
                                  });
                                }
                                this.getApprovalData(params);
                              },
                            );
                          }}
                        >
                          This Week
                        </span>
                        <RangePicker
                          style={{ width: 250 }}
                          format="DD-MMM-YYYY"
                          value={
                            proStartDate
                              ? [moment(proStartDate, 'YYYYMMDD'), moment(proEndDate, 'YYYYMMDD')]
                              : undefined
                          }
                          onChange={dates => {
                            const params = {};
                            if (dates[0]) {
                              const today = moment().format('YYYYMMDD');
                              const lastWeekDay = moment(
                                new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
                              ).format('YYYYMMDD');
                              const startDate1 = moment(dates[0]).format('YYYYMMDD');
                              const endDate1 = moment(dates[1]).format('YYYYMMDD');
                              if (startDate1 === today && endDate1 === today) {
                                this.setState({
                                  approvalTextActive: 'Today',
                                });
                              } else if (startDate1 === lastWeekDay && endDate1 === today) {
                                this.setState({
                                  approvalTextActive: 'Week',
                                });
                              } else {
                                this.setState({
                                  approvalTextActive: '',
                                });
                              }
                              this.setState({
                                proStartDate: startDate1,
                                proEndDate: endDate1,
                              });
                              params.startDate = startDate1;
                              params.endDate = endDate1;
                            } else {
                              this.setState({
                                proStartDate: '',
                                proEndDate: '',
                                approvalTextActive: '',
                              });
                            }
                            this.getApprovalData(params);
                          }}
                        />
                      </div>
                    </div>
                    {/* ALTER ALL */}
                    {approvalState === 'ALL' && (
                      <>
                        <div className={styles.statisticalBox}>
                          <div className={styles.redBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Total</span>
                              <span className={styles.value}>
                                {allApprovalData[0] ? allApprovalData[0].allTotalNum : 0}
                              </span>
                            </div>
                            <div className={styles.rightBlock}>
                              <span className={styles.title}>Outstanding</span>
                              <span className={styles.value}>
                                {allApprovalData[0] ? allApprovalData[0].allOutstandingNum : 0}
                              </span>
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Claimed</span>
                              <span className={styles.value}>
                                {allApprovalData[0] ? allApprovalData[0].allClaimedNum : 0}
                              </span>
                            </div>
                            <div className={styles.rightBlock}>
                              <div id="otherChart5" style={{ width: 107 }}></div>
                              {/* <img src={ring} alt="" width={70} />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 26,
                                  right: 13,
                                }}
                              >
                                {(allApprovalData[0] && !!allApprovalData[0].allTotalNum
                                  ? (allApprovalData[0].allClaimedNum /
                                      allApprovalData[0].allTotalNum) *
                                    100
                                  : 0
                                ).toFixed(2)}
                                %
                              </span> */}
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Processing</span>
                              <span className={styles.value}>
                                {allApprovalData[0] ? allApprovalData[0].allProcessingNum : 0}
                              </span>
                            </div>
                            <div className={styles.rightBlock}>
                              <div id="otherChart6" style={{ width: 107 }}></div>
                              {/* <img src={ring} alt="" width={70} />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 26,
                                  right: 13,
                                }}
                              >
                                {(allApprovalData[0] && !!allApprovalData[0].allTotalNum
                                  ? (allApprovalData[0].allProcessingNum /
                                      allApprovalData[0].allTotalNum) *
                                    100
                                  : 0
                                ).toFixed(2)}
                                %
                              </span> */}
                            </div>
                          </div>
                        </div>
                        <div style={{ position: 'relative', height: 250 }}>
                          {!(
                            allApprovalData[0] &&
                            allApprovalData[0].userInfo &&
                            allApprovalData[0].userInfo[0]
                          ) && (
                            <div
                              style={{
                                width: '100%',
                                height: 250,
                                position: 'absolute',
                                zIndex: 1,
                                background: 'hsla(0,0%,100%,.7)',
                              }}
                            ></div>
                          )}
                          <div id="ApprovalAll"></div>
                        </div>
                      </>
                    )}
                    {/* ALTER PERSONAL */}
                    {approvalState === 'PER' && (
                      <>
                        <div className={styles.statisticalBox}>
                          <div className={styles.redBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Total</span>
                              <span className={styles.value}>
                                {perApprovalData[0] ? perApprovalData[0].allTotalNum : 0}
                              </span>
                            </div>
                            <div className={styles.rightBlock}>
                              <span className={styles.title}>Outstanding</span>
                              <span className={styles.value}>
                                {perApprovalData[0] ? perApprovalData[0].allOutstandingNum : 0}
                              </span>
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Claimed</span>
                              <span className={styles.value}>
                                {perApprovalData[0] ? perApprovalData[0].myClaimedNum : 0}
                              </span>
                            </div>
                            <div className={styles.rightBlock}>
                              <div id="otherChart7" style={{ width: 107 }}></div>
                              {/* <img src={ring} alt="" width={70} />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 26,
                                  right: 13,
                                }}
                              >
                                {(perApprovalData[0] && !!perApprovalData[0].allTotalNum
                                  ? (perApprovalData[0].myClaimedNum /
                                      perApprovalData[0].allTotalNum) *
                                    100
                                  : 0
                                ).toFixed(2)}
                                %
                              </span> */}
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Processing</span>
                              <span className={styles.value}>
                                {perApprovalData[0] ? perApprovalData[0].myProcessingNum : 0}
                              </span>
                            </div>
                            <div className={styles.rightBlock}>
                              <div id="otherChart8" style={{ width: 107 }}></div>
                              {/* <img src={ring} alt="" width={70} />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 26,
                                  right: 13,
                                }}
                              >
                                {(perApprovalData[0] && !!perApprovalData[0].allTotalNum
                                  ? (perApprovalData[0].myProcessingNum /
                                      perApprovalData[0].allTotalNum) *
                                    100
                                  : 0
                                ).toFixed(2)}
                                %
                              </span> */}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                          }}
                        >
                          <div style={{ position: 'relative', flex: 3, height: 250 }}>
                            {!(
                              perApprovalData[0] &&
                              (!!perApprovalData[0].allOutstandingNum ||
                                !!perApprovalData[0].myClaimedNum ||
                                !!perApprovalData[0].myProcessingNum ||
                                !!perApprovalData[0].myFinishedNum)
                            ) && (
                              <div
                                style={{
                                  width: '100%',
                                  height: 250,
                                  position: 'absolute',
                                  zIndex: 1,
                                  background: 'hsla(0,0%,100%,.7)',
                                }}
                              ></div>
                            )}
                            <div id="ApprovalPersonal"></div>
                          </div>
                          <div style={{ position: 'relative', flex: 2, height: 250 }}>
                            {!(
                              perApprovalData[0] &&
                              (!!perApprovalData[0].myApprovedNum ||
                                !!perApprovalData[0].myRejectedNum ||
                                !!perApprovalData[0].myTerminatedNum)
                            ) && (
                              <div
                                style={{
                                  width: '100%',
                                  height: 250,
                                  position: 'absolute',
                                  zIndex: 1,
                                  background: 'hsla(0,0%,100%,.7)',
                                }}
                              ></div>
                            )}
                            <div id="ApprovalPersonalPie"></div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Pending tasks */}
                  <div className={styles.pendingTasks}>
                    <Tabs
                      // defaultActiveKey="1"
                      activeKey={this.state.activeKey}
                      tabBarExtraContent={
                        <span
                          className={styles.more}
                          onClick={() => {
                            if (this.state.activeKey === '1') {
                              router.push('/homepage/alert-center');
                            }
                            if (this.state.activeKey === '2') {
                              router.push('/homepage/Approval-Process-Center');
                            }
                          }}
                        >
                          More
                        </span>
                      }
                      onChange={activeKey => {
                        this.setState({
                          activeKey,
                        });
                      }}
                    >
                      {/* ALERT */}
                      <TabPane tab="Alert" key="1">
                        <div className={styles.infoList}>
                          <List
                            itemLayout="horizontal"
                            dataSource={myAlertData}
                            renderItem={item => (
                              <List.Item>
                                <span
                                  title={item.alertDesc}
                                  className={styles.description}
                                  onClick={() => {
                                    router.push(`/homepage/alert-center?alertId=${item.alertNo}`);
                                  }}
                                >
                                  {item.alertDesc}
                                </span>
                                <span className={styles.date}>
                                  {/* {item.updateTime} */}
                                  {item.alertTime &&
                                    moment(item.alertTime, timestampFormat).format(timestampFormat)}
                                </span>
                              </List.Item>
                            )}
                          />
                        </div>
                      </TabPane>
                      {/* APPROVAL PROCESS */}
                      <TabPane tab="Task" key="2">
                        <div className={styles.infoList}>
                          <List
                            itemLayout="horizontal"
                            dataSource={allTaskData}
                            renderItem={item => (
                              <List.Item>
                                <span
                                  title={`${item.classification} ${item.details}`}
                                  className={styles.description}
                                  onClick={() => {
                                    router.push(
                                      `/homepage/Approval-Process-Center?taskCode=${item.taskCode}`,
                                    );
                                  }}
                                >
                                  {item.classification} {item.details}
                                </span>
                                {item.owner && (
                                  <span
                                    className={classNames(
                                      styles.user,
                                      styles[colorMap[item.owner]],
                                    )}
                                  >
                                    {item.owner &&
                                      item.owner.match(/[A-Z]/g) &&
                                      item.owner.match(/[A-Z]/g).join('')}
                                  </span>
                                )}
                                <span className={styles.date}>
                                  {item.updateDate &&
                                    moment(item.updateDate).format(timestampFormat)}
                                </span>
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
                        type="iconshezhi"
                        className={styles.quickMenuIcon}
                        onClick={() => {
                          this.toggleModal('quickMenu');
                          // router.push('/homepage/quick-menu-management');
                        }}
                      />
                    </h3>
                    <Row>
                      {targetData.map(item => (
                        <Col span={11} className={styles.menuItem}>
                          {/* <IconFont type={item.icon} className={styles.icon} /> */}
                          <IconFont
                            // type={item.icon}
                            type="iconkuaijiecaidan"
                            className={styles.icon}
                          />
                          <span
                            onClick={() => {
                              router.push(item.menuurl);
                            }}
                          >
                            {item.title}
                          </span>
                        </Col>
                      ))}
                      {!targetData[0] && (
                        <div className={styles.empty}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
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
                          <span
                            title={item.informationDetail}
                            className={styles.description}
                            onClick={() => {
                              router.push(
                                `/homepage/information?informationNo=${item.informationNo}`,
                              );
                            }}
                          >
                            <span className={styles.icon}>
                              <IconFont type="icon-sound" />
                            </span>
                            {item.informationDetail &&
                              `${item.informationDetail.substring(0, 70)}...`}
                          </span>
                          <span className={styles.date}>
                            {moment(item.timestamp).format('DD-MMM-YYYY HH:mm')}
                          </span>
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
            {/* DASHBOARD */}
            <TabPane tab="Dashboard" key="3">
              <div className={styles.homepageContent}>
                {/* 左侧 */}
                <div className={styles.leftSide}>
                  {/* Submission status */}
                  <div className={styles.submitStatus}>
                    <div style={{ flex: '1 1', minHeight: 250 }}>
                      <h3 className={styles.groupTitle1}>
                        <IconFont type="iconai70" style={{ color: '#0D87D4', marginRight: 3 }} />
                        Submission Status
                      </h3>
                      <div style={{ position: 'relative', height: 330 }}>
                        {(!currentTradeDate ||
                          !lastTradeDate ||
                          !currentDate ||
                          !lastDate ||
                          (currentTradeDate[currentDate] === 0 &&
                            lastTradeDate[lastDate] === 0)) && (
                          <div
                            style={{
                              width: '100%',
                              height: 330,
                              position: 'absolute',
                              zIndex: 1,
                              background: 'hsla(0,0%,100%,.7)',
                            }}
                          ></div>
                        )}
                        <div id="submissionStatusPie"></div>
                      </div>
                    </div>
                    <div style={{ flex: '1 1', minHeight: 250 }}>
                      <div style={{ position: 'relative', height: 330 }}>
                        {!isRender && (
                          <div
                            style={{
                              width: '100%',
                              height: 366,
                              position: 'absolute',
                              zIndex: 1,
                              background: 'hsla(0,0%,100%,.7)',
                            }}
                          ></div>
                        )}
                        <div id="submissionStatusBar"></div>
                      </div>
                    </div>
                  </div>
                  {/* Number of Outstanding Cases */}
                  <div className={styles.outstandingCases}>
                    <h3 className={styles.groupTitle}>NO. of Outstanding Cases(Investigating)</h3>
                    <div style={{ position: 'relative', height: 226 }}>
                      {!isRender2 && (
                        <div
                          style={{
                            width: '100%',
                            height: 226,
                            position: 'absolute',
                            zIndex: 1,
                            background: 'hsla(0,0%,100%,.7)',
                          }}
                        ></div>
                      )}
                      <div id="outstandingCasesLine"></div>
                    </div>
                  </div>
                </div>
                {/* 右侧 */}
                <div className={styles.rightSide}>
                  {/* reported */}
                  <div className={styles.reported}>
                    <div style={{ flex: 1 }}>
                      <h3
                        className={styles.groupTitle1}
                        title="Number of reported LOP holders in SEHK and HKFE"
                      >
                        <IconFont type="iconai70" style={{ color: '#0D87D4', marginRight: 3 }} />
                        Number of reported LOP holders in SEHK and HKFE
                      </h3>
                      <div style={{ position: 'relative', height: 180 }}>
                        {!marketData[0] && (
                          <div
                            style={{
                              width: '100%',
                              height: 180,
                              position: 'absolute',
                              zIndex: 1,
                              background: 'hsla(0,0%,100%,.7)',
                            }}
                          ></div>
                        )}
                        <div id="marketPie"></div>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ position: 'relative', height: 210 }}>
                        {!marketDataByCategory[0] && (
                          <div
                            style={{
                              width: '100%',
                              height: 210,
                              position: 'absolute',
                              zIndex: 1,
                              background: 'hsla(0,0%,100%,.7)',
                            }}
                          ></div>
                        )}
                        <div id="marketRose"></div>
                      </div>
                    </div>
                  </div>
                  {/* Processing Stage */}
                  <div className={styles.processingStage}>
                    <h3 className={styles.groupTitle}>Processing Stage</h3>
                    <div style={{ position: 'relative', height: 170 }}>
                      {!isRender1 && (
                        <div
                          style={{
                            width: '100%',
                            height: 170,
                            position: 'absolute',
                            zIndex: 1,
                            background: 'hsla(0,0%,100%,.7)',
                          }}
                        ></div>
                      )}
                      <div id="processingStageBar"></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
          {this.state.visible.quickMenu && (
            <QuickMenu
              toggleModal={this.toggleModal}
              visible={this.state.visible.quickMenu}
              callback={this.quickMenuCallback}
            />
          )}
        </div>
      </div>
    );
  }
}
