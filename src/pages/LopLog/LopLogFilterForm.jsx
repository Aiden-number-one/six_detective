import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Form, Row, Button, DatePicker, Select, Radio, Col, Input } from 'antd';

import { PROCESSING_STATUS, SUBMISSION_REPORT } from './CONSTANTS';

const { RangePicker } = DatePicker;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

function LopLogFilterForm({ form }) {
  const { getFieldDecorator, validateFields } = form;

  function handleSearch() {
    validateFields((err, values) => {
      console.log(values);
      console.log(values.tradeDate.format('YYYY-MM-DD'));
    });
  }

  return (
    <Form {...formItemLayout} onSubmit={handleSearch}>
      <Row>
        <Col span={10}>
          <Form.Item label={<FormattedMessage id="data-import.lop.trade-date" />}>
            {getFieldDecorator('tradeDate', {
              rules: [
                {
                  required: true,
                  message: 'Please select trade date!',
                },
              ],
            })(<DatePicker />)}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="data-import.lop.submitter-code" />}>
            {getFieldDecorator('submitterCode', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: 'Please input trade date!',
                },
              ],
            })(<Input placeholder="please input submitter code" />)}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="data-import.lop.submission-report" />}>
            {getFieldDecorator('submissionReport', {
              initialValue: SUBMISSION_REPORT[0],
              rules: [
                {
                  required: true,
                  message: 'Please select submission report!',
                },
              ],
            })(
              <Select placeholder="please select submission report">
                {SUBMISSION_REPORT.map(report => (
                  <Option key={report}>{report}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="data-import.lop.late-submission" />}>
            {getFieldDecorator('lateSubmission', {
              initialValue: 'y',
            })(
              <Radio.Group>
                <Radio value="y">Y</Radio>
                <Radio value="n">N</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={10} offset={1}>
          <Form.Item label={<FormattedMessage id="data-import.lop.submission-date" />}>
            {getFieldDecorator('submissionDate', {
              rules: [
                {
                  required: true,
                  message: 'Please select submission date!',
                },
              ],
            })(<RangePicker />)}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="data-import.lop.submitter-name" />}>
            {getFieldDecorator('submitterName', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: 'Please input submitter name!',
                },
              ],
            })(<Input placeholder="please input submmitter name" />)}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="data-import.lop.processing-status" />}>
            {getFieldDecorator('processingStatus', {
              initialValue: PROCESSING_STATUS[0],
              rules: [
                {
                  required: true,
                  message: 'Please select processing status!',
                },
              ],
            })(
              <Select placeholder="please select processing status">
                {PROCESSING_STATUS.map(status => (
                  <Option key={status}>{status}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="data-import.lop.submission-channel" />}>
            {getFieldDecorator('submissionChannel', {
              initialValue: 'ecp',
              rules: [
                {
                  required: true,
                  message: 'Please select submission channel!',
                },
              ],
            })(
              <Radio.Group>
                <Radio value="ecp">ECP</Radio>
                <Radio value="user">User</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" justify="end">
        <Button type="primary" onClick={handleSearch}>
          <FormattedMessage id="data-import.lop.search" />
        </Button>
      </Row>
    </Form>
  );
}

export default Form.create()(LopLogFilterForm);
