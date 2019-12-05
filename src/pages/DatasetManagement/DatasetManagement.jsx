import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Icon, Button, Table, Input } from 'antd';
import ClassifyTree from '@/components/ClassifyTree';
import styles from './DatasetManagement.less';

const { Search } = Input;

@connect(({ dataSet }) => ({
  classifyTreeData: dataSet.classifyTreeData,
  dataSetData: dataSet.dataSetData,
}))
export default class DatasetManagement extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSet/getClassifyTree',
    });
  }

  // 数据源列表标题
  Title = () => (
    <span className={styles.titleBox}>
      <span>DataSet Classify</span>
      <Icon
        type="plus"
        onClick={() => {
          // this.toggleModal('dataSourceType', 'ADD');
        }}
      />
    </span>
  );

  onSelect = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSet/getDataSet',
      payload: {
        taskId: value,
        isShare: 0,
      },
    });
    console.log('value=', value);
  };

  render() {
    // 表格表头
    const columns = [
      {
        title: 'Name',
        dataIndex: 'tableName',
        key: 'tableName',
        // sorter: (a, b) => a.name[1].length - b.name[1].length,
      },
      {
        title: 'Type',
        dataIndex: 'mdType',
        key: 'mdType',
        // sorter: (a, b) => a.name[1].length - b.name[1].length,
      },
      {
        title: 'Data Source',
        dataIndex: 'tableCat',
        key: 'tableCat',
        // sorter: (a, b) => a.name[1].length - b.name[1].length,
      },
      {
        title: 'Creat by',
        dataIndex: 'schemName',
        key: 'schemName',
        // sorter: (a, b) => a.name[1].length - b.name[1].length,
      },
      {
        title: 'Modified by',
        dataIndex: 'recordCount',
        key: 'recordCount',
        render: text => <span style={{ color: '#6ed2cb' }}>{text}</span>,
      },
      {
        title: 'Modified at',
        dataIndex: 'tableDesc',
        key: 'tableDesc',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Icon
              type="eye"
              onClick={() => {
                this.showDetail(record);
              }}
            />
          </span>
        ),
      },
    ];
    const { selectedRowKeys } = this.state;
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
        });
      },
    };
    const { classifyTreeData, dataSetData } = this.props;
    return (
      <PageHeaderWrapper>
        <div style={{ display: 'flex', minHeight: 500 }}>
          <div style={{ flex: '0 0 220px', background: '#fff' }}>
            {this.Title()}
            <ClassifyTree
              checkable={false}
              treeData={classifyTreeData}
              treeKey={{
                currentKey: 'classId',
                currentName: 'className',
              }}
              onSelect={this.onSelect}
              showSearch={false}
            />
          </div>
          <div style={{ flex: 1, overflowX: 'auto' }}>
            <div style={{ height: '100%', padding: '0 0 0 15px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 5px 0',
                  backgroundColor: '#fff',
                }}
              >
                <Button
                  style={{ width: 120 }}
                  type="primary"
                  onClick={() => {
                    this.updMetadataOrColumn('some', 'updMetadata');
                  }}
                >
                  Creat DataSet
                </Button>
                <Search
                  style={{ width: 220 }}
                  onSearch={value => {
                    this.getDataSourceList(value);
                  }}
                />
              </div>
              <Table
                className="basicTable"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSetData}
                pagination={{
                  size: 'small',
                  showSizeChanger: true,
                }}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}
