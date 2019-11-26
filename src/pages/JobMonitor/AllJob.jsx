import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

function loopjobs(jobs) {
  return jobs.map(item => {
    const { children, jobName, jobId, batchNo, type, name } = item;
    if (children) {
      return (
        <TreeNode key={jobId || type} title={`${name}(${children.length})`}>
          {loopjobs(children)}
        </TreeNode>
      );
    }
    return <TreeNode key={jobId || type} title={jobName || name} jobId={jobId} batchNo={batchNo} />;
  });
}

export default function({ jobs, getJob }) {
  function handleSelect(selectKey, info) {
    const { jobId, batchNo } = info.node.props;
    if (jobId && batchNo) {
      getJob(jobId, batchNo);
    }
  }
  return (
    <Tree showLine onSelect={handleSelect} style={{ maxHeight: 800, overflowY: 'auto' }}>
      {loopjobs(jobs)}
    </Tree>
  );
}
