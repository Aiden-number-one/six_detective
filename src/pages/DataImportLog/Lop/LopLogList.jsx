import React from 'react';
import { Table } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';

const { Column } = Table;

const submissionReport = formatMessage({ id: 'data-import.lop.submission-report' });
const processingStatus = formatMessage({ id: 'data-import.lop.processing-status' });

export default function({ dataSource, loading, total, handlePageChange, handlePageSizeChange }) {
  return (
    <Table
      dataSource={dataSource}
      rowKey="lopImpId"
      loading={loading}
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
      {/* <Column
        align="center"
        dataIndex="latestVersion"
        title={<FormattedMessage id="data-import.lop.latest-version" />}
      /> */}
      <Column
        align="center"
        dataIndex="arrivalTime"
        title={<FormattedMessage id="data-import.lop.arrival-time" />}
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
        render={() => (
          <a href="/download?filePath=/ECP/LOPBI_00BNP_20000925_43.xlsm">
            <IconFont type="icondownload" style={{ fontSize: 24, cursor: 'pointer' }} />
          </a>
        )}
      />
    </Table>
  );
}
