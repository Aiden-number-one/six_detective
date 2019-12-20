import React from 'react';
import { Table /* Descriptions */ } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import Link from 'umi/link';

const { Column } = Table;

export function WorkflowBtn({ record }) {
  return (
    <Link
      disabled={!record.USER_NAME}
      to="/alert-management/Approval-Process-Center"
      title={formatMessage({ id: 'alert-center.enter-workflow' })}
    >
      <FormattedMessage id="alert-center.enter-workflow" />
    </Link>
  );
}

export default function({ dataSource, loading, getSelectedRows }) {
  return (
    <Table
      border
      dataSource={dataSource}
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
        onChange: (selectedRowKeys, selectedRows) => {
          getSelectedRows(selectedRows);
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
        title={<FormattedMessage id="alert-center.actions" />}
        render={(text, record) => <WorkflowBtn record={record} />}
      />
    </Table>
  );
}
