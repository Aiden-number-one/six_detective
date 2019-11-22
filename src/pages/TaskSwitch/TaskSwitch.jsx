import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Modal } from 'antd';

import { connect } from 'dva';
import ClassifyTree from '../../components/ClassifyTree';
import styles from './TaskSwitch.less';
import Add from './components/Add';
import Modify from './components/Modify';

const NewAdd = Form.create({})(Add);
const NewModify = Form.create({})(Modify);
@connect(({ taskSwitch, loading }) => ({
  loading: loading.effects['taskSwitch/getFolderMenuList'],
  getFolderMenuListData: taskSwitch.data,
  orgs: taskSwitch.orgs,
}))
class TaskSwitch extends Component {
  state = {
    addVisible: false,
    modifyVisible: false,
    deleteVisible: false,
  };

  componentDidMount() {
    this.getFolderMenuList();
  }

  getFolderMenuList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskSwitch/queryOrgs',
      params: {
        treeLevel: '2',
      },
    });
    // const params = {
    //   fileType: '1',
    // };
    // dispatch({
    //   type: 'taskSwitch/getFolderMenuList',
    //   payload: params,
    // });
  };

  /**
   * @description: This is a add function.
   * @param {type} null
   * @return: undefined
   */
  handleAddTree = (value, nodeTree) => {
    console.log('nodeTree=', nodeTree);
    this.setState({
      addVisible: value,
    });
  };

  adddConfirm = () => {
    this.setState({
      addVisible: false,
    });
  };

  addCancel = () => {
    this.setState({
      addVisible: false,
    });
  };
  /**
   * @description: This is a modify function.
   * @param {type} null
   * @return: undefined
   */

  handleModifyTree = (value, nodeTree) => {
    console.log('modify', value, nodeTree);
    this.setState({
      modifyVisible: value,
    });
  };

  modifyConfirm = () => {
    this.setState({
      modifyVisible: false,
    });
  };

  modifyCancel = () => {
    this.setState({
      modifyVisible: false,
    });
  };

  /**
   * @description: This is a delete function.
   * @param {type} null
   * @return: undefined
   */
  handleDeleteTree = (value, nodeTree) => {
    console.log('delete', nodeTree);
    this.setState({
      deleteVisible: value,
    });
  };

  deleteConfirm = () => {
    this.setState({
      deleteVisible: false,
    });
  };

  deleteCancel = () => {
    this.setState({
      deleteVisible: false,
    });
  };

  onSelect = key => {
    console.log('key=', key);
  };

  render() {
    const { orgs } = this.props;
    const { addVisible, modifyVisible, deleteVisible } = this.state;
    return (
      <PageHeaderWrapper>
        <div className={styles.taskSwitchWraper}>
          <div className={styles.sidebar}>
            <ClassifyTree
              treeData={orgs}
              treeKey={{
                currentKey: 'departmentId',
                currentName: 'departmentName',
                parentKey: 'parentDepartmentId',
              }}
              handleAddTree={this.handleAddTree}
              handleModifyTree={this.handleModifyTree}
              handleDeleteTree={this.handleDeleteTree}
              onSelect={this.onSelect}
            ></ClassifyTree>
            {/* 添加 */}
            <Modal
              title="提示"
              visible={addVisible}
              onOk={this.adddConfirm}
              onCancel={this.addCancel}
            >
              <NewAdd />
            </Modal>
            {/* 修改 */}
            <Modal
              title="提示"
              visible={modifyVisible}
              onOk={this.modifyConfirm}
              onCancel={this.modifyCancel}
            >
              <NewModify />
            </Modal>
            {/* 删除 */}
            <Modal
              title="提示"
              visible={deleteVisible}
              onOk={this.deleteConfirm}
              onCancel={this.deleteCancel}
            >
              <span>是否删除</span>
            </Modal>
          </div>
          <div className={styles.main}>task</div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default TaskSwitch;
