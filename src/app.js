/**
 * des: default request interceptor
 * author: iron
 * email: chenggang@szkingdom.com.cn
 * date: 2019.11.07
 */
import { notification } from 'antd';

export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
      notification.error({
        message: '解析异常',
        description: e.toString(),
      });
    },
  },
};
