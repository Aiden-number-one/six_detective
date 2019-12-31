import React, { useState } from 'react';
import { Table, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import { pageSizeOptions } from '../constants';

const { Column } = Table;

export default function NewAccountLogList({
  dataSource,
  loading,
  page: current,
  total,
  onPageChange,
  onPageSizeChange,
  onDownload,
}) {
  const [curImpId, setImpId] = useState('');

  function handleClick(id) {
    setImpId(id);
    onDownload(id);
  }
  return (
    <Table
      dataSource={dataSource}
      loading={loading['new_account/fetch']}
      rowKey="lopImpId"
      pagination={{
        current,
        total,
        pageSizeOptions,
        showSizeChanger: true,
        showTotal(count) {
          return `Total ${count} items`;
        },
        onChange(page, pageSize) {
          onPageChange(page, pageSize);
        },
        onShowSizeChange(page, pageSize) {
          onPageSizeChange(page, pageSize);
        },
      }}
    >
      <Column
        align="center"
        dataIndex="market"
        title={<FormattedMessage id="data-import.market" />}
      />
      <Column
        align="center"
        dataIndex="submitterCode"
        title={<FormattedMessage id="data-import.submitter-code" />}
      />
      <Column
        dataIndex="fileName"
        title={<FormattedMessage id="data-import.new-account.file-name" />}
      />
      <Column
        align="center"
        dataIndex="statusMark"
        title={<FormattedMessage id="data-import.submission-status" />}
      />
      <Column
        align="center"
        dataIndex="download"
        title={<FormattedMessage id="data-import.download" />}
        render={(text, { lopImpId }) => (
          <>
            {loading['lop/fetchReportUrl'] && lopImpId === curImpId ? (
              <Icon type="loading" />
            ) : (
              <IconFont
                type="icondownload"
                onClick={() => handleClick(lopImpId)}
                style={{ fontSize: 24, cursor: 'pointer' }}
              />
            )}
          </>
        )}
      />
    </Table>
  );
}
