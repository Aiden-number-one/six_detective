import React from 'react';

import { FormattedMessage } from 'umi/locale';
import { Form, Row, Button, DatePicker, Select, Col, Input } from 'antd';
import { SUBMISSION_REPORT, yesterday, today, dateFormat } from '../constants';
import styles from '../index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

function LopLogFilterForm({ form, handleSearch }) {
  const { getFieldDecorator, validateFields } = form;

  function handleCommit() {
    validateFields((err, values) => {
      if (!err) {
        const format = 'YYYYMMDD';
        const { tradeDate, submissionDate, ...rest } = values;

        let startSubmissionDate = '';
        let endSubmissionDate = '';

        let startTradeDate = '';
        let endTadeDate = '';

        if (tradeDate) {
          const [start, end] = tradeDate;
          startTradeDate = start && start.format(format);
          endTadeDate = end && end.format(format);
        }

        if (submissionDate) {
          const [start, end] = submissionDate;
          startSubmissionDate = start && start.format(format);
          endSubmissionDate = end && end.format(format);
        }

        handleSearch({
          ...rest,
          startTradeDate,
          endTadeDate,
          startSubmissionDate,
          endSubmissionDate,
        });
      }
    });
  }

  return (
    <Form layout="vertical" className={styles.form}>
      <Row>
        <Col span={7}>
          <Form.Item label={<FormattedMessage id="data-import.trade-date" />}>
            {getFieldDecorator('tradeDate', {
              initialValue: [yesterday, today],
              rules: [
                {
                  required: false,
                  message: 'Please select trade date!',
                },
              ],
            })(<RangePicker format={dateFormat} />)}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item label={<FormattedMessage id="data-import.lop.submission-report" />}>
            {getFieldDecorator('submissionReport', {
              rules: [
                {
                  required: false,
                  message: 'Please select submission report!',
                },
              ],
            })(
              <Select placeholder="please select submission report" allowClear>
                {SUBMISSION_REPORT.map(report => (
                  <Option key={report}>{report}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item label={<FormattedMessage id="data-import.submitter-code" />}>
            {getFieldDecorator('submitterCode', {
              rules: [
                {
                  required: false,
                  message: 'Please input submitter code!',
                },
              ],
            })(<Input placeholder="please input submitter code" />)}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={7}>
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
      </Row>
      <Row type="flex" justify="end">
        <Button type="primary" icon="search" className={styles['no-margin']} onClick={handleCommit}>
          <FormattedMessage id="data-import.search" />
        </Button>
      </Row>
    </Form>
  );
}

export default Form.create()(LopLogFilterForm);
