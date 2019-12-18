import React from 'react';
import { Descriptions, Typography } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { dateFormat, timestampFormat } from '@/pages/DataImportLog/constants';

const { Paragraph } = Typography;

export default function({
  alert: {
    alertId,
    alertType,
    alertStatusDesc,
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
      <Descriptions.Item label={<FormattedMessage id="alert-center.alert-id" />}>
        {alertId}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.alert-type" />}>
        {alertType}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.trade-date" />}>
        {moment(tradeDate).format(dateFormat)}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.alert-timestamp" />}>
        {moment(alertTime).format(timestampFormat)}
      </Descriptions.Item>
      {submissionTime && (
        <Descriptions.Item label={<FormattedMessage id="alert-center.submission-time" />}>
          {moment(submissionTime).format(timestampFormat)}
        </Descriptions.Item>
      )}
      {submitter && (
        <Descriptions.Item label={<FormattedMessage id="alert-center.submitter" />}>
          {submitter}
        </Descriptions.Item>
      )}
      <Descriptions.Item label={<FormattedMessage id="alert-center.description" />}>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{alertDesc}</Paragraph>
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.owner" />}>
        {userName}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.status" />}>
        {alertStatusDesc}
      </Descriptions.Item>
    </Descriptions>
  );
}
