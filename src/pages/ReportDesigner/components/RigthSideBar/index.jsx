import React, { PureComponent } from 'react';
import { Layout, Collapse, Icon, Form, Input } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const { Sider, Content } = Layout;
const { Panel } = Collapse;

@Form.create()
export default class RigthSideBar extends PureComponent {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout className={classNames(styles.layout, styles.rigthSideBar)}>
        <div className={styles.header}>
          <div className={styles.title}>单元格属性</div>
          <div className={styles.icon}></div>
        </div>
        <Layout>
          <Content className={styles.content}>
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              expandIconPosition="right"
              expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
              <Panel header="Basic" key="1">
                <Form>
                  <Form.Item label="用户名" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('roleName', {})(<Input />)}
                  </Form.Item>
                </Form>
              </Panel>
            </Collapse>
          </Content>
          <Sider width={30} className={styles.sider} />
        </Layout>
      </Layout>
    );
  }
}
