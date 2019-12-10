import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import DropSelect from '../DropSelect/index';
import styles from './index.less';

export default class LeftSideBar extends PureComponent {
  state = {};

  render() {
    const dataSet = [''];
    return (
      <div className={classNames(styles.layout, styles.sideBar, styles.left)}>
        <div className={styles.topList}>
          <div className={styles.header}>
            <div className={styles.title}>{<FormattedMessage id="report-designer.dataset" />}</div>
          </div>
          <DropSelect
            addon={() => (
              <div className={styles.addon}>
                <Icon type="form" />
              </div>
            )}
          />
          <ul className={styles.list}>
            {dataSet.map(() => (
              <ListItem color="blue" />
            ))}
          </ul>
        </div>
        <div className={styles.divider} />
        <div className={styles.bottomList}>
          <div className={styles.treeParent}>
            <Icon type="caret-right" />
            <IconFont type="iconwenjianjia" className={styles.iconwenjianjia} />
            SQL Param
          </div>
          <ul className={styles.list}>
            {dataSet.map(() => (
              <ListItem color="orange" />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

function ListItem({ color }) {
  return (
    <li className={styles[color]}>
      <IconFont type="iconicon-str" className={classNames(styles.icon, styles[color])} />
      <span>Type</span>
    </li>
  );
}
