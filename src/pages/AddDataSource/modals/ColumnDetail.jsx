import React, { PureComponent } from 'react';
import { Modal, Tabs, Form, Input, Table } from 'antd';

const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    md: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    md: { span: 12 },
  },
};
export default class DataSourceModal extends PureComponent {
  state={};

  static defaultProps = {
    visible: false, // 是否显示弹框
    toggleModal: () => {}, // 关闭弹框
    activeTableData: {}, // 编辑数据
    columnData: [], // 列数据
    metadataPerform: [], // 表格前20条数据
  };

  render() {
    const columns = [
      {
        title: '列名',
        dataIndex: 'columnName',
        key: 'columnName',
      },
      {
        title: '类型',
        dataIndex: 'columnType',
        key: 'columnType',
      },
      {
        title: '长度',
        dataIndex: 'columnLength',
        key: 'columnLength',
      },
      {
        title: '精度',
        dataIndex: 'columnPrecision',
        key: 'columnPrecision',
      },
      {
        title: '为空',
        dataIndex: 'nullFlag',
        key: 'nullFlag',
      },
      {
        title: '自增',
        dataIndex: 'autoincrementFlag',
        key: 'autoincrementFlag',
      },
      {
        title: '主键',
        dataIndex: 'primaryFlag',
        key: 'primaryFlag',
      },
      {
        title: '外键',
        dataIndex: 'foreignkeyFlag',
        key: 'foreignkeyFlag',
      },
      {
        title: '默认值',
        dataIndex: 'columnDefault',
        key: 'columnDefault',
      },
      {
        title: '描述',
        dataIndex: 'columnDesc',
        key: 'columnDesc',
      },

    ]
    const {
      visible,
      toggleModal,
      activeTableData,
      columnData,
      metadataPerform,
    } = this.props;
    const column = [];
    if (metadataPerform.length > 0) {
      column.push({
        title: 'index',
        dataIndex: 'indexNo',
        key: 'indexNo',
        render: (text, record, index) => `${index + 1}`,
      });
      Object.keys(metadataPerform[0]).forEach(item => {
        column.push({
          title: item,
          dataIndex: item,
          key: item,
        });
      })
    }
    return (
      <Modal
        visible={visible}
        title="Column Detail"
        width={700}
        onCancel={() => {
          toggleModal('columnDetail');
        }}
        footer={false}
      >
        <Tabs defaultActiveKey="0">
          <TabPane tab="信息" key="0">
            <Form {...formItemLayout}>
              <Form.Item label="Table Name">
                <Input disabled value={activeTableData.tableName} />
              </Form.Item>
              <Form.Item label="Object Type">
                <Input disabled value={activeTableData.mdType} />
              </Form.Item>
              <Form.Item label="Database/SID">
                <Input disabled value={activeTableData.tableCat} />
              </Form.Item>
              <Form.Item label="Schem Name">
                <Input disabled value={activeTableData.schemName} />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="列" key="1">
            <Table
              columns={columns}
              dataSource={columnData}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
          <TabPane tab="数据预览" key="3">
            <Table
              columns={column}
              dataSource={metadataPerform}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
