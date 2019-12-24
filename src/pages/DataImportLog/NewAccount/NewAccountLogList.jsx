import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';

const { Column } = Table;

const aLink = document.createElement('a');
aLink.download = true;

function NewAccountLogList({ dispatch, loading, logs, total, reportUrl }) {
  const [curImpId, setImpId] = useState('');
  useEffect(() => {
    dispatch({
      type: 'new_account/fetch',
    });
  }, []);
  async function handleDownload(lopImpId) {
    await dispatch({
      type: 'new_account/fetchReportUrl',
      payload: {
        lopImpId,
      },
    });
    aLink.href = `/download?filePath=${reportUrl}`;
    aLink.click();
  }
  function handleClick(id) {
    setImpId(id);
    handleDownload(id);
  }
  function handlePageChange(page, pageSize) {
    dispatch({ type: 'new_account/reload', payload: { page, pageSize } });
  }
  return (
    <Table
      dataSource={logs}
      loading={loading['new_account/fetch']}
      rowKey="mdImpId"
      pagination={{
        total,
        pageSizeOptions: ['10', '20', '50', '100'],
        showSizeChanger: true,
        showTotal(count) {
          return `Total ${count} items`;
        },
        onChange(page, pageSize) {
          handlePageChange(page, pageSize);
        },
        onShowSizeChange(page, pageSize) {
          handlePageChange(page, pageSize);
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
        dataIndex="submissionStatus"
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
export default connect(({ loading, new_account: { logs, page, total, reportUrl } }) => ({
  loading: loading.effects,
  logs,
  page,
  total,
  reportUrl,
}))(NewAccountLogList);
