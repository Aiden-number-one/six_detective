/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { connect } from 'dva';
import DeployedModel from './deployedModel';
// import classNames from 'classnames';
// import styles from './ApprovalSet.less';
const { Search } = Input;
@connect(({ approvalSet, loading }) => ({
  loading: loading.effects['approvalSet/approvalConfigDatas'],
  approvalConfigList: approvalSet.data,
  deployedModelDatas: approvalSet.deployedModelDatas,
  diagramDatas: approvalSet.diagramDatas,
}))
class ModelForm extends PureComponent {
  state = {
    deployedModelVisible: false,
    isShowDeafultFormValue: true,
  };

  componentDidMount() {}

  // 修改设置提交
  handleSubmit = e => {
    const { formValue } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.handleCancel();
        const param = {
          configId: formValue.configId,
          processUuid: formValue.processUuid,
          remark: values.remark,
          processName: values.processName,
          auditInfo: '',
        };
        this.saveConfig(param);
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

  // 打开流程列表弹窗
  showDeployedModel = () => {
    this.setState({
      deployedModelVisible: true,
    });
  };

  // 关闭流程列表弹窗
  closeDeployedModel = () => {
    this.setState({
      deployedModelVisible: false,
    });
  };

  // 设置form表单值显示内容
  setFormValueType = () => {
    const { diagramDatas } = this.props;
    this.props.form.setFieldsValue({
      processName: diagramDatas.processDefinition.name,
    });
  };

  render() {
    const { handleCancel, visible, formValue, getFlowChart, getProcessResource } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { deployedModelVisible } = this.state;
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
      wrapperCol: { span: 12, offset: 12 },
    };
    return (
      <div>
        <Modal title="审批设置修改" visible={visible} closable={false} footer={false}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="流程模型名称">
              {getFieldDecorator('processName', {
                rules: [{ required: true, message: 'Please input your processName!' }],
                initialValue: formValue.businessName,
              })(<Search onClick={this.showDeployedModel} style={{ width: 200 }} />)}
            </Form.Item>
            <Form.Item label="说明">
              {getFieldDecorator('remark', {
                rules: [{ required: true, message: 'Please input your name!' }],
                initialValue: formValue.remark,
              })(<Input />)}
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
          <div>动态流程图</div>
        </Modal>
        <DeployedModel
          closeDeployedModel={this.closeDeployedModel}
          getFlowChart={getFlowChart}
          getProcessResource={getProcessResource}
          setFormValueType={this.setFormValueType}
          visible={deployedModelVisible}
        />
      </div>
    );
  }
}
export default Form.create()(ModelForm);
