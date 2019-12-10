import React from 'react';
import { Col, Typography } from 'antd';

const { Paragraph } = Typography;

export default function({ log: { operateTime, log } }) {
  return (
    <>
      <Col span={8}>{operateTime}</Col>
      <Col span={16}>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{log}</Paragraph>
      </Col>
    </>
  );
}
