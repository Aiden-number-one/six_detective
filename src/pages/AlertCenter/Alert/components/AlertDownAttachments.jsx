import React from 'react';
import { formatMessage } from 'umi/locale';
import { Typography } from 'antd';
import { downloadFile } from '@/pages/DataImportLog/constants';
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

export function AttachmentList({ attachments }) {
  return (
    <ul className={styles['down-attachment-list']}>
      {attachments.map(({ name, url }) => (
        <li key={url}>
          <Text ellipsis style={{ width: '85%' }} title={name}>
            <IconFont
              type={extIconMap[getExt(url)] || extIconMap.default}
              className={styles['file-icon']}
            />
            {url}
          </Text>
          <a download href={`/download?filePath=${url}`}>
            <IconFont type="icondownload" className={styles.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function({ attachments }) {
  function downloadAll(files) {
    files.forEach(({ url }) => {
      downloadFile(url);
    });
  }
  return (
    <div className={styles['alert-attachments']}>
      <div className={styles.title}>
        <span>Attachment ({attachments.length})</span>
        <span className={styles['download-all']} onClick={() => downloadAll(attachments)}>
          {formatMessage({ id: 'alert-center.download-all' })}
        </span>
      </div>
      <AttachmentList attachments={attachments} />
    </div>
  );
}
