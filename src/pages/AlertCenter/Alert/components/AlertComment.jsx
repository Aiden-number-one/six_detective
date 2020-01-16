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
        <Col className={approvalStyles.attachmentsBox}>
          {attachments.length > 0 && (
            <Popover
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
              <IconFont type="iconbiezhen" />
              <em className={approvalStyles.num}>{attachments.length}</em>
            </Popover>
          )}
        </Col>
      </Row>
      <Row className={approvalStyles.attachmentsTimeBox}>
        {/* <Paragraph ellipsis={{ rows: 3, expandable: true }}>
          ({user}){content}
        </Paragraph> */}
        <Col className={approvalStyles.time}>{moment(time).format(timestampFormat)}</Col>
      </Row>
    </li>
  );
}
