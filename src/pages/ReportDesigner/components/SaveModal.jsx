/*
 * @Des: 新建报表模板，保存抽屉
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2020-01-12 15:09:07
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-13 17:56:42
 */

import React from 'react';
import { Form, Input, TreeSelect, Button } from 'antd';
import { connect } from 'dva';

export default React.memo(
  connect(({ reportDesigner, reportTree }) => ({
    reportName: reportDesigner.reportName,
    folderId: reportDesigner.folderId,
    classifyTree: reportTree.classifyTree,
  }))(
    Form.create()(
      class extends React.Component {
        handleSubmit = e => {
          e.preventDefault();
          const { form, saveDrawDisplay, saveReportTemplate } = this.props;
          form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            saveReportTemplate(fieldsValue);
            saveDrawDisplay(false);
          });
        };

        render() {
          const {
            form,
            saveDrawDisplay,
            classifyTree,
            saveType,
            reportName, // 报表名
            folderId,
          } = this.props;
          const { getFieldDecorator } = form;
          const Layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          };
          return (
            <Form onSubmit={this.handleSubmit}>
              <Form.Item {...Layout} label="Template Name">
                {getFieldDecorator('reportName', {
                  rules: [
                    { required: true, message: 'Report Name is missing' },
                    {
                      max: 50,
                      message: 'Report Name cannot be longer than 50 characters',
                    },
                  ],
                  initialValue: saveType === 'saveAs' ? `${reportName}_copy` : reportName,
                })(<Input placeholder="Please Input" />)}
              </Form.Item>
              <Form.Item {...Layout} label="Folder">
                {getFieldDecorator('folderId', {
                  rules: [{ required: true, message: 'Please select' }],
                  initialValue: saveType === 'saveAs' || !folderId ? undefined : folderId,
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
                    saveDrawDisplay(false);
                  }}
                  style={{ marginRight: 8 }}
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  onSubmit={() => {
                    this.handleSubmit();
                  }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          );
        }
      },
    ),
  ),
);
