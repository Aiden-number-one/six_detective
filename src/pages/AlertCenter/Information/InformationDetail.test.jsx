import React from 'react';
import { shallow } from 'enzyme';
import InformationDetail from './InformationDetail';

describe('test information deatail componet', () => {
  const wrapper = shallow(<InformationDetail />);
  it('should render grid with 1 row and 2 columns', () => {
    expect(wrapper.find('Row').length).toBe(1);
    expect(wrapper.find('Row').find('Col').length).toBe(2);
  });

  it('should render 2 tabs', () => {
    expect(wrapper.find('Tabs').length).toBe(2);
  });
});
