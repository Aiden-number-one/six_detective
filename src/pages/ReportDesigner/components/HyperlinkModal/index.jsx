/*
 * @Author: liangchaoshun
 * @Email: liangchaoshun@szkingdom.com
 * @Date: 2020-01-13 20:28:07
 * @LastEditors  : liangchaoshun
 * @LastEditTime : 2020-01-13 22:43:52
 * @Description: 超链接的模态框
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Modal, Input } from 'antd';
import less from './index.less';

@connect(({ reportDesigner }) => ({
  showHylModal: reportDesigner.showHylModal,
}))
class HyperlinkModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hylContentValue: '', // 输入超文本要显示的内容以校验
      hylLinkValue: '', // 输入超文本链接
      hylEmptyVal: false, // 超文本内容为空，提示错误
    };
  }

  // 把超链接的 内容|地址 的初始值放到到 Input
  componentDidUpdate(prevProps) {
    const { initContentVal: prevContentVal, initLinkVal: prevLink } = prevProps;
    const { initContentVal: currContentVal, initLinkVal: currLink } = this.props;
    if (prevContentVal !== currContentVal || prevLink !== currLink) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hylContentValue: currContentVal, hylLinkValue: currLink });
    }
  }

  // 显示或隐藏处理超链接的模态框
  showOrHideHylModal = bool => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportDesigner/triggerHylModal',
      payload: { showHylModal: bool },
    });
  };

  // 超链接模态框：确认
  hylConfirm = () => {
    console.log('hylConfirm');
    const { hylContentValue } = this.state;
    if (hylContentValue.trim() === '') {
      this.setState({ hylEmptyVal: true });
      return;
    }
    this.showOrHideHylModal(false);
  };

  // 超链接模态框：取消
  hylCancel = () => {
    this.setState({ hylEmptyVal: false });
    this.showOrHideHylModal(false);
  };

  // 超链接：要显示的内容
  hylContentChange = ev => {
    const { value } = ev.target;
    this.setState({ hylContentValue: value });
  };

  // 超链接：链接的地址
  hylLinkChange = ev => {
    const { value } = ev.target;
    this.setState({ hylLinkValue: value });
  };

  render() {
    const { showHylModal } = this.props;
    const { hylContentValue, hylLinkValue, hylEmptyVal } = this.state;

    return (
      <>
        <Modal
          width={500}
          closable={false}
          okText="Confirm"
          title="Hyperlink"
          visible={showHylModal}
          onOk={this.hylConfirm}
          onCancel={this.hylCancel}
          wrapClassName={less['hyperlink-modal']}
        >
          <div>
            <span>Display content:</span>
            <Input
              value={hylContentValue}
              onChange={this.hylContentChange}
              className={`${hylEmptyVal ? less['hyl-empty-error'] : ''}`}
            />
          </div>
          <div className={less['link-addr']}>
            <span>Link:</span>
            <Input onChange={this.hylLinkChange} value={hylLinkValue} />
          </div>
        </Modal>
      </>
    );
  }
}

export default HyperlinkModal;
