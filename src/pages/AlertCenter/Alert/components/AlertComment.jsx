import React from 'react';
import { Row, Col, Popover, Typography } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import IconFont from '@/components/IconFont';
import { timestampFormat } from '@/pages/DataImportLog/constants';
import { AttachmentList } from './AlertDownAttachments';
import styles from '@/pages/AlertCenter/index.less';

const { Paragraph } = Typography;

export default function({
  comment: { id, time, content, user = 'anonymous', files },
  onDownloadAll,
}) {
  const attachments = files ? files.split(',') : [];
  return (
    <li key={id}>
      <Row type="flex" justify="space-between" align="middle">
        <Col className={styles.time}>{moment(time).format(timestampFormat)}</Col>
        <Col>
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
            <em>{attachments.length}</em>
          </Popover>
        </Col>
      </Row>
      <Row>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>
          ({user}){content}
        </Paragraph>
      </Row>
    </li>
  );
}
