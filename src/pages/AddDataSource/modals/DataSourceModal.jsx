import React, { PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';

// import styles from '../AddDataSource.less';

@Form.create()
export default class DataSourceModal extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    const { form, visible, toggleModal } = this.props;
    const { getFieldDecorator } = form;
    const Layout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    return (
      <Modal
        visible={visible}
        title="新增数据源"
        width={600}
        onCancel={() => {
          form.resetFields();
          toggleModal('dataSource');
        }}
      >
        <Form>
          <Form.Item {...Layout} label="Data Source Name">
            {getFieldDecorator('connectionName', {
              rules: [
                {
                  required: true,
                  message: '请输入数据源配置列表显示名称',
                },
              ],
              initialValue: undefined,
            })(<Input placeholder="数据源配置列表显示名称" />)}
          </Form.Item>
          <Form.Item {...Layout} label="databaseAddress">
            {getFieldDecorator('server', {
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
              initialValue: undefined,
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item {...Layout} label="port">
            {getFieldDecorator('dbPort', {
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
              initialValue: undefined,
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item {...Layout} label="databaseName">
            {getFieldDecorator('dbDatabase', {
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
              initialValue: undefined,
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item {...Layout} label="Schema">
            {getFieldDecorator('schema', {
              rules: [{ required: false }],
              initialValue: undefined,
            })(<Input placeholder="Schema" />)}
          </Form.Item>
          <Form.Item {...Layout} label="userName">
            {getFieldDecorator('dbUser', {
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
              initialValue: undefined,
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item {...Layout} label="password">
            {getFieldDecorator('dbPassword', {
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
              initialValue: undefined,
            })(<Input type="password" placeholder="" autoComplete="new-password" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
