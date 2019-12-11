import React, { useState, useEffect } from 'react';
import { Tabs, Popover, Row, Col, Typography, Input, Button, Form } from 'antd';
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

function DetailForm({ form, detailItem }) {
  const { getFieldDecorator } = form;
  const detailList = detailItem.data;
  console.log('detailItem---->', detailItem.data);
  return (
    // <Form>
    //   <Form.Item label="name" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
    //     {getFieldDecorator('name')(<Input />)}
    //   </Form.Item>
    // </Form>
    <Form>
      {detailList.length &&
        detailList.map(item => (
          <Form.Item label={item.key} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator(item.key, {
              initialValue: item.oldValue,
            })(<Input disabled={!item.isEdit} />)}
          </Form.Item>
        ))}
    </Form>
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

function ProcessDetail({ dispatch, task, detailItems }) {
  const [isFullscreen, setFullscreen] = useState(false);
  const newDetailForm = React.createRef();
  console.log('detailItem---->', detailItems);
  useEffect(() => {
    dispatch({
      type: 'approvalCenter/fetchTaskDetail',
      payload: {
        taskCode: task.taskCode,
      },
    });
  }, [task]);

  function saveTask() {
    newDetailForm.current.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
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
            <DetailList ref={newDetailForm} saveTask={saveTask} detailItem={detailItems} />
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
                <Col span={6}>
                  <Button type="primary">Submit</Button>
                </Col>
                {/* <Col span={6}>attachments</Col> */}
                <Col span={6} align="right">
                  <Button type="primary" onClick={saveTask}>
                    Save
                  </Button>
                </Col>
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

export default connect(({ loading, approvalCenter: { detailItems } }) => ({
  detailItems,
  loading: loading.effects,
}))(ProcessDetail);
