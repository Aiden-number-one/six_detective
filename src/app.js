/*
 * @Des: runtime config
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-07 17:09:07
 * @LastEditors  : dailinbo
 * @LastEditTime : 2019-12-23 15:37:43
 */

import { message } from 'antd';

export const dva = {
  config: {
    onError(e) {
      // if it's comment,component can not capture error
      e.preventDefault();
      message.warning(e.toString().slice(0, 100));
    },
  },
};
