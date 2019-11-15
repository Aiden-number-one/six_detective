import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { Tree, List, Form, Button, Table, Divider, message } from 'antd';
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
  const { departmentId } = curSelectOrg;
  if (departmentId) {
    dispatch({
      type: 'auth/queryDepartments',
      params: {
        departmentId,
      },
    });

    dispatch({
      type: 'auth/queryEmployees',
      params: {
        departmentId,
      },
    });
  }
}

function Department({ dispatch, loading, orgs, employees, departments }) {
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

  const [curSelectDepart, setDepart] = useState({});
  const [curChildDept, setCurChildDept] = useState({});
  const [childDeparts, setChildDeparts] = useState([]);
  useEffect(() => {
    if (departments.length > 0) {
      const curDept = departments.find(item => item.departmentId === curSelectOrg.departmentId);
      if (curDept) {
        setDepart(curDept);
        setChildDeparts(curDept.childMenus);
      }
    }
  }, [departments]);

  const [actionType, setActionType] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);

  function handleSelect(selectKey, info) {
    const { title, eventKey, parentId } = info.node.props;
    const dept = {
      departmentId: eventKey,
      departmentName: title,
      parentDepartmentId: parentId,
    };
    setOrg(dept);
    getOrgDetail(dispatch, dept);
  }

  function modifyOrg() {
    setCurChildDept(null);
    if (departments.length > 0) {
      const curDept = departments.find(item => item.departmentId === curSelectOrg.departmentId);
      if (curDept) {
        setDepart(curDept);
      }
    }
    setActionType(2);
    setModalVisible(true);
  }

  async function deleteOrg() {
    if (departments.length > 0) {
      const curDept = departments.find(item => item.departmentId === curSelectOrg.departmentId);
      if (curDept) {
        const { departmentId } = curDept;
        try {
          await dispatch({
            type: 'auth/delDepartment',
            params: {
              departmentId,
            },
          });
          setChildDeparts(childDeparts.filter(item => item.departmentId !== departmentId));
          message.success('delete success');
        } catch (error) {
          message.error(error);
        }
      }
    }
  }

  async function saveDepart(type, dep) {
    const TYPE = type === 1 ? 'auth/addDepartment' : 'auth/updateDepartment';
    const { departmentId, departmentName, departmentType } = dep;
    const { departmentId: curId } = curSelectOrg;

    try {
      await dispatch({
        type: TYPE,
        params: {
          departmentId,
          departmentName,
          departmentType,
          extendInfo: '',
          showorder: 9999,
          parentDepartmentId: curId,
        },
      });
      if (actionType === 1) {
        setChildDeparts(childDeparts.concat(dep));
      } else {
        setChildDeparts(
          childDeparts.map(item => {
            if (item.departmentId === departmentId) {
              return { ...item, ...dep };
            }
            return item;
          }),
        );
      }
      setModalVisible(false);
    } catch (error) {
      message.error(error);
    }
  }

  function addDepart() {
    setActionType(1);
    setModalVisible(true);
  }

  async function modifyDepart(dep) {
    setDepart(null);
    setCurChildDept(dep);
    setActionType(2);
    setModalVisible(true);
  }

  async function deleteDepart(dep) {
    const { departmentId } = dep;
    try {
      await dispatch({
        type: 'auth/delDepartment',
        params: {
          departmentId,
        },
      });
      setChildDeparts(childDeparts.filter(item => item.departmentId !== departmentId));
      message.success('delete success');
    } catch (error) {
      message.error(error);
    }
  }

  if (loading['auth/queryOrgs']) {
    return <p>loading</p>;
  }
  if (orgs.length === 0) {
    return <p>暂无数据</p>;
  }

  return (
    <div className={styles.container}>
      <div className={classNames(styles['parent-group'])}>
        <Tree
          blockNode
          selectable
          onSelect={handleSelect}
          selectedKeys={[curSelectOrg.departmentId]}
          defaultSelectedKeys={[curSelectOrg.departmentId]}
        >
          {loop(orgs)}
        </Tree>
      </div>
      <div className={classNames(styles['child-group'])}>
        <DepartmentModal
          type={actionType}
          depart={curSelectDepart}
          childDept={curChildDept}
          isModalVisible={isModalVisible}
          close={() => setModalVisible(false)}
          save={(type, dep) => saveDepart(type, dep)}
        />
        <List
          className={classNames(styles.list)}
          size="small"
          header={
            <div>
              <Button type="primary" onClick={addDepart}>
                新增下级部门
              </Button>
              <Button type="primary" onClick={modifyOrg}>
                修改部门
              </Button>
              <Button type="danger" onClick={deleteOrg}>
                删除部门
              </Button>
            </div>
          }
          dataSource={childDeparts}
          loading={loading['auth/queryDepartments']}
          pagination={
            childDeparts.length > 5
              ? {
                  pageSize: 5,
                }
              : false
          }
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
          <Column title="联系电话" dataIndex="mobile" width="100px" align="center" />
          <Column title="邮箱地址" dataIndex="email" align="center" />
          <Column
            title="Action"
            key="操作"
            width="120px"
            align="center"
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

const mapStateToProps = ({ loading, auth: { orgs, employees, departments } }) => ({
  loading: loading.effects,
  orgs,
  employees,
  departments,
});
export default connect(mapStateToProps)(Form.create()(Department));
