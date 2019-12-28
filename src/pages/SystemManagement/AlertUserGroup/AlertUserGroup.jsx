import React, { Component } from 'react';
import { Form, Table, Pagination, Button, Drawer, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
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
class AlertUserGroup extends Component {
  searchForm = React.createRef();

  constructor() {
    super();
    this.state = {
      modifyVisible: false,
      deleteVisible: false,
      updateFlag: false,
      searchGroupName: undefined,
      searchGroupDesc: undefined,
      groupMenuInfo: {},
      columns: [
        {
          title: formatMessage({ id: 'app.common.number' }),
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          minWidth: 60,
          render: (res, recode, index) => (
            <span>{(this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1}</span>
          ),
        },
        {
          title: formatMessage({ id: 'systemManagement.userMaintenance.alertGroupName' }),
          dataIndex: 'groupName',
          key: 'groupName',
        },
        {
          title: formatMessage({ id: 'systemManagement.userGroup.remark' }),
          dataIndex: 'groupDesc',
          key: 'groupDesc',
        },
        {
          title: formatMessage({ id: 'app.common.operation' }),
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          render: (res, obj) => (
            <span className={styles.operation}>
              <a href="#" onClick={() => this.updateUser(res, obj)}>
                <IconFont type="icon-edit" className="operation-icon" />
              </a>
              <a href="#" onClick={() => this.deleteUser(res, obj)}>
                <IconFont type="icon-delete" className="operation-icon" />
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
    const groupMenuInfo = {
      groupId: undefined,
      groupName: undefined,
      groupDesc: undefined,
    };
    this.setState({
      modifyVisible: false,
      groupMenuInfo,
    });
  };

  onSave = updateFlag => {
    if (!updateFlag) {
      const groupMenuInfo = {
        groupId: undefined,
        groupName: undefined,
        groupDesc: undefined,
      };
      this.searchForm.current.resetFields();
      this.setState({
        searchGroupName: undefined,
        searchGroupDesc: undefined,
        groupMenuInfo,
      });
    }
    this.setState({
      modifyVisible: false,
    });
    const { pageSize } = this.state.page;
    const page = {
      pageNumber: 1,
      pageSize,
    };
    const menuInfo = {
      groupId: undefined,
      groupName: undefined,
      groupDesc: undefined,
    };
    this.setState(
      {
        page,
        groupMenuInfo: menuInfo,
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
    //     query: { groupId: obj.groupId },
    //   }),
    // );
    const groupMenuInfo = {
      groupId: obj.groupId,
      groupName: obj.groupName,
      groupDesc: obj.groupDesc,
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
      groupId: obj.groupId,
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
      groupId: groupMenuInfo.groupId,
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
      this.setState(
        {
          searchGroupName: values.groupName,
          searchGroupDesc: values.groupDesc,
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

  /**
   * @description: This is for query user list function.
   * @param {type} null
   * @return: undefined
   */
  queryUserList = () => {
    const { dispatch } = this.props;
    const { searchGroupName, searchGroupDesc } = this.state;
    const params = {
      groupName: searchGroupName,
      groupDesc: searchGroupDesc,
      pageNumber: this.state.page.pageNumber.toString(),
      pageSize: this.state.page.pageSize.toString(),
    };
    dispatch({
      type: 'alertUserGroup/getAlertUserGroup',
      payload: params,
    });
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
            <Button onClick={this.newUser} type="primary" className="btn-usual">
              + New Alert Group
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
          {menuUserGroup.items && menuUserGroup.items.length > 0 && (
            <Pagination
              showSizeChanger
              current={page.pageNumber}
              showTotal={() => `Total ${menuUserGroup.totalCount} items`}
              onShowSizeChange={this.onShowSizeChange}
              onChange={this.pageChange}
              total={menuUserGroup.totalCount}
              pageSize={page.pageSize}
            />
          )}
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default AlertUserGroup;
