import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Divider, Modal, Spin } from 'antd';
import TaskDetailCharts from './JobDetailCharts';
import TaskDetailBatch from './JobDetailBatch';
import styles from './index.less';

const { Column } = Table;

function Loading({ visible, children }) {
  return <Spin spinning={!!visible}>{children}</Spin>;
}

function TaskTable({ loading, tasks }) {
  return (
    <Table
      rowKey="nodeName"
      dataSource={tasks}
      scroll={{ x: '100%', y: 400 }}
      pagination={false}
      loading={loading}
      defaultExpandAllRows
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
  );
}
function FlowFrame({ visible, batch, onload }) {
  return (
    <Loading visible={visible}>
      <iframe
        title="flow chart"
        src={`http://10.60.69.69:9070/kweb/retl/monitor.html?jobId=${batch.jobId}&batchNo=${batch.batchNo}`}
        frameBorder="0"
        width="100%"
        height={400}
        onLoad={onload}
      />
    </Loading>
  );
}

export default function({ loading, tasks, taskPoints, eachBatches, getTasks }) {
  const [isTable, setTableState] = useState(true);
  const [isFullScreen, setFullScreen] = useState(false);
  const [isIframeLoading, setFrameLoading] = useState(true);

  const [batch, setBatch] = useState({
    executeMsg: '-',
    nodeName: '-',
    memberNo: '-',
    batchNo: '-',
    errorNum: 0,
    startTimeFormat: '-',
    endTimeFormat: '-',
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

  function handleToggle() {
    setTableState(!isTable);
    if (!isTable) {
      setFrameLoading(true);
    }
  }
  return (
    <>
      <Loading visible={loading['tm/queryEachBatch']}>
        <Row type="flex" align="middle">
          <TaskDetailBatch batch={batch} taskPoints={taskPoints} />
        </Row>
        <Divider />
        <Row>
          <TaskDetailCharts dataSource={eachBatches} getEachBatch={getEachBatch} />
        </Row>
      </Loading>
      <Divider />
      <div className={isFullScreen ? styles.fullscreen : ''}>
        <Row style={{ margin: '20px 0', fontSize: 12 }}>
          <Col span={5}>作业批次：{batch.batchNo}</Col>
          <Col span={6}>开始时间：{batch.startTimeFormat}</Col>
          <Col span={6}>结束时间：{batch.endTimeFormat}</Col>
          <Col span={2}>错误数：{batch.errorNum}</Col>
          <Col span={3}>执行类型：{batch.executeTypeName}</Col>
          <Col span={2} align="right">
            <a onClick={handleToggle}>切换</a>
            <Divider type="vertical" />
            <a onClick={() => setFullScreen(!isFullScreen)}>全屏</a>
          </Col>
        </Row>
        {isTable ? (
          <TaskTable loading={loading['tm/queryTasksOfJob']} tasks={tasks} />
        ) : (
          <FlowFrame
            visible={isIframeLoading}
            batch={batch}
            onload={() => setFrameLoading(false)}
          />
        )}
      </div>
    </>
  );
}
