import React, { Component } from 'react';
import { Tabs, Modal } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';
// import SearchForm from './compontents/SearchForm';

import BasicModifyForm from './BasicModifyForm';

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
  //   searchForm = React.createRef();

  componentDidMount() {}

  callback = key => {
    console.log(key);
  };

  render() {
    const { modifyVisible, modifyConfirm, modifyCancel } = this.props;
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
            <BasicModifyForm />
          </TabPane>
          <TabPane tab="计划设置" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
        ,
      </Modal>
    );
  }
}

export default Modify;
