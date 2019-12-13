import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Table, Row, Col, Button, Modal, Input, Radio } from 'antd';
import IconFont from '@/components/IconFont';
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
        </Radio.Group>
      </Col>
    </Row>
  );
}
function TaskBtn({
  selectedKeys,
  selectedCurrentTask,
  searchTask,
  claimOk,
  closeAlert,
  exportAlert,
}) {
  return (
    <Row className={styles.btns}>
      <Col span={12}>
        <Button
          type="primary"
          disabled={!selectedKeys.length}
          onClick={() =>
            Modal.confirm({
              title: 'Confirm',
              content: 'Are you sure claim these tasks?',
              okText: 'Sure',
              cancelText: 'Cancel',
              onOk: () => claimOk(selectedKeys),
            })
          }
        >
          <IconFont type="iconqizhi" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.claim" />
        </Button>
        <Button disabled={!selectedKeys.length} onClick={closeAlert}>
          <IconFont type="iconicon-assign" className={styles['btn-icon']} />
          Assign
        </Button>
        <Button disabled={!selectedKeys.length} onClick={closeAlert}>
          <IconFont type="iconicon-withdraw" className={styles['btn-icon']} />
          Withdraw
        </Button>
        <Button disabled={!selectedKeys.length} onClick={exportAlert}>
          <IconFont type="iconbatch-export" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.export" />
        </Button>
      </Col>
      <Col span={6}>
        <Search
          placeholder="search"
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
  total,
  getTask,
  setCurrentTaskType,
}) {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedCurrentTask, setSelectedTasks] = useState('all');
  const [currentPage, setcurrentPage] = useState('1');
  const [currentRow, setcurrentRow] = useState('1');

  useEffect(() => {
    const taskCode = GetQueryString('taskcode');
    dispatch({
      type: 'approvalCenter/fetch',
      payload: {
        taskCode,
      },
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
            taskCode,
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
      <TabBtn
        changeTab={selectedTasks => {
          setSelectedTasks(selectedTasks);
          setCurrentTaskType(selectedCurrentTask);
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
        claimOk={claimOk}
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
        <Column align="center" dataIndex="updateDate" title="UPDATE DATE" />
        <Column dataIndex="owner" title="OWNER" />
        <Column align="center" dataIndex="status" title="STATUS" />
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

export default connect(({ loading, approvalCenter: { tasks, detailItems, page, total } }) => ({
  tasks,
  page,
  total,
  detailItems,
  loading: loading.effects,
}))(ProcessList);
