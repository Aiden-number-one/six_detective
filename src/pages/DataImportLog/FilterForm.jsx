import React from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, DatePicker, Button, Checkbox, Select, Row, Col, Input } from 'antd';
import { defaultDateRange, dateFormat, defaultMarket, SUBMISSION_REPORT } from './constants';

const { Option } = Select;
const { RangePicker } = DatePicker;

const formTypeMap = {
  0: 'lop',
  1: 'market',
  2: 'newAccount',
};

const tradeDateLabel = formatMessage({ id: 'data-import.trade-date' });
const submissionDateLabel = formatMessage({ id: 'data-import.submission-date' });

const DateRangeFormItem = ({ getFieldDecorator, formType }) => (
  <Form.Item label={formType === 2 ? submissionDateLabel : tradeDateLabel}>
    {getFieldDecorator('dateRange', {
      initialValue: defaultDateRange,
    })(<RangePicker format={dateFormat} />)}
  </Form.Item>
);

const MarketFormItem = ({ getFieldDecorator }) => (
  <Form.Item label={<FormattedMessage id="data-import.market" />}>
    {getFieldDecorator('market', {
      initialValue: defaultMarket,
    })(<Checkbox.Group options={['HKFE', 'SEHK']} />)}
  </Form.Item>
);

const SubmissionReportFormItem = ({ getFieldDecorator }) => (
  <Form.Item label={<FormattedMessage id="data-import.lop.submission-report" />}>
    {getFieldDecorator('submissionReport', {
      initialValue: '',
    })(
      <Select placeholder="please select submission report" allowClear>
        <Option value="">All</Option>
        {SUBMISSION_REPORT.map(report => (
          <Option key={report}>{report}</Option>
        ))}
      </Select>,
    )}
  </Form.Item>
);

const SubmitterCodeFormItem = ({ getFieldDecorator }) => (
  <Form.Item label={<FormattedMessage id="data-import.submitter-code" />}>
    {getFieldDecorator('submitterCode')(<Input placeholder="please input submitter code" />)}
  </Form.Item>
);

const SubmitterNameFormItem = ({ getFieldDecorator }) => (
  <Form.Item label={<FormattedMessage id="data-import.lop.submitter-name" />}>
    {getFieldDecorator('submitterName')(<Input placeholder="please input submitter name" />)}
  </Form.Item>
);

const FileTypeFormItem = ({ getFieldDecorator }) => (
  <Form.Item label={<FormattedMessage id="data-import.market.file-type" />}>
    {getFieldDecorator('fileType', {
      initialValue: '',
    })(
      <Select placeholder="please select file type" allowClear>
        <Option value="">All</Option>
        <Option value="TP001">TP001</Option>
        <Option value="GREK020">GREK020</Option>
        <Option value="OMD">OMD</Option>
      </Select>,
    )}
  </Form.Item>
);

function FilterForm({ formType, form, loading, onParams }) {
  const { getFieldDecorator, validateFields } = form;

  function getParams(type) {
    validateFields((err, values) => {
      if (!err) {
        const { dateRange, ...rest } = values;

        onParams(type, {
          ...rest,
          startDate: dateRange[0],
          endDate: dateRange[1],
        });
      }
    });
  }

  return (
    <Form layout="vertical" className="ant-advanced-search-form search-wraper">
      <Row gutter={{ xs: 0, sm: 8, md: 10, lg: 20, xl: 24 }} align="bottom" type="flex">
        <Col xs={24} sm={12} xl={10} xxl={8}>
          <DateRangeFormItem formType={formType} getFieldDecorator={getFieldDecorator} />
        </Col>
        <Col xs={24} sm={12} xl={7} xxl={5}>
          {formType === 0 && <SubmissionReportFormItem getFieldDecorator={getFieldDecorator} />}
          {formType === 1 && <FileTypeFormItem getFieldDecorator={getFieldDecorator} />}
          {formType === 2 && <SubmitterCodeFormItem getFieldDecorator={getFieldDecorator} />}
        </Col>
        <Col xs={24} sm={12} xl={7} xxl={5}>
          {formType === 0 && <SubmitterCodeFormItem getFieldDecorator={getFieldDecorator} />}
          {[1, 2].includes(formType) && <MarketFormItem getFieldDecorator={getFieldDecorator} />}
        </Col>
        {formType === 0 && (
          <Col xs={24} sm={12} xl={7} xxl={5}>
            <SubmitterNameFormItem getFieldDecorator={getFieldDecorator} />
          </Col>
        )}
        <Col xs={24} sm={12} xl={8} xxl={6}>
          <Form.Item>
            <Button
              type="primary"
              icon="search"
              style={{ marginRight: 10 }}
              onClick={() => getParams(`${formTypeMap[formType]}/reload`)}
            >
              <FormattedMessage id="data-import.search" />
            </Button>
            <Button
              type="primary"
              loading={loading[`${formTypeMap[formType]}/importByAuto`]}
              onClick={() => getParams(`${formTypeMap[formType]}/importByAuto`)}
            >
              <FormattedMessage id="data-import.execute" />
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default Form.create()(FilterForm);
