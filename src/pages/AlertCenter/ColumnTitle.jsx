import React from 'react';
import { Popover } from 'antd';
import IconFont from '@/components/IconFont';

const styles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
};

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

export default function ColumnTitle({ children }) {
  return (
    <Popover placement="bottomLeft" trigger="click" content={content} style={styles}>
      <IconFont
        type="iconfilter1"
        style={{
          fontSize: 16,
          marginRight: 5,
          cursor: 'pointer',
          color: 'rgba(17, 65, 108, 0.6)',
        }}
      />
      {children}
    </Popover>
  );
}
