import React from 'react';
import { Drawer, Button, Spin } from 'antd';
import { FormattedMessage } from 'umi/locale';
import btnStyles from '@/pages/DataImportLog/index.less';

export default function({ loading, visible, content, handleCancel, onSendEmail }) {
  async function handleCommit() {
    onSendEmail();
  }
  return (
    <Drawer
      title={<FormattedMessage id="alert-center.email-content" />}
      width={320}
      visible={visible}
      closable={false}
      bodyStyle={{ paddingBottom: 80 }}
      onClose={handleCancel}
    >
      <Spin spinning={false}>{content}</Spin>
      <div className={btnStyles['bottom-btns']}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          type="primary"
          disabled={!content}
          onClick={handleCommit}
          loading={loading['alertCenter/assignTask']}
        >
          Commit
        </Button>
      </div>
    </Drawer>
  );
}
