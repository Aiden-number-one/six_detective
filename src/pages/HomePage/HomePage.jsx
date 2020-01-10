import React, { PureComponent } from 'react';
import G2 from '@antv/g2';
import moment from 'moment';
import { Tabs, DatePicker, List, Row, Col, Empty } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';

import { dateFormat, timestampFormat } from '@/pages/DataImportLog/constants';
import IconFont from '@/components/IconFont';
import ring from '@/assets/images/ring.png';

import styles from './HomePage.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect(({ allAlert, perAlert, information, dashboard, approval }) => ({
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
  lateReportFileCount: dashboard.lateReportFileCount, //
  outstandingReportFileCount: dashboard.outstandingReportFileCount, //
  allApprovalData: approval.allApprovalData, // 全部流程图表相关数据
  perApprovalData: approval.perApprovalData, // 个人流程相关数据
  allTaskData: approval.allTaskData, // my Task表格数据
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
    activeKey: '1',
    startDate: moment().format('YYYYMMDD'),
    endDate: moment().format('YYYYMMDD'),
    proStartDate: moment().format('YYYYMMDD'),
    proEndDate: moment().format('YYYYMMDD'),

    alterAllChart: '',
    alterPersonalChart: '',
    approvalAllChart: '',
    approvalPersonalChart: '',
    approvalPersonalPieChart: '',
    submissionStatusPieChart: '',
    submissionStatusBarChart: '',
    marketPieChart: '',
    marketRoseChart: '',
    processingStageBarChart: '',
  };

  componentDidMount() {
    const { startDate, endDate, proStartDate, proEndDate } = this.state;
    const alertParams = {
      startDate,
      endDate,
    };
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
    this.getAlertData(alertParams);
    // 获取alert表格的数据
    dispatch({
      type: 'perAlert/getMyAlert',
      payload: {
        pageNumber: 1,
        pageSize: 4,
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
    // 获取dashboard相关数据
    dispatch({
      type: 'dashboard/getFileCountByDate',
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
  }

  getApprovalData = (params = {}) => {
    const { dispatch } = this.props;
    // 获取approval process全部数据
    dispatch({
      type: 'approval/getAllApproval',
      payload: {
        ...params,
      },
      callback: datas => {
        // 更新图表 如果重新获取的数据不为空 则重新渲染图表
        const ApprovalAll = [];
        if (datas[0] && datas[0].userInfo && datas[0].userInfo[0]) {
          datas[0].userInfo.forEach(item => {
            ApprovalAll.push({
              label: item.userId,
              type: 'CLAIMED',
              value: item.userClaimedNum,
            });
          });
          datas[0].userInfo.forEach(item => {
            ApprovalAll.push({
              label: item.userId,
              type: 'PROCESSING',
              value: item.userProcessingNum,
            });
          });
          // eslint-disable-next-line no-unused-expressions
          this.state.approvalAllChart && this.state.approvalAllChart.changeData(ApprovalAll);
        } else {
          // 更新图表 如果重新获取的数据为空 则清空图表
          // eslint-disable-next-line no-unused-expressions
          this.state.approvalAllChart && this.state.approvalAllChart.changeData([]);
        }
      },
    });
    // 获取approval process个人数据
    dispatch({
      type: 'approval/getPerApproval',
      payload: {
        ...params,
      },
      callback: datas => {
        if (
          datas[0] &&
          (!!datas[0].allOutstandingNum ||
            !!datas[0].myClaimedNum ||
            !!datas[0].myProcessingNum ||
            !!datas[0].myFinishedNum)
        ) {
          // 更新图表 如果重新获取的数据不为空 则重新渲染图表
          const ApprovalPersonal = [
            { label: 'Outstanding', value: datas[0].allOutstandingNum },
            { label: 'Calimed', value: datas[0].myClaimedNum },
            { label: 'Processing', value: datas[0].myProcessingNum },
            { label: 'Finished', value: datas[0].myFinishedNum },
          ];
          // eslint-disable-next-line no-unused-expressions
          this.state.approvalPersonalChart &&
            this.state.approvalPersonalChart.changeData(ApprovalPersonal);
        } else {
          // 更新图表 如果重新获取的数据为空 则清空图表
          // eslint-disable-next-line no-unused-expressions
          this.state.approvalPersonalChart && this.state.approvalPersonalChart.changeData([]);
        }
        if (
          datas[0] &&
          (!!datas[0].myApprovedNum || !!datas[0].myRejectedNum || !!datas[0].myTerminatedNum)
        ) {
          // 更新图表 如果重新获取的数据不为空 则重新渲染图表
          const { myApprovedNum, myRejectedNum, myTerminatedNum } = datas[0];
          const count = myApprovedNum + myRejectedNum + myTerminatedNum;
          const ApprovalPersonalPie = [
            { label: 'Approved', value: myApprovedNum, percent: myApprovedNum / count },
            { label: 'Rejected', value: myRejectedNum, percent: myRejectedNum / count },
            { label: 'Terminated', value: myTerminatedNum, percent: myTerminatedNum / count },
          ];
          // eslint-disable-next-line no-unused-expressions
          this.state.approvalPersonalPieChart &&
            this.state.approvalPersonalPieChart.changeData(ApprovalPersonalPie);
        } else {
          // 更新图表 如果重新获取的数据不为空 则清空图表
          // eslint-disable-next-line no-unused-expressions
          this.state.approvalPersonalPieChart && this.state.approvalPersonalPieChart.changeData([]);
        }
      },
    });
  };

  getAlertData = (params = {}) => {
    const { dispatch } = this.props;
    // 获取All alert total
    dispatch({
      type: 'allAlert/getAllAlertCount',
      payload: {
        ...params,
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
    // 获取All Claim alert total
    dispatch({
      type: 'allAlert/getAllClaimAlertCount',
      payload: {
        ...params,
        isClaimed: 1,
      },
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
    // 获取个人 Alert Closed total
    // dispatch({
    //   type: 'perAlert/getPerClosedAlterCount',
    //   payload: {
    //     ...params,
    //   },
    // });
  };

  getAlertDataByDate = (params = {}) => {
    const { dispatch } = this.props;
    // 获取All alert 条形图数据
    dispatch({
      type: 'allAlert/getAllAlterData',
      payload: {
        ...params,
      },
      callback: data => {
        if (data[0]) {
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
          if (this.state.alterAllChart) {
            this.state.alterAllChart.source(AlterAll);
            this.state.alterAllChart.repaint();
          }
        } else if (this.state.alterAllChart) {
          this.state.alterAllChart.source([]);
          this.state.alterAllChart.repaint();
        }
      },
    });
    this.getAlertData(params);
    dispatch({
      type: 'perAlert/getPerAlertData',
      payload: {
        ...params,
      },
      callback: data => {
        // getPerAlertData
        if (
          !data[0] ||
          (data[0] &&
            data[0].Claimed === 0 &&
            data[0].Finished === 0 &&
            data[0].Outstanding === 0 &&
            data[0].Processing === 0)
        ) {
          // eslint-disable-next-line no-unused-expressions
          this.state.alterPersonalChart && this.state.alterPersonalChart.changeData([]);
        } else {
          // Alter Personal 的条形图
          const AlterPersonal = [
            { label: 'Outstanding', value: data[0].Outstanding },
            { label: 'Calimed', value: data[0].Claimed },
            { label: 'Processing', value: data[0].Processing },
            { label: 'Finished', value: data[0].Finished },
          ];
          // eslint-disable-next-line no-unused-expressions
          this.state.alterPersonalChart && this.state.alterPersonalChart.changeData(AlterPersonal);
        }
      },
    });
  };

  // tabs 切换
  onTabsChange = activeKey => {
    const { renderProcess, renderDashboard } = this.state;
    const {
      fileCountData,
      marketData,
      marketDataByCategory,
      processingStageData,
      lateReportFileCount,
      outstandingReportFileCount,
      allApprovalData,
    } = this.props;
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
    let isRender = false;
    let isRender1 = false;
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
    if (processingStageData[0]) {
      Object.keys(processingStageData[0]).forEach(item => {
        if (processingStageData[0][item] > 0) {
          isRender1 = true;
        }
      });
    }
    if (activeKey === '2') {
      setTimeout(() => {
        if (document.getElementById('ApprovalAll') && renderProcess) {
          if (allApprovalData[0] && allApprovalData[0].userInfo && allApprovalData[0].userInfo[0]) {
            this.renderApprovalAllChart();
          }
          this.setState({
            renderProcess: false,
          });
        }
      }, 0);
    }
    if (activeKey === '3') {
      setTimeout(() => {
        if (renderDashboard) {
          if (
            currentTradeDate &&
            lastTradeDate &&
            currentDate &&
            lastDate &&
            (currentTradeDate[currentDate] !== 0 || lastTradeDate[lastDate] !== 0)
          ) {
            this.renderSubmissionStatusPieChart();
          }
          if (isRender) {
            this.renderSubmissionStatusBarChart();
          }
          if (marketData[0]) {
            this.renderMarketPieChart();
          }
          if (marketDataByCategory[0]) {
            this.renderMarketRoseChart();
          }
          if (isRender1) {
            this.renderProcessingStageBarChart();
          }
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
    const { startDate, endDate } = this.state;
    // Alter ALL 的条形图
    const AlterAll = [];
    data.forEach(item => {
      AlterAll.push({
        label: item.userName, // 纵坐标
        type: 'Claimed', // 分类
        value: item.claimedCount, // 已认领数
      });
    });
    data.forEach(item => {
      AlterAll.push({
        label: item.userName, // 纵坐标
        type: 'Processing', // 分类
        value: item.processingCount, // 处理中数
      });
    });
    const alterAllChart = new G2.Chart({
      container: 'AlterAll', // div ID
      forceFit: true, // 是否自适应宽度
      height: 250, // 画布高度
      padding: [20, 120, 20, 100], // 上下左右的padding
    });
    alterAllChart.source(AlterAll);
    alterAllChart.legend({
      position: 'right-top', // 设置图例的显示位置
      itemGap: 20, // 图例项之间的间距
      offsetX: 20,
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
          fontSize: 12,
        },
        offset: 2,
      })
      .size(15)
      .adjust([
        {
          type: 'dodge',
          marginRatio: 0,
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
          `/homepage/alert-center?alertOwnerId=${alertOwnerId}&alertStatusDesc=${alertStatusDesc}&startDate=${startDate}&endDate=${endDate}`,
        );
      }
    });
    this.setState({
      alterAllChart,
    });
  };

  // 渲染Alter Personal条形图
  renderAlterPerChart = () => {
    const { startDate, endDate } = this.state;
    const { perAlertData } = this.props;
    // Alter Personal 的条形图
    const AlterPersonal = [
      { label: 'Outstanding', value: perAlertData[0].Outstanding },
      { label: 'Calimed', value: perAlertData[0].Claimed },
      { label: 'Processing', value: perAlertData[0].Processing },
      { label: 'Finished', value: perAlertData[0].Finished },
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
          `/homepage/alert-center?alertOwnerId=${alertOwnerId}&alertStatusDesc=${alertStatusDesc}&startDate=${startDate}&endDate=${endDate}`,
        );
      }
    });
    this.setState({ alterPersonalChart });
  };

  // 渲染Approval All柱状图
  renderApprovalAllChart = () => {
    const { proStartDate, proEndDate } = this.state;
    const { allApprovalData } = this.props;
    const { userInfo } = allApprovalData[0];
    const ApprovalAll = [];
    userInfo.forEach(item => {
      ApprovalAll.push({
        label: item.userId,
        type: 'CLAIMED',
        value: item.userClaimedNum,
      });
    });
    userInfo.forEach(item => {
      ApprovalAll.push({
        label: item.userId,
        type: 'PROCESSING',
        value: item.userProcessingNum,
      });
    });
    const approvalAllChart = new G2.Chart({
      container: 'ApprovalAll',
      forceFit: true,
      height: 250,
      padding: [20, 100, 20, 50],
    });
    approvalAllChart.source(ApprovalAll);
    approvalAllChart.legend({
      position: 'right-top', // 设置图例的显示位置
      itemGap: 20, // 图例项之间的间距
      label: {
        color: '#464C51',
        fontSize: 12,
      },
      marker: 'square',
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
      .adjust([
        {
          type: 'dodge',
          marginRatio: 0,
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
          `/homepage/Approval-Process-Center?alertOwnerId=${alertOwnerId}&alertStatusDesc=${alertStatusDesc}&proStartDate=${proStartDate}&proEndDate=${proEndDate}`,
        );
      }
    });
    this.setState({ approvalAllChart });
  };

  // 渲染Approval Personal柱状图
  renderApprovalPerChart = () => {
    const { proStartDate, proEndDate } = this.state;
    const { perApprovalData } = this.props;
    const ApprovalPersonal = [
      { label: 'Outstanding', value: perApprovalData[0].allOutstandingNum },
      { label: 'Calimed', value: perApprovalData[0].myClaimedNum },
      { label: 'Processing', value: perApprovalData[0].myProcessingNum },
      { label: 'Finished', value: perApprovalData[0].myFinishedNum },
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
          `/homepage/Approval-Process-Center?taskType=myTask&alertOwnerId=${alertOwnerId}&alertStatusDesc=${alertStatusDesc}&proStartDate=${proStartDate}&proEndDate=${proEndDate}`,
        );
      }
    });
    this.setState({ approvalPersonalChart });
  };

  // 渲染Approval Personal饼图
  renderApprovalPerPieChart = () => {
    const { perApprovalData } = this.props;
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
      label: {
        color: '#464C51',
        fontSize: 12,
      },
    });
    approvalPersonalPieChart
      .intervalStack()
      .position('percent')
      .label('percent', {
        offset: -40,
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
    // .size(15)
    approvalPersonalPieChart.render();
    this.setState({ approvalPersonalPieChart });
  };

  // 渲染Submission Status饼图
  renderSubmissionStatusPieChart = () => {
    const { fileCountData } = this.props;
    let submissionStatusCount = 0;
    let submissionStatusPie = [];
    if (fileCountData[0]) {
      const { currentTradeDate, lastTradeDate } = fileCountData[0];
      const currentDate = Object.keys(currentTradeDate)[0];
      const lastDate = Object.keys(lastTradeDate)[0];
      submissionStatusCount = currentTradeDate[currentDate] + lastTradeDate[lastDate];
      submissionStatusPie = [
        {
          label: 'Current Trade Day',
          value: currentTradeDate[currentDate],
          percent: Number((currentTradeDate[currentDate] / submissionStatusCount).toFixed(4)),
          date: currentDate,
        },
        {
          label: 'Last trade date',
          value: lastTradeDate[lastDate],
          percent: Number((lastTradeDate[lastDate] / submissionStatusCount).toFixed(4)),
          date: lastDate,
        },
      ];
    }
    const submissionStatusPieChart = new G2.Chart({
      container: 'submissionStatusPie',
      forceFit: true,
      height: 300,
      padding: [50, 20, 20, 0],
    });
    submissionStatusPieChart.source(submissionStatusPie, {
      percent: {
        formatter: val => {
          const value = `${val * 100}%`;
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
        const value = `${percent * 100}%`;
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
    submissionStatusPieChart.render();
    submissionStatusPieChart.on('interval:click', ev => {
      const clickData = ev.data;
      if (clickData) {
        // eslint-disable-next-line no-underscore-dangle
        const tradeDate = clickData._origin.date;
        const { dispatch } = this.props;
        dispatch({
          type: 'dashboard/getOutstandingReportFileCount',
          payload: {
            tradeDate,
          },
        });
        dispatch({
          type: 'dashboard/getLateReportFileCount',
          payload: {
            tradeDate,
          },
          callback: () => {
            const { lateReportFileCount, outstandingReportFileCount } = this.props;
            const submissionStatusBar = [];
            lateReportFileCount.forEach(item => {
              submissionStatusBar.push({
                label: 'Late report',
                value: item.count,
                type: item.market,
              });
            });
            outstandingReportFileCount.forEach(item => {
              submissionStatusBar.push({
                label: 'Outstanding reports',
                value: item.count,
                type: item.market,
              });
            });
            this.state.submissionStatusBarChart.source(submissionStatusBar);
            this.state.submissionStatusBarChart.repaint();
          },
        });
      }
    });
    this.setState({ submissionStatusPieChart });
  };

  // 渲染Submission Status柱图
  renderSubmissionStatusBarChart = () => {
    const { lateReportFileCount, outstandingReportFileCount } = this.props;
    const submissionStatusBar = [];
    lateReportFileCount.forEach(item => {
      submissionStatusBar.push({
        label: 'Late report',
        value: item.count,
        type: item.market,
      });
    });
    outstandingReportFileCount.forEach(item => {
      submissionStatusBar.push({
        label: 'Outstanding reports',
        value: item.count,
        type: item.market,
      });
    });
    const submissionStatusBarChart = new G2.Chart({
      container: 'submissionStatusBar',
      forceFit: true,
      height: 300,
      padding: [50, 20, 20, 50],
    });
    submissionStatusBarChart.source(submissionStatusBar);
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
      .size(35)
      .adjust([
        {
          type: 'dodge',
          marginRatio: 1 / 32,
        },
      ]);
    submissionStatusBarChart.render();
    submissionStatusBarChart.on('interval:click', ev => {
      const clickData = ev.data;
      if (clickData) {
        // eslint-disable-next-line no-underscore-dangle
        // const alertOwnerId = localStorage.getItem('loginName');
      }
    });
    this.setState({ submissionStatusBarChart });
  };

  // 渲染market饼图
  renderMarketPieChart = () => {
    const { marketData } = this.props;
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
    const marketPieChart = new G2.Chart({
      container: 'marketPie',
      forceFit: true,
      height: 180,
      padding: [10, 5, 10, 5],
    });
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
    marketPieChart.render();
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
          callback: values => {
            const marketRose = [];
            values.forEach(item => {
              marketRose.push({
                label: item.biCategory,
                value: Number(item.count),
              });
            });
            this.state.marketRoseChart.source(marketRose);
            this.state.marketRoseChart.repaint();
          },
        });
      }
    });
    this.setState({ marketPieChart });
  };

  // 渲染market南丁格尔玫瑰图
  renderMarketRoseChart = () => {
    const { marketDataByCategory } = this.props;
    const marketRose = [];
    marketDataByCategory.forEach(item => {
      marketRose.push({
        label: item.biCategory,
        value: Number(item.count),
      });
    });
    const marketRoseChart = new G2.Chart({
      container: 'marketRose',
      forceFit: true,
      height: 210,
      padding: [10, 75, 10, 75],
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
      offsetX: -17,
      offsetY: 20,
    });
    marketRoseChart.axis(false);
    marketRoseChart
      .interval()
      .position('label*value')
      .color('label', ['#10416C', '#0D87D4']);
    marketRoseChart.render();
    this.setState({ marketRoseChart });
  };

  // 渲染 processing stage 条形图
  renderProcessingStageBarChart = () => {
    const { processingStageData } = this.props;
    const processingStageBar = [
      {
        label: 'Fail submission',
        type: 'Number of Files',
        value: processingStageData[0]['Fail submission'],
      },
      {
        label: 'Failed validation',
        type: 'Number of Files',
        value: processingStageData[0]['Failed validation'],
      },
      {
        label: 'In validation',
        type: 'Number of Files',
        value: processingStageData[0]['In validation'],
      },
      { label: 'Processed', type: 'Number of Files', value: processingStageData[0].Processed },
      {
        label: 'Ready for Processing',
        type: 'Number of Files',
        value: processingStageData[0]['Ready for Processing'],
      },
    ];
    const processingStageBarChart = new G2.Chart({
      container: 'processingStageBar', // div ID
      forceFit: true, // 是否自适应宽度
      height: 170, // 画布高度
      padding: [20, 20, 40, 140], // 上下左右的padding
    });
    processingStageBarChart.source(processingStageBar);
    processingStageBarChart.legend({
      position: 'top-center', // 设置图例的显示位置
      label: {
        color: '#464C51', // 图例的字体颜色
        fontSize: 12,
      },
    });
    processingStageBarChart.scale('value', {
      alias: 'Number of Files',
    });
    processingStageBarChart.scale('label', {
      alias: 'Processing_Stage',
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
        offset: 30,
      },
    });
    processingStageBarChart.axis('label', {
      label: {
        offset: 2,
        color: '#464C51',
        fontSize: 12,
      },
      line: {
        lineWidth: 0.5, // 设置线的宽度
      },
      title: {
        offset: 130,
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
      .size(12)
      .label('value', {
        textStyle: {
          fill: '#464C51',
          fontSize: 11,
        },
        offset: 2,
      });
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
      lateReportFileCount,
      outstandingReportFileCount,
      marketData,
      marketDataByCategory,
      processingStageData,

      allApprovalData,
      perApprovalData,

      dispatch,
    } = this.props;

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

    let isRender1 = false;
    if (processingStageData[0]) {
      Object.keys(processingStageData[0]).forEach(item => {
        if (processingStageData[0][item] > 0) {
          isRender1 = true;
        }
      });
    }

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
      submissionStatusPieChart,
      marketPieChart,
      processingStageBarChart,
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
                            this.setState(
                              {
                                alertState: 'ALL',
                              },
                              () => {
                                if (allAlterData[0]) {
                                  this.renderAlterAllChart(allAlterData);
                                }
                              },
                            );
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
                            this.setState(
                              {
                                alertState: 'PER',
                              },
                              () => {
                                if (
                                  perAlertData[0] &&
                                  (perAlertData[0].Claimed !== 0 ||
                                    perAlertData[0].Finished !== 0 ||
                                    perAlertData[0].Outstanding !== 0 ||
                                    perAlertData[0].Processing !== 0)
                                ) {
                                  this.renderAlterPerChart();
                                }
                              },
                            );
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
                                  params.period = 1;
                                }
                                if (this.state.textActive === 'Today') {
                                  const startDate1 = moment().format('YYYYMMDD');
                                  const endDate1 = moment().format('YYYYMMDD');
                                  this.setState({
                                    startDate: startDate1,
                                    endDate: endDate1,
                                  });
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
                                  params.period = 2;
                                }
                                if (this.state.textActive === 'Week') {
                                  const startDate1 = moment(
                                    new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
                                  ).format('YYYYMMDD');
                                  const endDate1 = moment().format('YYYYMMDD');
                                  this.setState({
                                    startDate: startDate1,
                                    endDate: endDate1,
                                  });
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
                          style={{ width: 300 }}
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
                              <img src={ring} alt="" width={70} />
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
                              </span>
                              {/* <div id="allClaimed"></div> */}
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Processing</span>
                              <span className={styles.value}>{allProcessingAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <img src={ring} alt="" width={70} />
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
                              </span>
                            </div>
                          </div>
                        </div>
                        {!allAlterData[0] && (
                          <div className={styles.empty} style={{ height: 250 }}>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          </div>
                        )}
                        <div
                          id="AlterAll"
                          style={{ display: !allAlterData[0] ? 'none' : 'block' }}
                        ></div>
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
                              <img src={ring} alt="" width={70} />
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
                              </span>
                            </div>
                          </div>
                          <div className={styles.blackBox}>
                            <div className={styles.leftBlock}>
                              <span className={styles.title}>Processing</span>
                              <span className={styles.value}>{perProcessingAlertCount}</span>
                            </div>
                            <div className={styles.rightBlock}>
                              <img src={ring} alt="" width={70} />
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
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          id="AlterPersonal"
                          style={{
                            display:
                              perAlertData[0] &&
                              (perAlertData[0].Claimed !== 0 ||
                                perAlertData[0].Finished !== 0 ||
                                perAlertData[0].Outstanding !== 0 ||
                                perAlertData[0].Processing !== 0)
                                ? 'block'
                                : 'none',
                          }}
                        ></div>
                        {!(
                          perAlertData[0] &&
                          (perAlertData[0].Claimed !== 0 ||
                            perAlertData[0].Finished !== 0 ||
                            perAlertData[0].Outstanding !== 0 ||
                            perAlertData[0].Processing !== 0)
                        ) && (
                          <div className={styles.empty} style={{ height: 250 }}>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          </div>
                        )}
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
                                    router.push(`/homepage/alert-center?alertId=${item.alertId}`);
                                  }}
                                >
                                  {item.alertDesc}
                                </span>
                                <span className={styles.date}>
                                  {/* {item.updateTime} */}
                                  {item.updateTime &&
                                    moment(item.updateTime).format(timestampFormat)}
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
                            renderItem={(item, index) => (
                              <List.Item>
                                <span
                                  title={item.details}
                                  className={styles.description}
                                  onClick={() => {
                                    router.push(
                                      `/homepage/Approval-Process-Center?taskCode=${item.taskCode}`,
                                    );
                                  }}
                                >
                                  {item.details}
                                </span>
                                <span className={classNames(styles.user, styles[`color${index}`])}>
                                  {item.owner &&
                                    item.owner.match(/[A-Z]/g) &&
                                    item.owner.match(/[A-Z]/g).join('')}
                                </span>
                                <span className={styles.date}>
                                  {moment(item.updateDate).format(timestampFormat)}
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
                            this.setState(
                              {
                                approvalState: 'ALL',
                              },
                              () => {
                                if (
                                  allApprovalData[0] &&
                                  allApprovalData[0].userInfo &&
                                  allApprovalData[0].userInfo[0]
                                ) {
                                  this.renderApprovalAllChart();
                                }
                              },
                            );
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
                            this.setState(
                              {
                                approvalState: 'PER',
                              },
                              () => {
                                if (
                                  perApprovalData[0] &&
                                  (!!perApprovalData[0].allOutstandingNum ||
                                    !!perApprovalData[0].myClaimedNum ||
                                    !!perApprovalData[0].myProcessingNum ||
                                    !!perApprovalData[0].myFinishedNum)
                                ) {
                                  this.renderApprovalPerChart();
                                }
                                if (
                                  perApprovalData[0] &&
                                  (!!perApprovalData[0].myApprovedNum ||
                                    !!perApprovalData[0].myRejectedNum ||
                                    !!perApprovalData[0].myTerminatedNum)
                                ) {
                                  this.renderApprovalPerPieChart();
                                }
                              },
                            );
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
                          style={{ width: 300 }}
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
                              <img src={ring} alt="" width={70} />
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
                              </span>
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
                              <img src={ring} alt="" width={70} />
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
                              </span>
                            </div>
                          </div>
                        </div>
                        {!(
                          allApprovalData[0] &&
                          allApprovalData[0].userInfo &&
                          allApprovalData[0].userInfo[0]
                        ) && (
                          <div className={styles.empty} style={{ height: 250 }}>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          </div>
                        )}
                        <div
                          id="ApprovalAll"
                          style={{
                            display: !(
                              allApprovalData[0] &&
                              allApprovalData[0].userInfo &&
                              allApprovalData[0].userInfo[0]
                            )
                              ? 'none'
                              : 'block',
                          }}
                        ></div>
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
                              <img src={ring} alt="" width={70} />
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
                              </span>
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
                              <img src={ring} alt="" width={70} />
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
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                          }}
                        >
                          {!(
                            perApprovalData[0] &&
                            (!!perApprovalData[0].allOutstandingNum ||
                              !!perApprovalData[0].myClaimedNum ||
                              !!perApprovalData[0].myProcessingNum ||
                              !!perApprovalData[0].myFinishedNum)
                          ) && (
                            <div className={styles.empty} style={{ height: 250, flex: 3 }}>
                              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </div>
                          )}
                          <div
                            id="ApprovalPersonal"
                            style={{
                              flex: 3,
                              display: !(
                                perApprovalData[0] &&
                                (!!perApprovalData[0].allOutstandingNum ||
                                  !!perApprovalData[0].myClaimedNum ||
                                  !!perApprovalData[0].myProcessingNum ||
                                  !!perApprovalData[0].myFinishedNum)
                              )
                                ? 'none'
                                : 'block',
                            }}
                          ></div>
                          {!(
                            perApprovalData[0] &&
                            (!!perApprovalData[0].myApprovedNum ||
                              !!perApprovalData[0].myRejectedNum ||
                              !!perApprovalData[0].myTerminatedNum)
                          ) && (
                            <div className={styles.empty} style={{ height: 250, flex: 2 }}>
                              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </div>
                          )}
                          <div
                            id="ApprovalPersonalPie"
                            style={{
                              flex: 2,
                              display: !(
                                perApprovalData[0] &&
                                (!!perApprovalData[0].myApprovedNum ||
                                  !!perApprovalData[0].myRejectedNum ||
                                  !!perApprovalData[0].myTerminatedNum)
                              )
                                ? 'none'
                                : 'block',
                            }}
                          ></div>
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
                                    router.push(`/homepage/alert-center?alertId=${item.alertId}`);
                                  }}
                                >
                                  {item.alertDesc}
                                </span>
                                <span className={styles.date}>
                                  {/* {item.updateTime} */}
                                  {item.updateTime &&
                                    moment(item.updateTime).format(timestampFormat)}
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
                            renderItem={(item, index) => (
                              <List.Item>
                                <span
                                  title={item.details}
                                  className={styles.description}
                                  onClick={() => {
                                    router.push(
                                      `/homepage/Approval-Process-Center?taskCode=${item.taskCode}`,
                                    );
                                  }}
                                >
                                  {item.details}
                                </span>
                                <span className={classNames(styles.user, styles[`color${index}`])}>
                                  {item.owner &&
                                    item.owner.match(/[A-Z]/g) &&
                                    item.owner.match(/[A-Z]/g).join('')}
                                </span>
                                <span className={styles.date}>
                                  {moment(item.updateDate).format(timestampFormat)}
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
                      <h3 className={styles.groupTitle}>Submission Status</h3>
                      <div
                        id="submissionStatusPie"
                        style={{
                          display:
                            !currentTradeDate ||
                            !lastTradeDate ||
                            !currentDate ||
                            !lastDate ||
                            (currentTradeDate &&
                              currentDate &&
                              currentTradeDate[currentDate] === 0) ||
                            (lastTradeDate && lastDate && lastTradeDate[lastDate] === 0)
                              ? 'none'
                              : 'block',
                        }}
                      ></div>
                      {(!currentTradeDate ||
                        !lastTradeDate ||
                        !currentDate ||
                        !lastDate ||
                        (currentTradeDate && currentDate && currentTradeDate[currentDate] === 0) ||
                        (lastTradeDate && lastDate && lastTradeDate[lastDate] === 0)) && (
                        <div className={styles.empty} style={{ height: 300 }}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: '1 1', minHeight: 250 }}>
                      <div
                        id="submissionStatusBar"
                        style={{ display: !isRender ? 'none' : 'block' }}
                      ></div>
                      {!isRender && (
                        <div className={styles.empty} style={{ height: 300 }}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Number of Outstanding Cases */}
                  <div className={styles.outstandingCases}>
                    <h3 className={styles.groupTitle}>NO. of Outstanding Cases(Investigating)</h3>

                    <div className={styles.empty}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  </div>
                </div>
                {/* 右侧 */}
                <div className={styles.rightSide}>
                  {/* reported */}
                  <div className={styles.reported}>
                    <div style={{ flex: 1 }}>
                      <h3
                        className={styles.groupTitle}
                        title="Number of reported LOP holders in SEHK and HKFE"
                      >
                        Number of reported LOP holders in SEHK and HKFE
                      </h3>
                      <div
                        id="marketPie"
                        style={{
                          display: !marketData[0] ? 'none' : 'block',
                        }}
                      ></div>
                      {!marketData[0] && (
                        <div className={styles.empty} style={{ height: 180 }}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        id="marketRose"
                        style={{
                          display: !marketDataByCategory[0] ? 'none' : 'block',
                        }}
                      ></div>
                      {!marketDataByCategory[0] && (
                        <div className={styles.empty} style={{ height: 200 }}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Processing Stage */}
                  <div className={styles.processingStage}>
                    <h3 className={styles.groupTitle}>Processing Stage</h3>
                    <div
                      id="processingStageBar"
                      style={{
                        display: !isRender1 ? 'none' : 'block',
                      }}
                    ></div>
                    {!isRender1 && (
                      <div className={styles.empty} style={{ height: 170 }}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
