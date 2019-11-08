import React from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';

import DepartTable from './DepartTable';

function DepartModal({ isModalVisible, depart, form, close }) {
  function handleOk() {
    close();
  }

  return (
    <Modal title="修改部门" width="50%" visible={isModalVisible} onOk={handleOk} onCancel={close}>
      <div>
        <Form layout="inline">
          <Row>
            <Col span={12}>
              <Form.Item label="部门ID" colon>
                {form.getFieldDecorator('departmentId1', {
                  initialValue: depart.departmentId,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your departmentId!',
                    },
                  ],
                })(<Input placeholder="部门ID" disabled />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部门名称" colon>
                {form.getFieldDecorator('departmentName', {
                  initialValue: depart.departmentName,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your departmentId!',
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
                  initialValue: depart.departmentType,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your departmentId!',
                    },
                  ],
                })(<Input placeholder="部门类型" />)}
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
