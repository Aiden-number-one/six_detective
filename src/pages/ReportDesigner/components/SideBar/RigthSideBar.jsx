import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Form } from 'antd';
import classNames from 'classnames';
import { FormattedMessage } from 'umi/locale';
import WidgetControl from './WidgetControl';
import CellProperty from './CellProperty';
import styles from './index.less';

const { Sider } = Layout;

@connect(({ formArea }) => ({ cellPosition: formArea.cellPosition }))
@Form.create()
export default class RigthSideBar extends PureComponent {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { cellPosition } = this.props;
    const formProps = {
      getFieldDecorator,
    };
    const cellProps = {
      cellPosition,
    };
    const typeArray = ['cellproperty', 'widgetcontrol'];
    const type = typeArray[0];
    return (
      <Layout className={classNames(styles.layout, styles.sideBar)}>
        <div className={styles.header}>
          <div className={styles.title}>{<FormattedMessage id={`report-designer.${type}`} />}</div>
          <div className={styles.icon}></div>
        </div>
        <Layout>
          {type === 'widgetcontrol' && <WidgetControl {...formProps} />}
          {type === 'cellproperty' && <CellProperty {...formProps} {...cellProps} />}
          <Sider width={30} className={styles.sider} />
        </Layout>
      </Layout>
    );
  }
}
