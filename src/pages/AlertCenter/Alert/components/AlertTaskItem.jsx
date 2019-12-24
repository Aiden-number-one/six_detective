import React from 'react';
import { Descriptions } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { dateFormat, timestampFormat } from '@/pages/DataImportLog/constants';

export function EpTaskItem({
  task: {
    alertId,
    alertType,
    alertStatusDesc,
    alertTime,
    tradeDate,
    submissionTime,
    submitter,
    userName,
  },
}) {
  return (
    <Descriptions column={1}>
      <Descriptions.Item label="Alert No">{alertId}</Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.alert-type" />}>
        {alertType}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.trade-date" />}>
        {moment(tradeDate).format(dateFormat)}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.alert-timestamp" />}>
        {moment(alertTime, timestampFormat).format(timestampFormat)}
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
      <Descriptions.Item label="Alert Owner">{userName}</Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.status" />}>
        {alertStatusDesc}
      </Descriptions.Item>
    </Descriptions>
  );
}
export function ProductTaskItem({
  task: {
    alertId,
    alertType,
    alertStatusDesc,
    alertTime,
    tradeDate,
    submissionTime,
    submitter,
    userName,
  },
}) {
  return (
    <Descriptions column={1}>
      <Descriptions.Item label="Alert No">{alertId}</Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.alert-type" />}>
        {alertType}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.trade-date" />}>
        {moment(tradeDate).format(dateFormat)}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.alert-timestamp" />}>
        {moment(alertTime, timestampFormat).format(timestampFormat)}
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
      <Descriptions.Item label="Alert Owner">{userName}</Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.status" />}>
        {alertStatusDesc}
      </Descriptions.Item>
    </Descriptions>
  );
}
export function CaCodeTaskItem({
  task: {
    alertId,
    alertType,
    alertStatusDesc,
    alertTime,
    tradeDate,
    submissionTime,
    submitter,
    userName,
  },
}) {
  return (
    <Descriptions column={1}>
      <Descriptions.Item label="Alert No">{alertId}</Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.alert-type" />}>
        {alertType}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.trade-date" />}>
        {moment(tradeDate).format(dateFormat)}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.alert-timestamp" />}>
        {moment(alertTime, timestampFormat).format(timestampFormat)}
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
      <Descriptions.Item label="Alert Owner">{userName}</Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.status" />}>
        {alertStatusDesc}
      </Descriptions.Item>
    </Descriptions>
  );
}
