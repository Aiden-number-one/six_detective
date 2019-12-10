import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Input, Button, Empty, Spin, Upload } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import styles from '@/pages/AlertCenter/index.less';
import {
  AlertDes,
  AlertTask,
  AlertComment,
  AlertLog,
  AlertAttachments,
  AlertPhase,
} from './components';

const { TabPane } = Tabs;
const { TextArea } = Input;

function AlertDetail({ dispatch, loading, alert, alertItems, comments, logs }) {
  const [isFullscreen, setFullscreen] = useState(false);
  const [comment, setComment] = useState('');
  const [upAttachments, setUpAttachements] = useState([]);

  useEffect(() => {
    const { alertType, alertId } = alert;
    dispatch({
      type: 'alertCenter/fetchAlertItems',
      payload: {
        alertType,
      },
    });
    dispatch({
      type: 'alertCenter/fetchComments',
      payload: {
        alertId,
      },
    });
    dispatch({
      type: 'alertCenter/fetchLogs',
      payload: {
        alertId,
      },
    });
  }, [alert]);

  async function commitComment() {
    await dispatch({
      type: 'alertCenter/postComment',
      payload: {
        alertId: alert.alertId,
        content: comment,
      },
    });
    setComment('');
  }

  function handleUpAttachments(info) {
    let fileList = [...info.fileList];
    // limit 5 files
    fileList = fileList.slice(-5);
    setUpAttachements(fileList);
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
          <TabPane
            key="1"
            className={styles['tab-content']}
            closable={false}
            tab={<FormattedMessage id="alert-center.alert-detail" />}
          >
            <AlertDes alert={alert} />
          </TabPane>
          <TabPane
            className={styles['tab-content']}
            closable={false}
            tab={<FormattedMessage id="alert-center.alert-item-list" />}
            key="2"
          >
            <AlertTask
              dataSource={alertItems}
              loading={loading['alertCenter/fetchAlertItems']}
              handleChange={(page, pageSize) => {
                dispatch({
                  type: 'alertCenter/fetchAlertItems',
                  payload: {
                    alertType: alert.alertType,
                    page,
                    pageSize,
                  },
                });
              }}
            />
          </TabPane>
        </Tabs>
      </Col>
      <Col span={8}>
        <Tabs defaultActiveKey="1" className={styles['detail-comment']}>
          <TabPane key="1" tab={<FormattedMessage id="alert-center.comment-history" />}>
            <Spin spinning={loading['alertCenter/fetchComments']}>
              {comments ? (
                <ul className={styles['comment-ul']}>
                  {comments.map(item => (
                    <AlertComment comment={item} key={item.id} />
                  ))}
                </ul>
              ) : (
                <Empty />
              )}
            </Spin>
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
                <Col span={11} offset={1}>
                  <AlertPhase postComment={c => setComment(`${comment}${c}`)} />
                </Col>
                <Col span={6} align="right">
                  <Upload
                    showUploadList={false}
                    fileList={upAttachments}
                    onChange={handleUpAttachments}
                  >
                    <IconFont type="iconbiezhen" style={{ cursor: 'pointer', marginRight: 4 }} />
                    {upAttachments.length > 0 && upAttachments.length}
                  </Upload>
                </Col>
                <Col span={6} align="right">
                  <Button type="primary" onClick={commitComment}>
                    Submit
                  </Button>
                </Col>
              </Row>
              {!!upAttachments.length && <AlertAttachments attachments={upAttachments} />}
            </div>
          </TabPane>
          <TabPane
            key="2"
            className={styles['tab-content']}
            tab={<FormattedMessage id="alert-center.alert-lifecycle" />}
          >
            {logs ? (
              <Row gutter={[10, 10]} style={{ height: 440, overflowY: 'auto' }}>
                {logs.map(log => (
                  <AlertLog log={log} key={log.id} />
                ))}
              </Row>
            ) : (
              <Empty />
            )}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}

export default connect(({ loading, alertCenter: { alertItems, comments, logs } }) => ({
  loading: loading.effects,
  alertItems,
  comments,
  logs,
}))(AlertDetail);
