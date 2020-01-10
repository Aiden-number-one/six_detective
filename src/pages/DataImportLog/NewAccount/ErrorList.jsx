import React from 'react';
import { Popover, Typography, Icon } from 'antd';
import styles from '../index.less';

const { Text } = Typography;

export function ErrorList({ dataSource }) {
  return (
    <Popover
      placement="bottomLeft"
      overlayClassName={styles['account-error-container']}
      content={
        <ul>
          {dataSource.map(text => (
            <li key={text}>
              <Text ellipsis style={{ width: '96%' }} title={text}>
                {text}
              </Text>
            </li>
          ))}
        </ul>
      }
    >
      <div className={styles['account-error']}>
        <Icon type="exclamation-circle" theme="filled" className={styles.icon} />
        <span>Error is found...</span>
      </div>
    </Popover>
  );
}
