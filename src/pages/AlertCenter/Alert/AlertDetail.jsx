import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Empty, Spin } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import styles from '@/pages/AlertCenter/index.less';
import { AlertDes, AlertTask, AlertComment, AlertLog, AlertRichText } from './components';

const { TabPane } = Tabs;

function CustomEmpty({ className = '', style = {} }) {
  return (
    <Row className={className} style={style} type="flex" align="middle" justify="center">
      <Empty />
    </Row>
  );
}

function AlertDetail({
  dispatch,
  loading,
  alert,
  alertItems = [],
  comments = [],
  logs = [],
  users,
}) {
  const [isFullscreen, setFullscreen] = useState(false);
  const { alertTypeId, alertId } = alert;

  useEffect(() => {
    dispatch({
      type: 'alertCenter/fetchAlertItems',
      payload: {
        alertTypeId,
        alertId,
      },
    });
    dispatch({
      type: 'alertCenter/fetchLogs',
      payload: {
        alertId,
      },
    });
    dispatch({
      type: 'alertCenter/fetchComments',
      payload: {
        alertId,
      },
    });
  }, [alertTypeId, alertId]);

  async function commitComment(comment) {
    await dispatch({
      type: 'alertCenter/postComment',
      payload: {
        alertId: alert.alertId,
        content: comment,
      },
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
          <TabPane
            key="1"
            className={styles['tab-content']}
            closable={false}
            tab={<FormattedMessage id="alert-center.alert-detail" />}
          >
            <AlertDes alert={alert} />
          </TabPane>
          <TabPane
            key="2"
            className={styles['tab-content']}
            closable={false}
            tab={<FormattedMessage id="alert-center.alert-item-list" />}
          >
            <AlertTask
              alertItems={alertItems}
              users={users}
              loading={loading}
              getUsers={() => {
                dispatch({
                  type: 'alertCenter/fetchUsers',
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
              {comments.length > 0 ? (
                <ul className={styles['comment-list']}>
                  {comments.map(item => (
                    <AlertComment comment={item} key={item.id} />
                  ))}
                </ul>
              ) : (
                <CustomEmpty className={styles['comment-list']} />
              )}
            </Spin>
            <AlertRichText
              loading={loading['alertCenter/postComment']}
              commitComment={comment => commitComment(comment)}
            />
          </TabPane>
          <TabPane key="2" tab={<FormattedMessage id="alert-center.alert-lifecycle" />}>
            <Spin spinning={loading['alertCenter/fetchLogs']}>
              <div style={{ height: 370, overflowY: 'auto', padding: '0 18px' }}>
                {logs.length > 0 ? (
                  logs.map(log => <AlertLog log={log} key={log.id} />)
                ) : (
                  <CustomEmpty className={styles['comment-list']} style={{ height: 370 }} />
                )}
              </div>
            </Spin>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}

export default connect(({ loading, alertCenter: { alertItems, comments, logs, users } }) => ({
  loading: loading.effects,
  alertItems,
  comments,
  logs,
  users,
}))(AlertDetail);
