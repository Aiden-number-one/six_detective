/*
 * @Description: 111
 * @Author: lan
 * @Date: 2019-12-07 14:24:54
 * @LastEditTime: 2019-12-12 14:34:56
 * @LastEditors: lan
 */
import React from 'react';
import { Drawer, Form, Input, TreeSelect, Button } from 'antd';
import { formatMessage } from 'umi/locale';
// 上传文件弹出框
export default React.memo(
  Form.create()(
    class extends React.Component {
      handleSubmit = () => {
        const { form, toggleModal } = this.props;
        form.validateFields(err => {
          if (err) return;
          form.resetFields();
          toggleModal('save');
          // saveSql && saveSql(fieldsValue);
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
                  rules: [{ required: true, message: formatMessage({ id: 'index.inputName' }) }],
                  initialValue: isSaveOther ? `${sqlDataSetName}_副本` : sqlDataSetName,
                })(<Input placeholder={formatMessage({ id: 'index.inputName' })} />)}
              </Form.Item>
              <Form.Item {...Layout} label="Folder">
                {getFieldDecorator('folder', {
                  rules: [{ required: true, message: formatMessage({ id: 'index.inputName' }) }],
                  // initialValue: isSaveOther ? `${sqlTableName}_副本` : sqlTableName,
                })(
                  <TreeSelect
                    treeData={classifyTree}
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
