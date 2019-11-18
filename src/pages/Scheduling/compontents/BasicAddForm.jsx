import React, { Component } from 'react';
import { Form, Input, DatePicker, TreeSelect } from 'antd';

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
class BasicAddForm extends Component {
  chooseJobId = () => {
    console.log('00000');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { folderMenuData, selectChange } = this.props;
    // const { selectValue } = this.state;
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '请选择时间' }],
      initialValue: '',
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
            initialValue: '',
          })(<Input placeholder="请输入最长64位字符（中文占两个字符）" />)}
        </Form.Item>
        <Form.Item label="调度作业:">
          {getFieldDecorator('folderId', {
            rules: [
              {
                required: true,
                message: 'Please input your 调度作业',
              },
            ],
            initialValue: '',
          })(
            <TreeSelect
              // value={selectValue}
              onSelect={selectChange}
              placeholder="Please select"
            >
              {loop(folderMenuData)}
            </TreeSelect>,
          )}
        </Form.Item>
        <Form.Item label="计划有效时间:">
          {getFieldDecorator('validDate', rangeConfig)(
            <RangePicker showTime style={{ width: '100%' }} />,
          )}
        </Form.Item>
        {/* <Form.Item label="">
          {getFieldDecorator('Checkbox')(<Checkbox>永久有效:</Checkbox>)}
        </Form.Item> */}
        <Form.Item label="计划描述:">
          {getFieldDecorator('scheduleDesc', {
            rules: [
              {
                required: false,
                message: 'Please input your scheduleDesc',
              },
            ],
            initialValue: '',
          })(<TextArea rows={2} placeholder="请输入最长1024位字符（中文占两个字符）" />)}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({})(BasicAddForm);
