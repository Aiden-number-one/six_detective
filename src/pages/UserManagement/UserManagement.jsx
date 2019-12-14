/*
 * @Description: This is for userManagement page.
 * @Author: dailinbo
 * @Date: 2019-11-12 19:03:58
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-12-14 14:47:50
 */

import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Modal, Table, Button, Drawer, message, Pagination } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './UserManagement.less';
import { passWordStrength } from '@/utils/utils';
import { timeFormat } from '@/utils/filter';
import IconFont from '@/components/IconFont';

import SearchForm from './components/SearchForm';
import NewUser from './components/NewUser';
import AddForm from './components/AddForm';
import ModifyForm from './components/ModifyForm';
import PasswordForm from './components/PasswordForm';
import ResetPasswordForm from './components/ResetPasswordForm';

const NewSearchForm = Form.create({})(SearchForm);
const NewUserForm = Form.create({})(AddForm);
const NewUpdateForm = Form.create({})(ModifyForm);
const NewPasswordForm = Form.create({})(PasswordForm);
const NewResetPasswordForm = Form.create({})(ResetPasswordForm);

@connect(({ userManagement, loading }) => ({
  loading: loading.effects,
  userManagementData: userManagement.data,
  orgs: userManagement.orgs,
  modifyUserData: userManagement.updateData,
}))
class UserManagement extends Component {
  state = {
    visible: false,
    userTitle: 'New User',
    NewFlag: true,
    updateVisible: false,
    deleteVisible: false,
    closingVisible: false,
    updatePasswordVisible: false,
    resetPasswordVisible: false,
    customerno: null,
    searchUserId: undefined,
    searchUserName: undefined,
    userInfo: {
      userId: '',
      userName: '',
    },
    columns: [
      {
        title: formatMessage({ id: 'app.common.number' }),
        dataIndex: 'index',
        key: 'index',
        render: (res, recode, index) => (
          <span>{(this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1}</span>
        ),
      },
      {
        title: formatMessage({ id: 'app.common.userId' }),
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: formatMessage({ id: 'app.common.username' }),
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: formatMessage({ id: 'systemManagement.userMaintenance.lockedStatus' }),
        dataIndex: 'accountLock',
        key: 'accountLock',
      },
      {
        title: formatMessage({ id: 'systemManagement.userMaintenance.LastUpdateTime' }),
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (res, obj) => (
          <div>
            <span>{timeFormat(obj.updateTime).t1}</span>
            <br />
            <span>{timeFormat(obj.updateTime).t2}</span>
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'systemManagement.userMaintenance.LastUpdateUser' }),
        dataIndex: 'updateBy',
        key: 'updateBy',
      },
      {
        title: formatMessage({ id: 'app.common.operation' }),
        dataIndex: 'operation',
        key: 'operation',
        render: (res, obj) => (
          <span className={styles.operation}>
            <a href="#" onClick={() => this.updateUser(res, obj)}>
              <IconFont type="icon-edit" className={styles['btn-icon']} />
            </a>
            <a href="#" onClick={() => this.deleteUser(res, obj)}>
              <IconFont type="icon-delete" className={styles['btn-icon']} />
            </a>
          </span>
        ),
      },
    ],
    page: {
      pageNumber: 1,
      pageSize: 10,
    },
  };

  newDepartmentId = '';

  searchForm = React.createRef();

  formRef = React.createRef();

  updateFormRef = React.createRef();

  passwordFormRef = React.createRef();

  resetPasswordFormRef = React.createRef();

  componentDidMount() {
    this.queryUserList();
    // this.queryDepartments();
  }

  /**
   * @description: This is for query user list function.
   * @param {type} null
   * @return: undefined
   */
  queryUserList = () => {
    const { dispatch } = this.props;
    const { searchUserId, searchUserName } = this.state;
    const params = {
      userId: searchUserId,
      userName: searchUserName,
      operType: 'queryAllList',
      pageNumber: this.state.page.pageNumber.toString(),
      pageSize: this.state.page.pageSize.toString(),
    };
    dispatch({
      type: 'userManagement/userManagemetDatas',
      payload: params,
    });
  };

  /**
   * @description: This is for query departments function.
   * @param {type} null
   * @return: undefined
   */
  queryDepartments = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManagement/queryOrgs',
      params: {
        treeLevel: '2',
      },
    });
  };

  /**
   * @description: This is for get the departmentId and set value to the newDepartmentId function.
   * @param {type} departmentId
   * @return: undefined
   */
  getDepartmentId = departmentId => {
    this.newDepartmentId = departmentId;
  };

  /**
   * @description: This is for reset form function.
   * @param {type} null
   * @return: undefined
   */
  newUser = () => {
    this.setState({
      visible: true,
      userTitle: 'New User',
      NewFlag: true,
      userInfo: {},
    });
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: '/system-management/user-maintenance/new-user',
    //   }),
    // );
  };

  addConfrim = () => {
    this.setState({
      visible: false,
    });
    const { pageSize } = this.state.page;
    const page = {
      pageNumber: 1,
      pageSize,
    };
    this.setState(
      {
        page,
      },
      () => {
        this.queryUserList();
      },
    );
  };

  addCancel = () => {
    this.setState({ visible: false });
  };

  /**
   * @description: This is for update user function.
   * @param {type} null
   * @return: undefined
   */
  updateUser = (res, obj) => {
    console.log('res=======', res);
    console.log('obj============', obj);
    const userInfo = {
      userName: obj.userName,
      userId: obj.userId,
      accountLock: obj.accountLock,
    };
    this.setState({
      visible: true,
      userTitle: 'Modify User',
      NewFlag: false,
      userInfo,
    });
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: '/system-management/user-maintenance/modify-user',
    //     query: {
    //       userId: obj.userId,
    //       userName: obj.userName,
    //       userState: obj.userState,
    //     },
    //   }),
    // );
    // this.setState({
    //   updateVisible: true,
    //   userInfo,
    //   customerno: obj.customerno,
    // });
  };

  updateConfirm = () => {
    const { dispatch } = this.props;
    const { customerno } = this.state;
    this.updateFormRef.current.validateFields((err, values) => {
      const param = {
        custCustomerno: customerno,
        loginName: values.login,
        customerName: values.name,
        departmentId: this.newDepartmentId || this.state.userInfo.departmentId,
        email: values.email,
      };
      dispatch({
        type: 'userManagement/updateUserModelDatas',
        payload: param,
        callback: () => {
          this.queryUserList();
        },
      });
    });
    this.setState({
      updateVisible: false,
    });
  };

  updateCancel = () => {
    this.setState({
      updateVisible: false,
    });
  };

  /**
   * @description: This is for lock user function.
   * @param {type} null
   * @return: undefined
   */
  deleteUser = (res, obj) => {
    console.log('delete=', res, obj);
    const userInfo = {
      userName: obj.userName,
      userId: obj.userId,
      accountLock: obj.accountLock,
    };
    this.setState({
      deleteVisible: true,
      userInfo,
    });
  };

  deleteConfirm = () => {
    const { dispatch } = this.props;
    const params = {
      operType: 'deleteUserById',
      userId: this.state.userInfo.userId,
    };
    dispatch({
      type: 'userManagement/updateUserModelDatas',
      payload: params,
      callback: () => {
        message.success('delete success');
        this.queryUserList();
        this.setState({
          deleteVisible: false,
        });
        //   this.props.history.push({
        //     pathname: '/system-management/user-maintenance',
        //     params: values,
        //   });
      },
    });
  };

  deleteCancel = () => {
    this.setState({
      deleteVisible: false,
    });
  };

  /**
   * @description: This is for closing user function.
   * @param {type} null
   * @return: undefined
   */
  closingUser = () => {
    this.setState({
      closingVisible: true,
    });
  };

  closingConfirm = () => {
    const { dispatch } = this.props;
    const param = {
      operationType: '3',
    };
    dispatch({
      type: 'userManagement/operationUserModelDatas',
      payload: param,
      callback: () => {
        this.queryUserList();
        this.setState({
          closingVisible: false,
        });
      },
    });
  };

  closingCancel = () => {
    this.setState({
      closingVisible: false,
    });
  };

  /**
   * @description: This is for update password function.
   * @param {type} null
   * @return: undefined
   */
  updatePassword = () => {
    this.setState({
      updatePasswordVisible: true,
    });
  };

  updatePasswordConfirm = () => {
    const { dispatch } = this.props;
    const { customerno } = this.state;
    this.passwordFormRef.current.validateFields((err, values) => {
      const passwordStrength = passWordStrength(values.password);
      const param = {
        custCustomerno: customerno,
        operationType: '5',
        oldPassword: window.kddes.getDes(values.oldPassword),
        password: window.kddes.getDes(values.password),
        passwordStrength,
      };
      dispatch({
        type: 'userManagement/operationUserModelDatas',
        payload: param,
        callback: () => {
          this.setState({
            updatePasswordVisible: false,
          });
        },
      });
    });
  };

  updatePasswordCancel = () => {
    this.setState({
      updatePasswordVisible: false,
    });
  };

  /**
   * @description: This is for reset password function.
   * @param {type} null
   * @return: undefined
   */
  resetPassword = () => {
    this.setState({
      resetPasswordVisible: true,
    });
  };

  resetPasswordConfirm = () => {
    const { dispatch } = this.props;
    this.resetPasswordFormRef.current.validateFields((err, values) => {
      const passwordStrength = passWordStrength(values.password);
      const param = {
        operationType: '6',
        password: window.kddes.getDes(values.password),
        passwordStrength,
      };
      dispatch({
        type: 'userManagement/operationUserModelDatas',
        payload: param,
        callback: () => {
          this.setState({
            resetPasswordVisible: false,
          });
        },
      });
    });
  };

  resetPasswordCancel = () => {
    this.setState({
      resetPasswordVisible: false,
    });
  };

  /**
   * @description: This is for query userinfo log function.
   * @param {type} null
   * @return: undefined
   */
  queryLog = () => {
    const { page } = this.state;
    const newPage = {
      pageNumber: 1,
      pageSize: page.pageSize,
    };
    this.setState({
      page: newPage,
    });
    this.searchForm.current.validateFields((err, values) => {
      this.setState(
        {
          searchUserId: values.userId,
          searchUserName: values.userName,
        },
        () => {
          this.queryUserList();
        },
      );
    });
  };

  /**
   * @description: This is for paging function.
   * @param {type} null
   * @return: undefined
   */
  pageChange = (pageNumber, pageSize) => {
    const page = {
      pageNumber,
      pageSize,
    };

    this.setState(
      {
        page,
      },
      () => {
        this.queryUserList();
      },
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const page = {
      pageNumber: current,
      pageSize,
    };
    this.setState(
      {
        page,
      },
      () => {
        this.queryUserList();
      },
    );
  };

  render() {
    const { loading, orgs, userManagementData } = this.props;
    const { userInfo, page, userTitle, NewFlag } = this.state;
    console.log('userManagementData.items=', userManagementData.items);
    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   },
    // };
    return (
      <PageHeaderWrapper>
        <div>
          <div>
            <NewSearchForm
              search={this.queryLog}
              newUser={this.newUser}
              ref={this.searchForm}
            ></NewSearchForm>
          </div>
          <div>
            <Modal
              title="新增用户"
              visible={false}
              onOk={this.addConfrim}
              onCancel={this.addCancel}
              cancelText={formatMessage({ id: 'app.common.cancel' })}
              okText={formatMessage({ id: 'app.common.save' })}
            >
              <NewUserForm
                ref={this.formRef}
                orgs={orgs}
                getDepartmentId={this.getDepartmentId}
              ></NewUserForm>
            </Modal>
            <Drawer
              closable={false}
              title={userTitle}
              width={700}
              onClose={this.addCancel}
              visible={this.state.visible}
            >
              {this.state.visible && (
                <NewUser
                  onCancel={this.addCancel}
                  onSave={this.addConfrim}
                  NewFlag={NewFlag}
                  userInfo={userInfo}
                ></NewUser>
              )}
            </Drawer>
            {/* 修改用户 */}
            <Modal
              title="修改用户"
              visible={this.state.updateVisible}
              onOk={this.updateConfirm}
              onCancel={this.updateCancel}
              cancelText={formatMessage({ id: 'app.common.cancel' })}
              okText={formatMessage({ id: 'app.common.save' })}
            >
              <NewUpdateForm
                ref={this.updateFormRef}
                orgs={orgs}
                userInfo={userInfo}
                getDepartmentId={this.getDepartmentId}
              ></NewUpdateForm>
            </Modal>
            {/* delete */}
            <Modal
              title={formatMessage({ id: 'app.common.confirm' })}
              visible={this.state.deleteVisible}
              onOk={this.deleteConfirm}
              onCancel={this.deleteCancel}
              cancelText={formatMessage({ id: 'app.common.cancel' })}
              okText={formatMessage({ id: 'app.common.confirm' })}
            >
              <span>Please confirm that you want to delete this record?</span>
            </Modal>
            {/* 销户 */}
            <Modal
              title="提示"
              visible={this.state.closingVisible}
              onOk={this.closingConfirm}
              onCancel={this.closingCancel}
              cancelText={formatMessage({ id: 'app.common.cancel' })}
              okText={formatMessage({ id: 'app.common.confirm' })}
            >
              <span>是否销户？</span>
            </Modal>
            {/* 密码修改 */}
            <Modal
              title="密码修改"
              visible={this.state.updatePasswordVisible}
              onOk={this.updatePasswordConfirm}
              onCancel={this.updatePasswordCancel}
              cancelText={formatMessage({ id: 'app.common.cancel' })}
              okText={formatMessage({ id: 'app.common.confirm' })}
            >
              <NewPasswordForm ref={this.passwordFormRef}></NewPasswordForm>
            </Modal>
            {/* 密码重置 */}
            <Modal
              title="密码重置"
              visible={this.state.resetPasswordVisible}
              onOk={this.resetPasswordConfirm}
              onCancel={this.resetPasswordCancel}
              cancelText={formatMessage({ id: 'app.common.cancel' })}
              okText={formatMessage({ id: 'app.common.save' })}
            >
              <NewResetPasswordForm ref={this.resetPasswordFormRef}></NewResetPasswordForm>
            </Modal>
          </div>
          <div className={styles.content}>
            <div className={styles.tableTop}>
              <Button onClick={this.newUser} type="primary" className="btn_usual">
                + New User
              </Button>
            </div>
            <Table
              loading={loading['userManagement/userManagemetDatas']}
              // pagination={{ total: userManagementData.totalCount, pageSize: page.pageSize }}
              // rowSelection={rowSelection}
              // onChange={this.pageChange}
              dataSource={userManagementData.items}
              columns={this.state.columns}
              pagination={false}
            ></Table>
            <Pagination
              current={page.pageNumber}
              showSizeChanger
              showTotal={() =>
                `Page ${(userManagementData.totalCount || 0) && page.pageNumber} of ${Math.ceil(
                  (userManagementData.totalCount || 0) / page.pageSize,
                )}`
              }
              onShowSizeChange={this.onShowSizeChange}
              onChange={this.pageChange}
              total={userManagementData.totalCount}
              pageSize={page.pageSize}
            />
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default UserManagement;
