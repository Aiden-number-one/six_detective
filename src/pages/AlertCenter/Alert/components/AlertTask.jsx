import React, { useState } from 'react';
import { Drawer, Button, Table } from 'antd';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import styles from '@/pages/AlertCenter/index.less';

const { Column } = Table;

function AlertTaskModal({ visible, handleCancel }) {
  function handleCommit() {}
  return (
    <Drawer
      title={<FormattedMessage id="alert-center.assign" />}
      width={320}
      visible={visible}
      closable={false}
      onClose={handleCancel}
    >
      <div className={styles['bottom-btns']}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button type="primary" onClick={handleCommit}>
          Commit
        </Button>
      </div>
    </Drawer>
  );
}

export default function({ loading, dataSource /* total, handleChange */ }) {
  const [visible, setVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);

  return (
    <>
      <AlertTaskModal visible={visible} handleCancel={() => setVisible(false)} />
      <Button
        style={{ marginBottom: 10 }}
        disabled={!selectedKeys.length}
        onClick={() => setVisible(true)}
      >
        <FormattedMessage id="alert-center.assign" />
      </Button>
      <Table
        border
        dataSource={dataSource}
        rowKey="ALERT_ID"
        scroll={{ y: 320 }}
        loading={loading}
        pagination={{
          // total,
          showSizeChanger: true,
          showTotal(count) {
            return `Total ${count} items`;
          },
          // onChange: (page, pageSize) => handleChange(page, pageSize),
          // onShowSizeChange: (page, pageSize) => handleChange(page, pageSize),
        }}
        rowSelection={{
          onChange: selectedRowKeys => {
            setSelectedKeys(selectedRowKeys);
          },
        }}
      >
        <Column
          align="center"
          dataIndex="MARKET"
          title={<FormattedMessage id="alert-center.market" />}
        />
        <Column
          align="center"
          dataIndex="EP_CODE"
          title={<FormattedMessage id="alert-center.ep-code" />}
        />
        <Column dataIndex="EP_NAME" title={<FormattedMessage id="alert-center.ep-name" />} />
        <Column dataIndex="OWNER_ID" title={<FormattedMessage id="alert-center.owner" />} />
        <Column
          align="center"
          dataIndex="STATUS"
          title={<FormattedMessage id="alert-center.status" />}
        />
        <Column
          align="center"
          dataIndex="action"
          title={<FormattedMessage id="alert-center.action" />}
          render={() => (
            <Link to="/system-management/workflow-design" style={{ fontSize: 12 }}>
              <FormattedMessage id="alert-center.enter-workflow" />
            </Link>
          )}
        />
      </Table>
    </>
  );
}
