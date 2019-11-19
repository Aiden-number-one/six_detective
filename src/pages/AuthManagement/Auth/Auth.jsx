import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Tree, Col, Row, Divider, Button } from 'antd';
import { loopRoleGroups, loopRoleMenus } from '../common';
import styles from './Auth.less';

function Auth({ dispatch, roleGroups, publicMenus, checkedRoleMenus }) {
  useEffect(() => {
    dispatch({
      type: 'auth/queryRoleGroups',
    });
    dispatch({
      type: 'auth/queryPublicMenus',
      params: {
        endType: '0',
      },
    });
  }, []);

  const [curRoleId, setCurRoleId] = useState('');
  const [checkedMenuKeys, setCheckedMenuKeys] = useState([]);
  const [isAuthMenuVisible, setAuthMenuVisible] = useState(false);

  useEffect(() => {
    setCheckedMenuKeys(checkedRoleMenus);
  }, [checkedRoleMenus]);

  async function handleSelect(selectedKeys, info) {
    const { roleId } = info.node.props;
    if (roleId) {
      setCurRoleId(roleId);
      dispatch({
        type: 'auth/queryRoleMenusById',
        params: {
          roleId,
        },
      });
    }
    setAuthMenuVisible(!!roleId);
  }

  function checkHandle(checkedKeys) {
    setCheckedMenuKeys(checkedKeys);
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

  if (roleGroups.length === 0 && publicMenus.length === 0) {
    return <p>loading</p>;
  }

  return (
    <div>
      <Row className={styles.container}>
        <Col span={8}>
          <Tree className={styles.tree} onSelect={handleSelect}>
            {loopRoleGroups(roleGroups)}
          </Tree>
        </Col>
        <Col span={8} offset={1}>
          <div>
            <Button type="danger" onClick={setRoleMenu} disabled={!isAuthMenuVisible}>
              授权菜单权限
            </Button>
            <Button
              type="danger"
              disabled={!isAuthMenuVisible}
              onClick={() => setCheckedMenuKeys(publicMenus.map(menu => menu.menuId))}
            >
              选择全部权限
            </Button>
            <Button disabled={!isAuthMenuVisible} onClick={() => setCheckedMenuKeys([])}>
              清除权限
            </Button>
          </div>
          <Divider />
          {isAuthMenuVisible && (
            <Tree
              className={styles.tree}
              checkable
              checkedKeys={checkedMenuKeys}
              onCheck={checkHandle}
            >
              {loopRoleMenus(publicMenus)}
            </Tree>
          )}
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = ({ auth: { roleGroups, publicMenus, checkedRoleMenus } }) => ({
  roleGroups,
  publicMenus,
  checkedRoleMenus,
});
export default connect(mapStateToProps)(Auth);
