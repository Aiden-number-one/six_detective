import React, { useState } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Drawer, Form, Upload, Icon, Button, Input } from 'antd';
import moment from 'moment';
import { dateFormat } from '../constants';
import styles from '../index.less';

const isLt5M = size => size / 1024 / 1024 < 5;
// file name format: 20191314_tp001_0.csv
const fileReg = /(\d{8})_\d_(.*)_(.)\.(.*)/;

function MarketLogManualModal({ form, visible, loading, onCancel, onUpload }) {
  const [upFile, setUpFile] = useState({});
  const { getFieldDecorator, validateFields } = form;

  function handleBeforeUpload(file) {
    return isLt5M(file.size) && fileReg.test(file.name);
  }

  function handleClose() {
    form.resetFields();
    setUpFile({});
    onCancel();
  }

  function handleCommit() {
    validateFields((err, values) => {
      if (!err) {
        const { uploadFiles } = values;

        const { bcjson } = (uploadFiles && uploadFiles.length && uploadFiles[0].response) || {};
        const { flag, items = {} } = bcjson || {};

        if (flag === '1' && items) {
          const parseFiles = items.relativeUrl.split('/');
          const fileName = parseFiles.slice(-1)[0];
          const fileDir = parseFiles.slice(1, -1).reduce((acc, cur) => `${acc}/${cur}`, '');
          const fileType = fileName.replace(fileReg, '$2_$3');
          onUpload({ fileName, fileDir, fileType });
          form.resetFields();
          setUpFile({});
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
      onClose={handleClose}
    >
      <Form layout="vertical">
        <Form.Item label={<FormattedMessage id="data-import.market.file" />}>
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
                      setUpFile({});
                      return callback('file size must less than 5M');
                    }
                    if (file.error) {
                      setUpFile({});
                      return callback(file.error.message);
                    }
                    const fileFormat = file.name.match(fileReg);

                    if (!fileFormat) {
                      setUpFile({});
                      return callback('The format is wrong. Please check the file ');
                    }

                    const tradeDate = fileFormat[1];
                    const fileType = fileFormat[2];
                    const market = fileFormat[3];
                    let marketMap = '';
                    if (market.toLocaleLowerCase() === 'o') {
                      marketMap = 'SEHK';
                    }
                    if (market.toLocaleLowerCase() === 'f') {
                      marketMap = 'HKFE';
                    }

                    setUpFile({
                      fileType,
                      tradeDate: moment(tradeDate).format(dateFormat),
                      market: marketMap,
                    });
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
              beforeUpload={handleBeforeUpload}
              onRemove={() => setUpFile({})}
            >
              <Button>
                <Icon type="upload" />
                <FormattedMessage id="data-import.browse" />
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="data-import.trade-date" />}>
          {getFieldDecorator('tradeDate', {
            initialValue: upFile.tradeDate,
          })(<Input disabled placeholder="trade date" />)}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="data-import.market" />}>
          {getFieldDecorator('market', {
            initialValue: upFile.market,
          })(<Input disabled placeholder="market" />)}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="data-import.market.file-type" />}>
          {getFieldDecorator('fileType', {
            initialValue: upFile.fileType,
          })(<Input disabled placeholder="file type" />)}
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

export default Form.create()(MarketLogManualModal);
