import React from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'umi/locale';

const { Column } = Table;

export default function({ dataSource, loading, getSelectedRows, renderAction }) {
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
        ellipsis
        align="center"
        dataIndex="PRODUCT_CODE"
        title={<FormattedMessage id="alert-center.product-code" />}
      />
      <Column
        ellipsis
        dataIndex="PRODUCT_CATEGROY"
        title={<FormattedMessage id="alert-center.product-category" />}
      />
      <Column dataIndex="USER_NAME" title={<FormattedMessage id="alert-center.owner" />} />
      <Column
        ellipsis
        align="center"
        dataIndex="TASK_STATUS_DESC"
        title={<FormattedMessage id="alert-center.status" />}
      />
      {renderAction()}
    </Table>
  );
}
