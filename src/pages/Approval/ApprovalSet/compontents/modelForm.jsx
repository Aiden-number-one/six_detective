/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { connect } from 'dva';
import DeployedModel from './deployedModel';
import TransferModal from './transferModal';
// import { async } from 'q';
// import classNames from 'classnames';
// import styles from './ApprovalSet.less';
const { Search } = Input;
@connect(({ approvalSet, loading }) => ({
  loading: loading.effects['approvalSet/approvalConfigDatas'],
  approvalConfigList: approvalSet.data,
  deployedModelDatas: approvalSet.deployedModelDatas,
  processDefinitionId: approvalSet.processDefinitionId,
  auditorData: approvalSet.auditorData,
}))
class ModelForm extends PureComponent {
  state = {
    deployedModelVisible: false,
    isShowTransferModal: false,
    taskIds: '',
    targetKeys: [],
    auditInfo: [],
    allChooseObj: {},
  };

  componentDidMount() {
    window.showAudit = (processDefinitionIds, taskIds) => {
      this.showTransferModal(taskIds);
    };
  }

  handleTransferOk = () => {
    const { targetKeys, allChooseObj, auditInfo, taskIds } = this.state;
    allChooseObj[taskIds] = targetKeys;

    // auditInfo.concat(nodeAuditInfo);
    console.log('auditInfo------>', auditInfo, allChooseObj, targetKeys);
    this.closeTransferModal();
  };

  onTransferChange = targetKeys => {
    console.log('Target Keys:', targetKeys);
    this.setState({ targetKeys });
  };

  // 修改设置提交
  handleSubmit = e => {
    const { formValue } = this.props;
    const { allChooseObj } = this.state;
    const nodeAuditInfo = [];
    for (const key in allChooseObj) {
      if (allChooseObj.hasOwnProperty(key)) {
        for (let i = 0; i < allChooseObj[key].length; i += 1) {
          nodeAuditInfo.push({
            stepId: key,
            auditIds: allChooseObj[key][i],
            auditType: '0',
          });
        }
      }
    }
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        // this.props.handleCancel();
        const param = {
          configId: formValue.configId,
          processUuid: formValue.processUuid,
          remark: values.remark,
          processName: values.processName,
          auditInfo: JSON.stringify(nodeAuditInfo),
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

  // 查询审核人列表
  getAuditorData = async (configId, stepId) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'approvalSet/getAuditorlistDatas',
      payload: {
        configId,
        stepId,
      },
    });
  };

  // 打开审核人设置弹窗
  showTransferModal = async taskId => {
    const { formValue } = this.props;
    await this.getAuditorData(formValue.configId, taskId);
    const { allChooseObj, taskIds } = this.state;
    let targetKeysCurrent = [];
    if (taskIds !== taskId && this.props.auditorData.length) {
      for (let i = 0; i < this.props.auditorData.length; i += 1) {
        targetKeysCurrent.push(this.props.auditorData[i].relateNo);
      }
    } else if (allChooseObj.hasOwnProperty(taskIds)) {
      targetKeysCurrent = allChooseObj[taskIds];
    }
    this.setState({
      isShowTransferModal: true,
      targetKeys: targetKeysCurrent,
      taskIds: taskId,
    });
  };

  setDefaultTargetKeys = auditorData => {
    const targetKeysCurrent = [];
    for (let i = 0; i < auditorData.length; i += 1) {
      targetKeysCurrent.push(auditorData.relateNo);
    }
    // this.setState({
    //   targetKeys: targetKeysCurrent,
    // });
  };

  // 关闭审核人设置弹窗
  closeTransferModal = () => {
    this.setState({
      isShowTransferModal: false,
    });
  };

  // 设置form表单值显示内容
  setFormValueType = () => {
    // const { diagramDatas } = this.props;
    // this.props.form.setFieldsValue({
    //   processName: diagramDatas.processDefinition.name,
    // });
  };

  render() {
    const {
      handleCancel,
      visible,
      formValue,
      getProcessResource,
      processDefinitionId,
    } = this.props;
    const diagramUrl = `/process/diagram-viewer/index.html?isClick=1&processDefinitionId=${processDefinitionId}`;
    const { getFieldDecorator } = this.props.form;
    const { deployedModelVisible, isShowTransferModal, taskIds, targetKeys } = this.state;
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
        <Modal
          title="审批设置修改"
          visible={visible}
          closable={false}
          footer={false}
          width={1000}
          height={1000}
        >
          <iframe title="diagram" width="100%" height="200px" src={diagramUrl}></iframe>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="流程模型选择">
              {getFieldDecorator('processName', {
                rules: [{ required: true, message: 'Please input your processName!' }],
                initialValue: formValue.processName,
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

          <TransferModal
            closeTransferModal={this.closeTransferModal}
            visible={isShowTransferModal}
            taskIds={taskIds}
            targetKeys={targetKeys}
            onTransferChange={this.onTransferChange}
            handleTransferOk={this.handleTransferOk}
          />
        </Modal>
        <DeployedModel
          closeDeployedModel={this.closeDeployedModel}
          getProcessResource={getProcessResource}
          setFormValueType={this.setFormValueType}
          visible={deployedModelVisible}
        />
      </div>
    );
  }
}
export default Form.create()(ModelForm);
