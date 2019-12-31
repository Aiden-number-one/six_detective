import React, { useState } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Drawer, Form, Input, Upload, Icon, Button, Table } from 'antd';
import styles from '../index.less';

const { Column } = Table;
const isLt5M = size => size / 1024 / 1024 < 5;

const data = [];
// eslint-disable-next-line no-plusplus
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
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

function EditableTable({ depart, form }) {
  const [editKey, setEditKey] = useState('');

  return (
    <EditableContext.Provider value={form}>
      <Table
        bordered
        rowKey="extendKey"
        dataSource={depart.extendInfo}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
      >
        <Column
          title="参数ID"
          dataIndex="extendKey"
          width="40"
          onCell={record => ({
            record,
            dataIndex: 'extendKey',
            title: '参数ID',
            editing: editKey === record.extendKey,
          })}
        />
        <Column
          title="参数名称"
          dataIndex="extendKeyName"
          onCell={record => ({
            record,
            dataIndex: 'extendKeyName',
            editing: editKey === record.extendKey,
          })}
        />
        <Column
          title="值"
          dataIndex="extendValue"
          width="40"
          onCell={record => ({
            record,
            dataIndex: 'extendValue',
            editing: editKey === record.extendKey,
          })}
        />
        <Column
          title="说明"
          dataIndex="remark"
          onCell={record => ({
            record,
            dataIndex: 'remark',
            editing: editKey === record.extendKey,
          })}
        />
        <Column
          title="操作"
          dataIndex="action"
          width="14%"
          render={(_text, record) => {
            const isEditable = editKey === record.extendKey;
            return isEditable ? (
              <span>
                <EditableContext.Consumer>{() => <a>保存</a>}</EditableContext.Consumer>
                <a onClick={() => setEditKey('')}>取消</a>
              </span>
            ) : (
              <a onClick={() => setEditKey(record.extendKey)}>编辑</a>
            );
          }}
        />
      </Table>
    </EditableContext.Provider>
  );
}

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
        <EditableTable />
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
