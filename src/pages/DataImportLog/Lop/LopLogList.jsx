import React, { useState } from 'react';
import { Table, Icon, Descriptions } from 'antd';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import { dateFormat, timestampFormat } from '../constants';
import styles from '../index.less';

const { Column } = Table;

const submissionReport = formatMessage({ id: 'data-import.lop.submission-report' });
const processingStatus = formatMessage({ id: 'data-import.lop.processing-status' });

const submissionChannelMap = {
  A: 'ECP',
  M: 'USER',
};

export default function({
  dataSource,
  loading,
  total,
  onPageChange,
  onPageSizeChange,
  onDownload,
}) {
  const [curImpId, setImpId] = useState('');

  function handleClick(id) {
    setImpId(id);
    onDownload(id);
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
          onPageChange(page, pageSize);
        },
        onShowSizeChange(page, pageSize) {
          onPageSizeChange(page, pageSize);
        },
      }}
      expandedRowRender={record => (
        <Descriptions column={3}>
          <Descriptions.Item label={<FormattedMessage id="data-import.lop.submission-channel" />}>
            {submissionChannelMap[record.submissionChannel]}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="data-import.lop.late-submission" />}>
            {record.lateSubmission}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="data-import.lop.latest-version" />}>
            {record.latestVersion}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="data-import.lop.latest-version" />}>
            {record.latestVersion}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="data-import.lop.submission-channel" />}>
            {record.submissionChannel}
          </Descriptions.Item>
          <Descriptions.Item label={submissionReport}>{record.submissionReport}</Descriptions.Item>
        </Descriptions>
      )}
    >
      <Column
        width="10%"
        align="center"
        dataIndex="tradeDate"
        title={<FormattedMessage id="data-import.trade-date" />}
        render={(text, record) => <span>{moment(record.tradeDate).format(dateFormat)}</span>}
      />
      <Column
        align="center"
        dataIndex="submitterCode"
        title={<FormattedMessage id="data-import.submitter-code" />}
      />
      <Column
        align="center"
        dataIndex="submitterName"
        title={<FormattedMessage id="data-import.lop.submitter-name" />}
      />
      <Column
        align="center"
        dataIndex="submissionDate"
        title={<FormattedMessage id="data-import.submission-date" />}
        render={(text, record) => moment(record.submissionDate).format(timestampFormat)}
      />
      <Column
        width="10%"
        align="center"
        dataIndex="submissionStatusDesc"
        title={<FormattedMessage id="data-import.submission-status" />}
      />
      <Column
        align="center"
        dataIndex="processingStatusDesc"
        title={<span title={processingStatus}>{processingStatus}</span>}
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
                className={styles['icon-download']}
                onClick={() => handleClick(lopImpId)}
              />
            )}
          </>
        )}
      />
    </Table>
  );
}
