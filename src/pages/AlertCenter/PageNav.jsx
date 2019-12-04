import React from 'react';
import { Breadcrumb } from 'antd';
import NavLink from 'umi/navlink';

const styles = {
  height: '30px',
  color: '#10416c',
  paddingLeft: '10px',
  lineHeight: '30px',
  backgroundColor: '#ddefff',
};

export default function({ routes }) {
  return (
    <Breadcrumb style={styles}>
      <Breadcrumb.Item>
        <NavLink to="/">Home</NavLink>
      </Breadcrumb.Item>
      {Array.of(routes).map(({ link, name }) => (
        <Breadcrumb.Item key={link}>
          <NavLink to={link}>{name}</NavLink>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
