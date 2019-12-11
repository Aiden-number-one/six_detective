/*
 * @Author: Sean Mu
 * @Date: 2019-06-19 13:56:36
 * @Last Modified by: Sean Mu
 * @Last Modified time: 2019-06-19 13:57:30
 */
import React from 'react';
import { Resizable } from 'react-resizable';

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

export default ResizeableTitle;
