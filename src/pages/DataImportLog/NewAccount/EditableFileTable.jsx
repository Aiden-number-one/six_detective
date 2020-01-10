import React from 'react';
import { Drawer, Form, Input, Upload, Icon, Button, Table, Select, Alert, message } from 'antd';
import styles from '../index.less';

const { Column } = Table;
const { Option } = Select;

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

export function EditableFileTable({ fileUid, fileList, form, onEdit, onCancel, onSave, onRemove }) {
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
