/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Input, Button, Drawer, Radio, message, Upload, Empty, Spin } from 'antd';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import { ConfirmModel } from './component/ConfirmModel';
import styles from './index.less';
import Phase from './component/phase';
import TaskAttachments from './component/TaskAttachments';
import TaskCommentHistory from './component/TaskCommentHistory';
import TaskLog from './component/TaskLog';
import DetailList from './component/DetailList';

const { TabPane } = Tabs;
const { TextArea } = Input;
// const { Column } = Table;
// const { Paragraph, Text } = Typography;

// export function TaskDes({ detailItem }) {
//   return <div></div>;
// }
function CustomEmpty({ className = '', style = {} }) {
  return (
    <Row className={className} style={style} type="flex" align="middle" justify="center">
      <Empty />
    </Row>
  );
}

function ProcessDetail({
  dispatch,
  loading,
  task,
  detailItems,
  taskGroup,
  submitRadioList,
  taskHistoryList,
  logList,
  currentTaskType,
}) {
  const [isFullscreen, setFullscreen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [submitType, setSubmitType] = useState('');
  const [comment, setComment] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [withdrawConfirmVisible, setWithdrawConfirmVisible] = useState(false);
  const [upAttachments, setUpAttachements] = useState([]);
  const newDetailForm = React.createRef();
  const isLt5M = size => size / 1024 / 1024 < 5;
  console.log('currentTaskType--000-->', currentTaskType);

  useEffect(() => {
    if (task) {
      dispatch({
        type: 'approvalCenter/fetchTaskDetail',
        payload: {
          taskCode: task.taskCode,
        },
      });
    }
  }, [task]);

  useEffect(() => {
    if (task) {
      dispatch({
        type: 'approvalCenter/featchTaskGroup',
        payload: {
          taskCode: task.taskCode,
        },
      });
    }
  }, [task]);
  useEffect(() => {
    if (task) {
      dispatch({
        type: 'approvalCenter/getApprovalTaskHistory',
        payload: {
          taskCode: task.taskCode,
        },
      });
    }
  }, [task]);

  function submitDrawer(type) {
    setSubmitType(type);
    if (type === 'reject') {
      setConfirmVisible(true);
      return;
    }
    if (taskGroup && !taskGroup.nextRelateNo) {
      submitOrApproveTask(type);
      return;
    }
    if (taskGroup) {
      setVisible(true);
      getUserList();
      return;
    }
    message.error('submit failure');
  }

  function submitOrApproveTask(type) {
    let valueData = {};
    const taskValue = {
      taskCode: task.taskCode.toString(),
      type,
      userId: radioValue.toString(),
      comment,
      attachment: upAttachments.map(file => file.url).join(','),
    };
    if (type === 'submit') {
      newDetailForm.current.validateFields((err, values) => {
        const alertTypeValue = detailItems[0].alertType;
        if (!err) {
          if (alertTypeValue === '301') {
            valueData = {
              epCname: values.epName,
            };
          } else if (alertTypeValue === '302') {
            valueData = {
              isCaCode: values.isCaCode,
              productDesc: values.productDesc,
              productCategory: values.productCategory,
              contractNature: values.contractNature,
              productGroup: values.productGroup,
              ltdTmplCode: values.ltdTmplCode,
              plTmplCode: values.plTmplCode,
              rlTmplCode: values.rlTmplCode,
              pdCalculateFlag: values.isCalculatePd,
              sizeFactor: values.sizeFactor.toString(),
              weightFactor: values.weightFactor.toString(),
            };
          } else if (alertTypeValue === '303') {
            valueData = {
              isCaCode: values.isCaCode,
              remark: values.remark,
            };
          }

          Object.assign(taskValue, valueData);
          console.log('Received values of form: ', values, valueData, taskValue);
          // eslint-disable-next-line array-callback-return
          // detailData.map(item => {
          //   if (item.isEdit) {
          //     epCname.push(values[item.key]);
          //   }
          // });
          // epCname = epCname.join(',');
        }
      });
    }
    if (type === 'reject') {
      setConfirmVisible(false);
    }
    dispatch({
      type: 'approvalCenter/approveAndReject',
      payload: taskValue,
      callback: () => {
        dispatch({
          type: 'approvalCenter/fetch',
          payload: {
            type: currentTaskType,
          },
        });
        setUpAttachements([]);
      },
    });
    setVisible(false);
  }

  // 撤销
  function setTaskWithdraw() {
    console.log('comment----', comment);
    dispatch({
      type: 'approvalCenter/setTaskWithdraw',
      payload: {
        taskCode: task.taskCode,
        comment,
      },
      callback: () => {
        dispatch({
          type: 'approvalCenter/fetch',
          payload: {
            type: currentTaskType,
            taskCode: task.taskCode,
          },
        });
      },
    });
    setWithdrawConfirmVisible(false);
  }

  function getUserList() {
    dispatch({
      type: 'approvalCenter/fetchUserList',
      payload: {
        operType: 'queryByAlertGroupId',
        groupId: taskGroup.nextRelateNo,
      },
    });
  }

  function saveTask() {
    let valueData = {};
    const taskValue = {
      taskCode: task.taskCode.toString(),
    };
    newDetailForm.current.validateFields((err, values) => {
      const alertTypeValue = detailItems[0].alertType;
      if (!err) {
        if (alertTypeValue === '301') {
          valueData = {
            epCname: values.epName,
          };
        } else if (alertTypeValue === '302') {
          valueData = {
            isCaCode: values.isCaCode,
            productDesc: values.productDesc,
            productCategory: values.productCategory,
            contractNature: values.contractNature,
            productGroup: values.productGroup,
            ltdTmplCode: values.ltdTmplCode,
            plTmplCode: values.plTmplCode,
            rlTmplCode: values.rlTmplCode,
            pdCalculateFlag: values.isCalculatePd,
            sizeFactor: values.sizeFactor.toString(),
            weightFactor: values.weightFactor.toString(),
          };
        } else if (alertTypeValue === '303') {
          valueData = {
            isCaCode: values.isCaCode,
            remark: values.remark,
          };
        }

        Object.assign(taskValue, valueData);
        console.log('Received values of form: ', values, valueData, taskValue);
      }
    });
    dispatch({
      type: 'approvalCenter/saveTask',
      payload: taskValue,
    });
  }

  function handleUpAttachments(info) {
    let fileList = [...info.fileList];
    // limit 5 files
    fileList = fileList.slice(-5);
    fileList = fileList.map(file => {
      const { bcjson } = file.response || {};
      const { flag, items = {} } = bcjson || {};

      if (flag === '1' && items) {
        return { url: items.relativeUrl, ...file };
      }
      return file;
    });
    console.log('fileList--->', fileList);
    setUpAttachements(fileList);
  }

  return (
    <>
      <ConfirmModel
        title="CONFIRM"
        content="Do you comfirm to reject this task?"
        closeModel={() => setConfirmVisible(false)}
        confirmVisible={confirmVisible}
        comfirm={() => submitOrApproveTask(submitType)}
      />
      <ConfirmModel
        title="CONFIRM"
        content="Do you comfirm to withdraw this task?"
        closeModel={() => setWithdrawConfirmVisible(false)}
        confirmVisible={withdrawConfirmVisible}
        comfirm={setTaskWithdraw}
      />
      <Row className={styles['detail-container']} gutter={16}>
        <Col span={16} className={isFullscreen ? styles.fullscreen : ''}>
          <Tabs
            hideAdd
            className={styles['detail-des']}
            defaultActiveKey="1"
            tabBarExtraContent={
              <IconFont
                type={isFullscreen ? 'iconfullscreen-exit' : 'iconfull-screen'}
                className={styles['fullscreen-icon']}
                onClick={() => setFullscreen(!isFullscreen)}
              />
            }
          >
            <TabPane className={styles['tab-content']} closable={false} tab="Task Detail" key="">
              <DetailList
                ref={newDetailForm}
                saveTask={saveTask}
                detailItem={detailItems}
                task={task}
              />
              <Drawer
                title="Assign to"
                width={500}
                visible={visible}
                onClose={() => setVisible(false)}
                bodyStyle={{ paddingBottom: 80 }}
              >
                <Radio.Group
                  options={submitRadioList}
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
                  <Button onClick={() => submitOrApproveTask(submitType)} type="primary">
                    Save
                  </Button>
                  <Button onClick={() => setVisible(false)} style={{ marginRight: 12 }}>
                    Cancel
                  </Button>
                </div>
              </Drawer>
            </TabPane>
          </Tabs>
        </Col>
        <Col span={8}>
          <Tabs defaultActiveKey="1" className={styles['detail-comment']}>
            <TabPane tab="Approval History" key="1">
              <Spin spinning={loading['approvalCenter/getApprovalTaskHistory']}>
                {taskHistoryList.length > 0 ? (
                  <ul className={styles['comment-list']}>
                    {taskHistoryList.map(item => (
                      <TaskCommentHistory comment={item} key={item.id} />
                    ))}
                  </ul>
                ) : (
                  <CustomEmpty className={styles['comment-list']} />
                )}
              </Spin>
              {currentTaskType !== 'his' ? (
                <div className={styles['comment-box']}>
                  <TextArea
                    placeholder="COMMENT"
                    className={styles.txt}
                    value={comment}
                    onChange={({ target: { value } }) => setComment(value)}
                  />
                  <Row
                    className={styles['comment-commit']}
                    type="flex"
                    align="middle"
                    justify="space-between"
                  >
                    <Col span={4}>
                      <Phase postComment={c => setComment(`${comment}${c} `)} />
                    </Col>
                    <Col span={7} style={{ textAlign: 'right' }}>
                      <IconFont
                        type="iconicon_withdraw1"
                        onClick={() => setWithdrawConfirmVisible(true)}
                        className={styles['btn-icon']}
                        style={{ marginRight: '8px' }}
                      />
                      <Upload
                        action="/upload"
                        showUploadList={false}
                        beforeUpload={file => isLt5M(file.size)}
                        fileList={upAttachments}
                        onChange={handleUpAttachments}
                      >
                        <IconFont
                          type="iconbiezhen"
                          style={{ cursor: 'pointer', marginRight: 4 }}
                          title="please select a file"
                        />
                        {upAttachments.length > 0 && upAttachments.length}
                      </Upload>
                    </Col>

                    {detailItems[0] && detailItems[0].isStarter ? (
                      <>
                        <Col span={6}>
                          <Button style={{ width: '80px' }} type="primary" onClick={saveTask}>
                            Save
                          </Button>
                        </Col>
                        <Col span={6} align="right">
                          <Button
                            style={{ width: '80px' }}
                            type="primary"
                            onClick={() => submitDrawer('submit')}
                          >
                            Submit
                          </Button>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col span={4}>
                          <Button type="primary" onClick={() => submitDrawer('reject')}>
                            Reject
                          </Button>
                        </Col>
                        <Col span={6} align="right">
                          <Button type="primary" onClick={() => submitDrawer('pass')}>
                            Approve
                          </Button>
                        </Col>
                      </>
                    )}
                  </Row>
                  {!!upAttachments.length && <TaskAttachments attachments={upAttachments} />}
                </div>
              ) : null}
            </TabPane>
            <TabPane tab="Task Lifecycle" key="2">
              <Spin spinning={loading['approvalCenter/getApprovalTaskHistory']}>
                <div style={{ height: 370, overflowY: 'auto', padding: '0 18px' }}>
                  {logList.length > 0 ? (
                    logList.map(log => <TaskLog log={log} key={log.id} />)
                  ) : (
                    <CustomEmpty className={styles['comment-list']} style={{ height: 370 }} />
                  )}
                </div>
              </Spin>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
}

export default connect(
  ({
    loading,
    approvalCenter: { detailItems, userList, submitRadioList, taskHistoryList, logList, taskGroup },
  }) => ({
    detailItems,
    userList,
    submitRadioList,
    taskHistoryList,
    logList,
    taskGroup,
    loading: loading.effects,
  }),
)(ProcessDetail);
