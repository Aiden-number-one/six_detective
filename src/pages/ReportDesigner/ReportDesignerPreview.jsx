import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ reportDesignPreview }) => ({
  previewData: reportDesignPreview.previewData,
}))
export default class ReportDesignerPreview extends Component {
  componentDidMount() {
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
      },
    });
  }

  render() {
    return <div></div>;
  }
}
