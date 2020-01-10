import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Table, Row, Col, Button, Input, Radio, Drawer } from 'antd';
import moment from 'moment';
import { timestampFormat } from '@/pages/DataImportLog/constants';
import IconFont from '@/components/IconFont';
import { ConfirmModel } from './component/ConfirmModel';
import { GetQueryString } from '@/utils/utils';
import styles from './index.less';
import alertStyle from '@/pages/AlertCenter/index.less';
import btnStyles from '@/pages/DataImportLog/index.less';

const { Column } = Table;
const { Search } = Input;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

// tab组件
function TabBtn({ changeTab, selectedCurrentTask }) {
  return (
    <Row className={styles.tabBtnBox}>
      <Col span={24}>
        <Radio.Group
          key={selectedCurrentTask}
          defaultValue={selectedCurrentTask}
          buttonStyle="solid"
          onChange={e => changeTab(e.target.value)}
        >
          <Radio.Button value="all">All Tasks</Radio.Button>
          <Radio.Button value="my">My Tasks</Radio.Button>
          <Radio.Button value="his">History</Radio.Button>
        </Radio.Group>
      </Col>
    </Row>
  );
}

// 按钮组件
function TaskBtn({
  selectedKeys,
  selectedCurrentTask,
  searchTask,
  checkOwner,
  checkAssign,
  urlTaskCode,
  exportAlert,
}) {
  return (
    <Row>
      <Col span={24} align="right">
        <Search
          key={urlTaskCode}
          placeholder="search"
          defaultValue={urlTaskCode}
          onSearch={value => searchTask(selectedCurrentTask, value)}
          style={{ width: 264, verticalAlign: 'middle', marginRight: '10px' }}
        />
        {selectedCurrentTask !== 'his' && (
          <>
            <button
              type="button"
              disabled={!selectedKeys.length}
              onClick={() => checkOwner(selectedKeys)}
            >
              <IconFont type="iconqizhi" className={alertStyle['btn-icon']} />
              <FormattedMessage id="alert-center.claim" />
            </button>
            <button
              type="button"
              disabled={!selectedKeys.length}
              onClick={() => checkAssign(selectedKeys)}
            >
              <IconFont type="iconicon_assign-copy" className={alertStyle['btn-icon']} />
              Assign
            </button>
          </>
        )}
        <button type="button" disabled={!selectedKeys.length} onClick={exportAlert}>
          <IconFont type="iconexport" className={alertStyle['btn-icon']} />
          <FormattedMessage id="alert-center.export" />
        </button>
      </Col>
    </Row>
  );
}

function ProcessList({
  dispatch,
  loading,
  tasks,
  currentUsers,
  currentGroup,
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
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [clickCurrentTaskCode, setClickTaskCode] = useState('');
  const [claimContent, setClaimContent] = useState('');
  const [urlCode, setUrlCode] = useState('');
  const [isBatch, setIsBatch] = useState(false);
  const urlTaskCode = GetQueryString('taskCode');
  const urlIsEnd = GetQueryString('isEnd');
  useEffect(() => {
    setUrlCode(urlTaskCode);
    if (urlIsEnd) {
      if (urlIsEnd === '1') {
        setSelectedTasks('his');
        router.push({
          pathname: '/homepage/Approval-Process-Center',
        });
      } else {
        setSelectedTasks('my');
        router.push({
          pathname: '/homepage/Approval-Process-Center',
          query: {
            isEnd: urlIsEnd,
          },
        });
      }
      dispatch({
        type: 'approvalCenter/fetch',
        payload: {
          type: urlIsEnd === '1' ? 'his' : 'my',
          taskCode: urlTaskCode,
        },
      });
    } else {
      dispatch({
        type: 'approvalCenter/fetch',
        payload: {
          type: selectedCurrentTask,
          taskCode: urlTaskCode,
        },
      });
    }
  }, []);

  // default task 初始化
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

  // 认领任务
  async function claimTask(taskCode) {
    await dispatch({
      type: 'approvalCenter/fetchJudgeDetail',
      payload: {
        taskCode,
      },
      callback: items => {
        if (items[0].ownerId) {
          const loginName = localStorage.getItem('loginName');
          const isYou = loginName === items[0].ownerId;
          if (isYou) {
            throw new Error('You have claimed the task');
          }
          setIsBatch(false);
          setClickTaskCode(taskCode);
          setClaimContent(`This task has been claimed by [${items[0].ownerId}]
          Do you confirm to re-claim?`);
          setConfirmVisible(true);
        } else {
          claimOk(taskCode);
        }
      },
    });
  }

  // 判断是否已认领
  async function checkOwner(taskCode) {
    await dispatch({
      type: 'approvalCenter/fetchJudgeDetail',
      payload: {
        taskCode,
      },
      callback: items => {
        const someNoClaim = items.find(item => item.ownerId);
        if (someNoClaim) {
          if (items.length > 1) {
            setClaimContent(`some tasks has been claimed,
      Do you confirm to re-claim?`);
          } else {
            const loginName = localStorage.getItem('loginName');
            const isYou = loginName === items[0].ownerId;
            if (isYou) {
              throw new Error('You have claimed the task');
            }
            setClaimContent(`This task has been claimed,
      Do you confirm to re-claim?`);
          }
          setIsBatch(true);
          setConfirmVisible(true);
        } else {
          claimOk(taskCode);
        }
      },
    });
  }

  // 批量认领
  function claimOk(taskCode) {
    setUrlCode('');
    dispatch({
      type: 'approvalCenter/claim',
      payload: {
        taskCode,
      },
      callback: () => {
        setConfirmVisible(false);
        setcurrentPage(DEFAULT_PAGE);
        dispatch({
          type: 'approvalCenter/fetch',
          payload: {
            type: selectedCurrentTask,
          },
        });
      },
    });
  }

  // 任务分配前检查此任务是否已经认领，否则没有资格分配
  async function checkAssign(taskCode) {
    const loginName = localStorage.getItem('loginName');
    await dispatch({
      type: 'approvalCenter/fetchJudgeDetail',
      payload: {
        taskCode,
      },
      callback: items => {
        const someNoClaim = items.find(item => item.ownerId !== loginName);
        if (someNoClaim) {
          if (items.length > 1) {
            throw new Error('Some tasks has not been claimed, please claim them and try again');
          }
          throw new Error('The task has not been claimed, please claim it and try again');
        } else {
          setVisible(true);
        }
      },
    });
  }

  // 分配任务
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

  // search 搜索
  function searchTask(taskType, value) {
    dispatch({
      type: 'approvalCenter/fetch',
      payload: {
        taskCode: value,
        type: taskType,
      },
    });
    setcurrentPage(DEFAULT_PAGE);
  }

  return (
    <div className={styles.list}>
      <ConfirmModel
        title="CONFIRM"
        content={claimContent}
        closeModel={() => setConfirmVisible(false)}
        confirmVisible={confirmVisible}
        comfirm={() => claimOk(isBatch ? selectedKeys : clickCurrentTaskCode)}
      />
      <Drawer
        title={`Assign to ( ${currentGroup} )`}
        width={500}
        visible={visible}
        onClose={() => setVisible(false)}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Radio.Group
          options={currentUsers}
          onChange={e => setRadioValue(e.target.value)}
          value={radioValue}
        ></Radio.Group>
        <div className={btnStyles['bottom-btns']}>
          <Button onClick={() => setTaskAssign(selectedKeys)} type="primary">
            Confirm
          </Button>
          <Button onClick={() => setVisible(false)} style={{ marginRight: 12 }}>
            Cancel
          </Button>
        </div>
      </Drawer>
      <div>
        <Row className={alertStyle.btns}>
          <Col span={10}>
            <TabBtn
              changeTab={selectedTasks => {
                setUrlCode('');
                setSelectedKeys([]);
                setSelectedTasks(selectedTasks);
                setCurrentTaskType(selectedTasks);
                dispatch({
                  type: 'approvalCenter/fetch',
                  payload: {
                    type: selectedTasks,
                  },
                });
              }}
              selectedCurrentTask={selectedCurrentTask}
            />
          </Col>
          <Col span={14} align="right">
            <TaskBtn
              selectedKeys={selectedKeys}
              selectedCurrentTask={selectedCurrentTask}
              searchTask={searchTask}
              claimOk={claimOk}
              checkOwner={checkOwner}
              setTaskAssign={setTaskAssign}
              checkAssign={checkAssign}
              setVisible={setVisible}
              urlTaskCode={urlCode}
            />
          </Col>
        </Row>
      </div>

      <Table
        border
        dataSource={tasks}
        rowKey="taskCode"
        loading={loading['approvalCenter/fetch']}
        rowClassName={record => (record.taskCode === currentRow.taskCode ? 'active' : '')}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: selectedRowKeys => {
            setSelectedKeys(selectedRowKeys);
          },
        }}
        pagination={{
          total,
          showSizeChanger: true,
          current: currentPage,
          showTotal() {
            return `Total ${total} items`;
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
        <Column align="center" dataIndex="taskCode" title="Task Code" width="9%" />
        <Column
          ellipsis
          align="left"
          dataIndex="classification"
          title="Classification"
          width="20%"
        />
        <Column align="left" dataIndex="submitterName" title="Submitter Name" width="15%" />
        <Column ellipsis align="left" dataIndex="details" title="Details" width="15%" />
        <Column
          align="center"
          dataIndex="updateDate"
          title="Generation Date"
          render={(text, record) =>
            record.updateDate && moment(record.updateDate).format(timestampFormat)
          }
          width="15%"
        />
        <Column dataIndex="owner" title="Owner" align="center" width="9%" />
        <Column align="center" dataIndex="statusDesc" title="Status" width="9%" />
        {selectedCurrentTask !== 'his' ? (
          <Column
            align="center"
            dataIndex="action"
            title="Actions"
            width="8%"
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
        ) : null}
      </Table>
    </div>
  );
}

export default connect(
  ({ loading, approvalCenter: { tasks, currentUsers, currentGroup, page, total } }) => ({
    tasks,
    page,
    total,
    currentUsers,
    currentGroup,
    loading: loading.effects,
  }),
)(ProcessList);
