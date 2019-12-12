import React, { useState, useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Table, Row, Col, Button, Modal } from 'antd';
import IconFont from '@/components/IconFont';
import ColumnTitle from '../ColumnTitle';
import styles from '../index.less';

const { Column } = Table;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

function Title({ dispatch, loading, isNum, filterItems, tableColumn, id }) {
  return (
    <ColumnTitle
      isNum={isNum}
      loading={loading}
      filterItems={filterItems}
      getFilterItems={() => {
        dispatch({
          type: 'global/fetchTableFilterItems',
          payload: {
            tableName: 'slop_biz.v_alert_center',
            tableColumn,
          },
        });
      }}
    >
      <FormattedMessage id={`alert-center.${id}`} />
    </ColumnTitle>
  );
}

const WrapTitle = connect(({ loading, global: { filterItems } }) => ({
  loading: loading.effects['global/fetchTableFilterItems'],
  filterItems,
}))(Title);

function AlertBtn({ selectedKeys, claimAlert, closeAlert, exportAlert }) {
  return (
    <Row className={styles.btns}>
      <Col span={18}>
        <Button
          type="primary"
          disabled={!selectedKeys.length}
          onClick={() =>
            Modal.confirm({
              title: 'Confirm',
              content: 'Are you sure claim these alerts?',
              okText: 'Sure',
              cancelText: 'Cancel',
              onOk: () => claimAlert(selectedKeys),
            })
          }
        >
          <IconFont type="iconqizhi" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.claim" />
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() =>
            Modal.confirm({
              title: 'Confirm',
              content: 'Are you sure close these alerts?',
              okText: 'Sure',
              cancelText: 'Cancel',
              onOk: () => closeAlert(selectedKeys),
            })
          }
        >
          <IconFont type="iconic_circle_close" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.close" />
        </Button>
        <Button disabled={!selectedKeys.length} onClick={exportAlert}>
          <IconFont type="iconbatch-export" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.export" />
        </Button>
      </Col>
      <Col span={6} align="right">
        <Button type="link">
          <Link to="/alert-management/information">information</Link>
        </Button>
      </Col>
    </Row>
  );
}

function AlertList({ dispatch, loading, alerts, total, getAlert }) {
  const [alert, setAlert] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'alertCenter/fetch',
    });
  }, []);

  // default alert
  useEffect(() => {
    if (alerts && alerts.length > 0) {
      const [firstAlert] = alerts;
      getAlert(firstAlert);
      setAlert(firstAlert);
    }
  }, [alerts]);

  function handlePageChange(page, pageSize) {
    dispatch({
      type: 'alertCenter/fetch',
      payload: {
        page,
        pageSize,
      },
    });
  }

  function claimAlert(alertIds) {
    dispatch({
      type: 'alertCenter/claim',
      payload: {
        alertIds,
      },
    });
  }

  function closeAlert(alertIds) {
    dispatch({
      type: 'alertCenter/close',
      payload: {
        alertIds,
      },
    });
  }
  return (
    <div className={styles.list}>
      <AlertBtn selectedKeys={selectedKeys} claimAlert={claimAlert} closeAlert={closeAlert} />
      <Table
        border
        dataSource={alerts}
        rowKey="alertId"
        loading={loading['alertCenter/fetch']}
        rowClassName={record => (record.alertId === alert.alertId ? 'active' : '')}
        rowSelection={{
          onChange: selectedRowKeys => setSelectedKeys(selectedRowKeys),
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
          onClick(e) {
            if (!e.target.className) {
              getAlert(record);
              setAlert(record);
            }
          },
        })}
      >
        <Column
          align="center"
          dataIndex="alertId"
          title={<WrapTitle tableColumn="alertId" id="alert-id" />}
        />
        <Column
          align="center"
          dataIndex="alertType"
          title={<WrapTitle tableColumn="alertType" id="alert-type" />}
        />
        <Column
          align="center"
          dataIndex="tradeDate"
          title={<WrapTitle tableColumn="tradeDate" id="trade-date" />}
        />
        <Column
          align="center"
          dataIndex="alertTime"
          title={<WrapTitle tableColumn="alertTime" id="alert-timestamp" />}
        />
        <Column
          align="center"
          dataIndex="itemsTotal"
          title={<WrapTitle isNum tableColumn="alertId" id="items-total" />}
        />
        <Column dataIndex="userName" title={<FormattedMessage id="alert-center.owner" />} />
        <Column
          align="center"
          dataIndex="alertStatus"
          title={<FormattedMessage id="alert-center.status" />}
        />
        <Column
          align="center"
          width="10%"
          dataIndex="action"
          title={<FormattedMessage id="alert-center.action" />}
          render={(text, record) => (
            <Row className={styles.btns}>
              <IconFont
                type="iconqizhi"
                className={styles.icon}
                title={formatMessage({ id: 'alert-center.claim' })}
                onClick={() => {
                  Modal.confirm({
                    title: 'Confirm',
                    content: 'Are you sure claim this alert?',
                    okText: 'Sure',
                    cancelText: 'Cancel',
                    onOk: () => claimAlert([record.alertId]),
                  });
                }}
              />
              <IconFont
                type="iconic_circle_close"
                className={styles.icon}
                title={formatMessage({ id: 'alert-center.close' })}
                onClick={() =>
                  Modal.confirm({
                    title: 'Confirm',
                    content: 'Are you sure close this alert?',
                    okText: 'Sure',
                    cancelText: 'Cancel',
                    onOk: () => closeAlert([record.alertId]),
                  })
                }
              />
            </Row>
          )}
        />
      </Table>
    </div>
  );
}

export default connect(({ loading, alertCenter: { alerts, alertItems, page, total } }) => ({
  alerts,
  page,
  total,
  alertItems,
  loading: loading.effects,
}))(AlertList);
