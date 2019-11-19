import React, { useState } from 'react';
import { Form, Input, Modal, TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;

function loopOrgs(orgsTree = []) {
  return orgsTree.map(item => {
    const { children, departmentId, departmentName, parentDepartmentId } = item;
    if (children) {
      return (
        <TreeNode key={departmentId} title={departmentName} parentId={parentDepartmentId}>
          {loopOrgs(children)}
        </TreeNode>
      );
    }
    return <TreeNode key={departmentId} title={departmentName} parentId={parentDepartmentId} />;
  });
}

function UserForm({ user, form, departs }) {
  const [curSelectDept, setSelectDept] = useState({});

  console.log(curSelectDept);
  console.log(departs);

  const { getFieldDecorator } = form;
  function handleChange(value) {
    console.log(value);

    setSelectDept(value);
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <Form {...formItemLayout}>
      <Form.Item label="员工姓名" hasFeedback>
        {getFieldDecorator('name', {
          initialValue: user.customerName || '',
          rules: [
            {
              required: true,
              message: 'Please input your name!',
            },
          ],
        })(<Input placeholder="Please input your name" />)}
      </Form.Item>
      <Form.Item label="登录名" hasFeedback>
        {getFieldDecorator('logName', {
          initialValue: user.loginName || '',
          rules: [
            {
              required: true,
              message: 'Please input your log name!',
            },
          ],
        })(<Input placeholder="Please input your log name" />)}
      </Form.Item>
      <Form.Item label="公司部门" hasFeedback>
        {getFieldDecorator('departName', {
          initialValue: user.departmentName || '',
          rules: [
            {
              required: true,
              message: 'Please select your depart!',
            },
          ],
        })(
          <TreeSelect
            allowClear
            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
            placeholder="Please select"
            treeDefaultExpandAll
            onChange={handleChange}
          >
            {loopOrgs(departs)}
          </TreeSelect>,
        )}
      </Form.Item>
      <Form.Item label="邮箱地址" hasFeedback>
        {getFieldDecorator('email', {
          initialValue: user.email || '',
          rules: [
            {
              required: false,
              message: 'Please input your email!',
            },
          ],
        })(<Input placeholder="Please input your email" />)}
      </Form.Item>
    </Form>
  );
}

function UserModal({ visible, user, departments, form, handleCancel, save }) {
  const { validateFields } = form;
  const title = user ? '编辑' : '新增';

  function handleOk() {
    validateFields((err, values) => {
      if (!err) {
        save(values);
      }
    });
  }

  return (
    <Modal title={`${title}员工`} visible={visible} onOk={handleOk} onCancel={handleCancel}>
      <UserForm user={user || {}} form={form} departs={departments} />
    </Modal>
  );
}
export default Form.create({ name: 'User' })(UserModal);
