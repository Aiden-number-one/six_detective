// import Service from '@/utils/Service';

// const { getAuditLog } = Service;

export default {
  namespace: 'dataSource',
  state: {
    activeData: {},
  },
  effects: {},
  reducers: {
    saveDate(state, action) {
      return {
        ...state,
        activeData: action.payload,
      };
    },
  },
};
