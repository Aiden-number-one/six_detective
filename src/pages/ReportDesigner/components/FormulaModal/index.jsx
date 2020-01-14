/*
 * @Author: liangchaoshun
 * @Email: liangchaoshun@szkingdom.com
 * @Date: 2020-01-13 20:54:47
 * @LastEditors  : liangchaoshun
 * @LastEditTime : 2020-01-13 22:44:16
 * @Description: 公式输入的模态框
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, Input } from 'antd';
import { setCellTypeAndValue } from '../../utils';

import less from './index.less';

// 公式集
const formularSet = [
  { name: 'SUM', type: 'Math and Tig', desc: 'SUM(number1, number2,...)' },
  { name: 'MAX', type: 'Math and Tig', desc: 'MAX(number1, number2,...)' },
  { name: 'AVERAGE', type: 'Statistical', desc: 'AVERAGE(number1, number2,...)' },
];

@connect(({ reportDesigner }) => ({
  showFmlModal: reportDesigner.showFmlModal,
  cellPosition: reportDesigner.cellPosition,
}))
class HyperlinkModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formularValue: '', // 输入公式以校验
      formularCheckLoading: false, // 校验公式格式时 loading
      formularSearchValue: '', // 输入公式以搜索
      fmlFormatErr: false, // 公式格式错误
      currFormulaArr: [], // 当前展示的公式集
      currFmlTypeIndex: -1, // 当前选中的公式类
      formularDesc: '', // 当前选中公式的描述
    };

    this.formulaInputRef = React.createRef();
  }

  // 把公式的初始值放到到 Input
  componentDidUpdate(prevProps) {
    const { initVal: prevVal } = prevProps;
    const { initVal: currVal } = this.props;
    // eslint-disable-next-line react/no-did-update-set-state
    if (prevVal !== currVal) this.setState({ formularValue: currVal });
  }

  // 显示或隐藏处理公式的模态框
  showOrHideFormulaModal = bool => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportDesigner/triggerFmlModal',
      payload: { showFmlModal: bool },
    });
  };

  // 公式模态框：确认
  fmlConfirm = () => {
    const { cellPosition } = this.props;
    const { formularValue } = this.state;
    this.checkFormularFormat(() => {
      // 验证格式
      const fmlInputInst = this.formulaInputRef.current;
      const fmlFormatErr = fmlInputInst.props.className.includes(less['formula-format-error']);
      const refineFmlValue = /^=/.test(formularValue) ? formularValue : `=${formularValue}`;
      // console.log('fmlConfirm -> ', refineFmlValue, cellPosition, fmlFormatErr);
      if (!fmlFormatErr) {
        this.showOrHideFormulaModal(false);
        setCellTypeAndValue({ type: 'formula', value: refineFmlValue, cellPosition });
        this.setState({ formularValue: '', formularSearchValue: '' });
      }
    });
  };

  // 公式模态框：取消
  fmlCancel = () => {
    // console.log('fmlCancel');
    this.showOrHideFormulaModal(false);
  };

  // 公式输入框
  formulaInputChange = ev => {
    const { value: formularValue } = ev.target;
    this.setState({ formularValue });
  };

  // 校验公式格式
  checkFormularFormat = callback => {
    const { formularValue } = this.state;
    const formulaRegExp = /^=?[A-Z]+\(.*\)$/; // 公式的整体校验正则
    this.setState({ formularCheckLoading: true }, () => {
      const bool = formulaRegExp.test(formularValue); // 格式校验结果
      // console.log('checkFormularFormat -> ', formularValue, bool);
      this.setState(
        {
          fmlFormatErr: !bool,
          formularCheckLoading: false,
        },
        () => {
          if (typeof callback === 'function') callback();
        },
      );
    });
  };

  // 输入搜索公式
  formularSearchInputChange = ev => {
    const { value } = ev.target;
    // console.log('formularSearchInputChange: ', value);
    const currFormulaArr = formularSet.filter(item => item.name.includes(value.toUpperCase()));

    this.setState({ currFormulaArr, formularSearchValue: value });
  };

  // 选择公式分类
  pickupFormularType = (type, index) => {
    const currFormulaArr = formularSet.filter(item => item.type === type);
    this.setState({
      currFormulaArr,
      currFmlTypeIndex: index,
    });
  };

  // 选择公式
  pickupFormular = (formularObj, index) => {
    const { name, desc } = formularObj;
    this.setState({
      currFmlIndex: index,
      formularDesc: desc,
      formularValue: `${name}()`,
    });
  };

  render() {
    const { showFmlModal } = this.props;
    const {
      formularValue,
      formularCheckLoading,
      formularSearchValue,
      fmlFormatErr,
      currFormulaArr,
      currFmlTypeIndex,
      currFmlIndex,
      formularDesc,
    } = this.state;
    const formularTypeArr = [...new Set(formularSet.map(v => v.type))]; // 公式类型的数组

    return (
      <>
        <Modal
          width={423}
          closable={false}
          okText="Confirm"
          title="Inert Function"
          visible={showFmlModal}
          onOk={this.fmlConfirm}
          onCancel={this.fmlCancel}
          wrapClassName={less['formula-modal']}
        >
          <div className={less['formula-input-tip']}>
            Please Enter Formula into assigned column:
          </div>
          <div style={{ padding: '0 10px' }}>
            <div className={less['formula-check-container']}>
              <Input
                value={formularValue}
                ref={this.formulaInputRef}
                onChange={this.formulaInputChange}
                className={`${fmlFormatErr ? less['formula-format-error'] : ''}`}
              />
              <Button
                type="primary"
                loading={formularCheckLoading}
                onClick={this.checkFormularFormat}
              >
                Check Validity
              </Button>
            </div>
            <div className={less['formula-search-tip']}>Search Function (S):</div>
            <Input value={formularSearchValue} onChange={this.formularSearchInputChange} />
            <div style={{ marginTop: '5px' }}>
              <span className={less['formula-type']}>Function Type:</span>
              <span className={less['formula-name']}>Function Name:</span>
            </div>

            <div className={`${less['formula-hub']} clearfix`}>
              <div className={less['formula-hub-left']}>
                <ul>
                  {formularTypeArr.map((formularType, i) => (
                    <li
                      key={formularType}
                      className={currFmlTypeIndex === i ? less.curr : ''}
                      onClick={() => this.pickupFormularType(formularType, i)}
                    >
                      {formularType}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={less['formula-hub-right']}>
                <ul>
                  {currFormulaArr.map((item, i) => (
                    <li
                      key={item.name}
                      className={currFmlIndex === i ? less.curr : ''}
                      onClick={() => this.pickupFormular(item, i)}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={less['formula-desc']}>{formularDesc}</div>
          </div>
        </Modal>
      </>
    );
  }
}

export default HyperlinkModal;
