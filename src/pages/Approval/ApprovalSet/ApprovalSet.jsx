// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus */
import React, { PureComponent, Fragment } from 'react';
import { Form, Icon, Input, Button, Divider, Table, Switch, Popconfirm } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
import styles from './ApprovalSet.less';

@connect(({ approvalSet, loading }) => ({
  loading: loading.effects['approvalSet/approvalConfigDatas'],
  approvalData: approvalSet.data,
}))
class ApprovalSet extends PureComponent {
  state = {
    dataSource: [],
    count: 0,
  };

  componentDidMount() {
    this.props.form.validateFields();
    this.configData({
      pageNumber: 10,
      pageSize: 1,
    });
    this.createData();
  }

  // 获取查询设置列表数据
  configData = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalSet/approvalConfigDatas',
      payload: param,
    });
  };

  // 生成dataSource数据
  createData = () => {
    const data = [];
    for (let i = 0; i < 3; i++) {
      data.push({
        key: i,
        number: i + 1,
        name: `任务发布审批流程 ${i}`,
        age: 32,
        modelName: `一步发布审核 ${i}`,
        phone: 18889898989,
        IsDefault: '否',
        isUseing: '是',
        address: `London, Park Lane no. ${i}`,
      });
    }
    this.setState({
      dataSource: data,
      count: data.length,
    });
  };

  // 表单提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  // 增加行 dom
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      number: count + 1,
      name: `任务发布审批流程 ${count}`,
      age: 32,
      modelName: `一步发布审核 ${count}`,
      phone: 18889898989,
      IsDefault: '否',
      isUseing: '是',
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  // 删除行
  handleDelete = key => {
    const { dataSource } = this.state;
    const dataSourceCopy = [...dataSource];
    this.setState({ dataSource: dataSourceCopy.filter(item => item.key !== key) });
  };

  render() {
    const { dataSource } = this.state;
    const { getFieldDecorator } = this.props.form;
    const setColumns = [
      {
        title: '序号',
        dataIndex: 'number',
        align: 'center',
      },
      {
        title: '业务名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '流程模型名称',
        dataIndex: 'modelName',
        align: 'center',
      },
      {
        title: '说明',
        dataIndex: 'phone',
        align: 'center',
        render: () => ({
          children: <Input placeholder="输入字符不能超过25位" />,
        }),
      },
      {
        title: '是否启用',
        dataIndex: 'isUseing',
        align: 'center',
        render: () => ({
          children: <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked />,
        }),
      },
      {
        title: '是否默认',
        dataIndex: 'IsDefault',
        align: 'center',
        render: () => ({
          children: <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />,
        }),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        render: (text, record) => {
          if (this.state.dataSource.length >= 1) {
            return (
              <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.key)}>
                <Icon type="delete" />
              </Popconfirm>
            );
          }
          return null;
        },
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
              {getFieldDecorator('businesDescription', {
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
            {/* <Form.Item className={styles.delete}>
              <Button type="primary" icon="delete">
                删除
              </Button>
            </Form.Item> */}
          </Form>
          <Table
            columns={setColumns}
            dataSource={dataSource}
            bordered
            className={styles.tableBox}
          />
        </div>
      </Fragment>
    );
  }
}

const ApprovalSetForm = Form.create()(ApprovalSet);

export default ApprovalSetForm;
