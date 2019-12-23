import React from 'react';
import { Row, Col, Popover, Typography } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import IconFont from '@/components/IconFont';

const { Paragraph, Text } = Typography;

function AlertAttachmentPop({ attachments }) {
  return (
    <Popover
      placement="bottomRight"
      title={<FormattedMessage id="alert-center.attachement-list" />}
      content={
        <Row style={{ padding: '6px 14px', width: 240, maxHeight: 150, overflowY: 'auto' }}>
          {attachments.map(({ name, url }, index) => (
            <Col key={url}>
              <Text ellipsis style={{ width: '100%' }} title={name}>
                <a download href={`/download?filePath=${url}`} style={{ marginBottom: 20 }}>
                  {index + 1}. {name}
                </a>
              </Text>
            </Col>
          ))}
        </Row>
      }
    >
      <IconFont type="iconbiezhen" />
      {attachments.length}
    </Popover>
  );
}

export default function({
  comment: { id, commentTime, commentContent, commentUserName, attachment },
}) {
  let attachments = attachment ? attachment.split(',') : [];
  const time = moment(commentTime).format('DD-MMM-YYYY HH:mm:ss');
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
          {time}
        </Col>
        <Col span={5} offset={1} align="right">
          {attachments.length > 0 && <AlertAttachmentPop attachments={attachments} />}
        </Col>
      </Row>
      <Row>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>
          {commentContent}({commentUserName})
        </Paragraph>
      </Row>
    </li>
  );
}
