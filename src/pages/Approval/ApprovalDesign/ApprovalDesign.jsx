/* eslint-disable no-plusplus */
import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Icon, Button, Divider, Tabs, Modal } from 'antd';
// import { connect } from 'dva';
// import classNames from 'classnames';
import styles from './ApprovalDesign.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
class ApprovalDesign extends PureComponent {
  state = {
    dataSource: [],
    visible: false,
  };

  componentDidMount() {
    this.createData();
  }

  // 生成数据model
  createData = () => {
    const data = [];
    for (let i = 0; i < 46; i++) {
      data.push({
        key: i,
        modelName: `SuperLop项目部署流程 ${i}`,
        modelValue: `流程图 ${i}`,
      });
    }
    this.setState({
      dataSource: data,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { dataSource } = this.state;
    return (
      <Fragment>
        <div className={styles.approvalDesign}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              <Icon type="unordered-list" className={styles.icon} />
              <h2 className={styles.titleText}>流程设计工作区</h2>
            </div>
            <Divider className={styles.divider} />
          </div>
          <div className={styles.contentBox}>
            <div className={styles.buttonBox}>
              <Button type="primary" icon="deployment-unit">
                部署模型
              </Button>
              <Button type="primary" icon="edit">
                编辑模型
              </Button>
              <Button type="primary" icon="delete">
                删除模型
              </Button>
              <Button type="primary" icon="import">
                导入模型
              </Button>
              <Button type="primary" icon="export">
                导出模型
              </Button>
            </div>
            <div className={styles.tabsBox}>
              <div className={styles.modelTitleBox}>
                <span>模型列表</span>
                <Button type="primary" icon="file-add" onClick={this.showModal}>
                  新建模型
                </Button>
              </div>
              <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: 400 }}>
                {dataSource.map(item => (
                  <TabPane tab={item.modelName} key={item.key}>
                    {item.modelValue}
                  </TabPane>
                ))}
              </Tabs>
            </div>
          </div>
          <Modal
            title="新模型"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form.Item label="名称:">
              <Input placeholder="至少2个字符,最多16个字符" />
            </Form.Item>
            <Form.Item label="描述:">
              <TextArea rows={4} />
            </Form.Item>
          </Modal>
        </div>
      </Fragment>
    );
  }
}

export default ApprovalDesign;
