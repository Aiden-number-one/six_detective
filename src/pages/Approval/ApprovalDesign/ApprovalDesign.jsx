// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus */
import React, { PureComponent, Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, Modal, Upload, message, Drawer, Icon } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import List from '@/components/List';
import btnStyles from '@/pages/DataImportLog/index.less';
// import classNames from 'classnames';
import styles from './ApprovalDesign.less';

const { TextArea } = Input;

class ModelForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="Name" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your name!' }],
          })(<Input placeholder="" />)}
        </Form.Item>
        <Form.Item label="Description:" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please input your description!' }],
          })(<TextArea rows={4} />)}
        </Form.Item>
      </Form>
    );
  }
}
const AddFlowChartForm = Form.create({})(ModelForm);

@connect(({ approvalDesign }) => ({
  modelList: approvalDesign.data,
  chooseModelId: approvalDesign.chooseModelId,
  modelImage: approvalDesign.modelImage,
}))
class ApprovalDesign extends PureComponent {
  state = {
    // dataSource: [],
    visible: false,
    deleteVisible: false,
    deployVisible: false,
  };

  newFlowChartForm = React.createRef();

  componentDidMount() {
    // this.createData();
    this.getModelList('1', '10');
  }

  // 获取model列表
  getModelList = (pageNumber, pageSize, isShowCallBack2 = false) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalDesign/modelListDatas',
      payload: {
        pageNumber,
        pageSize,
      },
      callback: modelId => this.getModelImage(modelId),
      callback2: isShowCallBack2 ? this.goProcessPage : null,
    });
  };

  // 获取model图片
  getModelImage = modelId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalDesign/modelImageDatas',
      payload: {
        modelId,
      },
    });
  };

  // 新建模型
  createModel = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalDesign/createModel',
      payload: param,
      callback: (pageNumber, pageSize) => this.getModelList(pageNumber, pageSize, true),
    });
  };

  // 跳转到编辑页
  goProcessPage = () => {
    const { chooseModelId } = this.props;
    const url = `/process/modeler.html?modelId=${chooseModelId}`;
    window.location.href = url;
  };

  // 删除模型
  deleteModel = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalDesign/deleteModel',
      payload: param,
      callback: (pageNumber, pageSize) => this.getModelList(pageNumber, pageSize),
    });
  };

  // 部署模型
  deployModel = () => {
    const { dispatch, chooseModelId } = this.props;
    this.handleCloseDeploy();
    dispatch({
      type: 'approvalDesign/deployModel',
      payload: {
        modelId: chooseModelId,
      },
    });
  };

  // 绑定的点击事件,部署模型对话框
  deployOpenModel = () => {
    this.setState({
      deployVisible: true,
    });
  };

  // 弹出的对话框取消部署
  handleCloseDeploy = () => {
    this.setState({
      deployVisible: false,
    });
  };

  // 导入模型
  importModel = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalDesign/importModel',
      payload: param,
      callback: (pageNumber, pageSize) => this.getModelList(pageNumber, pageSize),
    });
  };

  // 绑定的点击事件,删除模型对话框
  deleteOpenModel = () => {
    this.setState({
      deleteVisible: true,
    });
  };

  // 弹出的对话框确定删除
  handleDeleteOk = () => {
    const { chooseModelId } = this.props;
    const param = { modelId: chooseModelId };
    this.deleteModel(param);
    this.setState({
      deleteVisible: false,
    });
  };

  // 弹出的对话框取消删除
  handleCloseModelCancel = () => {
    this.setState({
      deleteVisible: false,
    });
  };

  // 上传文件
  importFileStatus = info => {
    if (info.file.status === 'done') {
      const url = info.file.response.bcjson.items.relativeUrl;
      // console.log(info)
      this.importModel({ filename: url });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // 导出模型
  exportModel = () => {
    const { dispatch, chooseModelId } = this.props;
    dispatch({
      type: 'approvalDesign/exportModel',
      payload: {
        modelId: chooseModelId,
        type: 'xml',
      },
      callback: filePath => this.downloadHerf(filePath),
    });
  };

  // 下载模型
  downloadHerf = filePath => {
    const a = document.createElement('a');
    a.href = `/download?filePath=${filePath}`;
    a.download = true;
    a.click();
  };

  // 上传文件
  uploadFile = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalDesign/uploadFile',
      payload: { param },
    });
  };

  // 选择tab的选项,获取选中的模型id
  chooseTab = chooseModelId => {
    if (chooseModelId === this.props.chooseModelId) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalDesign/changeModelId',
      payload: { chooseModelId },
    });
    this.getModelImage(chooseModelId);
  };

  AddNewFlowChart = () => {
    this.newFlowChartForm.current.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.createModel(values);
        this.setState({
          visible: false,
        });
      }
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { modelList, chooseModelId, modelImage } = this.props;
    const { deleteVisible, deployVisible } = this.state;
    return (
      <Fragment>
        <PageHeaderWrapper>
          <div className={styles.approvalDesign}>
            <div className={styles.contentBox}>
              <div className={styles.leftBox}>
                <Icon
                  type="file-add"
                  onClick={this.showDrawer}
                  style={{ marginRight: '15px', marginTop: '8px', float: 'right' }}
                />
                <List
                  listData={modelList}
                  chooseId={chooseModelId}
                  currentId="id"
                  chooseTab={this.chooseTab}
                  title="Flow Chart List"
                />
              </div>
              <div className={styles.rightBox}>
                <div>
                  <Button
                    className="btn-usual"
                    onClick={this.deployOpenModel}
                    type="primary"
                    icon="deployment-unit"
                  >
                    {formatMessage({ id: 'systemManagement.flowDesign.flowRelease' })}
                  </Button>
                  <Button
                    className="btn-usual"
                    onClick={this.goProcessPage}
                    type="primary"
                    icon="edit"
                  >
                    {formatMessage({ id: 'systemManagement.flowDesign.flowModify' })}
                  </Button>
                  <Button
                    className="btn-usual"
                    type="primary"
                    icon="delete"
                    onClick={this.deleteOpenModel}
                  >
                    {formatMessage({ id: 'systemManagement.flowDesign.flowDelete' })}
                  </Button>
                  <Button
                    className="btn-usual"
                    onClick={this.exportModel}
                    type="primary"
                    icon="export"
                  >
                    {formatMessage({ id: 'systemManagement.flowDesign.flowExport' })}
                  </Button>
                  <Upload
                    onChange={info => this.importFileStatus(info)}
                    action="/upload?fileClass=WORKFLOW"
                  >
                    <Button className="btn-usual" type="primary" icon="import">
                      {formatMessage({ id: 'systemManagement.flowDesign.flowImport' })}
                    </Button>
                  </Upload>
                </div>
                <div>{modelImage ? <img src={modelImage} alt="" /> : null}</div>
              </div>
            </div>
            <Drawer
              title="New Flow Chart"
              width={500}
              onClose={this.handleCancel}
              visible={this.state.visible}
              bodyStyle={{ paddingBottom: 80 }}
            >
              <AddFlowChartForm ref={this.newFlowChartForm} />
              <div className={btnStyles['bottom-btns']}>
                <Button onClick={this.AddNewFlowChart} type="primary">
                  Save
                </Button>
                <Button onClick={this.handleCancel} style={{ marginRight: 12 }}>
                  Cancel
                </Button>
              </div>
            </Drawer>
            <Modal
              title="delete"
              visible={deleteVisible}
              onOk={this.handleDeleteOk}
              onCancel={this.handleCloseModelCancel}
            >
              <p>Are you sure delete this model?</p>
            </Modal>
            <Modal
              title="CONFIRM"
              visible={deployVisible}
              onOk={this.deployModel}
              onCancel={this.handleCloseDeploy}
            >
              <p>Are you sure deploy this model?</p>
            </Modal>
          </div>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default ApprovalDesign;
