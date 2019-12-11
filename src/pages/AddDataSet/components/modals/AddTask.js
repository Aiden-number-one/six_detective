import React, { PureComponent, Fragment } from 'react';
import { Modal, Select, Form, Input, Checkbox, DatePicker, Radio, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';

const { Option } = Select;
const { TextArea } = Input;
export default React.memo(
  Form.create({ name: 'add_Task' })(
    class extends PureComponent {
      state = {
        value: 0,
      };

      onChange = e => {
        this.setState({
          value: e.target.value,
        });
      };

      render() {
        const { visible, form, toggleModal, saveDescription } = this.props;
        const { getFieldDecorator } = form;
        const handleAttributeOk = () => {
          form.validateFields((err, fieldsValue) => {
            if (err) return;
            saveDescription(fieldsValue);
            form.resetFields();
            toggleModal('addTask');
            // message.info("操作成功！入参：" + JSON.stringify(fieldsValue));
          });
        };
        const Layout = {
          labelCol: { span: 5 },
          wrapperCol: { span: 14 },
        };
        return (
          <Modal
            visible={visible}
            wrapClassName="modal"
            title={formatMessage({ id: 'index.addTask' })}
            cancelText="取消"
            okText="确定"
            onCancel={() => {
              form.resetFields();
              toggleModal('addTask');
            }}
            onOk={handleAttributeOk}
            width={800}
            centered
          >
            <Form>
              <Form.Item {...Layout} label="计划名称">
                {getFieldDecorator('planName', {
                  rules: [{ required: true, message: '请输入计划名称' }],
                })(<Input placeholder="请输入最长64位字符（中文占两个字符）" />)}
              </Form.Item>
              <Form.Item {...Layout} label="计划有效时间">
                <Row gutter={24}>
                  <Col span={8}>
                    {getFieldDecorator('startTime', {
                      rules: [{ required: true }],
                    })(
                      <Fragment>
                        <DatePicker onChange={() => {}} />
                      </Fragment>,
                    )}
                  </Col>
                  <Col span={2}>
                    <span style={{ fontSize: 12 }}>至</span>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator('endTime', {
                        rules: [{ required: true }],
                      })(<DatePicker style={{ marginRight: 5 }} onChange={() => {}} />)}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Checkbox>永久有效</Checkbox>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item {...Layout} label="计划开始执行时间">
                {getFieldDecorator('startActionTime', {
                  // rules: [{ required: true, }]
                })(<DatePicker onChange={() => {}} style={{ width: '100%' }} />)}
              </Form.Item>
              <Form.Item {...Layout} label="执行频度">
                {getFieldDecorator('frequency', {
                  // rules: [{ required: true, }]
                })(
                  <Input
                    placeholder="请输入最长32位字符"
                    style={{ width: '45%', marginRight: '5%', height: 28 }}
                  />,
                )}
                <Select defaultValue={0} style={{ width: '50%' }}>
                  <Option value={0}>-请选择-</Option>
                </Select>
              </Form.Item>
              <Form.Item {...Layout} label="CORN表达式">
                {getFieldDecorator(
                  'corn',
                  {},
                )(
                  <TextArea
                    placeholder="计划执行频率可使用执行频率输入框输入，也可以自定义CRON表达式。两种方式二选一，根据需要使用。"
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />,
                )}
              </Form.Item>
              <Form.Item {...Layout} label="调度规律">
                {getFieldDecorator('regular', {
                  // rules: [{ required: true, }]
                  initialValue: this.state.value,
                })(
                  <Radio.Group onChange={this.onChange}>
                    <Radio value={0}>按交易日</Radio>
                    <Radio value={1}>按自然日</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item {...Layout} label="成功邮件">
                {getFieldDecorator('successEmail', {
                  //   rules: [{ required: true, message: '请输入计划名称',}],
                })(<Input placeholder="请输入最长256位字符（中文占两个字符）" />)}
              </Form.Item>
              <Form.Item {...Layout} label="出错邮件">
                {getFieldDecorator('failEmail', {
                  //   rules: [{ required: true, message: '请输入计划名称',}],
                })(<Input placeholder="请输入最长256位字符（中文占两个字符）" />)}
              </Form.Item>
            </Form>
          </Modal>
        );
      }
    },
  ),
);
