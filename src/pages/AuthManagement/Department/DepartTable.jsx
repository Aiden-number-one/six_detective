import React, { useState } from 'react';
import { Table, Input, Form, Divider } from 'antd';

const { Column } = Table;

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

function DepartTable({ depart, form }) {
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
                <Divider type="vertical" />
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

export default Form.create()(DepartTable);
