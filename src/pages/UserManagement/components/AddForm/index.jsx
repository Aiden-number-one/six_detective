import React, { Component, Fragment } from 'react';
import { Form, TreeSelect, Input } from 'antd';

import styles from '../../index.less';

const { TreeNode } = TreeSelect;
function loop(orgsTree) {
  return orgsTree.map(item => {
    const { children, departmentId, departmentName, parentDepartmentId } = item;
    if (children) {
      return (
        <TreeNode
          key={departmentId}
          departmentId={departmentId}
          value={departmentName}
          title={departmentName}
          parentId={parentDepartmentId}
        >
          {loop(children)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={departmentId}
        departmentId={departmentId}
        value={departmentName}
        title={departmentName}
        parentId={parentDepartmentId}
      />
    );
  });
}
export default class UserForm extends Component {
  state = {
    selectValue: undefined,
    departmentId: '',
  };

  componentDidUpdate() {
    this.props.getDepartmentId(this.state.departmentId);
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  selectChange = (value, node) => {
    this.setState({
      selectValue: value,
      departmentId: node.props.eventKey,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { orgs } = this.props;
    const { selectValue } = this.state;
    return (
      <Fragment>
        <div>
          <Form layout="inline" className={styles.formWrap}>
            <Form.Item label="登陆名：">
              {getFieldDecorator('login', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 登陆名',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="员工姓名：">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 员工姓名',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="所属部门：">
              {getFieldDecorator('departmentId', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 所属部门',
                  },
                ],
              })(
                <TreeSelect
                  treeDefaultExpandAll
                  value={selectValue}
                  style={{ width: 220 }}
                  onSelect={this.selectChange}
                  placeholder="Please select"
                >
                  {loop(orgs)}
                </TreeSelect>,
              )}
            </Form.Item>
            <Form.Item label="登陆密码：">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 登陆密码',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="确认密码：">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="联系电话：">
              {getFieldDecorator('phone', {
                rules: [],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="邮箱地址：">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
