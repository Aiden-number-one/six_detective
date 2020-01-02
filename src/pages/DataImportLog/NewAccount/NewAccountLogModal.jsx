import React, { useState } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Drawer, Form, Input, Upload, Icon, Button, Table } from 'antd';
import styles from '../index.less';

const { Column } = Table;
const isLt5M = size => size / 1024 / 1024 < 5;

const EditableContext = React.createContext();

function EditableCell({ editing, dataIndex, title, record, children, ...restProps }) {
  return (
    <EditableContext.Consumer>
      {({ getFieldDecorator }) => (
        <td {...restProps}>
          {editing ? (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
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

export function FileTable({ fileList, form }) {
  const [uid, setUid] = useState('');

  return (
    <EditableContext.Provider value={form}>
      <Table
        rowKey="uid"
        dataSource={fileList}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        pagination={false}
      >
        <Column title="File Name" dataIndex="name" />
        <Column title="Market" dataIndex="market" />
        <Column title="Submitter Code" dataIndex="submitterCode" />
        <Column
          title="Operation"
          dataIndex="action"
          render={(_text, record) => {
            const isEditable = uid === record.uid;
            return isEditable ? (
              <span>
                <EditableContext.Consumer>{() => <a>Save</a>}</EditableContext.Consumer>
                <a onClick={() => setUid('')}>Cancel</a>
              </span>
            ) : (
              <a onClick={() => setUid(record.uid)}>Remove</a>
            );
          }}
        />
      </Table>
    </EditableContext.Provider>
  );
}

function LopLogManualModal({ form, visible, handleCancel, handleUpload }) {
  const [isFileListVisible, setFileListVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { getFieldDecorator, validateFields } = form;

  function handleChange(info) {
    console.log(info);
    setFileListVisible(true);
    setFileList(info.fileList);
  }
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
      width={600}
      closable={false}
      bodyStyle={{ paddingBottom: 60, paddingTop: 10 }}
      visible={visible}
      onClose={handleCancel}
    >
      <Form className={styles['modal-form']}>
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
              multiple
              accept=".xlsm,.xls,.xlsx,.pdf,application/msexcel"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleChange}
            >
              <Button>
                <Icon type="upload" />
                <FormattedMessage id="data-import.browse" />
              </Button>
            </Upload>,
          )}
        </Form.Item>
      </Form>
      {isFileListVisible && <FileTable fileList={fileList} form={form} />}
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
