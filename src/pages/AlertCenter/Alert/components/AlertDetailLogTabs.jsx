import React, { useState, useEffect } from 'react';
import { Tabs, Row, Empty, Spin } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import AlertUpAttachments from './AlertUpAttachments';
import styles from '@/pages/AlertCenter/index.less';

import { AlertComment, AlertLog, AlertRichText } from './index';

const { TabPane } = Tabs;

function CustomEmpty({ height }) {
  return (
    <Row style={{ height }} type="flex" align="middle" justify="center">
      <Empty />
    </Row>
  );
}

function AlertDetailLogTabs({ dispatch, loading, comments, logs, alert, onDownloadAll }) {
  const [upAttachments, setUpAttachements] = useState([]);

  useEffect(() => {
    const { alertId } = alert;
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
    setUpAttachements([]);
  }
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" className={styles['detail-comment']}>
        <TabPane key="1" tab={<FormattedMessage id="alert-center.comment-history" />}>
          <Spin spinning={loading['alertCenter/fetchComments']}>
            {comments.length > 0 ? (
              <ul className={styles['comment-list']}>
                {comments.map(({ id, commitTime, commentContent, userName, fileList }) => (
                  <AlertComment
                    key={id}
                    comment={{
                      id,
                      time: commitTime,
                      content: commentContent,
                      user: userName,
                      files: fileList,
                    }}
                    onDownloadAll={() => onDownloadAll(fileList)}
                  />
                ))}
              </ul>
            ) : (
              <CustomEmpty height={380} />
            )}
          </Spin>
          <AlertRichText
            loading={loading['alertCenter/postComment']}
            upAttachments={upAttachments}
            onUpload={fileList => setUpAttachements(fileList)}
            onCommit={handleCommit}
          />
        </TabPane>
        <TabPane key="2" tab={<FormattedMessage id="alert-center.alert-lifecycle" />}>
          <Spin spinning={loading['alertCenter/fetchLogs']}>
            <div className={styles.logs}>
              {logs.length > 0 ? (
                logs.map(log => <AlertLog log={log} key={log.id} />)
              ) : (
                <CustomEmpty height={480} />
              )}
            </div>
          </Spin>
        </TabPane>
      </Tabs>
      {!!upAttachments.length && (
        <AlertUpAttachments
          attachments={upAttachments}
          onRemoveAll={() => setUpAttachements([])}
          onRemove={file => {
            setUpAttachements(upAttachments.filter(item => item.uid !== file.uid));
          }}
        />
      )}
    </div>
  );
}
export default connect(({ loading, alertCenter: { comments = [], logs = [] } }) => ({
  loading: loading.effects,
  comments,
  logs,
}))(AlertDetailLogTabs);
