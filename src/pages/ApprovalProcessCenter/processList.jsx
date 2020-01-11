import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Table, Row, Col, Button, Input, Radio, Drawer, message } from 'antd';
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

export const DEFAULT_PAGE = 1; // 默认页
export const DEFAULT_PAGE_SIZE = 10; // 一页默认显示条数

// tab切换组件
function TabBtn({ changeTab, selectedCurrentTask }) {
  return (
    <Row className={styles.tabBtnBox}>
      <Col span={24}>
        <div className={styles['page-name']}>
          <IconFont type="icon-approval-process-title" className={styles.icon} />
          <span>Approval process</span>
        </div>
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
  urlTaskCode,
  dataFileExport,
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
  loading,
  tasks,
  currentUsers,
  currentGroup,
  total,
  getTask,
  setCurrentTaskType,
}) {
  const [selectedKeys, setSelectedKeys] = useState([]); // 列表复选框选中的值
  const [selectedCurrentTask, setSelectedTasks] = useState('all'); // 选中的tab选项
  const [currentPage, setcurrentPage] = useState('1'); // 当前处在第几页
  const [currentRow, setcurrentRow] = useState('1'); // 列表选择的行
  const [visible, setVisible] = useState(false); // 弹窗显示隐藏控制
  const [radioValue, setRadioValue] = useState(''); // 分配任务选择的人员
  const [confirmVisible, setConfirmVisible] = useState(false); // 确认框弹窗显示
  const [clickCurrentTaskCode, setClickTaskCode] = useState(''); // 选中的任务taskCode
  const [claimContent, setClaimContent] = useState(''); // 设置弹窗的内容
  const [urlCode, setUrlCode] = useState(''); // 设置从alert center 带过来的参数
  const [isBatch, setIsBatch] = useState(false); // 是否是批量操作
  const urlTaskCode = GetQueryString('taskCode'); // 获取alert center 带过来的参数,定位到当前条
  const urlIsEnd = GetQueryString('isEnd'); // 获取 alert center 带过来的参数,流程是否结束，结束则跳转到历史
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
              dataFileExport={dataFileExport}
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
