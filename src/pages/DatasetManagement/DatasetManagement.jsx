/*
 * @Description: 数据集列表页面
 * @Author: lan
 * @Date: 2019-11-28 11:16:36
 * @LastEditTime : 2020-01-16 13:13:10
 * @LastEditors  : lan
 */
import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Icon, Table, Drawer, Form, Button, Pagination, Menu, Dropdown } from 'antd';
import _ from 'lodash';
import router from 'umi/router';
import moment from 'moment';
import ClassifyTree from '@/components/ClassifyTree';
import IconFont from '@/components/IconFont';
import { dateFormat, timestampFormat } from '@/pages/DataImportLog/constants';
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
  classifyTreeData: dataSet.classifyTreeData, // 文件夹数据
  dataSetData: dataSet.dataSetData, // 数据集表格数据
  activeTree: dataSet.activeTree, // 选中的文件夹ID
  column: dataSet.column, // 数据预览表头
  tableData: dataSet.tableData, // 数据预览数据
  activeFolderId: dataSet.activeFolderId, // 移动文件夹的FolderId
  totalCount: dataSet.totalCount, // 数据集总数
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
      payload: {
        dataStyle: 'Y',
        fileType: 'D',
      },
    });
  }

  // 组建销毁时，清楚model中的内容
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSet/clearReducer',
    });
  }

  /**
   * @description: 获取数据集列表
   * @param {
   *   newPage: 分页器
   *   folderId: 文件夹ID
   *   datasetName: 数据集名称,用于搜索框
   * }
   * @Author: lan
   * @Date: 2020-01-15 16:49:33
   */
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

  /**
   * @description: 显示隐藏抽屉
   * @param {
   *   key: 控制抽屉显示隐藏的参数名
   * }
   * @Author: lan
   * @Date: 2020-01-15 16:52:13
   */
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
      <span>Folder</span>
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
      drawerTitle: 'Delete Folder',
    });
    this.operateType = 'DELETE';
    this.nodeTree = nodeTree;
    this.toggleDrawer('operateTree');
  };

  // 修改树节点
  handleModifyTree = (e, nodeTree) => {
    this.setState({
      drawerTitle: 'Edit Folder',
    });
    this.operateType = 'EDIT';
    this.nodeTree = nodeTree;
    this.toggleDrawer('operateTree');
  };

  // 新增树节点
  handleAddTree = (e, nodeTree) => {
    this.setState({
      drawerTitle: 'ADD Folder',
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
    if (value) {
      dispatch({
        type: 'dataSet/setActiveTree',
        payload: value,
      });
    }
    setTimeout(() => {
      this.queryDataSet();
    }, 0);
  };

  // 操作树节点
  operateClassifyTree = values => {
    const { dispatch } = this.props;
    const param = {};
    param.fileType = 'D';
    // 新增树节点
    if (this.operateType === 'ADD') {
      param.operType = this.operateType;
      param.isParentFolder = '1';
      // 新增二级以下节点
      if (this.nodeTree) {
        param.folderName = values.folderName;
        param.parentFolderId = this.nodeTree.folderId;
      } else {
        // 新增跟节点
        param.folderName = values.folderName;
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
      param.operType = 'UPD';
      param.folderName = values.folderName;
      param.folderId = this.nodeTree.folderId;
      dispatch({
        type: 'dataSet/operateClassifyTree',
        payload: {
          ...param,
        },
      });
    }
    // 删除节点
    if (this.operateType === 'DELETE') {
      param.operType = 'DEL';
      param.folderId = this.nodeTree.folderId;
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
    // 如果存在参数设置 做数据处理
    if (values) {
      const { datasetParams } = this.record;
      datasetParams.forEach(item => {
        Object.keys(values).forEach(i => {
          if (i === item.parameter_name) {
            item.parameter_value = values[i];
          }
        });
      });
      params.parameters = JSON.stringify(datasetParams);
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
        width: '15%',
        ellipsis: true,
      },
      {
        title: 'Type',
        dataIndex: 'datasetType',
        key: 'datasetType',
        width: 130,
      },
      {
        title: 'Data Source',
        dataIndex: 'datasourceName',
        key: 'datasourceName',
        width: '15%',
        ellipsis: true,
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
        width: 130,
        render: text => (
          <span>{text && moment(formatTimeString(text)).format(timestampFormat)}</span>
        ),
      },
      {
        title: 'Operation',
        key: 'Operation',
        width: 130,
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                router.push({
                  pathname: '/add-dataset',
                  query: {
                    connectionId: record.datasourceId,
                    connectionName: record.datasourceName,
                    datasetId: record.datasetId,
                    datasetType: record.datasetType,
                  },
                });
              }}
              title="EDIT"
            >
              <IconFont type="icon-edit1" className="operation-icon" />
            </a>
            <a
              onClick={() => {
                this.record = record;
                if (record.datasetParams && record.datasetParams.length > 0) {
                  this.toggleDrawer('paramSetting');
                } else {
                  this.handleParamSetting();
                }
              }}
              title="PREVIEW"
            >
              <IconFont type="icon-prew1" className="operation-icon" />
            </a>
            <a
              onClick={() => {
                this.toggleDrawer('move');
                this.record = record;
              }}
              title="MOVE TO"
            >
              <IconFont type="icon-move" className="operation-icon" />
            </a>
            <a
              onClick={() => {
                this.toggleDrawer('deleteDataSet');
                this.record = record;
              }}
              title="DELETE"
            >
              <IconFont type="icon-delete2" className="operation-icon" />
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
    const {
      classifyTreeData,
      dataSetData,
      column,
      tableData,
      activeFolderId,
      totalCount,
    } = this.props;
    const anotherTree = _.cloneDeep(classifyTreeData);
    return (
      <PageHeaderWrapper>
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 185px)' }}>
          <div style={{ flex: '0 0 220px', background: '#fff', zIndex: 1 }}>
            {this.Title()}
            {classifyTreeData.length > 0 && (
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
                  currentKey: 'folderId',
                  currentName: 'folderName',
                  parentKey: 'parentId',
                }}
                onSelect={this.onSelect}
                showSearch={false}
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ height: '100%', borderLeft: '1px solid #e0e0e0', backgroundColor: '#fff' }}
            >
              <NewSearchForm search={this.queryDataSet} ref={this.searchForm} />
              <div className={styles.content}>
                <div className={styles.tableTop}>
                  <Dropdown overlay={menu}>
                    <Button className="btn-usual" type="primary" style={{ width: 160 }}>
                      + New DataSet
                    </Button>
                  </Dropdown>
                </div>
                <Table
                  columns={columns}
                  dataSource={dataSetData}
                  pagination={false}
                  // scroll={{ x: 'max-content' }}
                />
                {!!totalCount && (
                  <Pagination
                    current={page.pageNumber}
                    showSizeChanger
                    showTotal={() => `Total ${totalCount} items`}
                    onShowSizeChange={this.onShowSizeChange}
                    onChange={this.pageChange}
                    total={totalCount}
                    pageSize={page.pageSize}
                    size="small"
                  />
                )}
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
