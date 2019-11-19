import React, { Component } from 'react';
import { Tabs, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import BasicAddForm from './BasicAddForm';
import PlanAddForm from './PlanAddForm';

const { TabPane } = Tabs;

// import styles from './Scheduling.less';

@connect(({ schedule, loading }) => ({
  loading: loading.effects['schedule/getScheduleList'],
  scheduleListData: schedule.scheduleList,
}))
class Add extends Component {
  state = {
    folderId: '',
  };

  basicAddForm = React.createRef();

  planAddForm = React.createRef();

  componentDidMount() {}

  modifyOk = () => {
    const { folderId } = this.state;
    let params = {};
    let isErr = false;
    this.basicAddForm.current.validateFields((err, values) => {
      if (!err) {
        const validStartDate = values.validDate
          ? moment(values.validDate[0]).format('YYYYMMDDHHmmss')
          : '';
        const validEndDate = values.validDate
          ? moment(values.validDate[1]).format('YYYYMMDDHHmmss')
          : '';
        params = {
          scheduleName: values.scheduleName,
          jobId: folderId,
          startFlag: '2',
          scheduleDesc: values.scheduleDesc,
          validStartDate,
          validEndDate,
        };
      } else {
        isErr = true;
      }
    });
    this.planAddForm.current.validateFields((err, values) => {
      if (!err) {
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
      } else {
        isErr = true;
      }
      // console.log('err--', err);
    });
    // console.log('params---最终表单数据--', params);
    if (!isErr) {
      this.addSchedule(params);
      this.props.addCancel();
    }
  };

  // 调度设计修改接口
  addSchedule = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'schedule/addScheduleBatch',
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
    const { addVisible, addCancel, folderMenuData } = this.props;
    return (
      <Modal
        title="新增调度计划"
        visible={addVisible}
        onOk={this.modifyOk}
        onCancel={addCancel}
        width={700}
      >
        <Tabs defaultActiveKey="3" style={{ marginTop: '-26px', textAlign: 'center' }}>
          <TabPane tab="基本信息" key="3">
            <BasicAddForm
              ref={this.basicAddForm}
              folderMenuData={folderMenuData}
              selectChange={this.selectChange}
            />
          </TabPane>
          <TabPane tab="计划设置" key="4">
            <PlanAddForm ref={this.planAddForm} />
          </TabPane>
        </Tabs>
        ,
      </Modal>
    );
  }
}

export default Add;
