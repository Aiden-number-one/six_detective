import React from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { dateFormat, timestampFormat } from '../constants';

const { Column } = Table;

export default function({ dataSource, loading, total, handlePageChange, handlePageSizeChange }) {
  return (
    <Table
      dataSource={dataSource}
      loading={loading}
      rowKey="mdImpId"
      pagination={{
        total,
        pageSizeOptions: ['10', '20', '50', '100'],
        showSizeChanger: true,
        showTotal(count) {
          return `Total ${count} items`;
        },
        onChange(page, pageSize) {
          handlePageChange(page, pageSize);
        },
        onShowSizeChange(page, pageSize) {
          handlePageSizeChange(page, pageSize);
        },
      }}
    >
      <Column
        align="center"
        dataIndex="tradeDate"
        title={<FormattedMessage id="data-import.market.trade-date" />}
        render={(text, record) => moment(record.tradeDate).format(dateFormat)}
      />
      <Column
        align="center"
        dataIndex="market"
        title={<FormattedMessage id="data-import.market.market" />}
      />
      <Column dataIndex="fileType" title={<FormattedMessage id="data-import.market.file-type" />} />
      <Column
        dataIndex="uploadDate"
        title={<FormattedMessage id="data-import.market.upload-date" />}
        render={(text, record) => moment(record.uploadDate).format(timestampFormat)}
      />
      <Column
        align="center"
        dataIndex="uploadChannel"
        title={<FormattedMessage id="data-import.market.upload-channel" />}
      />
      <Column dataIndex="statusMark" title={<FormattedMessage id="data-import.market.status" />} />
      <Column
        dataIndex="description"
        title={<FormattedMessage id="data-import.market.description" />}
      />
    </Table>
  );
}
