import React, { PureComponent, Fragment } from 'react';
import { Form, Icon, Divider, Table } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
import styles from './TemplateSet.less';

@connect(({ approvalApi, loading }) => ({
  loading: loading.effects['approvalApi/approvalDatas'],
  tableData: approvalApi.data,
}))
class TemplateSet extends PureComponent {
  state = {
    dataSource: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.props.form.validateFields();
    this.createData();
    dispatch({
      type: 'approvalApi/approvalDatas',
      payload: {
        bcLangType: '1',
        pageNumber: '555',
      },
    });
  }

  // 生成数据Data
  createData = () => {
    const data = [];
    for (let i = 0; i < 46; i += 1) {
      data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        tel: '0571-22098909',
        phone: 18889898989,
        checkStatus: '审批中',
        date: '2019-10-23',
        address: `London, Park Lane no. ${i}`,
      });
    }
    this.setState({
      dataSource: data,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { dataSource } = this.state;
    const checkColumns = [
      {
        title: '审批号',
        dataIndex: 'name',
      },
      {
        title: '业务名称',
        dataIndex: 'age',
      },
      {
        title: '业务说明',
        dataIndex: 'tel',
      },
      {
        title: '发起人',
        dataIndex: 'phone',
      },
      {
        title: '审批日期',
        dataIndex: 'date',
      },
      {
        title: '审批时间',
        dataIndex: 'address',
      },
      {
        title: '审批状态',
        dataIndex: 'checkStatus',
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
        </div>
      </Fragment>
    );
  }
}

const TemplateSetForm = Form.create()(TemplateSet);

export default TemplateSetForm;
