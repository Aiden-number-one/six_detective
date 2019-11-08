import React, { PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';

// import styles from '../AddDataSource.less';

@Form.create()
export default class DataSourceModal extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    const { form, visible, toggleModal, title, operation, activeData } = this.props;
    const { getFieldDecorator } = form;
    const Layout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    let formData = activeData;
    if (operation === 'ADD') {
      formData = {};
    }
    return (
      <Modal
        visible={visible}
        title={title}
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
              initialValue: formData.connectionName,
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
              initialValue: formData.server,
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
              initialValue: formData.dbPort,
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
              initialValue: formData.dbDatabase,
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item {...Layout} label="Schema">
            {getFieldDecorator('schema', {
              rules: [{ required: false }],
              initialValue: formData.schema,
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
              initialValue: formData.dbUser,
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
              initialValue: formData.dbPassword,
            })(<Input type="password" placeholder="" autoComplete="new-password" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
