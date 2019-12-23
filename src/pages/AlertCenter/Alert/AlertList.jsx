import React, { useState, useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Table, Row, Col, Icon } from 'antd';
import IconFont from '@/components/IconFont';
import { dateFormat, timestampFormat } from '@/pages/DataImportLog/constants';
import { ClaimModal, CloseModal, ExportModal } from './components/AlertListModal';
import ColumnTitle from '../ColumnTitle';
import AlertDetail from './AlertDetail';
import styles from '../index.less';

const { Column } = Table;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

const allColumns = ['alertId', 'alertType', 'tradeDate', 'alertTime', 'itemsTotal', 'userName'];
let conditions = [];
function Title({ dispatch, loading, filterItems, tableColumn, id }) {
  function handleFilterItems() {
    dispatch({
      type: 'global/fetchTableFilterItems',
      payload: {
        tableName: 'slop_biz.v_alert_center',
        tableColumn,
      },
    });
  }

  async function handleCommit(condition) {
    const curCondition = conditions.find(item => item.column === condition.column);
    if (curCondition) {
      conditions = conditions.map(item => ({ ...item, ...condition }));
    } else {
      conditions.push(condition);
    }

    dispatch({
      type: 'alertCenter/fetch',
      payload: {
        currentColumn: tableColumn,
        conditions,
      },
    });
  }
  return (
    <ColumnTitle
      isNum={tableColumn === 'itemsTotal'}
      allColumns={allColumns}
      curColumn={tableColumn}
      loading={loading['global/fetchTableFilterItems']}
      filterItems={filterItems}
      getFilterItems={handleFilterItems}
      handleCommit={handleCommit}
    >
      <FormattedMessage id={`alert-center.${id}`} />
    </ColumnTitle>
  );
}

const WrapTitle = connect(({ loading, global: { filterItems } }) => ({
  loading: loading.effects,
  filterItems,
}))(Title);

function AlertBtn({
  disabled,
  loading,
  isBatchAction,
  isReClaim,
  claimAlerts,
  closeAlerts,
  exportAlerts,
}) {
  return (
    <Row className={styles.btns}>
      <Col span={18}>
        <button
          type="button"
          disabled={disabled}
          onClick={claimAlerts}
          className={loading['alertCenter/claim'] ? styles.loading : ''}
        >
          {isBatchAction && !disabled && !isReClaim && loading['alertCenter/claim'] ? (
            <Icon type="loading" className={styles['btn-icon']} />
          ) : (
            <IconFont type="iconqizhi" className={styles['btn-icon']} />
          )}

          <FormattedMessage id="alert-center.claim" />
        </button>
        <button type="button" disabled={disabled} onClick={closeAlerts}>
          <IconFont type="iconclose-circle" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.close" />
        </button>
        <button type="button" disabled={disabled} onClick={exportAlerts}>
          <IconFont type="iconexport" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.export" />
        </button>
      </Col>
      <Col span={6} align="right">
        <Link to="/homepage/information" className={styles.info}>
          Information
        </Link>
      </Col>
    </Row>
  );
}

function AlertList({ dispatch, loading, alerts, total, claimInfos }) {
  const [alert, setAlert] = useState(null);
  const [claimVisible, setClaimVisible] = useState(false);
  const [claimContent, setClaimContent] = useState('');
  const [closeVisible, setCloseVisible] = useState(false);
  const [closeContent, setCloseContent] = useState('');
  const [exportVisible, setExportVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isBatchAction, setBatchAction] = useState(false);
  // reclaim state
  const [isReClaim, setReClaim] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'alertCenter/fetch',
    });
  }, []);

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

  // check latest claim state
  useEffect(() => {
    if (claimInfos && claimInfos.length > 0) {
      claimInfos.forEach(item => {
        if (item.userName) {
          const text = isBatchAction ? (
            <div>some alerts has been claimed</div>
          ) : (
            <div>this alert has been claimed by {item.userName}</div>
          );
          setClaimContent(text);
          setClaimVisible(true);
        }
      });
    }
  }, [claimInfos]);

  function handlePageChange(page, pageSize) {
    dispatch({
      type: 'alertCenter/fetch',
      payload: {
        page,
        pageSize,
      },
    });
  }

  function handleCancelClaim() {
    setClaimVisible(false);
    setBatchAction(false);
    setReClaim(false);
  }

  function claimAlert(record) {
    setBatchAction(false);
    setAlert(record);
    if (record.userName) {
      setClaimVisible(true);
      setClaimContent(<div>this alert has been claimed by {record.userName}</div>);
    } else {
      dispatch({
        type: 'alertCenter/claim',
        payload: {
          alertIds: [record.alertId],
          isCoverClaim: 0,
        },
      });
    }
  }

  function claimAlerts() {
    setBatchAction(true);
    const findAlert = selectedRows.find(item => item.userName);
    if (findAlert && findAlert.userName) {
      setClaimVisible(true);
      setReClaim(true);
      setClaimContent(<div>some alerts has been claimed</div>);
    } else {
      setReClaim(false);
      dispatch({
        type: 'alertCenter/claim',
        payload: {
          alertIds: selectedRows.map(item => item.alertId),
          isCoverClaim: 0,
        },
      });
    }
  }
  async function handleReClaim() {
    setReClaim(true);
    const curAlertId = alert.alertId;
    await dispatch({
      type: 'alertCenter/claim',
      payload: {
        alertIds: !isBatchAction ? [curAlertId] : selectedRows.map(item => item.alertId),
        isCoverClaim: 1,
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

  function handleExport() {}

  return (
    <div className={styles['list-container']}>
      <div className={styles.list}>
        <AlertBtn
          loading={loading}
          disabled={!selectedRows.length}
          isReClaim={isReClaim}
          isBatchAction={isBatchAction}
          claimAlerts={() => claimAlerts()}
          closeAlerts={() => showCloseModal()}
        />
        <ClaimModal
          visible={claimVisible}
          content={claimContent}
          onCancel={handleCancelClaim}
          onOk={handleReClaim}
          loading={loading['alertCenter/claim']}
        />
        <CloseModal
          visible={closeVisible}
          onCancel={() => setCloseVisible(false)}
          onOk={closeAlert}
          content={closeContent}
          loading={loading['alertCenter/close']}
        />
        <ExportModal
          visible={exportVisible}
          onCancel={() => setExportVisible(false)}
          onOk={handleExport}
        />
        <Table
          border
          dataSource={alerts}
          rowKey="alertId"
          loading={loading['alertCenter/fetch']}
          rowClassName={record => (alert && record.alertId === alert.alertId ? 'active' : '')}
          rowSelection={{
            getCheckboxProps: record => ({
              disabled: +record.alertStatus === 1,
            }),
            onChange(selectedRowKeys, sRows) {
              setSelectedRows(sRows);
            },
          }}
          pagination={{
            total,
            showSizeChanger: true,
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
            align="center"
            dataIndex="alertId"
            title={<WrapTitle tableColumn="alertId" id="alert-id" />}
          />
          <Column
            width="15%"
            align="center"
            dataIndex="alertType"
            title={<WrapTitle tableColumn="alertType" id="alert-type" />}
          />
          <Column
            align="center"
            dataIndex="tradeDate"
            title={<WrapTitle tableColumn="tradeDate" id="trade-date" />}
            render={(text, record) => moment(record.tradeDate).format(dateFormat)}
          />
          <Column
            align="center"
            dataIndex="alertTime"
            title={<WrapTitle tableColumn="alertTime" id="alert-timestamp" />}
            render={(text, record) =>
              moment(record.alertTime, timestampFormat).format(timestampFormat)
            }
          />
          <Column
            align="center"
            dataIndex="itemsTotal"
            title={<WrapTitle tableColumn="itemsTotal" id="items-total" />}
            render={(text, record) => +record.itemsTotal}
          />
          <Column
            align="center"
            dataIndex="userName"
            title={<FormattedMessage id="alert-center.owner" />}
          />
          <Column
            align="center"
            dataIndex="alertStatusDesc"
            title={<FormattedMessage id="alert-center.status" />}
          />
          <Column
            align="center"
            width="8%"
            dataIndex="action"
            title={<FormattedMessage id="alert-center.actions" />}
            render={(text, record) => (
              <Row
                type="flex"
                justify="space-around"
                align="middle"
                className={styles['icon-btns']}
              >
                {loading['alertCenter/claim'] &&
                alert &&
                alert.alertId === record.alertId &&
                !isBatchAction &&
                !isReClaim ? (
                  <Icon type="loading" />
                ) : (
                  <button
                    type="button"
                    disabled={+record.alertStatus === 1}
                    title={formatMessage({ id: 'alert-center.claim' })}
                    onClick={() => claimAlert(record)}
                  >
                    <IconFont type="iconqizhi" className={styles.icon} />
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
                    <IconFont type="iconclose" className={styles.icon} />
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
  alertCenter: { alerts, alertItems, page, total, claimInfos },
}) => ({
  alerts,
  page,
  total,
  alertItems,
  claimInfos,
  loading: loading.effects,
});
export default connect(mapStateToProps)(AlertList);
