import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Row, Select, Radio, DatePicker, Button } from 'antd';

import less from './ReportPreview.less';
import ReportPager from './ReportPager';

@connect(({ reportDesignPreview }) => {
  const { previewData = {} } = reportDesignPreview;
  return {
    previewData,
  };
})
class ReportDesignerPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimenRadio: 'daily',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  // 获取数据
  fetchData = ({ pageNumber = '1', pageSize = '10' } = { pageNumber: '1', pageSize: '10' }) => {
    // 若有reportId，则调用接口查询报表设计器相关信息
    const {
      dispatch,
      location: {
        query: { reportId },
      },
    } = this.props;
    // 查看预览数据
    dispatch({
      type: 'reportDesignPreview/getReportTemplateDataQuery',
      payload: {
        reportId,
        pageNumber,
        pageSize,
      },
    });
  };

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

  // 页码 | 每页条数 改变时触发
  pageChageCallback = args => {
    console.log('preview -> currPageChangeCb: ', args);
    this.fetchData(args);
  };

  // 导出 Excel 文件请求
  exportExcel = () => {
    // console.log('exportExcel');
    const {
      dispatch,
      location: {
        query: { reportId },
      },
    } = this.props;
    // 查看预览数据
    dispatch({
      type: 'reportDesignPreview/fetchExportFile',
      payload: {
        reportId,
        bcLangType: 'ENUS',
        fileType: 'xls',
      },
      callback: filePath => this.exportFile(filePath),
    });
  };

  // 导出 Excel 文件
  exportFile = filePath => {
    const a = document.createElement('a');
    a.href = `/download?filePath=${filePath}`;
    a.download = true;
    a.click();
  };

  // 打印 TODO:
  printReportor = () => {
    console.log('打印报表 - 待办');
  };

  // 条件搜索 TODO:
  search = () => {
    console.log('条件搜索 - 待办');
  };

  render() {
    const { dimenRadio } = this.state;
    const {
      previewData: { items = [] },
    } = this.props;
    const [tableData, rowCountAndTemplateArea] = items; // 考虑 undefined
    // 总的记录数及templateArea
    const { totalRowCount: totalRecord, templateArea = {} } = rowCountAndTemplateArea || {};
    const { customSearchData = [] } = templateArea;
    const { totalPage, content = '<div></div>', style: styleRules } = tableData || {};
    // console.log('preview: ', items);
    if (styleRules) {
      // 动态添加表格的样式到 document 中
      const isExist = document.querySelector("style[name='report-preview']");
      if (!isExist) {
        // console.log('create style tag');
        const headTag = document.querySelector('head');
        const style = document.createElement('style');
        style.setAttribute('name', 'report-preview');
        style.innerHTML = styleRules;
        headTag.appendChild(style);
      }
    }
    return (
      <div className={less['report-preview-container']}>
        <div className={less['page-container']}>
          <ReportPager
            inlineBlock
            showTotal
            showPageSize
            totalPage={totalPage}
            totalRecord={totalRecord}
            pageChageCallback={this.pageChageCallback}
          />
          <div className="ant-divider ant-divider-vertical" role="separator" />
          <Icon type="export" title="Export" onClick={this.exportExcel} />
          <Icon type="printer" title="Print" onClick={this.printReportor} />
        </div>

        <div className={less['filter-condition']}>
          {/* <Row>
            <div className={less['dropdown-item']}>
              <span className={less['dropdown-label']}>Product Category</span>
              <Select placeholder="Drink" onChange={this.onCategoryChange}>
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
          </Row> */}
          <Row className={less['search-btn-row']}>
            <Button type="primary" icon="search" onClick={this.search}>
              Search
            </Button>
          </Row>
        </div>

        <div className={less['table-area']} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }
}

export default ReportDesignerPreview;
