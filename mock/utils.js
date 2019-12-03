// eslint-disable-next-line import/no-extraneous-dependencies
import mockjs from 'mockjs';

export function mp(name) {
  return `POST /mockapi/v2.0/bayconnect.superlop.${name}.json`;
}

export function baseRes(res) {
  return {
    bcjson: {
      flag: '1',
      items: res,
    },
  };
}

export function mockRes(count, res) {
  return {
    bcjson: {
      flag: '1',
      ...mockjs.mock({
        [`items|1-${count}`]: res,
      }),
    },
  };
}
