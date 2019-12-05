/*
 * @Des: 查询控件区域
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors: mus
 * @LastEditTime: 2019-12-05 11:24:38
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { WidthProvider, Responsive } from 'react-grid-layout';
import styles from './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

@connect(({ formArea }) => ({
  customSearchData: formArea.customSearchData,
}))
export default class CustomSearchArea extends PureComponent {
  static defaultProps = {
    rowHeight: 30,
  };

  generateDOM = () => {
    const { customSearchData } = this.props;
    return customSearchData.map(el => <div key={el.i} className={styles.bulk}></div>);
  };

  /**
   * @description: 往控件区添加控件
   * @param {string} type 控件的类型
   * @return:
   * @Author: mus
   * @Date: 2019-12-05 10:46:07
   */
  addWidgetArea = type => {
    const value = {
      type, // 控件类型
      name: '', // 控件名称
      placeholder: '', // 控件placeholder
      des: '', // 控件描述
      field: '', // 控件字段名称
      isNull: false, // 控件是否为空
      validation: {
        maxLength: Infinity, // 最大长度
        minLength: 0, // 最小长度
        max: Infinity, // 最大值
        min: -Infinity, // 最小值
      },
      displayState: 'normal', // 展示控件状态
      initialValue: undefined, // 初始值
    };
    const { dispatch, customSearchData } = this.props;
    dispatch({
      type: 'formArea/changeCustomSearchData',
      payload: [...customSearchData, value],
    });
  };

  render() {
    return (
      <div className={styles.customSearchArea}>
        <ResponsiveReactGridLayout onLayoutChange={this.onLayoutChange} {...this.props}>
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
        <WidgetArea />
      </div>
    );
  }
}

function WidgetArea() {
  return (
    <div className={styles.widgetArea}>
      <div className={styles.editArea}>
        <Icon type="plus" onClick />
      </div>
      <div className={styles.closeArea}>Close</div>
    </div>
  );
}
