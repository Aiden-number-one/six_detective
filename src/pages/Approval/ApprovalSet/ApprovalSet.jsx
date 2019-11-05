/* eslint-disable react/no-unused-state */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus */
import React, { PureComponent, Fragment } from 'react';
import { Form, Icon, Input, Button, Divider, Table, Popconfirm, Switch } from 'antd';
import { connect } from 'dva';
import ModelForm from './compontents/modelForm';
// import classNames from 'classnames';
import styles from './ApprovalSet.less';

@connect(({ approvalSet, loading }) => ({
  loading: loading.effects['approvalSet/approvalConfigDatas'],
  approvalConfigList: approvalSet.data,
}))
class ApprovalSet extends PureComponent {
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
      // callback: processDefinitionId => this.getFlowChart(processDefinitionId),
      // callback: processDefinitionId =>
      //   console.log('processDefinitionId----->', processDefinitionId),
      callback: processDefinitionId => this.getProcessResource(processDefinitionId),
    });
  };

  // // 修改审批设置状态
  // handleSetConfigStatus = param => {
  //   const { dispatch } = this.props;
  //   console.log('param---->', param);
  //   // dispatch({
  //   //   type: 'approvalSet/setConfigStatus',
  //   //   payload: {
  //   //     configId: param.configId,
  //   //     status: '',
  //   //     isDefault: '',
  //   //   },
  //   // });
  // };

  // 查询动态流程图
  // getFlowChart = processDefinitionId => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'approvalSet/getDiagramDatas',
  //     payload: { processDefinitionId },
  //   });
  // };

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
        console.log('Received values of form: ', values);
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
    // const { count, dataSource } = this.state;
    // const newData = {
    //   key: count,
    //   number: count + 1,
    //   name: `任务发布审批流程 ${count}`,
    //   age: 32,
    //   modelName: `一步发布审核 ${count}`,
    //   phone: 18889898989,
    //   IsDefault: '否',
    //   isUseing: '是',
    //   address: `London, Park Lane no. ${count}`,
    // };
    // this.setState({
    //   dataSource: [...dataSource, newData],
    //   count: count + 1,
    // });
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
      },
      {
        title: '业务名称',
        dataIndex: 'businessName',
        align: 'center',
      },
      {
        title: '流程模型名称',
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
        render: () => ({
          children: <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked />,
        }),
      },
      {
        title: '是否默认',
        dataIndex: 'isDefault',
        align: 'center',
        render: (text, record) => ({
          children: (
            <Switch
              onChange={() => this.handleSetConfigStatus(record)}
              checkedChildren="是"
              unCheckedChildren="否"
              defaultChecked
            />
          ),
        }),
      },
      {
        title: '操作',
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
        <div className={styles.approvalSet}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              <Icon type="unordered-list" className={styles.icon} />
              <h2 className={styles.titleText}>审批设置</h2>
            </div>
            <Divider className={styles.divider} />
          </div>

          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item label="说明:">
              {getFieldDecorator('remark', {
                rules: [{ required: false, message: '请输入说明' }],
              })(<Input />)}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                查询
              </Button>
            </Form.Item>
            <br />
            <Form.Item style={{ marginTop: '5px' }}>
              <Button
                type="primary"
                icon="file-add"
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                onClick={this.handleAdd}
              >
                增加
              </Button>
            </Form.Item>
          </Form>
          <Table
            columns={setColumns}
            dataSource={approvalConfigList}
            bordered
            className={styles.tableBox}
          />
          <ModelForm
            showModel={this.showModel}
            handleCancel={this.handleCancel}
            getProcessResource={this.getProcessResource}
            visible={visible}
            formValue={formValue}
          />
        </div>
      </Fragment>
    );
  }
}

const ApprovalSetForm = Form.create()(ApprovalSet);

export default ApprovalSetForm;
