/*
 * @Des: 头部工具栏
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2020-01-07 09:36:59
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-09 09:39:28
 */
/* eslint-disable max-len */
import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import { message } from 'antd';
import styles from './index.less';
import IconFont from '@/components/IconFont';
import StartMenu from './StartMenu';
import InsertMenu from './InsertMenu';

@connect(({ reportDesigner }) => ({
  reportName: reportDesigner.reportName,
  reportId: reportDesigner.reportId,
}))
export default class ToolBar extends Component {
  state = {
    tabActive: 'Start',
    reportNameType: 'span',
  };

  inpuRef = React.createRef();

  // 修改Tab Active的状态
  setTabActive = tabActive => {
    this.setState({
      tabActive,
    });
  };

  // 修改report Input Name
  reportOnChange = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportDesigner/changeReportName',
      payload: e.target.value,
    });
  };

  render() {
    const { tabActive, reportNameType } = this.state;
    const { reportName, saveReportTemplate, reportId } = this.props;
    return (
      <>
        <div className={classNames(styles.switchTabs)}>
          <div className={styles.leftBlock} />
          <div className={styles.middleBlock}>
            <div className={styles.nameSpace}>
              <IconFont type="iconcengji-copy" />
              {/* span */}
              {reportNameType === 'span' && (
                <span
                  className={styles.inputName}
                  onClick={() => {
                    this.setState(
                      {
                        reportNameType: 'input',
                      },
                      () => {
                        this.inpuRef.current.focus();
                      },
                    );
                  }}
                >
                  {reportName}
                </span>
              )}
              {/* input */}
              {reportNameType === 'input' && (
                <input
                  value={reportName}
                  ref={this.inpuRef}
                  className={styles.inputName}
                  onBlur={() => {
                    this.setState({
                      reportNameType: 'span',
                    });
                  }}
                  onChange={this.reportOnChange}
                />
              )}
            </div>
            <div className={styles.tabsName}>
              <div
                onClick={() => {
                  this.setTabActive('Start');
                }}
                className={classNames(styles.tabButt, tabActive === 'Start' && styles.active)}
              >
                Start
              </div>
              <div
                onClick={() => {
                  this.setTabActive('Insert');
                }}
                className={classNames(styles.tabButt, tabActive === 'Insert' && styles.active)}
              >
                Insert
              </div>
            </div>
            <div className={styles.tabsAreaAction}>
              <div
                className={styles.actionButt}
                onClick={() => {
                  if (!reportId) {
                    message.warn('Please save the report template.');
                    return;
                  }
                  window.open(`/report-designer-preview?reportId=${reportId}`);
                }}
              >
                <IconFont type="iconicon_previrew" />
                <span>Preview</span>
              </div>
              <div className={styles.actionButt}>
                <IconFont type="iconicon_previrew" />
                <span>Share</span>
              </div>
              {/* 进行模板保存 */}
              <div className={styles.actionButt} onClick={saveReportTemplate}>
                <IconFont type="iconicon_previrew" />
                <span>Save</span>
              </div>
            </div>
          </div>
          <div className={styles.rightBlock} />
        </div>
        <div style={{ display: tabActive === 'Start' ? 'block' : 'none' }}>
          <StartMenu {...this.props} />
        </div>
        <div style={{ display: tabActive === 'Insert' ? 'block' : 'none' }}>
          <InsertMenu />
        </div>
      </>
    );
  }
}
