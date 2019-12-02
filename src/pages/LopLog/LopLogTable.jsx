import React from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'umi/locale';

const { Column } = Table;

export default function({ dataSource }) {
  return (
    <Table dataSource={dataSource}>
      <Column dataIndex="tradeDate" title={<FormattedMessage id="data-import.lop.trade-date" />} />
      <Column
        dataIndex="submitterCode"
        title={<FormattedMessage id="data-import.lop.submitter-code" />}
      />
      <Column
        dataIndex="submitterName"
        title={<FormattedMessage id="data-import.lop.submitter-name" />}
      />
      <Column
        dataIndex="submissionReport"
        title={<FormattedMessage id="data-import.lop.submission-report" />}
      />
      <Column
        dataIndex="submissionChannel"
        title={<FormattedMessage id="data-import.lop.submission-channel" />}
      />
      <Column
        dataIndex="submissionDate"
        title={<FormattedMessage id="data-import.lop.submission-date" />}
      />
      <Column
        dataIndex="submissionStatus"
        title={<FormattedMessage id="data-import.lop.submission-status" />}
      />
      <Column
        dataIndex="late-submission"
        title={<FormattedMessage id="data-import.lop.late-submission" />}
      />
      <Column
        dataIndex="latestVersion"
        title={<FormattedMessage id="data-import.lop.latest-version" />}
      />
      <Column
        dataIndex="arrivalTime"
        title={<FormattedMessage id="data-import.lop.arrival-time" />}
      />
      <Column
        dataIndex="processingStatus"
        title={<FormattedMessage id="data-import.lop.processing-status" />}
      />
      <Column dataIndex="download" title={<FormattedMessage id="data-import.lop.download" />} />
    </Table>
  );
}
