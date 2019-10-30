/*
 * @Description: 公共接口
 * @Author: mus
 * @Date: 2019-09-19 19:41:36
 * @LastEditTime: 2019-10-21 09:38:12
 * @LastEditors: lan
 * @Email: mus@szkingdom.com
 */
export default {
  getDict: 'kingdom.retl.get_all_dict_data_list', // 获取字典
  // getMenu: 'bayconnect.superlop.get_acl_menu', // 获取数据门户主题列表
  getMenu: 'mock/run/7765f3a2-a030-4578-a016-cc13c4156136', // Mock
  getLogin: 'bayconnect.superlop.get_website_login', // 登录
  getDatas: 'kingdom.retl.getDatas',
  delDatas: 'kingdom.retl.delDatas',
  getDataSourceList: 'kingdom.retl.getDataSourceList',
  getApproval: 'bayconnect.superlop.get_approval_list_page',
  getConfig: 'bayconnect.superlop.get_audit_config_list_page',
  getTemplate: 'bayconnect.superlop.get_notice_template_list',
  templateSave: 'bayconnect.superlop.set_notice_template_save',
  getModelList: 'bayconnect.superlop.get_workflow_model_list_page',
  createModel: 'bayconnect.superlop.set_workflow_model_create',
  deleteModel: 'bayconnect.superlop.set_workflow_model_delete',
  importModel: 'bayconnect.superlop.set_workflow_model_import',
  getModelImage: 'bayconnect.superlop.get_workflow_model_image',
  exportModel: 'bayconnect.superlop.set_workflow_model_export',
  deployModel: 'bayconnect.superlop.set_workflow_model_deploy',
  downloadFile: 'bayconnect.superlop.file_download_quick',
};
