/*
 * @Des: alert center model spec
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-04 13:24:40
 * @LastEditors: iron
 * @LastEditTime: 2019-12-04 16:56:21
 */
import { effects } from 'dva/saga';
import alertCenter, { requestAlerts } from './model';

describe('alertCenter Model', () => {
  it('loads', () => {
    expect(alertCenter).toBeTruthy();
  });

  describe('reducers', () => {
    it('saveAlerts should work', () => {
      const { reducers } = alertCenter;
      const reducer = reducers.saveAlerts;

      const state = {
        alerts: [],
      };

      const action = {
        type: 'saveAlerts',
        payload: [],
      };

      expect(reducer(state, action)).toEqual({
        alerts: [],
      });
    });
  });

  describe('effects', () => {
    it('fetchAlerts should work', () => {
      const { call, put } = effects;
      const sagas = alertCenter.effects;
      const saga = sagas.fetchAlerts;
      const generator = saga({ type: 'fetchAlerts' }, { call, put });

      let next = generator.next();

      expect(next.value).toMatchObject(call(requestAlerts, undefined));

      next = generator.next({ items: [] });

      expect(next.value).toMatchObject(
        put({
          type: 'saveAlerts',
          payload: [],
        }),
      );
    });
  });
});
