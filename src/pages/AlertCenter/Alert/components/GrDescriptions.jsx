import React from 'react';
import styles from '@/pages/AlertCenter/index.less';

const renderItem = ({ children, label, colon, labelWidth = '20%', direction = 'row' } = {}) => (
  <li key={label} style={{ flexDirection: direction }}>
    <span style={{ width: labelWidth }}>
      {label}
      {colon && <em>:</em>}
    </span>
    <span>{children}</span>
  </li>
);

export const GrDescriptions = ({ children = [], labelWidth, colon }) => (
  <ul className={styles['gr-descriptions']}>
    {children.map(child => child && renderItem({ colon, labelWidth, ...child.props }))}
  </ul>
);

GrDescriptions.Item = ({ children }) => children;
