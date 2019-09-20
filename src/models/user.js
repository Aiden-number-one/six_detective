/*
 * @Description: user modal
 * @Author: lan
 * @Date: 2019-08-28 10:01:59
 * @LastEditTime: 2019-09-20 10:13:57
 * @LastEditors: mus
 */
const user = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {},
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default user;
