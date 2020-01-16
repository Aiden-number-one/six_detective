/*
 * @Description: 新增修改数据集分类树
 * @Author: lan
 * @Date: 2019-12-11 15:51:22
 * @LastEditTime : 2020-01-13 15:58:55
 * @LastEditors  : mus
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

@Form.create({})
export default class OperateTreeForm extends PureComponent {
  static propTypes = {
    nodeTree: PropTypes.object,
    handleSubmit: PropTypes.func,
    toggleDrawer: PropTypes.func,
    clearNodeTree: PropTypes.func,
  };

  static defaultProps = {
    nodeTree: {},
    handleSubmit: () => {},
    toggleDrawer: () => {},
    clearNodeTree: () => {},
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handleSubmit, form } = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      handleSubmit(values);
      form.resetFields();
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { nodeTree, toggleDrawer, clearNodeTree, operateType } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        {operateType === 'DELETE' ? (
          'Please Confirm to delete'
        ) : (
          <Form.Item label="Folder Name" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator('folderName', {
              rules: [
                {
                  required: true,
                  message: 'Folder Name is missing',
                },
                {
                  max: 64,
                  message: 'Folder Name cannot be longer than 64 characters',
                },
              ],
              initialValue: nodeTree && nodeTree.folderName,
            })(<Input />)}
          </Form.Item>
        )}
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
              toggleDrawer('operateTree');
              clearNodeTree();
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
    );
  }
}
