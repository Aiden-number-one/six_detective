import React, { Component } from 'react';
import { Form, Input, DatePicker, TreeSelect, Checkbox, Row, Col } from 'antd';

import moment from 'moment';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
function loop(orgsTree) {
  return orgsTree.map(item => {
    const { children, folderId, folderName, parentId } = item;
    if (children) {
      return (
        <TreeNode
          key={folderId}
          departmentId={folderId}
          value={folderName}
          title={folderName}
          parentId={parentId}
        >
          {loop(children)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={folderId}
        departmentId={folderId}
        value={folderName}
        title={folderName}
        parentId={parentId}
      />
    );
  });
}
// eslint-disable-next-line react/prefer-stateless-function
class BasicModifyForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { folderMenuData, selectChange, selectedRows } = this.props;
    const defaultSelectedValue = selectedRows[0];
    // const { selectValue } = this.state;
    const rangeConfig = {
      rules: [{ type: 'array', required: false, message: '请选择时间' }],
      initialValue: [
        moment(defaultSelectedValue.validStartDate, 'YYYY-MM-DD HH:mm:ss'),
        moment(defaultSelectedValue.validEndDate, 'YYYY-MM-DD HH:mm:ss'),
      ],
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item label=" 计划名称:">
          {getFieldDecorator('scheduleName', {
            rules: [
              {
                required: true,
                message: 'Please input your scheduleName',
              },
            ],
            initialValue: defaultSelectedValue.scheduleName,
          })(<Input placeholder="64 characters maximum" />)}
        </Form.Item>
        <Form.Item label="调度作业:">
          {getFieldDecorator('folderId', {
            rules: [
              {
                required: true,
                message: 'Please input your 调度作业',
              },
            ],
            initialValue: defaultSelectedValue.jobNo,
          })(
            <TreeSelect onSelect={selectChange} placeholder="Please select">
              {loop(folderMenuData)}
            </TreeSelect>,
          )}
        </Form.Item>
        <Form.Item label="计划有效时间:">
          <Row gutter={8}>
            <Col span={16}>
              {getFieldDecorator('validDate', rangeConfig)(
                <RangePicker showTime style={{ width: '100%' }} />,
              )}
            </Col>
            <Col span={8}>{getFieldDecorator('Checkbox')(<Checkbox>永久有效</Checkbox>)}</Col>
          </Row>
        </Form.Item>
        <Form.Item label="计划描述:">
          {getFieldDecorator('scheduleDesc', {
            rules: [
              {
                required: false,
                message: 'Please input your scheduleDesc',
              },
            ],
            initialValue: defaultSelectedValue.scheduleDesc,
          })(<TextArea rows={2} placeholder="1024 characters maximum" />)}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({})(BasicModifyForm);
