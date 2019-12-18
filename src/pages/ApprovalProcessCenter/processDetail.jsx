import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Popover,
  Row,
  Col,
  Typography,
  Input,
  Button,
  Form,
  List,
  Drawer,
  Radio,
  message,
  Upload,
  Empty,
  Spin,
} from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import { ConfirmModel } from './component/ConfirmModel';
import styles from './index.less';
import Phase from './component/phase';
import TaskAttachments from './component/TaskAttachments';

const { TabPane } = Tabs;
const { TextArea } = Input;
// const { Column } = Table;
const { Paragraph, Text } = Typography;

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
function DetailForm({ form, detailItem, task }) {
  const { getFieldDecorator } = form;
  const detailList = task ? detailItem.data || [] : [];
  const isShowForm = detailItem.isStarter;
  console.log('detailItem---->', detailItem.data);
  return (
    <>
      {isShowForm && detailList.length ? (
        <Form>
          {detailList.map(item => (
            <Form.Item label={item.key} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator(item.key, {
                initialValue: item.oldValue,
              })(<Input disabled={!item.isEdit} />)}
            </Form.Item>
          ))}
        </Form>
      ) : (
        <div className={styles.ListBox}>
          <List
            header={
              task &&
              detailList.length > 0 && (
                <List.Item>
                  <div className={styles.ListItem}>
                    <p></p>
                    <p>New INFO</p>
                    <p>Old INFO</p>
                  </div>
                </List.Item>
              )
            }
            bordered
            dataSource={detailList}
            renderItem={item => (
              <List.Item>
                <div className={styles.ListItem}>
                  <p>{item.key}</p>
                  <p>{item.newValue}</p>
                  <p>{item.oldValue}</p>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </>
  );
}

const DetailList = Form.create()(DetailForm);

// function AlertTaskModal({ visible, handleCancel }) {
//   return (
//     <Drawer
//       title={<FormattedMessage id="alert-center.assign" />}
//       width={320}
//       visible={visible}
//       onClose={handleCancel}
//     >
//       1323
//     </Drawer>
//   );
// }

// function AlertTask({ dataSource }) {
//   const [visible, setVisible] = useState(false);
//   const [selectedKeys, setSelectedKeys] = useState([]);

//   return (
//     <>
//       <AlertTaskModal visible={visible} handleCancel={() => setVisible(false)} />
//       <Button
//         style={{ marginBottom: 10 }}
//         disabled={!selectedKeys.length}
//         onClick={() => setVisible(true)}
//       >
//         <FormattedMessage id="alert-center.assign" />
//       </Button>
//       <Table
//         border
//         dataSource={dataSource}
//         rowKey="epCode"
//         scroll={{ y: 320 }}
//         rowSelection={{
//           onChange: selectedRowKeys => {
//             setSelectedKeys(selectedRowKeys);
//           },
//         }}
//       >
//         <Column
//           align="center"
//           dataIndex="market"
//           title={<FormattedMessage id="alert-center.market" />}
//         />
//         <Column
//           align="center"
//           dataIndex="epCode"
//           title={<FormattedMessage id="alert-center.ep-code" />}
//         />
//         <Column dataIndex="epName" title={<FormattedMessage id="alert-center.ep-name" />} />
//         <Column dataIndex="owner" title={<FormattedMessage id="alert-center.owner" />} />
//         <Column
//           align="center"
//           dataIndex="status"
//           title={<FormattedMessage id="alert-center.status" />}
//         />
//         <Column
//           align="center"
//           dataIndex="action"
//           title={<FormattedMessage id="alert-center.action" />}
//           render={() => (
//             <Link to="/system-management/workflow-design" style={{ fontSize: 12 }}>
//               <FormattedMessage id="alert-center.enter-workflow" />
//             </Link>
//           )}
//         />
//       </Table>
//     </>
//   );
// }

function AlertAttachment({ attachments }) {
  return (
    <Popover
      placement="bottomRight"
      title={<FormattedMessage id="alert-center.attachement-list" />}
      content={
        <Row style={{ padding: '6px 14px', width: 240, maxHeight: 150, overflowY: 'auto' }}>
          {attachments.map(({ name, url }, index) => (
            <Col key={url}>
              <Text ellipsis style={{ width: '100%' }} title={name}>
                <a download href={`/download?filePath=${url}`} style={{ marginBottom: 20 }}>
                  {index + 1}. {name}
                </a>
              </Text>
            </Col>
          ))}
        </Row>
      }
    >
      <IconFont type="iconbiezhen" />
      {attachments.length}
    </Popover>
  );
}

function AlertComment({ comment: { time, text, attachments } }) {
  return (
    <li key={`${time}-${text}`}>
      <Row>
        <Col span={18} style={{ color: '#0D87D4' }}>
          {time}
        </Col>
        <Col span={5} offset={1} align="right">
          {attachments && <AlertAttachment attachments={attachments} />}
        </Col>
      </Row>
      <Row>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{text}</Paragraph>
      </Row>
    </li>
  );
}

function AlertLog({ log: { time, text } }) {
  return (
    <>
      <Col span={9}>{time}</Col>
      <Col span={15}>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{text}</Paragraph>
      </Col>
    </>
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
    let epCname = '';
    if (type === 'submit') {
      newDetailForm.current.validateFields((err, values) => {
        epCname = [];
        const detailData = detailItems.data;
        if (!err) {
          console.log('Received values of form: ', values);
          // eslint-disable-next-line array-callback-return
          detailData.map(item => {
            if (item.isEdit) {
              epCname.push(values[item.key]);
            }
          });
          epCname = epCname.join(',');
        }
      });
    }
    if (type === 'reject') {
      setConfirmVisible(false);
    }
    dispatch({
      type: 'approvalCenter/approveAndReject',
      payload: {
        taskCode: task.taskCode,
        type,
        userId: radioValue,
        epCname,
        comment,
      },
      callback: () => {
        dispatch({
          type: 'approvalCenter/fetch',
          payload: {
            type: currentTaskType,
          },
        });
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
    newDetailForm.current.validateFields((err, values) => {
      let epCname = [];
      const detailData = detailItems.data;
      if (!err) {
        console.log('Received values of form: ', values);
        // eslint-disable-next-line array-callback-return
        detailData.map(item => {
          if (item.isEdit) {
            epCname.push(values[item.key]);
          }
        });
        epCname = epCname.join(',');
      }
      dispatch({
        type: 'approvalCenter/saveTask',
        payload: {
          taskCode: task.taskCode,
          epCname,
        },
      });
    });
  }

  function handleUpAttachments(info) {
    let fileList = [...info.fileList];
    // limit 5 files
    fileList = fileList.slice(-5);
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
                      <AlertComment comment={item} key={item.id} />
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
                        showUploadList={false}
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

                    {detailItems.isStarter ? (
                      <>
                        <Col span={4}>
                          <Button type="primary" onClick={saveTask}>
                            Save
                          </Button>
                        </Col>
                        <Col span={6} align="right">
                          <Button type="primary" onClick={() => submitDrawer('submit')}>
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
                </div>
              ) : null}
            </TabPane>
            <TabPane className={styles['tab-content']} tab="Task Lifecycle" key="2">
              <Row gutter={[10, 10]} style={{ height: 440, overflowY: 'auto' }}>
                {alert.logs && alert.logs.map(log => <AlertLog log={log} key={log.time} />)}
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      {!!upAttachments.length && <TaskAttachments attachments={upAttachments} />}
    </>
  );
}

export default connect(
  ({
    loading,
    approvalCenter: { detailItems, userList, submitRadioList, taskHistoryList, taskGroup },
  }) => ({
    detailItems,
    userList,
    submitRadioList,
    taskHistoryList,
    taskGroup,
    loading: loading.effects,
  }),
)(ProcessDetail);
