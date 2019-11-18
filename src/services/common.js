/*
 * @Description: 公共接口
 * @Author: mus
 * @Date: 2019-09-19 19:41:36
 * @LastEditTime: 2019-11-14 14:04:30
 * @LastEditors: lan
 * @Email: mus@szkingdom.com
 */
const prefix = '';

export default {
  getDict: 'kingdom.retl.get_all_dict_data_list', // 获取字典
  // getMenu: 'bayconnect.superlop.get_acl_menu', // 获取数据门户主题列表
  getMenu: 'mock/run/7765f3a2-a030-4578-a016-cc13c4156136', // Mock
  getDatas: 'kingdom.retl.getDatas',
  delDatas: 'kingdom.retl.delDatas',
  getDataSourceList: 'kingdom.retl.getDataSourceList',
  getLogin: 'get_website_login', // 登录
  getLoginStatus: 'get_user_operate_info', // 判断登录状态
  getApproval: `${prefix}get_audit_history_list_page`,
  getConfig: `${prefix}get_audit_config_list_page`,
  addConfig: `${prefix}set_audit_config_add`,
  saveConfig: `${prefix}set_audit_config_save`,
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
  getSchedule: `${prefix}get_schedule_list_page`,
  scheduleDelete: `${prefix}set_schedule_delete_batch`,
  scheduleModify: `${prefix}set_schedule_modify`,
  downloadFile: `${prefix}file_download_quick`,
  getUserList: `${prefix}get_user_list_impl`,
  addUser: `${prefix}set_add_customer`,
  updateUser: `${prefix}set_user_edit`,
  operationUser: `${prefix}set_user_service_impl`,
  emailList: `${prefix}get_mail_config_list`,
  addEmail: `${prefix}set_mail_config_save`,
  deleteEmail: `${prefix}set_mail_config_delete`,
  getAuditLog: `${prefix}get_bex_run_log_list_page`,
  systemParamsList: `${prefix}get_sys_params_config_list`,
  systemParamsUpdate: `${prefix}set_sys_params_config_update`,
  paramsType: `${prefix}get_sys_params_config_filter_list`,
  codeList: `${prefix}get_system_dict_menu`,
  codeItemList: `${prefix}get_dict_son_config`,
  addCodeItem: `${prefix}set_dict_son_config`,
  updateCodeItem: `${prefix}set_dict_son_update`,
  deleteCodeItem: `${prefix}set_dict_son_del`,
  addCode: `${prefix}add_task_spm_dict_index`,
  getFolderMenu: `${prefix}get_folder_menu`,
};
