import React from 'react';
import Link from 'umi/link';
import { Row, Col, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import styles from '../../index.less';

export function AlertListBtns({
  disabled,
  loading,
  isAuth,
  isBatchAction,
  claimAlerts,
  closeAlerts,
  onExport,
  onDiscontinue,
}) {
  const claimLoading = loading['alertCenter/claim'];
  const exportLoading = loading['alertCenter/exportAlerts'];
  return (
    <Row className={styles.btns} type="flex" justify="space-between" align="middle">
      <Col className={styles['page-name']}>
        <IconFont type="iconring" className={styles.icon} style={{ color: '#0d87d4' }} />
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
          className={claimLoading ? styles.loading : ''}
        >
          {isBatchAction && !disabled && claimLoading ? (
            <Icon type="loading" className={styles['btn-icon']} />
          ) : (
            <IconFont type="icon-claim-small" className={styles['btn-icon']} />
          )}
          <FormattedMessage id="alert-center.claim" />
        </button>
        <button type="button" disabled={disabled} onClick={closeAlerts}>
          <IconFont type="iconclose-circle" className={styles['btn-icon']} />
          <FormattedMessage id="alert-center.close" />
        </button>
        <button
          type="button"
          className={exportLoading ? styles.loading : ''}
          disabled={disabled}
          onClick={onExport}
        >
          {!disabled && exportLoading ? (
            <Icon type="loading" className={styles['btn-icon']} />
          ) : (
            <IconFont type="iconexport" className={styles['btn-icon']} />
          )}
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
