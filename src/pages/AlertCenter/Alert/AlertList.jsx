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
        <Button disabled={!selectedKeys.length} onClick={closeAlert}>
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
          <Link to="/alert-center/information">information</Link>
        </Button>
      </Col>
    </Row>
  );
}

function AlertList({ dispatch, loading, alerts, total, getAlert }) {
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
      // dispatch({
      //   type: 'alertCenter/fetchAlertItems',
      //   payload: {
      //     alertType: firstAlert.alertType,
      //   },
      // });
    }
  }, [alerts]);

  // // update alertItems
  // useEffect(() => {
  //   if (alertItems.length > 0) {
  //     getAlertItems(alertItems);
  //   }
  // }, [alertItems]);

  function claimAlert(alertIds) {
    dispatch({
      type: 'alertCenter/claim',
      payload: {
        alertIds,
      },
    });
  }

  return (
    <div className={styles.list}>
      <AlertBtn selectedKeys={selectedKeys} claimAlert={claimAlert} />
      <Table
        border
        dataSource={alerts}
        rowKey="alertId"
        loading={loading['alertCenter/fetch']}
        rowSelection={{
          onChange: selectedRowKeys => {
            setSelectedKeys(selectedRowKeys);
          },
        }}
        pagination={{
          total,
          showSizeChanger: true,
          showTotal(count) {
            return `Total ${count} items`;
          },
          onChange(page, pageSize) {
            dispatch({
              type: 'alertCenter/fetch',
              payload: {
                page,
                pageSize,
              },
            });
          },
          onShowSizeChange(page, pageSize) {
            dispatch({
              type: 'alertCenter/fetch',
              payload: {
                page,
                pageSize,
              },
            });
          },
        }}
        onRow={record => ({
          onClick() {
            getAlert(record);
            // dispatch({
            //   type: 'alertCenter/fetchAlertItems',
            //   payload: {
            //     alertType: record.alertType,
            //   },
            // });
          },
        })}
      >
        <Column
          align="center"
          dataIndex="alertId"
          title={
            <ColumnTitle>
              <FormattedMessage id="alert-center.alert-id" />
            </ColumnTitle>
          }
        />
        <Column
          align="center"
          dataIndex="alertType"
          title={
            <ColumnTitle>
              <FormattedMessage id="alert-center.alert-type" />
            </ColumnTitle>
          }
        />
        <Column
          align="center"
          dataIndex="tradeDate"
          title={<FormattedMessage id="alert-center.trade-date" />}
        />
        <Column
          align="center"
          dataIndex="alertTime"
          title={<FormattedMessage id="alert-center.alert-timestamp" />}
        />
        <Column
          align="center"
          dataIndex="itemsTotal"
          title={<FormattedMessage id="alert-center.items-total" />}
        />
        <Column dataIndex="owner" title={<FormattedMessage id="alert-center.owner" />} />
        <Column
          align="center"
          dataIndex="alertStatus"
          title={<FormattedMessage id="alert-center.status" />}
        />
        <Column
          align="center"
          dataIndex="action"
          title={<FormattedMessage id="alert-center.action" />}
          render={(text, record) => (
            <Row className={styles.btns}>
              <IconFont
                type="iconqizhi"
                className={styles.icon}
                title={formatMessage({ id: 'alert-center.claim' })}
                onClick={() =>
                  Modal.confirm({
                    title: 'Confirm',
                    content: 'Are you sure claim this alert?',
                    okText: 'Sure',
                    cancelText: 'Cancel',
                    onOk: () => claimAlert([record.alertId]),
                  })
                }
              />
              <IconFont
                type="iconic_circle_close"
                className={styles.icon}
                title={formatMessage({ id: 'alert-center.close' })}
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
