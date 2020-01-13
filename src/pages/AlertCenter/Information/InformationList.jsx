import React, { useState, useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Table, Row, Col, Icon } from 'antd';
import moment from 'moment';
import { timestampFormat, downloadFile } from '@/pages/DataImportLog/constants';
import IconFont from '@/components/IconFont';
import InformationDetail from './InformationDetail';
import styles from '../index.less';

const { Column } = Table;

function InfomationList({ dispatch, infos, infoPage, infoPageSize, total, loading }) {
  const [info, setInfo] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);

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

  function handlePageChange(page, pageSize) {
    dispatch({
      type: 'alertCenter/fetchInfos',
      payload: {
        page,
        pageSize,
      },
    });
  }

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
            <button type="button" disabled={!selectedKeys.length} onClick={handleExport}>
              {loading['alertCenter/exportInfos'] ? (
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
            ellipsis
            width={150}
            dataIndex="informationNo"
            title={<FormattedMessage id="alert-center.information-no" />}
          />
          <Column
            width="24%"
            ellipsis
            dataIndex="informationType"
            title={<FormattedMessage id="alert-center.information-type" />}
          />
          <Column
            align="center"
            dataIndex="timestamp"
            title={<FormattedMessage id="alert-center.information-timestamp" />}
            render={text => moment(text).format(timestampFormat)}
          />
          <Column
            align="center"
            dataIndex="market"
            title={<FormattedMessage id="alert-center.market" />}
          />
          <Column
            dataIndex="submitterCode"
            title={<FormattedMessage id="alert-center.submitter-code" />}
          />
          <Column
            dataIndex="submitterName"
            title={<FormattedMessage id="alert-center.submitter-name" />}
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
