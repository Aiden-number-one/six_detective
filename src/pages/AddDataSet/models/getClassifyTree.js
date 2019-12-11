/*
 * @Description: 获取数据集分类树
 * @Author: lan
 * @Date: 2019-12-10 11:18:33
 * @LastEditTime: 2019-12-10 17:23:13
 * @LastEditors: lan
 */
import { message } from 'antd';
import Service from '@/utils/Service';

const { getClassifyTree } = Service;

const TreeFolderTrans = value => {
  const dataList = [];
  value.forEach(item => {
    if (item.children) {
      item.children = TreeFolderTrans(item.children);
    }
    const param = {
      key: item.classId,
      value: item.classId,
      title: item.className,
      children: item.children,
    };
    dataList.push(param);
  });
  return dataList;
};

export default {
  namespace: 'getClassifyTree',

  state: {
    classifyTree: [], // 数据集分类树
  },

  effects: {
    *getClassifyTree({ payload }, { call, put }) {
      const res = yield call(getClassifyTree, { param: payload });
      if (res && res.bcjson.flag === '1') {
        const classifyTree = TreeFolderTrans(res.bcjson.items);
        yield put({
          type: 'setClassifyTree',
          payload: classifyTree,
        });
      } else {
        message.error(res.bcjson.msg.substring(0, 1000));
      }
    },
  },

  reducers: {
    setClassifyTree(state, action) {
      return {
        ...state,
        classifyTree: action.payload,
      };
    },
  },
};
