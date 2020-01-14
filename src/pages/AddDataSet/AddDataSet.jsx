/*
 * @Description: 新建数据集
 * @Author: lan
 * @Date: 2019-12-07 14:24:54
 * @LastEditTime : 2020-01-14 12:10:58
 * @LastEditors  : lan
 */
import React, { PureComponent } from 'react';
import {
  Icon,
  message,
  Input,
  Select,
  Button,
  Layout,
  Table,
  Row,
  Col,
  Checkbox,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';
import classNames from 'classnames';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import IconFont from '@/components/IconFont';
import styles from './AddDataSet.less';
import ConnList from './components/ConnList';
import CodeMirrorComponent from './components/CodeMirror';
import ParamSetting from './components/drawers/ParamSetting';
import Save from './components/drawers/Save';
import ValueSetting from './components/drawers/ValueSetting';
import ResizeableTitle from './components/ResizeableTitle';

const { Sider, Content, Header } = Layout;
const { Option } = Select;

@connect(({ sqlDataSource, getClassifyTree }) => ({
  // sql: sqlKeydown.sql, // sql查询语句
  connectionId: sqlDataSource.connectionId, // 选中的数据源ID
  classifyTree: getClassifyTree.classifyTree, // 分类树
  dataSourceList: sqlDataSource.dataSourceList, // 数据源选择框
  totalCount: sqlDataSource.totalCount, // 数据源下表的总数
  metaDataTableList: sqlDataSource.metaDataTableList, // 数据源下的表
  procedureDataList: sqlDataSource.procedureDataList, // 数据源下的存储过程
  tableData: sqlDataSource.tableData, // 数据预览的表数据
  column: sqlDataSource.column, // 数据预览表头
  sqlDataSetName: sqlDataSource.sqlDataSetName, // 数据集名称
  defaultPageSize: sqlDataSource.defaultPageSize, // 默认一页行数
  columnData: sqlDataSource.columnData, // 列数据
  dataSet: sqlDataSource.dataSet, // 数据集详情
  variableList: sqlDataSource.variableList, // 参数设置
}))
class AddDataSet extends PureComponent {
  // 可拖动的表格
  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  pageNumber = 1; // 左侧数据源表滚动加载相关

  isSaveOther = false; // 是否另存为

  constructor(props) {
    super(props);
    this.inputRef = React.createRef(); // 数据集名称
  }

  state = {
    visible: {
      valueSetting: false, // 设置参数值抽屉
      paramSetting: false, // 控制参数设置抽屉
      save: false, // 控制保存数据集抽屉
    },
    AlterDataSetName: true, // 操作数据集名称
    tableView: 'data', // 切换预览数据或查看列数据
    pageNumber: '1', // 表格分页
    sql: '', // sql语句
    filterName: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const {
      location: {
        query: { connectionId, connectionName, datasetId, datasetType },
      },
    } = this.props;
    this.connection_id = connectionId;
    this.connection_name = connectionName;
    this.datasetId = datasetId;
    // 获取数据源
    dispatch({
      type: 'sqlDataSource/getDataSourceList',
      payload: { connectionId, datasetType },
    });
    // 获取数据集分类树
    dispatch({
      type: 'getClassifyTree/getClassifyTree',
      payload: {
        dataStyle: 'Y',
        fileType: 'D',
      },
    });
    // 如果是修改数据集
    if (datasetId) {
      // 获取数据集详情
      dispatch({
        type: 'sqlDataSource/getDataSetDetail',
        payload: {
          datasetId,
        },
        callback: items => {
          // SQL或存储过程回显
          dispatch({
            type: 'sqlKeydown/changeSql',
            payload: items.commandText,
          });
          this.setState({
            sql: items.commandText,
          });
          // 数据集名称回显
          dispatch({
            type: 'sqlDataSource/changeDataSetName',
            payload: items.datasetName,
          });
        },
      });
    }
  }

  componentDidUpdate() {
    // isTableScroll
    // if(document.getElementsByClassName('ant-table').length > 0
    // && document.getElementsByClassName('ant-table')[0].clientHeight < window.innerHeight - 381 ){
    //   document.getElementsByClassName('ant-table-header')[0].style.marginRight = '0px'
    // } else {
    //   document.getElementsByClassName('ant-table-header')[0].style.marginRight = '12px'
    // }
  }

  componentWillUnmount() {
    // 离开页面时初始化数据
    const { dispatch } = this.props;
    dispatch({
      type: 'sqlKeydown/clear',
    });
    dispatch({
      type: 'sqlDataSource/clearAll',
    });
  }

  // 获取参数设置
  getVariableList = callback => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sqlDataSource/getVariableList',
      payload: {
        scriptContent: this.state.sql,
      },
      callback,
    });
  };

  // 修改参数设置
  saveDatasetParams = datasetParams => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sqlDataSource/setVariableList',
      payload: datasetParams,
    });
    this.toggleModal('paramSetting');
  };

  // 刷新数据源表列表
  loadMore = () => {
    const {
      dispatch,
      totalCount,
      location: {
        query: { datasetType }, // 存储过程或者sql
      },
      dataSourceList,
    } = this.props;
    // eslint-disable-next-line no-plusplus
    if (this.pageNumber++ >= totalCount / 30) {
      return false;
    }
    if (datasetType === 'SQL') {
      dispatch({
        // 获取数据源表
        type: 'sqlDataSource/getMetadataList',
        payload: {
          connection_id:
            this.connection_id ||
            (dataSourceList && dataSourceList[0] && dataSourceList[0].connectionId),
          pageNumber: this.pageNumber.toString(),
          pageSize: '30',
        },
      });
    }
    return true;
  };

  // 多选框选择改变数据表列表
  checkBoxChange = checkedValues => {
    const { dispatch, dataSourceList } = this.props;
    if (checkedValues.length === 2) {
      // 清空列表
      dispatch({
        type: 'sqlDataSource/clear',
        payload: [],
      });
      dispatch({
        type: 'sqlDataSource/getMetadataList',
        payload: {
          connection_id:
            this.connection_id || (dataSourceList[0] && dataSourceList[0].connectionId),
          pageNumber: this.pageNumber.toString(),
          pageSize: '30',
        },
      });
    } else if (checkedValues.length === 1) {
      let mdTypeOri = '';
      if (checkedValues[0] === '0') {
        mdTypeOri = 'T';
      } else {
        mdTypeOri = 'V';
      }
      dispatch({
        type: 'sqlDataSource/clear',
        payload: [],
      });
      dispatch({
        type: 'sqlDataSource/getMetadataList',
        payload: {
          connection_id:
            this.connection_id || (dataSourceList[0] && dataSourceList[0].connectionId),
          pageNumber: this.pageNumber.toString(),
          pageSize: '30',
          mdTypeOri,
        },
      });
    } else {
      dispatch({
        type: 'sqlDataSource/clear',
        payload: [],
      });
    }
  };

  // 数据预览表头
  perfectColumn = () => {
    const { column } = this.props;
    return (
      column &&
      column.map((valueV, index) => {
        const { value, width, type } = valueV;
        return {
          title: (
            <div className={styles.titleHasIcon}>
              <IconFont
                type={type === 'dimension' ? 'icon-icon-str' : 'icon-NO2'}
                style={{
                  color: type === 'dimension' ? '#396dfe' : '#17c4bb',
                }}
              />
              {value}
            </div>
          ),
          dataIndex: value,
          key: value,
          align: type === 'dimension' ? 'left' : 'right',
          render: text => {
            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(Number(text))) {
              return <span>{text && text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</span>;
            }
            return <span>{text}</span>;
          },
          width,
          onHeaderCell: columns => ({
            width: columns.width,
            onResize: this.handleResize(index),
          }),
        };
      })
    );
  };

  // 伸缩表格
  handleResize = index => (e, { size }) => {
    if (size.width < 70) {
      return false;
    }
    const { dispatch, column } = this.props;
    column[index].width = size.width;
    _.debounce(
      () =>
        dispatch({
          type: 'sqlDataSource/changeColumn',
          payload: [...column],
        }),
      10,
    )();
    return true;
  };

  // 显示关闭抽屉
  toggleModal = key => {
    const { visible } = this.state;
    this.setState({
      visible: {
        ...visible,
        [key]: !visible[key],
      },
    });
  };

  // 数据预览
  handlePreview = values => {
    const { dispatch, variableList, dataSourceList } = this.props;
    const params = {};
    if (values) {
      const datasetParams = _.cloneDeep(variableList);
      datasetParams.forEach(item => {
        Object.keys(values).forEach(i => {
          if (i === item.parameter_name) {
            item.parameter_value = values[i];
          }
        });
      });
      params.parameters = JSON.stringify(datasetParams);
    }
    params.datasourceId =
      this.connection_id || (dataSourceList && dataSourceList[0] && dataSourceList[0].connectionId);
    params.commandText = this.state.sql;
    params.previewNum = 20;
    dispatch({
      type: 'sqlDataSource/getMetadataTablePerform',
      payload: params,
    });
    dispatch({
      type: 'sqlDataSource/getColumn',
      payload: params,
    });
  };

  // 保存操作
  saveSql = fieldsValue => {
    const {
      dispatch,
      dataSet,
      location: {
        query: { datasetType },
      },
      variableList,
      dataSourceList,
    } = this.props;
    dispatch({
      type: 'sqlDataSource/addDataSet',
      payload: {
        datasourceId:
          this.connection_id ||
          (dataSourceList && dataSourceList[0] && dataSourceList[0].connectionId),
        datasourceName: this.connection_name,
        commandText: this.state.sql,
        datasetParams: JSON.stringify(variableList),
        datasetFields: JSON.stringify([]),
        datasetType: dataSet.datasetType || datasetType,
        datasetIsDict: 'N',
        datasetName: fieldsValue.sqlDataSetName,
        folderId: fieldsValue.folder,
        datasetId: this.isSaveOther ? '' : this.datasetId,
      },
    });
    // 保存后跳转页面初始化
    this.pageNumber = 1;
    this.isSaveOther = false;
    this.connection_id = '';
    this.connection_name = '';
    this.datasetId = '';
  };

  // 表格分页
  pageChange = pageNumber => {
    this.setState({
      pageNumber,
    });
  };

  // 修改sql语句
  alterInputSql = value => {
    this.setState({
      sql: value,
    });
  };

  render() {
    const {
      dataSourceList, // 数据源
      metaDataTableList, // 数据源表
      procedureDataList, // 存储过程
      dispatch,
      tableData, // 数据预览数据
      classifyTree, // 数据集分类树
      defaultPageSize, // 表格默认一页展示数
      sqlDataSetName, // 数据集名称
      columnData, // 列数据
      dataSet, // 修改数据集时的数据集详情
      location: {
        query: { datasetType }, // 存储过程或者sql
      },
      variableList, // 参数列表
    } = this.props;
    // 预览列表头
    const column = [
      {
        title: 'Column Name',
        dataIndex: 'field_data_name',
        key: 'field_data_name',
      },
      {
        title: 'Column Count',
        dataIndex: 'column_no',
        key: 'column_no',
      },
      {
        title: 'Column Type',
        dataIndex: 'field_data_type',
        key: 'field_data_type',
      },
    ];
    const { AlterDataSetName, pageNumber, filterName } = this.state; // 修改数据集名称切换, 表格分页器
    const renderColumn = this.perfectColumn();
    return (
      <DndProvider backend={HTML5Backend}>
        <Layout className={classNames(styles.addDataSet, 'proLayout')}>
          <Header className={styles.header}>
            <Row>
              <Col span={12}>
                <Button
                  onClick={() => {
                    router.goBack();
                  }}
                  className={styles.backBtn}
                  title="BACK"
                >
                  <Icon type="left" style={{ color: '#fff' }} />
                </Button>
                {AlterDataSetName && (
                  <IconFont
                    style={{
                      paddingLeft: 10,
                      paddingRight: 10,
                      color: '#fff',
                    }}
                    type="icon-SQLDataSet"
                  />
                )}
                {AlterDataSetName && (
                  <span
                    onClick={() => {
                      this.setState({
                        AlterDataSetName: false,
                      });
                      setTimeout(() => {
                        this.inputRef.current.focus();
                      }, 50);
                    }}
                    style={{ color: '#fff' }}
                  >
                    {sqlDataSetName || 'DataSet Name'}
                  </span>
                )}
                {!AlterDataSetName && (
                  <Input
                    ref={this.inputRef}
                    type="text"
                    value={sqlDataSetName}
                    onBlur={e => {
                      // 修改数据集名称
                      dispatch({
                        type: 'sqlDataSource/changeDataSetName',
                        payload: e.target.value,
                      });
                      this.setState({
                        AlterDataSetName: true,
                      });
                    }}
                    onChange={e => {
                      // 修改数据集名称
                      dispatch({
                        type: 'sqlDataSource/changeDataSetName',
                        payload: e.target.value,
                      });
                    }}
                    onKeyDown={e => {
                      if (e.keyCode === '13') {
                        e.currentTarget.blur();
                      }
                    }}
                  />
                )}
              </Col>
              <Col span={12} style={{ paddingTop: 6, paddingRight: 22 }}>
                <Button
                  style={{ float: 'right' }}
                  type="primary"
                  onClick={() => {
                    if (this.state.sql) {
                      // 打开保存弹框
                      this.isSaveOther = false;
                      this.toggleModal('save');
                    } else {
                      message.warning(`Please input ${datasetType}`);
                    }
                  }}
                >
                  Save
                </Button>
                <Button
                  style={{ float: 'right' }}
                  className="btn-usual"
                  type="primary"
                  onClick={() => {
                    if (this.state.sql) {
                      // 打开另存为弹框
                      this.isSaveOther = true;
                      this.toggleModal('save');
                    } else {
                      message.warning(`Please input ${datasetType}`);
                    }
                  }}
                >
                  Save As
                </Button>
              </Col>
            </Row>
          </Header>
          <Content className={styles.layoutContent}>
            {/* <Spin
              tip={<span className={styles.spanTips}>加载中...</span>}
              spinning={this.state.loading}
            > */}
            <Layout>
              <Sider width={230} style={{ background: '#fff' }}>
                <div className={styles.title}>
                  <span>DataSource Connected</span>
                  <IconFont type="icon-DataSource" />
                </div>
                <div className={styles.toolsBox}>
                  {dataSourceList && dataSourceList[0] && (
                    <Select
                      size="small"
                      className={styles.noBorerComponent}
                      defaultValue={
                        this.props.location.query.connectionId || dataSourceList[0].connectionId
                      }
                      onChange={(val, a) => {
                        // 切换数据源获取数据源表
                        this.pageNumber = 1;
                        this.connection_id = val;
                        this.connection_name = a.props.children;
                        // 清空数据源表list
                        dispatch({
                          type: 'sqlDataSource/clear',
                          payload: [],
                        });
                        // 重新渲染
                        if (datasetType === 'SQL') {
                          dispatch({
                            type: 'sqlDataSource/getMetadataList',
                            payload: {
                              connection_id: val,
                              pageNumber: this.pageNumber.toString(),
                              pageSize: '30',
                            },
                          });
                        } else {
                          dispatch({
                            // 获取存储过程
                            type: 'sqlDataSource/getProcedure',
                            payload: {
                              connectionId: val,
                              objectType: datasetType,
                              pageNumber: this.pageNumber.toString(),
                              pageSize: '30',
                            },
                          });
                        }
                        // 保存当前选中的数据源ID
                        dispatch({
                          type: 'sqlDataSource/saveConnectionId',
                          payload: {
                            connectionId: val,
                          },
                        });
                      }}
                    >
                      {dataSourceList.map(value => (
                        <Option key={value.connectionId} value={value.connectionId}>
                          {value.connectionName}
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
                <ConnList
                  loadMore={this.loadMore}
                  data={datasetType === 'SQL' ? metaDataTableList : procedureDataList}
                  filterName={filterName}
                  connection_id={
                    this.connection_id ||
                    (dataSourceList && dataSourceList[0] && dataSourceList[0].connectionId)
                  }
                />
                <div className={styles.buttonActions}>
                  <Checkbox.Group
                    style={{ width: '100%', padding: '6px 12px 0' }}
                    defaultValue={['0', '1']}
                    onChange={this.checkBoxChange}
                    disabled={datasetType !== 'SQL'}
                  >
                    <Row>
                      <Col span={12}>
                        <Checkbox value="0">table</Checkbox>
                      </Col>
                      <Col span={12}>
                        <Checkbox value="1">view</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                  <Input
                    className="noBorerComponent"
                    placeholder="inputTableOrView"
                    onChange={e => {
                      this.setState({
                        filterName: e.target.value,
                      });
                    }}
                  />
                </div>
              </Sider>
              <Layout className={styles.layoutTable}>
                <div className={styles.tableWrapper}>
                  <div className={styles.flowContent}>
                    <div style={{ position: 'absolute', top: 20, right: 25, zIndex: 1000 }}>
                      <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          if (this.state.sql) {
                            // 存在参数设置则弹出参数设置弹框,否则直接预览数据
                            if (variableList.length > 0) {
                              this.toggleModal('valueSetting');
                            } else {
                              this.getVariableList(values => {
                                if (values.length > 0) {
                                  this.toggleModal('valueSetting');
                                } else {
                                  this.handlePreview();
                                }
                              });
                            }
                          }
                        }}
                      >
                        Execute
                      </Button>
                      <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          this.toggleModal('paramSetting');
                        }}
                      >
                        Variable Setting
                      </Button>
                      <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          dispatch({
                            type: 'sqlKeydown/sqlFormated',
                            payload: {
                              scriptContent: this.state.sql,
                            },
                          });
                        }}
                      >
                        SQL Beautifier
                      </Button>
                    </div>
                    <CodeMirrorComponent
                      datasetType={datasetType || dataSet.datasetType}
                      inputSql={this.state.sql}
                      alterInputSql={this.alterInputSql}
                      dbConnection={
                        this.connection_id ||
                        (dataSourceList && dataSourceList[0] && dataSourceList[0].connectionId)
                      }
                    />
                  </div>
                  <div className={styles.searchBox}>
                    <Button
                      onClick={() => {
                        this.setState({
                          tableView: 'data',
                        });
                      }}
                      className={classNames(
                        styles.icon,
                        this.state.tableView === 'data' ? styles.tableActive : '',
                      )}
                      title="Table Data"
                    >
                      <IconFont type="iconbianjiqi_charubiaoge" />
                    </Button>
                    <Button
                      onClick={() => {
                        this.setState({
                          tableView: 'attr',
                        });
                      }}
                      className={classNames(
                        styles.icon,
                        this.state.tableView === 'attr' ? styles.tableActive : '',
                      )}
                      title="Table Attribute"
                    >
                      <IconFont type="iconorderedlist" />
                    </Button>
                    <div style={{ float: 'right', marginRight: 10 }}>
                      {/* <Checkbox>显示隐藏字段</Checkbox>
                      <Checkbox>显示别名</Checkbox> */}
                      <span style={{ fontSize: 12 }}>
                        <InputNumber
                          onChange={value => {
                            dispatch({
                              type: 'sqlDataSource/changeDefaultPageSize',
                              payload: value,
                            });
                          }}
                          className={styles.inputNumber}
                          min={1}
                          max={100}
                          defaultValue={5}
                        />
                        Rows
                      </span>
                    </div>
                  </div>
                  {this.state.tableView === 'data' && (
                    <Table
                      scroll={{ x: 'max-content' }}
                      className={styles.editDataSetTable}
                      components={this.components}
                      columns={renderColumn}
                      dataSource={tableData}
                      pagination={{
                        pageSize: tableData[0] && defaultPageSize,
                        showTotal:
                          tableData[0] &&
                          (() =>
                            `Page ${pageNumber.toString()} of ${Math.ceil(
                              tableData.length / defaultPageSize,
                            ).toString()}`),

                        current: tableData[0] && pageNumber,
                        total: tableData[0] && tableData.length,
                        onChange: tableData[0] && this.pageChange,
                        size: 'small',
                      }}
                      // pagination={{ pageSize: 5 }}
                    />
                  )}
                  {this.state.tableView === 'attr' && (
                    <Table
                      className={styles.editDataSetTable}
                      dataSource={columnData}
                      columns={column}
                      pagination={{
                        pageSize: columnData[0] && defaultPageSize,
                        showTotal:
                          columnData[0] &&
                          (() =>
                            `Page ${pageNumber.toString()} of ${Math.ceil(
                              columnData.length / defaultPageSize,
                            ).toString()}`),

                        current: columnData[0] && pageNumber,
                        total: columnData[0] && columnData.length,
                        onChange: columnData[0] && this.pageChange,
                        size: 'small',
                      }}
                    />
                  )}
                </div>
              </Layout>
            </Layout>
            {/* </Spin> */}
          </Content>
          <ParamSetting
            visible={this.state.visible.paramSetting}
            toggleModal={this.toggleModal}
            variableList={variableList}
            getVariableList={this.getVariableList}
            saveDatasetParams={this.saveDatasetParams}
          />
          <Save
            dataSet={dataSet}
            saveSql={this.saveSql}
            sqlDataSetName={sqlDataSetName}
            isSaveOther={this.isSaveOther}
            visible={this.state.visible.save}
            toggleModal={this.toggleModal}
            classifyTree={classifyTree}
          />
          <ValueSetting
            toggleModal={this.toggleModal}
            visible={this.state.visible.valueSetting}
            variableList={variableList}
            handlePreview={this.handlePreview}
          />
        </Layout>
      </DndProvider>
    );
  }
}

export default AddDataSet;
