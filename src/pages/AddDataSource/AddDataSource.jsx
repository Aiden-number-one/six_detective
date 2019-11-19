import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import {
  Table,
  Icon,
  Input,
  Tabs,
  Modal,
  Form,
  Row,
  Col,
  Button,
  Select,
  message,
  // Checkbox,
  // Popover,
} from 'antd';

import styles from './AddDataSource.less';
import DataSourceModal from './modals/DataSourceModal';
import DataSoureceTypeModal from './modals/DataSoureceTypeModal';
import ImportMetaData from './modals/ImportMetaData';
import ColumnDetail from './modals/ColumnDetail';

import TableHeader from '@/components/TableHeader';

const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

class AdvancedSearchForm extends PureComponent {
  state = {};

  getFields() {
    const { schemasNames } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Row gutter={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item label="Table Name">
            {getFieldDecorator('tableName', {})(
              <Input placeholder="Type Here" />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item label="Schem Name">
            {getFieldDecorator('schemName', {})(
              <Select
                placeholder="please select"
                dropdownClassName="selectDropdown"
                allowClear
              >
                {schemasNames.map(item => (
                  <Option value={item.schemName}>{item.schemName}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">Search</Button>
          </Form.Item>
        </Col>
      </Row>
    );
  }

  // 查询操作
  handleSearch = e => {
    e.preventDefault();
    const { getTableData, form, activeCID } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const param = {
          ...values,
          connection_id: activeCID,
          pageSize: 10,
          pageNumber: 1,
        };
        getTableData(param);
      }
    });
  }

  render() {
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        {this.getFields()}
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);

@connect(({ dataSource, tableData }) => ({
  dataSourceList: dataSource.dataSourceList, // 数据源列表信息
  activeData: dataSource.activeData, // 编辑的数据源信息
  activeCID: dataSource.activeCID, // 点击的数据源ID
  driverInfo: dataSource.driverInfo, // 数据源驱动
  activeDriver: dataSource.activeDriver, // 新增数据源时选中的数据源类型对应的驱动信息
  tableData: tableData.tableData, // 数据源表格
  activeTableData: tableData.activeTableData, // 查看的数据表
  schemasNames: tableData.schemasNames, // 所属用户
  columnData: tableData.columnData, // 列信息
  metadataPerform: tableData.metadataPerform, // 表格前20条数据
}))
export default class AddDataSource extends PureComponent {
  state = {
    visible: {
      dataSource: false, // 新增修改数据源弹框
      dataSourceType: false, // 新增数据源类型弹框
      importMetaData: false, // 导入元数据弹框
      columnDetail: false, // 对象结构详情
    },
    title: '', // 弹框标题
    operation: 'ADD', // 数据源操作类型
    selectedRowKeys: '',
  };

  searchFrom = React.createRef();

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
        const param = {
          connection_id: response.bcjson.items[0].connectionId,
        }
        // 成功时默认选中第一个获取表信息
        this.getTableData(param)
        dispatch({
          type: 'tableData/getSchemas',
          payload: param,
        })
      },
    });
  };

  // 获取数据源表信息
  getTableData = param => {
    const { dispatch } = this.props
    dispatch({
      type: 'tableData/getTableData',
      payload: {
        pageNumber: 1,
        pageSize: 10,
        ...param,
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

  // 测试连接
  connectTest = values => {
    const { dispatch, activeData, activeDriver } = this.props;
    const driverInfo = activeDriver.className || activeData.driverInfo;
    const params = values;
    if (params.dbPassword !== activeData.dbPassword) {
      params.dbPassword = window.kddes.getDes(params.dbPassword);
    }
    dispatch({
      type: 'dataSource/connectTest',
      payload: {
        ...params,
        driverInfo,
      },
    });
  }

  // 获取元数据
  getMetaData = () => {
    // 获取元数据
    const { dispatch, activeCID } = this.props;
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
  };

  // 查看表数据详情
  showDetail = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableData/setActiveTableData',
      payload: record,
    })
    dispatch({
      type: 'tableData/getColumnInfo',
      payload: {
        table_id: record.tableId,
      },
    })
    dispatch({
      type: 'tableData/getMetadataPerform',
      payload: {
        connection_id: record.connectionId,
        schema: record.schemName,
        table_name: record.tableName,
      },
    })
    this.toggleModal('columnDetail');
  };

  // 删除表格数据
  delTableData = () => {
    if (!this.tableIds) {
      message.info('Please Select Row');
      return;
    }
    Modal.confirm({
      title: 'Do you Want to delete this items?',
      onOk: () => {
        const { dispatch, activeCID } = this.props;
        dispatch({
          type: 'tableData/delTableData',
          payload: {
            connectionId: activeCID,
            tableIds: this.tableIds,
          },
          callback: () => {
            this.tableIds = '';
            const params = this.searchFrom.current.props.form.getFieldsValue();
            params.connection_id = activeCID;
            params.pageSize = 10;
            params.pageNumber = 1;
            this.getTableData(params);
            this.setState({
              selectedRowKeys: '',
            })
          },
        })
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    })
  };

  // 更新字段/批量更新字段
  updMetadataOrColumn = (type, api) => {
    const { dispatch, activeCID } = this.props;
    if (type === 'all') {
      dispatch({
        type: `tableData/${api}`,
        payload: {
          allCheckFlag: 'Y',
          connectionId: activeCID,
        },
        callback: () => {
          const params = this.searchFrom.current.props.form.getFieldsValue();
          params.connection_id = activeCID;
          params.pageSize = 10;
          params.pageNumber = 1;
          this.getTableData(params);
        },
      })
      return;
    }
    if (!this.tableIds) {
      message.info('Please Select Row');
      return;
    }
    dispatch({
      type: `tableData/${api}`,
      payload: {
        tablesId: this.tableIds,
        connectionId: activeCID,
      },
      callback: () => {
        const params = this.searchFrom.current.props.form.getFieldsValue();
        params.connection_id = activeCID;
        params.pageSize = 10;
        params.pageNumber = 1;
        this.getTableData(params);
      },
    })
  }

  // 生成导出文件
  exportList = () => {
    const { dispatch, activeCID } = this.props;
    dispatch({
      type: 'tableData/exportInfo',
      payload: {
        connectionId: activeCID,
      },
      callback: response => {
        this.downloadFile(response.bcjson.items[0].filePatch)
      },
    });
  };

  // 下载文件
  downloadFile = filePath => {
    const a = document.createElement('a');
    a.href = `/download?fileClass=ZIP&filePath=/${filePath}`;
    a.download = true;
    a.click();
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
        render: (text, record) => (
          <span>
            <Icon
              type="eye"
              onClick={() => { this.showDetail(record) }}
            />
          </span>
        ),
      },
    ];
    const {
      visible: { dataSource, dataSourceType, importMetaData, columnDetail },
      title,
      operation,
      selectedRowKeys,
    } = this.state;
    // 表格多选框
    const rowSelection = {
      selectedRowKeys,
      type: 'checkbox',
      onSelect: (record, selected, selectedRows) => {
        const tableIds = selectedRows.map(item => item.tableId);
        this.tableIds = tableIds.join(',');
      },
      onChange: selectedRowKey => {
        this.setState({
          selectedRowKeys: selectedRowKey,
        })
      },
    };
    const {
      dispatch,
      dataSourceList,
      activeData,
      activeCID,
      tableData,
      activeTableData,
      driverInfo,
      activeDriver,
      schemasNames,
      columnData,
      metadataPerform,
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
                <TabPane tab="数据连接" key="0">
                  <WrappedAdvancedSearchForm
                    schemasNames={schemasNames}
                    getTableData={this.getTableData}
                    activeCID={activeCID}
                    wrappedComponentRef={this.searchFrom}
                  />
                  <TableHeader
                    showSelect
                    showEdit
                    addTableData={this.getMetaData}
                    editTableData={this.showDetail}
                    deleteTableData={this.delTableData}
                  />
                  <Button.Group>
                    <Button type="primary" onClick={() => { this.updMetadataOrColumn('some', 'updMetadata') }}>更新字段</Button>
                    <Button type="primary" onClick={() => { this.updMetadataOrColumn('all', 'updMetadata') }}>批量更新字段</Button>
                    <Button type="primary" onClick={() => { this.updMetadataOrColumn('some', 'updRecordCount') }}>更新行数</Button>
                    <Button type="primary" onClick={() => { this.updMetadataOrColumn('all', 'updRecordCount') }}>批量更新行数</Button>
                    <Button type="primary" onClick={this.exportList}>导出全部列表</Button>
                  </Button.Group>
                  <Table
                    className="basicTable"
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={tableData}
                    pagination={{
                      size: 'small',
                      showSizeChanger: true,
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
          connectTest={this.connectTest}
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
        {/* 查看详情 */}
        <ColumnDetail
          visible={columnDetail}
          toggleModal={this.toggleModal}
          activeTableData={activeTableData}
          columnData={columnData}
          metadataPerform={metadataPerform}
        />
      </PageHeaderWrapper>
    );
  }
}
