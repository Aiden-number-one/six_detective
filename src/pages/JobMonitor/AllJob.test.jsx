import React from 'react';
import { shallow } from 'enzyme';
import { Tree, Input } from 'antd';

import AllJob from './AllJob';

const { Search } = Input;

describe('test AllJob comp', () => {
  const jobs = [
    { type: 0, name: '出错中断', color: '#ea6b74', icon: 'close-circle', children: [] },
    {
      type: 1,
      name: '执行中',
      color: '#333333',
      icon: 'fire',
      children: [
        {
          batchNo: '201911200001',
          jobName: 'test',
          jobId: 'JOB9B384D95F4A24DA5B2102F7D6A4205F4',
        },
      ],
    },
    { type: 2, name: '成功完成', color: '#63c9d5', icon: 'check-circle', children: [] },
    { type: 3, name: '出错完成', color: '#f1c40f', icon: 'close-circle', children: [] },
    { type: 4, name: '新建', color: '#bac3d0', icon: 'plus-circle', children: [] },
  ];
  const wrapper = shallow(<AllJob jobs={jobs} />);

  it('render tree', () => {
    expect(wrapper.find(Tree)).toHaveLength(1);

    const treeNodesOfFirstLevel = wrapper.find(Tree).children();

    expect(treeNodesOfFirstLevel).toHaveLength(5);

    expect(treeNodesOfFirstLevel.at(0).props().title).toEqual('出错中断(0)');

    expect(treeNodesOfFirstLevel.at(1).children(Tree.TreeNode)).toHaveLength(1);

    expect(
      treeNodesOfFirstLevel
        .at(1)
        .children(Tree.TreeNode)
        .at(0)
        .props().batchNo,
    ).toEqual('201911200001');
  });

  it('render search', () => {
    expect(wrapper.find(Search)).toHaveLength(1);
  });
});
