import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
// import styles from '../AlertUserGroup.less';

// import ClassifyTree from '@/components/ClassifyTree';

// const { TextArea } = Input;
class FormUser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { paramObj } = this.props;
    return (
      <Fragment>
        <Form>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.systemParameters.parameterType' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('parameterType', {
              initialValue: paramObj && paramObj.parameterType,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.systemParameters.parameterKey' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('parameterKey', {
              rules: [
                {
                  required: true,
                  message: 'Please input your parameterKey',
                },
              ],
              initialValue: paramObj.parameterKey,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.systemParameters.parameterValue' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('parameterValue', {
              rules: [
                {
                  required: true,
                  message: 'parameterValue couldn’t be null',
                },
              ],
              initialValue: paramObj.parameterValue,
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'app.common.note' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('note', {
              rules: [
                {
                  required: true,
                  message: 'Note couldn’t be null',
                },
              ],
              initialValue: paramObj.note,
            })(<Input />)}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const NewFormUser = Form.create()(FormUser);

@connect(({ systemParams, loading }) => ({
  loading: loading.effects,
  systemParameter: systemParams.obj,
}))
class ModifySystem extends Component {
  newUserRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onCancel = () => {
    this.props.onCancel();
  };

  onSave = () => {
    const { dispatch, paramObj } = this.props;
    this.newUserRef.current.validateFields((err, values) => {
      console.log('err=======', err, values);
      if (err) {
        return;
      }
      const params = {
        operType: 'sysParamUpdate',
        paramId: paramObj.paramId,
        parameterType: values.parameterType,
        parameterKey: values.parameterKey,
        parameterValue: values.parameterValue,
        note: values.note,
      };
      dispatch({
        type: 'systemParams/systemParamsUpdate',
        payload: params,
        callback: () => {
          message.success('success');
          this.props.onSave();
        },
      });
    });
  };

  render() {
    const { paramObj } = this.props;
    return (
      <Fragment>
        <NewFormUser ref={this.newUserRef} paramObj={paramObj} />
        <Row
          type="flex"
          justify="end"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Col>
            <Button onClick={this.onCancel}>CANCEL</Button>
            <Button type="primary" onClick={this.onSave}>
              SAVE
            </Button>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default ModifySystem;
