import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import AllTask from './AllTask';
import styles from './index.less';
import TaskDetail from './TaskDetail';

function TaskMonitor({ dispatch, loading, tasks }) {
  useEffect(() => {
    dispatch({
      type: 'tm/queryTasks',
    });
  }, []);

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
          <AllTask tasks={tasks} />
        </Col>
        <Col span={18} offset={1}>
          <TaskDetail />
        </Col>
      </Row>
    </div>
  );
}
const mapStateToProps = ({ loading, tm: { tasks } }) => ({
  loading: loading.effects,
  tasks,
});
export default connect(mapStateToProps)(TaskMonitor);
