/*
 * @Description: 数据集列表页面
 * @Author: lan
 * @Date: 2019-11-28 11:16:36
 * @LastEditTime : 2019-12-23 09:44:15
 * @LastEditors  : lan
 */
import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Icon, Table, Drawer, Form, Button, Pagination, Menu, Dropdown } from 'antd';
import _ from 'lodash';
import router from 'umi/router';
import ClassifyTree from '@/components/ClassifyTree';
import IconFont from '@/components/IconFont';
import { formatTimeString } from '@/utils/utils';
import styles from './DatasetManagement.less';
import OperateTreeForm from './components/OperateTreeForm';
import ParamSetting from './components/drawers/ParamSetting';
import DeleteDataSetDrawer from './components/drawers/DeleteDataSetDrawer';
import DataPerformDrawer from './components/drawers/DataPerformDrawer';
import MoveDataSetDrawer from './components/drawers/MoveDataSetDrawer';
import SearchForm from './components/SearchForm';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ dataSet }) => ({
  classifyTreeData: dataSet.classifyTreeData, // 分类树
  dataSetData: dataSet.dataSetData, // 数据集表格
  activeTree: dataSet.activeTree, // 选中的树节点
  column: dataSet.column, // 数据预览表头
  tableData: dataSet.tableData, // 数据预览数据
  activeFolderId: dataSet.activeFolderId, // 移动文件夹的FolderId
}))
export default class DatasetManagement extends PureComponent {
  operateType = 'ADD'; // 操作类型

  nodeTree = {}; // 树节点详细数据

  record = {}; // 编辑的数据集详细数据

  searchForm = React.createRef(); // 查询表单

  state = {
    drawerTitle: '', // 抽屉标题
    // selectedRowKeys: [], // 默认选中的表格
    visible: {
      operateTree: false, // 新增数据集分类抽屉
      // dataSetName: false, // 数据集属性抽屉
      deleteDataSet: false, // 删除数据集抽屉
      paramSetting: false, // 设置参数值抽屉
      dataPerform: false, // 数据预览抽屉
      move: false, // 移动数据集抽屉
    },
    // 分页器
    page: {
      pageNumber: 1,
      pageSize: 10,
    },
  };

  // 生命周期函数, 获取数据集分类树
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSet/getClassifyTree',
    });
  }

  // 获取数据集列表
  queryDataSet = () => {
    const { dispatch, activeTree } = this.props;
    const { page } = this.state;
    const newPage = {
      pageNumber: '1',
      pageSize: page.pageSize.toString(),
    };
    this.setState({
      page: newPage,
    });
    this.searchForm.current.validateFields((err, values) => {
      dispatch({
        type: 'dataSet/getDataSet',
        payload: {
          datasetName: values.datasetName,
          folderId: activeTree,
          ...newPage,
        },
      });
    });
  };

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
        title="Add Classify"
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
    this.queryDataSet();
    // dispatch({
    //   type: 'dataSet/getDataSet',
    //   payload: {
    //     folderId: value,
    //     pageNumber: this.state.page.pageNumber.toString(),
    //     pageSize: this.state.page.pageSize.toString(),
    //   },
    // });
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

  // 设置参数值
  handleParamSetting = values => {
    this.toggleDrawer('dataPerform');
    const { dispatch } = this.props;
    const params = {};
    params.datasetId = this.record.datasetId;
    params.commandText = this.record.commandText;
    if (values) {
      params.parameters = JSON.stringify([
        {
          ...values,
        },
      ]);
    }
    dispatch({
      type: 'dataSet/getMetadataTablePerform',
      payload: params,
      callback: () => {
        this.record = {};
      },
    });
  };

  // 移动文件夹选中树操作
  changeActiveFolderId = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSet/saveFolderId',
      payload: value,
    });
  };

  // 移动数据集
  handleMove = () => {
    const { dispatch, activeFolderId } = this.props;
    const param = {};
    param.datasetId = this.record.datasetId;
    param.datasetName = this.record.datasetName;
    param.datasourceId = this.record.datasourceId;
    param.datasourceName = this.record.datasourceName;
    param.commandText = this.record.commandText;
    param.datasetParams = this.record.datasetParams;
    param.datasetFields = this.record.datasetFields;
    param.datasetType = this.record.datasetType;
    param.datasetIsDict = this.record.datasetIsDict;
    param.folderId = activeFolderId;
    dispatch({
      type: 'dataSet/operateDataSet',
      payload: param,
    });
    this.toggleDrawer('move');
    this.record = {};
  };

  // 删除数据集
  handleDeleteDataSet = () => {
    const { dispatch } = this.props;
    const param = {};
    param.datasetId = this.record.datasetId;
    param.actionType = 'DELETE';
    dispatch({
      type: 'dataSet/operateDataSet',
      payload: param,
    });
    this.toggleDrawer('deleteDataSet');
    this.record = {};
  };

  /**
   * @description: This is for paging function.
   * @param {type} null
   * @return: undefined
   */
  pageChange = (pageNumber, pageSize) => {
    const page = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    };

    this.setState(
      {
        page,
      },
      () => {
        this.queryDataSet();
      },
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const page = {
      pageNumber: current.toString(),
      pageSize: pageSize.toString(),
    };
    this.setState(
      {
        page,
      },
      () => {
        this.queryDataSet();
      },
    );
  };

  render() {
    // 表格表头
    const columns = [
      {
        title: 'DataSet Name',
        dataIndex: 'datasetName',
        key: 'datasetName',
      },
      {
        title: 'Type',
        dataIndex: 'datasetType',
        key: 'datasetType',
      },
      {
        title: 'Data Source',
        dataIndex: 'datasourceName',
        key: 'datasourceName',
      },
      {
        title: 'Creat by',
        dataIndex: 'createBy',
        key: 'createBy',
      },
      {
        title: 'Modified by',
        dataIndex: 'updateBy',
        key: 'updateBy',
      },
      {
        title: 'Modified at',
        dataIndex: 'updateDatetime',
        key: 'updateDatetime',
        render: text => <span>{formatTimeString(text)}</span>,
      },
      {
        title: 'Operation',
        key: 'Operation',
        render: (text, record) => (
          <span className={styles.operation}>
            <a
              onClick={() => {
                router.push({
                  pathname: '/add-dataset',
                  query: {
                    connectionId: record.datasourceId,
                    connectionName: record.datasourceName,
                    datasetId: record.datasetId,
                  },
                });
              }}
              title="EDIT"
            >
              <IconFont type="icon-edit" className={styles['btn-icon']} />
            </a>
            {/* <a
              href="#"
              onClick={() => {
                this.toggleDrawer('dataSetName');
                this.record = record;
              }}
            >
              <IconFont type="icon-attr" className={styles['btn-icon']} />
            </a> */}
            <a
              onClick={() => {
                this.record = record;
                if (record.datasetParams && JSON.parse(record.datasetParams).length > 0) {
                  this.toggleDrawer('paramSetting');
                } else {
                  this.handleParamSetting();
                }
              }}
              title="PREVIEW"
            >
              <IconFont type="icon-prew" className={styles['btn-icon']} />
            </a>
            <a
              onClick={() => {
                this.toggleDrawer('move');
                this.record = record;
              }}
              title="MOVE TO"
            >
              <IconFont type="icon-move" className={styles['btn-icon']} />
            </a>
            <a
              onClick={() => {
                this.toggleDrawer('deleteDataSet');
                this.record = record;
              }}
              title="DELETE"
            >
              <IconFont type="icon-delete" className={styles['btn-icon']} />
            </a>
          </span>
        ),
      },
    ];
    const menu = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={() => {
            router.push({
              pathname: '/add-dataset',
              query: {
                datasetType: 'SQL',
              },
            });
          }}
        >
          SQL
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            router.push({
              pathname: '/add-dataset',
              query: {
                datasetType: 'PROCEDURE',
              },
            });
          }}
        >
          Stored Procedure (SP)
        </Menu.Item>
      </Menu>
    );
    const { drawerTitle, page } = this.state;
    // 表格多选框
    // const rowSelection = {
    //   selectedRowKeys,
    //   type: 'checkbox',
    //   onSelect: (record, selected, selectedRows) => {
    //     const tableIds = selectedRows.map(item => item.tableId);
    //     this.tableIds = tableIds.join(',');
    //   },
    //   onChange: selectedRowKey => {
    //     this.setState({
    //       selectedRowKeys: selectedRowKey,
    //     });
    //   },
    // };
    const { classifyTreeData, dataSetData, column, tableData, activeFolderId } = this.props;
    const anotherTree = _.cloneDeep(classifyTreeData);
    return (
      <PageHeaderWrapper>
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 185px)' }}>
          <div style={{ flex: '0 0 220px', background: '#fff', zIndex: 1 }}>
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
          <div style={{ flex: 1 }}>
            <div
              style={{ height: '100%', borderLeft: '1px solid #e0e0e0', backgroundColor: '#fff' }}
            >
              {/* <div
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
              </div> */}
              <NewSearchForm search={this.queryDataSet} ref={this.searchForm} />
              <div className={styles.content}>
                <div className={styles.tableTop}>
                  <Dropdown overlay={menu}>
                    <Button className="btn_usual" type="primary">
                      + New DataSet
                    </Button>
                  </Dropdown>
                  {/* <Button
                    onClick={() => {
                      router.push({
                        pathname: '/add-dataset',
                        query: {
                          // connectionId: connectionId,
                        },
                      });
                    }}
                    type="primary"
                    className="btn_usual"
                  >
                    + New DataSet
                  </Button> */}
                </div>
                <Table
                  columns={columns}
                  dataSource={dataSetData}
                  pagination={false}
                  // scroll={{ x: 'max-content' }}
                />
                <Pagination
                  current={page.pageNumber}
                  showSizeChanger
                  showTotal={() =>
                    `Page ${(dataSetData.length || 0) && page.pageNumber} of ${Math.ceil(
                      (dataSetData.length || 0) / page.pageSize,
                    )}`
                  }
                  onShowSizeChange={this.onShowSizeChange}
                  onChange={this.pageChange}
                  total={dataSetData.length}
                  pageSize={page.pageSize}
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
        <Drawer
          title={drawerTitle}
          width={370}
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
        <ParamSetting
          toggleDrawer={this.toggleDrawer}
          visible={this.state.visible.paramSetting}
          clearRecord={this.clearRecord}
          record={this.record}
          handleParamSetting={this.handleParamSetting}
        />
        <DataPerformDrawer
          column={column}
          tableData={tableData}
          visible={this.state.visible.dataPerform}
          toggleDrawer={this.toggleDrawer}
          dispatch={this.props.dispatch}
        />
        <MoveDataSetDrawer
          visible={this.state.visible.move}
          toggleDrawer={this.toggleDrawer}
          classifyTree={anotherTree}
          handleMove={this.handleMove}
          activeFolderId={activeFolderId}
          changeActiveFolderId={this.changeActiveFolderId}
        />
        <DeleteDataSetDrawer
          handleDeleteDataSet={this.handleDeleteDataSet}
          visible={this.state.visible.deleteDataSet}
          toggleDrawer={this.toggleDrawer}
        />
      </PageHeaderWrapper>
    );
  }
}
