import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import {
  Table,
  Icon,
  Input,
  Tabs,
  Modal,
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
  activeData: dataSource.activeData, // 编辑的数据源信息
  dataSourceList: dataSource.dataSourceList, // 数据源列表信息
  activeCID: dataSource.activeCID, // 点击的数据源ID
  driverInfo: dataSource.driverInfo, // 数据源驱动
  activeDriver: dataSource.activeDriver, // 新增数据源时选中的数据源类型对应的驱动信息
  tableData: tableData.tableData, // 数据源表格
}))
export default class AddDataSource extends PureComponent {
  state = {
    visible: {
      dataSource: false, // 新增修改数据源弹框
      dataSourceType: false, // 新增数据源类型弹框
      importMetaData: false, // 导入元数据弹框
    },
    title: '', // 弹框标题
    operation: 'ADD', // 数据源操作类型
  };

  componentDidMount() {
    // 获取数据源列表
    this.getDataSourceList();
    this.getDataDriver();
  }

  // 获取数据源列表
  getDataSourceList = connectionName => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSource/getDataSourceList',
      payload: {
        connectionName,
      },
      callback: response => {
        // 成功时默认选中第一个获取表信息
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

  // 获取数据驱动
  getDataDriver = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSource/getDataDriver',
      payload: {},
    });
  };

  // 数据源列表标题
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

  // 数据源列表查询框
  SearchBox = () => (
    <div className={styles.searchBox}>
      <Search
        onSearch={value => {
          this.getDataSourceList(value);
        }}
      />
    </div>
  );

  // 隐藏显示弹框
  toggleModal = (key, type) => {
    const { visible } = this.state;
    this.setState({
      visible: {
        ...visible,
        [key]: !visible[key],
      },
    });
    // 设置操作类型
    if (type) {
      this.setState({
        operation: type,
      });
    }
  };

  // 设置弹框title
  setAddDataSourceTitle = title => {
    this.setState({
      title,
    });
  };

  // 设置当前选择的驱动类型
  setActiveDriver = name => {
    const { driverInfo, dispatch } = this.props;
    let activeDriver = {};
    driverInfo.forEach(item => {
      if (item.driverName === name) {
        activeDriver = item;
      }
    });
    dispatch({
      type: 'dataSource/setActiveDriver',
      payload: activeDriver,
    });
  };

  // 操作数据源
  operateDataSource = values => {
    const { operation } = this.state;
    const { dispatch, activeData, activeDriver } = this.props;
    if (operation === 'DEL') {
      dispatch({
        type: 'dataSource/delDataSource',
        payload: {
          connectionId: values,
        },
      });
      return;
    }
    const driverInfo = activeDriver.className || activeData.driverInfo;
    const params = values;
    if (params.dbPassword !== activeData.dbPassword) {
      params.dbPassword = window.kddes.getDes(params.dbPassword);
    }
    // 新增数据源
    if (operation === 'ADD') {
      dispatch({
        type: 'dataSource/setDatasource',
        payload: {
          ...params,
          driverInfo,
        },
      });
    }
    // 修改数据源
    if (operation === 'EDIT') {
      dispatch({
        type: 'dataSource/updDataSource',
        payload: {
          ...params,
          driverInfo,
          connectionId: activeData.connectionId,
        },
      });
    }
  };

  render() {
    // 表格表头
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
    // 表格多选框
    const rowSelection = {
      type: 'checkbox',
    };
    const {
      visible: { dataSource, dataSourceType, importMetaData },
      title,
      operation,
    } = this.state;
    const {
      activeData,
      dataSourceList,
      activeCID,
      tableData,
      driverInfo,
      activeDriver,
    } = this.props;
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
                    // 点击获取数据源表格信息
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
                        // 编辑数据源
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
                        this.setState({
                          operation: 'DEL',
                        });
                        Modal.confirm({
                          title: 'Do you Want to delete this items?',
                          // content: 'Some descriptions',
                          onOk: () => {
                            this.operateDataSource(item.connectionId);
                          },
                          onCancel: () => {
                            // console.log('Cancel');
                          },
                        });
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
                      // 获取元数据
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
        {/* 新增修改数据源弹框 */}
        <DataSourceModal
          visible={dataSource}
          toggleModal={this.toggleModal}
          title={title}
          operation={operation}
          activeData={activeData}
          driverInfo={driverInfo}
          activeDriver={activeDriver}
          setActiveDriver={this.setActiveDriver}
          operateDataSource={this.operateDataSource}
        />
        {/* 新增数据源类型弹框 */}
        <DataSoureceTypeModal
          visible={dataSourceType}
          toggleModal={this.toggleModal}
          setAddDataSourceTitle={this.setAddDataSourceTitle}
          setActiveDriver={this.setActiveDriver}
        />
        {/* 导入元数据弹框 */}
        <ImportMetaData
          visible={importMetaData}
          toggleModal={this.toggleModal}
          activeCID={activeCID}
        />
      </PageHeaderWrapper>
    );
  }
}
