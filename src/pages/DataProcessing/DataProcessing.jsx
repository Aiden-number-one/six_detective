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
// const { RangePicker } = DatePicker;

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
      alertIds: '',
      market: '',
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
                  <IconFont type="icon-alertlist" className={styles['alert-icon']} />
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
        // {
        //   title: '',
        //   dataIndex: '',
        //   key: '',
        //   render: (res, recode) => (
        //     <Fragment>
        //       {recode.alertType === this.state.alertType && (
        //           <IconFont type="icon-arrow-right" className={styles['active-icon']} />
        //       )}
        //     </Fragment>
        //   ),
        // },
      ],
      columns: [
        // {
        //   title: formatMessage({ id: 'app.common.number' }),
        //   dataIndex: 'index',
        //   key: 'index',
        //   render: (res, recode, index) => (
        //     <span>
        //       {(this.state.itemPage.pageNumber - 1) * this.state.itemPage.pageSize + index + 1}
        //     </span>
        //   ),
        // },
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
      functionNameOptions: [],
      selectedRowKeys: [],
      intradays: [],
      page: {
        pageNumber: 1,
        pageSize: 10,
      },
      // itemPage: {
      //   pageNumber: 1,
      //   pageSize: 10,
      // },
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
    this.getMarket();
    this.setState({
      authBypass: getAuthority().authBypass,
    });
    // this.queryDataProcessing();
  }

  queryDataProcessing = () => {
    const { dispatch } = this.props;
    // const { page, codeName } = this.state;
    const params = {
      // pageNumber: page.pageNumber.toString(),
      // pageSize: page.pageSize.toString(),
      operType: 'queryAlertType',
      // codeName,
    };
    dispatch({
      type: 'dataProcessing/getDataProcessing',
      payload: params,
      callback: () => {
        // this.setState({
        //   inspectDataVisible: true,
        // });
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
      // pageNumber: `${this.state.itemPage.pageNumber.toString()}` || '1',
      // pageSize: `${this.state.itemPage.pageSize.toString()}` || '10',
      alertType: `${this.state.alertType}`,
    };
    dispatch({
      type: 'dataProcessing/getDataProcessingItem',
      payload: params,
      callback: () => {
        const { dataProcessingItemData } = this.props;
        const alertBypassStatus = dataProcessingItemData.items.filter(
          element => element.bypassStatus === '0',
        );
        console.log('alertBypassStatus====', alertBypassStatus);
        this.setState({
          alertBypassStatus,
        });
      },
    });
  };

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
        console.log('this.props.marketData====', this.props.marketData);
        this.setState({
          functionNameOptions: this.props.marketData.map(element => ({
            key: element.dataId,
            value: element.dictdataValue,
            title: element.dictdataName,
          })),
        });
      },
    });
  };

  connectDataProcessing = record => {
    this.setState(
      {
        alertType: record.alertType,
        isBypass: !!(record.isClosedIntraday === '1'),
      },
      () => {
        console.log('this.state.isBypass===', this.state.isBypass);
        this.queryDataProcessingItem();
      },
    );
  };

  inspectData = () => {
    this.queryDataProcessing();
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { dataProcessingItemData } = this.props;
    if (selectedRowKeys.length === dataProcessingItemData.items.length) {
      this.setState({
        checkedAll: true,
        alertIndeterminate: false,
      });
    } else if (selectedRowKeys.length > 0) {
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
    selectedRows.forEach(element => alertIds.push(element.alertId));
    this.setState({ selectedRowKeys, alertIds: alertIds.join(',') }, () => {});
  };

  onSelectChangeAll = checkedValue => {
    const { dataProcessingItemData } = this.props;
    const selectedRowKeys = dataProcessingItemData.items.map((element, index) => index);
    const alertIds = [];
    this.setState({
      checkedAll: checkedValue.target.checked,
    });
    if (checkedValue.target.checked) {
      dataProcessingItemData.items.forEach(element => alertIds.push(element.alertId));
      this.setState({ selectedRowKeys, alertIds: alertIds.join(',') });
    } else {
      this.setState({
        selectedRowKeys: [],
        alertIds: [],
      });
    }
  };

  onChangeMarkt = (value, key) => {
    console.log('value', value, key);
    this.setState({
      market: value,
    });
  };

  startProcessing = () => {
    const { dataProcessingData } = this.props;
    const isClosedIntraday = dataProcessingData.items.some(
      element => element.isClosedIntraday === '1',
    );
    const intradays = dataProcessingData.items.filter(item => item.isClosedIntraday === '1');
    if (isClosedIntraday) {
      this.setState({
        intradays,
        dataAlertVisible: true,
      });
    } else {
      const { dispatch } = this.props;
      const { market } = this.state;
      const params = {
        user_id: getStore('userId'),
        market,
      };
      dispatch({
        type: 'dataProcessing/startProcessing',
        payload: params,
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
    // dataProcessingVisible: false,
    this.alertItemsByPass();
  };

  alertItemsByPass = () => {
    const { dispatch } = this.props;
    const params = {
      operType: 'alertItemsByPass',
      // pageNumber: `${this.state.itemPage.pageNumber.toString()}` || '1',
      // pageSize: `${this.state.itemPage.pageSize.toString()}` || '10',
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

  goClertCenter = () => {
    const { dataProcessingItemData } = this.props;
    const alertIds = dataProcessingItemData.items.map(element => element.alertId);
    router.push({ pathname: '/homepage/alert-center', query: { alertIds: alertIds.join(',') } });
  };

  render() {
    const { loading, dataProcessingData, dataProcessingItemData } = this.props;
    const {
      // page,
      // itemPage,
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
      checkedAll,
      alertIndeterminate,
      alertBypassStatus,
      isBypass,
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
                  <Button type="primary" onClick={this.inspectData} className="btn-usual">
                    {formatMessage({ id: 'systemManagement.dataProcessing.inspectData' })}
                  </Button>
                  <Table
                    loading={loading['dataProcessing/getDataProcessing']}
                    style={{ marginTop: '6px' }}
                    eslint-disable-next-line
                    no-confusing-arrow
                    rowClassName={record =>
                      classnames({
                        [styles['table-active']]: record.alertType === alertType,
                        [styles['alert-table-row']]: record.isClosedIntraday === '1',
                      })
                    }
                    dataSource={dataProcessingData.items}
                    columns={this.state.codeColumns}
                    pagination={false}
                    onRow={record => ({
                      onClick: () => {
                        this.connectDataProcessing(record);
                      }, // 点击行
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
                    visible={dataProcessingVisible}
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
                    loading={loading['codeList/getCodeItemList']}
                    rowSelection={alertBypassStatus.length > 0 && isBypass ? rowSelection : null}
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
                      onClick={this.goClertCenter}
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
              {/* <ul className={styles.startProcessingWraper}>
                <li>
                  <span>Records Received from ECP：</span>
                  <span>12</span>
                </li>
                <li>
                  <span>Records Imported by user：</span>
                  <span>10</span>
                </li>
                <li>
                  <span>TO Records Eliminated：</span>
                  <span>8</span>
                </li>
                <li>
                  <span>Duplicated Records Eliminated：</span>
                  <span>6</span>
                </li>
                <li>
                  <span>Late Submission：</span>
                  <span>3</span>
                </li>
                <li>
                  <span>Adjustment of Stock Options Records for Format Conversion：</span>
                  <span>0</span>
                </li>
              </ul>
              <ul className={styles.startProcessingWraper}>
                <li>
                  <span>The last time of data processing is at 10:55 on 12/12/2019</span>
                </li>
              </ul> */}
              <Row type="flex" gutter={30} style={{ marginTop: '10px' }}>
                {/* <Col>
                  <span>Trade Date</span>
                  <RangePicker
                    format="YYYY-MM-DD"
                    placeholder={['Start Date', 'End Date']}
                    style={{ width: '180px' }}
                  />
                </Col> */}
                <Col>
                  <span>Market</span>
                  <Select
                    placeholder="Please Select"
                    allowClear
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
