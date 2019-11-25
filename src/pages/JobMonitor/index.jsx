import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import AllJob from './AllJob';
import JobDetail from './JobDetail';
import styles from './index.less';

function JobMonitor({ dispatch, loading, jobs, tasks, taskPoints, eachBatches }) {
  useEffect(() => {
    dispatch({
      type: 'tm/queryJobs',
    });
  }, []);

  function handleBatch(jobId) {
    dispatch({
      type: 'tm/queryEachBatch',
      params: {
        jobId,
      },
    });
  }

  function getTasks(batch) {
    const { jobId, batchNo } = batch;
    dispatch({
      type: 'tm/queryTasksOfJob',
      params: {
        jobId,
        batchNo,
      },
    });
    dispatch({
      type: 'tm/queryTaskPointsOfJob',
      params: {
        jobId,
      },
    });
  }

  if (loading['tm/queryJob']) {
    return <p>loading</p>;
  }

  if (jobs.length === 0) {
    return <p>暂无数据1</p>;
  }

  return (
    <div className={styles.container}>
      <Row>
        <Col span={4}>
          <AllJob jobs={jobs} getJob={handleBatch} />
        </Col>
        <Col span={18} offset={1}>
          <JobDetail
            tasks={tasks}
            taskPoints={taskPoints}
            eachBatches={eachBatches}
            getTasks={getTasks}
          />
        </Col>
      </Row>
    </div>
  );
}
const mapStateToProps = ({ loading, tm: { jobs, tasks, taskPoints, eachBatches } }) => ({
  loading: loading.effects,
  jobs,
  tasks,
  taskPoints,
  eachBatches,
});
export default connect(mapStateToProps)(JobMonitor);
