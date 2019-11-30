import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import styles from './index.less';

@connect(({ reportDesigner }) => ({}))
export default class CustomSearchArea extends PureComponent {
  state = {};

  render() {
    return (
      <div className={styles.customSearchArea}>
        <WidgetArea />
      </div>
    );
  }
}

function WidgetArea() {
  return <div classNam={styles.WidgetArea}></div>;
}
