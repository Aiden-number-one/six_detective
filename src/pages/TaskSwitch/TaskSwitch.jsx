import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Modal } from 'antd';

import { connect } from 'dva';
import LeftClassifyTree from '../../components/LeftClassifyTree';
import styles from './TaskSwitch.less';
import Add from './components/Add';

const NewAdd = Form.create({})(Add);
@connect(({ taskSwitch, loading }) => ({
  loading: loading.effects['taskSwitch/getFolderMenuList'],
  getFolderMenuListData: taskSwitch.data,
}))
class TaskSwitch extends Component {
  state = {
    addVisible: false,
  };

  componentDidMount() {
    this.getFolderMenuList();
  }

  getFolderMenuList = () => {
    const { dispatch } = this.props;
    const params = {
      fileType: '1',
    };
    dispatch({
      type: 'taskSwitch/getFolderMenuList',
      payload: params,
    });
  };

  handleAddTree = value => {
    this.setState({
      addVisible: value,
    });
  };

  handleModifyTree = () => {
    console.log('modify');
  };

  handleDeleteTree = () => {
    console.log('delete');
  };

  render() {
    const { getFolderMenuListData } = this.props;
    const { addVisible } = this.state;

    return (
      <PageHeaderWrapper>
        <div className={styles.taskSwitchWraper}>
          <div className={styles.sidebar}>
            <LeftClassifyTree
              getFolderMenuListData={getFolderMenuListData}
              handleAddTree={this.handleAddTree}
              handleModifyTree={this.handleModifyTree}
              handleDeleteTree={this.handleDeleteTree}
            ></LeftClassifyTree>
            {/* 添加 */}
            <Modal
              title="提示"
              visible={addVisible}
              onOk={this.adddConfirm}
              onCancel={this.addCancel}
            >
              <NewAdd />
            </Modal>
          </div>
          <div className={styles.main}>task</div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default TaskSwitch;
