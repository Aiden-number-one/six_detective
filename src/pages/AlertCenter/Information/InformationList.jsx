import React, { useState, useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Table, Row, Col, Icon } from 'antd';
import moment from 'moment';
import { timestampFormat, downloadFile } from '@/pages/DataImportLog/constants';
import IconFont from '@/components/IconFont';
import ColumnTitle, { useColumnFilter } from '../ColumnTitle';
import InformationDetail from './InformationDetail';
import styles from '../index.less';

const { Column } = Table;

function InfomationList({ dispatch, infos, infoPage, infoPageSize, total, loading }) {
  const [info, setInfo] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);

  // header filter
  const { handlePageChange, getTitleProps } = useColumnFilter({
    dispatch,
    tableName: 'slop_biz.v_info',
    action: 'alertCenter/fetchInfos',
    page: infoPage,
    pageSize: infoPageSize,
  });

  const exportLoading = loading['alertCenter/exportInfos'];

  useEffect(() => {
    dispatch({
      type: 'alertCenter/fetchInfos',
    });
  }, []);

  useEffect(() => {
    if (infos && infos.length > 0) {
      const [firstInfo] = infos;
      const curInfo = info && infos.find(item => item.informationNo === info.informationNo);
      // should be latest info,owner and status has been changed
      setInfo(curInfo || firstInfo);
    } else {
      setInfo(null);
    }
  }, [infos]);

  async function handleExport() {
    const url = await dispatch({
      type: 'alertCenter/exportInfos',
      payload: {
        infoId: selectedKeys,
      },
    });
    if (url) {
      downloadFile(url);
    }
  }
  return (
    <div className={styles['list-container']}>
      <div className={styles.list}>
        <Row className={styles.btns} type="flex" justify="space-between" align="middle">
          <Col className={styles['page-name']}>
            <Icon type="exclamation-circle" className={styles.icon} />
            <span>Information</span>
          </Col>
          <Col>
            <Link to="/homepage/alert-center" className={styles.info}>
              Alert Center
            </Link>
            <button
              type="button"
              className={exportLoading ? styles.loading : ''}
              disabled={!selectedKeys.length}
              onClick={handleExport}
            >
              {exportLoading ? (
                <Icon type="loading" className={styles['btn-icon']} />
              ) : (
                <IconFont type="iconexport" className={styles['btn-icon']} />
              )}
              <FormattedMessage id="alert-center.export" />
            </button>
          </Col>
        </Row>
        <Table
          dataSource={infos}
          rowKey="informationNo"
          loading={loading['alertCenter/fetchInfos']}
          rowClassName={record => {
            if (info && record.informationNo === info.informationNo) {
              return 'table-active';
            }
            return '';
          }}
          rowSelection={{
            columnWidth: 50,
            onChange: selectedRowKeys => {
              setSelectedKeys(selectedRowKeys);
            },
          }}
          pagination={{
            total,
            current: infoPage,
            pageSize: infoPageSize,
            showSizeChanger: true,
            showTotal(count) {
              return `Total ${count} items`;
            },
            onChange: (page, pageSize) => handlePageChange(page, pageSize),
            onShowSizeChange: (page, pageSize) => handlePageChange(page, pageSize),
          }}
          onRow={record => ({
            onClick() {
              setInfo(record);
            },
          })}
        >
          <Column
            width={50}
            ellipsis
            dataIndex="no"
            title="No."
            render={(text, record, index) => (infoPage - 1) * infoPageSize + index + 1}
          />
          <Column
            width={150}
            dataIndex="informationNo"
            title={
              <ColumnTitle {...getTitleProps('informationNo')}>
                <FormattedMessage id="alert-center.information-no" />
              </ColumnTitle>
            }
          />
          <Column
            width="20%"
            ellipsis
            dataIndex="informationType"
            title={
              <ColumnTitle {...getTitleProps('informationType')}>
                <FormattedMessage id="alert-center.information-type" />
              </ColumnTitle>
            }
          />
          <Column
            align="center"
            dataIndex="timestamp"
            render={text => moment(text).format(timestampFormat)}
            title={
              <ColumnTitle {...getTitleProps('timestamp')}>
                <FormattedMessage id="alert-center.information-timestamp" />
              </ColumnTitle>
            }
          />
          <Column
            align="center"
            dataIndex="market"
            title={
              <ColumnTitle {...getTitleProps('market')}>
                <FormattedMessage id="alert-center.market" />
              </ColumnTitle>
            }
          />
          <Column
            dataIndex="submitterCode"
            title={
              <ColumnTitle {...getTitleProps('submitterCode')}>
                <FormattedMessage id="alert-center.submitter-code" />
              </ColumnTitle>
            }
          />
          <Column
            dataIndex="submitterName"
            title={
              <ColumnTitle {...getTitleProps('submitterName')}>
                <FormattedMessage id="alert-center.submitter-name" />
              </ColumnTitle>
            }
          />
        </Table>
      </div>
      {info && <InformationDetail info={info} />}
    </div>
  );
}

const mapStateToProps = ({
  loading,
  alertCenter: { infos, infoPage, infoPageSize, infoTotal },
}) => ({
  infos,
  infoPage,
  infoPageSize,
  total: infoTotal,
  loading: loading.effects,
});
export default connect(mapStateToProps)(InfomationList);
