import React from 'react';
import { shallow } from 'enzyme';
import { Table, Row, Button } from 'antd';
// import IconFont from '@/components/IconFont';
import Link from 'umi/link';
import AlertList from './AlertList';

const { Column } = Table;

describe('test alert list', () => {
  const wrapper = shallow(<AlertList />);
  // console.log(wrapper.debug());
  it('should render 4 buttons', () => {
    const btns = wrapper
      .find(Row)
      .at(0)
      .find(Button);

    expect(btns.length).toBe(4);

    expect(
      btns
        .last()
        .children(Link)
        .props().to,
    ).toBe('/alert-center/information');
  });

  it('should render table with 9 column and 1 selection', () => {
    expect(wrapper.find(Column).length).toBe(9);
  });
});
