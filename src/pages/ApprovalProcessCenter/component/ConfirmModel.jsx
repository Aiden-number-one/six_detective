import React from 'react';
import { Modal } from 'antd';

export function ConfirmModel({ title, confirmVisible, comfirm, content, closeModel }) {
  return (
    <Modal title={title} visible={confirmVisible} onOk={comfirm} onCancel={closeModel}>
      <p>{content}</p>
    </Modal>
  );
}
