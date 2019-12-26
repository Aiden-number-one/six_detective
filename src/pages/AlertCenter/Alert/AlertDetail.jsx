import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Empty, Spin, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import styles from '@/pages/AlertCenter/index.less';
import {
  AlertDes,
  AlertTask,
  AlertComment,
  AlertLog,
  AlertRichText,
  EpTaskItem,
  ProductTaskItem,
  CaCodeTaskItem,
  epColumns,
  proudctColumns,
  caCodeColumns,
} from './components';

const taskColumnsMap = {
  301: epColumns,
  302: proudctColumns,
  303: caCodeColumns,
};

const TaskItemMap = {
  301: EpTaskItem,
  302: ProductTaskItem,
  303: CaCodeTaskItem,
};

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
  const [panes, setPanes] = useState([]);
  const [activeKey, setActiveKey] = useState('1');
  const taskColumns = taskColumnsMap[+alert.alertTypeId];
  const TaskItem = TaskItemMap[+alert.alertTypeId];

  useEffect(() => {
    const { alertTypeId, alertId, itemsTotal } = alert;
    // clear task item
    setPanes([]);
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
    setActiveKey('1');
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

  function handleAddItem(pane) {
    const isEqual = item => item.ALERT_ITEM_ID === pane.ALERT_ITEM_ID;
    if (panes.find(isEqual)) {
      // update item
      setPanes(panes.map(p => (isEqual(p) ? pane : p)));
    } else {
      // add pane
      setPanes([...panes, pane]);
    }
    setActiveKey(pane.ALERT_ITEM_ID.toString());
  }

  function handleRemoveItem(e, pane) {
    e.stopPropagation();
    let lastIndex;
    let curActiveKey = activeKey;
    const targetKey = pane.ALERT_ITEM_ID;
    panes.forEach((item, i) => {
      if (item.ALERT_ITEM_ID === targetKey) {
        lastIndex = i - 1;
      }
    });

    setPanes(panes.filter(item => item.ALERT_ITEM_ID !== targetKey));

    if (panes.length && activeKey === targetKey.toString()) {
      if (lastIndex >= 0) {
        curActiveKey = panes[lastIndex].ALERT_ITEM_ID.toString();
      } else {
        curActiveKey = '2';
      }
    }
    setActiveKey(curActiveKey);
  }

  return (
    <Row className={styles['detail-container']} gutter={10}>
      <Col span={16} className={isFullscreen ? styles.fullscreen : ''}>
        <Tabs
          className={styles['detail-des']}
          activeKey={activeKey}
          onChange={key => setActiveKey(key)}
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
            tab={<FormattedMessage id="alert-center.alert-detail" />}
          >
            <AlertDes alert={alert} />
          </TabPane>
          {+alert.itemsTotal !== 0 && taskColumns && (
            <TabPane
              key="2"
              className={styles['tab-content']}
              tab={<FormattedMessage id="alert-center.alert-item-list" />}
            >
              <AlertTask alert={alert} onTaskRow={handleAddItem} taskColumns={taskColumns} />
            </TabPane>
          )}
          {+alert.itemsTotal !== 0 &&
            panes.map(pane => (
              <TabPane
                className={styles['tab-content']}
                style={{ minHeight: 350 }}
                key={pane.ALERT_ITEM_ID.toString()}
                tab={
                  <Row type="flex" justify="space-between" align="middle">
                    <span>Alert Item </span>
                    <Icon
                      type="close"
                      style={{ marginLeft: 12, fontSize: 12 }}
                      onClick={e => handleRemoveItem(e, pane)}
                    />
                  </Row>
                }
              >
                <TaskItem task={pane} />
              </TabPane>
            ))}
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
          <TabPane
            key="2"
            tab={<FormattedMessage id="alert-center.alert-lifecycle" />}
            className={styles['tab-content']}
          >
            <Spin spinning={loading['alertCenter/fetchLogs']}>
              <div style={{ height: 370, overflowY: 'auto' }}>
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
