/*
 * @Des: 预览查询条件区域
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2020-01-07 22:27:04
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-09 09:23:48
 */
import React, { PureComponent } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import _ from 'lodash';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;

class PreviewSearchArea extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
      customSearchData,
      dataSetColumn,
    } = this.props;
    return (
      <>
        {customSearchData.map((value, index) => {
          const {
            widgetType, // 控件类型
            widgetName, // 控件的label的名称
            widgetPlaceholder, // placeholder
            widgetKey, // 所绑定的key
            // 当类型为select类型、Radio类型、checkbox类型
            sourceType, // 选项的数据来源：数据集、数据表、自定义 table|dataset|datacolumn
            datacolumn, // 所取的数据集的字段
            customList = [], // select自定义选项
          } = value;
          if (widgetType === 'input' && widgetKey) {
            return (
              <Form.Item label={widgetName}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(<Input placeholder={widgetPlaceholder} />)}
              </Form.Item>
            );
          }
          if ((widgetType === 'select' || widgetType === 'selectmultiple') && widgetKey) {
            return (
              <Form.Item label={widgetName}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <Select
                    mode={widgetType === 'selectmultiple' && 'multiple'}
                    style={{ width: '100%' }}
                    placeholder={widgetPlaceholder}
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
          if (widgetType === 'datepickeryyyy' && widgetKey) {
            return (
              <Form.Item label={widgetName}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }} placeholder={widgetPlaceholder}>
                    {_.range(1990, 2099).map(year => (
                      <Option key={year}>{year}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            );
          }
          if (widgetType === 'datepickeryyyymm' && widgetKey) {
            return (
              <Form.Item label={widgetName}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(<MonthPicker />)}
              </Form.Item>
            );
          }
          if (widgetType === 'datepickeryyyymmdd') {
            return (
              <Form.Item label={widgetName}>
                {getFieldDecorator(widgetKey, {
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(<DatePicker />)}
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
