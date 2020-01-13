/*
 * @Des: 预览查询条件区域
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2020-01-07 22:27:04
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-12 16:31:33
 */
import React, { PureComponent } from 'react';
import { Form, Input, Select, DatePicker, Radio, Checkbox, Tooltip, Icon, InputNumber } from 'antd';
import _ from 'lodash';

const { Option } = Select;
const { MonthPicker } = DatePicker;

class PreviewSearchArea extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
      customSearchData,
      dataSetColumn,
    } = this.props;
    return (
      <>
        {customSearchData.map(value => {
          const {
            // 基本信息
            widgetType, // 控件类型
            widgetName, // 控件的label的名称
            widgetNameVisible, // 标签名是否可见
            widgetPlaceholder, // placeholder
            widgetKey, // 所绑定的key
            widgetStatus, // 是否可见
            // 当类型为select类型、Radio类型、checkbox类型
            sourceType, // 选项的数据来源：数据集、数据表、自定义 table|dataset|datacolumn
            datacolumn, // 所取的数据集的字段
            customList = [], // select自定义选项
            // 校验相关
            widgetIsNull, // 校验是否为空
            maxLength = Infinity,
            minLength = -Infinity,
            maxNumber = Infinity,
            minNumber = -Infinity,
          } = value;
          // 控件是否隐藏
          const displayNone = widgetStatus === 'hide';
          // 控件是否是disable的状态
          const disabled = widgetStatus === 'readyonly';
          if (widgetType === 'input' && widgetKey && !displayNone) {
            return (
              <Form.Item label={widgetNameVisible ? widgetName : ''}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: !widgetIsNull,
                      message: 'Required',
                      max: Number(maxLength),
                      min: Number(minLength),
                    },
                  ],
                })(<Input placeholder={widgetPlaceholder} disabled={disabled} />)}
              </Form.Item>
            );
          }
          if (widgetType === 'inputnumber' && widgetKey && !displayNone) {
            return (
              <Form.Item label={widgetNameVisible ? widgetName : ''}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: !widgetIsNull,
                      message: 'Required',
                    },
                  ],
                })(
                  <InputNumber
                    placeholder={widgetPlaceholder}
                    disabled={disabled}
                    max={Number(maxNumber)}
                    min={Number(minNumber)}
                  />,
                )}
              </Form.Item>
            );
          }
          if (
            (widgetType === 'select' || widgetType === 'selectmultiple') &&
            widgetKey &&
            !displayNone
          ) {
            return (
              <Form.Item label={widgetNameVisible ? widgetName : ''}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: !widgetIsNull,
                      message: 'Required',
                    },
                  ],
                })(
                  <Select
                    mode={widgetType === 'selectmultiple' && 'multiple'}
                    style={{ width: '100%' }}
                    placeholder={widgetPlaceholder}
                    disabled={disabled}
                  >
                    {/* 若为数据集类型 */}
                    {sourceType === 'dataset' &&
                      (dataSetColumn[datacolumn] || []).map(optionData => (
                        <Option key={optionData}>{optionData}</Option>
                      ))}
                    {/* 若为自定义类型 */}
                    {sourceType === 'custom' &&
                      customList.map(optionData => (
                        <Option key={optionData.key}>{optionData.value}</Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            );
          }
          if (widgetType === 'datepickeryyyy' && widgetKey && !displayNone) {
            return (
              <Form.Item label={widgetNameVisible ? widgetName : ''}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: !widgetIsNull,
                      message: 'Required',
                    },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={widgetPlaceholder}
                    disabled={disabled}
                  >
                    {_.range(1990, 2099).map(year => (
                      <Option key={year}>{year}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            );
          }
          if (widgetType === 'datepickeryyyymm' && widgetKey && !displayNone) {
            return (
              <Form.Item label={widgetNameVisible ? widgetName : ''}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: !widgetIsNull,
                      message: 'Required',
                    },
                  ],
                })(
                  <MonthPicker
                    style={{ width: '100%' }}
                    disabled={disabled}
                    placeholder={widgetPlaceholder}
                  />,
                )}
              </Form.Item>
            );
          }
          if (widgetType === 'datepickeryyyymmdd' && widgetKey && !displayNone) {
            return (
              <Form.Item label={widgetNameVisible ? widgetName : ''}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: !widgetIsNull,
                      message: 'Required',
                    },
                  ],
                })(
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled={disabled}
                    placeholder={widgetPlaceholder}
                  />,
                )}
              </Form.Item>
            );
          }
          if (widgetType === 'radio' && widgetKey && !displayNone) {
            return (
              <Form.Item label={widgetNameVisible ? widgetName : ''}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: !widgetIsNull,
                      message: 'Required',
                    },
                  ],
                })(
                  <Radio.Group disabled={disabled}>
                    {/* 若为数据集类型 */}
                    {sourceType === 'dataset' &&
                      (dataSetColumn[datacolumn] || []).map(optionData => (
                        <Radio value={optionData}>{optionData}</Radio>
                      ))}
                    {/* 若为自定义类型 */}
                    {sourceType === 'custom' &&
                      customList.map(optionData => (
                        <Radio value={optionData.key}>{optionData.value}</Radio>
                      ))}
                  </Radio.Group>,
                )}
              </Form.Item>
            );
          }
          if (widgetType === 'checkbox' && widgetKey && !displayNone) {
            return (
              <Form.Item label={widgetNameVisible ? widgetName : ''}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: !widgetIsNull,
                      message: 'Required',
                    },
                  ],
                })(
                  <Checkbox.Group disabled={disabled}>
                    {/* 若为数据集类型 */}
                    {sourceType === 'dataset' &&
                      (dataSetColumn[datacolumn] || []).map(optionData => (
                        <Checkbox value={optionData}>{optionData}</Checkbox>
                      ))}
                    {/* 若为自定义类型 */}
                    {sourceType === 'custom' &&
                      customList.map(optionData => (
                        <Checkbox value={optionData.key}>{optionData.value}</Checkbox>
                      ))}
                  </Checkbox.Group>,
                )}
              </Form.Item>
            );
          }
          return <div></div>;
        })}
      </>
    );
  }
}

export default Form.create()(PreviewSearchArea);

function TooltipLabel({ tips, title }) {
  return (
    <span>
      {title}
      <Tooltip
        overlayStyle={{
          maxWidth: 900,
        }}
        title={tips}
      >
        <Icon type="question-circle-o" style={{ paddingLeft: 5, backgroundColor: 'transparent' }} />
      </Tooltip>
    </span>
  );
}
