// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus */
import React, { PureComponent, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Drawer, Checkbox } from 'antd';
import { connect } from 'dva';
// import { formatMessage } from 'umi/locale';
// import classNames from 'classnames';
import styles from './ApprovalAuditor.less';

@connect(({ ApprovalAuditor }) => ({
  deployedModelDatas: ApprovalAuditor.deployedModelDatas,
  processDefinitionId: ApprovalAuditor.processDefinitionId,
}))
class ApprovalAuditor extends PureComponent {
  state = {
    // dataSource: [],
    visible: false,
  };

  componentDidMount() {
    this.deployedModelList({ pageNumber: '1', pageSize: '10' });
    window.showAudit = (processDefinitionIds, taskIds) => {
      this.showDrawer(taskIds);
    };
  }

  // 打开审核人设置弹窗
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showDrawer = async taskId => {
    this.setState({
      visible: true,
    });
    // const { formValue } = this.props;
    // await this.getAuditorData(formValue.configId, taskId);
    // const { allChooseObj, taskIds } = this.state;
    // let targetKeysCurrent = [];
    // if (taskIds !== taskId && this.props.auditorData.length) {
    //   for (let i = 0; i < this.props.auditorData.length; i += 1) {
    //     targetKeysCurrent.push(this.props.auditorData[i].relateNo);
    //   }
    // } else if (allChooseObj.hasOwnProperty(taskIds)) {
    //   targetKeysCurrent = allChooseObj[taskIds];
    // }
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

  // 获取已部署的模型列表
  deployedModelList = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ApprovalAuditor/deployedModelListDatas',
      payload: param,
      callback: processDefinitionId => this.getProcessResource(processDefinitionId),
    });
  };

  // 查询流程定义的资源图
  getProcessResource = processDefinitionId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ApprovalAuditor/getProcessResourceDatas',
      payload: {
        processDefinitionId,
        type: 'image',
      },
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
    console.log('checkedValues---->', checkedValues);
  };

  render() {
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const { deployedModelDatas, processDefinitionId } = this.props;
    const diagramUrl = `/process/diagram-viewer/index.html?isClick=1&processDefinitionId=${processDefinitionId}`;
    return (
      <Fragment>
        <PageHeaderWrapper>
          <div className={styles.approvalAuditor}>
            <div className={styles.contentBox}>
              <div className={styles.leftBox}>
                <div className="">
                  <h2>模型列表</h2>
                  <ul>
                    {deployedModelDatas.map(item => (
                      <li
                        key={item.processDefinitionId}
                        onClick={() => {
                          this.chooseTab(item.processDefinitionId);
                        }}
                        className={
                          processDefinitionId === item.processDefinitionId ? styles.liActive : null
                        }
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={styles.rightBox}>
                <iframe
                  title="diagram"
                  width="100%"
                  height="300px"
                  border="unset"
                  src={diagramUrl}
                ></iframe>
              </div>
              <Drawer
                title="Auditor"
                width={500}
                onClose={this.onClose}
                visible={this.state.visible}
                bodyStyle={{ paddingBottom: 80 }}
              >
                <Checkbox.Group options={plainOptions} onChange={this.selectAuditor} />
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
                  <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                    Cancel
                  </Button>
                  <Button onClick={this.onClose} type="primary">
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
