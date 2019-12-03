define(function(require, exports, module) {
    require("js/kingdom/ajaxdata");
    require("js/kingdom/api_name");
    require("plugins/jstree/dist/jstree");
    require("plugins/jstree/dist/themes/default/style.css");
    require("plugins/select2/js/select2.js");
    require("plugins/select2/css/select2.css");
    require("plugins/drag/kd_drag.js");
    const PAGE = location.hash.split("?")[0].replace("#", ".page-");
    // 左侧树公共操作
    const treeCommon = require("assets/js/global/treeCommon");
    const tree = new treeCommon(PAGE, "#J_flow_tree", "#J_jobname_query_btn", "#J_jobname_query", "1");

    var showContent = {};
    showContent.load=function(){
        App.initUniform(); // 初始化checkbox
        new Promise((resolve, reject) => {
            tree.getTask("",true,true,"",resolve); // 查询左侧树
        }).then(function(){
        let folderId = location.search.substring(1).split("=")[1];
          $(`#J_flow_tree [folderId=${folderId}]>a`).click();
            })
    }
    // 查询任务列表
    showContent.getWorkList = params => {
        let folderId = $("#J_flow_tree li[aria-selected=true]").attr("folderId") || $.kingdom.getUrlParameter('folderId');
        let _params = {
            folderId,
        }; // 这里用来传特殊参数
        _params = Object.assign(_params, params);
        $.kingdom.getList({
            apiName: "bayconnect.superlop.get_jobs_list",
            apiVision: "v4.0",
            params: _params,
            tableId: "J_work_table",
            pageId: "J_work_page",
            template: "report-table-info-manage/template/work-list.handlebars",
            formName: "J_work_form",
            cb: showContent.getWorkList
        });
    };
    // 作业复制
    showContent.copyWorkList = params => {
        App.blockUI({
            boxed: true,
            message: "处理中..."
        });
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_job_info_copy", "v4.0", params, data => {
            if (data.bcjson.flag == "1") {
               showContent.getWorkList();
                toastr.success(data.bcjson.msg);
            // 正常返回数据
            } else {
                toastr.error(data.bcjson.msg);
            }
            App.unblockUI();
        });
    };

    // 移动任务
    showContent.moveWorkInfo = params => {
        App.blockUI({
            boxed: true,
            message: "处理中..."
        });
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_job_info_change_folder", "v4.0", params, data => {
            if (data.bcjson.flag == "1") {
                toastr.success(data.bcjson.msg);
                $(`#J_flow_tree li[folderId=${params.targetFolderId}]>a`).click();
                showContent.getWorkList();
                $("#J_work_move_modal").modal("hide");
            } else {
                toastr.error(data.bcjson.msg);
            }
            App.unblockUI();
        });
    };

    // 删除任务
    showContent.delyWorkList = params => {
        App.blockUI({
            boxed: true,
            message: "删除中..."
        });
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_job_info", "v4.0", params, data => {
            if (data.bcjson.flag == "1") {
                toastr.success(data.bcjson.msg);
                showContent.getWorkList();
            } else {
                toastr.error(data.bcjson.msg);
            }
            App.unblockUI();
        });
    };

    // 查询任务列表
    showContent.getTaskList = params => {
        let _params = {
            jobId: sessionStorage.getItem("jobId"),
            pageSize: "999",
        }; // 这里用来传特殊参数
        _params = Object.assign(_params, params);
        $.kingdom.getList({
            apiName: "bayconnect.superlop.get_job_child_tasks_info",
            apiVision: "v4.0",
            params: _params,
            tableId: "J_check_task_table",
            // pageId: "J_check_task_page",
            template: "report-table-info-manage/template/task-list.handlebars",
            cb: showContent.getTaskList
        });
    };

    module.exports = showContent;
});