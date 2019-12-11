/*
 * @Description: 新建数据集
 * @Author: lan
 * @Date: 2019-12-07 14:24:54
 * @LastEditTime: 2019-12-11 13:51:01
 * @LastEditors: lan
 */
import React, { PureComponent } from 'react';
import { Icon, Input, Select, Button, Layout, Table, Row, Col, Checkbox, InputNumber } from 'antd';
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
import AddTask from './components/modals/AddTask';
import Save from './components/modals/Save';
import ResizeableTitle from './components/ResizeableTitle';

const { Sider, Content, Header } = Layout;
const { Option } = Select;

@connect(({ sqlDataSource, getClassifyTree, sqlKeydown }) => ({
  sql: sqlKeydown.sql,
  classifyTree: getClassifyTree.classifyTree,
  dataSourceList: sqlDataSource.dataSourceList,
  totalCount: sqlDataSource.totalCount,
  metaDataTableList: sqlDataSource.metaDataTableList,
  tableData: sqlDataSource.tableData,
  column: sqlDataSource.column,
}))
class AddDataSet extends PureComponent {
  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  pageNumber = 1;

  isSaveOther = false;

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  state = {
    visible: {
      addTask: false,
      save: false,
    },
    AlterDataSetName: true,
    tableView: 'data',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const {
      location: {
        query: { connectionId, tableId },
      },
    } = this.props;
    this.connection_id = connectionId;
    this.tableId = tableId;
    dispatch({
      type: 'sqlDataSource/getDataSourceList',
      payload: { connectionId },
    });
    dispatch({
      type: 'getClassifyTree/getClassifyTree',
    });
    // dispatch({
    //   type: 'addSqlDataSet/getMetadataList',
    //   payload: {
    //     connection_id: connectionId,
    //     pageNumber: '1',
    //     pageSize: '10',
    //   },
    // });
    // dispatch({
    //   type: 'sqlDataSource/saveConnectionId',
    //   payload: {
    //     connectionId,
    //   },
    // });
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

  // 刷新列表
  loadMore = () => {
    const { dispatch, totalCount } = this.props;
    // eslint-disable-next-line no-plusplus
    if (this.pageNumber++ >= totalCount / 30) {
      return false;
    }
    dispatch({
      type: 'sqlDataSource/getMetadataList',
      payload: {
        connection_id: this.connection_id,
        pageNumber: this.pageNumber.toString(),
        pageSize: '30',
      },
    });
    return true;
  };

  // 多选框选择改变数据表列表
  checkBoxChange = checkedValues => {
    const { dispatch, dataSourceList } = this.props;
    if (checkedValues.length === 2) {
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

  toggleModal = key => {
    const { visible } = this.state;
    this.setState({
      visible: {
        ...visible,
        [key]: !visible[key],
      },
    });
  };

  saveSql = fieldsValue => {
    const { dispatch, sql } = this.props;
    dispatch({
      type: 'addSqlDataSet/addMetaData',
      payload: {
        tableId: this.isSaveOther ? '' : this.tableId,
        connection_id: this.connection_id,
        setType: 'viewSet',
        viewSql: sql,
        viewName: fieldsValue.sqlTableName,
      },
    });
  };

  render() {
    const {
      dataSourceList,
      metaDataTableList,
      dispatch,
      tableData,
      classifyTree,
      // column,
      // defaultPageSize,
      sqlTableName,
      // tableData2,
      // targetObj,
      // column2,
    } = this.props;
    const { AlterDataSetName } = this.state;
    const renderColumn = this.perfectColumn();
    return (
      <DndProvider backend={HTML5Backend}>
        <Layout className={styles.addDataSet}>
          <Header className={styles.header}>
            <Row>
              <Col span={12}>
                <Button
                  onClick={() => {
                    router.goBack();
                  }}
                  className={styles.backBtn}
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
                    {sqlTableName || 'DataSet Name'}
                  </span>
                )}
                {!AlterDataSetName && (
                  <input
                    ref={this.inputRef}
                    type="text"
                    style={{ background: 'transparent', color: '#fff' }}
                    value={sqlTableName}
                    onBlur={e => {
                      dispatch({
                        type: 'addSqlDataSet/changeDataSetName',
                        payload: e.target.value,
                      });
                      this.setState({
                        AlterDataSetName: true,
                      });
                    }}
                    onChange={e => {
                      dispatch({
                        type: 'addSqlDataSet/changeDataSetName',
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
              <Col span={12} style={{ paddingTop: 4, paddingRight: 22 }}>
                <Button
                  style={{ float: 'right' }}
                  className={styles.searchBoxButton}
                  type="primary"
                  onClick={() => {
                    this.isSaveOther = false;
                    this.toggleModal('save');
                  }}
                >
                  Save
                </Button>
                <Button
                  style={{ float: 'right' }}
                  // ghost
                  className={styles.searchBoxButton}
                  type="primary"
                  onClick={() => {
                    this.isSaveOther = true;
                    this.toggleModal('save');
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
                  <span>数据连接</span>
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
                      onChange={val => {
                        this.pageNumber = 1;
                        this.connection_id = val;
                        dispatch({
                          type: 'sqlDataSource/clear',
                          payload: [],
                        });
                        dispatch({
                          type: 'sqlDataSource/getMetadataList',
                          payload: {
                            connection_id: val,
                            pageNumber: this.pageNumber.toString(),
                            pageSize: '30',
                          },
                        });
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
                  data={metaDataTableList}
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
                  <Input className="noBorerComponent" placeholder="inputTableOrView" />
                </div>
              </Sider>
              <Layout className={styles.layoutTable}>
                <div className={styles.tableWrapper}>
                  <div className={styles.flowContent}>
                    <div style={{ position: 'absolute', top: 20, right: 15, zIndex: 1000 }}>
                      <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          if (this.props.sql) {
                            dispatch({
                              type: 'sqlDataSource/getMetadataTablePerform',
                              payload: {
                                connectionId: this.connection_id,
                                previewStatement: this.props.sql,
                                previewNum: 20,
                              },
                            });
                          }
                        }}
                      >
                        Execute
                      </Button>
                      <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          this.toggleModal('addTask');
                        }}
                      >
                        Variable Setting
                      </Button>
                      <Button type="primary" style={{ marginRight: 10 }} onClick={() => {}}>
                        SQL Beautifier
                      </Button>
                    </div>
                    <CodeMirrorComponent />
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
                      title="表数据"
                    >
                      <IconFont type="icon-weibiaoti-" />
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
                      title="表属性"
                      style={{ marginLeft: 10 }}
                    >
                      <IconFont type="icon-fenleimulu" />
                    </Button>
                    {/* <span
                      onClick={() => {
                        if (this.props.sql) {
                          dispatch({
                            type: 'addSqlDataSet/getSqlParserInfo',
                            payload: {
                              connection_id: this.connection_id,
                              sqlStatement: this.props.sql,
                            },
                          });
                          dispatch({
                            type: 'addSqlDataSet/getMetadataTablePerform',
                            payload: {
                              connection_id: this.connection_id,
                              querySql: this.props.sql,
                            },
                          });
                        }
                      }}
                      style={{ marginLeft: 5, cursor: 'pointer' }}
                    >
                      刷新
                    </span> */}
                    <div style={{ float: 'right', marginRight: 10 }}>
                      {/* <Checkbox>显示隐藏字段</Checkbox>
                      <Checkbox>显示别名</Checkbox> */}
                      <span style={{ fontSize: 12 }}>
                        <InputNumber
                          onChange={value => {
                            dispatch({
                              type: 'addSqlDataSet/changeDefaultPageSize',
                              payload: value,
                            });
                          }}
                          className={styles.inputNumber}
                          min={1}
                          max={100}
                          defaultValue={10}
                        />
                        行
                      </span>
                    </div>
                  </div>
                  {this.state.tableView === 'data' && (
                    <Table
                      scroll={{ x: 'max-content' }}
                      className={styles.editDataSetTable}
                      components={this.components}
                      bordered
                      columns={renderColumn}
                      dataSource={tableData}
                      // pagination={{ pageSize: defaultPageSize }}
                      pagination={{ pageSize: 5 }}
                    />
                  )}
                  {this.state.tableView === 'attr' && (
                    <Table
                    // view={this.state.view}
                    // tableData2={tableData2}
                    // dispatch={dispatch}
                    // tableJoin={tableJoin}
                    // defaultPageSize={defaultPageSize}
                    // column2={column2}
                    />
                  )}
                </div>
              </Layout>
            </Layout>
            {/* </Spin> */}
          </Content>
          <AddTask visible={this.state.visible.addTask} toggleModal={this.toggleModal} />
          <Save
            saveSql={this.saveSql}
            sqlTableName={sqlTableName}
            isSaveOther={this.isSaveOther}
            visible={this.state.visible.save}
            toggleModal={this.toggleModal}
            classifyTree={classifyTree}
          />
        </Layout>
      </DndProvider>
    );
  }
}

export default AddDataSet;
