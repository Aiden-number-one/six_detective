import React, { useState } from 'react';
import { Row, Col, Input, Button, Upload } from 'antd';
import IconFont from '@/components/IconFont';
import styles from '@/pages/AlertCenter/index.less';
import AlertAttachments from './AlertAttachments';
import AlertPhase from './AlertPhase';

const { TextArea } = Input;
const isLt5M = size => size / 1024 / 1024 < 5;

export default function({ loading, onCommit }) {
  const [comment, setComment] = useState('');
  const [upAttachments, setUpAttachements] = useState([]);

  async function handleCommitComment() {
    await onCommit(comment, upAttachments);
    setComment('');
    setUpAttachements([]);
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
    setUpAttachements(fileList);
  }

  function handleRemove(file) {
    setUpAttachements(upAttachments.filter(item => item.uid !== file.uid));
  }

  return (
    <div className={styles['comment-box']}>
      <TextArea
        placeholder="COMMENT"
        className={styles.txt}
        value={comment}
        onChange={({ target: { value } }) => setComment(value)}
      />
      <Row className={styles['comment-commit']} type="flex" align="middle" justify="space-between">
        <Col span={11} offset={1}>
          <AlertPhase postComment={c => setComment(`${comment}${c} `)} />
        </Col>
        <Col span={6} align="right">
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
              {upAttachments.length > 0 && upAttachments.length}
            </span>
          </Upload>
        </Col>
        <Col span={6} align="right">
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
      {!!upAttachments.length && (
        <AlertAttachments
          attachments={upAttachments}
          onRemove={handleRemove}
          onRemoveAll={() => setUpAttachements([])}
        />
      )}
    </div>
  );
}
