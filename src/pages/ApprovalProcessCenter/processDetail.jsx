/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Input, Button, Drawer, Radio, Upload, Empty, Spin } from 'antd';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import { ConfirmModel } from './component/ConfirmModel';
import styles from './index.less';
import Phase from '@/pages/AlertCenter/Alert/components/AlertPhrase';
import TaskAttachments from './component/TaskAttachments';
import TaskCommentHistory from './component/TaskCommentHistory';
import TaskLog from './component/TaskLog';
import DetailList from './component/DetailList';

import btnStyles from '@/pages/DataImportLog/index.less';

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
  nextUsers,
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
  const [currentOwner, setIsCurrentOwner] = useState(true);
  const [confirmToCategoryValue, setConfirmToCategory] = useState('');
  const [confirmBiCategoryValue, setConfirmBiCategory] = useState('');
  const newDetailForm = React.createRef();
  const isLt5M = size => size / 1024 / 1024 < 5;
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
    const loginName = localStorage.getItem('loginName');
    const ownerId = detailItems && detailItems[0] && detailItems[0].ownerId;
    if (ownerId === loginName) {
      setIsCurrentOwner(true);
    } else {
      setIsCurrentOwner(false);
    }
  }, [detailItems]);

  useEffect(() => {
    if (task && currentTaskType !== 'his') {
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
    if (type === 'submit') {
      let isErr = true;
      newDetailForm.current.validateFields(err => {
        isErr = !err;
      });
      if (!isErr) return;
    }
    if (nextUsers.length < 1) {
      submitOrApproveTask(type);
    } else {
      setVisible(true);
    }
  }

  function submitOrApproveTask(type) {
    let valueData = {};
    let isErr = true;
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
        const defaultConfirmToCategory =
          detailItems[0] && detailItems[0].newValue && detailItems[0].newValue.confirmToCategory;
        const defaultConfirmBiCategory =
          detailItems[0] && detailItems[0].newValue && detailItems[0].newValue.confirmBiCategory;
        isErr = !err;
        if (!err) {
          if (alertTypeValue === '301') {
            valueData = {
              epName: values.epName,
            };
          } else if (alertTypeValue === '302') {
            if (values.isCaCode === 'No') {
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
                sizeFactor: values.isCalculatePd === 'Yes' ? values.sizeFactor.toString() : '',
                weightFactor: values.isCalculatePd === 'Yes' ? values.weightFactor.toString() : '',
              };
            } else {
              valueData = {
                isCaCode: values.isCaCode,
                remark: values.remark,
              };
            }
          } else if (alertTypeValue === '303') {
            if (values.isCaCode === 'Yes') {
              valueData = {
                isCaCode: values.isCaCode,
                remark: values.remark,
              };
            } else {
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
                sizeFactor: values.isCalculatePd === 'Yes' ? values.sizeFactor.toString() : '',
                weightFactor: values.isCalculatePd === 'Yes' ? values.weightFactor.toString() : '',
              };
            }
          } else if (
            alertTypeValue === '321' ||
            alertTypeValue === '322' ||
            alertTypeValue === '323' ||
            alertTypeValue === '324'
          ) {
            valueData = {
              confirmToCategory: confirmToCategoryValue || defaultConfirmToCategory,
              confirmBiCategory: confirmBiCategoryValue || defaultConfirmBiCategory,
              confirmToCode: values.confirmToCode,
              confirmToName: values.confirmToName,
              confirmBiCode: values.confirmBiCode,
              confirmBiName: values.confirmBiName,
              reportAnyPosition: values.reportAnyPosition,
              watch: values.watch,
              remark: values.remark,
            };
          }

          Object.assign(taskValue, valueData);
          console.log('Received values of form: ', values, valueData, taskValue);
        }
      });
    }
    if (type === 'reject') {
      setConfirmVisible(false);
    }
    if (isErr) {
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
          setComment('');
        },
      });
    }
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
        setComment('');
      },
    });
    setWithdrawConfirmVisible(false);
  }

  function saveConfirmToCategory(value) {
    setConfirmToCategory(value);
  }

  function saveConfirmBiCategory(value) {
    setConfirmBiCategory(value);
  }

  function saveTask() {
    let valueData = {};
    let isErr = true;
    const taskValue = {
      taskCode: task.taskCode.toString(),
    };
    newDetailForm.current.validateFields((err, values) => {
      const alertTypeValue = detailItems[0].alertType;
      const defaultConfirmToCategory =
        detailItems[0] && detailItems[0].newValue && detailItems[0].newValue.confirmToCategory;
      const defaultConfirmBiCategory =
        detailItems[0] && detailItems[0].newValue && detailItems[0].newValue.confirmBiCategory;
      isErr = !err;
      if (!err) {
        if (alertTypeValue === '301') {
          valueData = {
            epName: values.epName,
          };
        } else if (alertTypeValue === '302') {
          if (values.isCaCode === 'No') {
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
              sizeFactor: values.isCalculatePd === 'Yes' ? values.sizeFactor.toString() : '',
              weightFactor: values.isCalculatePd === 'Yes' ? values.weightFactor.toString() : '',
            };
          } else {
            valueData = {
              isCaCode: values.isCaCode,
              remark: values.remark,
            };
          }
        } else if (alertTypeValue === '303') {
          if (values.isCaCode === 'Yes') {
            valueData = {
              isCaCode: values.isCaCode,
              remark: values.remark,
            };
          } else {
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
              sizeFactor: values.isCalculatePd === 'Yes' ? values.sizeFactor.toString() : '',
              weightFactor: values.isCalculatePd === 'Yes' ? values.weightFactor.toString() : '',
            };
          }
        } else if (
          alertTypeValue === '321' ||
          alertTypeValue === '322' ||
          alertTypeValue === '323' ||
          alertTypeValue === '324'
        ) {
          valueData = {
            confirmToCategory: confirmToCategoryValue || defaultConfirmToCategory,
            confirmBiCategory: confirmBiCategoryValue || defaultConfirmBiCategory,
            confirmToCode: values.confirmToCode,
            confirmToName: values.confirmToName,
            confirmBiCode: values.confirmBiCode,
            confirmBiName: values.confirmBiName,
            reportAnyPosition: values.reportAnyPosition,
            watch: values.watch,
            remark: values.remark,
          };
        }

        Object.assign(taskValue, valueData);
        console.log('Received values of form: ', values, valueData, taskValue);
      }
    });
    if (isErr) {
      dispatch({
        type: 'approvalCenter/saveTask',
        payload: taskValue,
      });
    }
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

  function handleRemove(file) {
    setUpAttachements(upAttachments.filter(item => item.uid !== file.uid));
  }

  return (
    <>
      <ConfirmModel
        title="Confirm"
        content="Do you comfirm to reject this task?"
        closeModel={() => setConfirmVisible(false)}
        confirmVisible={confirmVisible}
        comfirm={() => submitOrApproveTask(submitType)}
      />
      <ConfirmModel
        title="Confirm"
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
                saveConfirmToCategory={saveConfirmToCategory}
                saveConfirmBiCategory={saveConfirmBiCategory}
              />
              <Drawer
                title="Assign to"
                width={500}
                visible={visible}
                onClose={() => setVisible(false)}
                bodyStyle={{ paddingBottom: 80 }}
              >
                <Radio.Group
                  options={nextUsers}
                  onChange={e => setRadioValue(e.target.value)}
                  value={radioValue}
                ></Radio.Group>
                <div className={btnStyles['bottom-btns']}>
                  <Button onClick={() => setVisible(false)} style={{ marginRight: 12 }}>
                    Cancel
                  </Button>
                  <Button onClick={() => submitOrApproveTask(submitType)} type="primary">
                    Confirm
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
              {currentTaskType !== 'his' && currentOwner ? (
                <div className={styles['comment-box']}>
                  <TextArea
                    placeholder="Plase Input Comment"
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
                    <Col span={20} align="right">
                      <IconFont
                        type="iconicon_withdraw1"
                        onClick={() => setWithdrawConfirmVisible(true)}
                        className={styles['btn-icon']}
                        style={{ marginRight: '8px' }}
                      />
                      <Upload
                        action="/upload?fileClass=WORKFLOW"
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
                      {/* {detailItems[0] && detailItems[0].isEditing ? (
                        <Button style={{ marginRight: '10px' }} type="primary" onClick={saveTask}>
                          Save
                        </Button>
                      ) : null} */}
                      {detailItems[0] && detailItems[0].isStarter ? (
                        <>
                          {detailItems[0].isEditing ? (
                            <Button
                              style={{ marginRight: '10px' }}
                              type="primary"
                              onClick={saveTask}
                            >
                              Save
                            </Button>
                          ) : null}

                          <Button type="primary" onClick={() => submitDrawer('submit')}>
                            Submit
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            style={{ marginRight: '10px' }}
                            type="primary"
                            onClick={() => submitDrawer('reject')}
                          >
                            Reject
                          </Button>
                          <Button type="primary" onClick={() => submitDrawer('pass')}>
                            Approve
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>
                  {!!upAttachments.length && (
                    <TaskAttachments
                      attachments={upAttachments}
                      onRemove={handleRemove}
                      onRemoveAll={() => setUpAttachements([])}
                    />
                  )}
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
    approvalCenter: { detailItems, userList, taskHistoryList, logList, nextUsers, nextGroup },
  }) => ({
    detailItems,
    userList,
    taskHistoryList,
    logList,
    nextUsers,
    nextGroup,
    loading: loading.effects,
  }),
)(ProcessDetail);
