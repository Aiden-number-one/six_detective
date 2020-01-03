/*
 * @Description: 数据集列表页面
 * @Author: lan
 * @Date: 2019-11-28 11:16:36
 * @LastEditTime : 2020-01-03 17:18:18
 * @LastEditors  : lan
 */
import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Icon, Table, Drawer, Form, Button, Pagination, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import _ from 'lodash';
import ClassifyTree from '@/components/ClassifyTree';
import IconFont from '@/components/IconFont';
import styles from './DatasetManagement.less';
import { timeFormat } from '@/utils/filter';
import OperateTreeForm from './components/OperateTreeForm';
import DeleteDataSetDrawer from './components/drawers/DeleteDataSetDrawer';
import DataPerformDrawer from './components/drawers/DataPerformDrawer';
import MoveDataSetDrawer from './components/drawers/MoveDataSetDrawer';
import SearchForm from './components/SearchForm';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ dataSet, reportList, loading }) => ({
  classifyTreeData: dataSet.classifyTreeData, // 分类树
  reportList: reportList.reportList, // 报表设计器列表的List
  activeTree: dataSet.activeTree, // 选中的树节点
  column: dataSet.column, // 数据预览表头
  tableData: dataSet.tableData, // 数据预览数据
  loading: loading.effects['reportList/getReportList'] || loading.effects['reportList/delete'],
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
      dataSetName: false, // 数据集属性抽屉
      deleteReport: false, // 删除报表模板
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
  componentDidMount() {
    const { page } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSet/getClassifyTree',
      payload: {
        dataStyle: 'Y',
        fileType: 'R',
      },
    });
    dispatch({
      type: 'reportList/getReportList',
      payload: {
        pageNumber: page.pageNumber.toString(),
        pageSize: page.pageSize.toString(),
      },
    });
  }

  // 获取数据集列表
  queryReportTemplate = value => {
    const { dispatch, activeTree } = this.props;
    const { page } = this.state;
    const newPage = {
      pageNumber: 1,
      pageSize: page.pageSize,
    };
    this.setState({
      page: newPage,
    });
    this.searchForm.current.validateFields((err, values) => {
      dispatch({
        type: 'dataSet/getDataSet',
        payload: {
          sqlName: values.sqlName,
          taskId: value || activeTree,
          isShare: 0,
          ...newPage,
        },
      });
    });
  };

  // 删除数据集列表中的一项
  deleteReportList = async () => {
    const { dispatch } = this.props;
    const { page } = this.state;
    await dispatch({
      type: 'reportList/delete',
      payload: {
        reportId: this.record.reportId,
        actionType: 'DELETE',
      },
    });
    this.toggleDrawer('deleteReport');
    dispatch({
      type: 'reportList/getReportList',
      payload: {
        pageNumber: page.pageNumber.toString(),
        pageSize: page.pageSize.toString(),
      },
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
      <span>Folder</span>
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
    dispatch({
      type: 'dataSet/setActiveTree',
      payload: value,
    });
    this.queryReportTemplate(value);
    // dispatch({
    //   type: 'dataSet/getDataSet',
    //   payload: {
    //     taskId: value,
    //     isShare: 0,
    //     pageNumber: this.state.page.pageNumber.toString(),
    //     pageSize: this.state.page.pageSize.toString(),
    //   },
    // });
  };

  // 操作树节点
  operateClassifyTree = values => {
    const { dispatch } = this.props;
    const param = {};
    param.fileType = 'R';
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

  /**
   * @description: This is for paging function.
   * @param {type} null
   * @return: undefined
   */
  pageChange = (pageNumber, pageSize) => {
    const page = {
      pageNumber,
      pageSize,
    };

    this.setState(
      {
        page,
      },
      () => {
        this.queryReportTemplate();
      },
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const page = {
      pageNumber: current,
      pageSize,
    };
    this.setState(
      {
        page,
      },
      () => {
        this.queryReportTemplate();
      },
    );
  };

  render() {
    // 表格表头
    const columns = [
      {
        title: 'Name',
        dataIndex: 'reportName',
        key: 'reportName',
      },
      {
        title: 'Created By',
        dataIndex: 'createBy',
        key: 'createBy',
      },
      {
        title: 'Modified By',
        dataIndex: 'updateBy',
        key: 'updateBy',
      },
      {
        title: 'Modified at',
        dataIndex: 'updateDatetime',
        key: 'updateDatetime',
        align: 'center',
        render: (res, obj) => <span>{obj.updateDatetime && timeFormat(obj.updateDatetime)}</span>,
      },
      {
        title: 'Operation',
        key: 'Operation',
        align: 'center',
        render: (text, record) => (
          <span className={styles.operation}>
            <a
              href="#"
              onClick={() => {
                window.open(`/report-designer?reportId=${record.reportId}`);
              }}
            >
              <IconFont type="icon-edit" className={styles['btn-icon']} />
            </a>
            <a href="#" onClick={() => {}}>
              <IconFont type="icon-prew" className={styles['btn-icon']} />
            </a>
            <a
              href="#"
              onClick={() => {
                this.toggleDrawer('move');
              }}
            >
              <IconFont type="icon-move" className={styles['btn-icon']} />
            </a>
            <a
              href="#"
              onClick={() => {
                this.toggleDrawer('deleteReport');
                this.record = record;
              }}
            >
              <IconFont type="icon-delete" className={styles['btn-icon']} />
            </a>
          </span>
        ),
      },
    ];
    const { drawerTitle, page } = this.state;
    const { classifyTreeData, reportList, column, tableData, loading } = this.props;
    const anotherTree = _.cloneDeep(classifyTreeData);
    return (
      <PageHeaderWrapper>
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 185px)' }}>
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
            <div
              style={{ height: '100%', borderLeft: '1px solid #e0e0e0', backgroundColor: '#fff' }}
            >
              <NewSearchForm
                search={this.queryReportTemplate}
                ref={this.searchForm}
                inputName="Report Template Name"
              />
              <div className={styles.content}>
                <div className={styles.tableTop}>
                  <Button
                    onClick={() => {
                      window.open('/report-designer');
                    }}
                    type="primary"
                    className="btn-usual"
                  >
                    + New Report Template
                  </Button>
                </div>
                <Table
                  loading={loading}
                  columns={columns}
                  dataSource={reportList}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
                <Pagination
                  current={page.pageNumber}
                  showSizeChanger
                  showTotal={() =>
                    `Page ${(reportList.length || 0) && page.pageNumber} of ${Math.ceil(
                      (reportList.length || 0) / page.pageSize,
                    )}`
                  }
                  onShowSizeChange={this.onShowSizeChange}
                  onChange={this.pageChange}
                  total={reportList.length}
                  pageSize={page.pageSize}
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
        <DataPerformDrawer
          column={column}
          tableData={tableData}
          visible={this.state.visible.dataPerform}
          toggleDrawer={this.toggleDrawer}
        />
        <MoveDataSetDrawer
          visible={this.state.visible.move}
          toggleDrawer={this.toggleDrawer}
          classifyTree={anotherTree}
        />
        <DeleteDataSetDrawer
          handleDeleteDataSet={this.handleDeleteDataSet}
          visible={this.state.visible.deleteDataSet}
          toggleDrawer={this.toggleDrawer}
        />
        {/* 删除 */}
        <Modal
          title={formatMessage({ id: 'app.common.confirm' })}
          visible={this.state.visible.deleteReport}
          onOk={this.deleteReportList}
          onCancel={() => {
            this.toggleDrawer('deleteReport');
          }}
          cancelText={formatMessage({ id: 'app.common.cancel' })}
          okText={formatMessage({ id: 'app.common.confirm' })}
        >
          <span>Please confirm that you want to delete this record?</span>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
