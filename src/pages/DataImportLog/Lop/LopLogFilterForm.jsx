import React from 'react';

import { FormattedMessage } from 'umi/locale';
import { Form, Row, Button, DatePicker, Select, Col, Input } from 'antd';
import { SUBMISSION_REPORT, yesterday, today, dateFormat } from '../constants';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const defaultTradeDate = [yesterday, today];

function LopLogFilterForm({ form, loading, onParams }) {
  const { getFieldDecorator, validateFields } = form;

  function getParams(type) {
    validateFields((err, values) => {
      if (!err) {
        const { tradeDate, ...rest } = values;

        onParams(type, {
          ...rest,
          startTradeDate: tradeDate[0],
          endTradeDate: tradeDate[1],
        });
      }
    });
  }

  return (
    <Form layout="vertical" className="ant-advanced-search-form search-wraper">
      <Row gutter={{ xs: 0, sm: 8, md: 10, lg: 20, xl: 24 }} align="bottom" type="flex">
        <Col xs={24} sm={12} xl={10} xxl={8}>
          <Form.Item label={<FormattedMessage id="data-import.trade-date" />}>
            {getFieldDecorator('tradeDate', {
              initialValue: defaultTradeDate,
              rules: [
                {
                  required: false,
                  message: 'Please select trade date!',
                },
              ],
            })(<RangePicker format={dateFormat} />)}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} xl={7} xxl={5}>
          <Form.Item label={<FormattedMessage id="data-import.lop.submission-report" />}>
            {getFieldDecorator('submissionReport', {
              initialValue: '',
              rules: [
                {
                  required: false,
                  message: 'Please select submission report!',
                },
              ],
            })(
              <Select placeholder="please select submission report" allowClear>
                <Option value="">All</Option>
                {SUBMISSION_REPORT.map(report => (
                  <Option key={report}>{report}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} xl={7} xxl={5}>
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
        <Col xs={24} sm={12} xl={7} xxl={5}>
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
        <Col xs={24} sm={12} xl={8} xxl={6}>
          <Form.Item>
            <Button
              type="primary"
              icon="search"
              style={{ marginRight: 10 }}
              onClick={() => getParams('lop/reload')}
            >
              <FormattedMessage id="data-import.search" />
            </Button>
            <Button
              type="primary"
              onClick={() => getParams('lop/importByAuto')}
              loading={loading['lop/importByAuto']}
            >
              <FormattedMessage id="data-import.execute" />
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default Form.create()(LopLogFilterForm);
