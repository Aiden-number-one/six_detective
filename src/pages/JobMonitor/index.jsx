import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Spin, Empty } from 'antd';
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

  return (
    <div className={styles.container}>
      <Spin spinning={loading['tm/queryJobs']}>
        {loading['tm/queryJobs'] === false && jobs.length === 0 ? (
          <Empty />
        ) : (
          <Row>
            <Col span={5}>
              <AllJob jobs={jobs} getJob={handleBatch} />
            </Col>
            <Col span={18} offset={1}>
              <JobDetail
                loading={loading}
                tasks={tasks}
                taskPoints={taskPoints}
                eachBatches={eachBatches}
                getTasks={getTasks}
              />
            </Col>
          </Row>
        )}
      </Spin>
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
