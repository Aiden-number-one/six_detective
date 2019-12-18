/*
 * @Description: 修改数据集名称
 * @Author: lan
 * @Date: 2019-12-11 20:54:21
 * @LastEditTime: 2019-12-18 14:21:37
 * @LastEditors: lan
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, TreeSelect, Button, Drawer } from 'antd';

@Form.create({})
export default class MoveDataSetDrawer extends PureComponent {
  static propTypes = {
    classifyTree: PropTypes.array,
    handleMove: PropTypes.func,
    toggleDrawer: PropTypes.func,
    clearRecord: PropTypes.func,
  };

  static defaultProps = {
    classifyTree: [],
    handleMove: () => {},
    toggleDrawer: () => {},
    clearRecord: () => {},
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handleMove, form } = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      handleMove(values);
      form.resetFields();
    });
  };

  TreeFolderTrans = value => {
    const dataList = [];
    value.forEach(item => {
      if (item.children) {
        item.children = this.TreeFolderTrans(item.children);
      }
      const param = {
        key: item.classId,
        value: item.classId,
        title: item.className,
        children: item.children,
      };
      dataList.push(param);
    });
    return dataList;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { classifyTree, toggleDrawer, clearRecord, visible } = this.props;
    const Layout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <Drawer
        title="DataSet Name"
        width={370}
        visible={visible}
        onClose={() => {
          clearRecord();
          toggleDrawer('move');
        }}
        destroyOnClose
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item {...Layout} label="Folder">
            {getFieldDecorator('folder', {
              rules: [{ required: true }],
              // initialValue: isSaveOther ? `${sqlTableName}_副本` : sqlTableName,
            })(
              <TreeSelect
                treeData={this.TreeFolderTrans(classifyTree)}
                placeholder="Please select"
                // treeDefaultExpandAll
              />,
            )}
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
                toggleDrawer('move');
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
