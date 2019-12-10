import React from 'react';
import { FormattedMessage } from 'umi/locale';
import styles from '@/pages/AlertCenter/index.less';

export default function({ attachments }) {
  return (
    <div className={styles['up-attachments']}>
      <div className={styles['file-desc']}>
        <FormattedMessage
          id="alert-center.attachment-des"
          values={{
            count: attachments.length,
            size: (attachments.reduce((acc, cur) => acc + cur.size, 0) / 1024).toFixed(2),
          }}
        />
      </div>
      <ul>
        {attachments.map(item => (
          <li key={item.uid}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
