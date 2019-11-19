import React, { Component } from 'react';
import { Tabs, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import BasicModifyForm from './BasicModifyForm';
import PlanModifyForm from './PlanModifyForm';

const { TabPane } = Tabs;

// import styles from './Scheduling.less';

@connect(({ schedule, loading }) => ({
  loading: loading.effects['schedule/getScheduleList'],
  scheduleListData: schedule.scheduleList,
}))
class Modify extends Component {
  state = {
    folderId: '',
  };

  basicModifyForm = React.createRef();

  planModifyForm = React.createRef();

  componentDidMount() {}

  modifyOk = () => {
    const { folderId } = this.state;
    const { selectedRows } = this.props;
    let params = {};
    this.basicModifyForm.current.validateFields((err, values) => {
      const validStartDate = values.validDate
        ? moment(values.validDate[0]).format('YYYYMMDDHHmmss')
        : '';
      const validEndDate = values.validDate
        ? moment(values.validDate[1]).format('YYYYMMDDHHmmss')
        : '';
      params = {
        scheduleId: selectedRows[0].scheduleId,
        scheduleName: values.scheduleName,
        jobId: folderId,
        scheduleDesc: values.scheduleDesc,
        validStartDate,
        validEndDate,
      };
    });
    this.planModifyForm.current.validateFields((err, values) => {
      const validDate = values.executeTime
        ? moment(values.executeTime).format('YYYYMMDDHHmmss')
        : '';
      const params2 = {
        executeTime: validDate,
        cronExpression: values.cronExpression,
        scheduleLaw: values.scheduleLaw,
        scheduleInterval: values.scheduleInterval,
        frequency: values.frequency,
        succeedMailId: values.succeedMailId,
        faultMailId: values.faultMailId,
      };
      Object.assign(params, params2);
    });
    // console.log('params---最终表单数据--', params);
    this.modifySchedule(params);
    this.props.modifyCancel();
  };

  // 调度设计修改接口
  modifySchedule = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'schedule/modifyScheduleBatch',
      payload: params,
      callback: this.props.getSchedul,
    });
  };

  selectChange = (value, node) => {
    // console.log('node--->',node)
    this.setState({
      folderId: node.props.eventKey,
    });
  };

  render() {
    const { modifyVisible, selectedRows, modifyCancel, folderMenuData } = this.props;
    return (
      <Modal
        title="修改调度计划"
        visible={modifyVisible}
        onOk={this.modifyOk}
        onCancel={modifyCancel}
        width={700}
      >
        <Tabs defaultActiveKey="1" style={{ marginTop: '-26px', textAlign: 'center' }}>
          <TabPane tab="基本信息" key="1">
            <BasicModifyForm
              ref={this.basicModifyForm}
              selectedRows={selectedRows}
              folderMenuData={folderMenuData}
              selectChange={this.selectChange}
            />
          </TabPane>
          <TabPane tab="计划设置" key="2">
            <PlanModifyForm ref={this.planModifyForm} selectedRows={selectedRows} />
          </TabPane>
        </Tabs>
        ,
      </Modal>
    );
  }
}

export default Modify;
