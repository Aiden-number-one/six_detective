/*
 * @Des: runtime config
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-07 17:09:07
 * @LastEditors: iron
 * @LastEditTime: 2019-12-06 19:23:53
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
        style: {
          maxHeight: 135,
          overflow: 'auto',
        },
      });
    },
  },
};
