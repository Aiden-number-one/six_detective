import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Button } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import { downloadFile } from '@/pages/DataImportLog/constants';
import styles from '@/pages/AlertCenter/index.less';
import {
  AlertDes,
  AlertTask,
  AlertEmailModal,
  AlertDownAttachments,
  TaskBtn,
  EpTaskItem,
  ProductTaskItem,
  CaCodeTaskItem,
  epColumns,
  proudctColumns,
  caCodeColumns,
  newAccountColumns,
  NewAccountTaskItem,
  AlertDetailLogTabs,
} from './components';

const { TabPane } = Tabs;

const taskColumnsMap = {
  301: epColumns,
  302: proudctColumns,
  303: caCodeColumns,
  321: newAccountColumns,
  322: newAccountColumns,
  323: newAccountColumns,
};

const TaskItemMap = {
  301: EpTaskItem,
  302: ProductTaskItem,
  303: CaCodeTaskItem,
  321: NewAccountTaskItem,
  322: NewAccountTaskItem,
  323: NewAccountTaskItem,
};

function AlertDetail({ dispatch, loading, alert, email, attachments }) {
  const [isFullscreen, setFullscreen] = useState(false);
  const [panes, setPanes] = useState([]);
  const [taskItemHistorys, setTaskItemHistorys] = useState([]);
  const [activeKey, setActiveKey] = useState('1');
  const [emailVisible, setEmailVisible] = useState(false);

  const taskColumns = taskColumnsMap[+alert.alertTypeId];
  const TaskItem = TaskItemMap[+alert.alertTypeId];
  const isNewAccountType = [321, 322, 323].includes(+alert.alertTypeId);

  useEffect(() => {
    const { alertId, emailType } = alert;
    // clear task item
    setPanes([]);
    setActiveKey('1');
    // show attachments,just emailType = 111 show attachment
    if (emailType && emailType.split(',').includes('111')) {
      dispatch({
        type: 'alertCenter/fetchAttachments',
        payload: {
          alertId,
        },
      });
    }
  }, [alert]);

  // hide body scrollbar
  useEffect(() => {
    const body = document.querySelector('body');
    body.style.overflowY = isFullscreen ? 'hidden' : 'auto';
  }, [isFullscreen]);

  async function handleAddItem(pane) {
    const isEqual = item => item.TASK_ID === pane.TASK_ID;
    setActiveKey(pane.TASK_ID.toString());
    if (panes.find(isEqual)) {
      // update item
      setPanes(panes.map(p => (isEqual(p) ? pane : p)));
    } else {
      // add pane
      setPanes([pane, ...panes]);
      if (isNewAccountType) {
        const { reportHistory, answerHistory } = await dispatch({
          type: 'alertCenter/fetchTaskHistory',
          payload: {
            taskId: pane.TASK_ID,
          },
        });
        if (!taskItemHistorys.find(isEqual)) {
          setTaskItemHistorys([
            { taskId: pane.TASK_ID, reportHistory, answerHistory },
            ...taskItemHistorys,
          ]);
        }
      }
    }
  }

  function handleRemoveItem(targetKey) {
    let lastIndex;
    let curActiveKey = activeKey;
    panes.forEach((item, i) => {
      if (item.TASK_ID.toString() === targetKey) {
        lastIndex = i - 1;
      }
    });

    setPanes(panes.filter(item => item.TASK_ID.toString() !== targetKey));

    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        curActiveKey = panes[lastIndex].TASK_ID.toString();
      } else {
        curActiveKey = '2';
      }
    }
    setActiveKey(curActiveKey);
  }
  async function showEmail() {
    const err = await dispatch({
      type: 'alertCenter/fetchEmail',
      payload: {
        alertId: alert.alertId,
      },
    });
    if (!err) {
      setEmailVisible(true);
    }
  }
  async function handleSendEmail() {
    await dispatch({
      type: 'alertCenter/sendEmail',
      payload: {
        alertId: alert.alertId,
      },
    });
    setEmailVisible(false);
  }

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

  return (
    <Row className={styles['detail-container']} gutter={isFullscreen ? 0 : 10}>
      <Col span={16} className={isFullscreen ? styles.fullscreen : ''}>
        <Tabs
          hideAdd
          type="editable-card"
          activeKey={activeKey}
          onChange={key => setActiveKey(key)}
          onEdit={(targetKey, action) => {
            if (action === 'remove') {
              handleRemoveItem(targetKey);
            }
          }}
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
            closable={false}
            tab={<FormattedMessage id="alert-center.alert-detail" />}
          >
            <AlertDes alert={alert} />
            {alert.isEmail === '1' && (
              <>
                <div align="right">
                  <Button
                    type="primary"
                    loading={loading['alertCenter/fetchEmail']}
                    onClick={showEmail}
                  >
                    Send Email
                  </Button>
                </div>
                <AlertEmailModal
                  loading={loading}
                  visible={emailVisible}
                  content={email}
                  handleCancel={() => setEmailVisible(false)}
                  onSendEmail={handleSendEmail}
                />
              </>
            )}
          </TabPane>
          {+alert.itemsTotal !== 0 && taskColumns && (
            <TabPane
              key="2"
              closable={false}
              tab={<FormattedMessage id="alert-center.alert-item-list" />}
            >
              <AlertTask alert={alert} onTaskRow={handleAddItem} taskColumns={taskColumns} />
            </TabPane>
          )}
          {+alert.itemsTotal !== 0 &&
            panes.map(pane => (
              <TabPane key={pane.TASK_ID.toString()} tab="Alert Item">
                <TaskItem
                  task={pane}
                  taskItemHistorys={taskItemHistorys}
                  loading={loading['alertCenter/fetchTaskHistory']}
                />
                <div align="right">
                  <TaskBtn task={pane} />
                </div>
              </TabPane>
            ))}
        </Tabs>
        {+alert.emailType === 111 && attachments.length > 0 && (
          <AlertDownAttachments
            attachments={attachments}
            onDownloadAll={() => handleDownloadAll(attachments.map(({ url }) => url))}
          />
        )}
      </Col>
      <Col span={8}>
        <AlertDetailLogTabs alert={alert} onDownloadAll={handleDownloadAll} />
      </Col>
    </Row>
  );
}

export default connect(({ loading, alertCenter: { email, attachments } }) => ({
  loading: loading.effects,
  email,
  attachments,
}))(AlertDetail);
