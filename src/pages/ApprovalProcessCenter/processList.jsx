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

function TabBtn({ changeTab, selectedCurrentTask }) {
  return (
    <Row className={styles.btns} style={{ marginBottom: '15px' }}>
      <Col span={12}>
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
    <Row className={alertStyle.btns}>
      <Col span={12}>
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

        {/* <Button disabled={!selectedKeys.length} onClick={() => setTaskWithdraw(selectedKeys)}>
          <IconFont type="iconicon_withdraw1 " className={styles['btn-icon']} />
          Withdraw
        </Button> */}
        <button type="button" disabled={!selectedKeys.length} onClick={exportAlert}>
          <IconFont type="iconexport" className={alertStyle['btn-icon']} />
          <FormattedMessage id="alert-center.export" />
        </button>
      </Col>
      <Col span={6}>
        <Search
          key={urlTaskCode}
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
  currentUsers,
  total,
  getTask,
  setCurrentTaskType,
}) {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedCurrentTask, setSelectedTasks] = useState('my');
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
      setSelectedTasks('his');
    }
    router.push({
      pathname: '/homepage/Approval-Process-Center',
    });
    dispatch({
      type: 'approvalCenter/fetch',
      payload: {
        type: urlIsEnd ? 'his' : selectedCurrentTask,
        taskCode: urlTaskCode,
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
      type: 'approvalCenter/fetchJudgeDetail',
      payload: {
        taskCode,
      },
      callback: items => {
        if (items[0].ownerId) {
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

  async function checkOwner(taskCode) {
    await dispatch({
      type: 'approvalCenter/fetchJudgeDetail',
      payload: {
        taskCode,
      },
      callback: items => {
        const someNoClaim = items.find(item => item.ownerId);
        if (someNoClaim) {
          setIsBatch(true);
          setClaimContent(`some alerts has been claimed,
      Do you confirm to re-claim?`);
          setConfirmVisible(true);
        } else {
          claimOk(taskCode);
        }
      },
    });
  }

  function claimOk(taskCode) {
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
            throw new Error('Some tasks have not been claimed, please claim them and try again');
          }
          throw new Error('The task have not been claimed, please claim it and try again');
        } else {
          setVisible(true);
        }
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
        title="Assign to"
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
            Save
          </Button>
          <Button onClick={() => setVisible(false)} style={{ marginRight: 12 }}>
            Cancel
          </Button>
        </div>
      </Drawer>
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
        <Column align="center" dataIndex="statusDesc" title="STATUS" />
        {selectedCurrentTask !== 'his' ? (
          <Column
            align="center"
            dataIndex="action"
            title={<FormattedMessage id="alert-center.actions" />}
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

export default connect(({ loading, approvalCenter: { tasks, currentUsers, page, total } }) => ({
  tasks,
  page,
  total,
  currentUsers,
  loading: loading.effects,
}))(ProcessList);
