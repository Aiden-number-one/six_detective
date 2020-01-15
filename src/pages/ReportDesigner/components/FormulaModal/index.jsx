/*
 * @Author: liangchaoshun
 * @Email: liangchaoshun@szkingdom.com
 * @Date: 2020-01-13 20:54:47
 * @LastEditors  : liangchaoshun
 * @LastEditTime : 2020-01-15 15:50:44
 * @Description: 公式输入的模态框
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input } from 'antd';
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
@Form.create({ name: 'formula_modal' })
class FormulaModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formularSearchValue: '', // 输入公式以搜索
      currFormulaArr: [], // 当前展示的公式集
      currFmlTypeIndex: -1, // 当前选中的公式类
      formularDesc: '', // 当前选中公式的描述
    };
  }

  // 把公式的初始值放到到 Input
  componentDidUpdate(prevProps) {
    const { initFmlVal: prevVal } = prevProps;
    const { initFmlVal: currVal } = this.props;
    // eslint-disable-next-line react/no-did-update-set-state
    if (prevVal !== currVal) {
      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({ formulaValue: currVal }); // 赋值
    }
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
    const {
      cellPosition,
      dispatch,
      form: { validateFields, setFieldsValue },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const { formulaValue } = values;
        let refineFmlValue = formulaValue;
        if (!formulaValue.startsWith('=')) refineFmlValue = `=${formulaValue}`;
        this.showOrHideFormulaModal(false);
        setCellTypeAndValue({ type: 'formula', value: refineFmlValue, cellPosition });
        setFieldsValue({ formulaValue: '' }); // 清空
        this.setState({ formularSearchValue: '' }); // 清空
        dispatch({
          type: 'reportDesigner/modifyTemplateArea',
          payload: {
            elementType: 'formula', // 单元格类型
          },
        });
      }
    });
  };

  // 公式模态框：取消
  fmlCancel = () => {
    // console.log('fmlCancel');
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ formulaValue: '' }); // 清空

    this.showOrHideFormulaModal(false);
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
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ formulaValue: `=${name}()` }); // 清空
    this.setState({
      currFmlIndex: index,
      formularDesc: desc,
    });
  };

  render() {
    const {
      showFmlModal,
      form: { getFieldDecorator },
    } = this.props;
    const {
      formularSearchValue,
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
          <Form>
            <div className={less['formula-input-tip']}>
              Please Enter Formula into assigned column:
            </div>
            <div style={{ padding: '0 10px' }}>
              <div className={less['formula-check-container']}>
                <Form.Item>
                  {getFieldDecorator('formulaValue', {
                    validateFirst: true,
                    rules: [
                      {
                        required: true,
                        message: 'Please input a formula',
                      },
                      {
                        // 一般性整体校验
                        pattern: /^=?[A-Z]+\(.*\)$/,
                        message: 'Please input the correct format, eg: =SUM()',
                      },
                    ],
                  })(<Input placeholder="Please input a formula" />)}
                </Form.Item>
              </div>
              <div className={less['formula-search-tip']}>Search Function (S):</div>
              <Input
                value={formularSearchValue}
                onChange={this.formularSearchInputChange}
                placeholder="Input or pick up a formula"
              />
              <div style={{ marginTop: '5px' }}>
                <span className={less['formula-type']}>Function Type:</span>
                <span className={less['formula-name']}>Function Name:</span>
              </div>

              <div className={less['formula-hub']}>
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
          </Form>
        </Modal>
      </>
    );
  }
}

export default FormulaModal;
