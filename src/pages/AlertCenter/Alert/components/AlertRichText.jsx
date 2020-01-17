import React, { useState } from 'react';
import { Row, Col, Input, Button, Upload } from 'antd';
import IconFont from '@/components/IconFont';
import styles from '@/pages/AlertCenter/index.less';
import AlertPhrase from './AlertPhrase';

const { TextArea } = Input;
const isLt5M = size => size / 1024 / 1024 < 5;

export default function({ loading, upAttachments, onUpload, onCommit }) {
  const [comment, setComment] = useState('');

  async function handleCommitComment() {
    await onCommit(comment, upAttachments);
    setComment('');
  }

  function handleUpAttachments(info) {
    let fileList = [...info.fileList];
    // limit 5 files
    fileList = fileList.slice(-5);
    fileList = fileList.map(file => {
      const { bcjson } = file.response || {};
      const { flag, items = {} } = bcjson || {};

      if (flag === '1' && items) {
        return { url: items.relativeUrl, ...file };
      }
      return file;
    });
    onUpload(fileList);
  }

  return (
    <div className={styles['comment-box']}>
      <TextArea
        placeholder="Comment"
        className={styles.txt}
        value={comment}
        onChange={({ target: { value } }) => setComment(value)}
      />
      <Row className={styles['comment-commit']} type="flex" align="middle" justify="space-between">
        <Col>
          <AlertPhrase postComment={c => setComment(`${comment}${c} `)} />
        </Col>
        <Col>
          <Upload
            multiple
            action="/upload?fileClass=alert_comment"
            beforeUpload={file => isLt5M(file.size)}
            showUploadList={false}
            fileList={upAttachments}
            onChange={handleUpAttachments}
          >
            <span className={styles['up-icon']} title="please select a file">
              <IconFont type="iconbiezhen" />
              {upAttachments.length > 0 && <em>{upAttachments.length}</em>}
            </span>
          </Upload>
          <Button
            type="primary"
            loading={loading}
            disabled={!comment}
            onClick={handleCommitComment}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
}
