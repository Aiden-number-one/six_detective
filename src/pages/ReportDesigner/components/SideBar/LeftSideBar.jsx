import React, { PureComponent } from 'react';
import { Select } from 'antd';
import classNames from 'classnames';
import { FormattedMessage } from 'umi/locale';
import styles from './index.less';

export default class LeftSideBar extends PureComponent {
  state = {};

  render() {
    return (
      <div className={classNames(styles.layout, styles.sideBar, styles.left)}>
        <div className={styles.header}>
          <div className={styles.title}>{<FormattedMessage id="report-designer.dataset" />}</div>
        </div>
        <div className={styles.datasetSelect}>
          <Select className={styles.select} />
          <div className={styles.icon}></div>
        </div>
      </div>
    );
  }
}

// function ListItem() {
//   return <div className={classNames(styles.layout, styles.sideBar, styles.left)} />;
// }
