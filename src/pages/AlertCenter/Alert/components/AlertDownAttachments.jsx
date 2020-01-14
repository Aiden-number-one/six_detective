import React from 'react';
import { formatMessage } from 'umi/locale';
import { Typography } from 'antd';
import IconFont from '@/components/IconFont';
import styles from '@/pages/AlertCenter/index.less';

const { Text } = Typography;

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

const getExt = (filename = '') => {
  const index = filename.lastIndexOf('.');
  return filename.substr(index + 1);
};

const getFileName = url => {
  const l = url.split('/');
  return l.slice(-1)[0];
};

export function AttachmentList({ attachments }) {
  return (
    <ul className={styles['down-attachment-list']}>
      {attachments.map(url => (
        <li key={url}>
          <Text ellipsis style={{ width: '85%' }} title={getFileName(url)}>
            <IconFont
              type={extIconMap[getExt(url)] || extIconMap.default}
              className={styles['file-icon']}
            />
            {getFileName(url)}
          </Text>
          <a download href={`/download?filePath=${url}`}>
            <IconFont type="icondownload" className={styles.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function({ attachments, onDownloadAll }) {
  return (
    <div className={styles['alert-attachments']}>
      <div className={styles.title}>
        <span>Attachment ({attachments.length})</span>
        <span className={styles['download-all']} onClick={onDownloadAll}>
          {formatMessage({ id: 'alert-center.download-all' })}
        </span>
      </div>
      <AttachmentList attachments={attachments.map(({ url }) => url)} />
    </div>
  );
}
