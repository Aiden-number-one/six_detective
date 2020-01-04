import React, { useState } from 'react';
import { Drawer, Button, Radio, Empty, Spin, Tag } from 'antd';
import { FormattedMessage } from 'umi/locale';
import btnStyles from '@/pages/DataImportLog/index.less';

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

export default function({ loading, visible, users, handleCancel, assignUser }) {
  const [curUserId, setUserId] = useState('');

  async function handleCommit() {
    await assignUser(curUserId);
    setUserId('');
  }
  return (
    <Drawer
      title={<FormattedMessage id="alert-center.assign" />}
      width={320}
      visible={visible}
      closable={false}
      bodyStyle={{ paddingBottom: 80 }}
      onClose={handleCancel}
    >
      <Spin spinning={loading['alertCenter/fetchAssignUsers']}>
        {users.length > 0 ? (
          <Radio.Group onChange={e => setUserId(e.target.value)} value={curUserId}>
            {users.map(user => (
              <Radio style={radioStyle} value={user.userId} key={user.userId}>
                <span>{user.userName}</span>
                <Tag color="#108ee9" style={{ marginLeft: 8 }}>
                  {user.groupName}
                </Tag>
              </Radio>
            ))}
          </Radio.Group>
        ) : (
          <Empty />
        )}
      </Spin>
      <div className={btnStyles['bottom-btns']}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          type="primary"
          disabled={!curUserId}
          onClick={handleCommit}
          loading={loading['alertCenter/assignTask']}
        >
          Commit
        </Button>
      </div>
    </Drawer>
  );
}
