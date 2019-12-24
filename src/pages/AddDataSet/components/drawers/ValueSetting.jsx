/*
 * @Description: 设置参数值
 * @Author: lan
 * @Date: 2019-12-11 20:54:21
 * @LastEditTime : 2019-12-24 13:25:13
 * @LastEditors  : lan
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Drawer } from 'antd';

@Form.create({})
export default class ValueSetting extends PureComponent {
  static propTypes = {
    variableList: PropTypes.array,
    handlePreview: PropTypes.func,
    toggleModal: PropTypes.func,
  };

  static defaultProps = {
    variableList: [],
    handlePreview: () => {},
    toggleModal: () => {},
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handlePreview, form, toggleModal } = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      toggleModal('valueSetting');
      handlePreview(values);
      form.resetFields();
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { toggleModal, visible, variableList } = this.props;
    return (
      <Drawer
        title="Params"
        width={500}
        visible={visible}
        onClose={() => {
          toggleModal('valueSetting');
        }}
        destroyOnClose
      >
        <Form onSubmit={this.handleSubmit}>
          {variableList.map(item => (
            <Form.Item label={item.parameter_name} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator(item.parameter_name, {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </Form.Item>
          ))}
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button
              onClick={() => {
                toggleModal('valueSetting');
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button htmlType="submit" type="primary">
              Save
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}
