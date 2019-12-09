/*
 * @Des: lop log model spec
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-04 19:55:21
 * @LastEditors: iron
 * @LastEditTime: 2019-12-05 11:09:32
 */
import { effects } from 'dva/saga';
import lop, { getLogs, postAuto, postManual, pageSelector } from './model';

const { reducers, state, effects: sagas } = lop;
const { call, put, select } = effects;

describe('lop log model', () => {
  it('loads', () => {
    expect(lop).toBeTruthy();
  });

  describe('test reducers', () => {
    it('should save logs work', () => {
      const reducer = reducers.save;

      const action = {
        type: 'save',
        payload: { logs: [] },
      };
      expect(reducer(state, action)).toEqual({
        logs: [],
        total: null,
        page: null,
      });
    });
  });

  describe('effects', () => {
    it('should fetch logs work', () => {
      const saga = sagas.fetch;
      const generator = saga({ type: 'fetch', params: { page: 1 } }, { call, put });

      let next = generator.next();
      expect(next.value).toEqual(call(getLogs, { page: 1 }));

      next = generator.next({ items: [] });
      expect(next.value).toEqual(
        put({
          type: 'save',
          payload: [],
        }),
      );
    });

    it('should manual import lop work', () => {
      const saga = sagas.importByManual;
      const generator = saga({ type: 'importByManual' }, { call, put });

      let next = generator.next();
      expect(next.value).toEqual(call(postManual, undefined));

      next = generator.next();
      expect(next.value).toEqual(put({ type: 'reload' }));
    });

    it('should auto import lop work', () => {
      const saga = sagas.importByAuto;
      const generator = saga({ type: 'importByAuto' }, { call, put });

      let next = generator.next();
      expect(next.value).toEqual(call(postAuto, undefined));

      next = generator.next();
      expect(next.value).toEqual(put({ type: 'reload' }));
    });

    it('reload should work', () => {
      const saga = sagas.reload;

      const generator = saga({ type: 'reload' }, { select, put });

      const fakeState = {
        lop: {
          page: 1,
        },
      };

      let next = generator.next(fakeState);
      expect(next.value).toEqual(select(pageSelector));

      next = generator.next(2);
      expect(next.value).toEqual(put({ type: 'fetch', payload: { page: 2 } }));
    });
  });
});
