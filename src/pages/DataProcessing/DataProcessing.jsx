import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, Button, Table, Pagination } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './DataProcessing.less';

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

  render() {
    const { loading, dataProcessingData, dataProcessingItemData } = this.props;
    const { page, itemPage, selectedRowKeys } = this.state;
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
              <Col span={12} cassName={styles.dataTable}>
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
              </Col>
              <Col span={12} cassName={styles.dataItemTable}>
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
              </Col>
            </Row>
          </div>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}
