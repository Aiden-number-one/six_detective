import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Icon, Button, Table, Input, Drawer } from 'antd';
import router from 'umi/router';
import ClassifyTree from '@/components/ClassifyTree';
import styles from './DatasetManagement.less';
import OperateTreeForm from './components/OperateTreeForm';
import AlterDataSetName from './components/drawers/AlterDataSetName';
import DeleteDataSetDrawer from './components/drawers/DeleteDataSetDrawer';
import DataPerformDrawer from './components/drawers/DataPerformDrawer';

const { Search } = Input;

@connect(({ dataSet }) => ({
  classifyTreeData: dataSet.classifyTreeData,
  dataSetData: dataSet.dataSetData,
  column: dataSet.column, // 数据预览表头
  tableData: dataSet.tableData, // 数据预览数据
}))
export default class DatasetManagement extends PureComponent {
  operateType = 'ADD';

  nodeTree = {};

  record = {};

  state = {
    drawerTitle: '', // 抽屉标题
    selectedRowKeys: [], // 默认选中的表格
    visible: {
      operateTree: false, // 新增数据集分类抽屉
      dataSetName: false, // 数据集属性抽屉
      deleteDataSet: false, // 删除数据集抽屉
      dataPerform: false, // 数据预览抽屉
    },
  };

  // 生命周期函数, 获取数据集分类树
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSet/getClassifyTree',
    });
  }

  // 显示隐藏抽屉
  toggleDrawer = key => {
    const { visible } = this.state;
    this.setState({
      visible: {
        ...visible,
        [key]: !visible[key],
      },
    });
  };

  // 数据源列表标题
  Title = () => (
    <span className={styles.titleBox}>
      <span>DataSet Classify</span>
      <Icon
        type="plus"
        onClick={() => {
          this.handleAddTree();
        }}
      />
    </span>
  );

  // 清除正在编辑的树节点数据
  clearNodeTree = () => {
    this.nodeTree = {};
  };

  // 清除正在编辑的数据集
  clearRecord = () => {
    this.record = {};
  };

  // 删除树节点
  handleDeleteTree = (e, nodeTree) => {
    this.setState({
      drawerTitle: 'Delete DataSet Classify',
    });
    this.operateType = 'DELETE';
    this.nodeTree = nodeTree;
    this.toggleDrawer('operateTree');
  };

  // 修改树节点
  handleModifyTree = (e, nodeTree) => {
    this.setState({
      drawerTitle: 'Edit DataSet Classify',
    });
    this.operateType = 'EDIT';
    this.nodeTree = nodeTree;
    this.toggleDrawer('operateTree');
  };

  // 新增树节点
  handleAddTree = (e, nodeTree) => {
    this.setState({
      drawerTitle: 'ADD DataSet Classify',
    });
    this.operateType = 'ADD';
    if (nodeTree) {
      this.nodeTree = nodeTree;
    }
    this.toggleDrawer('operateTree');
  };

  // 选中树
  onSelect = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSet/setActiveTree',
      payload: value,
    });
    dispatch({
      type: 'dataSet/getDataSet',
      payload: {
        taskId: value,
        isShare: 0,
      },
    });
  };

  // 操作树节点
  operateClassifyTree = values => {
    const { dispatch } = this.props;
    const param = {};
    // 新增树节点
    if (this.operateType === 'ADD') {
      // 新增二级以下节点
      if (this.nodeTree) {
        param.className = values.className;
        param.parentClassId = this.nodeTree.classId;
      } else {
        // 新增跟节点
        param.className = values.className;
      }
      dispatch({
        type: 'dataSet/operateClassifyTree',
        payload: {
          ...param,
        },
      });
    }
    // 修改节点
    if (this.operateType === 'EDIT') {
      param.className = values.className;
      param.classId = this.nodeTree.classId;
      dispatch({
        type: 'dataSet/operateClassifyTree',
        payload: {
          ...param,
        },
      });
    }
    // 删除节点
    if (this.operateType === 'DELETE') {
      param.ids = [this.nodeTree.classId];
      dispatch({
        type: 'dataSet/deleteClassifyTree',
        payload: {
          ...param,
        },
      });
    }
    this.toggleDrawer('operateTree');
    this.nodeTree = {};
  };

  // 修改数据集属性
  handleSetDataSetName = values => {
    const { dispatch } = this.props;
    const param = { ...this.record, ...values };
    param.basicOperation = 'update';
    dispatch({
      type: 'dataSet/operateDataSet',
      payload: param,
    });
    this.toggleDrawer('dataSetName');
    this.record = {};
  };

  // 删除数据集
  handleDeleteDataSet = () => {
    const { dispatch } = this.props;
    const param = {};
    param.serialNo = this.record.serialNo;
    param.basicOperation = 'del';
    dispatch({
      type: 'dataSet/operateDataSet',
      payload: param,
    });
    this.toggleDrawer('deleteDataSet');
    this.record = {};
  };

  render() {
    // 表格表头
    const columns = [
      {
        title: 'Name',
        dataIndex: 'sqlName',
        key: 'sqlName',
      },
      {
        title: 'Type',
        dataIndex: 'mdType',
        key: 'mdType',
      },
      {
        title: 'Data Source',
        dataIndex: 'tableCat',
        key: 'tableCat',
      },
      {
        title: 'Creat by',
        dataIndex: 'schemName',
        key: 'schemName',
      },
      {
        title: 'Modified by',
        dataIndex: 'lastOperator',
        key: 'lastOperator',
        render: text => <span style={{ color: '#6ed2cb' }}>{text}</span>,
      },
      {
        title: 'Modified at',
        dataIndex: 'lastupdatetime',
        key: 'lastupdatetime',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <>
            <Icon
              type="edit"
              onClick={() => {
                router.push({
                  pathname: '/add-dataset',
                  query: {
                    connectionId: record.dbId,
                    record: JSON.stringify(record),
                  },
                });
              }}
            />
            <Icon
              type="copy"
              onClick={() => {
                this.toggleDrawer('dataSetName');
                this.record = record;
              }}
            />
            <Icon
              type="eye"
              onClick={() => {
                const { dispatch } = this.props;
                dispatch({
                  type: 'dataSet/getMetadataTablePerform',
                  payload: {
                    connectionId: record.dbId,
                    previewStatement: record.sqlStatement,
                    previewNum: 10,
                  },
                  callback: () => {
                    this.toggleDrawer('dataPerform');
                  },
                });
              }}
            />
            <Icon
              type="delete"
              onClick={() => {
                this.toggleDrawer('deleteDataSet');
                this.record = record;
              }}
            />
          </>
        ),
      },
    ];
    const { selectedRowKeys, drawerTitle } = this.state;
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
    const { classifyTreeData, dataSetData, column, tableData } = this.props;
    return (
      <PageHeaderWrapper>
        <div style={{ display: 'flex', minHeight: 500 }}>
          <div style={{ flex: '0 0 220px', background: '#fff' }}>
            {this.Title()}
            <ClassifyTree
              add
              modify
              move
              handleAddTree={this.handleAddTree}
              handleModifyTree={this.handleModifyTree}
              handleDeleteTree={this.handleDeleteTree}
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
                    router.push({
                      pathname: '/add-dataset',
                      query: {
                        // connectionId: connectionId,
                      },
                    });
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
        <Drawer
          title={drawerTitle}
          width={350}
          visible={this.state.visible.operateTree}
          onClose={() => {
            this.clearNodeTree();
            this.toggleDrawer('operateTree');
          }}
          destroyOnClose
        >
          <OperateTreeForm
            handleSubmit={this.operateClassifyTree}
            nodeTree={this.operateType === 'ADD' ? {} : this.nodeTree}
            toggleDrawer={this.toggleDrawer}
            clearNodeTree={this.clearNodeTree}
            operateType={this.operateType}
          />
        </Drawer>
        <AlterDataSetName
          toggleDrawer={this.toggleDrawer}
          visible={this.state.visible.dataSetName}
          clearRecord={this.clearRecord}
          record={this.record}
          handleSetDataSetName={this.handleSetDataSetName}
        />
        <DeleteDataSetDrawer
          handleDeleteDataSet={this.handleDeleteDataSet}
          visible={this.state.visible.deleteDataSet}
          toggleDrawer={this.toggleDrawer}
        />
        <DataPerformDrawer
          column={column}
          tableData={tableData}
          visible={this.state.visible.dataPerform}
          toggleDrawer={this.toggleDrawer}
        />
      </PageHeaderWrapper>
    );
  }
}
