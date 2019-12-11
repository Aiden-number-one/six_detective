import React from 'react';
import { Modal, Form, Input } from 'antd';
import { formatMessage } from 'umi/locale';
// 上传文件弹出框
export default React.memo(
  Form.create()(
    class extends React.Component {
      render() {
        const { visible, form, toggleModal, sqlTableName, isSaveOther } = this.props;
        const { getFieldDecorator } = form;
        const Layout = {
          labelCol: { span: 7 },
          wrapperCol: { span: 13 },
        };
        return (
          <Modal
            visible={visible}
            title={isSaveOther ? '另存为' : '保存'}
            cancelText="取消"
            okText="确定"
            wrapClassName="modal"
            destroyOnClose
            forceRender
            onCancel={() => {
              form.resetFields();
              toggleModal('save');
            }}
            onOk={() => {
              form.validateFields(err => {
                if (err) return;
                form.resetFields();
                toggleModal('save');
                // saveSql && saveSql(fieldsValue);
              });
            }}
          >
            <Form>
              <Form.Item {...Layout} label={formatMessage({ id: 'index.name' })}>
                {getFieldDecorator('sqlTableName', {
                  rules: [{ required: true, message: formatMessage({ id: 'index.inputName' }) }],
                  initialValue: isSaveOther ? `${sqlTableName}_副本` : sqlTableName,
                })(<Input placeholder={formatMessage({ id: 'index.inputName' })} />)}
              </Form.Item>
            </Form>
          </Modal>
        );
      }
    },
  ),
);
