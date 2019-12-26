import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, message, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
// import styles from '../messageContentTemplate.less';

// import ClassifyTree from '@/components/ClassifyTree';

const { TextArea } = Input;
const { Option } = Select;
class FormUser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { groupMenuInfo, typeOptions } = this.props;
    return (
      <Fragment>
        <Form>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.templateName' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('templateName', {
              rules: [
                {
                  required: true,
                  message: 'Please input Name of Alert User Group',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.templateName,
            })(<Input disabled placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.templateId' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('templateId', {
              initialValue: groupMenuInfo && groupMenuInfo.templateId,
            })(<Input disabled placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.templateType' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: 'Type of email should not be empty',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.type,
            })(
              <Select placeholder="Please Select">
                {typeOptions.map(item => (
                  <Option key={item.key} value={item.value}>
                    {item.title}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.templateTitle' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
          >
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Title of email should not be empty',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.title,
            })(<Input placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.templateContent' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
          >
            {getFieldDecorator('content', {
              rules: [
                {
                  required: true,
                  message: 'Content of email should not be empty',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.content,
            })(<TextArea rows={8} placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.keyword' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('keyWord', {
              initialValue: groupMenuInfo && groupMenuInfo.keyWord,
            })(<Input disabled placeholder="Please input" />)}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const NewFormUser = Form.create()(FormUser);

@connect(({ messageContentTemplate, loading }) => ({
  loading: loading.effects,
  userGroup: messageContentTemplate.saveUser,
  updateGroup: messageContentTemplate.updateData,
}))
class ModifyTemplate extends Component {
  newUserRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      // defaultCheckedKeys: [],
    };
  }

  componentDidMount() {
    // const { updateFlag } = this.props;
    // if (updateFlag) {
    //   this.getMenuGrops();
    // }
  }

  onCancel = () => {
    // this.props.history.push({
    //   pathname: '/system-management/menu-user-group',
    // });
    this.props.onCancel();
  };

  onSave = () => {
    const { dispatch, updateFlag } = this.props;
    this.newUserRef.current.validateFields((err, values) => {
      console.log('err=======', err);
      if (err) {
        return;
      }
      if (!updateFlag) {
        const param = {
          templateId: values.templateId,
          templateName: values.templateName,
          title: values.title,
          content: values.content,
          type: values.type,
          keyWord: values.keyWord,
        };
        // debugger
        dispatch({
          type: 'messageContentTemplate/newAlertUser',
          payload: param,
          callback: () => {
            message.success('success');
            //   this.props.history.push({
            //     pathname: '/system-management/menu-user-group',
            //     params: values,
            //   });
            this.props.onSave();
          },
        });
      } else {
        const params = {
          templateId: values.templateId,
          templateName: values.templateName,
          type: values.type,
          title: values.title,
          content: values.content,
          keyWord: values.keyWord,
        };
        dispatch({
          type: 'messageContentTemplate/updateTemplate',
          payload: params,
          callback: () => {
            message.success('save success');
            this.props.onSave();
          },
        });
      }
    });
  };

  render() {
    const { groupMenuInfo, typeOptions } = this.props;
    return (
      <Fragment>
        <NewFormUser
          ref={this.newUserRef}
          groupMenuInfo={groupMenuInfo}
          typeOptions={typeOptions}
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

export default ModifyTemplate;
