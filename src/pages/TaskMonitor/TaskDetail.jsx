import React from 'react';
import { Row, Col, Table } from 'antd';
import TaskDetailCharts from './TaskDetailCharts';

const { Column } = Table;

export default function({ taskBatches, eachBatches }) {
  return (
    <div>
      <Row>
        <Col span={8}>123</Col>
        <Col span={8}>456</Col>
        <Col span={8}>789</Col>
      </Row>
      <Row>
        <TaskDetailCharts dataSource={eachBatches} />
      </Row>
      <Row>
        <Table
          rowKey="nodeName"
          dataSource={taskBatches}
          scroll={{ x: '100%' }}
          pagination={false}
          expandedRowRender={() => 'dafdas'}
        >
          <Column title="节点" ellipsis dataIndex="nodeName" width={120} />
          <Column title="任务名称" ellipsis dataIndex="jobname" width={150} />
          <Column title="任务名称" dataIndex="memberTypeName" width={100} />
          <Column title="删除" dataIndex="deleteNum" width={50} />
          <Column title="插入" dataIndex="insertNum" width={50} />
          <Column title="开始时间" dataIndex="startTime" width={150} />
          <Column title="执行时长" dataIndex="zxsj" width={100} />
          <Column title="执行状态" dataIndex="executeFlagName" width={100} />
          <Column title="执行信息(点击显示全部信息)" ellipsis dataIndex="executeMsg" width={200} />
        </Table>
      </Row>
    </div>
  );
}
