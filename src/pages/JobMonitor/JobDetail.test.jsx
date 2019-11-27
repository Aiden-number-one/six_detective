import React from 'react';
import { shallow } from 'enzyme';
import { Row } from 'antd';

import JobDetail, { Loading, TaskDetailCharts, TaskTable, FlowFrame } from './JobDetail';

describe('test detail comp', () => {
  const wrapper = shallow(<JobDetail loading={{ 'tm/queryEachBatch': false }} />);

  it('render detail success,without data', () => {
    expect(wrapper.find(Loading).length).toBe(1);
    expect(wrapper.find(Row).length).toBe(3);
    expect(wrapper.find(TaskDetailCharts).length).toBe(1);
  });

  it('should render task table', () => {
    expect(wrapper.find(TaskTable).length).toBe(1);
  });

  it('should render flow frame', () => {
    const toggleBtn = wrapper
      .find(Row)
      .at(2)
      .find('a')
      .at(0);

    toggleBtn.simulate('click');
    expect(toggleBtn.text()).toBe('切换');
    expect(wrapper.find(FlowFrame).length).toBe(1);
  });
});
