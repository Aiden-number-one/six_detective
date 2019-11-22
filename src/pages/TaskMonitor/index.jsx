import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import AllTask from './AllTask';
import styles from './index.less';
import TaskDetail from './TaskDetail';

function TaskMonitor({ dispatch, loading, tasks, taskBatches, eachBatches }) {
  useEffect(() => {
    dispatch({
      type: 'tm/queryTasks',
    });
  }, []);

  function handleBatch(jobId, batchNo) {
    dispatch({
      type: 'tm/queryTaskBatches',
      params: {
        jobId,
        batchNo,
      },
    });
    dispatch({
      type: 'tm/queryEachBatch',
      params: {
        jobId,
      },
    });
  }

  if (loading['tm/queryTask']) {
    return <p>loading</p>;
  }

  if (tasks.length === 0) {
    return <p>暂无数据</p>;
  }

  return (
    <div className={styles.container}>
      <Row>
        <Col span={5}>
          <AllTask tasks={tasks} getTask={handleBatch} />
        </Col>
        <Col span={18} offset={1}>
          <TaskDetail taskBatches={taskBatches} eachBatches={eachBatches} />
        </Col>
      </Row>
    </div>
  );
}
const mapStateToProps = ({ loading, tm: { tasks, taskBatches, eachBatches } }) => ({
  loading: loading.effects,
  tasks,
  taskBatches,
  eachBatches,
});
export default connect(mapStateToProps)(TaskMonitor);
