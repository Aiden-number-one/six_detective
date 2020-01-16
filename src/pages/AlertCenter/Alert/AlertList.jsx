import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Table, Row, Icon, Alert } from 'antd';
import IconFont from '@/components/IconFont';
import { getAuthority } from '@/utils/authority';
import {
  dateFormat,
  timestampFormat,
  rawTimestampFormat,
  pageSizeOptions,
  downloadFile,
} from '@/pages/DataImportLog/constants';
import { ClaimModal, CloseModal } from './components/AlertListModal';
import { AlertListBtns } from './components/AlertListBtns';
import ColumnTitle, { actionType, useColumnFilter } from '../ColumnTitle';
import AlertDetail from './AlertDetail';
import styles from '../index.less';

const { Column } = Table;

function AlertList({ dispatch, location, loading, alerts, alertPage, alertPageSize, total }) {
  const [alert, setAlert] = useState(null);
  const [claimVisible, setClaimVisible] = useState(false);
  const [claimContent, setClaimContent] = useState('');
  const [closeVisible, setCloseVisible] = useState(false);
  const [closeContent, setCloseContent] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isBatchAction, setBatchAction] = useState(false);
  const [isDiscontinue, setDiscontinue] = useState(false);

  const queryParams = Object.keys(location.query);
  // header filter
  const { fetchTableList, handlePageChange, getTitleProps } = useColumnFilter({
    dispatch,
    page: alertPage,
    pageSize: alertPageSize,
    reset: queryParams.length > 0 ? handleCloseMsg : null,
  });

  const isAuth = useMemo(() => {
    const auth = getAuthority() || {};
    return auth.authDiscontinue;
  }, []);

  useEffect(() => {
    const { alertId, owner, status, timestamp } = location.query;
    let params = [];
    if (alertId) {
      params = [{ column: 'alertNo', value: alertId, condition: '7' }];
    }
    if (owner) {
      params = [...params, { column: 'userName', value: owner, condition: '7' }];
    }
    if (status) {
      params = [...params, { column: 'alertStatusDesc', value: status, condition: '7' }];
    }
    if (timestamp) {
      // format timestamp
      const [start, end] = timestamp.split(',');
      params = [
        ...params,
        { column: 'alertTime', value: `${start}000000`, condition: '4' },
        { column: 'alertTime', value: `${end}2359595`, condition: '6' },
      ];
    }
    fetchTableList({
      page: alertPage,
      pageSize: alertPageSize,
      conditions: params,
    });
  }, [location]);

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      const [firstAlert] = alerts;
      const curAlert = alert && alerts.find(item => item.alertId === alert.alertId);
      // should be latest alert,owner and status has been changed
      setAlert(curAlert || firstAlert);
    } else {
      setAlert(null);
    }
  }, [alerts]);

  function handleCancelClaim() {
    setClaimVisible(false);
    setBatchAction(false);
  }

  // claim single alert
  async function claimAlert(record) {
    setBatchAction(false);
    setAlert(record);
    if (record.userName) {
      const userNameArr = record.userName.split(',');
      setClaimContent(
        <div>
          This alert has been claimed by [{userNameArr.length > 1 ? 'others' : record.userName}]
        </div>,
      );
      setClaimVisible(true);
    } else {
      // check latest alert status
      const users = await dispatch({
        type: 'alertCenter/claim',
        payload: {
          alertIds: [record.alertId],
        },
      });
      if (users && users.length > 0) {
        users.forEach(item => {
          if (item.userName) {
            const userNameArr = item.userName.split(',');
            setClaimContent(
              <div>
                This alert has been claimed by [{userNameArr.length > 1 ? 'others' : item.userName}]
              </div>,
            );
            setClaimVisible(true);
          }
        });
      }
    }
  }

  async function claimAlerts() {
    setBatchAction(true);
    const findAlert = selectedRows.find(item => item.userName);
    if (findAlert && findAlert.userName) {
      setClaimVisible(true);
      setClaimContent(<div>Some alerts has been claimed.</div>);
    } else {
      // check latest alert status
      const users = await dispatch({
        type: 'alertCenter/claimMany',
        payload: {
          alertIds: selectedRows.map(item => item.alertId),
        },
      });
      if (users && users.length > 0) {
        setClaimContent(<div>Some alerts has been claimed.</div>);
        setClaimVisible(true);
      }
    }
  }

  async function handleReClaim() {
    const curAlertId = alert.alertId;
    await dispatch({
      type: 'alertCenter/reClaim',
      payload: {
        alertIds: !isBatchAction ? [curAlertId] : selectedRows.map(item => item.alertId),
      },
    });
    setClaimVisible(false);
  }

  function showCloseModal(record) {
    setCloseVisible(true);
    if (record) {
      setAlert(record);
      setBatchAction(false);
      setCloseContent(
        <>
          <div>Do you confirm to close this alert?</div>
          <div>(AlertId: {record.alertId})</div>
        </>,
      );
    } else {
      setBatchAction(true);
      setCloseContent('Do you confirm to close these alerts?');
    }
  }

  async function closeAlert() {
    const curAlertId = alert.alertId;
    await dispatch({
      type: 'alertCenter/close',
      payload: {
        alertIds: !isBatchAction ? [curAlertId] : selectedRows.map(item => item.alertId),
      },
    });
    setCloseVisible(false);
  }

  async function discontinueAlert() {
    await dispatch({
      type: 'alertCenter/discontinue',
      payload: {
        alertIds: selectedRows.map(item => item.alertId),
      },
    });
    setCloseVisible(false);
  }

  async function handleExport() {
    const url = await dispatch({
      type: 'alertCenter/exportAlerts',
      payload: {
        alertId: selectedRows.map(item => item.alertId),
      },
    });
    if (url) {
      downloadFile(url);
    }
  }

  function handleCloseMsg() {
    router.replace('/homepage/alert-center');
  }

  return (
    <div className={styles['list-container']}>
      <div className={styles.list}>
        <ClaimModal
          visible={claimVisible}
          content={claimContent}
          onCancel={handleCancelClaim}
          onOk={handleReClaim}
          loading={loading['alertCenter/reClaim']}
        />
        <CloseModal
          visible={closeVisible}
          onCancel={() => setCloseVisible(false)}
          onOk={isDiscontinue ? discontinueAlert : closeAlert}
          content={closeContent}
          loading={loading[`alertCenter/${isDiscontinue ? 'discontinue' : 'close'}`]}
        />
        <AlertListBtns
          isAuth={isAuth}
          isBatchAction={isBatchAction}
          loading={loading}
          disabled={!selectedRows.length}
          claimAlerts={() => claimAlerts()}
          closeAlerts={() => {
            setDiscontinue(false);
            showCloseModal();
          }}
          onDiscontinue={() => {
            setDiscontinue(true);
            showCloseModal();
          }}
          onExport={handleExport}
        />
        {queryParams.length > 0 && (
          <Alert
            closable
            type="info"
            closeText="Clear"
            onClose={handleCloseMsg}
            message={
              <>
                <Icon type="exclamation-circle" theme="filled" />
                Query Condition：
                {queryParams.map((w, index) => (
                  <>
                    {index > 0 && ', '}
                    <em key={w}>{w}</em>
                  </>
                ))}
              </>
            }
          />
        )}
        <Table
          dataSource={alerts}
          rowKey="alertId"
          loading={loading[actionType]}
          rowClassName={record => (alert && record.alertId === alert.alertId ? 'table-active' : '')}
          rowSelection={{
            columnWidth: 50,
            onChange(selectedRowKeys, sRows) {
              setSelectedRows(sRows);
            },
          }}
          pagination={{
            total,
            current: alertPage,
            pageSize: alertPageSize,
            showSizeChanger: true,
            pageSizeOptions,
            showTotal(count) {
              return `Total ${count} items`;
            },
            onChange: (page, pageSize) => handlePageChange(page, pageSize),
            onShowSizeChange: (page, pageSize) => handlePageChange(page, pageSize),
          }}
          onRow={record => ({
            onClick() {
              setAlert(record);
            },
          })}
        >
          <Column
            width={60}
            dataIndex="no"
            title="No."
            render={(text, record, index) => {
              const count = (alertPage - 1) * alertPageSize + index + 1;
              return <span title={count}>{count}</span>;
            }}
          />
          <Column
            dataIndex="alertNo"
            className="word-break"
            title={
              <ColumnTitle {...getTitleProps('alertNo')}>
                <FormattedMessage id="alert-center.alert-id" />
              </ColumnTitle>
            }
          />
          <Column
            ellipsis
            dataIndex="alertName"
            title={
              <ColumnTitle {...getTitleProps('alertName')}>
                <FormattedMessage id="alert-center.alert-name" />
              </ColumnTitle>
            }
          />
          <Column
            align="center"
            dataIndex="tradeDate"
            render={text => moment(text).format(dateFormat)}
            title={
              <ColumnTitle {...getTitleProps('tradeDate')}>
                <FormattedMessage id="alert-center.trade-date" />
              </ColumnTitle>
            }
          />
          <Column
            align="center"
            dataIndex="alertTime"
            render={text => moment(text, rawTimestampFormat).format(timestampFormat)}
            title={
              <ColumnTitle {...getTitleProps('alertTime')}>
                <FormattedMessage id="alert-center.alert-timestamp" />
              </ColumnTitle>
            }
          />
          <Column
            width={120}
            align="right"
            dataIndex="itemsTotal"
            title={
              <ColumnTitle isNum {...getTitleProps('itemsTotal')}>
                <FormattedMessage id="alert-center.items-total" />
              </ColumnTitle>
            }
          />
          <Column
            width={120}
            dataIndex="userName"
            render={text => {
              if (text) {
                const users = text.split(',');
                return users.length > 1 ? <span title={text}>Multiple</span> : text;
              }
              return text;
            }}
            title={
              <ColumnTitle {...getTitleProps('userName')}>
                <FormattedMessage id="alert-center.owner" />
              </ColumnTitle>
            }
          />
          <Column
            width={110}
            dataIndex="alertStatusDesc"
            render={text => {
              if (text) {
                const users = text.split(',');
                return users.length > 1 ? <span title={text}>Multiple</span> : text;
              }
              return text;
            }}
            title={
              <ColumnTitle {...getTitleProps('alertStatusDesc')}>
                <FormattedMessage id="alert-center.status" />
              </ColumnTitle>
            }
          />
          <Column
            width={80}
            dataIndex="action"
            title={<FormattedMessage id="alert-center.actions" />}
            render={(text, record) => (
              <Row type="flex" align="middle" className={styles['icon-btns']}>
                {alert &&
                alert.alertId === record.alertId &&
                !isBatchAction &&
                loading['alertCenter/claim'] ? (
                  <Icon type="loading" />
                ) : (
                  <button
                    type="button"
                    disabled={+record.alertStatus === 1}
                    title={formatMessage({ id: 'alert-center.claim' })}
                    onClick={() => claimAlert(record)}
                  >
                    <IconFont type="icon-claimx" className={styles.icon} />
                  </button>
                )}
                {/* never can close by manual */}
                {+record.isClosedManually === 1 && (
                  <button
                    type="button"
                    disabled={+record.alertStatus === 1}
                    title={formatMessage({ id: 'alert-center.close' })}
                    onClick={() => showCloseModal(record)}
                  >
                    <IconFont type="icon-deletex" className={styles.icon} />
                  </button>
                )}
              </Row>
            )}
          />
        </Table>
      </div>
      {alert && <AlertDetail alert={alert} />}
    </div>
  );
}

const mapStateToProps = ({
  loading,
  alertCenter: { alertItems = [] },
  global: { filterTables, filterTalbePage, filterTalbePageSize, filterTableTotal },
}) => ({
  alertItems,
  alerts: filterTables,
  alertPage: filterTalbePage,
  alertPageSize: filterTalbePageSize,
  total: filterTableTotal,
  loading: loading.effects,
});
export default withRouter(connect(mapStateToProps)(AlertList));
