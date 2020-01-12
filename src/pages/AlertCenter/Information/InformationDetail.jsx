import React from 'react';
import { Tabs, Row, Col, Divider } from 'antd';
import { FormattedMessage } from 'umi/locale';
import classNames from 'classnames';
import moment from 'moment';
import { timestampFormat } from '@/pages/DataImportLog/constants';
import styles from '../index.less';

const { TabPane } = Tabs;

export default function({ info: { informationType, market, timestamp, informationDetail } }) {
  return (
    <Row className={styles['detail-container']} gutter={16}>
      <Col span={24}>
        <Tabs defaultActiveKey="1" className={classNames(styles['detail-des'], styles['info-des'])}>
          <TabPane
            className={styles['tab-content']}
            style={{ overflow: 'hidden' }}
            tab={<FormattedMessage id="alert-center.information-detail" />}
            key="1"
          >
            <Row>{informationType}</Row>
            <Row type="flex" justify="space-between">
              <Col>{market}</Col>
              <Col>{moment(timestamp).format(timestampFormat)}</Col>
            </Row>
            <Divider style={{ margin: '6px 0' }} />
            <Row className={styles['info-content']}>{informationDetail}</Row>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}
