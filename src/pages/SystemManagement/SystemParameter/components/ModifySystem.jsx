/*
 * @Description: This is for System Parameter's modify.
 * @Author: dailinbo
 * @Date: 2019-12-24 15:19:32
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-16 21:16:51
 */
import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';

const { TextArea } = Input;
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
        <Form className="text-area">
          <Form.Item
            label={formatMessage({ id: 'systemManagement.systemParameters.parameterType' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
          >
            {getFieldDecorator('parameterType', {
              initialValue: paramObj && paramObj.parameterType,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.systemParameters.parameterKey' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
          >
            {getFieldDecorator('parameterKey', {
              initialValue: paramObj.parameterKey,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.systemParameters.parameterValue' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
          >
            {getFieldDecorator('parameterValue', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({
                    id: 'systemManagement.systemParameters.parameterValue',
                  })} is missing`,
                },
              ],
              initialValue: paramObj.parameterValue,
            })(<Input placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'app.common.remark' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
          >
            {getFieldDecorator('remark', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({ id: 'app.common.remark' })} is missing`,
                },
              ],
              initialValue: paramObj.note,
            })(<TextArea rows={8} placeholder="Please input" />)}
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

  /**
   * @description: This is funciton for Save System Parameter's modify.
   * @param {type} null
   * @return: undefined.
   */
  onSave = () => {
    const { dispatch, paramObj } = this.props;
    this.newUserRef.current.validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        operType: 'sysParamUpdate',
        paramId: paramObj.paramId,
        parameterType: values.parameterType,
        parameterKey: values.parameterKey,
        parameterValue: values.parameterValue,
        note: values.remark,
      };
      dispatch({
        type: 'systemParams/systemParamsUpdate',
        payload: params,
        callback: () => {
          message.success({
            content: 'save success',
            duration: 2,
          });
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
            <Button onClick={this.onCancel}>{formatMessage({ id: 'app.common.cancel' })}</Button>
            <Button type="primary" onClick={this.onSave} style={{ marginLeft: '10px' }}>
              {formatMessage({ id: 'app.common.save' })}
            </Button>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default ModifySystem;
