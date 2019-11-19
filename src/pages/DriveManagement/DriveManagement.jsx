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
  Button,
  Select,
  message,
} from 'antd';

import styles from './DriveManagement.less';
// import DataSourceModal from './modals/DataSourceModal';
// import DataSoureceTypeModal from './modals/DataSoureceTypeModal';

const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    md: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    md: { span: 10 },
  },
};

class AdvancedForm extends PureComponent {
  static defaultProps = {
    databaseType: {},
    getCategory: {},
    activeDriver: {},
  };

  state = {};

  render() {
    const { databaseType, getCategory, activeDriver } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...formItemLayout}>
        <Form.Item label="DataBase Type">
          {getFieldDecorator('databasetype', {
            rules: [{ required: true, message: 'Error' }],
            initialValue: activeDriver.databasetype,
          })(
            <Select
              placeholder="please select"
              dropdownClassName="selectDropdown"
              allowClear
            >
              {Object.values(databaseType).map((item, index) => (
                <Option value={index + 1}>{item}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Driver Category">
          {getFieldDecorator('driver_category', {
            rules: [{ required: true, message: 'Error' }],
            initialValue: activeDriver.driver_category,
          })(
            <Select
              placeholder="please select"
              dropdownClassName="selectDropdown"
              allowClear
            >
              {Object.values(getCategory).map((item, index) => (
                <Option value={index + 1}>{item}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Driver Name">
          {getFieldDecorator('driverName', {
            rules: [{ required: true, message: 'Error' }],
            initialValue: activeDriver.driverName,
          })(
            <Input placeholder="Type Here" />,
          )}
        </Form.Item>
        <Form.Item label="Class Name">
          {getFieldDecorator('className', {
            rules: [{ required: true, message: 'Error' }],
            initialValue: activeDriver.className,
          })(
            <Input placeholder="Type Here" />,
          )}
        </Form.Item>
        <Form.Item label="Url Info">
          {getFieldDecorator('urlInfo', {
            rules: [{ required: true, message: 'Error' }],
            initialValue: activeDriver.urlInfo,
          })(
            <Input placeholder="Type Here" />,
          )}
        </Form.Item>
        <Form.Item label="dbPort">
          {getFieldDecorator('dbPort', {
            rules: [{ required: true, message: 'Error' }],
            initialValue: activeDriver.dbPort,
          })(
            <Input placeholder="Type Here" />,
          )}
        </Form.Item>
        <Form.Item label="max Time">
          {getFieldDecorator('maxtime', {
            rules: [{ required: true, message: 'Error' }],
            initialValue: activeDriver.maxtime,
          })(
            <Input placeholder="Type Here" />,
          )}
        </Form.Item>
      </Form>
    );
  }
}

const WrappedAdvancedForm = Form.create({ name: 'advanced_search' })(AdvancedForm);

@connect(({ driverInfo }) => ({
  driverInfo: driverInfo.driverInfo, // 驱动
  activeDriver: driverInfo.activeDriver, // 选中的驱动信息
  databaseType: driverInfo.databaseType, // 资源类型字典
  category: driverInfo.category, // 驱动类型字典
}))
export default class DriveManagement extends PureComponent {
  state = {
    visible: {
      dataSource: false, // 新增驱动弹框
      dataSourceType: false, // 上传jar包弹框
    },
    operation: 'ADD', // 驱动操作类型
    tabTitle: 'Drive Management', // 驱动名
  };

  searchFrom = React.createRef();

  componentDidMount() {
    // 获取资源类型字典
    this.getDataBaseType();
    // 获取驱动列表
    this.getDataDriverList();
    // 获取驱动类型字典
    this.getCategory();
  }

  // 获取资源类型字典
  getDataBaseType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverInfo/getDataBaseType',
      payload: {
        dictValue: 'DATABASETYPE',
      },
    })
  };

  // 获取驱动类型字典
  getCategory = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverInfo/getCategory',
      payload: {
        dictValue: 'CATEGORY',
      },
    })
  };

  // 获取驱动列表
  getDataDriverList = driverName => {
    const { dispatch } = this.props;
    dispatch({
      type: 'driverInfo/getDataDriver',
      payload: {
        driverName,
      },
      callback: response => {
        this.setState({
          tabTitle: response.bcjson.items[0].driverName,
        })
        // 成功时默认选中第一个
        dispatch({
          type: 'driverInfo/setActiveDriver',
          payload: response.bcjson.items[0],
        })
      },
    });
  };

  // 驱动列表标题
  Title = () => (
    <span className={styles.titleBox}>
      <span>Drive Management</span>
      <Icon
        type="plus"
        onClick={() => {
          this.toggleModal('dataSourceType', 'ADD');
        }}
      />
    </span>
  );

  // 驱动列表查询框
  SearchBox = () => (
    <div className={styles.searchBox}>
      <Search
        onSearch={value => {
          this.getDataDriverList(value);
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

  // 操作驱动
  operateDataSource = values => {
    const { operation } = this.state;
    const { dispatch, activeData, activeDriver } = this.props;
    if (operation === 'DEL') {
      dispatch({
        type: 'driverInfo/delDataSource',
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
        type: 'driverInfo/setDatasource',
        payload: {
          ...params,
          driverInfo,
        },
      });
    }
    // 修改数据源
    if (operation === 'EDIT') {
      dispatch({
        type: 'driverInfo/updDataSource',
        payload: {
          ...params,
          driverInfo,
          connectionId: activeData.connectionId,
        },
      });
    }
  };

  // 删除表格数据
  delTableData = () => {
    Modal.confirm({
      title: 'Do you Want to delete this items?',
      onOk: () => {
        const { dispatch, activeCID } = this.props;
        dispatch({
          type: 'driverInfo/delTableData',
          payload: {
            connectionId: activeCID,
          },
          callback: () => {
            const params = this.searchFrom.current.props.form.getFieldsValue();
            params.connection_id = activeCID;
            params.pageSize = 10;
            params.pageNumber = 1;
          },
        })
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    })
  };

  render() {
    // 表格表头
    const columns = [
      {
        title: 'index',
        dataIndex: 'indexNo',
        key: 'indexNo',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: 'FileName',
        dataIndex: 'mdType',
        key: 'mdType',
      },
      {
        title: 'operation',
        key: 'action',
        render: (text, record) => (
          <span>
            <Icon
              type="delete"
              onClick={() => { this.showDetail(record) }}
            />
          </span>
        ),
      },
    ];
    const {
      visible: { dataSource, dataSourceType },
      operation,
      tabTitle,
    } = this.state;
    const {
      dispatch,
      driverInfo,
      activeDriver,
      databaseType,
      getCategory,
    } = this.props;
    return (
      <PageHeaderWrapper>
        <div style={{ display: 'flex', minHeight: 500 }}>
          <div style={{ flex: '0 0 200px', background: '#f2f6f8' }}>
            {this.Title()}
            {this.SearchBox()}
            <div className={styles.driverInfoList}>
              {driverInfo.map(item => (
                <div
                  key={item.driverId}
                  className={styles.driverInfoItem}
                  onClick={e => {
                    e.stopPropagation();
                    // 点击驱动详细信息
                    this.setState({
                      tabTitle: item.driverName,
                    })
                    dispatch({
                      type: 'driverInfo/setActiveDriver',
                      payload: item,
                    });
                  }}
                  style={
                    activeDriver.driverId === item.driverId
                      ? { border: '1px solid #10416c', backgroundColor: '#dde6eb' }
                      : {}
                  }
                >
                  <span className={styles.driverInfoName} title={item.driverName}>
                    {item.driverName}
                  </span>
                  <span>
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
                <TabPane tab={tabTitle} key="0">
                  <WrappedAdvancedForm
                    databaseType={databaseType}
                    getCategory={getCategory}
                    activeDriver={activeDriver}
                    wrappedComponentRef={this.searchFrom}
                  />
                  <Button.Group>
                    <Button type="primary" onClick={() => { this.updMetadataOrColumn('some', 'updMetadata') }}>选择JAR包</Button>
                  </Button.Group>
                  <Table
                    className="basicTable"
                    columns={columns}
                    // dataSource={}
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
        {/* <DataSourceModal
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
        /> */}
        {/* 新增数据源类型弹框 */}
        {/* <DataSoureceTypeModal
          visible={dataSourceType}
          toggleModal={this.toggleModal}
          setAddDataSourceTitle={this.setAddDataSourceTitle}
          setActiveDriver={this.setActiveDriver}
        /> */}
      </PageHeaderWrapper>
    );
  }
}
