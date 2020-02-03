import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Button, Spin } from 'antd';
import less from './ReportPreview.less';
import ReportPager from './ReportPager';
import PreviewSearchArea from './components/PreviewSearchArea';
import IconFont from '@/components/IconFont';

@connect(({ reportDesignPreview, loading }) => {
  const { previewData = {}, dataSetColumn = {}, customSearchData = [] } = reportDesignPreview;
  return {
    previewData,
    dataSetColumn,
    customSearchData,
    loading: loading.effects['reportDesignPreview/getReportTemplateDataQuery'],
  };
})
class ReportDesignerPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterCollapsed: false, // 筛选条件是否折叠
    };
    this.parameters = ''; // 参数初始化
  }

  // 获取数据
  fetchData = (
    { pageNumber = '1', pageSize = '10', parameters = this.parameters } = {
      pageNumber: '1',
      pageSize: '10',
      parameters: this.parameters,
    },
  ) => {
    // 若有reportId，则调用接口查询报表设计器相关信息
    const {
      dispatch,
      location: {
        query: { reportId, paging = '1', isTempPreview },
      },
    } = this.props;
    const reportTemplateContent = window.localStorage.getItem('temporaryJSon');
    const payload = {
      // 若为不分页，则pageNumber始终为0
      // pageNumber: paging === '1' ? pageNumber : '0', // lcs 不分页注释
      pageNumber: 0,
      pageSize,
      parameters,
    };
    if (isTempPreview === '1') {
      payload.reportTemplateContent = reportTemplateContent;
    } else {
      payload.reportId = reportId;
    }
    // 查看预览数据
    dispatch({
      type: 'reportDesignPreview/getReportTemplateDataQuery',
      payload,
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

  // 页码 | 每页条数 改变时触发
  pageChageCallback = args => {
    // console.log('preview -> currPageChangeCb: ', args);
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
        parameters: this.parameters,
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

  // 根据Key得到customSearchData相对应的数据
  getCurrentData = key => {
    const { customSearchData } = this.props;
    return customSearchData.find(value => value.widgetKey === key) || {};
  };

  // 条件搜索 TODO:
  search = () => {
    this.formRef.props.form.validateFields((err, values) => {
      const transformValue = {};
      Object.keys(values).forEach(key => {
        const value = values[key];
        const {
          widgetType, // 控件类型
          widgetKey, // 控件Key
          parameterType, // 所绑定字段的Type
          customList = [], // 自定义字段所需要的值
          sourceType, // select类类型的数据来源
        } = this.getCurrentData(key);
        if (widgetType === 'datepickeryyyymm' && value) {
          transformValue[widgetKey] = value.format('YYYYMM');
        } else if (widgetType === 'datepickeryyyymmdd' && value) {
          transformValue[widgetKey] = value.format('YYYYMMDD');
        } else if ((widgetType === 'checkbox' || widgetType === 'selectmultiple') && value) {
          // 如果是自定义的话
          transformValue[widgetKey] = value
            .map(singleValue => {
              const selectValue =
                sourceType === 'custom'
                  ? customList.find(singleCustom => singleCustom.key === singleValue).value
                  : singleValue;
              if (parameterType === 'STRING') {
                return `'${selectValue}'`; // 若为字符串的时候要带''
              }
              return selectValue;
            })
            .join(',');
        } else if ((widgetType === 'radio' || widgetType === 'select') && value) {
          transformValue[widgetKey] =
            sourceType === 'custom'
              ? customList.find(singleCustom => singleCustom.key === value).value
              : value;
        } else {
          transformValue[widgetKey] = value;
        }
      });
      if (!err) {
        this.fetchData({ parameters: JSON.stringify(transformValue) });
        this.parameters = JSON.stringify(transformValue);
      }
    });
  };

  render() {
    const { filterCollapsed } = this.state;
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
        <div
          className={less['page-container']}
          style={{
            textAlign: 'right',
            borderBottom:
              customSearchData && customSearchData.length ? '1px solid #0d87d4' : 'none',
          }}
        >
          <ReportPager
            showPager={false} // TODO: 暂时隐藏分页
            inlineBlock
            showTotal
            showPageSize
            totalPage={totalPage}
            totalRecord={totalRecord}
            pageChageCallback={this.pageChageCallback}
            paging={false} // TODO: 暂时不分页
          />
          {/* <div className="ant-divider ant-divider-vertical" role="separator" /> */}
          <IconFont
            type="icondaochu"
            title="Export"
            className={less['icon-export']}
            onClick={this.exportExcel}
            style={{ lineHeight: '26px', marginTop: '10px' }}
          />
          {/* <IconFont
            type="icondayin"
            title="Print"
            className={less['icon-download']}
            onClick={this.printReportor}
          /> */}
        </div>

        {customSearchData && customSearchData.length ? (
          <div
            className={less['filter-condition']}
            style={
              filterCollapsed
                ? { height: '12px', padding: '0 10px', borderBottomColor: 'transparent' }
                : { height: 'auto', padding: '20px 10px', borderBottomColor: '#0d87d4' }
            }
          >
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
            <div className={less['icon-collaspe']}>
              <IconFont
                type={filterCollapsed ? 'iconarrow_collaspex-copy' : 'iconarrow_collaspex'}
                onClick={() => {
                  this.setState({ filterCollapsed: !filterCollapsed });
                }}
              />
            </div>
          </div>
        ) : null}

        <Spin spinning={loading}>
          <div className={less['table-area']} dangerouslySetInnerHTML={{ __html: content }} />
        </Spin>
      </div>
    );
  }
}

export default ReportDesignerPreview;
