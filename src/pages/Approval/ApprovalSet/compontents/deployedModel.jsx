import React, { PureComponent } from 'react';
import { Modal, Tabs } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
// import styles from './ApprovalSet.less';
const { TabPane } = Tabs;
@connect(({ approvalSet, loading }) => ({
  loading: loading.effects['approvalSet/approvalConfigDatas'],
  deployedModelDatas: approvalSet.deployedModelDatas,
  processDefinitionId: approvalSet.processDefinitionId,
  diagramDatas: approvalSet.diagramDatas,
  processImage: approvalSet.processImage,
}))
class DeployedModel extends PureComponent {
  state = {
    // visible: false,
  };

  componentDidMount() {
    // const { processDefinitionId } = this.props;
    // this.getProcessResource(processDefinitionId);
  }

  handleOk = () => {
    const { closeDeployedModel } = this.props;
    // console.log('processDefinitionId------>', processDefinitionId);
    // getFlowChart(processDefinitionId);
    closeDeployedModel();
    this.props.setFormValueType();
  };

  // 选择tab的选项,获取选中的模型id
  chooseTab = processDefinitionId => {
    this.changeProcessDefinitionId(processDefinitionId);
    this.props.getProcessResource(processDefinitionId);
    // console.log('chooseModelId-->', processDefinitionId);
  };

  // 修改processDefinitionId
  changeProcessDefinitionId = processDefinitionId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalSet/chooseProcessDefinitionId',
      payload: { processDefinitionId },
    });
  };

  render() {
    const { visible, closeDeployedModel, deployedModelDatas, processImage } = this.props;
    return (
      <Modal
        title="流程选择"
        width={1000}
        visible={visible}
        closable={false}
        onCancel={closeDeployedModel}
        onOk={this.handleOk}
      >
        <Tabs
          onChange={this.chooseTab}
          onTabClick={this.kkkk}
          defaultActiveKey="1"
          tabPosition="left"
          style={{ height: 260 }}
        >
          {deployedModelDatas.map(item => (
            <TabPane tab={item.name} key={item.processDefinitionId}>
              {item.name}
            </TabPane>
          ))}
          {processImage ? <img alt="" src={processImage} style={{ width: '100%' }} /> : null}
        </Tabs>
      </Modal>
    );
  }
}
export default DeployedModel;
