import React from 'react';
import { Row, Col, Popover, Typography } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import IconFont from '@/components/IconFont';
import { timestampFormat, downloadFile } from '@/pages/DataImportLog/constants';
import styles from '@/pages/AlertCenter/index.less';

const { Paragraph, Text } = Typography;

const getExt = filename => {
  const index = filename.lastIndexOf('.');
  return filename.substr(index + 1);
};

const extIconMap = {
  png: 'iconimage',
  jpg: 'iconimage',
  jpeg: 'iconimage',
  xls: 'iconxls',
  xlsx: 'iconxls',
  doc: 'iconword',
  docx: 'iconword',
  pdf: 'iconPDF',
  default: 'iconfile',
};

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
      content={
        <ul className={styles['attachment-list']}>
          {attachments.map(({ name, url }) => (
            <li key={url}>
              <Text ellipsis style={{ width: '85%' }} title={name}>
                <IconFont
                  type={extIconMap[getExt(url)] || extIconMap.default}
                  className={styles['file-icon']}
                />
                {name}
              </Text>
              <a download href={`/download?filePath=${url}`}>
                <IconFont type="icondownload" className={styles.icon} />
              </a>
            </li>
          ))}
        </ul>
      }
    >
      <IconFont type="iconbiezhen" />
      {attachments.length}
    </Popover>
  );
}

export default function({ comment: { id, commitTime, commentContent, fileList } }) {
  let attachments = fileList ? fileList.split(',') : [];
  attachments = attachments.map(file => {
    const l = file.split('/');
    const f = l.slice(-1)[0];
    return {
      name: f,
      url: file,
    };
  });
  return (
    <li key={id}>
      <Row>
        <Col span={18} style={{ color: '#0D87D4' }}>
          {moment(commitTime).format(timestampFormat)}
        </Col>
        <Col span={5} offset={1} align="right">
          {attachments.length > 0 && <AlertAttachmentPop attachments={attachments} />}
        </Col>
      </Row>
      <Row>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>{commentContent}</Paragraph>
      </Row>
    </li>
  );
}
