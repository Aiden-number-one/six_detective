import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Row } from 'antd';
import MarketLogFilterForm, { defaultTradeDate, defaultMarket } from './MarketLogFilterForm';
import MarketLogManualModal from './MarketLogManualModal';
import MarketLogList from './MarketLogList';

import styles from '../index.less';

function MarketLog({ dispatch, loading, logs, total }) {
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({
    market: defaultMarket,
    tradeDateSt: defaultTradeDate[0],
    tradeDateEt: defaultTradeDate[1],
  });

  useEffect(() => {
    dispatch({
      type: 'market/fetch',
      payload: searchParams,
    });
  }, []);

  function handleParams(type, params) {
    setSearchParams(params);
    if (type === 1) {
      dispatch({ type: 'market/reload', payload: params });
    }
    if (type === 2) {
      dispatch({ type: 'market/importByAuto', payload: params });
    }
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
        <MarketLogFilterForm loading={loading['market/importByAuto']} handleParams={handleParams} />
        <MarketLogManualModal
          visible={visible}
          loading={loading['market/importByManual']}
          handleCancel={() => setVisible(false)}
          handleUpload={handleUpload}
        />
        <div className={styles['list-wrap']}>
          <Row className={styles['btn-group']}>
            <Button type="primary" className={styles['no-margin']} onClick={() => setVisible(true)}>
              <FormattedMessage id="data-import.manual-import" />
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
