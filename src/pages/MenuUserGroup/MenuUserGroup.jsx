import React, { Component } from 'react';
import { Form, Table, Button, Drawer } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import styles from './MenuUserGroup.less';
import SearchForm from './components/SearchForm';
import NewUserGroup from './components/NewUserGroup';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ menuUserGroup, loading }) => ({
  loading: loading.effects,
  menuUserGroup: menuUserGroup.data,
}))
class MenuUserGroup extends Component {
  searchForm = React.createRef();

  constructor() {
    super();
    this.state = {
      newVisible: false,
      columns: [
        {
          title: formatMessage({ id: 'app.common.username' }),
          dataIndex: 'roleName',
          key: 'roleName',
        },
        {
          title: formatMessage({ id: 'systemManagement.userGroup.remark' }),
          dataIndex: 'Remark',
          key: 'Remark',
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
      newVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      newVisible: false,
    });
  };

  onSave = () => {
    this.setState({
      newVisible: false,
    });
  };

  updateUser = (res, obj) => {
    console.log('res, obj=', res, obj);
    this.props.dispatch(
      routerRedux.push({
        pathname: '/system-management/user-maintenance/modify-menu-user',
        query: { roleId: obj.roleId },
      }),
    );
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
      const params = {
        remark: values.remark,
        userName: values.userName,
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

  /**
   * @description: This is for query user list function.
   * @param {type} null
   * @return: undefined
   */
  queryUserList = (
    param = {
      remark: undefined,
      userName: undefined,
    },
  ) => {
    const { dispatch } = this.props;
    const { remark, userName } = param;
    const params = {
      remark,
      userName,
      pageNumber: this.state.page.pageNumber,
      pageSize: this.state.page.pageSize,
    };
    dispatch({
      type: 'menuUserGroup/getMenuUserGroup',
      payload: params,
    });
  };

  render() {
    const { loading, menuUserGroup } = this.props;
    console.log('menuUserGroup=', menuUserGroup);
    const { columns, page, newVisible } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    return (
      <PageHeaderWrapper>
        <NewSearchForm search={this.queryLog} ref={this.searchForm}></NewSearchForm>
        <Drawer width={700} onClose={this.onClose} visible={newVisible}>
          <NewUserGroup onCancel={this.onClose} onSave={this.onSave}></NewUserGroup>
        </Drawer>
        <div className={styles.content}>
          <div className={styles.tableTop}>
            <Button onClick={this.newUser} type="primary" className="btn_usual">
              + New User
            </Button>
          </div>
          <Table
            loading={loading['menuUserGroup/getMenuUserGroup']}
            pagination={{ total: menuUserGroup.totalCount, pageSize: page.pageSize }}
            rowSelection={rowSelection}
            onChange={this.pageChange}
            dataSource={menuUserGroup.items}
            columns={columns}
          ></Table>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default MenuUserGroup;
