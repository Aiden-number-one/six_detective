import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Row, Select, Radio, DatePicker, Button } from 'antd';

import less from './ReportPreview.less';
import ReportPager from './ReportPager';

@connect(({ reportDesignPreview }) => ({
  previewData: reportDesignPreview.previewData,
}))
class ReportDesignerPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimenRadio: 'daily',
    };
  }

  componentDidMount() {
    // 若有reportId，则调用接口查询报表设计器相关信息
    const {
      dispatch,
      location: {
        query: { reportId },
      },
    } = this.props;
    // console.log('reportpreview didmount: ', this.props);
    // 查看预览数据
    dispatch({
      type: 'reportDesignPreview/getReportTemplateDataQuery',
      payload: {
        reportId,
        pageNumber: 1,
      },
    });
  }

  // filter: category
  onCategoryChange = value => {
    console.log('onCategoryChange: ', value);
  };

  // filter: supplier
  onSupplierChange = value => {
    console.log('onSupplierChange: ', value);
  };

  // filter: payment status
  onPayStatusChange = value => {
    console.log('paymentStatus: ', value);
  };

  // filter: radio
  filterRadioChange = ev => {
    const { value } = ev.target;
    console.log('filterRadioChange: ', value);
    this.setState({ dimenRadio: value });
  };

  render() {
    const { dimenRadio } = this.state;
    const {
      previewData: { items = [] },
    } = this.props;
    const [tableData, rowCount] = items; // 考虑 undefined
    const { totalRowCount: totalRecord } = rowCount || {}; // 总的记录数
    const { totalPage, content = '<div></div>' } = tableData || {};
    console.log('render -> data: ', items);
    return (
      <>
        <div className={less['page-container']}>
          <ReportPager
            inlineBlock
            showTotal
            showPageSize
            totalPage={totalPage}
            totalRecord={totalRecord}
          />
          <div className="ant-divider ant-divider-vertical" role="separator" />
          <Icon type="export" title="Export" />
          <Icon type="printer" title="Print" />
        </div>

        <div className={less['filter-condition']}>
          <Row>
            <div className={less['dropdown-item']}>
              <span className={less['dropdown-label']}>Product Category</span>
              <Select placeholder="Drink" onChange={this.onCategoryChange}>
                <Select.Option value="null">Drink</Select.Option>
                <Select.Option value="coca">Coca-cola</Select.Option>
                <Select.Option value="nongfu">NongFu</Select.Option>
              </Select>
            </div>
            <div className={less['dropdown-item']}>
              <span className={less['dropdown-label']}>Supplier</span>
              <Select placeholder="Brand Name" onChange={this.onSupplierChange}>
                <Select.Option value="addi">Addidas</Select.Option>
                <Select.Option value="nike">Nike</Select.Option>
              </Select>
            </div>
            <div className={less['dropdown-item']}>
              <span className={less['dropdown-label']}>Order Payment Status</span>
              <Select placeholder="Paid Status" onChange={this.onPayStatusChange}>
                <Select.Option value="paid">Paid</Select.Option>
                <Select.Option value="unpaid">UnPaid</Select.Option>
              </Select>
            </div>
            <div className={less['dropdown-item']}>
              <span className={less['dropdown-label']}>Start Date</span>
              <DatePicker />
            </div>
            <div className={less['dropdown-item']}>
              <span className={less['dropdown-label']}>End Date</span>
              <DatePicker />
            </div>
          </Row>
          <Row className={less['dimen-row']}>
            <span className={less['dimen-title']}>Dimension of Statistics</span>
            <Radio.Group
              value={dimenRadio}
              className={less['radio-opts']}
              onChange={this.filterRadioChange}
            >
              <Radio value="daily">Daily Report</Radio>
              <Radio value="monthly">Monthly Report</Radio>
              <Radio value="annual">Annual Report</Radio>
            </Radio.Group>
          </Row>
          <Row className={less['search-btn-row']}>
            <Button type="primary" icon="search">
              Search
            </Button>
          </Row>
        </div>

        <div dangerouslySetInnerHTML={{ __html: content }} />
      </>
    );
  }
}

export default ReportDesignerPreview;
