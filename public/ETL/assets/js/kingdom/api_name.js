define(function(require, exports, module) {
    /*
        本文件用于管理api
    */
    var apiname = apiname || {};
    /**************************产品录入接口****************************************************/

    /******************************提前还款管理****************************************************/


    /*******************************平台管理***************************/





    /***********************************员工管理***********************************************/
    //账户组就是角色，现在没有角色组一说

    //新增商户用户
    apiname.addEmployee = "kingdom.ktrade.set_dis_employee_add";
    //删除商户用户
    apiname.delEmployee = "kingdom.ktrade.set_distributor_employee_del";
    //更新商户用户
    apiname.editEmployee = "kingdom.ktrade.set_distributor_employee_upd";
    //查询商户
    apiname.getEmployeeList = "kingdom.ktrade.get_distributor_employee_info";
    //商户用户角色组管理-新增角色组
    apiname.addRoleGroup = "kingdom.ktrade.set_dis_role_group_add";
    //商户用户角色管理-新增角色
    apiname.addRole = "kingdom.ktrade.set_dis_role_add";
    //商户用户角色
    apiname.getEmployeeGroupList = "kingdom.ktrade.get_role_info";
    //角色组查询
    apiname.getRoleGroupList = "kingdom.ktrade.get_dis_role_group_list";
    //获取商户员工菜单列表
    apiname.getMenuList = "kingdom.ktrade.get_dis_employee_menu";
    //获取商户员工菜单列表
    apiname.removeUser = "kingdom.ktrade.set_member_status";
    //查询报表任务详情
    apiname.reportflowitems = "kingdom.krcs.get_task_detail_info_report_list";

    //begin*******************************审核管理*****************************************/
    // 查询审核任务
    // 入参busiAlias--上线审核：audit_product_online；
    apiname.getAuditTask = "kingdom.krcs.get_bpm_audit_daiban_task_list";

    // 查询产品信息
    apiname.getProductInfo = "kingdom.ktrade.get_admin_pif_bond_detail";

    // 查询产品附件信息
    apiname.getProductFile = "kingdom.ktrade.get_pif_bond_attachment_info";

    // 查询所有流程
    apiname.getAuditProcess = "kingdom.krcs.get_bpm_config_list";
    // 查询历史审核信息
    apiname.getHisAuditTask = "kingdom.krcs.get_bpm_audit_history_task_list";

    //新增审核流程
    apiname.setAuditProcess = "kingdom.krcs.set_bpm_config_add";
    //修改审核流程
    apiname.modifyAuditProcess = "kingdom.krcs.set_bpm_config_update";
    // 获取审核分类
    apiname.getAuditType = "kingdom.krcs.get_bpm_config_type";

    // 给流程文件，生成流程文件id
    apiname.setAuditProcessId = "kingdom.ktrade.set_bpm_workFlowDeploy";

    // 获取流程文件id列表
    apiname.getAuditProcessFileIDList = "kingdom.ktrade.get_process_definition";

    // 获取审核人列表
    apiname.getAuditorList = "kingdom.krcs.get_bpm_config_auditor_list";

    // 设置审核人
    apiname.setAuditor = "kingdom.krcs.set_bpm_config_auditors";

    //end************************************审核管理*************************************/
    //获取审核列表
    apiname.getWorkflowList = 'kingdom.ktrade.get_cur_process_by_busiAlias';
    //进行审核操作
    apiname.setWorkflowTaskAudit = "kingdom.krcs.set_bpm_apply_task_status_upd";
    //begin*********************************系统设置*************************************/




    /***************************************门户管理************************************************/
    //获取广告分类列表
    apiname.getAdvCatList = "kingdom.ktrade.get_cms_adv_type_list";
    //获取广告子类别
    apiname.getAdvCatEz = "kingdom.ktrade.get_cms_adv_type";
    //获取广告列表
    apiname.getAdvList = "kingdom.ktrade.get_cms_adv_list";
    //添加广告类别
    apiname.addAdvCat = "kingdom.ktrade.set_cms_adv_type";
    //删除广告类别
    apiname.deleteAdvCat = "kingdom.ktrade.set_cms_adv_type_del";
    //删除广告
    apiname.deleteAdv = "kingdom.ktrade.set_cms_adv_delete";
    //添加广告
    apiname.addAdv = "kingdom.ktrade.set_cms_adv";
    //获取广告详情
    apiname.getAdvByid = "kingdom.ktrade.get_cms_adv_info";
    //获取查询新闻分类
    apiname.getNewsCatList = "kingdom.ktrade.get_cms_news_cat";
    //获取新闻资讯列表
    apiname.getNewsList = "kingdom.ktrade.get_cms_news_list";
    //获取新闻文章详情
    apiname.getNewsListByid = "kingdom.ktrade.get_cms_news_info";
    //新增或者修改新闻文章接口
    apiname.addeNews = "kingdom.ktrade.set_cms_news";
    //删除新闻
     apiname.deleteNews = "";
     //查询次级下拉菜单
     apiname.getNewsListS ="kingdom.ktrade.get_cms_news_cat";
    //删除新闻
    apiname.deleteNews = "set_cms_news_delete";
    //复制新闻
    apiname.copyNewsList = "set_cms_news_copy";


    /**************帐户类******************/
    //经纪商修改登录密码
    apiname.setDistributorLoginPwd = "kingdom.ktrade.set_distributor_login_pwd";

    /**************帐户类******************/
    //字典
    apiname.getDictInfo = "kingdom.ktrade.get_dict_info";























    /***********************************kingt4.0**********************************************************/










    /****************************************鉴权的接口  结束******************************************/
    module.exports = apiname;
});
