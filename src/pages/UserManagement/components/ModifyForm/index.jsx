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
export default class UpdateForm extends Component {
  state = {
    selectValue: undefined,
    departmentId: '',
  };

  componentDidUpdate() {
    this.props.getDepartmentId(this.state.departmentId);
  }

  selectChange = (value, node) => {
    this.setState({
      selectValue: value,
      departmentId: node.props.eventKey,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { orgs, userInfo } = this.props;
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
                initialValue: userInfo.login,
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
                initialValue: userInfo.name,
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
                initialValue: userInfo.departmentName,
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
            <Form.Item label="邮箱地址：">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please confirm your 邮箱地址!',
                  },
                ],
                initialValue: userInfo.email,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
