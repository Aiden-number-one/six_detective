import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import {
  Table,
  Icon,
  Input,
  Tabs,
  // Form,
  // Row,
  // Col,
  // Button,
  // Select,
  // Checkbox,
  // Popover,
  // DatePicker,
} from 'antd';

import styles from './AddDataSource.less';
import DataSourceModal from './modals/DataSourceModal';
import DataSoureceTypeModal from './modals/DataSoureceTypeModal';

import TableHeader from '@/components/TableHeader';

const { Search } = Input;
const { TabPane } = Tabs;

const dataSourceList = [
  {
    closeCharacter: null,
    conType: null,
    connectWay: null,
    connectionDesc: null,
    connectionId: 'DB9FD416AABD764935AC818E75FFFB2A63',
    connectionName: '测试数据库180',
    connectionType: 'Oracle',
    connectionTypeOri: 'DRIVERORACLE90e902db003152dc56f',
    conseparator: null,
    createdTime: '20190926160209',
    creator: null,
    dbDatabase: 'orcl',
    dbInstance: 'orcl',
    dbPassword: 'E53AEE9FC60E485E5A09F6D6B911712A',
    dbPort: '1521',
    dbUser: 'system',
    driverInfo: 'oracle.jdbc.driver.OracleDriver',
    driverLogo: 'oracle_name.jpg',
    fileCharset: null,
    fileExtName: null,
    filePath: null,
    fileType: null,
    ifData: null,
    jdbcFlag: null,
    jdbcString: 'jdbc:oracle:thin:@10.201.62.180:1521/orcl',
    maxConnectCount: '21',
    modifiedTime: '20191105155314',
    modifieder: null,
    server: '10.201.62.180',
    stateFlag: 'T',
  },
  {
    closeCharacter: null,
    conType: null,
    connectWay: null,
    connectionDesc: null,
    connectionId: 'DB6F7C61D4561D40309881BD78C29AC80A',
    connectionName:
      '恒生柜台08恒生柜台08恒生柜台08恒生柜台08恒生柜台08恒生柜台08恒生柜台08恒生柜台08',
    connectionType: 'Oracle',
    connectionTypeOri: 'DRIVERORACLE90e902db003152dc56f',
    conseparator: null,
    createdTime: '20191011173913',
    creator: null,
    dbDatabase: 'orcl',
    dbInstance: 'orcl',
    dbPassword: 'F21D8DC9B473A1E0',
    dbPort: '1521',
    dbUser: 'hs08',
    driverInfo: 'oracle.jdbc.driver.OracleDriver',
    driverLogo: 'oracle_name.jpg',
    fileCharset: null,
    fileExtName: null,
    filePath: null,
    fileType: null,
    ifData: null,
    jdbcFlag: null,
    jdbcString: 'jdbc:oracle:thin:@10.60.69.82:1521/orcl',
    maxConnectCount: null,
    modifiedTime: '20191011173913',
    modifieder: null,
    server: '10.60.69.82',
    stateFlag: 'T',
  },
  {
    closeCharacter: null,
    conType: null,
    connectWay: null,
    connectionDesc: null,
    connectionId: 'DB4F5DD6D9CC794D3E8763512C0D51AA41',
    connectionName: '证券数据连接',
    connectionType: 'Oracle',
    connectionTypeOri: 'DRIVERORACLE90e902db003152dc56f',
    conseparator: null,
    createdTime: '20191010163506',
    creator: null,
    dbDatabase: 'orcl',
    dbInstance: 'orcl',
    dbPassword: 'FDC0DD5D885F963A',
    dbPort: '1521',
    dbUser: 'retl',
    driverInfo: 'oracle.jdbc.driver.OracleDriver',
    driverLogo: 'oracle_name.jpg',
    fileCharset: null,
    fileExtName: null,
    filePath: null,
    fileType: null,
    ifData: null,
    jdbcFlag: null,
    jdbcString: 'jdbc:oracle:thin:@10.201.62.180:1521/orcl',
    maxConnectCount: null,
    modifiedTime: '20191010163506',
    modifieder: null,
    server: '10.201.62.180',
    stateFlag: 'T',
  },
];
const tableData = [
  {
    ROWNUM_: 1,
    ROWSCOUNT: 31,
    connectionId: 'DB9FD416AABD764935AC818E75FFFB2A63',
    createdTime: '20190926185055',
    creator: null,
    fileImportTable_name: null,
    mdType: '表',
    mdTypeOri: 'T',
    modifiedTime: '20191025172541',
    modifieder: null,
    objectSize: '0.63KB',
    queryScript: null,
    recordCount: '2',
    schemName: 'RETL',
    status: '1',
    tableCat: 'orcl',
    tableDesc: '用户信息表',
    tableId: 'TABLEA29613431B954754898219DE94378B62',
    tableName: 'T_SYS_USER',
  },
  {
    ROWNUM_: 2,
    ROWSCOUNT: 31,
    connectionId: 'DB9FD416AABD764935AC818E75FFFB2A63',
    createdTime: '20190926170033',
    creator: null,
    fileImportTable_name: null,
    mdType: '表',
    mdTypeOri: 'T',
    modifiedTime: '20190926170039',
    modifieder: null,
    objectSize: '0KB',
    queryScript: null,
    recordCount: '0',
    schemName: 'RETL',
    status: '1',
    tableCat: 'orcl',
    tableDesc: '作业运行监控信息表',
    tableId: 'TABLE6B6C608BD30E4350AC2CE68C67CB4073',
    tableName: 'T_DI_MONITOR',
  },
  {
    ROWNUM_: 3,
    ROWSCOUNT: 31,
    connectionId: 'DB9FD416AABD764935AC818E75FFFB2A63',
    createdTime: '20190926170033',
    creator: null,
    fileImportTable_name: null,
    mdType: '表',
    mdTypeOri: 'T',
    modifiedTime: '20190926170039',
    modifieder: null,
    objectSize: '0KB',
    queryScript: null,
    recordCount: '0',
    schemName: 'RETL',
    status: '1',
    tableCat: 'orcl',
    tableDesc: '审核确认表',
    tableId: 'TABLE4EB181CAD47A445FABC0FD26645D022D',
    tableName: 'T_DM_AUDIT_CONFIRM_INFO',
  },
];

@connect(({ dataSource }) => ({
  activeData: dataSource.activeData,
}))
export default class AddDataSource extends PureComponent {
  state = {
    visible: {
      // TableData: false,
      dataSource: false,
      dataSourceType: false,
    },
    title: '',
    operation: 'ADD',
  };

  componentDidMount() {}

  Title = () => (
    <span className={styles.titleBox}>
      <span>Data Connected</span>
      <Icon
        type="plus"
        onClick={() => {
          this.toggleModal('dataSourceType', 'ADD');
        }}
      />
    </span>
  );

  SearchBox = () => (
    <div className={styles.searchBox}>
      <Search />
    </div>
  );

  toggleModal = (key, type) => {
    const { visible } = this.state;
    this.setState({
      visible: {
        ...visible,
        [key]: !visible[key],
      },
    });
    if (type) {
      this.setState({
        operation: type,
      });
    }
  };

  setAddDataSourceTitle = title => {
    this.setState({
      title,
    });
  };

  render() {
    const columns = [
      {
        title: '对象名称',
        dataIndex: 'tableName',
        key: 'tableName',
        // sorter: (a, b) => a.name[1].length - b.name[1].length,
      },
      {
        title: '对象类型',
        dataIndex: 'mdType',
        key: 'mdType',
        // sorter: (a, b) => a.name[1].length - b.name[1].length,
      },
      {
        title: '数据库/sid',
        dataIndex: 'tableCat',
        key: 'tableCat',
        // sorter: (a, b) => a.name[1].length - b.name[1].length,
      },
      {
        title: '所属用户',
        dataIndex: 'schemName',
        key: 'schemName',
        // sorter: (a, b) => a.name[1].length - b.name[1].length,
      },
      {
        title: '行数',
        dataIndex: 'recordCount',
        key: 'recordCount',
        render: text => <span style={{ color: '#6ed2cb' }}>{text}</span>,
      },
      {
        title: '备注',
        dataIndex: 'tableDesc',
        key: 'tableDesc',
      },
      {
        title: '操作',
        key: 'action',
        render: () => (
          <span>
            <Icon type="eye" />
          </span>
        ),
      },
    ];
    const rowSelection = {
      type: 'checkbox',
    };
    const {
      visible: { dataSource, dataSourceType },
      title,
      operation,
    } = this.state;
    const { activeData } = this.props;
    return (
      <PageHeaderWrapper>
        <div style={{ display: 'flex', minHeight: 500 }}>
          <div style={{ flex: '0 0 200px', background: '#f2f6f8' }}>
            {this.Title()}
            {this.SearchBox()}
            <div className={styles.dataSourceList}>
              {dataSourceList.map(item => (
                <div
                  key={item.connectionId}
                  className={styles.dataSourceItem}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  <span className={styles.dataSourceName} title={item.connectionName}>
                    {item.connectionName}
                  </span>
                  <span>
                    <Icon
                      type="edit"
                      onClick={e => {
                        e.stopPropagation();
                        const { dispatch } = this.props;
                        dispatch({
                          type: 'dataSource/saveDate',
                          payload: item,
                        });
                        this.setAddDataSourceTitle(item.type);
                        this.toggleModal('dataSource', 'EDIT');
                      }}
                    />
                    <Icon
                      type="delete"
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowX: 'auto' }}>
            <div style={{ height: '100%', padding: '0 20px' }}>
              <Tabs defaultActiveKey="0">
                <TabPane tab="数据连接">
                  <TableHeader showSelect showEdit />
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={tableData}
                    pagination={{
                      size: 'small',
                    }}
                    scroll={{ x: 'max-content' }}
                  />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
        <DataSourceModal
          visible={dataSource}
          toggleModal={this.toggleModal}
          title={title}
          operation={operation}
          activeData={activeData}
        />
        <DataSoureceTypeModal
          visible={dataSourceType}
          toggleModal={this.toggleModal}
          setAddDataSourceTitle={this.setAddDataSourceTitle}
        />
      </PageHeaderWrapper>
    );
  }
}
