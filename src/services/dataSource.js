/*
 * @Description: 数据源相关接口
 * @Author: lan
 * @Date: 2019-11-12 13:48:28
 * @LastEditTime: 2019-11-15 17:59:11
 * @LastEditors: lan
 */
export default {
  getDataSourceList: 'get_data_source_config', // 获取数据源列表
  getTableData: 'get_metadata_table_info', // 获取表数据
  getMetaData: 'get_db_metadata_schemas', // 获取元数据
  getDataDriver: 'get_data_driver_info', // 获取驱动
  setDataSource: 'set_data_source_config',
  updDataSource: 'set_data_source_config_update',
  delDataSource: 'set_data_source_config_del',
  addMetaData: 'set_db_metadata',
};
