const approvalSetModel = {
  namespace: 'approvalSet',
  state: {
    checkColumns: [
      {
        title: '序号',
        dataIndex: 'number',
      },
      {
        title: '业务名称',
        dataIndex: 'name',
      },
      {
        title: '流程模型名称',
        dataIndex: 'tel',
      },
      {
        title: '说明',
        dataIndex: 'phone',
      },
      {
        title: '是否启用',
        dataIndex: 'isUseing',
      },
      {
        title: '是否默认',
        dataIndex: 'IsDefault',
      },
    ],
  },
  effects: {},
  reducers: {},
};
export default approvalSetModel;
