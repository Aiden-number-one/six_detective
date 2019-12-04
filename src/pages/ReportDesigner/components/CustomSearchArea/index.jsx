/*
 * @Des: 查询控件区域
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors: mus
 * @LastEditTime: 2019-12-03 20:40:52
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { WidthProvider, Responsive } from 'react-grid-layout';
import styles from './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

@connect(({ reportDesigner }) => ({
  customSearchData: reportDesigner.customSearchData,
}))
export default class CustomSearchArea extends PureComponent {
  static defaultProps = {
    rowHeight: 30,
  };

  generateDOM = () => {
    const { customSearchData } = this.props;
    return customSearchData.map(el => <div key={el.i} className={styles.bulk}></div>);
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
  return <div classNam={styles.WidgetArea}></div>;
}
