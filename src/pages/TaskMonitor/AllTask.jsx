import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

function loopTasks(tasks) {
  return tasks.map(item => {
    const { children, jobName, jobId, batchNo, type, name } = item;
    if (children) {
      return (
        <TreeNode key={jobId || type} title={`${name}(${children.length})`}>
          {loopTasks(children)}
        </TreeNode>
      );
    }
    return <TreeNode key={jobId || type} title={jobName || name} jobId={jobId} batchNo={batchNo} />;
  });
}

export default function({ tasks, getTask }) {
  function handleSelect(selectKey, info) {
    const { jobId, batchNo } = info.node.props;
    if (jobId && batchNo) {
      getTask(jobId, batchNo);
    }
  }
  return (
    <div>
      <Tree showLine onSelect={handleSelect}>
        {loopTasks(tasks)}
      </Tree>
    </div>
  );
}
