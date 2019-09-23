import React, { PureComponent, Fragment } from 'react';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Layout, Card, Icon } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './DataSource.less';

const { Content, Sider } = Layout;

@connect(({ api, loading }) => ({
  loading: loading.effects['api/queryDatas'],
  tableData: api.data,
  dataSourceList: api.dataSourceList,
}))
export default class DataSource extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'api/queryDataSourceList',
      payload: { a: 1 },
    });
    dispatch({
      type: 'api/queryDatas',
      payload: { a: 1 },
    });
  }

  getData = connectionId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'api/queryDatas',
      payload: { a: 1 },
    });
    dispatch({
      type: 'api/changeActive',
      payload: connectionId,
    });
  };

  render() {
    const { tableData, dispatch, loading, dataSourceList } = this.props;
    const columns = [
      {
        title: '对象名称',
        dataIndex: 'tableName',
        key: 'tableName',
      },
      {
        title: '对象类型',
        dataIndex: 'mdType',
        key: 'mdType',
      },
      {
        title: '数据库/sid',
        dataIndex: 'tableCat',
        key: 'tableCat',
      },
      {
        title: '所属用户',
        dataIndex: 'schemName',
        key: 'schemName',
      },
      {
        title: '行数',
        dataIndex: 'recordCount',
        key: 'recordCount',
      },
      {
        title: '备注',
        dataIndex: 'tableDesc',
        key: 'tableDesc',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: () => (
          <a
            onClick={() => {
              dispatch({
                type: 'api/delDatas',
              });
            }}
          >
            删除
          </a>
        ),
      },
    ];
    return (
      <Fragment>
        <Layout>
          <Sider className={styles.dataSourceList}>
            <Card title="数据连接" extra={<Icon type="plus" />} size="small" bordered={false}>
              <ul style={{ padding: 0 }}>
                {dataSourceList.map(item => (
                  <li
                    key={item.connectionId}
                    className={classNames(styles.dataItem, item.active ? styles.active : '')}
                    onClick={() => this.getData(item.connectionId)}
                  >
                    <span>{item.connectionName}</span>
                    <Icon type="delete" onClick={e => e.stopPropagation()} />
                  </li>
                ))}
              </ul>
            </Card>
          </Sider>
          <Content className={styles.tableData}>
            {/* <Button onClick={this.getData}>刷新</Button> */}
            <Table dataSource={tableData} columns={columns} loading={loading} bordered />
          </Content>
        </Layout>
      </Fragment>
    );
  }
}
