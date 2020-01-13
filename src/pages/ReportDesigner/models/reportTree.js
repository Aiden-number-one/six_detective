/*
 * @Des: 获取树
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2020-01-12 15:19:51
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-12 15:20:16
 */

import { message } from 'antd';
import { formatTree } from '@/utils/utils';
import Service from '@/utils/Service';

const { getClassifyTree } = Service;

// 树转换
const TreeFolderTrans = value => {
  const dataList = [];
  value.forEach(item => {
    if (item.children) {
      item.children = TreeFolderTrans(item.children);
    }
    const param = {
      key: item.folderId,
      value: item.folderId,
      title: item.folderName,
      children: item.children,
      ...item,
    };
    dataList.push(param);
  });
  return dataList;
};

export default {
  namespace: 'reportTree',

  state: {
    classifyTree: [], // 数据集分类树
  },

  effects: {
    *getClassifyTree({ payload }, { call, put }) {
      const res = yield call(getClassifyTree, { param: payload });
      if (res && res.bcjson.flag === '1') {
        const classifyTree = TreeFolderTrans(formatTree(res.bcjson.items, 'folderId', 'parentId'));
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
