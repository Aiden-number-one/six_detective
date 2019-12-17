import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Drawer, Form, Upload, Icon, Button } from 'antd';
import styles from '../index.less';

const isLt5M = size => size / 1024 / 1024 < 5;

function LopLogManualModal({ form, visible, handleCancel, handleUpload }) {
  const { getFieldDecorator, validateFields } = form;

  function handleCommit() {
    validateFields((err, values) => {
      if (!err) {
        const { uploadFiles, ...rest } = values;

        const { bcjson } = (uploadFiles && uploadFiles.length && uploadFiles[0].response) || {};
        const { flag, items = {} } = bcjson || {};

        if (flag === '1' && items) {
          // file name format: 20191314_tp001_0.csv
          const parseFiles = items.relativeUrl.split('/');
          const fileName = parseFiles.slice(-1)[0];
          const fileDir = parseFiles.slice(1, -1).reduce((acc, cur) => `${acc}${cur}/`, '');
          const fileType = fileName.replace(/\d{8}_\d{1}_/, '');
          handleUpload({ fileName, fileDir, fileType, ...rest });
          form.resetFields();
        }
      }
    });
  }

  return (
    <Drawer
      title={<FormattedMessage id="data-import.market.manual-upload" />}
      width={320}
      closable={false}
      bodyStyle={{ paddingBottom: 80 }}
      visible={visible}
      onClose={handleCancel}
    >
      <Form layout="inline">
        <Form.Item label={<FormattedMessage id="data-import.market.file" />}>
          {getFieldDecorator('uploadFiles', {
            rules: [
              {
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
              accept=".xlsm,.csv,.xls,.xlsx,.pdf,application/msexcel"
              action="/upload?fileClass=MARKET"
              beforeUpload={file => isLt5M(file.size)}
            >
              <Button>
                <Icon type="upload" />
                <FormattedMessage id="data-import.lop.browse" />
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
