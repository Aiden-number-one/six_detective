import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Table, Row, Col, Button, Modal, Input, Radio, Drawer } from 'antd';
import moment from 'moment';
import { timestampFormat } from '@/pages/DataImportLog/constants';
import IconFont from '@/components/IconFont';
// import { ConfirmModel } from './component/ConfirmModel';
import { GetQueryString } from '@/utils/utils';
import styles from './index.less';

const { Column } = Table;
const { Search } = Input;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

function TabBtn({ changeTab }) {
  return (
    <Row className={styles.btns}>
      <Col span={12}>
        <Radio.Group defaultValue="all" onChange={e => changeTab(e.target.value)}>
          <Radio.Button value="all">All Task</Radio.Button>
          <Radio.Button value="my">My task</Radio.Button>
          <Radio.Button value="his">History</Radio.Button>
        </Radio.Group>
      </Col>
    </Row>
  );
}
function TaskBtn({
  selectedKeys,
  selectedCurrentTask,
  searchTask,
  urlTaskCode,
  claimOk,
  setVisible,
  exportAlert,
}) {
  return (
    <Row className={styles.btns}>
      <Col span={12}>
        <Button disabled={!selectedKeys.length} onClick={() => claimOk(selectedKeys)}>
          <IconFont type="iconicon_Claim" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.claim" />
        </Button>
        <Button disabled={!selectedKeys.length} onClick={() => setVisible(true)}>
          <IconFont type="iconicon_assign" className={styles['btn-icon']} />
          Assign
        </Button>
        {/* <Button disabled={!selectedKeys.length} onClick={() => setTaskWithdraw(selectedKeys)}>
          <IconFont type="iconicon_withdraw1 " className={styles['btn-icon']} />
          Withdraw
        </Button> */}
        <Button disabled={!selectedKeys.length} onClick={exportAlert}>
          <IconFont type="iconicon_export" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.export" />
        </Button>
      </Col>
      <Col span={6}>
        <Search
          placeholder="search"
          defaultValue={urlTaskCode}
          onSearch={value => searchTask(selectedCurrentTask, value)}
          style={{ width: 264, height: 36 }}
        />
      </Col>
    </Row>
  );
}

function ProcessList({
  dispatch,
  loading,
  tasks,
  detailItems,
  assignRadioList,
  total,
  getTask,
  setCurrentTaskType,
}) {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedCurrentTask, setSelectedTasks] = useState('all');
  const [currentPage, setcurrentPage] = useState('1');
  const [currentRow, setcurrentRow] = useState('1');
  const [visible, setVisible] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const urlTaskCode = GetQueryString('taskcode');
  console.log('selectedCurrentTask------>', selectedCurrentTask);
  useEffect(() => {
    dispatch({
      type: 'approvalCenter/fetch',
      payload: {
        taskCode: urlTaskCode,
      },
    });
    dispatch({
      type: 'approvalCenter/getUserListByUserId',
      payload: {},
    });
  }, []);

  // default alert
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const [firstTasks] = tasks;
      getTask(firstTasks);
      setcurrentRow(firstTasks);
      setCurrentTaskType(selectedCurrentTask);
    } else {
      getTask(false);
    }
  }, [tasks]);

  async function claimTask(taskCode) {
    await dispatch({
      type: 'approvalCenter/fetchTaskDetail',
      payload: {
        taskCode,
      },
    });
    // console.log('taskIds--->', taskCode);
    if (detailItems.ownerId) {
      Modal.confirm({
        title: 'Confirm',
        content: `This task has been claimed by [${detailItems.ownerId}]
      Do you confirm to re-claim`,
        okText: 'Sure',
        cancelText: 'Cancel',
        onOk: () => {
          claimOk(taskCode);
        },
      });
    } else {
      claimOk(taskCode);
    }
  }

  function claimOk(taskCode) {
    dispatch({
      type: 'approvalCenter/claim',
      payload: {
        taskCode,
      },
      callback: () => {
        dispatch({
          type: 'approvalCenter/fetch',
          payload: {
            type: selectedCurrentTask,
          },
        });
      },
    });
  }

  function setTaskAssign(taskCode) {
    setVisible(false);
    dispatch({
      type: 'approvalCenter/setTaskAssign',
      payload: {
        taskCode,
        userId: radioValue,
      },
      callback: () => {
        setRadioValue('');
        dispatch({
          type: 'approvalCenter/fetch',
          payload: {
            type: selectedCurrentTask,
          },
        });
      },
    });
  }

  function searchTask(taskType, value) {
    dispatch({
      type: 'approvalCenter/fetch',
      payload: {
        taskCode: value,
        type: taskType,
      },
    });
  }

  return (
    <div className={styles.list}>
      <Drawer
        title="Assign to"
        width={500}
        visible={visible}
        onClose={() => setVisible(false)}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Radio.Group
          options={assignRadioList}
          onChange={e => setRadioValue(e.target.value)}
          value={radioValue}
        ></Radio.Group>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={() => setTaskAssign(selectedKeys)} type="primary">
            Save
          </Button>
          <Button onClick={() => setVisible(false)} style={{ marginRight: 12 }}>
            Cancel
          </Button>
        </div>
      </Drawer>
      <TabBtn
        changeTab={selectedTasks => {
          setSelectedTasks(selectedTasks);
          setCurrentTaskType(selectedTasks);
          dispatch({
            type: 'approvalCenter/fetch',
            payload: {
              type: selectedTasks,
            },
          });
        }}
      />
      <TaskBtn
        selectedKeys={selectedKeys}
        selectedCurrentTask={selectedCurrentTask}
        searchTask={searchTask}
        urlTaskCode={urlTaskCode}
        claimOk={claimOk}
        setTaskAssign={setTaskAssign}
        setVisible={setVisible}
      />
      <Table
        border
        dataSource={tasks}
        rowKey="taskCode"
        loading={loading['approvalCenter/fetch']}
        rowClassName={record => (record.taskCode === currentRow.taskCode ? 'active' : '')}
        rowSelection={{
          onChange: selectedRowKeys => {
            setSelectedKeys(selectedRowKeys);
          },
        }}
        pagination={{
          total,
          showSizeChanger: true,
          showTotal(count) {
            return `Page ${currentPage} of ${Math.ceil(count / 10).toString()}`;
          },
          onChange(page, pageSize) {
            setcurrentPage(page);
            dispatch({
              type: 'approvalCenter/fetch',
              payload: {
                page,
                pageSize,
                type: selectedCurrentTask,
              },
            });
          },
          onShowSizeChange(page, pageSize) {
            setcurrentPage(page);
            dispatch({
              type: 'approvalCenter/fetch',
              payload: {
                page,
                pageSize,
                type: selectedCurrentTask,
              },
            });
          },
        }}
        onRow={record => ({
          onClick() {
            getTask(record);
            setcurrentRow(record);
          },
        })}
      >
        <Column align="center" dataIndex="taskCode" title="TASK CODE" />
        <Column align="center" dataIndex="classification" title="CLASSIFICATION" />
        <Column align="center" dataIndex="submitterName" title="SUBMITTER NAME" />
        <Column align="center" dataIndex="details" title="DETAILS" />
        <Column
          align="center"
          dataIndex="updateDate"
          title="UPDATE DATE"
          render={(text, record) => moment(record.updateDate).format(timestampFormat)}
        />
        <Column dataIndex="owner" title="OWNER" />
        <Column align="center" dataIndex="statusDesc" title="statusDesc" />
        <Column
          align="center"
          dataIndex="action"
          title={<FormattedMessage id="alert-center.action" />}
          render={(text, record) => (
            <Row className={styles.btns}>
              <IconFont
                type="iconqizhi"
                className={styles.icon}
                title={formatMessage({ id: 'alert-center.claim' })}
                onClick={() => {
                  claimTask([record.taskCode]);
                }}
              />
            </Row>
          )}
        />
      </Table>
    </div>
  );
}

export default connect(
  ({ loading, approvalCenter: { tasks, detailItems, assignRadioList, page, total } }) => ({
    tasks,
    page,
    total,
    detailItems,
    assignRadioList,
    loading: loading.effects,
  }),
)(ProcessList);
