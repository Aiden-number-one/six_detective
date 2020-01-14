import React, { useState } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Drawer, Form, Upload, Icon, Button, Alert, message } from 'antd';
import { ErrorList } from './ErrorList';
import { EditableFileTable } from './EditableFileTable';
import styles from '../index.less';

const tipMsg = 'Please press "Parse Files" button to display the files';
const warningMsg = 'Please validate before upload. If information is incorrect,please edit.';

const isLt5M = size => size / 1024 / 1024 < 5;

function NewAccountLogManualModal({
  form,
  visible,
  parseLoading,
  onCancel,
  onParseFiles,
  onUpload,
}) {
  const [fileUid, setFileUid] = useState('');
  const [isTipVisible, setTipVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [validFiles, setValidFiles] = useState([]);
  const [parseErrs, setParseErrs] = useState([]);

  const { getFieldDecorator } = form;

  function handleBeforeUpload(file, fList) {
    setFileList([
      ...fileList,
      ...fList.map(f => ({
        uid: f.uid,
        file: f,
        fileName: f.name,
        market: 'HKFE',
        submitterCode: '',
      })),
    ]);
    setTipVisible(true);
    return false;
  }

  function handleSave(uid) {
    form.validateFields((err, values) => {
      const { uploadFiles, ...rest } = values;
      if (!err) {
        setValidFiles(
          validFiles.map(item => {
            if (item.uid === uid) {
              return {
                ...item,
                ...rest,
              };
            }
            return item;
          }),
        );
        setFileUid('');
      }
    });
  }

  function handleRemove(file) {
    const leftFileList = validFiles.filter(f => f.uid !== file.uid);
    setValidFiles(leftFileList);
    if (!leftFileList.length) {
      form.resetFields();
    }
  }

  function fileHandle(e) {
    if (e) {
      setLoading(false);
    }
  }

  function allUploadFinish() {
    setLoading(false);
    form.resetFields();
    message.success('Uploaded Successfully');
    handleCancelModal();
  }

  function handleCancelModal() {
    setFileList([]);
    setValidFiles([]);
    setParseErrs([]);
    setTipVisible(false);
    onCancel();
  }

  async function handleParseFiles() {
    setValidFiles([]);
    setParseErrs([]);
    const parseFiles = await onParseFiles(fileList.map(item => item.file));
    if (parseFiles.length > 0) {
      const files = parseFiles
        .filter(file => file.flag === 'T')
        .map(file => {
          const fileBinary = fileList.find(item => item.fileName === file.fileName);
          return {
            ...fileBinary,
            ...file,
          };
        });

      const errs = parseFiles
        .filter(file => file.flag === 'F')
        .map(file => `${file.fileName}, ${file.detail}.`);

      setValidFiles(files);
      setParseErrs(errs);
      setFileList([]);
    }
    setTipVisible(false);
  }

  async function handleCommit() {
    form.validateFields(async err => {
      if (!err) {
        const noSubmitterCodeFile = validFiles.find(item => !item.submitterCode);
        if (noSubmitterCodeFile) {
          setFileUid(noSubmitterCodeFile.uid);
        } else if (validFiles.length > 0) {
          setLoading(true);
          onUpload(validFiles, fileHandle, allUploadFinish);
        }
      }
    });
  }

  return (
    <Drawer
      title={<FormattedMessage id="data-import.new-account.manual-upload" />}
      width={750}
      closable={false}
      className={styles['drawer-container']}
      bodyStyle={{ paddingBottom: 60, paddingTop: 10 }}
      visible={visible}
      onClose={handleCancelModal}
    >
      <Alert message={warningMsg} type="warning" showIcon banner />
      <Form layout="vertical">
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
            getValueFromEvent(e) {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            },
          })(
            <Upload
              multiple
              accept=".xlsm,.xls,.xlsx,.csv,.pdf,application/msexcel"
              showUploadList={false}
              beforeUpload={handleBeforeUpload}
            >
              <Button>
                <Icon type="upload" />
                <FormattedMessage id="data-import.browse" />
              </Button>
            </Upload>,
          )}
        </Form.Item>
      </Form>
      {isTipVisible && <div className={styles.tip}>{tipMsg}</div>}
      {parseErrs.length > 0 && <ErrorList dataSource={parseErrs} />}
      {validFiles.length > 0 && (
        <EditableFileTable
          form={form}
          fileUid={fileUid}
          fileList={validFiles}
          onSave={handleSave}
          onRemove={handleRemove}
          onCancel={() => setFileUid('')}
          onEdit={record => setFileUid(record.uid)}
        />
      )}
      <div className={styles['bottom-btns']}>
        <Button onClick={handleCancelModal}>Cancel</Button>
        <Button
          type="primary"
          disabled={!fileList.length}
          loading={parseLoading}
          onClick={handleParseFiles}
        >
          Parse Files
        </Button>
        <Button
          type="primary"
          loading={loading}
          disabled={!validFiles.length}
          onClick={handleCommit}
        >
          Upload
        </Button>
      </div>
    </Drawer>
  );
}

export default Form.create({ name: 'newAccount' })(NewAccountLogManualModal);
