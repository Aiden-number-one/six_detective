import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Modal, Form, DatePicker, Input, Select, Upload, Icon, Button } from 'antd';
import { SUBMISSION_REPORT } from './CONSTANTS';

const { Option } = Select;

function LopLogManualModal({ visible, handleCancel, form }) {
  const { getFieldDecorator, validateFields } = form;
  const formItemLayout = {
    labelCol: {
      sm: { span: 8 },
    },
    wrapperCol: {
      sm: { span: 14 },
    },
  };

  function handleUpload() {
    validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  }

  return (
    <Modal
      title={<FormattedMessage id="data-import.lop.manual-import-lop-report" />}
      visible={visible}
      onOk={handleUpload}
      onCancel={handleCancel}
    >
      <Form {...formItemLayout}>
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
            initialValue: SUBMISSION_REPORT[0],
            rules: [
              {
                required: true,
                message: 'Please select submission report!',
              },
            ],
          })(
            <Select placeholder="please select submitter report">
              {SUBMISSION_REPORT.map(report => (
                <Option key={report}>{report}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="data-import.lop.submission-report" />}>
          <Upload>
            <Button>
              <Icon type="upload" />
              <FormattedMessage id="data-import.lop.browse" />
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(LopLogManualModal);
