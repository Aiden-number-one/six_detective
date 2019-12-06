import React, { useState } from 'react';
import Link from 'umi/link';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Table, Row, Col, Button, Modal } from 'antd';
import IconFont from '@/components/IconFont';
import ColumnTitle from '../ColumnTitle';
import styles from './index.less';

const { Column } = Table;

export default function({ dataSource, loading, getAlert }) {
  const [selectedKeys, setSelectedKeys] = useState([]);

  return (
    <div className={styles.alerts}>
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
      <Table
        border
        dataSource={dataSource}
        rowKey="alertId"
        loading={loading}
        rowSelection={{
          onChange: selectedRowKeys => {
            setSelectedKeys(selectedRowKeys);
          },
        }}
        onRow={record => ({
          onClick() {
            getAlert(record);
          },
        })}
      >
        <Column
          ellipsis
          width={150}
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
          width={120}
          align="center"
          dataIndex="alertTimestamp"
          title={<FormattedMessage id="alert-center.alert-timestamp" />}
        />
        <Column
          align="center"
          width={70}
          dataIndex="itemsTotal"
          title={<FormattedMessage id="alert-center.items-total" />}
        />
        <Column dataIndex="owner" title={<FormattedMessage id="alert-center.owner" />} />
        <Column
          align="center"
          width={80}
          dataIndex="status"
          title={<FormattedMessage id="alert-center.status" />}
        />
        <Column
          align="center"
          width={80}
          dataIndex="handleToday"
          title={<FormattedMessage id="alert-center.handle-today" />}
        />
        <Column
          align="center"
          dataIndex="action"
          title={<FormattedMessage id="alert-center.action" />}
          render={() => (
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
                      console.log(123);
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
