/*
 * @Des: 报表设计器相关的
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-17 15:12:19
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-11 14:39:08
 */
export default {
  getDataSet: 'get_dataset_list_query', // 获取数据集
  setReportTemplateContent: 'set_report_template_content_edit', // 保存报表模板
  getReportTemplateContent: 'get_report_template_content_query', // 查询报表模板
  getReportTemplateList: 'get_report_template_list_query', // 获取报表模版列表
  getReportTemplateDataQuery: 'set_report_template_data_query', // 进行报表模板查询-预览页面
  getReportDataFile: 'get_report_data_file', // 报表预览-导出文件
  getFieldList: 'get_report_template_dataset_field_list', // 根据sql得到相应的file
  importExcel: 'set_excel_template_parse', // 导入Excel模版
  getDataSourceConfig: 'get_data_source_config', // 获取数据源列表
  getMetadataTableInfo: 'get_metadata_table_info', // 获取数据源下的表
  getColumnInfo: 'get_metadata_column_info', // 获取某个表的列表项目
};
