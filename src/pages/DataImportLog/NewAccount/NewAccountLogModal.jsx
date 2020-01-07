import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Drawer, Form, Input, Upload, Icon, Button, Table, Select, Alert } from 'antd';

import styles from '../index.less';

const { Column } = Table;
const { Option } = Select;

const warningMsg = 'Please validate before upload. If information is incorrect,please edit.';

const isLt5M = size => size / 1024 / 1024 < 5;

const EditableContext = React.createContext();

function EditableCell({ editing, dataIndex, title, record, children, ...restProps }) {
  return (
    <EditableContext.Consumer>
      {({ getFieldDecorator }) => (
        <td {...restProps} style={{ padding: 16 }}>
          {editing ? (
            <Form.Item>
              {dataIndex === 'market' &&
                getFieldDecorator(dataIndex, {
                  rules: [
                    {
                      required: true,
                      message: `Please select ${title}!`,
                    },
                  ],
                  initialValue: record[dataIndex],
                })(
                  <Select>
                    <Option value="HKFE">HKFE</Option>
                    <Option value="SEHK">SEHK</Option>
                  </Select>,
                )}
              {dataIndex === 'submitterCode' &&
                getFieldDecorator(dataIndex, {
                  rules: [
                    {
                      required: true,
                      message: `Please Input ${title}!`,
                    },
                  ],
                  initialValue: record[dataIndex],
                })(<Input />)}
            </Form.Item>
          ) : (
            children
          )}
        </td>
      )}
    </EditableContext.Consumer>
  );
}

function EditableFileTable({ fileUid, fileList, form, onEdit, onCancel, onSave, onRemove }) {
  return (
    <EditableContext.Provider value={form}>
      <Table
        rowKey="uid"
        dataSource={fileList}
        rowClassName={styles['editable-row']}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        pagination={false}
      >
        <Column
          width={180}
          ellipsis
          title="File Name"
          dataIndex="fileName"
          render={text => <span title={text}>{text}</span>}
        />
        <Column
          width={120}
          align="center"
          title="Market"
          dataIndex="market"
          onCell={record => ({
            record,
            align: 'center',
            dataIndex: 'market',
            title: 'Market',
            editing: fileUid === record.uid,
          })}
        />
        <Column
          title="Submitter Code"
          dataIndex="submitterCode"
          onCell={record => ({
            record,
            dataIndex: 'submitterCode',
            title: 'Submitter Code',
            editing: fileUid === record.uid,
          })}
        />
        <Column
          title="Operation"
          dataIndex="action"
          render={(text, record) => {
            const isEditable = fileUid === record.uid;
            return (
              <span>
                {isEditable ? (
                  <>
                    <EditableContext.Consumer>
                      {() => (
                        <a style={{ marginRight: 10 }} onClick={() => onSave(record.uid)}>
                          Save
                        </a>
                      )}
                    </EditableContext.Consumer>
                    <a onClick={onCancel}>Cancel</a>
                  </>
                ) : (
                  <a disabled={fileUid !== ''} onClick={() => onEdit(record)}>
                    Edit
                  </a>
                )}
                <a
                  style={{ marginLeft: 10 }}
                  disabled={fileUid !== ''}
                  onClick={() => onRemove(record)}
                >
                  Remove
                </a>
              </span>
            );
          }}
        />
      </Table>
    </EditableContext.Provider>
  );
}

function NewAccountLogManualModal({ form, visible, parseFiles, onHide, onParseFiles, onUpload }) {
  const [fileUid, setFileUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [validFiles, setValidFiles] = useState([]);
  const [parseErrs, setParseErrs] = useState([]);

  useEffect(() => {
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
        .map(file => `${file.fileName}, ${file.detail}`);

      setValidFiles(files);
      setParseErrs(errs);
      setFileList([]);
    }
  }, [parseFiles]);

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

    return false;
  }

  async function handleParseFiles() {
    setValidFiles([]);
    setParseErrs([]);
    onParseFiles(fileList.map(item => item.file));
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
    setFileList([]);
    setValidFiles([]);
    setParseErrs([]);
    onHide();
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
      bodyStyle={{ paddingBottom: 60, paddingTop: 10 }}
      visible={visible}
      onClose={onHide}
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
      {parseErrs.length > 0 && (
        <ul className={styles['account-error']}>
          {parseErrs.map(text => (
            <li key={text}>
              <Icon type="close-circle" className={styles.icon} />
              {text}
            </li>
          ))}
        </ul>
      )}
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
        <Button onClick={onHide}>Cancel</Button>
        <Button type="primary" disabled={!fileList.length} onClick={handleParseFiles}>
          Parse Files
        </Button>
        <Button
          type="primary"
          loading={loading}
          disabled={!validFiles.length}
          onClick={handleCommit}
        >
          Commit
        </Button>
      </div>
    </Drawer>
  );
}

export default Form.create()(NewAccountLogManualModal);
