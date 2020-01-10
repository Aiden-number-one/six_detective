/*
 * @Description: This is Email Parameter for setting Email.
 * @Author: dailinbo
 * @Date: 2019-12-24 15:15:42
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-10 11:27:54
 */
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Modal, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './EmailParameter.less';
import ModifyEmail from './components/ModifyEmail';

const NewModifyForm = Form.create({})(ModifyEmail);
@connect(({ getEmail, loading }) => ({
  loading: loading.effects,
  getEmailListData: getEmail.data,
}))
class EmailParameter extends Component {
  state = {
    visible: false,
    confirmLoading: false,
    emailObj: {
      emailHost: '',
      emailPort: '',
      emailAddress: '',
      emailPassword: '',
      status: '',
    },
    emailListData: [],
  };

  addFormRef = React.createRef();

  modifyForm = React.createRef();

  componentDidMount() {
    this.getEmailInit();
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

  updateEmail = (res, obj) => {
    const Obj = {
      mailHost: obj.mailHost,
      mailPort: obj.mailPort,
      mailAddress: obj.mailAddress,
      mailPassword: obj.mailPassword,
      isopen: obj.isopen,
    };
    this.setState(
      {
        emailObj: Obj,
      },
      () => {},
    );
  };

  modifyConfirm = () => {
    const { dispatch } = this.props;
    this.modifyForm.current.validateFields((err, values) => {
      const param = {
        mailHost: values.mailHost,
        mailPort: values.mailPort,
        mailAddress: values.mailAddress,
        mailPassword: window.kddes.getDes(values.mailPassword),
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

  /**
   * @description: This is function for get Email list.
   * @param {type} null
   * @return: undefined
   */
  getEmailInit = () => {
    const { dispatch } = this.props;
    const params = {};
    dispatch({
      type: 'getEmail/getEmailList',
      payload: params,
      callback: () => {
        this.formatEmailObj(this.props.getEmailListData.items);
      },
    });
  };

  formatEmailObj = getEmailListData => {
    const emailObj = {};
    getEmailListData.map(element => {
      const paramKey = element.paramKey.split('.')[2];
      switch (paramKey) {
        case 'host':
          emailObj.emailHost = element.paramRealValue;
          break;
        case 'port':
          emailObj.emailPort = element.paramRealValue;
          break;
        case 'username':
          emailObj.emailAddress = element.paramRealValue;
          break;
        case 'password':
          emailObj.emailPassword = element.paramRealValue;
          break;
        case 'status':
          emailObj.status = element.paramRealValue;
          break;
        case 'from':
          emailObj.form = element.paramRealValue;
          break;
        default:
          emailObj.form = element.paramRealValue;
      }
      return true;
    });
    this.setState({
      emailObj,
    });
  };

  onSave = params => {
    this.setState({
      emailListData: params,
      visible: true,
    });
  };

  /**
   * @description: This is function for modify Email.
   * @param {type} null
   * @return: undefiend
   */
  handleOk = () => {
    const { emailListData } = this.state;
    const { dispatch } = this.props;
    const params = {
      operType: 'emailUpdate',
      paramInfo: JSON.stringify(emailListData),
    };
    dispatch({
      type: 'getEmail/updateEmail',
      payload: params,
      callback: () => {
        message.success({
          content: 'save success',
          duration: 2,
        });
        this.setState({
          visible: false,
        });
      },
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { loading, getEmailListData } = this.props;
    const { visible, confirmLoading } = this.state;
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <div className={styles.emailWraper}>
              <NewModifyForm
                ref={this.modifyForm}
                emailObj={this.state.emailObj}
                getEmailListData={getEmailListData.items}
                onSave={this.onSave}
                loading={loading}
              ></NewModifyForm>
              <Modal
                title={formatMessage({ id: 'app.common.save' })}
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                cancelText={formatMessage({ id: 'app.common.cancel' })}
                okText={formatMessage({ id: 'app.common.save' })}
              >
                <p>All of you change have been saved</p>
              </Modal>
            </div>
          </div>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default EmailParameter;
