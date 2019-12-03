// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus */
import React, { PureComponent, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, Modal, Upload, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
// import classNames from 'classnames';
import styles from './ApprovalDesign.less';

const { TextArea } = Input;

// eslint-disable-next-line react/require-render-return
// class ApprovalFrom extends Component {
//   render() {
//     const { getFieldDecorator } = this.props.form;
//     const formItemLayout = {
//       labelCol: {
//         xs: { span: 24 },
//         sm: { span: 8 },
//       },
//       wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 16 },
//       },
//     };
//     const formTailLayout = {
//       labelCol: { span: 8 },
//       wrapperCol: { span: 12, offset: 12 },
//     };
//     // eslint-disable-next-line no-unused-expressions
//     <Form {...formItemLayout} onSubmit={this.handleSubmit}>
//       <Form.Item label="名称">
//         {getFieldDecorator('name', {
//           rules: [{ required: true, message: 'Please input your name!' }],
//         })(<Input placeholder="至少2个字符,最多16个字符" />)}
//       </Form.Item>
//       <Form.Item label="描述:">
//         {getFieldDecorator('description', {
//           rules: [{ required: true, message: 'Please input your description!' }],
//         })(<TextArea rows={4} />)}
//       </Form.Item>

//       <Form.Item {...formTailLayout}>
//         <Button onClick={this.handleCancel}>取消</Button>
//         <Button type="primary" htmlType="submit">
//           确定
//         </Button>
//       </Form.Item>
//     </Form>;
//   }
// }

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
    const { modelList, chooseModelId, modelImage } = this.props;
    const { deleteVisible } = this.state;
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
              <div className={styles.leftBox}>
                <Button
                  type="primary"
                  className="button_two"
                  icon="file-add"
                  onClick={this.showModal}
                  style={{ marginRight: '0', float: 'right' }}
                >
                  {formatMessage({ id: 'systemManagement.flowDesign.newFlowChart' })}
                </Button>
                <div className="">
                  <h2>模型列表</h2>
                  <ul>
                    {modelList.map(item => (
                      <li
                        key={item.id}
                        onClick={() => {
                          this.chooseTab(item.id);
                        }}
                        className={chooseModelId === item.id ? styles.liActive : null}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={styles.rightBox}>
                <div>
                  <Button
                    className="button_two"
                    onClick={this.deployModel}
                    type="primary"
                    icon="deployment-unit"
                  >
                    {formatMessage({ id: 'systemManagement.flowDesign.flowRelease' })}
                  </Button>
                  <Button
                    className="button_two"
                    onClick={this.goProcessPage}
                    type="primary"
                    icon="edit"
                  >
                    {formatMessage({ id: 'systemManagement.flowDesign.flowModify' })}
                  </Button>
                  <Button
                    className="button_two"
                    type="primary"
                    icon="delete"
                    onClick={this.deleteOpenModel}
                  >
                    {formatMessage({ id: 'systemManagement.flowDesign.flowDelete' })}
                  </Button>
                  <Button
                    className="button_two"
                    onClick={this.exportModel}
                    type="primary"
                    icon="export"
                  >
                    {formatMessage({ id: 'systemManagement.flowDesign.flowExport' })}
                  </Button>
                  <Upload onChange={info => this.importFileStatus(info)} action="/upload">
                    <Button className="button_two" type="primary" icon="import">
                      {formatMessage({ id: 'systemManagement.flowDesign.flowImport' })}
                    </Button>
                  </Upload>
                </div>
                <div>{modelImage ? <img src={modelImage} alt="" /> : null}</div>
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
            <Modal
              title="delete"
              visible={deleteVisible}
              onOk={this.handleDeleteOk}
              onCancel={this.handleCloseModelCancel}
            >
              <p>Are you sure delete this model?</p>
            </Modal>
          </div>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default Form.create()(ApprovalDesign);
