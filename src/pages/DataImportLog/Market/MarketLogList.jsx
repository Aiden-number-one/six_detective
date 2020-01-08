import React from 'react';
import { Table, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { dateFormat, timestampFormat, pageSizeOptions, channelMap } from '../constants';

const { Column } = Table;

const IconStatus = ({ type, color, des }) => (
  <Icon type={type} style={{ color, fontSize: 16 }} title={des} />
);

export const statusMap = {
  1: ({ des }) => <IconStatus type="loading" color="#009cff" des={des} />,
  2: ({ des }) => <IconStatus type="check-circle" color="#3b803e" des={des} />,
  9: ({ des }) => <IconStatus type="close-circle" color="#e6344a" des={des} />,
};

export default function({
  dataSource,
  loading,
  page: current,
  total,
  onPageChange,
  onPageSizeChange,
}) {
  return (
    <Table
      dataSource={dataSource}
      loading={loading}
      rowKey="mdImpId"
      pagination={{
        total,
        current,
        pageSizeOptions,
        showSizeChanger: true,
        showTotal(count) {
          return `Total ${count} items`;
        },
        onChange(page, pageSize) {
          onPageChange(page, pageSize);
        },
        onShowSizeChange(page, pageSize) {
          onPageSizeChange(page, pageSize);
        },
      }}
    >
      <Column
        align="center"
        dataIndex="tradeDate"
        title={<FormattedMessage id="data-import.trade-date" />}
        render={text => moment(text).format(dateFormat)}
      />
      <Column
        width={100}
        align="center"
        dataIndex="market"
        title={<FormattedMessage id="data-import.market" />}
      />
      <Column
        width={100}
        dataIndex="fileType"
        title={<FormattedMessage id="data-import.file-type" />}
      />
      <Column
        align="center"
        dataIndex="uploadDate"
        title={<FormattedMessage id="data-import.submission-date" />}
        render={text => moment(text, 'YYYYMMDDhhmmss').format(timestampFormat)}
      />
      <Column
        align="center"
        dataIndex="uploadChannel"
        title={<FormattedMessage id="data-import.submission-channel" />}
        render={text => channelMap[text]}
      />
      <Column
        align="center"
        dataIndex="status"
        title={<FormattedMessage id="data-import.submission-status" />}
        render={(text, record) => {
          const des = record.statusMark;
          if ([1, 2, 9].includes(+text)) {
            const Status = statusMap[+text];
            return <Status des={des} />;
          }
          return des;
        }}
      />
      <Column
        ellipsis
        dataIndex="description"
        title={<FormattedMessage id="data-import.market.description" />}
      />
    </Table>
  );
}
