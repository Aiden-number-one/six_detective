import React from 'react';
import { Tabs, Row, Col } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from '../index.less';

const { TabPane } = Tabs;

export default function() {
  return (
    <Row className={styles['detail-container']} gutter={16}>
      <Col span={16}>
        <Tabs defaultActiveKey="1" className={styles['detail-des']}>
          <TabPane
            className={styles['tab-content']}
            tab={<FormattedMessage id="alert-center.information-detail" />}
            key="1"
          >
            detail
          </TabPane>
        </Tabs>
      </Col>
      <Col span={8}>
        <Tabs defaultActiveKey="1" className={styles['detail-comment']}>
          <TabPane tab={<FormattedMessage id="alert-center.comment-history" />} key="1">
            123
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}
