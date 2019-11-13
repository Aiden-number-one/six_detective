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
import ImportMetaData from './modals/ImportMetaData';

import TableHeader from '@/components/TableHeader';

const { Search } = Input;
const { TabPane } = Tabs;

@connect(({ dataSource, tableData }) => ({
  activeData: dataSource.activeData,
  dataSourceList: dataSource.dataSourceList,
  activeCID: dataSource.activeCID,
  tableData: tableData.tableData,
}))
export default class AddDataSource extends PureComponent {
  state = {
    visible: {
      // TableData: false,
      dataSource: false,
      dataSourceType: false,
      importMetaData: false,
    },
    title: '',
    operation: 'ADD',
  };

  componentDidMount() {
    this.getDataSourceList();
  }

  getDataSourceList = connectionName => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSource/getDataSourceList',
      payload: {
        connectionName,
      },
      callback: response => {
        dispatch({
          type: 'tableData/getTableData',
          payload: {
            pageNumber: 1,
            pageSize: 10,
            connection_id: response.bcjson.items[0].connectionId,
          },
        });
      },
    });
  };

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
      <Search
        onSearch={value => {
          this.getDataSourceList(value);
        }}
      />
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
      visible: { dataSource, dataSourceType, importMetaData },
      title,
      operation,
    } = this.state;
    const { activeData, dataSourceList, activeCID, tableData } = this.props;
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
                    const { dispatch } = this.props;
                    dispatch({
                      type: 'dataSource/setActiveCID',
                      payload: item.connectionId,
                    });
                    dispatch({
                      type: 'tableData/getTableData',
                      payload: {
                        pageNumber: 1,
                        pageSize: 10,
                        connection_id: item.connectionId,
                      },
                    });
                  }}
                  style={
                    activeCID === item.connectionId
                      ? { border: '1px solid #10416c', backgroundColor: '#dde6eb' }
                      : {}
                  }
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
                        this.setAddDataSourceTitle(item.connectionType);
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
                  <TableHeader
                    showSelect
                    showEdit
                    addTableData={() => {
                      const { dispatch } = this.props;
                      dispatch({
                        type: 'tableData/clearMetaData',
                      });
                      dispatch({
                        type: 'tableData/getMetaData',
                        payload: {
                          connection_id: activeCID,
                        },
                      });
                      this.toggleModal('importMetaData');
                    }}
                  />
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
        <ImportMetaData visible={importMetaData} toggleModal={this.toggleModal} />
      </PageHeaderWrapper>
    );
  }
}
