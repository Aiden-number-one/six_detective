import React, { useState } from 'react';
import { Row, Col, Icon } from 'antd';
import TaskConfigModal from './JobConfigModal';

export default function({ batch, taskPoints }) {
  const [cfgVisible, setCfgVisible] = useState(true);
  function handleTaskConfig() {
    setCfgVisible(true);
  }

  return (
    <>
      <TaskConfigModal
        visible={cfgVisible}
        taskPoints={taskPoints}
        batch={batch}
        onCancelModal={() => setCfgVisible(false)}
      />
      <Col span={8}>
        <Row type="flex" align="middle">
          <Col span={12}>{batch.executeMsg}</Col>
          <Col span={12}>
            <Row>{batch.memberNo}</Row>
            <Row>{batch.nodeName}</Row>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <Row type="flex" align="middle">
          <Col span={4}>
            <Icon
              type="play-circle"
              theme="filled"
              style={{
                fontSize: 28,
                cursor: 'pointer',
              }}
              onClick={() => handleTaskConfig()}
            />
          </Col>
          <Col span={12}>时长：{batch.zxsj}</Col>
        </Row>
      </Col>
      <Col span={8}>
        <Row>开始时间：{batch.startTimeFormat}</Row>
        <Row>结束时间：{batch.endTimeFormat}</Row>
      </Col>
    </>
  );
}
