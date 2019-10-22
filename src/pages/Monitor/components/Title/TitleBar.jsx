import React from 'react';
import styles from './TitleBar.less';

export function Title({ test }) {
  return (
    <div className={styles.titleBox}>
      <div className={styles.title}>{`| ${test}`}</div>
    </div>
  );
}
