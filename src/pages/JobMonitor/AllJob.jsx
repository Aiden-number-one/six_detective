import React from 'react';
import { Tree, Icon, Input } from 'antd';

const { TreeNode } = Tree;
const { Search } = Input;

function loopjobs(jobs) {
  return jobs.map(item => {
    const { jobName, jobId, batchNo, type, name, color, icon, children } = item;
    if (children) {
      return (
        <TreeNode
          key={type}
          title={`${name}(${children.length})`}
          icon={<Icon type={icon} theme="twoTone" twoToneColor={color} />}
        >
          {loopjobs(children)}
        </TreeNode>
      );
    }

    return (
      <TreeNode
        key={jobId}
        title={jobName}
        jobId={jobId}
        batchNo={batchNo}
        icon={<Icon type="folder" theme="twoTone" twoToneColor={color} />}
      />
    );
  });
}

export default function({ jobs, getJob }) {
  function handleSelect(selectKey, info) {
    const { jobId, batchNo } = info.node.props;
    if (jobId) {
      getJob(jobId, batchNo);
    }
  }

  function handleChange(e) {
    const { value } = e.target;
    console.log(value);
  }

  return (
    <>
      <Search placeholder="please input job name!" onChange={handleChange} />
      <Tree
        showIcon
        switcherIcon={<Icon type="down" />}
        onSelect={handleSelect}
        style={{ maxHeight: 800, overflowY: 'auto' }}
      >
        {loopjobs(jobs)}
      </Tree>
    </>
  );
}
