import React, { useState } from 'react';
import { Drawer, Button, Radio, Empty, Spin } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from '@/pages/AlertCenter/index.less';

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

export default function AlertTaskModal({ loading, visible, users, handleCancel, assignUser }) {
  const [curUserId, setUserId] = useState('');

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
          <Radio.Group onChange={e => setUserId(e.target.value)}>
            {users.map(user => (
              <Radio style={radioStyle} value={user.userId} key={user.userId}>
                {user.userName}
              </Radio>
            ))}
          </Radio.Group>
        ) : (
          <Empty />
        )}
      </Spin>
      <div className={styles['bottom-btns']}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          type="primary"
          onClick={() => assignUser(curUserId)}
          loading={loading['alertCenter/assignTask']}
        >
          Commit
        </Button>
      </div>
    </Drawer>
  );
}
