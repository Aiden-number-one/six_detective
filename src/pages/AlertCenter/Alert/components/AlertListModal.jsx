import React from 'react';
import { Modal } from 'antd';

export function ClaimModal({ visible, onCancel, onOk, loading, content }) {
  return (
    <Modal
      title="CONFIRM"
      visible={visible}
      closable={false}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={loading}
    >
      <div style={{ textAlign: 'center' }}>
        {content}
        <div>Do you confirm to re-claim?</div>
      </div>
    </Modal>
  );
}

export function CloseModal({ visible, onCancel, loading, onOk, content }) {
  return (
    <Modal
      title="CONFIRM"
      visible={visible}
      closable={false}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={loading}
    >
      <div style={{ textAlign: 'center' }}>{content}</div>
    </Modal>
  );
}

export function ExportModal({ visible, onCancel, loading, onOk }) {
  return (
    <Modal
      title="EXPORT"
      visible={visible}
      closable={false}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={loading}
    >
      <div style={{ textAlign: 'center' }}>111</div>
    </Modal>
  );
}
