import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Tree } from 'antd';
import styles from './AuthMangament.less';

const { TreeNode } = Tree;

function loop(departments) {
  return departments.map(item => {
    const { childMenus, departmentId, departmentName } = item;
    if (childMenus) {
      return (
        <TreeNode key={departmentId} title={departmentName || 'parentNode'}>
          {loop(item.childMenus)}
        </TreeNode>
      );
    }
    return <TreeNode key={departmentId} title={departmentName} />;
  });
}

function AuthManagement({ dispatch, departments }) {
  useEffect(() => {
    dispatch({
      type: 'auth/queryDepartment',
      params: {
        parentDepartmentId: '20170906075718487-D2A0-0F9146693',
        departmentId: '20170906080206763-406A-17C45B34D',
        departmentName: '机关第四党支部',
      },
    });
  }, []);

  if (departments.length === 0) {
    return <p>loading</p>;
  }
  // console.log(departments);

  return (
    <div className={styles.container}>
      <Tree>{loop(departments)}</Tree>
    </div>
  );
}

function mapStateToProps(state) {
  // console.log('depart state', state.auth.departments);

  return {
    departments: state.auth.departments.slice(0, 5),
  };
}
export default connect(mapStateToProps)(AuthManagement);
