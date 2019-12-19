import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Row } from 'antd';
import MarketLogFilterForm from './MarketLogFilterForm';
import MarketLogManualModal from './MarketLogManualModal';
import MarketLogList from './MarketLogList';
import { yesterday, today } from '../constants';
import styles from '../index.less';

const format = 'YYYYMMDD';

function MarketLog({ dispatch, loading, logs, total }) {
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    dispatch({
      type: 'market/fetch',
      payload: {
        tradeDateSt: yesterday.format(format),
        tradeDateEt: today.format(format),
      },
    });
  }, []);

  function handleSearch(params) {
    setSearchParams(params);
    dispatch({ type: 'market/reload', payload: params });
  }

  function handlePageChange(page, pageSize) {
    dispatch({ type: 'market/reload', payload: { page, pageSize, ...searchParams } });
  }

  async function handleUpload(params) {
    await dispatch({ type: 'market/importByManual', payload: params });
    setVisible(false);
  }
  return (
    <PageHeaderWrapper>
      <div className={styles.container}>
        <MarketLogFilterForm handleSearch={handleSearch} />
        <MarketLogManualModal
          visible={visible}
          handleCancel={() => setVisible(false)}
          handleUpload={handleUpload}
        />
        <div className={styles['list-wrap']}>
          <Row className={styles['btn-group']}>
            <Button
              type="primary"
              onClick={() => dispatch({ type: 'market/importByAuto' })}
              loading={loading['market/importByAuto']}
            >
              <FormattedMessage id="data-import.lop.auto-import" />
            </Button>
            <Button type="primary" className={styles['no-margin']} onClick={() => setVisible(true)}>
              <FormattedMessage id="data-import.lop.manual-import" />
            </Button>
          </Row>
          <MarketLogList
            dataSource={logs}
            total={total}
            loading={loading['market/fetch']}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageChange}
          />
        </div>
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ loading, market: { logs, page, total } }) => ({
  loading: loading.effects,
  logs,
  page,
  total,
}))(MarketLog);
