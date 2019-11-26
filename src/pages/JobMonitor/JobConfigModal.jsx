import React, { useState } from 'react';
import { Modal, Steps, Input, Form, Radio, Select, Table, Button } from 'antd';

const { Option } = Select;
const { Column } = Table;
const { Step } = Steps;
const EditableContext = React.createContext();

function JobBatch({ form, batch, visible }) {
  const { jobname } = batch;
  const { getFieldDecorator } = form;
  return (
    <Form
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <Form.Item label="作业流程">
        {getFieldDecorator('jobname', {
          initialValue: jobname,
          rules: [{ required: true, message: 'Please input job name!' }],
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="是否强制执行">
        {getFieldDecorator('isRequiredExcu', {
          initialValue: '1',
        })(
          <Radio.Group>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </Radio.Group>,
        )}
      </Form.Item>
    </Form>
  );
}

function SelectJob({ form, taskPoints, visible, getTaskIds }) {
  const [radioVal, setRadioVal] = useState('1');
  const { getFieldDecorator } = form;

  function handleChange(e) {
    setRadioVal(e.target.value);
  }

  function handleSelectChange(val) {
    console.log(val);
  }

  return (
    <Form
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <Form.Item label="">
        {getFieldDecorator('isPartialExcu', {
          initialValue: radioVal,
        })(
          <Radio.Group onChange={handleChange}>
            <Radio value="1">从某点开始</Radio>
            <Radio value="0">执行部分任务</Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      {radioVal === '1' && (
        <Form.Item>
          {getFieldDecorator('taskOption', {
            rules: [{ required: true, message: 'Please select node name!' }],
          })(
            <Select placeholder="Please select node name" onChange={handleSelectChange}>
              {taskPoints.map(({ taskId, nodeName }) => (
                <Option value={taskId} key={taskId}>
                  {nodeName}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      )}
      {radioVal === '0' && (
        <Table
          rowKey="taskId"
          scroll={{ y: 220 }}
          dataSource={taskPoints}
          pagination={false}
          rowSelection={{
            onChange: selectedRowKeys => {
              getTaskIds(selectedRowKeys);
            },
          }}
        >
          <Column title="节点名称" ellipsis dataIndex="nodeName" />
          <Column title="任务名称" ellipsis dataIndex="taskName" />
          <Column title="任务类型" dataIndex="taskType" width={80} />
        </Table>
      )}
    </Form>
  );
}

function EditableCell({ editable, children, dataIndex, restProps }) {
  return (
    <td {...restProps}>
      {editable ? (
        <EditableContext.Consumer>
          {({ getFieldDecorator }) => (
            <Form.Item style={{ margin: 0 }}>
              {dataIndex === 'title' &&
                getFieldDecorator('envTitle', {
                  rules: [
                    {
                      required: true,
                      message: 'title is required.',
                    },
                  ],
                })(
                  <Select placeholder="please select title" style={{ width: 120 }}>
                    <Option value="aa">1231</Option>
                    <Option value="bb">789</Option>
                  </Select>,
                )}

              {dataIndex === 'name' &&
                getFieldDecorator('envName', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: 'name is required.',
                    },
                  ],
                })(<Input placeholder="please input name" />)}
            </Form.Item>
          )}
        </EditableContext.Consumer>
      ) : (
        children
      )}
    </td>
  );
}

function EnvSetting({ form, visible, taskIds }) {
  const [count, setCount] = useState(1);
  const [dataSource, setDataSource] = useState([]);

  function handleAdd() {
    setDataSource([
      ...dataSource,
      {
        no: count,
      },
    ]);
    setCount(count + 1);
  }

  function handleDeleteAll() {
    setCount(1);
    setDataSource([]);
  }

  function handleDeleteOne({ no }) {
    setDataSource(dataSource.filter(item => item.no !== no));
  }

  function handleCommit() {
    form.validateFields((err, values) => {
      console.log(values);
      console.log(taskIds);
    });
  }

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <div>
        <Button type="primary" onClick={handleAdd}>
          新增
        </Button>
        <Button type="danger" onClick={handleDeleteAll}>
          删除全部
        </Button>
      </div>
      <EditableContext.Provider value={form}>
        <Table
          rowKey="no"
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 200 }}
          style={{ margin: '20px 0' }}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
        >
          <Column title="序号" align="center" dataIndex="no" width={60} />
          <Column
            title="名称"
            align="center"
            onCell={record => ({
              record,
              dataIndex: 'title',
              editable: true,
            })}
          />
          <Column
            title="变量值"
            align="center"
            onCell={record => ({
              record,
              dataIndex: 'name',
              editable: true,
            })}
          />
          <Column
            title="操作"
            align="center"
            width={80}
            dataIndex="action"
            render={(_text, record) => <a onClick={() => handleDeleteOne(record)}>删除</a>}
          />
        </Table>
      </EditableContext.Provider>
      <Button type="primary" onClick={handleCommit}>
        执行
      </Button>
    </div>
  );
}

function StepContent({ step, batch, taskPoints, form }) {
  const [taskIds, setTaskIds] = useState('');
  function getTaskIds(ids) {
    setTaskIds(ids);
  }
  return (
    <>
      <JobBatch batch={batch} form={form} visible={step === 0} />
      <SelectJob taskPoints={taskPoints} form={form} visible={step === 1} getTaskIds={getTaskIds} />
      <EnvSetting form={form} visible={step === 2} taskIds={taskIds} />
    </>
  );
}

const WrapStepContent = Form.create({ name: 'jobStep' })(StepContent);

export default function({ visible, onCancelModal, batch, taskPoints }) {
  const [curStep, setCurStep] = useState(0);
  function handleChange(step) {
    setCurStep(step);
  }

  return (
    <Modal
      title="作业执行配置信息"
      visible={visible}
      footer={null}
      onCancel={() => onCancelModal(false)}
    >
      <Steps current={curStep} onChange={handleChange} style={{ marginBottom: 24 }}>
        <Step title="作业批次" />
        <Step title="选择任务" />
        <Step title="变量设置" />
      </Steps>
      <WrapStepContent step={curStep} batch={batch} taskPoints={taskPoints} />
    </Modal>
  );
}
