/*
 * @Description: 数据源相关接口
 * @Author: lan
 * @Date: 2019-11-12 13:48:28
 * @LastEditTime: 2019-11-19 13:38:18
 * @LastEditors: lan
 */
export default {
  getDataSourceList: 'get_data_source_config', // 获取数据源列表
  getTableData: 'get_metadata_table_info', // 获取表数据
  delTableData: 'set_metadata_tables_del', // 删除表数据
  getMetaData: 'get_db_metadata_schemas', // 获取元数据
  getDataDriver: 'get_data_driver_info', // 获取驱动
  setDataSource: 'set_data_source_config', // 新增数据源
  updDataSource: 'set_data_source_config_update', // 修改数据源
  delDataSource: 'set_data_source_config_del', // 删除数据源
  addMetaData: 'set_db_metadata', // 导入元数据
  updMetadata: 'set_metadata_tables_upd', // 更新元数据字段
  updRecordCount: 'set_table_recordcount_upd', // 更细行数
  getSchemas: 'get_schemas_from_tables_info', // 获取用户
  getColumnInfo: 'get_metadata_column_info', // 获取元数据列信息
  getMetadataPerform: 'get_metadata_table_perform', // 数据预览
  exportInfo: 'get_metadata_table_export_info', // 生成导出文件
};
