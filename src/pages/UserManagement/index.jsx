import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Modal, Table } from 'antd';
import { connect } from 'dva';
import TableHeader from '@/components/TableHeader';
import styles from './index.less';
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
  loading: loading.effects['userManagement/userManagemetDatas'],
  userManagementData: userManagement.data,
  orgs: userManagement.orgs,
}))
class UserManagement extends Component {
  state = {
    visible: false,
    updateVisible: false,
    lockVisible: false,
    closingVisible: false,
    updatePasswordVisible: false,
    resetPasswordVisible: false,
    userInfo: {
      login: '',
      name: '',
      departmentName: '',
      departmentId: '',
      email: '',
    },
    columns: [
      {
        title: '登陆名',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '公司部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
      },
      {
        title: '状态',
        dataIndex: 'custStatus',
        key: 'custStatus',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (res, obj) => (
          <span className={styles.operation}>
            <a href="#" onClick={() => this.updateUser(res, obj)}>
              修改用户
            </a>
            <a href="#" onClick={() => this.lockUser()}>
              锁定
            </a>
            <a href="#" onClick={() => this.closingUser()}>
              销户
            </a>
            <a href="#" onClick={() => this.updatePassword()}>
              密码修改
            </a>
            <a href="#" onClick={() => this.resetPassword()}>
              密码重置
            </a>
          </span>
        ),
      },
    ],
  };

  newDepartmentId = '';

  searchForm = React.createRef();

  formRef = React.createRef();

  updateFormRef = React.createRef();

  passwordFormRef = React.createRef();

  resetPasswordFormRef = React.createRef();

  // eslint-disable-next-line react/sort-comp
  addUser = () => {
    this.setState({ visible: true });
  };

  // 获取id
  getDepartmentId = departmentId => {
    this.newDepartmentId = departmentId;
  };

  handleOk = () => {
    const { dispatch } = this.props;
    this.formRef.current.validateFields((err, values) => {
      const passwordStrength = passWordStrength(values.password);
      const param = {
        loginName: values.login,
        customerName: values.name,
        departmentId: this.newDepartmentId,
        password: values.password,
        passwordStrength,
        mobile: values.phone,
        email: values.email,
      };
      dispatch({
        type: 'userManagement/addUserModelDatas',
        payload: param,
      });
    });
  };

  updateConfirm = () => {
    const { dispatch } = this.props;
    this.updateFormRef.current.validateFields((err, values) => {
      const param = {
        custCustomerno: '77029',
        loginName: values.login,
        customerName: values.name,
        departmentId: this.newDepartmentId || this.state.userInfo.departmentId,
        email: values.email,
      };
      dispatch({
        type: 'userManagement/updateUserModelDatas',
        payload: param,
        callback: () => {
          this.queryUser({});
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

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleChange = () => {};

  updateUser = (res, obj) => {
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
    this.setState({
      updateVisible: true,
      userInfo,
    });
  };

  lockUser = () => {
    this.setState({
      lockVisible: true,
    });
  };

  lockConfirm = () => {
    const { dispatch } = this.props;
    const param = {
      custCustomerno: 77029,
      operationType: 1,
    };
    dispatch({
      type: 'userManagement/operationUserModelDatas',
      payload: param,
      callback: () => {
        this.queryUser({});
      },
    });
    this.setState({
      lockVisible: false,
    });
  };

  lockCancel = () => {
    this.setState({
      lockVisible: false,
    });
  };

  // 销户
  closingUser = () => {
    this.setState({
      closingVisible: true,
    });
  };

  closingConfirm = () => {
    const { dispatch } = this.props;
    const param = {
      custCustomerno: 77029,
      operationType: 3,
    };
    dispatch({
      type: 'userManagement/operationUserModelDatas',
      payload: param,
      callback: () => {
        this.queryUser({});
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

  // 修改密码
  updatePassword = () => {
    this.setState({
      updatePasswordVisible: true,
    });
  };

  updatePasswordConfirm = () => {
    const { dispatch } = this.props;
    this.passwordFormRef.current.validateFields((err, values) => {
      const passwordStrength = passWordStrength(values.password);
      const param = {
        custCustomerno: 77029,
        operationType: 5,
        oldPassword: values.oldPassword,
        password: values.password,
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

  // 重置密码
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
        custCustomerno: 77029,
        operationType: 6,
        password: values.password,
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

  // 获取查询列表数据
  queryUser = param => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userManagement/userManagemetDatas',
      payload: param,
    });
  };

  // 查询部门
  queryDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManagement/queryOrgs',
      params: {
        treeLevel: '2',
      },
    });
  };

  // 搜索
  queryLog = () => {
    this.searchForm.current.validateFields((err, values) => {
      const params = {
        searchParam: values.searchParam,
        displaypath: values.displaypath,
        email: values.email,
        custStatus: values.custStatus,
      };
      this.queryUser(params);
    });
  };

  operatorReset = () => {
    this.searchForm.current.resetFields();
  };

  componentDidMount() {
    const obj = {};
    this.queryUser(obj);
    this.queryDepartment();
  }

  render() {
    const { orgs, userManagementData } = this.props;
    const { userInfo } = this.state;

    return (
      <PageHeaderWrapper>
        <div>
          <div>
            <NewSearchForm
              search={this.queryLog}
              reset={this.operatorReset}
              ref={this.searchForm}
            ></NewSearchForm>
          </div>
          <div>
            <Modal
              title="新增用户"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
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
              title="提示"
              visible={this.state.lockVisible}
              onOk={this.lockConfirm}
              onCancel={this.lockCancel}
            >
              <span>是否锁定？</span>
            </Modal>
            {/* 销户 */}
            <Modal
              title="提示"
              visible={this.state.closingVisible}
              onOk={this.closingConfirm}
              onCancel={this.closingCancel}
            >
              <span>是否销户？</span>
            </Modal>
            {/* 密码修改 */}
            <Modal
              title="密码修改"
              visible={this.state.updatePasswordVisible}
              onOk={this.updatePasswordConfirm}
              onCancel={this.updatePasswordCancel}
            >
              <NewPasswordForm ref={this.passwordFormRef}></NewPasswordForm>
            </Modal>
            {/* 密码重置 */}
            <Modal
              title="密码重置"
              visible={this.state.resetPasswordVisible}
              onOk={this.resetPasswordConfirm}
              onCancel={this.resetPasswordCancel}
            >
              <NewResetPasswordForm ref={this.resetPasswordFormRef}></NewResetPasswordForm>
            </Modal>
          </div>
          <div>
            <TableHeader showEdit addTableData={this.addUser}></TableHeader>
            <Table
              pagination={{ size: 'small' }}
              dataSource={userManagementData}
              columns={this.state.columns}
            ></Table>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default UserManagement;
