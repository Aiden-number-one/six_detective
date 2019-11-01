/* eslint-disable react/no-unused-state */
import React, { PureComponent, Fragment } from 'react';
import { Form, Icon, Divider, Table, Modal, Input, Button, Select } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
import styles from './TemplateSet.less';

const { TextArea } = Input;
const { Option } = Select;
@connect(({ templateConfig, loading }) => ({
  loading: loading.effects['templateConfig/templateDatas'],
  dataSource: templateConfig.data,
}))
class TemplateSet extends PureComponent {
  state = {
    dataSourceTest: [],
    formValue: {},
    visible: false,
  };

  componentDidMount() {
    // this.createData();
    this.getTemplateData();
  }

  // 请求模板列表数据
  getTemplateData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateConfig/templateDatas',
      payload: {},
    });
  };

  // 修改模板列表
  templateEdit = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateConfig/templateEdit',
      payload: param,
      callback: this.getTemplateData,
    });
  };

  // // 生成数据Data
  // createData = () => {
  //   const data = [];
  //   for (let i = 0; i < 46; i += 1) {
  //     data.push({
  //       key: i,
  //       templateName: `modelName ${i}`,
  //       templateId: `ID ${i}`,
  //       status: '开启',
  //       templateTitle: `标题 ${i}`,
  //       templateContent: `模板内容 ${i}`,
  //       templateKeys: '关键字',
  //     });
  //   }
  //   this.setState({
  //     dataSourceTest: data,
  //   });
  // };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.templateEdit(values);
        this.setState({
          visible: false,
        });
      }
    });
  };

  showModel = record => {
    this.setState({
      visible: true,
      formValue: record,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataSource } = this.props;
    const { formValue } = this.state;
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
    const checkColumns = [
      {
        title: '模板名称',
        align: 'center',
        dataIndex: 'templateName',
      },
      {
        title: '模板ID',
        align: 'center',
        dataIndex: 'templateId',
      },
      {
        title: '启用状态',
        align: 'center',
        dataIndex: 'status',
      },
      {
        title: '标题',
        align: 'center',
        dataIndex: 'templateTitle',
      },
      {
        title: '模板内容',
        align: 'center',
        dataIndex: 'templateContent',
      },
      {
        title: '关键字',
        align: 'center',
        dataIndex: 'templateKeys',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        render: (text, record) => <Icon type="edit" onClick={() => this.showModel(record)} />,
      },
    ];

    return (
      <Fragment>
        <div className={styles.templateSet}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              <Icon type="unordered-list" className={styles.icon} />
              <h2 className={styles.titleText}>模板设置</h2>
            </div>
            <Divider className={styles.divider} />
          </div>
          <Table
            columns={checkColumns}
            dataSource={dataSource}
            bordered
            className={styles.tableBox}
          />
          <Modal title="模板设置修改" visible={this.state.visible} closable={false} footer={false}>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item label="模板名称">
                {getFieldDecorator('templateName', {
                  rules: [{ required: true, message: 'Please input your name!' }],
                  initialValue: formValue.templateName,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item label="模板ID">
                {getFieldDecorator('templateId', {
                  rules: [{ required: true, message: 'Please input your id!' }],
                  initialValue: formValue.templateId,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item label="启用状态" hasFeedback>
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '请选启用状态' }],
                  initialValue: formValue.status || 1,
                })(
                  <Select style={{ width: 180 }}>
                    <Option value="1">开启</Option>
                    <Option value="0">关闭</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="标题">
                {getFieldDecorator('templateTitle', {
                  rules: [{ required: true, message: 'Please input your title!' }],
                  initialValue: formValue.templateTitle,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="模板内容:">
                {getFieldDecorator('templateContent', {
                  rules: [{ required: true, message: 'Please input your content!' }],
                  initialValue: formValue.templateContent,
                })(<TextArea rows={4} />)}
              </Form.Item>
              <Form.Item label="关键字">
                {getFieldDecorator('templateKeys', {
                  rules: [{ required: true, message: 'Please input your keyword!' }],
                  initialValue: formValue.templateKeys,
                })(<Input />)}
              </Form.Item>
              <Form.Item {...formTailLayout}>
                <Button
                  type="primary"
                  onClick={this.handleCancel}
                  style={{
                    backgroundColor: '#fff',
                    borderColor: '#d9d9d9',
                    marginRight: '20px',
                    color: 'rgba(0, 0, 0, 0.65)',
                  }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                >
                  确定
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Fragment>
    );
  }
}

const TemplateSetForm = Form.create()(TemplateSet);

export default TemplateSetForm;
