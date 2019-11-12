import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Select } from 'antd';

import DepartTable from './DepartTable';

function DepartModal({ type, isModalVisible, depart: dept, childDept, form, close, save }) {
  const title = type === 1 ? '新增' : '修改';
  const [depart, setDept] = useState({});

  // console.log('type', type);
  // console.log('dept', dept);
  // console.log('childDept', childDept);

  useEffect(() => {
    if (type !== 1) {
      if (dept) {
        setDept(dept || {});
      } else {
        setDept(childDept || {});
      }
      console.log(9090);
    } else {
      setDept({});
    }
  }, [type, dept, childDept]);

  async function handleOk() {
    form.validateFields((err, values) => {
      if (!err) {
        save(type, values);
        // console.log('Received values of form: ', values);
      }
    });
    // close();
  }

  return (
    <Modal
      title={`${title}部门`}
      width="50%"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={close}
    >
      <div>
        <Form layout="inline">
          <Row>
            <Col span={12}>
              <Form.Item label="部门ID" colon>
                {form.getFieldDecorator('departmentId', {
                  initialValue: depart.departmentId || '',
                  rules: [
                    {
                      required: true,
                      message: 'Please input your departmentId!',
                    },
                  ],
                })(<Input placeholder="部门ID" disabled={type !== 1} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部门名称" colon>
                {form.getFieldDecorator('departmentName', {
                  initialValue: depart.departmentName || '',
                  rules: [
                    {
                      required: true,
                      message: 'Please input your departmentName!',
                    },
                  ],
                })(<Input placeholder="部门名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 30]}>
            <Col span={12}>
              <Form.Item label="部门类型" colon>
                {form.getFieldDecorator('departmentType', {
                  initialValue: depart.departmentType || '1',
                  rules: [
                    {
                      required: true,
                      message: 'Please input your departmenType!',
                    },
                  ],
                })(
                  <Select style={{ width: 160 }}>
                    <Select.Option value="0">公司</Select.Option>
                    <Select.Option value="1">部门</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      {depart.extendInfo && <DepartTable depart={depart} />}
    </Modal>
  );
}

export default Form.create()(DepartModal);
