import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { List, Button, message } from 'antd';
import DepartmentModal from './DepartmentModal';
import styles from './Department.less';

function Department({ dispatch, loading, curSelectOrg, departments }) {
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

  return (
    <div className={styles.container}>
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
      </div>
    </div>
  );
}

const mapStateToProps = ({ loading }) => ({
  loading: loading.effects,
});
export default connect(mapStateToProps)(Department);
