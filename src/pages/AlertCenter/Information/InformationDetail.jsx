import React from 'react';
import { Tabs, Row, Col, Divider } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { timestampFormat } from '@/pages/DataImportLog/constants';
import styles from '../index.less';

const { TabPane } = Tabs;

export default function({ info: { informationType, market, timestamp, informationDetail } }) {
  return (
    <Row className={`${styles['detail-container']} ${styles['info-detail']}`}>
      <Tabs type="card" defaultActiveKey="1">
        <TabPane key="1" tab={<FormattedMessage id="alert-center.information-detail" />}>
          <Row>{informationType}</Row>
          <Row type="flex" justify="space-between">
            <Col>{market}</Col>
            <Col>{moment(timestamp).format(timestampFormat)}</Col>
          </Row>
          <Divider style={{ margin: '6px 0' }} />
          <Row className={styles['info-content']}>{informationDetail}</Row>
        </TabPane>
      </Tabs>
    </Row>
  );
}
