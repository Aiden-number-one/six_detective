import React from 'react';
import { shallow } from 'enzyme';
import { Table, Row, Button } from 'antd';
import AlertList from './AlertList';

const { Column } = Table;

describe('test alert list', () => {
  const wrapper = shallow(<AlertList />);
  console.log(wrapper.debug());
  it('should render 3 buttion', () => {
    expect(
      wrapper
        .find(Row)
        .at(0)
        .find(Button).lenght,
    ).toBe(3);
  });
  it('should render table with 9 column and 1 selection', () => {
    expect(wrapper.find(Column).length).toBe(9);
  });
});
