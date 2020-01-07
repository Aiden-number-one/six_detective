/*
 * @Description: 数据集相关接口
 * @Author: lan
 * @Date: 2019-11-28 14:18:22
 * @LastEditTime : 2020-01-07 10:56:16
 * @LastEditors  : lan
 */
export default {
  getProcStatement: 'get_proc_statement', // 获取存储过程参数
  getProcedure: 'get_qry_statement_result', // 获取存储过程
  getClassifyTree: 'get_folder_menu', // 获取数据集分类树
  getDataSet: 'get_dataset_list_query', // 获取数据集
  getMetadataTablePerform: 'get_dataset_data_result_query', // sql数据预览
  getQryStatement: 'get_qry_statement', // 获取sql语句
  setSqlClassify: 'set_folder_menu_modify', // 新增修改数据集分类
  deleteSqlClassify: 'set_folder_menu_modify', // 删除数据集分类
  operateDataSet: 'set_dataset_content_edit', // 操作数据集
  // setDataSet: 'set_task_data_set_sql_management_impl', // 新增数据集
  getColumn: 'get_report_template_dataset_field_list', // 获取列数据
  getDataSetDetail: 'get_dataset_content_query', // 获取单个数据集
  getVariableList: 'get_dataset_script_parsed_variable_list', // SQL参数
  sqlFormated: 'get_database_formated_script', // sql美化
};
