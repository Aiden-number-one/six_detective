import React, { useState } from 'react';
import { Button, Table, Divider } from 'antd';
import DepartUserModal from './DepartUserModal';

const { Column } = Table;

function DepartUser({ loading, employees, departments }) {
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [curUser, setCurUser] = useState(null);
  function editUser(user) {
    setUserModalVisible(true);
    setCurUser(user);
  }

  function saveUser(user) {
    console.log(user);

    setUserModalVisible(false);
  }
  return (
    <div className="user">
      <DepartUserModal
        visible={isUserModalVisible}
        departs={departments}
        user={curUser}
        handleCancel={() => setUserModalVisible(false)}
        save={user => saveUser(user)}
      />
      <Button type="primary" onClick={() => setUserModalVisible(true)}>
        添加员工
      </Button>
      <Table
        bordered
        rowKey="loginName"
        loading={loading['auth/queryEmployees']}
        dataSource={employees}
        pagination={{ pageSize: 5 }}
      >
        <Column title="员工姓名" dataIndex="customerName" align="center" />
        <Column title="登录名" dataIndex="loginName" align="center" />
        <Column title="公司部门" dataIndex="departmentName" align="center" />
        <Column title="邮箱地址" dataIndex="email" align="center" />
        <Column
          title="Action"
          key="操作"
          width="120px"
          align="center"
          render={user => (
            <span>
              <a onClick={() => editUser(user)}>编辑</a>
              <Divider type="vertical" />
              <a>查看职能</a>
            </span>
          )}
        />
      </Table>
    </div>
  );
}

export default DepartUser;
