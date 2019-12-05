import React from 'react';
import { shallow } from 'enzyme';

import AlertDetail from './AlertDetail';

describe('test alert Detail comp', () => {
  const wrapper = shallow(<AlertDetail />);

  it('should render success', () => {
    expect(wrapper.find('div')).toBe('1231');
  });
});
