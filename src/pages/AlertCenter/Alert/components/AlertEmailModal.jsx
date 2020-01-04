/* eslint-disable react/no-danger */
import React from 'react';
import { Drawer, Button } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { timestampFormat } from '@/pages/DataImportLog/constants';
import btnStyles from '@/pages/DataImportLog/index.less';
import styles from '@/pages/AlertCenter/index.less';

export default function({ loading, visible, content, handleCancel, onSendEmail }) {
  const email = content[0] || {};
  const { emailSubject, emailBody, emailFrom, emailTo, sendTime } = email;
  return (
    <Drawer
      title={<FormattedMessage id="alert-center.email-content" />}
      width={450}
      visible={visible}
      closable={false}
      bodyStyle={{ padding: '10px 10px 60px' }}
      onClose={handleCancel}
    >
      <div className={styles['email-container']}>
        <div className={styles['email-header']}>
          <div className={styles.title}>{emailSubject}</div>
          <div className={styles.common}>发件人：{emailFrom}</div>
          <div className={styles.common}>时间：{moment(sendTime).format(timestampFormat)}</div>
          <div className={styles.common}>收件人：{emailTo}</div>
        </div>
        <div
          className={styles['email-content']}
          dangerouslySetInnerHTML={{ __html: emailBody }}
        ></div>
      </div>
      <div className={btnStyles['bottom-btns']}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          type="primary"
          disabled={!content}
          onClick={onSendEmail}
          loading={loading['alertCenter/sendEmail']}
        >
          Send
        </Button>
      </div>
    </Drawer>
  );
}
