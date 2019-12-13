import React, { useState } from 'react';
import { Row, Col, Input, Button, Upload } from 'antd';
import IconFont from '@/components/IconFont';
import styles from '@/pages/AlertCenter/index.less';
import AlertAttachments from './AlertAttachments';
import AlertPhase from './AlertPhase';

const { TextArea } = Input;

export default function({ loading, commitComment }) {
  const [comment, setComment] = useState('');
  const [upAttachments, setUpAttachements] = useState([]);

  async function handleCommitComment() {
    await commitComment(comment);
    setComment('');
  }

  function handleUpAttachments(info) {
    let fileList = [...info.fileList];
    // limit 5 files
    fileList = fileList.slice(-5);
    setUpAttachements(fileList);
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
          <Upload showUploadList={false} fileList={upAttachments} onChange={handleUpAttachments}>
            <IconFont
              type="iconbiezhen"
              style={{ cursor: 'pointer', marginRight: 4 }}
              title="please select a file"
            />
            {upAttachments.length > 0 && upAttachments.length}
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
      {!!upAttachments.length && <AlertAttachments attachments={upAttachments} />}
    </div>
  );
}
