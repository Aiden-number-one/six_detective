import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { Tree, List, Form, Button, Table, Divider } from 'antd';
import DepartmentModal from './DepartmentModal';
import styles from './Department.less';

const { TreeNode } = Tree;
const { Column } = Table;

function loop(orgsTree) {
  return orgsTree.map(item => {
    const { children, departmentId, departmentName, parentDepartmentId } = item;
    if (children) {
      return (
        <TreeNode key={departmentId} title={departmentName} parentId={parentDepartmentId}>
          {loop(children)}
        </TreeNode>
      );
    }
    return <TreeNode key={departmentId} title={departmentName} parentId={parentDepartmentId} />;
  });
}

function getOrgDetail(dispatch, curSelectOrg) {
  const { departmentId, departmentName, parentDepartmentId } = curSelectOrg;
  if (departmentId) {
    dispatch({
      type: 'auth/queryDepartments',
      params: {
        departmentId,
        departmentName,
        parentDepartmentId,
      },
    });

    dispatch({
      type: 'auth/queryEmployees',
      params: {},
    });
  }
}

function Department({ dispatch, orgs = [], employees = [], departments = [], isDelDepartSuccess }) {
  useEffect(() => {
    dispatch({
      type: 'auth/queryOrgs',
      params: {
        treeLevel: '2',
      },
    });
  }, []);

  // select default dept
  const [curSelectOrg, setOrg] = useState({});
  useEffect(() => {
    if (orgs.length > 0) {
      setOrg(orgs[0]);
      getOrgDetail(dispatch, orgs[0]);
    }
  }, [orgs]);

  const [childDeparts, setChildDeparts] = useState([]);
  useEffect(() => {
    if (departments.length > 0) {
      setChildDeparts(departments);
    }
  }, [departments]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [curSelectDepart, setDepart] = useState({});

  function handleSelect(selectKey, info) {
    // console.log(selectKey, info.node.props);

    const { title, eventKey, parentId } = info.node.props;
    const dept = {
      departmentId: eventKey,
      departmentName: title,
      parentDepartmentId: parentId,
    };

    setOrg(dept);
    getOrgDetail(dispatch, dept);
  }

  async function saveDepart(dep, type) {
    const TYPE = type === 1 ? 'auth/addDepartment' : 'auth/updateDepartment';
    const { departmentId, departmentName, parentDepartmentId } = dep;
    await dispatch({
      type: TYPE,
      params: {
        departmentId,
        departmentName,
        parentDepartmentId,
      },
    });
    await dispatch({
      type: 'auth/queryDepartments',
      params: {
        departmentId,
        departmentName,
        parentDepartmentId,
      },
    });
  }

  async function modifyDepart(dep = {}) {
    if (dep) {
      setDepart(dep);
    } else {
      const { departmentId, departmentName, parentDepartmentId } = curSelectOrg;
      await dispatch({
        type: 'auth/queryDepartments',
        params: {
          departmentId,
          departmentName,
          parentDepartmentId,
        },
      });
      setDepart(departments[0]);
    }
    setModalVisible(true);
  }

  async function deleteDepart(dep = {}) {
    const { departmentId } = dep;
    dispatch({
      type: 'auth/delDepartment',
      params: {
        departmentId,
      },
    });

    if (isDelDepartSuccess) {
      setChildDeparts(childDeparts.filter(item => item.departmentId !== departmentId));
    }
  }

  if (orgs.length === 0) {
    return <p>loading</p>;
  }

  if (departments.length === 0) {
    return <p>loading </p>;
  }

  return (
    <div className={styles.container}>
      <div className={classNames(styles['parent-group'])}>
        <Tree onSelect={handleSelect} defaultSelectedKeys={[curSelectOrg.departmentId]}>
          {loop(orgs)}
        </Tree>
      </div>
      <div className={classNames(styles['child-group'])}>
        <DepartmentModal
          depart={curSelectDepart}
          isModalVisible={isModalVisible}
          close={() => setModalVisible(false)}
          save={() => saveDepart(curSelectDepart)}
        />
        <List
          size="small"
          header={
            <div>
              <Button type="primary" onClick={() => setModalVisible(true)}>
                新增下级部门
              </Button>
              <Button type="primary" onClick={() => modifyDepart()}>
                修改部门
              </Button>
              <Button type="danger" onClick={() => deleteDepart()}>
                删除部门
              </Button>
            </div>
          }
          dataSource={childDeparts.filter(item => item.departmentType === '1')}
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
        <Table dataSource={employees} bordered rowKey="loginName">
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
  departments: state.auth.departments,
  isDelDepartSuccess: state.auth.isDelDepartSuccess,
});
export default connect(mapStateToProps)(Form.create()(Department));
