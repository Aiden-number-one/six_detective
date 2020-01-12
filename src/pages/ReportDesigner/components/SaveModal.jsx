/*
 * @Des: 新建报表模板，保存抽屉
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2020-01-12 15:09:07
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-12 15:11:58
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
                  rules: [{ required: true, message: 'Please Input' }],
                  initialValue: isSaveOther ? `${sqlDataSetName}_copy` : sqlDataSetName,
                })(<Input placeholder={formatMessage({ id: 'index.inputName' })} />)}
              </Form.Item>
              <Form.Item {...Layout} label="Folder">
                {getFieldDecorator('folder', {
                  rules: [{ required: true, message: 'Please select' }],
                  initialValue: dataSet ? dataSet.folderId : undefined,
                })(<TreeSelect treeData={classifyTree} placeholder="Please select" />)}
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
