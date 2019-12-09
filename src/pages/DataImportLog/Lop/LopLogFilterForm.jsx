import React from 'react';

import { FormattedMessage } from 'umi/locale';
import { Form, Row, Button, DatePicker, Select, Radio, Col, Input } from 'antd';

import { PROCESSING_STATUS, SUBMISSION_REPORT, yesterday, today, dateFormat } from './constants';
import styles from '../index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

function LopLogFilterForm({ form, handleSearch }) {
  const { getFieldDecorator, validateFields } = form;

  function handleCommit() {
    validateFields((err, values) => {
      if (!err) {
        const format = 'YYYYMMDD';

        let startSubmissionDate = '';
        let endSubmissionDate = '';

        const { tradeDate: tdate, submissionDate, ...rest } = values;
        const tradeDate = tdate && tdate.format(format);
        if (submissionDate) {
          const [start, end] = submissionDate;
          startSubmissionDate = start && start.format(format);
          endSubmissionDate = end && end.format(format);
        }

        handleSearch({ ...rest, tradeDate, startSubmissionDate, endSubmissionDate });
      }
    });
  }

  return (
    <Form layout="vertical">
      <Row>
        <Col span={8}>
          <Form.Item label={<FormattedMessage id="data-import.lop.trade-date" />}>
            {getFieldDecorator('tradeDate', {
              initialValue: yesterday,
              rules: [
                {
                  required: false,
                  message: 'Please select trade date!',
                },
              ],
            })(<DatePicker format={dateFormat} />)}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="data-import.lop.submission-date" />}>
            {getFieldDecorator('submissionDate', {
              initialValue: [yesterday, today],
              rules: [
                {
                  required: false,
                  message: 'Please select submission date!',
                },
              ],
            })(<RangePicker format={dateFormat} />)}
          </Form.Item>
          <Row type="flex" justify="space-between">
            <Col span={8}>
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
            <Col span={12}>
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
        </Col>
        <Col span={7} offset={1}>
          <Form.Item label={<FormattedMessage id="data-import.lop.submitter-code" />}>
            {getFieldDecorator('submitterCode', {
              rules: [
                {
                  required: false,
                  message: 'Please input submitter code!',
                },
              ],
            })(<Input placeholder="please input submitter code" />)}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="data-import.lop.submitter-name" />}>
            {getFieldDecorator('submitterName', {
              rules: [
                {
                  required: false,
                  message: 'Please input submitter name!',
                },
              ],
            })(<Input placeholder="please input submitter name" />)}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item label={<FormattedMessage id="data-import.lop.processing-status" />}>
            {getFieldDecorator('processingStatus', {
              rules: [
                {
                  required: false,
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
          <Form.Item label={<FormattedMessage id="data-import.lop.submission-report" />}>
            {getFieldDecorator('submissionReport', {
              rules: [
                {
                  required: false,
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
        </Col>
      </Row>
      <Row type="flex" justify="end">
        <Button type="primary" icon="search" className={styles['no-margin']} onClick={handleCommit}>
          <FormattedMessage id="data-import.lop.search" />
        </Button>
      </Row>
    </Form>
  );
}

export default Form.create()(LopLogFilterForm);
