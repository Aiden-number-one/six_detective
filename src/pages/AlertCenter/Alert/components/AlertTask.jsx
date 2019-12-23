import React, { useState } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { connect } from 'dva';
import { Icon, Table } from 'antd';
import styles from '@/pages/AlertCenter/index.less';
import IconFont from '@/components/IconFont';
import AlertTaskModal from './AlertTaskModal';
import AlertTaskOfEp from './AlertTaskOfEp';
import AlertTaskOfProduct from './AlertTaskOfProduct';
import AlertTaskOfCa from './AlertTaskOfCa';

const TaskMap = {
  301: AlertTaskOfEp,
  302: AlertTaskOfProduct,
  303: AlertTaskOfCa,
};

function AlertTask({ dispatch, loading, alert: { alertTypeId, alertId }, alertItems, users }) {
  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const AlertTaskType = TaskMap[+alertTypeId];

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
      {AlertTaskType && (
        <AlertTaskType
          dataSource={alertItems}
          loading={loading}
          getSelectedRows={rows => setSelectedRows(rows)}
          renderAction={() => (
            <Table.Column
              width="15%"
              align="center"
              dataIndex="action"
              title={<FormattedMessage id="alert-center.actions" />}
              render={(text, record) => (
                <Link
                  disabled={!record.USER_NAME}
                  to="/homepage/Approval-Process-Center"
                  title={formatMessage({ id: 'alert-center.enter-workflow' })}
                >
                  <FormattedMessage id="alert-center.enter-workflow" />
                </Link>
              )}
            />
          )}
        />
      )}
    </div>
  );
}

export default connect(({ loading, alertCenter: { users, alertItems } }) => ({
  users,
  alertItems,
  loading: loading.effects,
}))(AlertTask);
