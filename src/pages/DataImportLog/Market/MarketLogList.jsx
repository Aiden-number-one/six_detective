import React from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'umi/locale';

const { Column } = Table;

export default function({ dataSource }) {
  return (
    <Table dataSource={dataSource}>
      <Column
        dataIndex="tradeDate"
        title={<FormattedMessage id="data-import.market.trade-date" />}
      />
      <Column dataIndex="market" title={<FormattedMessage id="data-import.market.market" />} />
      <Column dataIndex="fileType" title={<FormattedMessage id="data-import.market.file-type" />} />
      <Column
        dataIndex="uploadDate"
        title={<FormattedMessage id="data-import.market.upload-date" />}
      />
      <Column
        dataIndex="uploadChannel"
        title={<FormattedMessage id="data-import.market.upload-channel" />}
      />
      <Column dataIndex="status" title={<FormattedMessage id="data-import.market.status" />} />
      <Column
        dataIndex="description"
        title={<FormattedMessage id="data-import.market.description" />}
      />
      <Column dataIndex="download" title={<FormattedMessage id="data-import.market.download" />} />
    </Table>
  );
}
