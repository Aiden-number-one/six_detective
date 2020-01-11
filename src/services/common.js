/*
 * @Description: 公共接口
 * @Author: mus
 * @Date: 2019-09-19 19:41:36
 * @LastEditTime : 2020-01-11 20:21:17
 * @LastEditors  : dailinbo
 * @Email: mus@szkingdom.com
 */
const prefix = '';

export default {
  getSP: 'get_qry_statement_result', // 获取存储过程
  getMenu: 'get_acl_menu', // 获取数据门户主题列表
  // getMenu: 'mock/run/7765f3a2-a030-4578-a016-cc13c4156136', // Mock
  getDatas: 'kingdom.retl.getDatas',
  delDatas: 'kingdom.retl.delDatas',
  getDataSourceList: 'kingdom.retl.getDataSourceList',
  getLogin: 'get_website_login', // 登录
  getLoginStatus: 'get_user_operate_info', // 判断登录状态
  logout: 'set_sys_logout', // 登出接口
  getDict: 'get_all_dict_data_list', // 获取字典
  getApproval: `${prefix}get_audit_history_list_page`,
  getConfig: `${prefix}get_audit_config_list_page`,
  addConfig: `${prefix}set_audit_config_add`,
  saveConfig: `${prefix}set_audit_config_save`,
  setAuditorConfig: `${prefix}set_auditor_config`,
  getProcessAuditor: `${prefix}get_audit_config_process_auditor`,
  deleteConfig: `${prefix}set_audit_config_delete`,
  getTemplate: `${prefix}get_notice_template_list`,
  templateSave: `${prefix}set_notice_template_save`,
  getModelList: `${prefix}get_workflow_model_list_page`,
  createModel: `${prefix}set_workflow_model_create`,
  deleteModel: `${prefix}set_workflow_model_delete`,
  importModel: `${prefix}set_workflow_model_import`,
  getModelImage: `${prefix}get_workflow_model_image`,
  exportModel: `${prefix}set_workflow_model_export`,
  deployModel: `${prefix}set_workflow_model_deploy`,
  deployedModelList: `${prefix}get_deployed_model_list_page`,
  getDiagram: `${prefix}get_diagram_layout`,
  getProcessResource: `${prefix}get_process_resource`,
  setConfigStatus: `${prefix}set_audit_config_status_update`,
  getRoleGroup: `${prefix}get_role_group_query`,
  getAuditorlist: `${prefix}get_auditor_list`,
  getQueryMenu: `${prefix}get_query_menu_alert`,
  getSchedule: `${prefix}get_schedule_list_page`,
  scheduleDelete: `${prefix}set_schedule_delete_batch`,
  scheduleModify: `${prefix}set_schedule_modify`,
  scheduleAdd: `${prefix}set_schedule_add`,
  downloadFile: `${prefix}file_download_quick`,
  // getUserList: `${prefix}get_user_list_impl`,
  getUserList: `${prefix}get_user_list_information`,
  getAlertUserList: `${prefix}get_alert_user_page_query`,
  addUser: `${prefix}set_sysuser_info_add`,
  updateUser: `${prefix}set_user_update`,
  operationUser: `${prefix}set_user_service_impl`,
  emailList: `${prefix}get_mail_config_list`,
  updateEmail: `${prefix}set_system_param_modify`,
  addEmail: `${prefix}set_mail_config_save`,
  deleteEmail: `${prefix}set_mail_config_delete`,
  getAuditLog: `${prefix}get_system_log_list`,
  systemParamsList: `${prefix}get_system_config_list`,
  systemParamsUpdate: `${prefix}set_system_param_modify`,
  paramsType: `${prefix}get_sys_params_config_filter_list`,
  codeList: `${prefix}get_system_dict_menu`,
  codeItemList: `${prefix}get_dict_son_config`,
  addCodeItem: `${prefix}set_dict_son_config`,
  updateCodeItem: `${prefix}set_dict_son_update`,
  deleteCodeItem: `${prefix}set_dict_son_del`,
  addCode: `${prefix}add_task_spm_dict_index`,
  getFolderMenu: `${prefix}get_folder_menu`,
  getMenuUserGroup: `${prefix}get_user_group_menu`,
  getNewUserGroup: `${prefix}set_user_group_menu`,
  getModifyUserGroup: `${prefix}set_user_group_menu_update`,
  getAlertUserGroup: `${prefix}get_alert_group_list`,
  newAlertUser: `${prefix}set_alert_group`,
  updateAlertUser: `${prefix}set_alert_group_menu`,
  getTemplateList: `${prefix}get_template_list`,
  updateTemplate: `${prefix}set_template_update`,
  getSystemCode: `${prefix}get_system_code`,
  dataExport: `${prefix}set_data_file_export`,
  exporting: `${prefix}file_download_quick`,
  getDataProcessing: `${prefix}get_data_process_info`,
  startProcessing: `${prefix}get_data_process_info`,
  progressChart: `${prefix}get_data_progress_chart`,
  progressStatus: `${prefix}get_data_progress_status`,
  progressBar: `${prefix}get_data_progress_bar`,
};
