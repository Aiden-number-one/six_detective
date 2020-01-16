import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
// import Redirect from 'umi/redirect';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import { Table, Row, Col, Button, Input, Radio, Drawer, message, Alert } from 'antd';
import moment from 'moment';
import { timestampFormat } from '@/pages/DataImportLog/constants';
import ColumnTitle, { actionType, useColumnFilter } from '@/pages/AlertCenter/ColumnTitle';
import IconFont from '@/components/IconFont';
import { ConfirmModel } from './component/ConfirmModel';
// import { GetQueryString } from '@/utils/utils';
import styles from './index.less';
import alertStyle from '@/pages/AlertCenter/index.less';
import btnStyles from '@/pages/DataImportLog/index.less';

const { Column } = Table;
const { Search } = Input;

export const DEFAULT_PAGE = 1; // 默认页
export const DEFAULT_PAGE_SIZE = 10; // 一页默认显示条数

// tab切换组件
function TabBtn({ selectedCurrentTask }) {
  return (
    <Row className={styles.tabBtnBox}>
      <Col span={24}>
        <div className={styles['page-name']}>
          <IconFont type="icon-approval-process-title" className={styles.icon} />
          <span>Approval process</span>
        </div>
        <Radio.Group key={selectedCurrentTask} value={selectedCurrentTask} buttonStyle="solid">
          <Radio.Button value="SLOP_BIZ.V_ALL_TASK">
            <Link to="/homepage/Approval-Process-Center">All Tasks</Link>
          </Radio.Button>
          <Radio.Button value="SLOP_BIZ.V_MY_TASK">
            <Link to="/homepage/Approval-Process-Center/my">My Tasks</Link>
          </Radio.Button>
          <Radio.Button value="SLOP_BIZ.V_TASK_HISTORY">
            <Link to="/homepage/Approval-Process-Center/history">History</Link>
          </Radio.Button>
        </Radio.Group>
      </Col>
    </Row>
  );
}

/*
 * @selectedKeys:列表复选框选中的值
 * @selectedCurrentTask:当前任务tab类型，all、my、his
 * @searchTask:搜索方法
 * @checkOwner:查询owner，判断是否已认领的方法
 * @checkAssign:任务分配前检查此任务是否已经认领方法
 * @urlTaskCode:从alert center带过来的taskCode参数
 * @exportAlert:导出方法
 */
// 按钮组件
function TaskBtn({
  selectedKeys,
  selectedCurrentTask,
  searchTask,
  checkOwner,
  checkAssign,
  dataFileExport,
}) {
  return (
    <Row>
      <Col span={24} align="right">
        <Search
          key="search"
          placeholder="search"
          defaultValue=""
          onSearch={value => searchTask(selectedCurrentTask, value)}
          style={{ width: 264, verticalAlign: 'middle', marginRight: '10px', textAlign: 'left' }}
        />
        {selectedCurrentTask !== 'SLOP_BIZ.V_TASK_HISTORY' && (
          <>
            <button
              type="button"
              disabled={!selectedKeys.length}
              onClick={() => checkOwner(selectedKeys)}
            >
              <IconFont type="icon-claim-small" className={alertStyle['btn-icon']} />
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
        <button
          type="button"
          disabled={!selectedKeys.length}
          onClick={() => dataFileExport(selectedKeys)}
        >
          <IconFont type="iconexport" className={alertStyle['btn-icon']} />
          <FormattedMessage id="alert-center.export" />
        </button>
      </Col>
    </Row>
  );
}

/*
 * @loading:加载loading
 * @tasks:在列表点击选中的任务
 * @currentUsers:当前节点的审批人员
 * @currentGroup:当前节点的审批角色
 * @total:总条数
 * @getTask:保存选择的列表行内容
 * @setCurrentTaskType:设置当前tab类型
 */
function ProcessList({
  dispatch,
  location,
  match,
  loading,
  tasks,
  currentUsers,
  currentGroup,
  total,
  getTask,
  setCurrentTaskType,
  setPageSizeData,
}) {
  const [selectedKeys, setSelectedKeys] = useState([]); // 列表复选框选中的值
  const [selectedCurrentTask, setSelectedTasks] = useState('SLOP_BIZ.V_ALL_TASK'); // 选中的tab选项
  const [currentPage, setcurrentPage] = useState('1'); // 当前处在第几页
  const [currentPageSize, setcurrentPageSize] = useState('10'); // 当前处在第几页
  const [currentRow, setcurrentRow] = useState('1'); // 列表选择的行
  const [visible, setVisible] = useState(false); // 弹窗显示隐藏控制
  const [radioValue, setRadioValue] = useState(''); // 分配任务选择的人员
  const [confirmVisible, setConfirmVisible] = useState(false); // 确认框弹窗显示
  const [clickCurrentTaskCode, setClickTaskCode] = useState(''); // 选中的任务taskCode
  const [claimContent, setClaimContent] = useState(''); // 设置弹窗的内容
  // const [urlCode, setUrlCode] = useState(''); // 设置从alert center 带过来的参数
  const [isBatch, setIsBatch] = useState(false); // 是否是批量操作
  // const urlTaskCode = GetQueryString('taskCode'); // 获取alert center 带过来的参数,定位到当前条
  // const urlIsEnd = GetQueryString('isEnd'); // 获取 alert center 带过来的参数,流程是否结束，结束则跳转到历史

  const { clearFilter, fetchTableList, handlePageChange, getTitleProps } = useColumnFilter({
    dispatch,
    tableName: selectedCurrentTask,
    page: currentPage,
    pageSize: currentPageSize,
    reset: Object.keys(location.query).length > 0 ? handleCloseMsg : null,
  });
  useEffect(() => {
    const { taskCode, owner, tradeDate } = location.query;
    const { type } = match.params;
    // if (type !== 'my' || type !== 'history') {
    //   router.replace('/homepage/Approval-Process-Center/all');
    // }
    clearFilter();
    const currentTab =
      // eslint-disable-next-line no-nested-ternary
      type === 'my'
        ? 'SLOP_BIZ.V_MY_TASK'
        : type === 'history'
        ? 'SLOP_BIZ.V_TASK_HISTORY'
        : 'SLOP_BIZ.V_ALL_TASK';
    let params = [];
    if (taskCode) {
      params = [{ column: 'taskCode', value: taskCode, condition: '7' }];
    }
    if (owner) {
      params = [...params, { column: 'owner', value: owner, condition: '7' }];
    }
    if (tradeDate) {
      const [start, end] = tradeDate.split(',');
      // const startResult = `${start}000000`;
      // const endResult = `${end}235959`;
      params = [
        ...params,
        { column: 'updateDate', value: start, condition: '4' },
        { column: 'updateDate', value: end, condition: '6' },
      ];
    }
    fetchTableList(
      {
        page: currentPage,
        pageSize: currentPageSize,
        conditions: params,
      },
      currentTab,
    );
    setSelectedTasks(currentTab);
  }, [location]);

  // default task 初始化
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const [firstTasks] = tasks;
      getTask(firstTasks);
      setcurrentRow(firstTasks);
      setCurrentTaskType(selectedCurrentTask);
      setPageSizeData({
        page: currentPage,
        pageSize: currentPageSize,
      });
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
    dispatch({
      type: 'approvalCenter/claim',
      payload: {
        taskCode,
      },
      callback: () => {
        setConfirmVisible(false);
        setcurrentPage(DEFAULT_PAGE);
        const { curColumn, sort, conditions } = getTitleProps();
        fetchTableList(
          {
            page: '1',
            pageSize: currentPageSize,
            currentColumn: curColumn,
            sort,
            conditions,
          },
          selectedCurrentTask,
        );
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
          setRadioValue('');
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
        const { curColumn, sort, conditions } = getTitleProps();
        fetchTableList(
          {
            page: '1',
            pageSize: currentPageSize,
            currentColumn: curColumn,
            sort,
            conditions,
          },
          selectedCurrentTask,
        );
        // dispatch({
        //   type: 'approvalCenter/fetch',
        //   payload: {
        //     type: selectedCurrentTask,
        //   },
        // });
      },
    });
  }

  // 导出文件
  function dataFileExport(taskCode) {
    message.loading({ content: 'Exporting file...', key: 'Exporting', duration: 0 });
    dispatch({
      type: 'approvalCenter/approvalTaskExport',
      payload: {
        taskCode,
      },
      callback: filePath => downloadHerf(filePath),
      callback2: () => exportingFileSuccess(),
    });
  }
  function exportingFileSuccess() {
    setTimeout(() => {
      message.success({ content: 'Export success!', key: 'Exporting', duration: 2 });
    }, 1000);
  }
  // 下载zip
  function downloadHerf(filePath) {
    const a = document.createElement('a');
    a.href = `/download?filePath=${filePath}`;
    a.download = true;
    a.click();
  }

  // search 搜索
  function searchTask(taskType, value) {
    let params = {};
    if (value) {
      params = {
        conditions: [
          {
            value,
            condition: '7',
            column: 'taskCode',
          },
        ],
      };
    }
    fetchTableList(params, selectedCurrentTask);
    setcurrentPage(DEFAULT_PAGE);
  }

  function handleCloseMsg() {
    router.replace('/homepage/Approval-Process-Center');
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
          <Button onClick={() => setVisible(false)} style={{ marginRight: 12 }}>
            Cancel
          </Button>
          <Button disabled={!radioValue} onClick={() => setTaskAssign(selectedKeys)} type="primary">
            Confirm
          </Button>
        </div>
      </Drawer>
      <div>
        <Row className={alertStyle.btns}>
          <Col span={10}>
            <TabBtn selectedCurrentTask={selectedCurrentTask} />
          </Col>
          <Col span={14} align="right" className={styles.taskBtnBox}>
            <TaskBtn
              selectedKeys={selectedKeys}
              selectedCurrentTask={selectedCurrentTask}
              searchTask={searchTask}
              claimOk={claimOk}
              checkOwner={checkOwner}
              setTaskAssign={setTaskAssign}
              dataFileExport={dataFileExport}
              checkAssign={checkAssign}
              setVisible={setVisible}
            />
          </Col>
        </Row>
      </div>
      {Object.keys(location.query).length > 0 && (
        <Alert
          banner
          showIcon
          closable
          type="info"
          message={`Query Condition：${Object.keys(location.query)}`}
          style={{ marginBottom: 10 }}
          onClose={handleCloseMsg}
        />
      )}
      <Table
        border
        className={styles.tableBox}
        dataSource={tasks}
        rowKey="taskCode"
        loading={loading[actionType]}
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
          current: +currentPage,
          showTotal() {
            return `Total ${total} items`;
          },
          onChange(page, pageSize) {
            setcurrentPage(page);
            setcurrentPageSize(pageSize);
            handlePageChange(page, pageSize);
          },
          onShowSizeChange(page, pageSize) {
            setcurrentPage(page);
            setcurrentPageSize(pageSize);
            handlePageChange(page, pageSize);
          },
        }}
        onRow={record => ({
          onClick() {
            getTask(record);
            setcurrentRow(record);
          },
        })}
      >
        <Column
          align="center"
          dataIndex="taskCode"
          title={<ColumnTitle {...getTitleProps('taskCode')}>Task Code</ColumnTitle>}
          width="11%"
        />
        <Column
          ellipsis
          align="left"
          dataIndex="classification"
          title={<ColumnTitle {...getTitleProps('classification')}>Classification</ColumnTitle>}
          width="17%"
        />
        <Column
          ellipsis
          align="left"
          dataIndex="submitterName"
          width="15%"
          title={<ColumnTitle {...getTitleProps('submitterName')}>Submitter Name</ColumnTitle>}
        />
        <Column
          ellipsis
          align="left"
          dataIndex="details"
          title={<ColumnTitle {...getTitleProps('details')}>Details</ColumnTitle>}
          width="14%"
        />
        <Column
          align="center"
          dataIndex="updateDate"
          title={<ColumnTitle {...getTitleProps('updateDate')}>Generation Date</ColumnTitle>}
          render={(text, record) =>
            record.updateDate && moment(record.updateDate, 'YYYYMMDDHHmmss').format(timestampFormat)
          }
          width="15%"
        />
        <Column
          dataIndex="owner"
          align="center"
          width="10%"
          title={<ColumnTitle {...getTitleProps('owner')}>Owner</ColumnTitle>}
        />
        <Column
          align="center"
          dataIndex="statusDesc"
          width="10%"
          title={<ColumnTitle {...getTitleProps('statusDesc')}>Status</ColumnTitle>}
        />
        {match.params.type !== 'history' ? (
          <Column
            align="center"
            dataIndex="action"
            title="Actions"
            width="8%"
            render={(text, record) => (
              <Row className={styles.btns}>
                <IconFont
                  type="icon-claimx"
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

export default withRouter(
  connect(
    ({
      loading,
      global: { filterTables, filterTableTotal },
      approvalCenter: { currentUsers, currentGroup },
    }) => ({
      tasks: filterTables,
      total: filterTableTotal,
      currentUsers,
      currentGroup,
      loading: loading.effects,
    }),
  )(ProcessList),
);
