/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Input, Button, Drawer, Radio, Upload, Empty, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import AlertComment from '@/pages/AlertCenter/Alert/components/AlertComment';
import { downloadFile } from '@/pages/DataImportLog/constants';
import { useColumnFilter } from '@/pages/AlertCenter/ColumnTitle';
import IconFont from '@/components/IconFont';
import { ConfirmModel } from './component/ConfirmModel';
import styles from './index.less';
// import Phase from '@/pages/AlertCenter/Alert/components/AlertPhrase';
import Phase from './component/TaskPhrase';
import TaskAttachments from './component/TaskAttachments';
// import TaskCommentHistory from './component/TaskCommentHistory';
import TaskLog from './component/TaskLog';
import DetailList from './component/DetailList';

import btnStyles from '@/pages/DataImportLog/index.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
// const { Column } = Table;
// const { Paragraph, Text } = Typography;

// 空内容组件
function CustomEmpty({ className = '', style = {} }) {
  return (
    <Row className={className} style={style} type="flex" align="middle" justify="center">
      <Empty />
    </Row>
  );
}

/*
 * @loading:加载loading
 * @task:在列表点击选中的任务
 * @detailItems:任务详情
 * @nextUsers:下一个节点的审批人员
 * @nextGroup:下一个节点的审批角色
 * @taskHistoryList:任务历史
 * @logList:日志列表
 * @currentTaskType:当前任务tab类型，all、my、his
 */
function ProcessDetail({
  dispatch,
  loading,
  task,
  detailItems,
  nextUsers,
  nextGroup,
  taskHistoryList,
  logList,
  currentTaskType,
  pageSizeData,
}) {
  const [isFullscreen, setFullscreen] = useState(false); // 全屏控制
  const [visible, setVisible] = useState(false); // 弹窗显示控制
  const [radioValue, setRadioValue] = useState(''); // 提交、审核选择的人员
  const [submitType, setSubmitType] = useState(''); // 通过类型，submit、pass、reject
  const [comment, setComment] = useState(''); // 获取评论的内容
  const [confirmVisible, setConfirmVisible] = useState(false); // 确认框提示控制
  const [withdrawConfirmVisible, setWithdrawConfirmVisible] = useState(false); // 撤销确认框控制
  const [upAttachments, setUpAttachements] = useState([]); // 附件内容
  const [currentOwner, setIsCurrentOwner] = useState(true); // 是否是当前owner
  const [confirmToCategoryValue, setConfirmToCategory] = useState(''); // 保存confirmToCategory
  const [confirmBiCategoryValue, setConfirmBiCategory] = useState(''); // 保存confirmBiCategory
  const newDetailForm = React.createRef();
  const isLt5M = size => size / 1024 / 1024 < 5;
  const { fetchTableList } = useColumnFilter({
    dispatch,
    tableName: currentTaskType,
    page: pageSizeData.page,
    pageSize: pageSizeData.pageSize,
  });
  // 初始化 加载对应数据
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
    if (task && currentTaskType !== 'SLOP_BIZ.V_TASK_HISTORY') {
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

  // 提交，通过，回退的校验
  function submitDrawer(type) {
    setSubmitType(type);
    setRadioValue('');
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

  // 提交，通过，回退接口
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
              const effectiveDate = values.effectiveDate
                ? moment(values.effectiveDate).format('YYYYMMDD')
                : '';
              const expiryDate = values.expiryDate
                ? moment(values.expiryDate).format('YYYYMMDD')
                : '';
              valueData = {
                isCaCode: values.isCaCode,
                remark: values.remark,
                effectiveDate,
                expiryDate,
              };
            }
          } else if (alertTypeValue === '303') {
            if (values.isCaCode === 'Yes') {
              const effectiveDate = values.effectiveDate
                ? moment(values.effectiveDate).format('YYYYMMDD')
                : '';
              const expiryDate = values.expiryDate
                ? moment(values.expiryDate).format('YYYYMMDD')
                : '';
              valueData = {
                isCaCode: values.isCaCode,
                remark: values.remark,
                effectiveDate,
                expiryDate,
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
          // console.log('Received values of form: ', values, valueData, taskValue);
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
          fetchTableList({}, currentTaskType);
          // dispatch({
          //   type: 'approvalCenter/fetch',
          //   payload: {
          //     type: currentTaskType,
          //   },
          // });
          setUpAttachements([]);
          setComment('');
        },
      });
    }
    setVisible(false);
  }

  // 撤销
  function setTaskWithdraw() {
    // console.log('comment----', comment);
    dispatch({
      type: 'approvalCenter/setTaskWithdraw',
      payload: {
        taskCode: task.taskCode,
        comment,
      },
      callback: () => {
        fetchTableList({}, currentTaskType);
        // dispatch({
        //   type: 'approvalCenter/fetch',
        //   payload: {
        //     type: currentTaskType,
        //     taskCode: task.taskCode,
        //   },
        // });
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

  // 保存任务详情
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
            const effectiveDate = values.effectiveDate
              ? moment(values.effectiveDate).format('YYYYMMDD')
              : '';
            const expiryDate = values.expiryDate
              ? moment(values.expiryDate).format('YYYYMMDD')
              : '';
            valueData = {
              isCaCode: values.isCaCode,
              remark: values.remark,
              effectiveDate,
              expiryDate,
            };
          }
        } else if (alertTypeValue === '303') {
          if (values.isCaCode === 'Yes') {
            const effectiveDate = values.effectiveDate
              ? moment(values.effectiveDate).format('YYYYMMDD')
              : '';
            const expiryDate = values.expiryDate
              ? moment(values.expiryDate).format('YYYYMMDD')
              : '';
            valueData = {
              isCaCode: values.isCaCode,
              remark: values.remark,
              effectiveDate,
              expiryDate,
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

  // 上传附件
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
    setUpAttachements(fileList);
  }
  // 下载所有附件
  async function handleDownloadAll(fileList) {
    const url = await dispatch({
      type: 'global/fetchZipAttachments',
      payload: {
        attachmentUrl: fileList.toString(),
      },
    });
    if (url) {
      downloadFile(url);
    }
  }
  // 删除附件
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
            <TabPane
              className={isFullscreen ? styles['tab-content'] : styles['tab-scroll-content']}
              closable={false}
              tab="Task Detail"
              type="card"
              key=""
            >
              <DetailList
                ref={newDetailForm}
                saveTask={saveTask}
                detailItem={detailItems}
                task={task}
                saveConfirmToCategory={saveConfirmToCategory}
                saveConfirmBiCategory={saveConfirmBiCategory}
              />
              <Drawer
                title={`Assign to ( ${nextGroup} )`}
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
                  <Button
                    disabled={!radioValue}
                    onClick={() => submitOrApproveTask(submitType)}
                    type="primary"
                  >
                    Confirm
                  </Button>
                </div>
              </Drawer>
            </TabPane>
          </Tabs>
        </Col>
        <Col span={8} className={styles['detail-comment-box']}>
          <Tabs defaultActiveKey="1" className={styles['detail-comment']}>
            <TabPane tab="Approval History" key="1">
              <Spin spinning={loading['approvalCenter/getApprovalTaskHistory']}>
                {taskHistoryList.length > 0 ? (
                  <ul className={styles['comment-list']}>
                    {taskHistoryList.map(item => (
                      <AlertComment
                        comment={{
                          id: item.id,
                          time: item.commentTime,
                          content: item.commentContent,
                          user: item.commentUserName,
                          files: item.attachment,
                        }}
                        onDownloadAll={handleDownloadAll}
                        key={item.id}
                      />
                    ))}
                  </ul>
                ) : (
                  <CustomEmpty className={styles['comment-list']} />
                )}
              </Spin>
              {currentTaskType !== 'SLOP_BIZ.V_TASK_HISTORY' &&
              currentOwner &&
              detailItems[0] &&
              detailItems[0].receivedAnswer !== '0' ? (
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
                      <div className={styles['attachments-icon']}>
                        <IconFont
                          type="icon-withdrawx"
                          title="withdraw"
                          onClick={() => setWithdrawConfirmVisible(true)}
                          className={styles['btn-icon']}
                        />
                      </div>
                      {detailItems[0] && detailItems[0].isStarter && detailItems[0].isEditing ? (
                        <div className={styles['attachments-icon']}>
                          <IconFont
                            type="icon-savex"
                            title="save"
                            onClick={saveTask}
                            className={styles['btn-icon']}
                          />
                        </div>
                      ) : null}
                      <div className={styles['attachments-icon']}>
                        <Upload
                          multiple
                          action="/upload?fileClass=WORKFLOW"
                          showUploadList={false}
                          beforeUpload={file => isLt5M(file.size)}
                          fileList={upAttachments}
                          onChange={handleUpAttachments}
                        >
                          <IconFont
                            className={styles['btn-icon']}
                            type="icon-attachmentkaobeix"
                            title="please select a file"
                          />
                        </Upload>
                        <span className={styles['attachments-num']}>
                          {upAttachments.length > 0 && upAttachments.length}
                        </span>
                      </div>
                      {/* {detailItems[0] && detailItems[0].isEditing ? (
                        <Button style={{ marginRight: '10px' }} type="primary" onClick={saveTask}>
                          Save
                        </Button>
                      ) : null} */}
                      {detailItems[0] && detailItems[0].isStarter ? (
                        <>
                          <Button
                            type="primary"
                            style={{ marginLeft: '4px' }}
                            onClick={() => submitDrawer('submit')}
                          >
                            Submit
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            style={{ marginRight: '10px', marginLeft: '4px' }}
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
                <div className={styles.LifecycleBox}>
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
