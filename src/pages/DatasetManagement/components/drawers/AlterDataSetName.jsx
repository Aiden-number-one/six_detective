/*
 * @Description: 修改数据集名称
 * @Author: lan
 * @Date: 2019-12-11 20:54:21
 * @LastEditTime: 2019-12-12 10:18:35
 * @LastEditors: lan
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Drawer } from 'antd';

@Form.create({})
export default class AlterDataSetName extends PureComponent {
  static propTypes = {
    record: PropTypes.object,
    handleSetDataSetName: PropTypes.func,
    toggleDrawer: PropTypes.func,
    clearRecord: PropTypes.func,
  };

  static defaultProps = {
    record: {},
    handleSetDataSetName: () => {},
    toggleDrawer: () => {},
    clearRecord: () => {},
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handleSetDataSetName, form } = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      handleSetDataSetName(values);
      form.resetFields();
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { record, toggleDrawer, clearRecord, visible } = this.props;
    return (
      <Drawer
        title="DataSet Name"
        width={350}
        visible={visible}
        onClose={() => {
          clearRecord();
          toggleDrawer('dataSetName');
        }}
        destroyOnClose
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="DataSet Name" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator('sqlName', {
              rules: [
                {
                  required: true,
                },
              ],
              initialValue: record && record.sqlName,
            })(<Input />)}
          </Form.Item>
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
                clearRecord();
                toggleDrawer('dataSetName');
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
