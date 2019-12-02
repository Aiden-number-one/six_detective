import React from 'react';
import { shallow } from 'enzyme';
import { Table } from 'antd';
import LopLogTable from './LopLogTable';

const { Column } = Table;

describe('test lop data log table', () => {
  const wrapper = shallow(<LopLogTable dataSource={[]} />);

  it('should render table', () => {
    expect(wrapper.find(Table).length).toBe(1);
    expect(wrapper.find(Column).length).toBe(12);
    expect(
      wrapper
        .find(Column)
        .first()
        .props().dataIndex,
    ).toBe('tradeDate');
  });
});
