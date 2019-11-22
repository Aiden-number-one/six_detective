/*
 * @Des: Please Modify First
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-18 16:57:04
 * @LastEditors: iron
 * @LastEditTime: 2019-11-19 14:38:42
 */

import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

export function loopOrgs(orgsTree) {
  return orgsTree.map(item => {
    const { children, departmentId, departmentName, parentDepartmentId } = item;
    if (children) {
      return (
        <TreeNode key={departmentId} title={departmentName} parentId={parentDepartmentId}>
          {loopOrgs(children)}
        </TreeNode>
      );
    }
    return <TreeNode key={departmentId} title={departmentName} parentId={parentDepartmentId} />;
  });
}

export function loopRoleGroups(roleGroupsTree) {
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

export function loopRoleMenus(roleMenusTree) {
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
