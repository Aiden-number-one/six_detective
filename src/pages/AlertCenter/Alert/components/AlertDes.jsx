import React from 'react';
import { Descriptions, Typography } from 'antd';
import moment from 'moment';
import { dateFormat, timestampFormat } from '@/pages/DataImportLog/constants';

const { Paragraph } = Typography;

export default function({
  alert: {
    alertNo,
    alertType,
    alertName,
    alertTime,
    alertDesc,
    tradeDate,
    submissionTime,
    submitter,
    userName,
  },
}) {
  return (
    <Descriptions column={1}>
      <Descriptions.Item label="Alert ID">{alertNo}</Descriptions.Item>
      <Descriptions.Item label="Alert Name">{alertName}</Descriptions.Item>
      <Descriptions.Item label="Alert Type">{alertType}</Descriptions.Item>
      {tradeDate && (
        <Descriptions.Item label="Trade Date">
          {moment(tradeDate).format(dateFormat)}
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Alert Timestamp">
        {moment(alertTime, timestampFormat).format(timestampFormat)}
      </Descriptions.Item>
      {submissionTime && (
        <Descriptions.Item label="Submission Time">
          {moment(submissionTime).format(timestampFormat)}
        </Descriptions.Item>
      )}
      {submitter && <Descriptions.Item label="Submitter">{submitter}</Descriptions.Item>}
      <Descriptions.Item label="Alert Description">
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{alertDesc}</Paragraph>
      </Descriptions.Item>
      <Descriptions.Item label="Alert Owner">{userName}</Descriptions.Item>
    </Descriptions>
  );
}
