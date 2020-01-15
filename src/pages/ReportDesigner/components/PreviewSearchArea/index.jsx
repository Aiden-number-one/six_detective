/*
 * @Des: 预览查询条件区域
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2020-01-07 22:27:04
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-15 20:28:50
 */
import React, { PureComponent } from 'react';
import { Form, Input, Select, DatePicker, Radio, Checkbox, InputNumber, Row, Col } from 'antd';
import _ from 'lodash';
import moment from 'moment';

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
        <Row gutter={24}>
          {customSearchData.map(value => {
            const {
              // 基本信息
              widgetType, // 控件类型
              widgetName, // 控件的label的名称
              widgetNameVisible, // 标签名是否可见
              widgetPlaceholder, // placeholder
              widgetKey, // 所绑定的key
              widgetStatus, // 是否可见
              widgetDefault = undefined, // 默认值
              // parameterType = 'STRING', //
              // 当类型为select类型、Radio类型、checkbox类型
              sourceType, // 选项的数据来源：数据集、数据表、自定义 table|dataset|datacolumn
              datacolumn, // 所取的数据集的字段
              tablecolumn, // 所取的Table的字段
              customList = [], // select自定义选项
              // 校验相关
              widgetIsNull, // 校验是否为空
              maxLength = Infinity,
              minLength = -Infinity,
              maxNumber = Infinity,
              minNumber = -Infinity,
              i,
            } = value;
            // 控件是否隐藏
            const displayNone = widgetStatus === 'hide';
            // 控件是否是disable的状态
            const disabled = widgetStatus === 'readyonly';
            if (widgetType === 'input' && widgetKey && !displayNone) {
              return (
                <Col span={8} key={i}>
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
                      initialValue: widgetDefault,
                    })(
                      <Input
                        placeholder={widgetPlaceholder}
                        disabled={disabled}
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              );
            }
            if (widgetType === 'inputnumber' && widgetKey && !displayNone) {
              return (
                <Col span={8} key={i}>
                  <Form.Item label={widgetNameVisible ? widgetName : ''}>
                    {getFieldDecorator(widgetKey, {
                      rules: [
                        {
                          required: !widgetIsNull,
                          message: 'Required',
                        },
                      ],
                      initialValue: widgetDefault,
                    })(
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder={widgetPlaceholder}
                        disabled={disabled}
                        max={Number(maxNumber)}
                        min={Number(minNumber)}
                      />,
                    )}
                  </Form.Item>
                </Col>
              );
            }
            if (
              (widgetType === 'select' || widgetType === 'selectmultiple') &&
              widgetKey &&
              !displayNone
            ) {
              return (
                <Col span={8} key={i}>
                  <Form.Item label={widgetNameVisible ? widgetName : ''}>
                    {getFieldDecorator(widgetKey, {
                      rules: [
                        {
                          required: !widgetIsNull,
                          message: 'Required',
                        },
                      ],
                      initialValue: widgetDefault,
                    })(
                      <Select
                        mode={widgetType === 'selectmultiple' && 'multiple'}
                        placeholder={widgetPlaceholder}
                        disabled={disabled}
                        style={{ width: '100%' }}
                      >
                        {/* 若为数据集类型 */}
                        {sourceType === 'dataset' &&
                          (dataSetColumn[datacolumn] || []).map(optionData => (
                            <Option key={optionData}>{optionData}</Option>
                          ))}
                        {sourceType === 'table' &&
                          (dataSetColumn[tablecolumn] || []).map(optionData => (
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
                </Col>
              );
            }
            if (widgetType === 'datepickeryyyy' && widgetKey && !displayNone) {
              return (
                <Col span={8} key={i}>
                  <Form.Item label={widgetNameVisible ? widgetName : ''}>
                    {getFieldDecorator(widgetKey, {
                      rules: [
                        {
                          required: !widgetIsNull,
                          message: 'Required',
                        },
                      ],
                      initialValue: widgetDefault,
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
                </Col>
              );
            }
            if (widgetType === 'datepickeryyyymm' && widgetKey && !displayNone) {
              return (
                <Col span={8} key={i}>
                  <Form.Item label={widgetNameVisible ? widgetName : ''}>
                    {getFieldDecorator(widgetKey, {
                      rules: [
                        {
                          required: !widgetIsNull,
                          message: 'Required',
                        },
                      ],
                      initialValue: widgetDefault ? moment(widgetDefault, 'YYYY-MM') : undefined,
                    })(
                      <MonthPicker
                        disabled={disabled}
                        placeholder={widgetPlaceholder}
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              );
            }
            if (widgetType === 'datepickeryyyymmdd' && widgetKey && !displayNone) {
              return (
                <Col span={8} key={i}>
                  <Form.Item label={widgetNameVisible ? widgetName : ''}>
                    {getFieldDecorator(widgetKey, {
                      rules: [
                        {
                          required: !widgetIsNull,
                          message: 'Required',
                        },
                      ],
                      initialValue: widgetDefault ? moment(widgetDefault, 'YYYY-MM-DD') : undefined,
                    })(
                      <DatePicker
                        disabled={disabled}
                        placeholder={widgetPlaceholder}
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              );
            }
            if (widgetType === 'radio' && widgetKey && !displayNone) {
              return (
                <Col span={8} key={i}>
                  <Form.Item label={widgetNameVisible ? widgetName : ''}>
                    {getFieldDecorator(widgetKey, {
                      rules: [
                        {
                          required: !widgetIsNull,
                          message: 'Required',
                        },
                      ],
                    })(
                      <Radio.Group disabled={disabled} style={{ width: '100%' }}>
                        {/* 若为数据集类型 */}
                        {sourceType === 'dataset' &&
                          (dataSetColumn[datacolumn] || []).map(optionData => (
                            <Radio value={optionData}>{optionData}</Radio>
                          ))}
                        {/* 若为表类型 */}
                        {sourceType === 'table' &&
                          (dataSetColumn[tablecolumn] || []).map(optionData => (
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
                </Col>
              );
            }
            if (widgetType === 'checkbox' && widgetKey && !displayNone) {
              return (
                <Col span={8} key={i}>
                  <Form.Item label={widgetNameVisible ? widgetName : ''}>
                    {getFieldDecorator(widgetKey, {
                      rules: [
                        {
                          required: !widgetIsNull,
                          message: 'Required',
                        },
                      ],
                    })(
                      <Checkbox.Group disabled={disabled} style={{ width: '100%' }}>
                        {/* 若为数据集类型 */}
                        {sourceType === 'dataset' &&
                          (dataSetColumn[datacolumn] || []).map(optionData => (
                            <Checkbox value={optionData}>{optionData}</Checkbox>
                          ))}
                        {/* 若为表类型 */}
                        {sourceType === 'table' &&
                          (dataSetColumn[tablecolumn] || []).map(optionData => (
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
                </Col>
              );
            }
            return <div></div>;
          })}
        </Row>
      </>
    );
  }
}

export default Form.create()(PreviewSearchArea);
