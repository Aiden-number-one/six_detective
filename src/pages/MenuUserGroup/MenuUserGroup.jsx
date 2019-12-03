import React, { Component } from 'react';
import { Form, Table, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import styles from './MenuUserGroup.less';
import SearchForm from './components/SearchForm';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ menuUserGroup, loading }) => ({
  loading: loading.effects,
  menuUserGroup: menuUserGroup.data,
}))
class MenuUserGroup extends Component {
  constructor() {
    super();
    this.state = {
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
        pageNum: '1',
        pageSize: '10',
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {};
    dispatch({
      type: 'menuUserGroup/getMenuUserGroup',
      payload: params,
    });
  }

  newUser = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/system-management/user-maintenance/new-menu-user',
      }),
    );
  };

  render() {
    const { loading, menuUserGroup } = this.props;
    console.log('menuUserGroup=', menuUserGroup);
    const { columns, page } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    return (
      <PageHeaderWrapper>
        <NewSearchForm search={this.queryLog} ref={this.searchForm}></NewSearchForm>
        <div className={styles.content}>
          <Button onClick={this.newUser}>+ New User</Button>
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
