import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Button, Empty, Spin } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import styles from '@/pages/AlertCenter/index.less';
import { AlertDes, AlertTask, AlertComment, AlertLog, AlertRichText } from './components';

const { TabPane } = Tabs;

function AlertDetail({ dispatch, loading, alert, alertItems, comments, logs }) {
  const [isFullscreen, setFullscreen] = useState(false);
  const [commentPage, setCommentPage] = useState(1);

  useEffect(() => {
    const { alertType, alertId } = alert;
    dispatch({
      type: 'alertCenter/fetchAlertItems',
      payload: {
        alertType,
      },
    });
    dispatch({
      type: 'alertCenter/fetchLogs',
      payload: {
        alertId,
      },
    });
  }, [alert]);

  useEffect(() => {
    const { alertId } = alert;
    dispatch({
      type: 'alertCenter/fetchComments',
      payload: {
        alertId,
        page: commentPage,
      },
    });
  }, [alert, commentPage]);

  async function commitComment(comment) {
    await dispatch({
      type: 'alertCenter/postComment',
      payload: {
        alertId: alert.alertId,
        content: comment,
      },
    });
  }

  function fetchMoreComments() {
    setCommentPage(commentPage + 1);
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
                  <li className={styles['loading-more']}>
                    <Button onClick={fetchMoreComments}>load more</Button>
                  </li>
                </ul>
              ) : (
                <Empty />
              )}
            </Spin>
            <AlertRichText commitComment={comment => commitComment(comment)} />
          </TabPane>
          <TabPane
            key="2"
            className={styles['tab-content']}
            tab={<FormattedMessage id="alert-center.alert-lifecycle" />}
          >
            <Spin spinning={loading['alertCenter/fetchLogs']}>
              {logs ? (
                <Row gutter={[10, 10]} style={{ height: 430, overflowY: 'auto' }}>
                  {logs.map(log => (
                    <AlertLog log={log} key={log.id} />
                  ))}
                </Row>
              ) : (
                <Empty />
              )}
            </Spin>
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
