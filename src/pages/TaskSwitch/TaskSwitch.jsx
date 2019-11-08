import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import LeftClassifyTree from './components/LeftClassifyTree';

import styles from './TaskSwitch.less';

class TaskSwitch extends Component {
  state = {};

  render() {
    return (
      <PageHeaderWrapper>
        <div className={styles.taskSwitchWraper}>
          <div className={styles.sidebar}>
            <LeftClassifyTree></LeftClassifyTree>
          </div>
          <div className={styles.main}>task</div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default TaskSwitch;
