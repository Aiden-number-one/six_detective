import React from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';

const { Column } = Table;

export default function({ dataSource, loading }) {
  return (
    <Table
      dataSource={dataSource}
      rowKey="tradeDate-submitterCode"
      loading={loading}
      pagination={{ showSizeChanger: true, showQuickJumper: true }}
    >
      <Column
        align="center"
        dataIndex="tradeDate"
        title={<FormattedMessage id="data-import.lop.trade-date" />}
      />
      <Column
        width={90}
        align="center"
        dataIndex="submitterCode"
        title={<FormattedMessage id="data-import.lop.submitter-code" />}
      />
      <Column
        width={100}
        align="center"
        dataIndex="submitterName"
        title={<FormattedMessage id="data-import.lop.submitter-name" />}
      />
      <Column
        ellipsis
        dataIndex="submissionReport"
        title={<FormattedMessage id="data-import.lop.submission-report" />}
      />
      <Column
        width={100}
        dataIndex="submissionChannel"
        title={<FormattedMessage id="data-import.lop.submission-channel" />}
      />
      <Column
        width={100}
        align="center"
        dataIndex="submissionDate"
        title={<FormattedMessage id="data-import.lop.submission-date" />}
      />
      <Column
        width={100}
        align="center"
        dataIndex="submissionStatus"
        title={<FormattedMessage id="data-import.lop.submission-status" />}
      />
      <Column
        width={100}
        align="center"
        dataIndex="lateSubmission"
        title={<FormattedMessage id="data-import.lop.late-submission" />}
      />
      <Column
        width={100}
        align="center"
        dataIndex="latestVersion"
        title={<FormattedMessage id="data-import.lop.latest-version" />}
      />
      <Column
        align="center"
        dataIndex="arrivalTime"
        title={<FormattedMessage id="data-import.lop.arrival-time" />}
      />
      <Column
        ellipsis
        align="center"
        dataIndex="processingStatus"
        title={<FormattedMessage id="data-import.lop.processing-status" />}
      />
      <Column
        width={90}
        align="center"
        dataIndex="download"
        title={<FormattedMessage id="data-import.lop.download" />}
        render={() => <IconFont type="icondownload" style={{ fontSize: 24, cursor: 'pointer' }} />}
      />
    </Table>
  );
}
