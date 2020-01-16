import React from 'react';
import { Row, Col, Popover, Typography } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import IconFont from '@/components/IconFont';
import { timestampFormat } from '@/pages/DataImportLog/constants';
import { AttachmentList } from './AlertDownAttachments';
import styles from '@/pages/AlertCenter/index.less';
import approvalStyles from '@/pages/ApprovalProcessCenter/index.less';

const { Paragraph } = Typography;

function AlertAttachmentPop({ attachments, onDownloadAll }) {
  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      overlayClassName={styles['comment-attachment-container']}
      title={
        <div className={styles.title}>
          <FormattedMessage id="alert-center.attachement-list" />
          <IconFont
            type="icondownload-all"
            title="Download All"
            className={styles['download-all']}
            onClick={onDownloadAll}
          />
        </div>
      }
      content={<AttachmentList attachments={attachments} />}
    >
      <span style={{ cursor: 'pointer' }}>
        <IconFont type="iconbiezhen" />
        <em>{attachments.length}</em>
      </span>
    </Popover>
  );
}

export default function({
  comment: { id, time, content, user = 'anonymous', files },
  onDownloadAll,
}) {
  const attachments = files ? files.split(',') : [];
  return (
    <li key={id}>
      <Row type="flex">
        <Paragraph title={`(${user})${content}`} ellipsis={{ rows: 2, expandable: false }}>
          ({user}){content.substring(0, 66)}
          {content.length > 66 ? '...' : ''}
        </Paragraph>
        {attachments.length > 0 && (
          <Col className={approvalStyles.attachmentsBox}>
            <AlertAttachmentPop attachments={attachments} onDownloadAll={onDownloadAll} />
          </Col>
        )}
      </Row>
      <Row className={approvalStyles.attachmentsTimeBox}>
        <Col className={approvalStyles.time}>{moment(time).format(timestampFormat)}</Col>
      </Row>
    </li>
  );
}
