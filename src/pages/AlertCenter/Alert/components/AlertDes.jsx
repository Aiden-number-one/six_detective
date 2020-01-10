import React from 'react';
import { Typography } from 'antd';
import moment from 'moment';
import { dateFormat, timestampFormat } from '@/pages/DataImportLog/constants';
import { GrDescriptions } from './index';

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
    <GrDescriptions colon>
      <GrDescriptions.Item label="Alert ID">{alertNo}</GrDescriptions.Item>
      <GrDescriptions.Item label="Alert Name">{alertName}</GrDescriptions.Item>
      <GrDescriptions.Item label="Alert Type">{alertType}</GrDescriptions.Item>
      {tradeDate && (
        <GrDescriptions.Item label="Trade Date">
          {moment(tradeDate).format(dateFormat)}
        </GrDescriptions.Item>
      )}
      <GrDescriptions.Item label="Alert Timestamp">
        {moment(alertTime, timestampFormat).format(timestampFormat)}
      </GrDescriptions.Item>
      {submissionTime && (
        <GrDescriptions.Item label="Submission Time">
          {moment(submissionTime).format(timestampFormat)}
        </GrDescriptions.Item>
      )}
      {submitter && <GrDescriptions.Item label="Submitter">{submitter}</GrDescriptions.Item>}
      <GrDescriptions.Item label="Alert Description">
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{alertDesc}</Paragraph>
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Alert Owner">{userName}</GrDescriptions.Item>
    </GrDescriptions>
  );
}
