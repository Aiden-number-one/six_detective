// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus */
import React, { PureComponent, Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, Table, Row, Col, Drawer, Select } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
// import classNames from 'classnames';
import styles from './ApprovalConfiguration.less';

const { Option } = Select;

class SearchForm extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { search } = this.props;
    return (
      <Form className="ant-advanced-search-form">
        <Row gutter={{ xs: 24, sm: 48, md: 144, lg: 48, xl: 96 }}>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="Function ID" colon={false}>
              {getFieldDecorator('businessName')(<Input />)}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="Flow Name" colon={false}>
              {getFieldDecorator('processName')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <div className="btnArea">
          <Button type="primary" onClick={search}>
            Search
          </Button>
        </div>
      </Form>
    );
  }
}
const ConfigurationForm = Form.create({})(SearchForm);

class DrawerForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { flowNameList, configItem } = this.props;
    // console.log('businessName--', configItem);
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="Function ID" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('name', {
            initialValue: configItem.businessName || '',
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="Flow Name" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('operationType', {
            rules: [{ required: false }],
            initialValue: configItem.processName,
          })(
            <Select>
              {flowNameList.map(item => (
                <Option value={item.name}>{item.name}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Form>
    );
  }
}
const ModifyForm = Form.create({})(DrawerForm);

@connect(({ approvalConfiguration, loading }) => ({
  loading: loading.effects['approvalConfiguration/approvalConfigDatas'],
  approvalConfigList: approvalConfiguration.data,
  deployedModelList: approvalConfiguration.deployedModelDatas,
}))
class ApprovalConfiguration extends PureComponent {
  state = {
    visible: false,
    configItem: {},
  };

  newConfigurationForm = React.createRef();

  newModifyForm = React.createRef();

  componentDidMount() {
    this.configData({
      pageNumber: '1',
      pageSize: '10',
    });
    this.deployedModelList({ pageNumber: '1', pageSize: '10' });
  }

  // 获取查询设置列表数据
  configData = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalConfiguration/approvalConfigDatas',
      payload: param,
    });
  };

  // 获取已部署的模型列表
  deployedModelList = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalConfiguration/deployedModelListDatas',
      payload: param,
    });
  };

  // 查询表单提交
  handleSubmit = () => {
    this.newConfigurationForm.current.validateFields((err, values) => {
      this.configData({
        pageNumber: '1',
        pageSize: '10',
        businessName: values.businessName,
        processName: values.processName,
      });
    });
  };

  showModel = record => {
    this.setState({
      visible: true,
      configItem: record,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handelSave = () => {
    this.newModifyForm.current.validateFields((err, values) => {
      console.log('values-------->', values);
    });
  };

  render() {
    const { approvalConfigList, deployedModelList } = this.props;
    const { configItem } = this.state;
    const setColumns = [
      {
        title: 'Function ID',
        dataIndex: 'businessName',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'systemManagement.flowConfig.flowName' }),
        dataIndex: 'processName',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.common.operation' }),
        dataIndex: 'operation',
        align: 'center',
        render: (text, record) => (
          <span>
            <a href="#" onClick={() => this.showModel(record)}>
              {formatMessage({ id: 'app.common.modify' })}
            </a>
          </span>
        ),
      },
    ];

    return (
      <Fragment>
        <PageHeaderWrapper>
          <div className={styles.approvalConfiguration}>
            <ConfigurationForm search={this.handleSubmit} ref={this.newConfigurationForm} />
            <div className={styles.content}>
              <Table
                columns={setColumns}
                dataSource={approvalConfigList}
                className={styles.tableBox}
                pagination={{
                  size: 'small',
                }}
              />
            </div>
            <Drawer
              title="Set Flow Name"
              width={500}
              onClose={this.handleCancel}
              visible={this.state.visible}
              bodyStyle={{ paddingBottom: 80 }}
            >
              <ModifyForm
                flowNameList={deployedModelList}
                configItem={configItem}
                ref={this.newModifyForm}
              />
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
                <Button onClick={this.handleCancel} style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                <Button onClick={this.handelSave} type="primary">
                  Save
                </Button>
              </div>
            </Drawer>
          </div>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default ApprovalConfiguration;
