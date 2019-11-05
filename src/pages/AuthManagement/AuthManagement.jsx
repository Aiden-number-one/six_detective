import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { Tree, List, Modal, Form, Button, Input, Row, Col, Table, Divider } from 'antd';

import styles from './AuthMangament.less';
import DepartTable from './DepartTable';

const { TreeNode } = Tree;
const { Column } = Table;

function DepartModal({ isModalVisible, depart, form, close }) {
  function handleOk() {
    close();
  }

  return (
    <Modal title="修改部门" width="60%" visible={isModalVisible} onOk={handleOk} onCancel={close}>
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

const WrapDepartModal = Form.create()(DepartModal);

function loop(orgs) {
  return orgs.map(item => {
    const { children, departmentId, departmentName } = item;
    if (children) {
      return (
        <TreeNode key={departmentId} title={departmentName}>
          {loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={departmentId} title={departmentName} />;
  });
}

function AuthManagement({ dispatch, orgs = [], employees = [] }) {
  const [depart, setDepart] = useState({});
  useEffect(() => {
    dispatch({
      type: 'auth/queryOrgs',
      params: {
        treeLevel: '2',
      },
    });
  }, []);

  const [childDeparts, setChildDeparts] = useState([]);
  useEffect(() => {
    if (orgs[0] && orgs[0].children) {
      setChildDeparts(orgs[0].children);
    }
  }, [orgs]);

  useEffect(() => {
    dispatch({
      type: 'auth/queryEmployees',
      params: {
        treeLevel: '2',
      },
    });
  }, [orgs]);

  const [isModalVisible, setModalVisible] = useState(false);

  function handleSelect(selectKey, info) {
    console.log(1231, info);
  }
  function modifyDepart(dep) {
    setDepart(dep);
    setModalVisible(true);
  }

  async function deleteDepart(dep) {
    const { departmentId } = dep;
    await dispatch({
      type: 'auth/delDepartment',
      params: {
        departmentId,
      },
    });
    setChildDeparts(childDeparts.filter(item => item.departmentId !== departmentId));
  }

  if (orgs.length === 0) {
    return <p>loading</p>;
  }

  console.log(employees);

  return (
    <div className={styles.container}>
      <div className={classNames(styles['parent-group'])}>
        <Tree
          onSelect={handleSelect}
          treeDefaultExpandAll
          defaultSelectedKeys={[orgs[0].departmentId]}
        >
          {loop(orgs)}
        </Tree>
      </div>
      <div className={classNames(styles['child-group'])}>
        <WrapDepartModal
          depart={depart}
          isModalVisible={isModalVisible}
          close={() => setModalVisible(false)}
        />
        <List
          size="small"
          header={
            <div>
              <Button type="primary">新增下级部门</Button>
              <Button type="primary">修改部门</Button>
              <Button type="danger">删除部门</Button>
            </div>
          }
          dataSource={childDeparts}
          pagination={{
            pageSize: 5,
          }}
          renderItem={item => (
            <List.Item
              actions={[
                <a key="list-loadmore-edit" onClick={() => modifyDepart(item)}>
                  修改
                </a>,
                <a key="list-loadmore-more" onClick={() => deleteDepart(item)}>
                  删除
                </a>,
              ]}
            >
              {item.departmentName}
            </List.Item>
          )}
        />
        <Table dataSource={employees} bordered>
          <Column title="员工姓名" dataIndex="customerName" />
          <Column title="登录名" dataIndex="loginName" />
          <Column title="公司部门" dataIndex="departmentName" />
          <Column title="联系电话" dataIndex="mobile" />
          <Column title="邮箱地址" dataIndex="email" />
          <Column
            title="Action"
            key="操作"
            render={() => (
              <span>
                <a>编辑</a>
                <Divider type="vertical" />
                <a>查看职能</a>
              </span>
            )}
          />
        </Table>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  orgs: state.auth.orgs,
  employees: state.auth.employees,
});
export default connect(mapStateToProps)(Form.create()(AuthManagement));
