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

function AlertDetail({ dispatch, loading, alert, comments = [], logs = [] }) {
  const [isFullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const { alertTypeId, alertId, itemsTotal } = alert;
    // no items
    if (+itemsTotal !== 0) {
      dispatch({
        type: 'alertCenter/fetchAlertItems',
        payload: {
          alertTypeId,
          alertId,
        },
      });
    }

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
  }, [alert]);

  async function handleCommit(comment, fileList) {
    await dispatch({
      type: 'alertCenter/postComment',
      payload: {
        alertId: alert.alertId,
        content: comment,
        fileList: fileList.map(file => file.url),
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
          {+alert.itemsTotal !== 0 && (
            <TabPane
              key="2"
              className={styles['tab-content']}
              closable={false}
              tab={<FormattedMessage id="alert-center.alert-item-list" />}
            >
              <AlertTask alert={alert} />
            </TabPane>
          )}
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
            <AlertRichText loading={loading['alertCenter/postComment']} onCommit={handleCommit} />
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

export default connect(({ loading, alertCenter: { comments, logs } }) => ({
  loading: loading.effects,
  comments,
  logs,
}))(AlertDetail);
