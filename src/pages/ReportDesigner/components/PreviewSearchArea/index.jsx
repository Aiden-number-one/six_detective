/*
 * @Des: 预览查询条件区域
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2020-01-07 22:27:04
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-08 17:10:50
 */
import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';

class PreviewSearchArea extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
      customSearchData,
    } = this.props;
    return (
      <>
        {customSearchData.map((value, index) => {
          const { widgetType, widgetName, widgetPlaceholder, widgetKey } = value;
          if (widgetType === 'input') {
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
          return <div></div>;
        })}
      </>
    );
  }
}

export default Form.create()(PreviewSearchArea);
