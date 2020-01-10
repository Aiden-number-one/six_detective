import React from 'react';
import { Row, Col, Popover, Typography } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import IconFont from '@/components/IconFont';
import { timestampFormat, downloadFile } from '@/pages/DataImportLog/constants';
import styles from '@/pages/AlertCenter/index.less';
import { AttachmentList } from './AlertDownAttachments';

const { Paragraph } = Typography;

function AlertAttachmentPop({ attachments }) {
  function downloadAll(files) {
    files.forEach(({ url }) => {
      downloadFile(url);
    });
  }
  return (
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
            onClick={() => downloadAll(attachments)}
          />
        </div>
      }
      content={<AttachmentList attachments={attachments} />}
    >
      <IconFont type="iconbiezhen" />
      <em>{attachments.length}</em>
    </Popover>
  );
}

export default function({ comment: { id, commitTime, commentContent, fileList } }) {
  const attachments = fileList ? fileList.split(',') : [];
  return (
    <li key={id}>
      <Row type="flex" justify="space-between" align="middle">
        <Col className={styles.time}>{moment(commitTime).format(timestampFormat)}</Col>
        <Col>
          {attachments.length > 0 && (
            <AlertAttachmentPop attachments={attachments.map(url => ({ url }))} />
          )}
        </Col>
      </Row>
      <Row>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{commentContent}</Paragraph>
      </Row>
    </li>
  );
}
