import React, { useState } from 'react';
import { Modal, Steps, Input, Form, Radio, Select, Table } from 'antd';

const { Option } = Select;
const { Column } = Table;
const { Step } = Steps;

function JobBatch({ form, batch }) {
  const { jobname } = batch;
  const { getFieldDecorator } = form;
  return (
    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
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

function SelectJob({ form, taskPoints }) {
  const [radioVal, setRadioVal] = useState('1');
  const { getFieldDecorator } = form;

  function handleChange(e) {
    setRadioVal(e.target.value);
  }

  function handleSelectChange(val) {
    console.log(val);
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
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
          rowSelection={rowSelection}
          scroll={{ y: 220 }}
          dataSource={taskPoints}
          pagination={false}
        >
          <Column title="节点名称" ellipsis dataIndex="nodeName" />
          <Column title="任务名称" ellipsis dataIndex="taskName" />
          <Column title="任务类型" dataIndex="taskType" width={80} />
        </Table>
      )}
    </Form>
  );
}

function EnvSetting() {
  return <div>env setting</div>;
}

const WrapJobBatch = Form.create()(JobBatch);
const WrapSelectJob = Form.create()(SelectJob);

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
      {curStep === 0 && <WrapJobBatch batch={batch} />}
      {curStep === 1 && <WrapSelectJob taskPoints={taskPoints} />}
      {curStep === 2 && <EnvSetting />}
    </Modal>
  );
}
