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
} from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import styles from './index.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
// const { Column } = Table;
const { Paragraph, Text } = Typography;

// export function TaskDes({ detailItem }) {
//   return <div></div>;
// }

function DetailForm({ form, detailItem, task }) {
  const { getFieldDecorator } = form;
  const detailList = task ? detailItem.data || [] : [];
  const isShowForm = detailItem.isStarter;
  console.log('detailItem---->', detailItem.data);
  return (
    // <Form>
    //   <Form.Item label="name" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
    //     {getFieldDecorator('name')(<Input />)}
    //   </Form.Item>
    // </Form>
    <>
      <Form>
        {isShowForm &&
          detailList.length &&
          detailList.map(item => (
            <Form.Item label={item.key} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator(item.key, {
                initialValue: item.oldValue,
              })(<Input disabled={!item.isEdit} />)}
            </Form.Item>
          ))}
      </Form>
      {!isShowForm && (
        <div className={styles.ListBox}>
          <List
            header={
              task && (
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
  task,
  detailItems,
  taskGroup,
  submitRadioList,
  currentTaskType,
}) {
  const [isFullscreen, setFullscreen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [submitType, setSubmitType] = useState('');
  const newDetailForm = React.createRef();
  console.log('detailItem--000-->', radioValue, taskGroup);

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

  function submitDrawer(type) {
    if (taskGroup && taskGroup.nextRelateNo === null) {
      submitOrApproveTask(type);
      return;
    }
    if (taskGroup) {
      setSubmitType(type);
      setVisible(true);
      getUserList();
      return;
    }
    message.error('submit failure');
  }

  function submitOrApproveTask(type) {
    dispatch({
      type: 'approvalCenter/approveAndReject',
      payload: {
        taskCode: task.taskCode,
        type,
        userId: radioValue,
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
        console.log('epCname---->', epCname);
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

  return (
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
            <ul className={styles['comment-ul']}>
              {alert.comments &&
                alert.comments.map(comment => (
                  <AlertComment comment={comment} key={comment.time} />
                ))}
            </ul>
            <div className={styles['comment-box']}>
              <TextArea placeholder="COMMENT" className={styles.txt} />
              <Row
                className={styles['comment-commit']}
                type="flex"
                align="middle"
                justify="space-between"
              >
                {/* <Col span={11} offset={1}>
                  <Button type="primary">Phase</Button>
                </Col> */}

                {detailItems.isStarter ? (
                  <>
                    <Col span={6}>
                      <Button type="primary" onClick={() => submitDrawer('submit')}>
                        Submit
                      </Button>
                    </Col>
                    <Col span={6} align="right">
                      <Button type="primary" onClick={saveTask}>
                        Save
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col span={6}>
                      <Button type="primary" onClick={() => submitDrawer('pass')}>
                        Approve
                      </Button>
                    </Col>
                    <Col span={6}>
                      <Button type="primary" onClick={() => submitDrawer('reject')}>
                        Reject
                      </Button>
                    </Col>
                  </>
                )}

                {/* <Col span={6}>attachments</Col> */}
              </Row>
            </div>
          </TabPane>
          <TabPane className={styles['tab-content']} tab="Task Lifecycle" key="2">
            <Row gutter={[10, 10]} style={{ height: 440, overflowY: 'auto' }}>
              {alert.logs && alert.logs.map(log => <AlertLog log={log} key={log.time} />)}
            </Row>
          </TabPane>
        </Tabs>
      </Col>
      {/* <FormattedMessage id="alert-center.attachment-des" values={{ count: 7, size: 18 }} /> */}
    </Row>
  );
}

export default connect(
  ({ loading, approvalCenter: { detailItems, userList, submitRadioList, taskGroup } }) => ({
    detailItems,
    userList,
    submitRadioList,
    taskGroup,
    loading: loading.effects,
  }),
)(ProcessDetail);
