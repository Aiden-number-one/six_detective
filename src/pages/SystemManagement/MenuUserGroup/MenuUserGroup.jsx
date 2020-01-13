/*
 * @Description: This menu's and button's auth management.
 * @Author: dailinbo
 * @Date: 2019-12-24 15:15:57
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-13 19:37:39
 */
import React, { Component, Fragment } from 'react';
import { Form, Table, Pagination, Button, Drawer, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
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
    this.getAdminMenu();
  }

  getAdminMenu = () => {
    const { dispatch } = this.props;
    const params = {};
    dispatch({
      type: 'menu/getAdminMenuData',
      payload: params,
      callback: () => {
        console.log('adminMenuData===', this.props.adminMenuData);
      },
    });
  };

  newUser = () => {
    this.setState({
      modifyVisible: true,
      groupTitle: 'New Menu Group',
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
    const groupMenuInfo = {
      groupId: obj.groupId,
      groupName: obj.groupName,
      groupDesc: obj.groupDesc,
    };
    this.setState({
      modifyVisible: true,
      updateFlag: true,
      groupTitle: 'Modify Menu Group',
      groupMenuInfo,
    });
  };

  deleteUser = (res, obj) => {
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
    this.searchForm.current.validateFields((err, values) => {
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
   * @description: This is for query Menu User list function.
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
          title={formatMessage({ id: 'app.common.confirm' })}
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
            <Button onClick={this.newUser} type="primary" className="btn-usual">
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

export default connect(({ menu }) => ({
  adminMenuData: menu.adminMenuData,
}))(MenuUserGroup);
