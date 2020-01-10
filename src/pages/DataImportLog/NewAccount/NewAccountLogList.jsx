import React, { useState } from 'react';
import { Table, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import IconFont from '@/components/IconFont';
import { timestampFormat, pageSizeOptions } from '../constants';
import { statusMap } from '../Market/MarketLogList';

const { Column } = Table;

export default function NewAccountLogList({
  dataSource,
  loading,
  page: current,
  total,
  onPageChange,
  onPageSizeChange,
  onDownload,
}) {
  const [curImpId, setImpId] = useState('');

  async function handleClick(id) {
    setImpId(id);
    await onDownload(id);
  }
  return (
    <Table
      dataSource={dataSource}
      loading={loading['newAccount/fetch']}
      rowKey="lopImpId"
      pagination={{
        current,
        total,
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
        width="8%"
        align="center"
        dataIndex="market"
        title={<FormattedMessage id="data-import.market" />}
      />
      <Column
        align="center"
        dataIndex="submitterCode"
        title={<FormattedMessage id="data-import.submitter-code" />}
      />
      <Column
        ellipsis
        width="24%"
        dataIndex="fileName"
        title={<FormattedMessage id="data-import.submission-report" />}
      />
      <Column
        align="center"
        dataIndex="submissionStatus"
        title={<FormattedMessage id="data-import.submission-status" />}
        render={(text, record) => {
          const des = record.statusMark;
          if ([0, 1, 2, 8, 9].includes(+text)) {
            const Status = statusMap[+text];
            return <Status des={des} />;
          }
          return des;
        }}
      />
      <Column
        align="center"
        dataIndex="submissionTime"
        title={<FormattedMessage id="data-import.submission-date" />}
        render={text => moment(text, 'YYYYMMDDhhmmss').format(timestampFormat)}
      />
      <Column
        align="center"
        dataIndex="download"
        title={<FormattedMessage id="data-import.download" />}
        render={(text, { lopImpId }) => (
          <>
            {loading['lop/fetchReportUrl'] && lopImpId === curImpId ? (
              <Icon type="loading" />
            ) : (
              <IconFont
                type="icondownload"
                onClick={() => handleClick(lopImpId)}
                style={{ fontSize: 24, cursor: 'pointer' }}
              />
            )}
          </>
        )}
      />
    </Table>
  );
}
