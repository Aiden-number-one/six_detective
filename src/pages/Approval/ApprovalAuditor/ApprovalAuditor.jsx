// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus */
import React, { PureComponent, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Drawer, Radio } from 'antd';
import { connect } from 'dva';
// import { formatMessage } from 'umi/locale';
import List from '@/components/List';
import btnStyles from '@/pages/DataImportLog/index.less';
// import classNames from 'classnames';
import styles from './ApprovalAuditor.less';

@connect(({ ApprovalAuditor }) => ({
  deployedModelDatas: ApprovalAuditor.deployedModelDatas,
  processDefinitionId: ApprovalAuditor.processDefinitionId,
  groupList: ApprovalAuditor.GroupList,
  checkboxData: ApprovalAuditor.checkboxData,
  auditorData: ApprovalAuditor.auditorData,
}))
class ApprovalAuditor extends PureComponent {
  state = {
    // dataSource: [],
    visible: false,
    stepId: '',
    checkedValues: '',
  };

  componentDidMount() {
    this.deployedModelList({ pageNumber: '1', pageSize: '10' });
    this.getQueryMenu();
    window.showAudit = (processDefinitionIds, taskIds) => {
      this.showDrawer(processDefinitionIds, taskIds);
    };
  }

  // 打开审核人设置弹窗
  showDrawer = async (processDefinitionIds, taskId) => {
    await this.getAuditorData(processDefinitionIds, taskId);
    const { auditorData } = this.props;
    const auditorChecked = (auditorData.length > 0 && auditorData[0].relateNo) || '';
    // console.log('auditorChecked---->', auditorData,auditorChecked);
    const checkedList = auditorChecked.length && auditorChecked;

    this.setState({
      visible: true,
      stepId: taskId,
      checkedValues: checkedList,
    });
  };

  // 添加审核角色
  saveConfig = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ApprovalAuditor/setAuditorConfigDatas',
      payload: param,
    });
  };

  // 保存角色
  onSave = () => {
    const { checkedValues, stepId } = this.state;
    const nodeAuditInfo = [];
    nodeAuditInfo.push({
      stepId,
      auditIds: checkedValues,
      auditType: '0',
    });
    const param = {
      processUuid: this.props.processDefinitionId,
      auditInfo: JSON.stringify(nodeAuditInfo),
    };
    this.saveConfig(param);
    this.setState({
      visible: false,
    });
  };

  // 获取角色
  getQueryMenu = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'ApprovalAuditor/getQueryMenuDatas',
      payload: {},
    });
  };

  // 查询审核人列表
  getAuditorData = async (processUuid, stepId) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'ApprovalAuditor/getAuditorlistDatas',
      payload: {
        processUuid,
        stepId,
      },
    });
  };

  // 获取已部署的模型列表
  deployedModelList = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ApprovalAuditor/deployedModelListDatas',
      payload: param,
    });
  };

  // 选择tab的选项,获取选中的模型id
  chooseTab = processDefinitionId => {
    if (processDefinitionId === this.props.processDefinitionId) {
      return;
    }
    this.changeProcessDefinitionId(processDefinitionId);
  };

  // 修改processDefinitionId
  changeProcessDefinitionId = processDefinitionId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ApprovalAuditor/chooseProcessDefinitionId',
      payload: { processDefinitionId },
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  selectAuditor = checkedValues => {
    console.log('checkedValues--999-->', checkedValues);
    this.setState({
      checkedValues: checkedValues.target.value,
    });
  };

  render() {
    // const plainOptions = ['Apple', 'Pear', 'Orange'];
    const { deployedModelDatas, processDefinitionId, checkboxData } = this.props;
    const { checkedValues } = this.state;
    console.log('checkboxData---', checkboxData, checkedValues);
    const diagramUrl = `/process/diagram-viewer/index.html?isClick=1&processDefinitionId=${processDefinitionId}`;
    return (
      <Fragment>
        <PageHeaderWrapper>
          <div className={styles.approvalAuditor}>
            <div className={styles.contentBox}>
              <div className={styles.leftBox}>
                <List
                  listData={deployedModelDatas}
                  chooseId={processDefinitionId}
                  currentId="processDefinitionId"
                  chooseTab={this.chooseTab}
                  title="List of deployed models"
                />
              </div>
              <div className={styles.rightBox}>
                <iframe title="diagram" width="100%" src={diagramUrl}></iframe>
              </div>
              <Drawer
                title="Auditor"
                width={500}
                onClose={this.onClose}
                visible={this.state.visible}
                bodyStyle={{ paddingBottom: 80 }}
                className={styles.drawerBox}
              >
                <Radio.Group
                  options={checkboxData}
                  value={checkedValues}
                  onChange={this.selectAuditor}
                />
                <div className={btnStyles['bottom-btns']}>
                  <Button onClick={this.onClose} style={{ marginRight: 12 }}>
                    Cancel
                  </Button>
                  <Button onClick={this.onSave} type="primary">
                    Save
                  </Button>
                </div>
              </Drawer>
            </div>
          </div>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default ApprovalAuditor;
