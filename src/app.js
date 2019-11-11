/**
 * des: default request interceptor
 * author: iron
 * email: chenggang@szkingdom.com.cn
 * data: 2019.11.07
 */
import { notification } from 'antd';

export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
      notification.error({
        description: e.toString(),
        message: '解析异常',
      });
    },
  },
};
