import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProcessDetail from './processDetail';
import ProcessList from './processList';
import styles from './index.less';

export default function() {
  const [task, setTask] = useState(null);
  const [currentTaskType, setCurrentTaskType] = useState('SLOP_BIZ.V_ALL_TASK');
  const [pageSizeData, setPageSizeData] = useState({});

  return (
    <div className={styles['list-container']}>
      <ProcessList
        getTask={item => setTask(item)}
        setCurrentTaskType={item => setCurrentTaskType(item)}
        setPageSizeData={item => setPageSizeData(item)}
        // getAlertItems={items => setAlertItems(items)}
      />
      {task && (
        <ProcessDetail task={task} pageSizeData={pageSizeData} currentTaskType={currentTaskType} />
      )}
      {/* <ProcessDetail task={task} currentTaskType={currentTaskType}/> */}
    </div>
  );
}
