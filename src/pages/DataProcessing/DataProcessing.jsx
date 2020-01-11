/*
 * @Description: This is Data Processing for Data Inspect and Processsing.
 * @Author: dailinbo
 * @Date: 2020-01-09 16:45:10
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-11 10:34:48
 */
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import classnames from 'classnames';
import Antd, { Row, Col, Button, Table, Select, Modal, Progress, Checkbox } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Chart, Geom, Axis, Tooltip, Guide } from 'bizcharts';
import router from 'umi/router';
import IconFont from '@/components/IconFont';
import styles from './DataProcessing.less';
import { getAuthority } from '@/utils/authority';
import { getStore } from '@/utils/store';

const { Option } = Select;

@connect(({ dataProcessing, loading }) => ({
  loading: loading.effects,
  dataProcessingData: dataProcessing.data,
  dataProcessingItemData: dataProcessing.itemData,
  startProcessingData: dataProcessing.startProcessingData,
  marketData: dataProcessing.marketData,
}))
export default class DataProcessing extends Component {
  constructor() {
    super();
    this.state = {
      alertType: '',
      activeIndex: 0,
      alertIds: '',
      market: '',
      selectedMarket: '0',
      authBypass: false,
      alertBypassStatus: [],
      isBypass: false,
      dataProcessingVisible: false,
      dataAlertVisible: false,
      dataProcessingFlag: false,
      inspectDataVisible: false,
      checkedAll: false,
      alertIndeterminate: false,
      codeColumns: [
        {
          title: formatMessage({ id: 'app.common.number' }),
          dataIndex: 'index',
          key: 'index',
          width: 80,
          align: 'right',
          render: (res, recode, index) => (
            <Fragment>
              {recode.isClosedIntraday === '1' && (
                <Antd.Tooltip
                  title="pending tasks for today"
                  className={styles['alert-icon-wraper']}
                >
                  <IconFont type="icon-tips" className={styles['alert-icon']} />
                </Antd.Tooltip>
              )}
              <span>{(this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1}</span>
            </Fragment>
          ),
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.market' }),
          dataIndex: 'market',
          key: 'market',
          ellipsis: true,
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.alertName' }),
          dataIndex: 'alertName',
          key: 'alertName',
          ellipsis: true,
          width: '35%',
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.numberOfAlert' }),
          dataIndex: 'numberOfAlert',
          key: 'numberOfAlert',
          ellipsis: true,
          render: (res, recode) => (
            <Fragment>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{recode.numberOfAlert}</span>
                {recode.alertType === this.state.alertType && (
                  <IconFont type="icon-arrow-right" className={styles['active-icon']} />
                )}
              </div>
            </Fragment>
          ),
        },
      ],
      columns: [
        {
          title: () =>
            this.state.alertBypassStatus.length > 0 &&
            this.state.isBypass && (
              <Fragment>
                {this.state.alertBypassStatus.length > 0 && this.state.isBypass && (
                  <Checkbox
                    checked={this.state.checkedAll}
                    indeterminate={this.state.alertIndeterminate}
                    onChange={this.onSelectChangeAll}
                  ></Checkbox>
                )}
                <span style={{ marginLeft: '5px' }}>Bypass</span>
              </Fragment>
            ),
          dataIndex: 'index',
          key: 'index',
          render: (res, recode, index) => (
            <Fragment>
              {recode.bypassStatus === '0' ? (
                <Checkbox
                  checked={this.state.selectedRowKeys.some(
                    element => element.alertId === recode.alertId,
                  )}
                  onChange={event => this.onSelectChange(event, recode)}
                ></Checkbox>
              ) : (
                <IconFont type="icon-bypass" className={styles['bypass-icon']} />
              )}
            </Fragment>
          ),
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.alertOwner' }),
          dataIndex: 'alertOwner',
          key: 'alertOwner',
          ellipsis: true,
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.submitterCode' }),
          dataIndex: 'submitterCode',
          key: 'submitterCode',
          width: '25%',
          ellipsis: true,
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.submitterName' }),
          dataIndex: 'submitterName',
          key: 'submitterName',
          width: '35%',
          ellipsis: true,
        },
      ],
      tempColumns: [],
      functionNameOptions: [],
      selectedRowKeys: [],
      intradays: [],
      page: {
        pageNumber: 1,
        pageSize: 10,
      },
      dataCharts: [
        {
          year: 'Records Received from ECP',
          sales: 38,
        },
        {
          year: 'Records Imported by user',
          sales: 52,
        },
        {
          year: 'TO Records Eliminated',
          sales: 61,
        },
        {
          year: 'Duplicated Records Eliminated',
          sales: 145,
        },
        {
          year: 'Late Submission',
          sales: 48,
        },
        {
          year: 'Adjustment of Stock Options Records for Format Conversion',
          sales: 38,
        },
      ],
      cols: {
        sales: {
          tickInterval: 20,
          alias: 'processing',
        },
      },
    };
  }

  componentDidMount() {
    console.log('getAuthority===', getAuthority());
    this.getMarket();
    this.setState({
      authBypass: getAuthority().authBypass,
    });
  }

  /**
   * @description: This is a function for Inspect Data.
   * @param {type} null
   * @return: undefined
   */
  queryDataProcessing = () => {
    const { dispatch } = this.props;
    const params = {
      operType: 'queryAlertType',
    };
    dispatch({
      type: 'dataProcessing/getDataProcessing',
      payload: params,
      callback: () => {
        const { dataProcessingData } = this.props;
        this.setState(
          {
            alertType: dataProcessingData.items[0] && dataProcessingData.items[0].alertType,
            isBypass: !!(dataProcessingData.items[0].isClosedIntraday === '1'),
            inspectDataVisible: true,
          },
          () => {
            // eslint-disable-next-line no-unused-expressions
            this.state.alertType && this.queryDataProcessingItem();
          },
        );
      },
    });
  };

  queryDataProcessingItem = () => {
    const { dispatch } = this.props;
    const params = {
      operType: 'queryAlertItems',
      alertType: `${this.state.alertType}`,
    };
    dispatch({
      type: 'dataProcessing/getDataProcessingItem',
      payload: params,
      callback: () => {
        const { dataProcessingItemData } = this.props;
        const { isBypass, authBypass, columns } = this.state;
        const alertBypassStatus = dataProcessingItemData.items.filter(
          element => element.bypassStatus === '0',
        );
        if (alertBypassStatus.length <= 0 || !isBypass || !authBypass) {
          const { tempColumns } = this.state;
          const newColumns = Object.assign([], columns);
          let newTempColumns = Object.assign([], tempColumns);
          let activeIndex = -1;
          for (let i = 0; i < newColumns.length; i += 1) {
            if (newColumns[i].key === 'index') {
              activeIndex = i;
            }
          }
          if (activeIndex > -1) {
            newTempColumns = newColumns.splice(activeIndex, 1);
          }
          this.setState({
            columns: newColumns,
            tempColumns: newTempColumns,
          });
        } else {
          const { tempColumns } = this.state;
          let activeIndex = -1;
          for (let i = 0; i < columns.length; i += 1) {
            if (columns[i].key === 'index') {
              activeIndex = i;
            }
          }
          if (tempColumns.length > 0 && activeIndex <= -1) {
            const newColumns = Object.assign([], columns);
            newColumns.unshift(tempColumns[0]);
            this.setState({
              columns: newColumns,
            });
          }
        }
        this.setState({
          alertBypassStatus,
          alertIndeterminate: false,
          checkedAll: false,
          selectedRowKeys: [],
          alertIds: [],
        });
      },
    });
  };

  /**
   * @description: This is function for get Market.
   * @param {type} null
   * @return: undefined
   */
  getMarket = () => {
    const { dispatch } = this.props;
    const params = {
      operType: 'marketSourceQuery',
      dictValue: 'MARKET_SOURCE',
    };
    dispatch({
      type: 'dataProcessing/getMarket',
      payload: params,
      callback: () => {
        const marktData = this.props.marketData.map(element => ({
          key: element.dataId,
          value: element.dictdataValue,
          // value: element.dataId,
          title: element.dictdataName,
        }));
        marktData.unshift({
          key: 'all',
          value: '0',
          title: 'All',
        });
        this.setState({
          functionNameOptions: marktData,
        });
      },
    });
  };

  connectDataProcessing = (record, index) => {
    this.setState(
      {
        alertType: record.alertType,
        activeIndex: index,
        isBypass: !!(record.isClosedIntraday === '1'),
      },
      () => {
        this.queryDataProcessingItem();
      },
    );
  };

  /**
   * @description: This is function for Inspect Data.
   * @param {type} null
   * @return: undefiend
   */
  inspectData = () => {
    this.queryDataProcessing();
  };

  onSelectChange = (checkedValue, selectedRows) => {
    const { selectedRowKeys } = this.state;
    const newSelectedRowKeys = Object.assign([], selectedRowKeys);
    if (checkedValue.target.checked) {
      newSelectedRowKeys.push(selectedRows);
    } else {
      newSelectedRowKeys.splice(newSelectedRowKeys.indexOf(selectedRows), 1);
    }
    const { dataProcessingItemData } = this.props;
    const bypassItems = dataProcessingItemData.items.filter(
      element => element.bypassStatus === '0',
    );
    if (newSelectedRowKeys.length === bypassItems.length) {
      this.setState({
        checkedAll: true,
        alertIndeterminate: false,
      });
    } else if (newSelectedRowKeys.length > 0) {
      this.setState({
        alertIndeterminate: true,
        checkedAll: false,
      });
    } else {
      this.setState({
        alertIndeterminate: false,
        checkedAll: false,
      });
    }
    const alertIds = [];
    newSelectedRowKeys.forEach(element => alertIds.push(element.alertId));
    this.setState({
      selectedRowKeys: newSelectedRowKeys,
      alertIds: alertIds.join(','),
    });
  };

  onSelectChangeAll = checkedValue => {
    const { dataProcessingItemData } = this.props;
    const selectedRowKeys = dataProcessingItemData.items.filter(
      element => element.bypassStatus === '0',
    );
    const alertIds = [];
    this.setState({
      checkedAll: checkedValue.target.checked,
      alertIndeterminate: false,
    });
    if (checkedValue.target.checked) {
      selectedRowKeys.forEach(element => alertIds.push(element.alertId));
      this.setState({ selectedRowKeys, alertIds: alertIds.join(',') });
    } else {
      this.setState({
        selectedRowKeys: [],
        alertIds: [],
      });
    }
  };

  onChangeMarkt = (value, key) => {
    const { marketData } = this.props;
    let markets = [];
    if (value === '0') {
      marketData.forEach(element => markets.push(element.dictdataValue));
      markets = markets.join(',');
    } else {
      markets = value;
    }
    this.setState({
      market: markets,
      selectedMarket: value,
    });
  };

  /**
   * @description: Thsi is function for start Data Processing
   * @param {type} null
   * @return: undefined
   */
  startProcessing = () => {
    const { dataProcessingData } = this.props;
    const isClosedIntraday =
      dataProcessingData.items &&
      dataProcessingData.items.some(element => element.isClosedIntraday === '1');
    const intradays =
      dataProcessingData.items &&
      dataProcessingData.items.filter(item => item.isClosedIntraday === '1');
    if (isClosedIntraday) {
      this.setState({
        intradays,
        dataAlertVisible: true,
      });
    } else {
      const { dispatch } = this.props;
      const { market, selectedMarket } = this.state;
      const params = {
        // user_id: getStore('userInfo').employeeId,
        // market,
        operType: 'startProcess',
        market,
      };
      dispatch({
        type: 'dataProcessing/startProcessing',
        payload: params,
        callback: () => {
          console.log('startProcessingData===', this.props.startProcessingData);
        },
      });
      this.setState({
        dataProcessingVisible: true,
        dataProcessingFlag: true,
      });
    }
  };

  dataProcessingConfirm = () => {
    this.setState({
      dataProcessingVisible: false,
    });
  };

  dataProcessingCancel = () => {
    this.setState({
      dataProcessingVisible: false,
    });
  };

  dataAlertConfirm = () => {
    this.setState({
      dataAlertVisible: false,
    });
  };

  dataAlertCancel = () => {
    this.setState({
      dataAlertVisible: false,
    });
  };

  onBypass = () => {
    this.alertItemsByPass();
  };

  alertItemsByPass = () => {
    const { dispatch } = this.props;
    const params = {
      operType: 'alertItemsByPass',
      alertIds: `${this.state.alertIds}`,
    };
    dispatch({
      type: 'dataProcessing/alertItemsByPass',
      payload: params,
      callback: () => {
        this.queryDataProcessing();
      },
    });
  };

  /**
   * @description: This is function for go Alert Center.
   * @param {type} null
   * @return: undefined
   */
  goAlertCenter = () => {
    const { dataProcessingItemData } = this.props;
    const alertIds = dataProcessingItemData.items.map(element => element.alertId);
    router.push({ pathname: '/homepage/alert-center', query: { alertIds: alertIds.join(',') } });
  };

  render() {
    const { loading, dataProcessingData, dataProcessingItemData } = this.props;
    const {
      inspectDataVisible,
      selectedRowKeys,
      functionNameOptions,
      dataProcessingVisible,
      dataAlertVisible,
      intradays,
      authBypass,
      dataProcessingFlag,
      dataCharts,
      cols,
      alertType,
      activeIndex,
      checkedAll,
      alertIndeterminate,
      alertBypassStatus,
      isBypass,
      selectedMarket,
    } = this.state;
    const rowSelection = {
      columnWidth: 100,
      selectedRowKeys,
      columnTitle: (
        <Fragment>
          {alertBypassStatus.length > 0 && (
            <Checkbox
              checked={checkedAll}
              indeterminate={alertIndeterminate}
              onChange={this.onSelectChangeAll}
            ></Checkbox>
          )}
          <span style={{ marginLeft: '5px' }}>Bypass</span>
        </Fragment>
      ),
      onChange: this.onSelectChange,
      selections: false,
    };
    return (
      <Fragment>
        <PageHeaderWrapper>
          <div className={styles.dataProcessingWraper}>
            {inspectDataVisible && (
              <div className={styles.dataTableWraper}>
                <div className={styles.dataTable}>
                  <Button
                    type="primary"
                    onClick={this.inspectData}
                    className="btn-usual"
                    loading={loading['dataProcessing/getDataProcessing']}
                  >
                    {formatMessage({ id: 'systemManagement.dataProcessing.inspectData' })}
                  </Button>
                  <Table
                    loading={loading['dataProcessing/getDataProcessing']}
                    style={{ marginTop: '6px' }}
                    eslint-disable-next-line
                    no-confusing-arrow
                    rowClassName={(record, index) =>
                      classnames({
                        [styles['table-active']]:
                          record.alertType === alertType && index === activeIndex,
                        [styles['alert-table-row']]: record.isClosedIntraday === '1',
                      })
                    }
                    rowKey={row => row.index}
                    dataSource={dataProcessingData.items}
                    columns={this.state.codeColumns}
                    pagination={false}
                    onRow={(record, index) => ({
                      onClick: () => {
                        this.connectDataProcessing(record, index);
                      },
                    })}
                  ></Table>
                  {/* <Pagination
                    showSizeChanger
                    current={page.pageNumber}
                    showTotal={() => `Total ${dataProcessingData.totalCount} items`}
                    onShowSizeChange={this.onShowSizeChange}
                    onChange={this.pageChange}
                    total={dataProcessingData.totalCount}
                    pageSize={page.pageSize}
                  /> */}
                  <Modal
                    icon=""
                    title={formatMessage({ id: 'app.common.confirm' })}
                    visible={dataProcessingVisible && false}
                    className={styles.processingWraper}
                    onOk={this.dataProcessingConfirm}
                    onCancel={this.dataProcessingCancel}
                    cancelText={formatMessage({ id: 'app.common.cancel' })}
                    okText={formatMessage({ id: 'app.common.confirm' })}
                  >
                    {dataProcessingFlag ? (
                      <div>
                        <Progress percent={50} status="active" />
                        <p style={{ textAlign: 'left' }}>
                          Processed：<span>1234</span> records
                        </p>
                        <p style={{ textAlign: 'left' }}>
                          Pending to process：<span>1234</span> records
                        </p>
                      </div>
                    ) : (
                      <span>There are still 10 outstanding alerts. Do you want to bypass all?</span>
                    )}
                  </Modal>
                  <Modal
                    icon=""
                    title={formatMessage({ id: 'app.common.confirm' })}
                    visible={dataAlertVisible}
                    onOk={this.dataAlertConfirm}
                    onCancel={this.dataAlertCancel}
                    cancelText={formatMessage({ id: 'app.common.cancel' })}
                    okText={formatMessage({ id: 'app.common.confirm' })}
                  >
                    <span>
                      There are still {intradays.length} outstanding alerts. Do you want to bypass
                      all?
                    </span>
                  </Modal>
                </div>
                <div className={styles.cutOff}></div>
                <div className={styles.dataItemTable}>
                  <div
                    className={styles.tableTop}
                    style={
                      authBypass && alertBypassStatus.length > 0 && isBypass
                        ? { visibility: 'visible' }
                        : { visibility: 'hidden' }
                    }
                  >
                    <Button onClick={this.onBypass} type="primary" className="btn-usual">
                      {formatMessage({ id: 'systemManagement.dataProcessing.bypass' })}
                    </Button>
                  </div>
                  <Table
                    loading={loading['dataProcessing/getDataProcessingItem']}
                    rowKey={row => row.alertId.toString()}
                    rowSelection={alertBypassStatus.length > 0 && isBypass ? null : null}
                    dataSource={dataProcessingItemData.items}
                    pagination={false}
                    columns={this.state.columns}
                    style={{ marginTop: '6px' }}
                  ></Table>
                  {/* <Pagination
                    showSizeChanger
                    current={itemPage.pageNumber}
                    showTotal={() => `Total ${dataProcessingItemData.totalCount} items`}
                    onShowSizeChange={this.onShowItemSizeChange}
                    onChange={this.pageItemChange}
                    total={dataProcessingItemData.totalCount}
                    pageSize={itemPage.pageSize}
                  /> */}
                  <Row type="flex" justify="end" style={{ marginTop: '10px' }}>
                    <Button
                      type="primary"
                      className="btn-usual"
                      style={{ height: '36px' }}
                      onClick={this.goAlertCenter}
                    >
                      Enter Alert Center
                    </Button>
                  </Row>
                </div>
              </div>
            )}
            {!inspectDataVisible && (
              <div style={{ padding: '10px', background: '#fff' }}>
                <Button type="primary" onClick={this.inspectData} className="btn-usual">
                  {formatMessage({ id: 'systemManagement.dataProcessing.inspectData' })}
                </Button>
                <div className={styles.dataEmptyWraper}>
                  <IconFont
                    type="icon-empty-dataprocess"
                    className={styles['dataprocessing-icon']}
                  />
                  <div>Please Press Inspect Data to Display Outstanding Alerts</div>
                </div>
              </div>
            )}
            <div className={styles.dataProcessing}>
              <Row type="flex" gutter={30} style={{ marginTop: '10px' }}>
                <Col>
                  <span style={{ marginRight: '5px' }}>Market</span>
                  <Select
                    placeholder="Please Select"
                    allowClear
                    value={selectedMarket}
                    style={{ width: '120px' }}
                    onChange={this.onChangeMarkt}
                  >
                    {functionNameOptions.map(item => (
                      <Option key={item.key} value={item.value}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col>
                  <Button type="primary" className="btn-usual" onClick={this.startProcessing}>
                    Start Processing
                  </Button>
                </Col>
                <Col>
                  {dataProcessingFlag ? (
                    <div>
                      <Progress percent={50} status="active" />
                      <p style={{ textAlign: 'left' }}>
                        Processed：<span>1234</span> records
                      </p>
                      <p style={{ textAlign: 'left' }}>
                        Pending to process：<span>1234</span> records
                      </p>
                    </div>
                  ) : (
                    <span></span>
                  )}
                </Col>
              </Row>
              <Chart className={styles.chart} height={400} data={dataCharts} scale={cols} forceFit>
                <span>The last time of data processing is at 10:55 on 12/12/2019</span>
                <Axis name="year" />
                <Axis name="sales" line={{ stroke: '#d9d9d9' }} position="left" />
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Guide>
                  <Guide.Line lineStyle={{ stroke: '#d9d9d9' }} />
                </Guide>
                <Geom
                  type="interval"
                  position="year*sales"
                  size={20}
                  style={{
                    stroke: '#d9d9d9',
                    lineWidth: 1,
                  }}
                />
              </Chart>
            </div>
          </div>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}
