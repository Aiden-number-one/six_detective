import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Tree, Col, Row, Divider, Button } from 'antd';

const { TreeNode } = Tree;

function loopRoleGroups(roleGroupsTree) {
  return roleGroupsTree.map(item => {
    const { childRole, groupId, groupName, roleId, roleName } = item;
    if (childRole) {
      return (
        <TreeNode key={groupId} title={groupName} groupId={groupId}>
          {loopRoleGroups(childRole)}
        </TreeNode>
      );
    }
    return <TreeNode key={roleId} title={roleName} groupId={groupId} roleId={roleId} />;
  });
}

function loopRoleMenus(roleMenusTree) {
  return roleMenusTree.map(item => {
    const { children, menuId, menuName, parentMenuId } = item;

    if (children) {
      return (
        <TreeNode key={menuId} title={menuName} pId={parentMenuId}>
          {loopRoleMenus(children)}
        </TreeNode>
      );
    }
    return <TreeNode key={menuId} title={menuName} pId={parentMenuId} />;
  });
}

function Auth({ dispatch, roleGroups = [], roleMenus = [], checkedRoleMenus = [] }) {
  useEffect(() => {
    // dispatch({
    //   type: 'auth/queryRoleGroups',
    // });
    // dispatch({
    //   type: 'auth/queryRoleMenus',
    // });
  }, []);

  const [curRoleId, setCurRoleId] = useState('');
  const [checkedMenuKeys, setCheckedMenuKeys] = useState([]);
  const [isAuthMenuVisible, setAuthMenuVisible] = useState(false);

  async function handleSelect(key, info) {
    const { roleId } = info.node.props;
    if (roleId) {
      console.log(roleId);
      dispatch({
        type: 'auth/queryRoleMenusById',
        params: {
          roleId,
        },
      });
      setCurRoleId(roleId);
      setCheckedMenuKeys(checkedRoleMenus);
    }
    setAuthMenuVisible(!!roleId);
  }

  function setRoleMenu() {
    dispatch({
      type: 'auth/setRoleMenu',
      params: {
        roleId: curRoleId,
        menuId: checkedMenuKeys.join(),
      },
    });
  }

  if (roleGroups.length === 0 && roleMenus.length === 0) {
    return <p>loading</p>;
  }

  return (
    <div>
      <Row>
        <Col span={12}>
          <Tree onSelect={handleSelect}>{loopRoleGroups(roleGroups)}</Tree>
        </Col>
        <Col span={12}>
          <div>
            <Button type="danger" onClick={setRoleMenu} disabled={!isAuthMenuVisible}>
              授权菜单权限
            </Button>
            <Button
              type="danger"
              disabled={!isAuthMenuVisible}
              onClick={() => setCheckedMenuKeys(roleMenus.map(menu => menu.menuId))}
            >
              选择全部权限
            </Button>
            <Button disabled={!isAuthMenuVisible} onClick={() => setCheckedMenuKeys([])}>
              清除权限
            </Button>
          </div>
          <Divider />
          {isAuthMenuVisible && (
            <Tree checkable checkedKeys={checkedMenuKeys}>
              {loopRoleMenus(roleMenus)}
            </Tree>
          )}
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = state => ({
  roleGroups: state.auth.roleGroups,
  roleMenus: state.auth.roleMenus,
  checkedRoleMenus: state.auth.checkedRoleMenus,
});
export default connect(mapStateToProps)(Auth);
