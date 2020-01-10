import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { connect } from 'dva';
import { Icon, Table } from 'antd';
import styles from '@/pages/AlertCenter/index.less';
import IconFont from '@/components/IconFont';
import AlertTaskModal from './AlertTaskModal';

export const TaskBtn = ({ task }) => {
  const localUserName = localStorage.getItem('loginName');
  const isDisabled = !task.USER_NAME || localUserName !== task.USER_NAME;
  const isEnd = task.TASK_STATUS === 'A' ? 1 : 0;
  return (
    <Link
      disabled={isDisabled}
      to={`/homepage/Approval-Process-Center?taskCode=${task.TASK_ID}&isEnd=${isEnd}`}
      title={formatMessage({ id: 'alert-center.enter-approval' })}
    >
      <FormattedMessage id="alert-center.enter-approval" />
    </Link>
  );
};

function AlertTask({ dispatch, loading, alertItems, users, taskColumns, onTaskRow, alert }) {
  const [visible, setVisible] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  useEffect(() => {
    const { alertTypeId, alertId, itemsTotal } = alert;
    // no items
    if (+itemsTotal !== 0) {
      dispatch({
        type: 'alertCenter/fetchAlertItems',
        payload: {
          alertTypeId,
          alertId,
        },
      });
    }
  }, [alert]);

  // default selected that just one task
  useEffect(() => {
    if (alertItems.length === 1) {
      setSelectedTaskIds(alertItems.map(item => item.TASK_ID));
    }
  }, [alertItems]);

  async function showUsers() {
    await dispatch({
      type: 'alertCenter/fetchAssignUsers',
      payload: {
        taskIds: selectedTaskIds,
      },
    });
    setVisible(true);
  }

  async function handleAssignUser(userId) {
    await dispatch({
      type: 'alertCenter/assignTask',
      payload: {
        userId,
        taskIds: selectedTaskIds,
        alertTypeId: alert.alertTypeId,
        alertId: alert.alertId,
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
        <button type="button" disabled={!selectedTaskIds.length} onClick={showUsers}>
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
        rowKey="TASK_ID"
        scroll={{ y: 320 }}
        loading={loading['alertCenter/fetchAlertItems']}
        pagination={{
          showSizeChanger: true,
          showTotal(count) {
            return `Total ${count} items`;
          },
        }}
        rowSelection={{
          selectedRowKeys: selectedTaskIds,
          onChange: selectedRowKeys => {
            setSelectedTaskIds(selectedRowKeys);
          },
        }}
        onRow={record => ({
          onClick() {
            onTaskRow(record);
          },
        })}
        columns={[
          {
            width: 80,
            align: 'center',
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
            width: 120,
            align: 'center',
            dataIndex: 'action',
            title: <FormattedMessage id="alert-center.actions" />,
            render: (text, record) => <TaskBtn task={record} />,
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
