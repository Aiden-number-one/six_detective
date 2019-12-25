import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Drawer, Form, DatePicker, Input, Select, Upload, Icon, Button } from 'antd';
import { SUBMISSION_REPORT, yesterday, dateFormat } from '../constants';
import styles from '../index.less';

const { Option } = Select;

const isLt5M = size => size / 1024 / 1024 < 5;

function LopLogManualModal({ form, visible, loading, onCancel, onUpload }) {
  const { getFieldDecorator, validateFields } = form;

  function handleClose() {
    form.resetFields();
    onCancel();
  }

  function handleCommit() {
    validateFields(async (err, values) => {
      if (!err) {
        const { tradeDate, uploadFiles, ...rest } = values;
        const { bcjson } = (uploadFiles && uploadFiles.length && uploadFiles[0].response) || {};
        const { flag, items = {} } = bcjson || {};

        if (flag === '1' && items) {
          const filename = items.relativeUrl;
          await onUpload({ tradeDate: tradeDate.format('YYYYMMDD'), filename, ...rest });
          form.resetFields();
        }
      }
    });
  }

  return (
    <Drawer
      title={<FormattedMessage id="data-import.lop.manual-import-lop-report" />}
      width={320}
      closable={false}
      bodyStyle={{ paddingBottom: 60, paddingTop: 10 }}
      visible={visible}
      onClose={handleClose}
    >
      <Form layout="vertical">
        <Form.Item label={<FormattedMessage id="data-import.trade-date" />}>
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
        <Form.Item label={<FormattedMessage id="data-import.submitter-code" />}>
          {getFieldDecorator('submitterCode', {
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
            <Select placeholder="please select submission report" allowClear>
              {SUBMISSION_REPORT.map(report => (
                <Option key={report}>{report}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="data-import.lop.submission-report" />}>
          {getFieldDecorator('uploadFiles', {
            rules: [
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (!value) {
                    return callback('Please select a file!');
                  }
                  if (value && value.length) {
                    const file = value[0];
                    if (!isLt5M(file.size)) {
                      return callback('file size must less than 5M');
                    }
                    if (file.error) {
                      return callback(file.error.message);
                    }
                  }
                  return callback();
                },
              },
            ],
            valuePropName: 'fileList',
            getValueFromEvent: e => {
              if (Array.isArray(e)) {
                return e;
              }
              // just show one recent file
              return e && e.fileList.slice(-1);
            },
          })(
            <Upload
              accept=".xlsm,.xls,.xlsx,.pdf,application/msexcel"
              action="/upload?fileClass=ECP"
              beforeUpload={file => isLt5M(file.size)}
            >
              <Button>
                <Icon type="upload" />
                <FormattedMessage id="data-import.browse" />
              </Button>
            </Upload>,
          )}
        </Form.Item>
      </Form>
      <div className={styles['bottom-btns']}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="primary" loading={loading} onClick={handleCommit}>
          Commit
        </Button>
      </div>
    </Drawer>
  );
}

export default Form.create()(LopLogManualModal);
