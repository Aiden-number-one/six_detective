import React from 'react';
import { mount } from 'enzyme';

import LopLogFilterForm from './LopLogFilterForm';

jest.mock('umi/locale');

describe('test Filter Form comp', () => {
  const wrapper = mount(<LopLogFilterForm />);

  // console.log(wrapper.debug());
  it('should render success form', () => {
    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('should render 1*2 grid', () => {
    const rows = wrapper.find('form').children();
    expect(rows.length).toBe(1);
    expect(rows.find({ span: 10 }).length).toBe(2);
  });

  it('should render 8 form item', () => {
    expect(wrapper.find('FormItem').length).toBe(8);
  });
});
