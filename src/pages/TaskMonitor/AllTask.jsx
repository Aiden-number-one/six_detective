import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

function loopTasks(tasks) {
  return tasks.map(item => {
    const { children, monitorId, jobName, parentMonitorId } = item;
    if (children) {
      return (
        <TreeNode key={monitorId} title={jobName} parentId={parentMonitorId}>
          {loopTasks(children)}
        </TreeNode>
      );
    }
    return <TreeNode key={monitorId} title={jobName} parentId={parentMonitorId} />;
  });
}
export default function({ tasks }) {
  return (
    <div>
      <Tree>{loopTasks(tasks)}</Tree>
    </div>
  );
}
