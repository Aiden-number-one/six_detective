import React, { PureComponent, Fragment } from 'react';
import { Form, Icon, Input, Button, Divider, Table } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
import styles from './ApprovalSet.less';

@connect(state => ({
  approvalSet: state.approvalSet,
}))
class ApprovalSet extends PureComponent {
  state = {};

  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const setColumns = [
      {
        title: '序号',
        dataIndex: 'number',
      },
      {
        title: '业务名称',
        dataIndex: 'name',
      },
      {
        title: '流程模型名称',
        dataIndex: 'tel',
      },
      {
        title: '说明',
        dataIndex: 'phone',
        editable: true,
      },
      {
        title: '是否启用',
        dataIndex: 'isUseing',
      },
      {
        title: '是否默认',
        dataIndex: 'IsDefault',
      },
    ];
    const data = [];
    for (let i = 0; i < 50; i += 1) {
      data.push({
        key: i,
        number: i + 1,
        name: `Edward King ${i}`,
        age: 32,
        tel: '0571-22098909',
        phone: 18889898989,
        IsDefault: '否',
        isUseing: '是',
        address: `London, Park Lane no. ${i}`,
      });
    }

    return (
      <Fragment>
        <div className={styles.approvalCheck}>
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
              >
                增加
              </Button>
            </Form.Item>
            <Form.Item style={{ marginTop: '5px' }}>
              <Button
                type="primary"
                icon="delete"
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                删除
              </Button>
            </Form.Item>
          </Form>
          <Table columns={setColumns} dataSource={data} bordered className={styles.tableBox} />
        </div>
      </Fragment>
    );
  }
}

const ApprovalSetForm = Form.create()(ApprovalSet);

export default ApprovalSetForm;
