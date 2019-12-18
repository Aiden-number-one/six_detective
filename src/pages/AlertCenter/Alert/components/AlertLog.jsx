import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Paragraph } = Typography;

export default function({ log: { operateTime, log } }) {
  return (
    <Row>
      <Col span={11}>{operateTime}</Col>
      <Col span={12} offset={1}>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{log}</Paragraph>
      </Col>
    </Row>
  );
}
