import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Divider, Modal, Spin } from 'antd';
import TaskDetailCharts from './JobDetailCharts';
import TaskDetailBatch from './JobDetailBatch';
import styles from './index.less';

const { Column } = Table;

function Loading({ visible, children }) {
  return <Spin spinning={!!visible}>{children}</Spin>;
}

export default function({ loading, tasks, taskPoints, eachBatches, getTasks }) {
  const [batch, setBatch] = useState({
    executeMsg: '-',
    nodeName: '-',
    memberNo: '-',
    batchNo: '-',
    startTime: '-',
    endTime: '-',
  });

  useEffect(() => {
    // default batch
    if (eachBatches.length > 0) {
      const [firstBatch] = eachBatches;
      setBatch(firstBatch);
      getTasks(firstBatch);
    }
  }, [eachBatches]);

  function getEachBatch(item) {
    setBatch(item);
    getTasks(item);
  }

  return (
    <div>
      <Loading visible={loading['tm/queryEachBatch']}>
        <TaskDetailBatch batch={batch} taskPoints={taskPoints} />
      </Loading>
      <Divider />
      <Row>
        <Loading visible={loading['tm/queryEachBatch']}>
          <TaskDetailCharts dataSource={eachBatches} getEachBatch={getEachBatch} />
        </Loading>
        <Divider />
        <Row>
          <Col span={5}>作业批次：{batch.batchNo}</Col>
          <Col span={6}>开始时间：{batch.startTimeFormat}</Col>
          <Col span={6}>结束时间：{batch.endTimeFormat}</Col>
          <Col span={3}>错误数：{batch.errorNum}</Col>
          <Col span={3}>执行类型：{batch.executeTypeName}</Col>
          <Col>111</Col>
        </Row>
        <Table
          rowKey="nodeName"
          dataSource={tasks}
          scroll={{ x: '100%' }}
          pagination={false}
          defaultExpandAllRows
          loading={loading['tm/queryTasksOfJob']}
        >
          <Column title="节点" ellipsis dataIndex="nodeName" width={120} />
          <Column title="任务名称" ellipsis dataIndex="jobname" width={150} />
          <Column title="任务名称" dataIndex="memberTypeName" width={100} />
          <Column title="删除" dataIndex="deleteNum" width={50} />
          <Column title="插入" dataIndex="insertNum" width={50} />
          <Column title="开始时间" dataIndex="startTime" width={150} />
          <Column title="执行时长" dataIndex="zxsj" width={100} />
          <Column title="执行状态" dataIndex="executeFlagName" width={100} />
          <Column
            ellipsis
            title="执行信息(点击显示全部信息)"
            dataIndex="executeMsg"
            width={200}
            className={styles.pointer}
            onCell={record => ({
              onClick() {
                const msg = record.executeMsg.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;');
                Modal.warn({
                  title: '查看日志',
                  width: '60%',
                  maxHeight: 200,
                  content: (
                    <div
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: msg }}
                    />
                  ),
                });
              },
            })}
          />
        </Table>
      </Row>
    </div>
  );
}
