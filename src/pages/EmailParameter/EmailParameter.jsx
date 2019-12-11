import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Modal } from 'antd';
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
    console.log('getEmailListData=', getEmailListData);
    // emailHost: '',
    // emailPort: '',
    // emailAddress: '',
    // emailPassword: '',
    // isopen: '',
    const emailObj = {};
    getEmailListData.map(element => {
      const paramKey = element.paramKey.split('.')[2];
      console.log();
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
    console.log('params=', params);
    this.setState({
      emailListData: params,
      visible: true,
    });
  };

  handleOk = () => {
    const { emailListData } = this.state;
    const { dispatch } = this.props;
    const params = {
      operType: 'operType',
      paramInfo: JSON.stringify(emailListData),
    };
    dispatch({
      type: 'getEmail/updateEmail',
      payload: params,
      callback: () => {
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
              {/* 修改 */}
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
