/*
 * @Des: unified error message
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-07 17:09:07
 * @LastEditors: iron
 * @LastEditTime: 2019-11-13 15:05:03
 */

import { notification } from 'antd';

export const dva = {
  config: {
    onError(e) {
      // if it's comment,component can not capture error
      e.preventDefault();
      notification.error({
        message: 'oops error!!!',
        description: e.toString(),
      });
    },
  },
};
