// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus */
import React, { PureComponent, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, Tabs, Modal, Upload, message } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
import styles from './ApprovalDesign.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
@connect(({ approvalDesign }) => ({
  modelList: approvalDesign.data,
  chooseModelId: approvalDesign.chooseModelId,
  modelImage: approvalDesign.modelImage,
}))
class ApprovalDesign extends PureComponent {
  state = {
    // dataSource: [],
    visible: false,
  };

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
    dispatch({
      type: 'approvalDesign/deployModel',
      payload: {
        modelId: chooseModelId,
      },
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

  // 绑定的点击事件,删除模型
  delete = () => {
    const { chooseModelId } = this.props;
    const param = { modelId: chooseModelId };
    this.deleteModel(param);
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

  // 下载文件
  downloadFile = filePath => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalDesign/downloadFile',
      payload: {
        filePath,
      },
    });
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
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalDesign/changeModelId',
      payload: { chooseModelId },
    });
    this.getModelImage(chooseModelId);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.createModel(values);
        this.setState({
          visible: false,
        });
      }
    });
  };

  showModal = () => {
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
    const { getFieldDecorator } = this.props.form;
    const { modelList, modelImage } = this.props;
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
      <Fragment>
        <PageHeaderWrapper>
          <div className={styles.approvalDesign}>
            <div className={styles.contentBox}>
              <div className={styles.buttonBox}>
                <Button onClick={this.deployModel} type="primary" icon="deployment-unit">
                  部署模型
                </Button>
                <Button onClick={this.goProcessPage} type="primary" icon="edit">
                  编辑模型
                </Button>
                <Button type="primary" icon="delete" onClick={this.delete}>
                  删除模型
                </Button>
                <Button onClick={this.exportModel} type="primary" icon="export">
                  导出模型
                </Button>
                <Upload onChange={info => this.importFileStatus(info)} action="/upload">
                  <Button type="primary" icon="import">
                    导入模型
                  </Button>
                </Upload>
              </div>
              <div className={styles.tabsBox}>
                <div className={styles.modelTitleBox}>
                  <span style={{ color: '#ff4638', fontSize: '18px', fontWeight: 'bold' }}>
                    模型列表
                  </span>
                  <Button
                    type="primary"
                    icon="file-add"
                    onClick={this.showModal}
                    style={{ marginRight: '0', float: 'right' }}
                  >
                    新建模型
                  </Button>
                </div>
                <Tabs
                  onChange={this.chooseTab}
                  defaultActiveKey="1"
                  tabPosition="left"
                  style={{ height: 600, marginTop: '20px' }}
                  tabBarStyle={{ width: 200 }}
                  type="card editable-card"
                >
                  {modelList.map(item => (
                    <TabPane tab={item.name} key={item.id}>
                      {item.name}
                    </TabPane>
                  ))}
                  {modelImage ? <img src={modelImage} alt="" /> : null}
                </Tabs>
              </div>
            </div>
            <Modal title="新模型" visible={this.state.visible} footer={false} closable={false}>
              <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please input your name!' }],
                  })(<Input placeholder="至少2个字符,最多16个字符" />)}
                </Form.Item>
                <Form.Item label="描述:">
                  {getFieldDecorator('description', {
                    rules: [{ required: true, message: 'Please input your description!' }],
                  })(<TextArea rows={4} />)}
                </Form.Item>

                <Form.Item {...formTailLayout}>
                  <Button onClick={this.handleCancel}>取消</Button>
                  <Button type="primary" htmlType="submit">
                    确定
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default Form.create()(ApprovalDesign);
