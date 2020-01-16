/*
 * @Description: This is modify Code Item.
 * @Author: dailinbo
 * @Date: 2019-12-24 15:15:30
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-16 19:53:04
 */
import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';

class FormUser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { codeId, updateCodeItemParams } = this.props;
    return (
      <Fragment>
        <Form className="text-area">
          <Form.Item
            label={formatMessage({ id: 'systemManagement.codeMaintenance.codeID' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('codeId', {
              initialValue: codeId || undefined,
            })(<Input disabled></Input>)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.codeMaintenance.subitemId' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('subitemId', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({
                    id: 'systemManagement.codeMaintenance.subitemId',
                  })} is missing`,
                },
              ],
              initialValue: (updateCodeItemParams && updateCodeItemParams.subitemId) || undefined,
            })(<Input placeholder="Please input"></Input>)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.codeMaintenance.subitemName' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('subitemName', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({
                    id: 'systemManagement.codeMaintenance.subitemName',
                  })} is missing`,
                },
              ],
              initialValue: (updateCodeItemParams && updateCodeItemParams.subitemName) || undefined,
            })(<Input placeholder="Please input"></Input>)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.codeMaintenance.sequence' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('sequence', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({
                    id: 'systemManagement.codeMaintenance.sequence',
                  })} is missing`,
                },
              ],
              initialValue: (updateCodeItemParams && updateCodeItemParams.sequence) || undefined,
            })(<Input placeholder="Please input"></Input>)}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const NewFormUser = Form.create()(FormUser);

@connect(({ codeList, loading }) => ({
  loading: loading.effects,
  addCodeData: codeList.obj,
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
   * @description: This is function for Save modify.
   * @param {type} null
   * @return: undefined
   */
  onSave = () => {
    const { dispatch, codeId, modifyFlag, updateCodeItemParams } = this.props;
    this.newUserRef.current.validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        operType: modifyFlag ? 'subitemUpdateBycodeId' : 'subitemAddBycodeId',
        codeId,
        subitemId: values.subitemId,
        subitem: modifyFlag ? updateCodeItemParams.subitem : values.subitemId,
        subitemName: values.subitemName,
        sequence: values.sequence,
      };
      dispatch({
        type: 'codeList/addCodeItem',
        payload: params,
        callback: () => {
          message.success('success');
          this.props.onSave();
        },
      });
    });
  };

  render() {
    const { codeId, updateCodeItemParams } = this.props;
    return (
      <Fragment>
        <NewFormUser
          ref={this.newUserRef}
          codeId={codeId}
          updateCodeItemParams={updateCodeItemParams}
        />
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
