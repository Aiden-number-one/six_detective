import React, { Component } from 'react';
import { Form, Table, Pagination, Button, Drawer, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';

import styles from './AlertUserGroup.less';
import SearchForm from './components/SearchForm';
import NewUserGroup from './components/NewUserGroup';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ alertUserGroup, loading }) => ({
  loading: loading.effects,
  menuUserGroup: alertUserGroup.data,
  updateGroup: alertUserGroup.updateUserGroup,
}))
class alertUserGroup extends Component {
  searchForm = React.createRef();

  constructor() {
    super();
    this.state = {
      modifyVisible: false,
      deleteVisible: false,
      updateFlag: false,
      groupMenuInfo: {},
      columns: [
        {
          title: formatMessage({ id: 'systemManagement.userMaintenance.name' }),
          dataIndex: 'roleName',
          key: 'roleName',
        },
        {
          title: formatMessage({ id: 'systemManagement.userGroup.remark' }),
          dataIndex: 'roleDesc',
          key: 'roleDesc',
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
              <a href="#" onClick={() => this.deleteUser(res, obj)}>
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
  }

  componentDidMount() {
    this.queryUserList();
  }

  newUser = () => {
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: '/system-management/user-maintenance/new-menu-user',
    //   }),
    // );
    this.setState({
      modifyVisible: true,
      groupTitle: 'New Alert User Group',
      updateFlag: false,
    });
  };

  onClose = () => {
    this.setState({
      modifyVisible: false,
    });
  };

  onSave = () => {
    this.setState({
      modifyVisible: false,
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

  updateUser = (res, obj) => {
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: '/system-management/user-maintenance/modify-menu-user',
    //     query: { roleId: obj.roleId },
    //   }),
    // );
    const groupMenuInfo = {
      roleId: obj.roleId,
      roleName: obj.roleName,
      roleDesc: obj.roleDesc,
    };
    this.setState({
      modifyVisible: true,
      updateFlag: true,
      groupTitle: 'Modify Alert User Group',
      groupMenuInfo,
    });
  };

  deleteUser = (res, obj) => {
    const groupMenuInfo = {
      roleId: obj.roleId,
    };
    this.setState({
      deleteVisible: true,
      groupMenuInfo,
    });
  };

  deleteConfirm = () => {
    const { dispatch } = this.props;
    const { groupMenuInfo } = this.state;
    const params = {
      operType: 'deleteById',
      roleId: groupMenuInfo.roleId,
    };
    dispatch({
      type: 'alertUserGroup/updateUserAlert',
      payload: params,
      callback: () => {
        this.queryUserList();
        this.setState({
          deleteVisible: false,
        });
      },
    });
  };

  deleteCancel = () => {
    this.setState({
      deleteVisible: false,
    });
  };

  queryLog = () => {
    // const { dispatch } = this.props;
    // const params = {};
    // dispatch({
    //   type: 'menuUserGroup/getAlertUserGroup',
    //   payload: params,
    // });
    this.searchForm.current.validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        roleName: values.roleName,
        roleDesc: values.roleDesc,
      };
      this.queryUserList(params);
    });
  };

  /**
   * @description: This is for paging function.
   * @param {type} null
   * @return: undefined
   */
  pageChange = (pageNumber, pageSize) => {
    const page = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
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

  /**
   * @description: This is for query user list function.
   * @param {type} null
   * @return: undefined
   */
  queryUserList = (
    param = {
      roleName: undefined,
      roleDesc: undefined,
    },
  ) => {
    const { dispatch } = this.props;
    const { roleName, roleDesc } = param;
    const params = {
      roleName,
      roleDesc,
      pageNumber: this.state.page.pageNumber,
      pageSize: this.state.page.pageSize,
    };
    dispatch({
      type: 'alertUserGroup/getAlertUserGroup',
      payload: params,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const page = {
      pageNumber: current.toString(),
      pageSize: pageSize.toString(),
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
    const { loading, menuUserGroup } = this.props;
    const { groupTitle, deleteVisible, groupMenuInfo, updateFlag } = this.state;
    const { columns, page, modifyVisible } = this.state;
    return (
      <PageHeaderWrapper>
        <NewSearchForm search={this.queryLog} ref={this.searchForm}></NewSearchForm>
        <Drawer
          // drawerStyle={
          //   {
          //     height: '200px',
          //   }
          // }
          closable={false}
          title={groupTitle}
          width={700}
          onClose={this.onClose}
          visible={modifyVisible}
        >
          {modifyVisible && (
            <NewUserGroup
              onCancel={this.onClose}
              onSave={this.onSave}
              groupMenuInfo={groupMenuInfo}
              updateFlag={updateFlag}
            ></NewUserGroup>
          )}
        </Drawer>
        {/* delete */}
        <Modal
          title="CONFIRM"
          visible={deleteVisible}
          onOk={this.deleteConfirm}
          onCancel={this.deleteCancel}
          cancelText={formatMessage({ id: 'app.common.cancel' })}
          okText={formatMessage({ id: 'app.common.confirm' })}
        >
          <span>Please confirm that you want to delete this record?</span>
        </Modal>
        <div className={styles.content}>
          <div className={styles.tableTop}>
            <Button onClick={this.newUser} type="primary" className="btn_usual">
              + Alert User Group
            </Button>
          </div>
          <Table
            loading={loading['menuUserGroup/getAlertUserGroup']}
            // pagination={{ total: menuUserGroup.totalCount, pageSize: page.pageSize }}
            // rowSelection={rowSelection}
            // onChange={this.pageChange}
            dataSource={menuUserGroup.items}
            columns={columns}
            pagination={false}
          ></Table>
          <Pagination
            showSizeChanger
            current={page.pageNumber}
            showTotal={() =>
              `Page ${page.pageNumber.toString()} of ${Math.ceil(
                menuUserGroup.totalCount / page.pageSize,
              ).toString()}`
            }
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.pageChange}
            total={menuUserGroup.totalCount && menuUserGroup.totalCount.toString()}
            pageSize={page.pageSize && page.pageSize.toString()}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default alertUserGroup;
