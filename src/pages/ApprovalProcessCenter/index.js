import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProcessDetail from './processDetail';
import ProcessList from './processList';
import styles from './index.less';

export default function() {
  const [task, setTask] = useState(null);
  const [currentTaskType, setCurrentTaskType] = useState('all');
  // const [alertItems, setAlertItems] = useState(null);

  return (
    <PageHeaderWrapper>
      <div className={styles['list-container']}>
        <ProcessList
          getTask={item => setTask(item)}
          setCurrentTaskType={item => setCurrentTaskType(item)}
          // getAlertItems={items => setAlertItems(items)}
        />
        <ProcessDetail task={task} currentTaskType={currentTaskType} />
      </div>
    </PageHeaderWrapper>
  );
}
