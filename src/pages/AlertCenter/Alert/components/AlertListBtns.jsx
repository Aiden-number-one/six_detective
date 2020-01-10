import React from 'react';
import Link from 'umi/link';
import { Table, Row, Col, Icon } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import styles from '../../index.less';

export function AlertListBtns({
  disabled,
  loading,
  isBatchAction,
  isAuth,
  claimAlerts,
  closeAlerts,
  exportAlerts,
  onDiscontinue,
}) {
  return (
    <Row className={styles.btns} type="flex" justify="space-between" align="middle">
      <Col className={styles['page-name']}>
        <IconFont type="icon-alertmanagement" className={styles.icon} />
        <span>Alert Center</span>
      </Col>
      <Col>
        <Link to="/homepage/information" className={styles.info}>
          Information
        </Link>
        <button
          type="button"
          disabled={disabled}
          onClick={claimAlerts}
          className={loading ? styles.loading : ''}
        >
          {isBatchAction && !disabled && loading ? (
            <Icon type="loading" className={styles['btn-icon']} />
          ) : (
            <IconFont type="iconqizhi" className={styles['btn-icon']} />
          )}

          <FormattedMessage id="alert-center.claim" />
        </button>
        <button type="button" disabled={disabled} onClick={closeAlerts}>
          <IconFont type="iconclose-circle" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.close" />
        </button>
        <button type="button" disabled={disabled} onClick={exportAlerts}>
          <IconFont type="iconexport" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.export" />
        </button>
        {isAuth && (
          <button
            type="button"
            className={styles.discontinue}
            disabled={disabled}
            onClick={onDiscontinue}
          >
            <IconFont type="iconclose-circle" className={styles['btn-icon']} />
            <FormattedMessage id="alert-center.discontinue" />
          </button>
        )}
      </Col>
    </Row>
  );
}
