/*
 * @Author: liangchaoshun
 * @Email: liangchaoshun@szkingdom.com
 * @Date: 2020-01-13 20:28:07
 * @LastEditors  : liangchaoshun
 * @LastEditTime : 2020-01-16 10:02:35
 * @Description: 超链接的模态框
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Form, Modal, Input } from 'antd';
import { setCellTypeAndValue } from '../../utils';
import less from './index.less';

@connect(({ reportDesigner }) => ({
  showHylModal: reportDesigner.showHylModal,
  cellPosition: reportDesigner.cellPosition,
}))
@Form.create({ name: 'hyperlink_modal' })
class HyperlinkModal extends PureComponent {
  // 把超链接的 内容|地址 的初始值放到到 Input
  componentDidUpdate(prevProps) {
    const { initContentVal: prevContentVal, initLinkVal: prevLink } = prevProps;
    const { initContentVal: currContentVal, initLinkVal: currLink } = this.props;
    if (prevContentVal !== currContentVal || prevLink !== currLink) {
      const {
        form: { setFieldsValue },
      } = this.props;
      // eslint-disable-next-line react/no-did-update-set-state
      setFieldsValue({ hylContentValue: currContentVal, hylLinkValue: currLink });
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
    const {
      cellPosition,
      setCellStyle,
      dispatch,
      form: { validateFields, setFieldsValue },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const { hylContentValue, hylLinkValue } = values;
        setCellTypeAndValue({
          type: 'hyperlink',
          value: `${hylContentValue},${hylLinkValue}`,
          cellPosition,
        });
        setCellStyle('underline', true); // 添加样式
        setCellStyle('color', 'rgb(26,26,255)'); // 添加颜色
        this.showOrHideHylModal(false); // 隐藏 modal
        setFieldsValue({ hylContentValue: '', hylLinkValue: '' }); // 清空
        dispatch({
          type: 'reportDesigner/modifyTemplateArea',
          payload: {
            elementType: 'link', // 单元格类型
            link: hylLinkValue,
          },
        });
      }
    });
  };

  // 超链接模态框：取消
  hylCancel = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ hylContentValue: '', hylLinkValue: '' }); // 清空

    this.showOrHideHylModal(false);
  };

  render() {
    const {
      showHylModal,
      form: { getFieldDecorator },
    } = this.props;
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
          <Form layout="vertical">
            <Form.Item label="Display content">
              {getFieldDecorator('hylContentValue', {
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: 'Please input what you want to show',
                  },
                ],
              })(<Input placeholder="Please input the content" />)}
            </Form.Item>
            <Form.Item label="Link">
              {getFieldDecorator('hylLinkValue', {
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: 'Please input a link address',
                  },
                  {
                    pattern: /^https?:\/\/(www\.)?.+\.com.*$/,
                    message: 'Please input a link',
                  },
                ],
              })(<Input placeholder="Please start with http(s)://" />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default HyperlinkModal;
