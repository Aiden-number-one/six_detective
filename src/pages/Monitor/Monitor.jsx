import React, { PureComponent, Fragment } from 'react';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Layout, Card, Icon } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './Monitor.less';

const { Content, Sider } = Layout;

@connect(({ api }) => ({}))
export default class Monitor extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <Fragment>
        <div>监控预警</div>
      </Fragment>
    );
  }
}
