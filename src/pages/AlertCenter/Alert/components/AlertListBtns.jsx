import React from 'react';
import Link from 'umi/link';
import { Table, Row, Col, Icon } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import styles from '../../index.less';

export function AlertListBtns({
  disabled,
  loading,
  isAuth,
  isBatchAction,
  claimAlerts,
  closeAlerts,
  exportAlerts,
  closeAlertsByAdmin,
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
          className={loading['alertCenter/claim'] ? styles.loading : ''}
        >
          {isBatchAction && !disabled && loading['alertCenter/claim'] ? (
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
            onClick={closeAlertsByAdmin}
          >
            <IconFont type="iconclose-circle" className={styles['btn-icon']} />
            <FormattedMessage id="alert-center.discontinue" />
          </button>
        )}
      </Col>
    </Row>
  );
}
