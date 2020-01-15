import React, { useState } from 'react';
import { Table, Icon, Descriptions } from 'antd';
import moment from 'moment';
import { FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import { statusMap } from '../Market/MarketLogList';
import { dateFormat, timestampFormat, pageSizeOptions } from '../constants';
import styles from '../index.less';

const { Column } = Table;

const submissionChannelMap = {
  A: 'ECP',
  M: 'USER',
};

export default function({
  dataSource,
  loading,
  page: current,
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
      expandedRowRender={record => (
        <Descriptions column={2}>
          <Descriptions.Item label={<FormattedMessage id="data-import.submission-channel" />}>
            {submissionChannelMap[record.submissionChannel]}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="data-import.lop.late-submission" />}>
            {record.lateSubmission}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="data-import.lop.latest-version" />}>
            {record.latestVersion}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="data-import.submission-report" />}>
            {record.submissionReport}
          </Descriptions.Item>
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
        dataIndex="submitterCode"
        title={<FormattedMessage id="data-import.submitter-code" />}
      />
      <Column
        dataIndex="submitterName"
        title={<FormattedMessage id="data-import.submitter-name" />}
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
        dataIndex="submissionStatus"
        title={<FormattedMessage id="data-import.submission-status" />}
        render={(text, record) => {
          const des = record.submissionStatusDesc;
          if ([0, 1, 2, 8, 9].includes(+text)) {
            const Status = statusMap[+text];
            return <Status des={des} />;
          }
          return des;
        }}
      />
      <Column
        align="center"
        dataIndex="processingStatusDesc"
        title={<FormattedMessage id="data-import.lop.processing-stage" />}
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
