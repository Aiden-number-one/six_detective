import React from 'react';
import { Descriptions, Typography } from 'antd';
import { FormattedMessage } from 'umi/locale';

const { Paragraph } = Typography;

export default function({
  alert: {
    alertId,
    alertType,
    alertStatus,
    alertTime,
    alertDesc,
    tradeDate,
    submissionTime,
    submitter,
    owner,
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
        {tradeDate}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.alert-timestamp" />}>
        {alertTime}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.submission-time" />}>
        {submissionTime}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.submitter" />}>
        {submitter}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.description" />}>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{alertDesc}</Paragraph>
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.owner" />}>
        {owner}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.status" />}>
        {alertStatus}
      </Descriptions.Item>
    </Descriptions>
  );
}
