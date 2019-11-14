import React, { Component } from 'react';
import { Tabs, Modal } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';

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
    // modifyVisible: false,
  };

  componentDidMount() {}

  callback = key => {
    console.log(key);
  };

  render() {
    const {
      modifyVisible,
      basicModifyForm,
      planModifyForm,
      selectedRows,
      modifyConfirm,
      modifyCancel,
    } = this.props;
    return (
      <Modal
        title="修改调度计划"
        visible={modifyVisible}
        onOk={modifyConfirm}
        onCancel={modifyCancel}
      >
        <Tabs
          defaultActiveKey="1"
          onChange={this.callback}
          style={{ marginTop: '-26px', textAlign: 'center' }}
        >
          <TabPane tab="基本信息" key="1">
            <BasicModifyForm ref={basicModifyForm} selectedRows={selectedRows} />
          </TabPane>
          <TabPane tab="计划设置" key="2">
            <PlanModifyForm ref={planModifyForm} selectedRows={selectedRows} />
          </TabPane>
        </Tabs>
        ,
      </Modal>
    );
  }
}

export default Modify;
