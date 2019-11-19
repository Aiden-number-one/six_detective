import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

@Form.create()
export default class DataSourceModal extends PureComponent {
  state = {};

  componentDidMount() {}

  handleOK = () => {
    const { form, operateDataSource, toggleModal } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        operateDataSource(values);
      }
    });
    toggleModal('dataSource');
  };

  render() {
    const {
      form,
      visible,
      toggleModal,
      title,
      operation,
      activeData,
      driverInfo,
      activeDriver,
      setActiveDriver,
    } = this.props;
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
        onOk={this.handleOK}
      >
        <Form>
          <Form.Item {...Layout} label="Data Source Type">
            {getFieldDecorator('connectionType', {
              rules: [
                {
                  required: true,
                  message: 'Error',
                },
              ],
              initialValue: formData.connectionTypeOri || activeDriver.driverId,
            })(
              <Select
                placeholder="Please Select"
                dropdownClassName="selectDropdown"
                onChange={(value, e) => {
                  setActiveDriver(e.props.children);
                }}
              >
                {driverInfo.map(item => (
                  <Option key={item.driverId} value={item.driverId}>
                    {item.driverName}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item {...Layout} label="Data Source Name">
            {getFieldDecorator('connectionName', {
              rules: [
                {
                  required: true,
                  message: 'Error',
                },
              ],
              initialValue: formData.connectionName,
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item {...Layout} label="Database Address">
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
          <Form.Item {...Layout} label="Port">
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
          <Form.Item {...Layout} label="Database Name">
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
          <Form.Item {...Layout} label="User Name">
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
          <Form.Item {...Layout} label="Password">
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
          <Form.Item {...Layout} label="Max Connect Count">
            {getFieldDecorator('maxConnectCount', {
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
              initialValue: formData.maxConnectCount,
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item {...Layout} label="URL">
            {getFieldDecorator('jdbcString', {
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
              initialValue: formData.jdbcString || activeDriver.urlInfo,
            })(<Input disabled />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
