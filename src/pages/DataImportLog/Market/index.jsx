import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Row } from 'antd';
import { defaultDateRange, defaultMarket } from '../constants';
import MarketLogManualModal from './MarketLogManualModal';
import FilterForm from '../FilterForm';
import MarketLogList from './MarketLogList';

import styles from '../index.less';

function MarketLog({ dispatch, loading, logs, page: current, total }) {
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({
    market: defaultMarket,
    startDate: defaultDateRange[0],
    endDate: defaultDateRange[1],
  });

  useEffect(() => {
    dispatch({
      type: 'market/fetch',
      payload: searchParams,
    });
  }, []);

  function handleParams(type, params) {
    setSearchParams(params);
    dispatch({ type, payload: params });
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
        <FilterForm formType={1} loading={loading} onParams={handleParams} />
        <MarketLogManualModal
          visible={visible}
          loading={loading['market/importByManual']}
          onCancel={() => setVisible(false)}
          onUpload={handleUpload}
        />
        <div className={styles['list-wrap']}>
          <Row className={styles['btn-group']}>
            <Button type="primary" className={styles['no-margin']} onClick={() => setVisible(true)}>
              <FormattedMessage id="data-import.manual-import" />
            </Button>
          </Row>
          <MarketLogList
            dataSource={logs}
            page={current}
            total={total}
            loading={loading['market/fetch']}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageChange}
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
