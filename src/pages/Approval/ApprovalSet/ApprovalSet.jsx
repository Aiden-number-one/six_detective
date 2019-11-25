// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus */
import React, { PureComponent, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Icon, Input, Button, Table, Popconfirm, Switch, Row, Col } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import ModelForm from './compontents/modelForm';
// import classNames from 'classnames';
import styles from './ApprovalSet.less';

@connect(({ approvalSet, loading }) => ({
  loading: loading.effects['approvalSet/approvalConfigDatas'],
  approvalConfigList: approvalSet.data,
}))
class ApprovalConifg extends PureComponent {
  state = {
    // dataSource: [],
    // count: 0,
    visible: false,
    formValue: {},
  };

  componentDidMount() {
    // this.props.form.validateFields();
    this.configData({
      pageNumber: '1',
      pageSize: '10',
    });
    this.deployedModelList({ pageNumber: '1', pageSize: '10' });
    this.fetchRoleGroupDatas();
    // this.createData();
  }

  // 获取查询设置列表数据
  configData = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalSet/approvalConfigDatas',
      payload: param,
    });
  };

  // 获取角色树datas
  fetchRoleGroupDatas = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalSet/getRoleGroupDatas',
      payload: param,
    });
  };

  // 获取已部署的模型列表
  deployedModelList = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalSet/deployedModelListDatas',
      payload: param,
      callback: processDefinitionId => this.getProcessResource(processDefinitionId),
    });
  };

  // 修改审批设置状态 是否启用
  handleSetConfigStatus = param => {
    const { dispatch } = this.props;
    const newStatus = param.status === '1' ? '0' : '1';
    dispatch({
      type: 'approvalSet/setConfigStatus',
      payload: {
        configId: param.configId,
        status: newStatus,
        isDefault: param.isDefault,
      },
    });
  };

  // 修改审批设置状态 是否默认
  handleSetConfigDefault = param => {
    const { dispatch } = this.props;
    const newDefault = param.isDefault === '1' ? '0' : '1';
    dispatch({
      type: 'approvalSet/setConfigStatus',
      payload: {
        configId: param.configId,
        status: param.status,
        isDefault: newDefault,
      },
    });
  };

  // 查询流程定义的资源图
  getProcessResource = processDefinitionId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalSet/getProcessResourceDatas',
      payload: {
        processDefinitionId,
        type: 'image',
      },
    });
  };

  // 查询表单提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.configData({
          pageNumber: '1',
          pageSize: '10',
          remark: values.remark,
        });
      }
    });
  };

  // 增加行 dom
  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalSet/addConfigDatas',
      payload: '',
      callback: param => this.configData(param),
    });
  };

  // 删除行
  handleDelete = configId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalSet/deleteConfigDatas',
      payload: { configId },
      callback: param => this.configData(param),
    });
    // const { dataSource } = this.state;
    // const dataSourceCopy = [...dataSource];
    // this.setState({ dataSource: dataSourceCopy.filter(item => item.key !== key) });
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
    const { visible, formValue } = this.state;
    const { approvalConfigList } = this.props;
    const { getFieldDecorator } = this.props.form;

    const setColumns = [
      {
        title: '序号',
        dataIndex: 'number',
        align: 'center',
        render: (text, record) => ({
          children: <div>{record.configId}</div>,
        }),
      },
      {
        title: '业务名称',
        dataIndex: 'businessName',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'systemManagement.flowConfig.flowName' }),
        dataIndex: 'processName',
        align: 'center',
      },
      {
        title: '说明',
        dataIndex: 'remark',
        align: 'center',
      },
      {
        title: '是否启用',
        dataIndex: 'status',
        align: 'center',
        render: (text, record) => ({
          children: (
            <Switch
              checkedChildren="启用"
              unCheckedChildren="停用"
              onChange={() => this.handleSetConfigStatus(record)}
              defaultChecked={record.status === '1'}
            />
          ),
        }),
      },
      {
        title: '是否默认',
        dataIndex: 'isDefault',
        align: 'center',
        render: (text, record) => ({
          children: (
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              onChange={() => this.handleSetConfigDefault(record)}
              defaultChecked={record.isDefault === '1'}
            />
          ),
        }),
      },
      {
        title: formatMessage({ id: 'app.common.operation' }),
        dataIndex: 'operation',
        align: 'center',
        render: (text, record) => (
          <div>
            <Icon
              onClick={() => this.showModel(record)}
              type="edit"
              style={{ marginRight: '22px' }}
            />
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.configId)}>
              <Icon type="delete" />
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <Fragment>
        <PageHeaderWrapper>
          <div className={styles.approvalSet}>
            <Form onSubmit={this.handleSubmit} className="ant-advanced-search-form">
              <Row gutter={{ xs: 24, sm: 48, md: 144, lg: 48, xl: 96 }}>
                <Col xs={12} sm={12} lg={8}>
                  <Form.Item label="说明" colon={false}>
                    {getFieldDecorator('remark', {
                      rules: [{ required: false, message: '请输入说明' }],
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <div className="btnArea">
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </div>
              <div className="">
                <Button
                  onClick={this.handleAdd}
                  size="small"
                  type="primary"
                  icon="plus"
                  className="btn2"
                  style={{ marginRight: '0', marginTop: '36px', float: 'right', zIndex: '1' }}
                />
              </div>
            </Form>

            <Table
              columns={setColumns}
              dataSource={approvalConfigList}
              className={styles.tableBox}
              pagination={{
                size: 'small',
              }}
            />
            <ModelForm
              showModel={this.showModel}
              handleCancel={this.handleCancel}
              getProcessResource={this.getProcessResource}
              configData={this.configData}
              visible={visible}
              formValue={formValue}
            />
          </div>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

const ApprovalSet = Form.create()(ApprovalConifg);

export default ApprovalSet;
