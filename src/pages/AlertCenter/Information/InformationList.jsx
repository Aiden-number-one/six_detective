import React, { useState } from 'react';
import Link from 'umi/link';
import { FormattedMessage } from 'umi/locale';
import { Table, Row, Col, Button } from 'antd';
import IconFont from '@/components/IconFont';
import ColumnTitle from '@/pages/AlertCenter/ColumnTitle';
import styles from '../index.less';

const { Column } = Table;

export default function({ dataSource, loading, getInfomation }) {
  const [selectedKeys, setSelectedKeys] = useState([]);

  return (
    <div className={styles.list}>
      <Row className={styles.btns}>
        <Col span={18}>
          <Button disabled={!selectedKeys.length}>
            <IconFont type="iconbatch-export" className={styles['btn-icon']} />
            <FormattedMessage id="alert-center.export" />
          </Button>
        </Col>
        <Col span={6} align="right">
          <Button type="link">
            <Link to="/alert-center">Alert Center</Link>
          </Button>
        </Col>
      </Row>
      <Table
        border
        dataSource={dataSource}
        rowKey="informationNo"
        loading={loading}
        rowSelection={{
          onChange: selectedRowKeys => {
            setSelectedKeys(selectedRowKeys);
          },
        }}
        onRow={record => ({
          onClick() {
            getInfomation(record);
          },
        })}
      >
        <Column
          ellipsis
          width={150}
          dataIndex="informationNo"
          title={
            <ColumnTitle>
              <FormattedMessage id="alert-center.information-no" />
            </ColumnTitle>
          }
        />
        <Column
          align="center"
          dataIndex="informationType"
          title={
            <ColumnTitle>
              <FormattedMessage id="alert-center.information-type" />
            </ColumnTitle>
          }
        />
        <Column
          align="center"
          dataIndex="timestamp"
          title={<FormattedMessage id="alert-center.information-timestamp" />}
        />
        <Column
          align="center"
          dataIndex="market"
          title={<FormattedMessage id="alert-center.market" />}
        />
        <Column
          align="center"
          dataIndex="submitterCode"
          title={<FormattedMessage id="data-import.lop.submitter-code" />}
        />
        <Column
          align="center"
          dataIndex="submitterName"
          title={<FormattedMessage id="data-import.lop.submitter-name" />}
        />
      </Table>
    </div>
  );
}
