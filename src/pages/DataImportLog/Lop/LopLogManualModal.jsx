import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Drawer, Form, DatePicker, Input, Select, Upload, Icon, Button } from 'antd';
import { SUBMISSION_REPORT, yesterday, dateFormat } from './constants';

const { Option } = Select;

function LopLogManualModal({ form, visible, handleCancel, handleUpload }) {
  const { getFieldDecorator, validateFields } = form;

  function handleCommit() {
    validateFields((err, values) => {
      if (!err) {
        const tradeDate = values.tradeDate.format('YYYYMMDD');
        handleUpload({ ...values, tradeDate });
      }
    });
  }

  return (
    <Drawer
      title={<FormattedMessage id="data-import.lop.manual-import-lop-report" />}
      width={320}
      visible={visible}
      onClose={handleCancel}
    >
      <Form>
        <Form.Item label={<FormattedMessage id="data-import.lop.trade-date" />}>
          {getFieldDecorator('tradeDate', {
            initialValue: yesterday,
            rules: [
              {
                required: true,
                message: 'Please select trade date!',
              },
            ],
          })(<DatePicker format={dateFormat} />)}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="data-import.lop.submitter-code" />}>
          {getFieldDecorator('submitterCode', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: 'Please input submitter code!',
              },
            ],
          })(<Input placeholder="please input submitter code" />)}
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
        <Form.Item label={<FormattedMessage id="data-import.lop.submission-report" />}>
          {getFieldDecorator('submissionReport', {
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
        <Form.Item label={<FormattedMessage id="data-import.lop.submission-report" />}>
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: e => {
              console.log('Upload event:', e);
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            },
          })(
            <Upload>
              <Button>
                <Icon type="upload" />
                <FormattedMessage id="data-import.lop.browse" />
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" onClick={handleCommit}>
            Upload
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default Form.create()(LopLogManualModal);
