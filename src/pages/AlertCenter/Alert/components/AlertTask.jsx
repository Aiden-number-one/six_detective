import React, { useState } from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '@/pages/AlertCenter/index.less';
import AlertTaskModal from './AlertTaskModal';
import AlertTaskOfEp from './AlertTaskOfEp';
import AlertTaskOfProduct from './AlertTaskOfProduct';
import AlertTaskOfCa from './AlertTaskOfCa';

function AlertTask({ dispatch, loading, alert: { alertTypeId }, alertItems, users }) {
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

  async function handleAssignUser(userId) {
    await dispatch({
      type: 'alertCenter/assignTask',
      payload: {
        userId,
        taskIds: selectedRows.map(item => item.TASK_ID),
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
      <Button style={{ marginBottom: 10 }} disabled={!selectedRows.length} onClick={showUsers}>
        <FormattedMessage id="alert-center.assign" />
      </Button>
      {alertTypeId === '301' && (
        <AlertTaskOfEp
          dataSource={alertItems}
          loading={loading}
          getSelectedRows={rows => setSelectedRows(rows)}
        />
      )}
      {alertTypeId === '302' && (
        <AlertTaskOfProduct
          dataSource={alertItems}
          loading={loading}
          getSelectedRows={rows => setSelectedRows(rows)}
        />
      )}
      {alertTypeId === '303' && (
        <AlertTaskOfCa
          dataSource={alertItems}
          loading={loading}
          getSelectedRows={rows => setSelectedRows(rows)}
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
