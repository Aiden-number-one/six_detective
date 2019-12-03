/*
 * @Description: This is for userManagement page.
 * @Author: dailinbo
 * @Date: 2019-11-12 19:03:58
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-12-03 19:59:06
 */

import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Modal, Table, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './UserManagement.less';
import { passWordStrength } from '@/utils/utils';

import SearchForm from './components/SearchForm';
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
}))
class UserManagement extends Component {
  state = {
    visible: false,
    updateVisible: false,
    deleteVisible: false,
    closingVisible: false,
    updatePasswordVisible: false,
    resetPasswordVisible: false,
    customerno: null,
    userInfo: {
      login: '',
      name: '',
      departmentName: '',
      departmentId: '',
      email: '',
    },
    columns: [
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
      },
      {
        title: formatMessage({ id: 'systemManagement.userMaintenance.LastUpdateUser' }),
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: formatMessage({ id: 'app.common.operation' }),
        dataIndex: 'operation',
        key: 'operation',
        render: (res, obj) => (
          <span className={styles.operation}>
            <a href="#" onClick={() => this.updateUser(res, obj)}>
              {formatMessage({ id: 'app.common.modify' })}
            </a>
            <a href="#" onClick={() => this.deleteUser()}>
              {formatMessage({ id: 'app.common.delete' })}
            </a>
          </span>
        ),
      },
    ],
    page: {
      pageNumber: '1',
      pageSize: '10',
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
    this.queryDepartments();
  }

  /**
   * @description: This is for query user list function.
   * @param {type} null
   * @return: undefined
   */
  queryUserList = (
    param = {
      searchParam: undefined,
      displaypath: undefined,
      email: undefined,
      custStatus: undefined,
    },
  ) => {
    const { dispatch } = this.props;
    const { searchParam, displaypath, email, custStatus } = param;
    const params = {
      searchParam,
      displaypath,
      email,
      custStatus,
      pageNumber: this.state.page.pageNumber,
      pageSize: this.state.page.pageSize,
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
    this.props.dispatch(
      routerRedux.push({
        pathname: '/system-management/user-maintenance/new-user',
      }),
    );
  };

  addConfrim = () => {
    const { dispatch } = this.props;
    this.formRef.current.validateFields((err, values) => {
      const passwordStrength = passWordStrength(values.password);
      const param = {
        loginName: values.login,
        customerName: values.name,
        departmentId: this.newDepartmentId,
        password: window.kddes.getDes(values.password),
        passwordStrength,
        mobile: values.phone,
        email: values.email,
      };
      dispatch({
        type: 'userManagement/addUserModelDatas',
        payload: param,
        callback: () => {
          this.setState({
            visible: false,
          });
          this.queryUserList();
        },
      });
    });
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
      login: '',
      name: '',
      departmentName: '',
      departmentId: '',
      email: '',
    };
    userInfo.login = obj.loginName;
    userInfo.name = obj.customerName;
    userInfo.departmentName = obj.departmentName;
    userInfo.departmentId = obj.departmentId;
    userInfo.email = obj.email;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/system-management/user-maintenance/modify-user',
        query: {
          userId: obj.userId,
          userName: obj.userName,
          userState: obj.userState,
        },
      }),
    );
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
  deleteUser = () => {
    this.setState({
      deleteVisible: true,
    });
  };

  deleteConfirm = () => {
    const { dispatch } = this.props;
    const param = {
      operationType: '1',
    };
    dispatch({
      type: 'userManagement/operationUserModelDatas',
      payload: param,
      callback: () => {
        this.queryUserList();
      },
    });
    this.setState({
      deleteVisible: false,
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
    this.props.dispatch(
      routerRedux.push({
        pathname: '/system-management/menu-user-group',
      }),
    );
    this.searchForm.current.validateFields((err, values) => {
      const params = {
        searchParam: values.searchParam,
        displaypath: values.displaypath,
        email: values.email,
        custStatus: values.custStatus,
      };
      this.queryUserList(params);
    });
  };

  /**
   * @description: This is for paging function.
   * @param {type} null
   * @return: undefined
   */
  pageChange = pagination => {
    const page = {
      pageNumber: pagination.current.toString(),
      pageSize: pagination.pageSize.toString(),
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
    const { userInfo, page } = this.state;
    console.log('userManagementData.items=', userManagementData.items);
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
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
              visible={this.state.visible}
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
            {/* 锁定 */}
            <Modal
              title="CONFIRM"
              visible={this.state.deleteVisible}
              onOk={this.deleteConfirm}
              onCancel={this.deleteCancel}
              cancelText={formatMessage({ id: 'app.common.cancel' })}
              okText={formatMessage({ id: 'app.common.save' })}
            >
              <span>Are you sure you want to delete this form?</span>
            </Modal>
            {/* 销户 */}
            <Modal
              title="提示"
              visible={this.state.closingVisible}
              onOk={this.closingConfirm}
              onCancel={this.closingCancel}
              cancelText={formatMessage({ id: 'app.common.cancel' })}
              okText={formatMessage({ id: 'app.common.save' })}
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
              okText={formatMessage({ id: 'app.common.save' })}
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
            <Button onClick={this.newUser}>+ New User</Button>
            <Table
              loading={loading['userManagement/userManagemetDatas']}
              pagination={{ total: userManagementData.totalCount, pageSize: page.pageSize }}
              rowSelection={rowSelection}
              onChange={this.pageChange}
              dataSource={userManagementData.items}
              columns={this.state.columns}
            ></Table>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default UserManagement;
