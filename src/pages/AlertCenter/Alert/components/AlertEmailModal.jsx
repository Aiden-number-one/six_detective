/* eslint-disable react/no-danger */
import React from 'react';
import { Drawer, Button } from 'antd';
import { FormattedMessage } from 'umi/locale';
import btnStyles from '@/pages/DataImportLog/index.less';

export default function({ loading, visible, content, handleCancel, onSendEmail }) {
  const email = content[0] || {};
  return (
    <Drawer
      title={<FormattedMessage id="alert-center.email-content" />}
      width={400}
      visible={visible}
      closable={false}
      bodyStyle={{ paddingBottom: 80 }}
      onClose={handleCancel}
    >
      <div>
        <div dangerouslySetInnerHTML={{ __html: email.emailBody }}></div>
      </div>
      <div className={btnStyles['bottom-btns']}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          type="primary"
          disabled={!content}
          onClick={onSendEmail}
          loading={loading['alertCenter/sendEmail']}
        >
          Commit
        </Button>
      </div>
    </Drawer>
  );
}
