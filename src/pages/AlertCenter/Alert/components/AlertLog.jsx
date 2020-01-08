import React from 'react';
import { Row, Col, Typography } from 'antd';
import moment from 'moment';
import { timestampFormat } from '@/pages/DataImportLog/constants';

const { Paragraph } = Typography;

export default function({ log: { operateTime, log } }) {
  return (
    <Row>
      <Col span={11}>{moment(operateTime).format(timestampFormat)}</Col>
      <Col span={12} offset={1}>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{log}</Paragraph>
      </Col>
    </Row>
  );
}
