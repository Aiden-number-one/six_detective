/*
 * @Des: 预览查询条件区域
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2020-01-07 22:27:04
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-08 11:19:13
 */
import React from 'react';
import { Form, Input, Divider } from 'antd';

function PreviewSearchArea(props) {
  const { form: getFieldDecorator, customSearchData } = props;
  return (
    <>
      {customSearchData.map((value, index) => {
        const { widgetType, widgetName, widgetPlaceholder } = value;
        if (value.widgetType === 'input') {
          return (
            <Form.Item label={`Field ${index}`}>
              {getFieldDecorator(`field-${index}`, {
                rules: [
                  {
                    required: true,
                    message: 'Input something!',
                  },
                ],
              })(<Input placeholder="placeholder" />)}
            </Form.Item>
          );
        }
        return <div></div>;
      })}
    </>
  );
}

export default Form.create()(PreviewSearchArea);
