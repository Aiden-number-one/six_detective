import React, { useState, useEffect } from 'react';
import { Radio, Input, Row, Tree, Col } from 'antd';
import { connect } from 'dva';
import { loopRoleGroups, loopOrgs } from '../common';
import Department from './Department';
import DepartUser from './DepartUser';
import RoleUser from './RoleUser';
import styles from './index.less';

function OrgTree({ orgs, curSelectOrg, handleDepart }) {
  function handleSelect(selectKey, info) {
    const { title, eventKey, parentId } = info.node.props;

    handleDepart({
      departmentId: eventKey,
      departmentName: title,
      parentDepartmentId: parentId,
    });
  }

  return (
    <Tree
      blockNode
      selectable
      onSelect={handleSelect}
      selectedKeys={[curSelectOrg.departmentId]}
      defaultSelectedKeys={[curSelectOrg.departmentId]}
    >
      {loopOrgs(orgs)}
    </Tree>
  );
}

function RoleTree({ roleGroups, handleRoleGroup }) {
  function handleSelect(selectKey, info) {
    const { title, roleId, groupId } = info.node.props;
    handleRoleGroup({
      roleId,
      roleName: title,
      groupId,
    });
  }
  return (
    <Tree blockNode selectable onSelect={handleSelect}>
      {loopRoleGroups(roleGroups)}
    </Tree>
  );
}

function DepartManagement({ dispatch, loading, roleGroups, orgs, departments, employees }) {
  const [curRadio, setCurRadio] = useState('orgs');

  useEffect(() => {
    dispatch({
      type: 'auth/queryOrgs',
      params: {
        treeLevel: '2',
      },
    });
  }, []);

  const [curSelectOrg, setSelectOrg] = useState({});
  useEffect(() => {
    if (orgs.length > 0) {
      setSelectOrg(orgs[0]);
      getOrgDetail(orgs[0]);
    }
  }, [orgs]);

  function getOrgDetail(org) {
    const { departmentId } = org;
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

  function handleDepart(dept) {
    setSelectOrg(dept);
    getOrgDetail(dept);
  }
  function handleRoleGroup(role) {
    console.log(role);
  }

  function handleChange(e) {
    const val = e.target.value;
    if (val === 'org') {
      getOrgDetail(curSelectOrg);
    } else {
      dispatch({
        type: 'auth/queryRoleGroups',
      });
    }
    setCurRadio(e.target.value);
  }

  if (loading['auth/queryOrgs']) {
    return <p>loading</p>;
  }
  if (orgs.length === 0) {
    return <p>暂无数据</p>;
  }

  return (
    <div className={styles.container}>
      <Row>
        <Col span={5}>
          <Row>
            <Input.Search
              width="100%"
              placeholder="input search text"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          </Row>
          <Row className={styles.m}>
            <Radio.Group onChange={handleChange} defaultValue="orgs">
              <Radio.Button value="orgs">组织架构</Radio.Button>
              <Radio.Button value="roles">报送管理角色</Radio.Button>
            </Radio.Group>
          </Row>
          <Row>
            {curRadio === 'orgs' ? (
              <OrgTree orgs={orgs} curSelectOrg={curSelectOrg} handleDepart={handleDepart} />
            ) : (
              <RoleTree roleGroups={roleGroups} handleRoleGroup={handleRoleGroup} />
            )}
          </Row>
        </Col>

        <Col span={18} offset={1}>
          {curRadio === 'orgs' ? (
            <>
              <Row>
                <Department curSelectOrg={curSelectOrg} departments={departments} />
              </Row>
              <Row>
                <DepartUser loading={loading} employees={employees} departments={departments} />
              </Row>
            </>
          ) : (
            <Row>
              <RoleUser />
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
}
const mapStateToProps = ({ loading, auth: { orgs, employees, departments, roleGroups } }) => ({
  loading: loading.effects,
  orgs,
  employees,
  departments,
  roleGroups,
});
export default connect(mapStateToProps)(DepartManagement);
