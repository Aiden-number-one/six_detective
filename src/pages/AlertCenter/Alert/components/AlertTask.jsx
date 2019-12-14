import React, { useState } from 'react';
import { Drawer, Button, Table, Radio, Empty, Spin } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from '@/pages/AlertCenter/index.less';

const { Column } = Table;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

function AlertTaskModal({ loading, visible, users, handleCancel, assignUser }) {
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

function AlertTask({ dispatch, loading, alertItems, users }) {
  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  function showUsers() {
    setVisible(true);
    dispatch({
      type: 'alertCenter/fetchAssignUsers',
      payload: {
        alertItemIds: selectedRows.map(item => item.ALERT_ITEM_ID),
      },
    });
  }

  function handleAssignUser(userId) {
    dispatch({
      type: 'alertCenter/assignTask',
      payload: {
        userId,
        taskIds: selectedRows.map(item => item.TASK_ID),
      },
    });
    // setVisible(false);
  }
  return (
    <>
      <AlertTaskModal
        loading={loading}
        visible={visible}
        users={users}
        handleCancel={() => setVisible(false)}
        assignUser={handleAssignUser}
      />
      <Button style={{ marginBottom: 10 }} disabled={!selectedRows.length} onClick={showUsers}>
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
          columnWidth: 40,
          onChange: (selectedRowKeys, sRows) => {
            setSelectedRows(sRows);
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
          ellipsis
          align="center"
          dataIndex="TASK_STATUS_DESC"
          title={<FormattedMessage id="alert-center.status" />}
        />
        <Column
          ellipsis
          align="center"
          dataIndex="action"
          title={<FormattedMessage id="alert-center.action" />}
          render={(text, record) => (
            <Link
              to={`/alert-management/Approval-Process-Center?taskcode=${record.TASK_ID}`}
              title={formatMessage({ id: 'alert-center.enter-workflow' })}
            >
              <FormattedMessage id="alert-center.enter-workflow" />
            </Link>
          )}
        />
      </Table>
    </>
  );
}

export default connect(({ loading, alertCenter: { users, alertItems } }) => ({
  users,
  alertItems,
  loading: loading.effects,
}))(AlertTask);
