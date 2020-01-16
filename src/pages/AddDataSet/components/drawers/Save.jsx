/*
 * @Description: 111
 * @Author: lan
 * @Date: 2019-12-07 14:24:54
 * @LastEditTime : 2020-01-11 16:21:22
 * @LastEditors  : lan
 */
import React from 'react';
import { Drawer, Form, Input, TreeSelect, Button } from 'antd';
import { formatMessage } from 'umi/locale';

export default React.memo(
  Form.create()(
    class extends React.Component {
      handleSubmit = e => {
        e.preventDefault();
        const { form, toggleModal, saveSql } = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          if (saveSql) saveSql(fieldsValue);
          form.resetFields();
          toggleModal('save');
        });
      };

      checkName = (rule, value, callback) => {
        if (value.includes('.')) {
          callback('DataSet Name Cannot Contain "."');
        } else {
          callback();
        }
      };

      render() {
        const {
          visible,
          form,
          toggleModal,
          sqlDataSetName,
          isSaveOther,
          classifyTree,
          dataSet,
        } = this.props;
        const { getFieldDecorator } = form;
        const Layout = {
          labelCol: { span: 9 },
          wrapperCol: { span: 15 },
        };
        return (
          <Drawer
            visible={visible}
            width={350}
            title={isSaveOther ? 'Save As' : 'Save'}
            wrapClassName="modal"
            destroyOnClose
            onClose={() => {
              form.resetFields();
              toggleModal('save');
            }}
            onOk={() => {}}
          >
            <Form onSubmit={this.handleSubmit}>
              <Form.Item {...Layout} label="DataSet Name">
                {getFieldDecorator('sqlDataSetName', {
                  rules: [
                    {
                      required: true,
                      message: 'DataSet Name is missing',
                    },
                    {
                      validator: this.checkName,
                    },
                  ],
                  initialValue: isSaveOther ? `${sqlDataSetName}_copy` : sqlDataSetName,
                })(<Input placeholder="Please input DataSet Name" />)}
              </Form.Item>
              <Form.Item {...Layout} label="Folder">
                {getFieldDecorator('folder', {
                  rules: [{ required: true, message: 'Folder is missing' }],
                  initialValue: dataSet ? dataSet.folderId : undefined,
                })(<TreeSelect treeData={classifyTree} placeholder="Please select" />)}
              </Form.Item>
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
                    toggleModal('save');
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
    },
  ),
);
