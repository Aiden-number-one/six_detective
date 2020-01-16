import React, { useState } from 'react';
import { FormattedMessage } from 'umi/locale';
import debounce from 'lodash/debounce';
import { Drawer, Form, DatePicker, Input, Select, Upload, Icon, Button, Spin } from 'antd';
import { SUBMISSION_REPORT, reqFormat, yesterday, dateFormat } from '../constants';
import styles from '../index.less';

const { Option } = Select;

const isLt50M = size => size / 1024 / 1024 < 50;

function LopLogManualModal({ form, visible, loading, onSubmitter, onCancel, onUpload }) {
  const [searchVal, setSearchVal] = useState('');
  const [submitterPage, setSubmitterPage] = useState(1);
  const [submitterTotal, setSubmitterTotal] = useState(0);
  const [submitters, setSubmitters] = useState([]);

  const { getFieldDecorator, setFieldsValue, validateFields } = form;

  function handleClose() {
    form.resetFields();
    setSubmitters([]);
    setSubmitterTotal(0);
    setSubmitterPage(1);
    onCancel();
  }

  async function handleFocus() {
    if (!submitters.length) {
      const { users, total } = await onSubmitter({
        submitterCode: searchVal,
        page: submitterPage,
      });
      setSubmitterTotal(total);
      setSubmitters(users);
    }
  }

  async function handleSearchSubmitterCode(value) {
    if (value) {
      setSearchVal(value);
      setSubmitterPage(1);
      const { users, total } = await onSubmitter({
        submitterCode: value,
        page: submitterPage,
      });
      setSubmitterTotal(total);
      setSubmitters(users);
    }
  }

  async function handleSubmitterScroll(e) {
    e.stopPropagation();
    e.preventDefault();
    const { target } = e;
    console.log(submitterTotal);
    console.log(submitters);
    if (
      target.scrollTop + target.offsetHeight === target.scrollHeight &&
      submitters.length < submitterTotal
    ) {
      const nextScrollPage = submitterPage + 1;
      setSubmitterPage(nextScrollPage);
      const { users } = await onSubmitter({
        submitterCode: searchVal,
        page: nextScrollPage,
      });
      // update submitters
      setSubmitters([...submitters, ...users]);
    }
  }

  function handleSubmitterCodeChange(value, option) {
    setFieldsValue({
      submitterName: option.props.submitter.submitterName,
    });
  }

  function handleCommit() {
    validateFields(async (err, values) => {
      if (!err) {
        const { tradeDate, uploadFiles, submitterCode, ...rest } = values;
        const { bcjson } = (uploadFiles && uploadFiles.length && uploadFiles[0].response) || {};
        const { flag, items = {} } = bcjson || {};
        if (flag === '1' && items && submitterCode) {
          const code = submitterCode.split('-')[1];
          const filename = items.relativeUrl;
          await onUpload({
            tradeDate: tradeDate.format(reqFormat),
            filename,
            submitterCode: code,
            ...rest,
          });
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
          })(
            <Select
              showSearch
              showArrow={false}
              filterOption={false}
              placeholder="please input submitter code"
              defaultActiveFirstOption={false}
              notFoundContent={loading['lop/fetchSubmitters'] ? <Spin size="small" /> : null}
              onChange={handleSubmitterCodeChange}
              onFocus={handleFocus}
              onSearch={debounce(handleSearchSubmitterCode, 800)}
              onPopupScroll={handleSubmitterScroll}
            >
              {submitters.map(item => (
                <Option key={`${item.market}-${item.submitterCode}`} submitter={item}>
                  {`${item.submitterCode} (${item.market})`}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="data-import.submitter-name" />}>
          {getFieldDecorator('submitterName', {
            rules: [
              {
                required: true,
                message: 'Please input submitter name!',
              },
            ],
          })(<Input disabled placeholder="please input submmitter name" />)}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="data-import.file-type" />}>
          {getFieldDecorator('submissionReport', {
            rules: [
              {
                required: true,
                message: 'Please select file type!',
              },
            ],
          })(
            <Select placeholder="please select file type" allowClear>
              {SUBMISSION_REPORT.map(report => (
                <Option key={report}>{report}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="data-import.submission-report" />}>
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
                    if (!isLt50M(file.size)) {
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
              beforeUpload={file => isLt50M(file.size)}
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
        <Button type="primary" loading={loading['lop/importByManual']} onClick={handleCommit}>
          Upload
        </Button>
      </div>
    </Drawer>
  );
}

export default Form.create({ name: 'lop' })(LopLogManualModal);
