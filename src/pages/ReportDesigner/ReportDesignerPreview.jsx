import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ reportDesignPreview }) => ({
  previewData: reportDesignPreview.previewData,
}))
export default class ReportDesignerPreview extends Component {
  render() {
    return <div></div>;
  }
}
