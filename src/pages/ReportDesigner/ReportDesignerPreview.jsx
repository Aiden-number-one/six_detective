import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Row, Button, Spin } from 'antd';

import less from './ReportPreview.less';
import ReportPager from './ReportPager';
import PreviewSearchArea from './components/PreviewSearchArea';

@connect(({ reportDesignPreview, loading }) => {
  const { previewData = {}, dataSetColumn = {} } = reportDesignPreview;
  return {
    previewData,
    dataSetColumn,
    loading: loading.effects['reportDesignPreview/getReportTemplateDataQuery'],
  };
})
class ReportDesignerPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimenRadio: 'daily',
    };
  }

  // 获取数据
  fetchData = (
    { pageNumber = '1', pageSize = '10', parameters = '' } = {
      pageNumber: '1',
      pageSize: '10',
      parameters: '',
    },
  ) => {
    // 若有reportId，则调用接口查询报表设计器相关信息
    const {
      dispatch,
      location: {
        query: { reportId, paging = '1' },
      },
    } = this.props;
    // 查看预览数据
    dispatch({
      type: 'reportDesignPreview/getReportTemplateDataQuery',
      payload: {
        reportId,
        // 若为不分页，则pageNumber始终为0
        pageNumber: paging === '1' ? pageNumber : '0',
        pageSize,
        parameters,
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
    this.formRef.props.form.validateFields((err, values) => {
      if (!err) {
        this.fetchData({ parameters: JSON.stringify(values) });
      }
    });
  };

  render() {
    const { dimenRadio } = this.state;
    const {
      previewData: { items = [] },
      dataSetColumn, // 当选项来源于数据集时，select中option的数据来源
      loading = false,
    } = this.props;
    const [tableData, rowCountAndTemplateArea] = items; // 考虑 undefined
    // 总的记录数及templateArea
    const { templateArea = {} } = rowCountAndTemplateArea || {};
    // 查询条件相关及分页参数
    const { customSearchData = [], paging } = templateArea;
    const { totalPage, content = '<div></div>', style: styleRules, totalPage: totalRecord } =
      tableData || {};
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
            paging={paging}
          />
          <div className="ant-divider ant-divider-vertical" role="separator" />
          <Icon type="export" title="Export" onClick={this.exportExcel} />
          <Icon type="printer" title="Print" onClick={this.printReportor} />
        </div>

        <div className={less['filter-condition']}>
          <PreviewSearchArea
            wrappedComponentRef={inst => {
              this.formRef = inst;
            }}
            customSearchData={customSearchData}
            dataSetColumn={dataSetColumn}
          />
          <Row className={less['search-btn-row']}>
            <Button type="primary" icon="search" onClick={this.search}>
              Search
            </Button>
          </Row>
        </div>

        <Spin spinning={loading}>
          <div className={less['table-area']} dangerouslySetInnerHTML={{ __html: content }} />
        </Spin>
      </div>
    );
  }
}

export default ReportDesignerPreview;
