import React, { useState } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { connect } from 'dva';
import { Icon, Table } from 'antd';
import styles from '@/pages/AlertCenter/index.less';
import IconFont from '@/components/IconFont';
import AlertTaskModal from './AlertTaskModal';

function AlertTask({
  dispatch,
  loading,
  alertItems,
  users,
  taskColumns,
  onTaskRow,
  alert: { alertTypeId, alertId },
}) {
  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  async function showUsers() {
    await dispatch({
      type: 'alertCenter/fetchAssignUsers',
      payload: {
        alertItemIds: selectedRows.map(item => item.ALERT_ITEM_ID),
      },
    });
    setVisible(true);
  }

  async function handleAssignUser(userId) {
    await dispatch({
      type: 'alertCenter/assignTask',
      payload: {
        userId,
        taskIds: selectedRows.map(item => item.TASK_ID),
        alertTypeId,
        alertId,
      },
    });
    setVisible(false);
  }
  return (
    <div className={styles['task-container']}>
      <AlertTaskModal
        loading={loading}
        visible={visible}
        users={users}
        handleCancel={() => setVisible(false)}
        assignUser={handleAssignUser}
      />
      <div className={styles.btns}>
        <button type="button" disabled={!selectedRows.length} onClick={showUsers}>
          {loading['alertCenter/fetchAssignUsers'] ? (
            <Icon type="loading" className={styles['btn-icon']} />
          ) : (
            <IconFont type="iconicon_assign-copy" className={styles['btn-icon']} />
          )}
          <FormattedMessage id="alert-center.assign" />
        </button>
      </div>
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
          onChange: (selectedRowKeys, rows) => {
            setSelectedRows(rows);
          },
        }}
        onRow={record => ({
          onClick() {
            onTaskRow(record);
          },
        })}
        columns={[
          {
            dataIndex: 'MARKET',
            title: formatMessage({ id: 'alert-center.market' }),
          },
          ...taskColumns,
          {
            dataIndex: 'USER_NAME',
            title: formatMessage({ id: 'alert-center.owner' }),
          },
          {
            dataIndex: 'TASK_STATUS_DESC',
            title: formatMessage({ id: 'alert-center.status' }),
          },
          {
            dataIndex: 'action',
            title: <FormattedMessage id="alert-center.actions" />,
            render: (text, record) => {
              const isEnd = 0;
              return (
                <Link
                  disabled={!record.USER_NAME}
                  to={`/homepage/Approval-Process-Center?taskCode=${record.TASK_ID}&isEnd=${isEnd}`}
                  title={formatMessage({ id: 'alert-center.enter-workflow' })}
                >
                  <FormattedMessage id="alert-center.enter-workflow" />
                </Link>
              );
            },
          },
        ]}
      />
    </div>
  );
}

export default connect(({ loading, alertCenter: { users, alertItems } }) => ({
  users,
  alertItems,
  loading: loading.effects,
}))(AlertTask);
