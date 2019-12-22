import React from 'react';
import { Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Paragraph } = Typography;

export default function({ log: { operateTime, operateMsg } }) {
  const time = moment(operateTime).format('DD-MMM-YYYY HH:mm:ss');
  return (
    <Row>
      <Col span={11}>{time}</Col>
      <Col span={12} offset={1}>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{operateMsg}</Paragraph>
      </Col>
    </Row>
  );
}
