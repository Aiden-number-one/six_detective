import React from 'react';
import { Table, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { dateFormat, timestampFormat } from '../constants';

const { Column } = Table;

const statusMap = {
  0: '',
  1: '',
  2: () => <Icon type="check-circle" style={{ color: '#3b803e', fontSize: 16 }} />,
  9: () => <Icon type="close-circle" style={{ color: '#e6344a', fontSize: 16 }} />,
};

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
        title={<FormattedMessage id="data-import.trade-date" />}
        render={(text, record) => moment(record.tradeDate).format(dateFormat)}
      />
      <Column
        align="center"
        dataIndex="market"
        title={<FormattedMessage id="data-import.market" />}
      />
      <Column dataIndex="fileType" title={<FormattedMessage id="data-import.market.file-type" />} />
      <Column
        align="center"
        dataIndex="uploadDate"
        title={<FormattedMessage id="data-import.market.upload-date" />}
        render={(text, record) =>
          moment(record.uploadDate, 'YYYYMMDDhhmmss').format(timestampFormat)
        }
      />
      <Column
        align="center"
        dataIndex="uploadChannel"
        title={<FormattedMessage id="data-import.market.upload-channel" />}
      />
      <Column
        align="center"
        dataIndex="status"
        title={<FormattedMessage id="data-import.market.status" />}
        render={(text, record) => {
          if (record.status === '2' || record.status === '9') {
            const Status = statusMap[record.status];
            return <Status />;
          }
          return record.statusMark;
        }}
      />
      <Column
        dataIndex="description"
        title={<FormattedMessage id="data-import.market.description" />}
      />
    </Table>
  );
}
