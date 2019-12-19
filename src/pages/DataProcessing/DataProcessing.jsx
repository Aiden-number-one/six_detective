import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, Button, Table, Pagination, Select, DatePicker, Modal, Progress } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './DataProcessing.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ dataProcessing, loading }) => ({
  loading: loading.effects,
  dataProcessingData: dataProcessing.data,
  dataProcessingItemData: dataProcessing.itemData,
}))
export default class DataProcessing extends Component {
  constructor() {
    super();
    this.state = {
      codeId: '',
      dataProcessingVisible: false,
      dataProcessingFlag: false,
      codeColumns: [
        {
          title: formatMessage({ id: 'app.common.number' }),
          dataIndex: 'index',
          key: 'index',
          render: (res, recode, index) => (
            <span>{(this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1}</span>
          ),
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.market' }),
          dataIndex: 'codeId',
          key: 'codeId',
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.alertName' }),
          dataIndex: 'codeName',
          key: 'codeName',
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.numberOfAlert' }),
          dataIndex: 'codeName',
          key: 'codeName',
        },
      ],
      columns: [
        {
          title: formatMessage({ id: 'app.common.number' }),
          dataIndex: 'index',
          key: 'index',
          render: (res, recode, index) => (
            <span>
              {(this.state.itemPage.pageNumber - 1) * this.state.itemPage.pageSize + index + 1}
            </span>
          ),
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.alertOwner' }),
          dataIndex: 'subitemId',
          key: 'subitemId',
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.submitterCode' }),
          dataIndex: 'subitemName',
          key: 'subitemName',
        },
        {
          title: formatMessage({ id: 'systemManagement.dataProcessing.submitterName' }),
          dataIndex: 'sequence',
          key: 'sequence',
        },
      ],
      functionNameOptions: [
        { key: '', value: '', title: 'All' },
        { key: '1', value: '1', title: 'Name One' },
        { key: '2', value: '2', title: 'Name Two' },
        { key: '3', value: '3', title: 'Name Three' },
      ],
      selectedRowKeys: [],
      page: {
        pageNumber: 1,
        pageSize: 10,
      },
      itemPage: {
        pageNumber: 1,
        pageSize: 10,
      },
    };
  }

  componentDidMount() {
    this.queryDataProcessing();
  }

  queryDataProcessing = () => {
    const { dispatch } = this.props;
    const { page, codeName } = this.state;
    const params = {
      pageNumber: page.pageNumber.toString(),
      pageSize: page.pageSize.toString(),
      operType: 'codeQuery',
      codeName,
    };
    dispatch({
      type: 'dataProcessing/getDataProcessing',
      payload: params,
      callback: () => {
        this.setState(
          {
            codeId:
              this.props.dataProcessingData.items[0] &&
              this.props.dataProcessingData.items[0].codeId,
          },
          () => {
            this.queryDataProcessingItem();
          },
        );
      },
    });
  };

  queryDataProcessingItem = () => {
    const { dispatch } = this.props;
    const params = {
      operType: 'subitemQueryBycodeId',
      pageNumber: `${this.state.itemPage.pageNumber.toString()}` || '1',
      pageSize: `${this.state.itemPage.pageSize.toString()}` || '10',
      codeId: `${this.state.codeId}`,
    };
    dispatch({
      type: 'dataProcessing/getDataProcessingItem',
      payload: params,
    });
  };

  connectDataProcessing = record => {
    this.setState(
      {
        codeId: record.codeId,
      },
      () => {
        this.queryDataProcessingItem();
      },
    );
  };

  inspectData = () => {};

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  startProcessing = () => {
    this.setState({
      dataProcessingVisible: true,
      dataProcessingFlag: true,
    });
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

  render() {
    const { loading, dataProcessingData, dataProcessingItemData } = this.props;
    const {
      page,
      itemPage,
      selectedRowKeys,
      functionNameOptions,
      dataProcessingVisible,
      dataProcessingFlag,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Fragment>
        <PageHeaderWrapper>
          <div className={styles.dataProcessingWraper}>
            <Row gutter={20}>
              <Col span={14} cassName={styles.dataTable}>
                <Button
                  type="primary"
                  onClick={this.inspectData}
                  className="btn_usual"
                  style={{ height: '36px' }}
                >
                  {formatMessage({ id: 'systemManagement.dataProcessing.inspectData' })}
                </Button>
                <Table
                  loading={loading['dataProcessing/getDataProcessing']}
                  dataSource={dataProcessingData.items}
                  columns={this.state.codeColumns}
                  pagination={false}
                  onRow={record => ({
                    onClick: () => {
                      this.connectDataProcessing(record);
                    }, // 点击行
                  })}
                ></Table>
                <Pagination
                  showSizeChanger
                  current={page.pageNumber}
                  showTotal={() =>
                    `Page ${(dataProcessingData.totalCount || 0) && page.pageNumber} of ${Math.ceil(
                      (dataProcessingData.totalCount || 0) / page.pageSize,
                    ).toString()}`
                  }
                  onShowSizeChange={this.onShowSizeChange}
                  onChange={this.pageChange}
                  total={dataProcessingData.totalCount}
                  pageSize={page.pageSize}
                />
                <Row
                  type="flex"
                  align="middle"
                  justify="space-between"
                  gutter={30}
                  style={{ marginTop: '10px' }}
                >
                  <Col>
                    <span>Trade Date</span>
                    <RangePicker
                      format="YYYY-MM-DD"
                      placeholder={['Start Date', 'End Date']}
                      style={{ width: '180px' }}
                    />
                  </Col>
                  <Col>
                    <span>Market</span>
                    <Select placeholder="Please Select" style={{ width: '120px' }}>
                      {functionNameOptions.map(item => (
                        <Option key={item.key} value={item.value}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col>
                    <span className={styles.startProcessingBtn} onClick={this.startProcessing}>
                      Start Processing
                    </span>
                  </Col>
                </Row>
                <Modal
                  title={formatMessage({ id: 'app.common.confirm' })}
                  visible={dataProcessingVisible}
                  onOk={this.dataProcessingConfirm}
                  onCancel={this.dataProcessingCancel}
                  cancelText={formatMessage({ id: 'app.common.cancel' })}
                  okText={formatMessage({ id: 'app.common.confirm' })}
                >
                  {dataProcessingFlag ? (
                    <div>
                      <Progress percent={50} status="active" />
                    </div>
                  ) : (
                    <span>There are still 10 outstanding alerts. Do you want to bypass all?</span>
                  )}
                </Modal>
                <ul className={styles.startProcessingWraper}>
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
                </ul>
              </Col>
              <Col span={10} cassName={styles.dataItemTable}>
                <div className={styles.tableTop}>
                  <Button
                    onClick={this.addCode}
                    type="primary"
                    className="btn_usual"
                    style={{ height: '36px' }}
                    disabled={!hasSelected}
                  >
                    {formatMessage({ id: 'systemManagement.dataProcessing.bypass' })}
                  </Button>
                </div>
                <Table
                  loading={loading['codeList/getCodeItemList']}
                  rowSelection={rowSelection}
                  dataSource={dataProcessingItemData.items}
                  pagination={false}
                  columns={this.state.columns}
                ></Table>
                <Pagination
                  showSizeChanger
                  current={itemPage.pageNumber}
                  showTotal={() =>
                    `Page ${(dataProcessingItemData.totalCount || 0) &&
                      itemPage.pageNumber} of ${Math.ceil(
                      (dataProcessingItemData.totalCount || 0) / itemPage.pageSize,
                    ).toString()}`
                  }
                  onShowSizeChange={this.onShowItemSizeChange}
                  onChange={this.pageItemChange}
                  total={dataProcessingItemData.totalCount}
                  pageSize={itemPage.pageSize}
                />
                <Row
                  type="flex"
                  align="middle"
                  justify="end"
                  gutter={30}
                  style={{ marginTop: '10px' }}
                >
                  <span className={styles.startProcessingBtn}>Enter Alert Center</span>
                </Row>
              </Col>
            </Row>
          </div>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}
