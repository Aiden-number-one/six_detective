/**
 * Author: lixiaojie
 * Email: lixiaojie@szkingdom.com
 * Date: 2019-05-07
 * Time: 11:01
 */
define((require, exports, module) => {
    require("plugins/jstree/dist/jstree");
    require("plugins/jstree/dist/themes/default/style.css");
    require("plugins/select2/js/select2.js");
    require("plugins/select2/css/select2.css");
    require("plugins/bootstrap-fileinput/bootstrap-fileinput.js");
    require("plugins/bootstrap-fileinput/bootstrap-fileinput.css");
    //codemirror
    require("plugins/codemirror/codemirror.css");
    require("plugins/codemirror/codemirror.js");
    require("plugins/select2/css/select2-compatible.css");
    require("plugins/codemirror/addon/hint/show-hint.css");
    require("plugins/codemirror/addon/hint/show-hint.js");
    require("plugins/codemirror/addon/hint/sql-hint.js");
    require("plugins/codemirror/clike");
    require("plugins/codemirror/sql");
    // sql format
    require("plugins/sql-formatter-2.3.0/sql-formatter");
    require("plugins/drag/kd_drag.js");
    const PAGE = location.hash.replace("#", ".page-");
    // 左侧树公共操作
    const treeCommon = require("assets/js/global/treeCommon");
    const tree = new treeCommon(PAGE, "#J_dataModel_tree", "#J_dataModel_query_btn", "#J_dataModel_query", "7");

    let showContent = {};

    showContent._load = () => {
        tree.getTask(); // 查询左侧树
        showContent.getdict();  //查询字典
        showContent.field()  //查询字典
    };

    /**
     * @Description: 查询左侧树
     * @param {type} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-07 16:30:03
     */
    showContent.getTaskList = params => {
        let folderId = $("#J_dataModel_tree li[aria-selected=true]").attr("folderId");
        let _params = {
            folderId
        }; // 这里用来传特殊参数
        _params = Object.assign(_params, params);
        $.kingdom.getList({
            apiName: "kingdom.retl.get_folder_menu",
            apiVision: "v4.0",
            params: _params,
            tableId: "J_dataModal_list",
            // pageId: "J_task_page",
            template: "data-model/template/modal-list.handlebars",
            cb: showContent.getTaskList
        });
    };
    /**
     * @Description: 查询字典  新增或者修改的时候用 模型数据表 DATA_MODEL_THEME
     * @param {type} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-07 16:30:22
     */
    showContent.getdict = params => {
        $.kingdom.doKoauthAdminAPI("kingdom.retl.get_all_dict_data_list", "v4.0", params || {}, data => {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                if (items && items.length > 0) {
                    showContent.dict = items[0].DATA_MODEL_THEME;
                }
            }
        })
    }
    /**
     * @Description: 查询字典  新增或者修改的时候用 属性类表   FIELD_TYPE
     * @param {type}  
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-08 15:41:38
     */
    showContent.field = params => {
        $.kingdom.doKoauthAdminAPI("kingdom.retl.get_all_dict_data_list", "v4.0", params || {}, data => {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                if (items && items.length > 0) {
                    showContent.fieldType = items[0].FIELD_TYPE;
                }
            }
        })
    }
    /**
     * @Description: 查询模型数据表
     * @param {string} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-07 16:30:40
     */
    showContent.getDataModel = params => {
        let folderId = $("#J_dataModel_tree li[aria-selected=true]").attr("folderId");
        let _params = {
            folderId
        };
        $.kingdom.doKoauthAdminAPI("kingdom.retl.get_data_model_info", "v4.0", _params, data => {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                if (items && items.length > 0) {
                    require.async("./template/modal-list.handlebars", compiled => {
                        $("#J_dataModal_list").html(compiled(items));
                        $("#J_dataModal_list tr:first").click();
                    });
                } else {
                    $(`${PAGE} #J_dataModal_list`).html(`<tr class="lastTr"><td colspan="9" class="t-c">暂无数据</td></tr>`);
                    $(`${PAGE} #J_dataModal_type_list`).html(`<tr class="lastTr"><td colspan="10" class="t-c">暂无数据</td></tr>`);
                }
            } else {
                toastr.error(data.bcjson.msg);
                $(`${PAGE} #J_dataModal_list`).html(`<tr class="lastTr"><td colspan="9" class="t-c">暂无数据</td></tr>`);
                $(`${PAGE} #J_dataModal_type_list`).html(`<tr class="lastTr"><td colspan="10" class="t-c">暂无数据</td></tr>`);

            }
        });
    }

    /**
     * @Description: 添加的时候 查询接口左边树的接口
     * @param {type} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-07 17:22:39
     */
    showContent.treeData = params => {
        $.kingdom.doKoauthAdminAPI("kingdom.retl.get_folder_menu", "v4.0", { "fileType": "7" }, data => {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                //用于选择所属目录
                var folderNameHtml = "";
                if (items && items.length > 0) {
                    $.each(items, function (index, val) {
                        foldName = val.foldName.substring(val.foldName.lastIndexOf("\/") + 1, val.foldName.length);
                        folderNameHtml += `
                            <option value="${val.folderId}"> ${foldName} </option>
                        `
                    })
                }
                //用于试用范围下拉选择 
                var dictnameOption = "";
                for (var i in showContent.dict) {
                    dictnameOption += `<option value="${i}">${showContent.dict[i]}</option>`
                }
                var html = `
                <tr edit="1" addNew="${params.addNew}">
                    <td> <input class="form-control input-small" value="${params.tableId}"> </td>
                    <td> <input class="form-control input-small" value="${params.chianeseName}"> </td>
                    <td> <input class="form-control input-small" value="${params.englishName}"> </td>
                    <td class="foldername"> 
                        <select class="form-control input-small">
                            ${folderNameHtml}
                        </select> 
                    </td>
                    <td> <input class="form-control input-small" value="${params.dbTablespace}"> </td>
                    <td> <input class="form-control input-small" value="${params.dbUser}"> </td>
                    <td class="dictname">
                        <select class="form-control input-small">
                            ${dictnameOption}
                        </select>
                    </td>
                    <td> <input class="form-control input-small" value="${params.remark}"> </td>
                    <td> 
                        <a class="J_dataModel_save">保存</a>
                        <a class="J_dataModel_edit hide">编辑</a> 
                        <a class="J_dataModel_cancel">取消</a> 
                        <a class="J_dataModel_del">删除</a> 
                    </td>
                </tr>`;
                if(!params.isNull){
                    $(`${PAGE} #J_dataModal_list`).html(html);
                }else{
                    $(`${PAGE} #J_dataModal_list`).append(html);
                }
                $(`${PAGE} #J_dataModal_list tr[edit=1] td`).css("padding", "4px");
                $(`${PAGE} #J_dataModal_list .dictname select`).val(params.dictId);
                $(`${PAGE} #J_dataModal_list .foldername select`).val(params.folderId);
            } else {
                toastr.error(data.bcjson.msg);
            }
        })
    }
    /**
     * @Description: 修改的时候 查询接口左边树的接口
     * @param {type} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-07 20:50:58
     */
    showContent.treeDataEdit = params => {
        $.kingdom.doKoauthAdminAPI("kingdom.retl.get_folder_menu", "v4.0", { "fileType": "7" }, data => {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                //用于选择所属目录
                var folderNameHtml = "";
                if (items && items.length > 0) {
                    $.each(items, function (index, val) {
                        foldName = val.foldName.substring(val.foldName.lastIndexOf("\/") + 1, val.foldName.length);
                        folderNameHtml += `
                            <option value="${val.folderId}"> ${foldName} </option>
                        `
                    })
                }
                //用于试用范围下拉选择 
                var dictnameOption = "";
                for (var i in showContent.dict) {
                    dictnameOption += `<option value="${i}">${showContent.dict[i]}</option>`
                }
                var html = `
                    <td> <input class="form-control input-small" value="${params.tableId}"> </td>
                    <td> <input class="form-control input-small" value="${params.chianeseName}"> </td>
                    <td> <input class="form-control input-small" value="${params.englishName}"> </td>
                    <td class="foldername">
                        <select class="form-control input-small">
                            ${folderNameHtml}
                        </select> 
                    </td>
                    <td> <input class="form-control input-small" value="${params.dbTablespace}"> </td>
                    <td> <input class="form-control input-small" value="${params.dbUser}"> </td>
                    <td class="dictname">
                        <select class="form-control input-small">
                            ${dictnameOption}
                        </select>
                    </td>
                    <td> <input class="form-control input-small" value="${params.remark}"> </td>
                    <td> 
                        <a class="J_dataModel_save">保存</a>
                        <a class="J_dataModel_edit hide">编辑</a> 
                        <a class="J_dataModel_cancel">取消</a> 
                        <a class="J_dataModel_del">删除</a> 
                    </td>
                `;
                $(`${PAGE} #J_dataModal_list tr:eq(${params.index})`).html(html);
                $(`${PAGE} #J_dataModal_list tr:eq(${params.index})`).attr({ edit: "1", addNew: 0 })
                $(`${PAGE} #J_dataModal_list tr[edit=1] td`).css("padding", "4px");
                $(`${PAGE} #J_dataModal_list .dictname select`).val(params.dictId);
                $(`${PAGE} #J_dataModal_list .foldername select`).val(params.folderId);
            } else {
                toastr.error(data.bcjson.msg);
            }
        })
    }
    /**
     * @Description: 模型数据表 > 新增保存/修改保存/删除
     * @param {Object} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-07 16:30:55
     */
    showContent.setModify = (params, str) => {
        $.kingdom.doKoauthAdminAPI("kingdom.retl.set_data_model_info_modify", "v4.0", params, data => {
            App.unblockUI();
            if (data.bcjson.flag == "1") {
                toastr.success(data.bcjson.msg);
                if (str) {
                    str.tr.attr({
                        tableId: str.tableId,
                        chianeseName: str.chianeseName,
                        englishName: str.englishName,
                        folderId: str.folderId,
                        folderName: str.folderName,
                        dbTablespace: str.dbTablespace,
                        dictId: str.dictId,
                        dictName: str.dictName,
                        dbUser: str.dbUser,
                        remark: str.remark,
                        edit: 0,
                        addNew: 0,
                    })
                    str.tr.children("td").css("padding", "8px");
                    str.tr.html(
                        `<td class="t-c"> ${str.tableId} </td>
                        <td> ${str.chianeseName} </td>
                        <td> ${str.englishName} </td>
                        <td class="foldername"> ${str.folderName} </td>
                        <td> ${str.dbTablespace} </td>
                        <td> ${str.dbUser} </td>
                        <td class="dictname"> ${str.dictName} </td>
                        <td title="${str.remark}"> <div>${str.remark}</div> </td>
                        <td> 
                            <a class="J_dataModel_save hide">保存</a>
                            <a class="J_dataModel_edit">编辑</a> 
                            <a class="J_dataModel_cancel hide">取消</a> 
                            <a class="J_dataModel_del hide">删除</a> 
                        </td>
                        `
                    );
                }
                showContent.getDataModel();
            }
            else {
                toastr.error(data.bcjson.msg);
            }
        })
    }
    /** 
     * @Description: 获取 -- 数据表-组成属性类表
     * @param {string}
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-07 21:26:21
     */
    showContent.getMember = params => {
        $.kingdom.doKoauthAdminAPI("kingdom.retl.get_model_member_info", "v4.0", params, data => {
            if(data.bcjson.flag == "1"){
                var items = data.bcjson.items;
                if(items && items.length>0){
                    require.async("./template/model_member-list.handlebars", compiled => {
                        $("#J_dataModal_type_list").html(compiled(items));
                    });
                }else{
                    $(`${PAGE} #J_dataModal_type_list`).html(`<tr class="lastTr"><td colspan="10" class="t-c">暂无数据</td></tr>`); 
                }
            }else{
                toastr.error(data.bcjson.msg);
            }
        })
    }

    /**
     * @Description: 数据表-组成属性类表   新增保存  编辑保存  删除
     * @param {type} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-08 14:19:44
     */
    showContent.setMember = params =>{
        $.kingdom.doKoauthAdminAPI("kingdom.retl.set_model_member_info_modify", "v4.0", params, data => {
            App.unblockUI();
            if(data.bcjson.flag == "1"){
                toastr.success(data.bcjson.msg);
                var tableId = $(`${PAGE} #J_dataModal_list tr.active`).attr("tableId");
                showContent.getMember({tableId});
            }else{
                toastr.error(data.bcjson.msg);
            }
        })
    }

    /**
     * @Description: 模型导出
     * @param {type} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-08 17:03:09
     */
    // 获取文件地址
    showContent.export = params => {
        return new Promise((resolve, reject) => {
            $.kingdom.doKoauthAdminAPI("kingdom.retl.get_data_model_exp_list", "v4.0", params, data => {
                if (data.bcjson.flag == "1") {
                    resolve(data);
                } else {
                    App.unblockUI();
                    toastr.error(data.bcjson.msg);
                }
            });
        });
    };
    // 获取downloadToken
    showContent.listImport2 = (params, i) => {
        return new Promise((resolve, reject) => {
            $.kingdom.doKoauthAdminAPI("kingdom.retl.file_info", "v4.0", params, data => {
                if (data.bcjson.flag == "1") {
                    resolve(data);
                } else {
                    App.unblockUI();
                    toastr.error(data.bcjson.msg);
                }
            });
        });
    };
    // 下载文件
    showContent.listImport3 = (params, i) => {
        let url = "/retl/rest/admin/v4.0/kingdom.retl.file_download.json?p=" + encodeURI(JSON.stringify(params));
        try {
            let a = document.createElement("a");
            a.href = url,
                a.download = url,
                a.click();
            App.unblockUI();
        } catch (e) {
            console.error(e);
        }
    };
    /**
     * @Description: 建表
     * @param {Object} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-08 17:35:20
     */    
    showContent.addTable = params =>{
        $.kingdom.doKoauthAdminAPI("kingdom.retl.set_new_table_info", "v4.0", params, data => {
            if(data.bcjson.flag == "1"){
                var items = data.bcjson.items;
                $(`${PAGE} #add_table`).modal("show");
                if(items && items.length>0){
                    require.async("./template/table-list.handlebars", compiled => {
                        $(`${PAGE} #J_table_list`).html(compiled(items));
                    });
                }else{
                    $(`${PAGE} #J_table_list`).html(`<tr><td colspan="7" class="text-center">暂无数据</td></tr>`);
                }
            }else{
                $(`${PAGE} #J_table_list`).html(`<tr><td colspan="7" class="text-center">暂无数据</td></tr>`);  
                toastr.error(data.bcjson.msg);
            }
        })
    }


    /**
     * @Description: 数据查询
     * @param {string} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-08 19:45:59
     */
    showContent.dataQuery = params =>{
        $.kingdom.doKoauthAdminAPI("kingdom.retl.get_model_data_info", "v4.0", params, data => {
            if(data.bcjson.flag == "1"){
                var items = data.bcjson.items;
                if(items && items.length){
                    var thead = "<tr>",tbody = "";
                    $.each(items,function(k,v){
                        if(k==0){
                            for(var i in v){
                                thead += `<th>${i}</th>` 
                            }
                            thead+="</tr>"
                        }
                        tbody+="<tr>";
                        for(var i in v){
                            tbody += `<td>${v[i]}</td>` 
                        }
                        tbody+="</tr>";
                    })
                    $(`${PAGE} #J_data-query_list thead`).html(thead);
                    $(`${PAGE} #J_data-query_list tbody`).html(tbody);
                    $(`${PAGE} #data-query`).modal("show");
                }else{
                    toastr.info("暂无数据");
                }
            }else{
                toastr.error(data.bcjson.msg);
            }
        })
    }
    /**
     * @Description: 建表取消
     * @param {type} 
     * @return: 
     * @Author: lixiaojie
     * @Date: 2019-05-09 13:56:52
     */
    showContent.tabledel = params =>{
        $.kingdom.doKoauthAdminAPI("kingdom.retl.set_model_physics_table_del", "v4.0", params, data => {
            if(data.bcjson.flag == "1"){
                $(`${PAGE} #add_table`).modal("hide");
            }else{  
                toastr.error(data.bcjson.msg);
            }
        })
    }
    module.exports = showContent;
});