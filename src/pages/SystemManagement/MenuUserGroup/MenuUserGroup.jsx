import React, { Component, Fragment } from 'react';
import { Form, Table, Pagination, Button, Drawer, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import IconFont from '@/components/IconFont';

import styles from './MenuUserGroup.less';
import SearchForm from './components/SearchForm';
import NewUserGroup from './components/NewUserGroup';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ menuUserGroup, loading }) => ({
  loading: loading.effects,
  menuUserGroup: menuUserGroup.data,
  updateGroup: menuUserGroup.updateData,
}))
class MenuUserGroup extends Component {
  searchForm = React.createRef();

  constructor() {
    super();
    this.state = {
      modifyVisible: false,
      deleteVisible: false,
      updateFlag: false,
      searchGroupName: undefined,
      searchGroupDesc: undefined,
      delateTitle: 'Please confirm that you want to delete this record?',
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
          title: formatMessage({ id: 'systemManagement.userMaintenance.menuGroupName' }),
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
      groupTitle: 'New User Group',
      updateFlag: false,
      groupMenuInfo: {},
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
      this.searchForm.current.resetFields();
      this.setState({
        searchGroupName: undefined,
        searchGroupDesc: undefined,
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
    console.log('res, obj=', res, obj);
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
      groupTitle: 'Modify User Group',
      groupMenuInfo,
    });
  };

  deleteUser = (res, obj) => {
    console.log('delete====', obj);
    const groupMenuInfo = {
      groupId: obj.groupId,
    };
    const { dispatch } = this.props;
    const params = {
      operType: 'queryUseInGroup',
      groupId: groupMenuInfo.groupId,
    };
    dispatch({
      type: 'menuUserGroup/updateUserGroup',
      payload: params,
      callback: () => {
        if (this.props.updateGroup[0].flag === '0') {
          this.setState({
            delateTitle: (
              <Fragment>
                <span>This menu has been authorized to users.</span>
                <br />
                <span>Please confirm that you want to delete it!</span>
              </Fragment>
            ),
          });
        } else {
          this.setState({
            delateTitle: 'Please confirm that you want to delete this record?',
          });
        }
        this.setState({
          deleteVisible: true,
          groupMenuInfo,
        });
      },
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
      type: 'menuUserGroup/updateUserGroup',
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
    //   type: 'menuUserGroup/getMenuUserGroup',
    //   payload: params,
    // });
    this.searchForm.current.validateFields((err, values) => {
      console.log('values===', values);
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
      type: 'menuUserGroup/getMenuUserGroup',
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
    const { columns, page, modifyVisible, delateTitle } = this.state;
    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   },
    // };
    return (
      <PageHeaderWrapper>
        <div>
          <NewSearchForm search={this.queryLog} ref={this.searchForm}></NewSearchForm>
        </div>
        <Drawer
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
          <span>{delateTitle}</span>
        </Modal>
        <div className={styles.content}>
          <div className={styles.tableTop}>
            <Button onClick={this.newUser} type="primary" className="btn_usual">
              + New Menu Group
            </Button>
          </div>
          <Table
            loading={loading['menuUserGroup/getMenuUserGroup']}
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

export default MenuUserGroup;
