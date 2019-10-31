import React, { PureComponent } from 'react';
import { Form, Input, Button, Modal, Select } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
// import styles from './ApprovalSet.less';

const { Option } = Select;
@connect(({ approvalSet, loading }) => ({
  loading: loading.effects['approvalSet/approvalConfigDatas'],
  approvalConfigList: approvalSet.data,
}))
class ModelForm extends PureComponent {
  state = {
    // visible: false,
  };

  // 修改设置提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.handleCancel();
        this.saveConfig(values);
      }
    });
  };

  // 修改设置表格
  saveConfig = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalSet/saveConfigDatas',
      payload: param,
    });
  };

  render() {
    const { handleCancel, visible } = this.props;
    const { getFieldDecorator } = this.props.form;
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
    const formTailLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8, offset: 16 },
    };
    return (
      <Modal title="审批设置修改" visible={visible} closable={false} footer={false}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="流程模型名称">
            {getFieldDecorator('processName', {
              rules: [{ required: true, message: 'Please input your processName!' }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
          <Form.Item label="说明">
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: 'Please input your name!' }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
          <Form.Item label="启用状态" hasFeedback>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选启用状态' }],
              initialValue: '0',
            })(
              <Select style={{ width: 180 }}>
                <Option value="1">启用</Option>
                <Option value="0">停用</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item {...formTailLayout}>
            <Button
              type="primary"
              onClick={handleCancel}
              style={{
                backgroundColor: '#fff',
                borderColor: '#d9d9d9',
                marginRight: '20px',
                color: 'rgba(0, 0, 0, 0.65)',
              }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default Form.create()(ModelForm);
