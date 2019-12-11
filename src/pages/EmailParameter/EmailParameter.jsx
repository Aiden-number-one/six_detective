import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form } from 'antd';
import { connect } from 'dva';
// import { formatMessage } from 'umi/locale';
// import styles from './EmailParameter.less';
import ModifyEmail from './components/ModifyEmail';

const NewModifyForm = Form.create({})(ModifyEmail);
@connect(({ getEmail, loading }) => ({
  loading: loading.effects,
  getEmailListData: getEmail.data,
}))
class EmailParameter extends Component {
  state = {
    page: {
      pageNumber: '1',
      pageSize: '10',
    },
  };

  addFormRef = React.createRef();

  modifyForm = React.createRef();

  componentDidMount() {
    this.getEmailInit();
    // console.log(this.props.getEmailListData);
  }

  handleOk = () => {
    const { dispatch } = this.props;
    this.addFormRef.current.validateFields((err, values) => {
      const param = {
        mailHost: values.mailHost,
        mailPort: values.mailPort,
        mailAddress: values.mailAddress,
        mailPassword: values.mailPassword,
        isopen: values.isopen,
        remark: values.remark,
        isAddConfig: true,
      };
      dispatch({
        type: 'getEmail/addEmailDate',
        payload: param,
        callback: () => {
          this.getEmailInit();
        },
      });
    });
  };

  // 修改
  updateEmail = (res, obj) => {
    const Obj = {
      mailHost: obj.mailHost,
      mailPort: obj.mailPort,
      mailAddress: obj.mailAddress,
      mailPassword: obj.mailPassword,
      isopen: obj.isopen,
      remark: obj.remark,
      isAddConfig: obj.isAddConfig,
    };
    this.setState(
      {
        emailObj: Obj,
      },
      () => {
        console.log('emailObj=', this.state.emailObj);
      },
    );
  };

  modifyConfirm = () => {
    const { dispatch } = this.props;
    this.modifyForm.current.validateFields((err, values) => {
      const param = {
        mailHost: values.mailHost,
        mailPort: values.mailPort,
        mailAddress: values.mailAddress,
        mailPassword: values.mailPassword,
        isopen: values.isopen,
        remark: values.remark,
      };
      dispatch({
        type: 'getEmail/addEmailDate',
        payload: param,
        callback: () => {
          this.getEmailInit();
        },
      });
    });
  };

  getEmailInit = () => {
    const { dispatch } = this.props;
    const params = {
      pageNumber: this.state.page.pageNumber,
      pageSize: this.state.page.pageSize,
    };
    dispatch({
      type: 'getEmail/getEmailList',
      payload: params,
    });
  };

  // 数据处理函数
  formatIsOpen = value => {
    const obj = {
      0: '关闭',
      1: '开启',
    };
    return obj[value];
  };

  /**
   * @description: This is for paging function.
   * @param {type} null
   * @return: undefined
   */
  pageChange = (pageNumber, pageSize) => {
    const page = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    };

    this.setState(
      {
        page,
      },
      () => {
        this.getEmailInit();
      },
    );
  };

  onShowSizeChange = (pageNumber, pageSize) => {
    console.log('pageNumber, pageSize=', pageNumber, pageSize);
  };

  render() {
    const { loading, getEmailListData } = this.props;
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <div>
              {/* 修改 */}
              <NewModifyForm
                ref={this.modifyForm}
                emailObj={this.state.emailObj}
                getEmailListData={getEmailListData}
                loading={loading}
              ></NewModifyForm>
            </div>
          </div>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default EmailParameter;
