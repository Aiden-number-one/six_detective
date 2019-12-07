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

function AlertBtn({ selectedKeys }) {
  return (
    <Row className={styles.btns}>
      <Col span={18}>
        <Button type="primary" disabled={!selectedKeys.length}>
          <IconFont type="iconqizhi" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.claim" />
        </Button>
        <Button disabled={!selectedKeys.length}>
          <IconFont type="iconic_circle_close" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.close" />
        </Button>
        <Button disabled={!selectedKeys.length}>
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
    }
  }, [alerts]);

  return (
    <div className={styles.list}>
      <AlertBtn selectedKeys={selectedKeys} />
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
              params: {
                page,
                pageSize,
              },
            });
          },
        }}
        onRow={record => ({
          onClick() {
            getAlert(record);
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
                    onOk() {
                      dispatch({
                        type: 'alertCenter/claim',
                        params: {
                          alertIds: record.alertId,
                        },
                      });
                    },
                  })
                }
              />
              <IconFont
                type="iconic_circle_close"
                className={styles.icon}
                title={formatMessage({ id: 'alert-center.close' })}
              />
              <IconFont
                type="iconbatch-export"
                className={styles.icon}
                title={formatMessage({ id: 'alert-center.export' })}
              />
            </Row>
          )}
        />
      </Table>
    </div>
  );
}

export default connect(({ loading, alertCenter: { alerts, page, total } }) => ({
  alerts,
  page,
  total,
  loading: loading.effects,
}))(AlertList);
