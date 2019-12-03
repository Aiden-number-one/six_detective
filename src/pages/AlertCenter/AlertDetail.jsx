import React from 'react';
import { Tabs, Descriptions, Row, Col, Switch } from 'antd';
import { FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import styles from './index.less';

const { TabPane } = Tabs;

export function AlertDes({
  alert: {
    alertId,
    alertType,
    tradeDate,
    alertTimestamp,
    submissionTime,
    submitter,
    status,
    owner,
    description,
    handleToday,
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
        {alertTimestamp}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.submission-time" />}>
        {submissionTime}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.submitter" />}>
        {submitter}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.description" />}>
        {description}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.owner" />}>
        {owner}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.status" />}>
        {status}
      </Descriptions.Item>
      <Descriptions.Item label={<FormattedMessage id="alert-center.handle-today" />}>
        <Switch checkedChildren="YES" unCheckedChildren="NO" defaultChecked={!!handleToday} />
      </Descriptions.Item>
    </Descriptions>
  );
}

function AlertComments({ comments }) {
  return (
    <ul className={styles['comment-ul']}>
      {comments.map(({ time, text, attachments }) => (
        <li key={`${time}-${text}`}>
          <Row>
            <Col span={18}>{time}</Col>
            <Col span={5} offset={1}>
              {attachments && attachments.length}
            </Col>
          </Row>
          <Row>{text}</Row>
        </li>
      ))}
    </ul>
  );
}

export default function({ alert }) {
  return (
    <Row className={styles['detail-container']}>
      <Col span={14}>
        <Tabs
          defaultActiveKey="1"
          className={styles['detail-des']}
          tabBarExtraContent={<IconFont type="iconfull-screen" className={styles.fullscreen} />}
        >
          <TabPane
            className={styles['tab-content']}
            tab={<FormattedMessage id="alert-center.alert-detail" />}
            key="1"
          >
            <AlertDes alert={alert} />
          </TabPane>
          <TabPane
            className={styles['tab-content']}
            tab={<FormattedMessage id="alert-center.alert-item-list" />}
            key="2"
          >
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </Col>
      <Col span={9} offset={1} style={{ backgroundColor: '#fff' }}>
        <Tabs defaultActiveKey="1" className={styles['detail-comment']}>
          <TabPane tab={<FormattedMessage id="alert-center.comment-history" />} key="1">
            {alert.comments && alert.comments.length && <AlertComments comments={alert.comments} />}
          </TabPane>
          <TabPane
            className={styles['tab-content']}
            tab={<FormattedMessage id="alert-center.alert-lifecycle" />}
            key="2"
          >
            lifecycle
          </TabPane>
        </Tabs>
      </Col>
      ,{/* <FormattedMessage id="alert-center.attachment-des" values={{ count: 7, size: 18 }} /> */}
    </Row>
  );
}
