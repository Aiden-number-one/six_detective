import React, { useState } from 'react';
import { Table, Icon } from 'antd';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import { dateFormat, timestampFormat } from '../constants';

const { Column } = Table;

const submissionReport = formatMessage({ id: 'data-import.lop.submission-report' });
const processingStatus = formatMessage({ id: 'data-import.lop.processing-status' });

export default function({
  dataSource,
  loading,
  total,
  handlePageChange,
  handlePageSizeChange,
  handleDownload,
}) {
  const [curImpId, setImpId] = useState('');

  function handleClick(id) {
    setImpId(id);
    handleDownload(id);
  }
  return (
    <Table
      dataSource={dataSource}
      rowKey="lopImpId"
      loading={loading['lop/fetch']}
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
        width="10%"
        align="center"
        dataIndex="tradeDate"
        title={<FormattedMessage id="data-import.lop.trade-date" />}
        render={(text, record) => <span>{moment(record.tradeDate).format(dateFormat)}</span>}
      />
      <Column
        align="center"
        dataIndex="submitterCode"
        title={<FormattedMessage id="data-import.lop.submitter-code" />}
      />
      <Column
        align="center"
        dataIndex="submitterName"
        title={<FormattedMessage id="data-import.lop.submitter-name" />}
      />
      <Column
        ellipsis
        dataIndex="submissionReport"
        title={<span title={submissionReport}>{submissionReport}</span>}
      />
      <Column
        width="10%"
        align="center"
        dataIndex="submissionChannel"
        title={<FormattedMessage id="data-import.lop.submission-channel" />}
      />
      <Column
        width="10%"
        align="center"
        dataIndex="submissionDate"
        title={<FormattedMessage id="data-import.lop.submission-date" />}
        render={(text, record) => moment(record.submissionDate).format(timestampFormat)}
      />
      <Column
        width="10%"
        align="center"
        dataIndex="submissionStatus"
        title={<FormattedMessage id="data-import.lop.submission-status" />}
      />
      <Column
        width="10%"
        align="center"
        dataIndex="lateSubmission"
        title={<FormattedMessage id="data-import.lop.late-submission" />}
      />
      <Column
        align="center"
        dataIndex="latestVersion"
        title={<FormattedMessage id="data-import.lop.latest-version" />}
      />
      <Column
        ellipsis
        align="center"
        dataIndex="processingStatus"
        title={<span title={processingStatus}>{processingStatus}</span>}
      />
      <Column
        align="center"
        dataIndex="download"
        title={<FormattedMessage id="data-import.lop.download" />}
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
