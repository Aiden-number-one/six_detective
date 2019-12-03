import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Table, Row, Button } from 'antd';
import IconFont from '@/components/IconFont';
import styles from './index.less';

const { Column } = Table;

export default function({ dataSource, getAlert }) {
  return (
    <div className={styles.alerts}>
      <Row className={styles.btns}>
        <Button type="primary">
          <IconFont type="iconqizhi" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.claim" />
        </Button>
        <Button icon="close-circle">
          <FormattedMessage id="alert-center.close" />
        </Button>
        <Button>
          <IconFont type="iconbatch-export" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.export" />
        </Button>
      </Row>
      <Table
        dataSource={dataSource}
        rowKey="alertId"
        rowSelection={{
          onChange: selectedRowKeys => {
            console.log(selectedRowKeys);
          },
        }}
        onRow={record => ({
          onClick() {
            getAlert(record);
          },
        })}
      >
        <Column
          dataIndex="alertId"
          width={200}
          ellipsis
          title={<FormattedMessage id="alert-center.alert-id" />}
          filters={[{ text: 'a', value: 'b' }]}
        />
        <Column
          dataIndex="alertType"
          width={80}
          title={<FormattedMessage id="alert-center.alert-type" />}
        />
        <Column
          dataIndex="tradeDate"
          width={100}
          title={<FormattedMessage id="alert-center.trade-date" />}
        />
        <Column
          dataIndex="alertTimestamp"
          width={120}
          title={<FormattedMessage id="alert-center.alert-timestamp" />}
        />
        <Column
          dataIndex="itemsTotal"
          width={100}
          title={<FormattedMessage id="alert-center.items-total" />}
        />
        <Column
          dataIndex="owner"
          width={130}
          title={<FormattedMessage id="alert-center.owner" />}
        />
        <Column
          dataIndex="status"
          width={80}
          title={<FormattedMessage id="alert-center.status" />}
        />
        <Column
          dataIndex="handleToday"
          width={80}
          title={<FormattedMessage id="alert-center.handle-today" />}
        />
        <Column
          dataIndex="action"
          title={<FormattedMessage id="alert-center.action" />}
          render={() => <span>claim</span>}
        />
      </Table>
    </div>
  );
}
