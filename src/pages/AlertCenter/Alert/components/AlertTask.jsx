import React, { useState } from 'react';
import { Drawer, Button, Table, Radio, Empty, Spin } from 'antd';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import styles from '@/pages/AlertCenter/index.less';

const { Column } = Table;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

function AlertTaskModal({ loading, visible, users, handleCancel }) {
  function handleCommit() {}
  function hanleChange() {}
  return (
    <Drawer
      title={<FormattedMessage id="alert-center.assign" />}
      width={320}
      visible={visible}
      closable={false}
      bodyStyle={{ paddingBottom: 80 }}
      onClose={handleCancel}
    >
      <Spin spinning={loading}>
        {users.length > 0 ? (
          <Radio.Group onChange={hanleChange}>
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
        <Button type="primary" onClick={handleCommit}>
          Commit
        </Button>
      </div>
    </Drawer>
  );
}

export default function({ loading, alertItems, users, getUsers }) {
  const [visible, setVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);

  function assignUser() {
    setVisible(true);
    getUsers();
  }

  return (
    <>
      <AlertTaskModal
        loading={loading['alertCenter/fetchUsers']}
        visible={visible}
        users={users}
        handleCancel={() => setVisible(false)}
      />
      <Button style={{ marginBottom: 10 }} disabled={!selectedKeys.length} onClick={assignUser}>
        <FormattedMessage id="alert-center.assign" />
      </Button>
      <Table
        border
        dataSource={alertItems}
        rowKey="ALERT_ITEM_ID"
        scroll={{ y: 320 }}
        loading={loading['alertCenter/fetchAlertItems']}
        pagination={{
          showSizeChanger: true,
          showTotal(count) {
            return `Total ${count} items`;
          },
        }}
        rowSelection={{
          onChange: selectedRowKeys => {
            setSelectedKeys(selectedRowKeys);
          },
        }}
      >
        <Column
          align="center"
          dataIndex="TASK_ID"
          title={<FormattedMessage id="alert-center.task-id" />}
        />
        <Column
          align="center"
          dataIndex="MARKET"
          title={<FormattedMessage id="alert-center.market" />}
        />
        <Column
          align="center"
          dataIndex="EP_CODE"
          title={<FormattedMessage id="alert-center.ep-code" />}
        />
        <Column dataIndex="EP_NAME" title={<FormattedMessage id="alert-center.ep-name" />} />
        <Column dataIndex="USER_NAME" title={<FormattedMessage id="alert-center.owner" />} />
        <Column
          align="center"
          dataIndex="TASK_STATUS"
          title={<FormattedMessage id="alert-center.status" />}
        />
        <Column
          align="center"
          dataIndex="action"
          title={<FormattedMessage id="alert-center.action" />}
          render={(text, record) => (
            <Link
              to={`/alert-management/Approval-Process-Center?taskcode=${record.TASK_ID}`}
              style={{ fontSize: 12 }}
            >
              <FormattedMessage id="alert-center.enter-workflow" />
            </Link>
          )}
        />
      </Table>
    </>
  );
}
