/*
 * @Des: 新建报表模板，保存抽屉
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2020-01-12 15:09:07
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-16 16:08:46
 */

import React from 'react';
import { Form, Input, TreeSelect, Button } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;

export default React.memo(
  connect(({ reportDesigner, reportTree }) => ({
    reportName: reportDesigner.reportName,
    folderId: reportDesigner.folderId,
    description: reportDesigner.description,
    classifyTree: reportTree.classifyTree,
  }))(
    Form.create()(
      class extends React.Component {
        handleSubmit = e => {
          e.preventDefault();
          const { form, saveDrawDisplay, saveReportTemplate, dispatch } = this.props;
          form.validateFields(async (err, fieldsValue) => {
            if (err) return;
            saveDrawDisplay(false);
            form.resetFields();
            await dispatch({
              type: 'reportDesigner/modifyTemplateArea',
              payload: {},
            });
            saveReportTemplate(fieldsValue);
          });
        };

        render() {
          const {
            form,
            saveDrawDisplay,
            classifyTree,
            saveType,
            reportName, // 报表名
            folderId, // 存放文件夹id
            description, // 报表描述
          } = this.props;
          const { getFieldDecorator } = form;
          const Layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          };
          return (
            <Form>
              <Form.Item {...Layout} label="Template Name">
                {getFieldDecorator('reportName', {
                  rules: [
                    { required: true, message: 'Template name is missing' },
                    {
                      max: 50,
                      message: 'Template name cannot be longer than 50 characters',
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
              <Form.Item {...Layout} label="Description">
                {getFieldDecorator('description', {
                  rules: [
                    {
                      max: 1000,
                      message: 'Description cannot be longer than 1000 characters',
                    },
                  ],
                  initialValue: description,
                })(<TextArea autoSize={{ minRows: 6, maxRows: 12 }} />)}
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
                    saveDrawDisplay(false);
                  }}
                  style={{ marginRight: 8 }}
                >
                  Cancel
                </Button>
                <Button htmlType="submit" type="primary" onClick={this.handleSubmit}>
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
