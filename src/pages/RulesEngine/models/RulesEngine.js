const rulesEngineModel = {
  namespace: 'rulesEngine',
  state: {
    ruleData: {
      actionType: 'set',
      op: 'and',
      children: [
        {
          actionType: 'atom',
          op: '>=',
          keyEntity: 'memberEntity',
          keyEntityName: '会员',
          keyField: 'age',
          keyFiledName: '年龄',
          keyType: 'integer',
          valueType: 'input',
          value: 35,
        },
        {
          actionType: 'atom',
          op: '=',
          keyEntity: 'memberEntity',
          keyEntityName: '会员',
          keyField: 'sex',
          keyFiledName: '性别',
          keyType: 'string',
          valueType: 'select',
          valueEnum: ['男', '女'],
          value: '男',
        },
        {
          actionType: 'atom',
          op: '=',
          keyEntity: 'memberEntity',
          keyEntityName: '会员',
          keyField: 'sex',
          keyFiledName: '性别',
          keyType: 'string',
          valueType: 'select',
          valueEnum: ['男', '女'],
          value: '男',
        },
        {
          actionType: 'atom',
          op: '=',
          keyEntity: 'memberEntity',
          keyEntityName: '会员',
          keyField: 'sex',
          keyFiledName: '性别',
          keyType: 'string',
          valueType: 'select',
          valueEnum: ['男', '女'],
          value: '男',
        },
        {
          actionType: 'set',
          op: 'or',
          children: [
            {
              actionType: 'atom',
              op: '=',
              keyEntity: 'memberEntity',
              keyEntityName: '会员',
              keyField: 'car',
              keyFiledName: '是否有车',
              keyType: 'string',
              valueType: 'input',
              value: '是',
            },
            {
              actionType: 'atom',
              op: '=',
              keyEntity: 'memberEntity',
              keyEntityName: '会员',
              keyField: 'married',
              keyFiledName: '婚否',
              keyType: 'string',
              valueType: 'input',
              value: '是',
            },
          ],
        },
        {
          actionType: 'atom',
          op: '=',
          keyEntity: 'memberEntity',
          keyEntityName: '会员',
          keyField: 'sex',
          keyFiledName: '性别',
          keyType: 'string',
          valueType: 'select',
          valueEnum: ['男', '女'],
          value: '男',
        },
      ],
    },
  },
  effects: {},
  reducers: {
    addNode(state, { payload }) {
      payload.children.push({
        actionType: 'atom',
        opType: 'judge',
        op: '=',
        keyEntity: 'memberEntity',
        keyEntityName: '会员',
        keyField: 'car',
        keyFiledName: '请选择类型',
        keyType: 'string',
        valueType: 'select',
        valueEnum: ['是', '否'],
        value: '是',
      });
      return {
        ...state,
        ruleData: {
          ...state.ruleData,
        },
      };
    },
    deleteNode(state, { payload }) {
      payload.deleteDom.splice(payload.place, 1);
      return {
        ...state,
        ruleData: {
          ...state.ruleData,
        },
      };
    },
  },
};
export default rulesEngineModel;
