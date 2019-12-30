import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Drawer, Form, Input, Upload, Icon, Button } from 'antd';
import styles from '../index.less';

const isLt5M = size => size / 1024 / 1024 < 5;

function LopLogManualModal({ form, visible, handleCancel, handleUpload }) {
  const { getFieldDecorator, validateFields } = form;

  function handleCommit() {
    validateFields(async (err, values) => {
      if (!err) {
        const { uploadFiles, ...rest } = values;
        const { bcjson } = (uploadFiles && uploadFiles.length && uploadFiles[0].response) || {};
        const { flag, items = {} } = bcjson || {};

        if (flag === '1' && items) {
          const filename = items.relativeUrl;
          await handleUpload({ filename, ...rest });
          form.resetFields();
        }
      }
    });
  }

  return (
    <Drawer
      title={<FormattedMessage id="data-import.new-account.manual-upload" />}
      width={320}
      closable={false}
      bodyStyle={{ paddingBottom: 60, paddingTop: 10 }}
      visible={visible}
      onClose={handleCancel}
    >
      <Form className={styles['modal-form']}>
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
              action="/upload"
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
        <Button onClick={handleCancel}>Cancel</Button>
        <Button type="primary" onClick={handleCommit}>
          Commit
        </Button>
      </div>
    </Drawer>
  );
}

export default Form.create()(LopLogManualModal);
