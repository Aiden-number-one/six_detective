import { notification } from 'antd';

export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
      console.log(e);
      notification.error({
        description: e.toString(),
        message: '响应异常',
      });
    },
  },
};
