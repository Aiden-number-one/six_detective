/*
 * @Description: 修改数据集名称
 * @Author: lan
 * @Date: 2019-12-11 20:54:21
 * @LastEditTime : 2020-01-16 15:38:20
 * @LastEditors  : lan
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Drawer } from 'antd';

@Form.create({})
export default class ParamSetting extends PureComponent {
  static propTypes = {
    record: PropTypes.object,
    handleParamSetting: PropTypes.func,
    toggleDrawer: PropTypes.func,
    clearRecord: PropTypes.func,
  };

  static defaultProps = {
    record: {},
    handleParamSetting: () => {},
    toggleDrawer: () => {},
    clearRecord: () => {},
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handleParamSetting, form, toggleDrawer } = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      setTimeout(() => {
        toggleDrawer('paramSetting');
      }, 0);
      handleParamSetting(values);
      form.resetFields();
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { toggleDrawer, visible, clearRecord, record } = this.props;
    return (
      <Drawer
        title="Params"
        width={700}
        visible={visible}
        onClose={() => {
          clearRecord();
          toggleDrawer('paramSetting');
        }}
        destroyOnClose
      >
        <Form onSubmit={this.handleSubmit}>
          {record.datasetParams &&
            record.datasetParams.map(item => (
              <Form.Item
                label={item.parameter_name}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
              >
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
              // borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button
              onClick={() => {
                clearRecord();
                toggleDrawer('paramSetting');
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}
