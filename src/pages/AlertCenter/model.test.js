/*
 * @Des: alert center model spec
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-04 13:24:40
 * @LastEditors: iron
 * @LastEditTime: 2019-12-05 10:34:28
 */
import { effects } from 'dva/saga';
import alertCenter, { getAlerts } from './model';

const { reducers, effects: sagas } = alertCenter;
const { call, put } = effects;

describe('alertCenter Model', () => {
  it('loads', () => {
    expect(alertCenter).toBeTruthy();
  });

  describe('reducers', () => {
    it('save alerts should work', () => {
      const reducer = reducers.save;

      const state = {
        alerts: [],
      };

      const action = {
        type: 'save',
        payload: [],
      };

      expect(reducer(state, action)).toEqual({
        alerts: [],
      });
    });
  });

  describe('effects', () => {
    it('fetch alerts should work', () => {
      const saga = sagas.fetch;
      const generator = saga({ type: 'fetch' }, { call, put });

      let next = generator.next();
      expect(next.value).toEqual(call(getAlerts, undefined));

      next = generator.next({ items: [] });
      expect(next.value).toEqual(
        put({
          type: 'save',
          payload: [],
        }),
      );
    });
  });
});
