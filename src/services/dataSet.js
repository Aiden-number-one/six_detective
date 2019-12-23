/*
 * @Description: 数据集相关接口
 * @Author: lan
 * @Date: 2019-11-28 14:18:22
 * @LastEditTime : 2019-12-23 10:26:39
 * @LastEditors  : lan
 */
export default {
  getClassifyTree: 'get_task_data_set_sql_classify_tree_impl', // 获取数据集分类树
  getDataSet: 'get_dataset_list_query', // 获取数据集
  getMetadataTablePerform: 'get_dataset_data_result_query', // sql数据预览
  getQryStatement: 'get_qry_statement', // 获取sql语句
  setSqlClassify: 'set_task_data_set_sql_classify', // 新增修改数据集分类
  deleteSqlClassify: 'set_task_data_set_sql_classify_delete', // 删除数据集分类
  operateDataSet: 'set_dataset_content_edit', // 操作数据集
  // setDataSet: 'set_task_data_set_sql_management_impl', // 新增数据集
  getColumn: 'get_report_template_dataset_field_list', // 获取列数据
  getDataSetDetail: 'get_dataset_content_query', // 获取单个数据集
};
