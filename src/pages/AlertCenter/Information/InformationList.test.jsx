import React from 'react';
import { shallow } from 'enzyme';
import Link from 'umi/link';
import { Table } from 'antd';
import InformationList from './InformationList';

describe('test information component', () => {
  const wrapper = shallow(<InformationList loading={false} />);

  it('should render 2 btns before list', () => {
    const btns = wrapper.find('.btns').find('Button');

    expect(btns.length).toBe(2);
    expect(
      btns
        .last()
        .children(Link)
        .prop('to'),
    ).toEqual('/alert-center');
  });

  it('should render a table with 6 columns', () => {
    expect(wrapper.find('Table')).toBeTruthy();
    expect(wrapper.find('Column').length).toBe(6);
  });

  it('should render loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find(Table).props().loading).toBeTruthy();
  });
});
