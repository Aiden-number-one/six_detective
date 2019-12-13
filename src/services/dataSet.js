/*
 * @Description: 数据集相关接口
 * @Author: lan
 * @Date: 2019-11-28 14:18:22
 * @LastEditTime: 2019-12-12 10:15:18
 * @LastEditors: lan
 */
export default {
  getClassifyTree: 'get_task_data_set_sql_classify_tree_impl', // 获取数据集分类树
  getDataSet: 'get_data_set_sql_list', // 获取数据集
  getMetadataTablePerform: 'get_qry_statement_result', // sql数据预览
  getQryStatement: 'get_qry_statement', // 获取sql语句
  setSqlClassify: 'set_task_data_set_sql_classify', // 新增修改数据集分类
  deleteSqlClassify: 'set_task_data_set_sql_classify_delete', // 删除数据集分类
  operateDataSet: 'set_task_data_set_sql_management_impl', // 操作数据集
};
