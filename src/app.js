/*
 * @Des: runtime config
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-07 17:09:07
 * @LastEditors: iron
 * @LastEditTime: 2019-12-18 14:44:17
 */

import { message } from 'antd';

export const dva = {
  config: {
    onError(e) {
      // if it's comment,component can not capture error
      e.preventDefault();
      message.error(e.toString().slice(0, 100));
    },
  },
};
