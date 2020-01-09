var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 * @Author: limin01
 * @Date: 2018-08-10
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-04-19 14:47:38
 */

define(function (require, exports, module) {
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
    require("plugins/drag/kd_drag.js");
    // sql format
    require("plugins/sql-formatter-2.3.0/sql-formatter");
    var PAGE = location.hash.split("?")[0].replace("#", ".page-");
    // 左侧树公共操作
    var treeCommon = require("assets/js/global/treeCommon");
    var tree = new treeCommon(PAGE, "#J_foldname_tree", "#J_foldname_query_btn", "#J_foldname_query", "2");

    var showContent = {};
    // 全局变量都在此声明
    showContent.dbTable = null;
    showContent.columnFileName = null;
    showContent.columnFileData = null;
    showContent.sourceTables = null; // 缓存源表数据 方便赋值
    showContent.targetTable = null; // 缓存目标表数据 方便赋值
    showContent.procedureName = null; // 缓存存储过程名字 方便赋值
    showContent.dataFildItems = null; // 数据抽取任务->字段映射-> 插入的字段 保存查出的数据
    showContent.parentFolderId = null; // 新增树时 用来保存父级id
    showContent.applyParam = null; // 数据剖析 参数
    showContent.successParam = null; // 数据剖析 成功条件
    showContent._load = function () {
        $.each($("input[type=text]:not([maxlength],[readonly])"), function () {
            $(this).attr("maxlength", "32");
        });
        $("input[name=exportPath]").removeAttr("maxlength");
        $("input[name=exportName]").removeAttr("maxlength");
        $("input[name=fileName]").removeAttr("maxlength");
        $.each($("textarea:not([maxlength],[readonly])"), function () {
            $(this).attr("maxlength", "256");
        });
        $("[name=submitNum]").val("4096");
        showContent.initForm(); // 初始化表单校验
        App.initUniform(); // 初始化checkbox
        tree.getTask(); // 查询左侧树

        // 字典 
        $.kingdom.getDict("TASK_TYPE", "#J_task_type");
        $.kingdom.getDict("TASK_TYPE", "#J_task_option_1", "", "task-config-setting/template/task-option.handlebars"); // 点击新增 任务类型下拉选项
        $.kingdom.getDict("ROLLBACK_FLAG", "[name=rollbackFlag]"); // 数据抽取任务->目标->提交方式
        $.kingdom.getDict("BEFORE_RULE", "[name=beforeRule]"); // 数据抽取任务->目标->目标写入前操作
        // 屏蔽部分option选项
        new Promise(function (resolve, reject) {
            $.kingdom.getDict("FILETYPE", "select[name=fileType]", resolve); // 导入->导入设置-> 文件类型
        }).then(function (data) {
            // $("#J_form_TI [data-filetype-index=1]").find("option:contains('csv')").css("display", "none")
        });
        $.kingdom.getDict("OPER_TYPE", "[fakename=operation]"); // 存储过程->成功判断条件->操作符   
        new Promise(function (resolve, reject) {
            $.kingdom.getDict("EXTEND_NAME", "[name=extendName]", resolve); // 导出设置->导出设置->导出文件类型
        }).then(function (data) {
            $("#J_form_TF [name=extendName]").find("option:contains('txt')").siblings().css("display", "none");
        });
        $.kingdom.getDict("CON_SEPARATOR", "[name=taskSeparator]"); // 导出设置->导出设置->分隔符
        $.kingdom.getDict("FILE_CHARSET", "[name=codeType]"); // 导出设置->导出设置->编码 && 发送邮件->邮件内容->编码
        $.kingdom.getDict("SAFE_CONNECT_TYPE", "[name=safeConnectType]"); // 发送邮件->邮件地址->安全连接类型
        $.kingdom.getDict("COMPRESS_TYPE", "[name=compressType]"); // 压缩打包->存储过程设置-> 方向
        $.kingdom.getDict("OPER_TYPE", "[fakename=operator]"); // 存储过程->成功判断条件->操作符
        // $.kingdom.getDict("DQR_NAME", "[fakename=analyType]"); // 数据剖析->参数-> 剖析类
        // codemirror 初始化 
        createCodeMirror("cm_TE", "#J_select2_single_tab_1_1", "J_cm_TE", PAGE + " a[href=\"#tab_1_2\"]");
        createCodeMirror("cm_TE_2", "#J_select2_single_tab_1_2", "J_cm_TE_2", PAGE + " a[href=\"#tab_1_3\"]");
        createCodeMirror("cm_TE_3", "#J_select2_single_tab_1_3", "J_cm_TE_3", PAGE + " a[href=\"#tab_1_3\"]");
        createCodeMirror("cm_TT", "#J_modal_TT [name=connectionId]", "J_cm_TT", PAGE + " a[href=\"#tab_2_2\"]");
        createCodeMirror("cm_TV", "#J_modal_TV [name=dbConnection]", "J_cm_TV", PAGE + " a[href=\"#tab_3_2\"]");
        createCodeMirror("cm_TP", "#J_data_source_select2", "J_cm_TP", PAGE + " a[href=\"#tab_4_2\"]");
        createCodeMirror("cm_TF", "#J_select2_single_tab_6_2", "J_cm_TF", PAGE + " a[href=\"#tab_6_2\"]");
        createCodeMirror("cm_TI", "#J_select2_single_tab_1_9", "J_cm_TI", PAGE + " a[href=\"#tab_9_2\"]");
        // createCodeMirror("cm_DQ", "#J_select2_single_tab_11_1", "J_cm_DQ", `${PAGE} a[href="#tab_11_2"]`);
    };

    // 查询任务列表
    showContent.getTaskList = function (params) {
        var folderId = $("#J_foldname_tree li[aria-selected=true]").attr("folderId");
        var _params = {
            folderId: folderId
        }; // 这里用来传特殊参数
        _params = _extends(_params, params);
        $.kingdom.getList({
            apiName: "bayconnect.superlop.get_task_info",
            apiVision: "v4.0",
            params: _params,
            tableId: "J_task_table",
            pageId: "J_task_page",
            template: "task-config-setting/template/task-list.handlebars",
            formName: "J_task_form",
            cb: showContent.getTaskList
        });
    };

    // 返回值变量名 下拉框根据表里数据变化
    showContent.setOptions = function (value) {
        var str = "";
        $.each($("#J_store_params tr:not([data-clone-sample]) [fakename=name]"), function () {
            var v = $(this).val(),
                direction = $(this).parent().siblings().find("[fakename=direction]").val();
            if (v && direction.includes("OUT")) {
                str += "<option value=\"" + v + "\">" + v + "</option>";
            }
        });
        $("[name=returnVariable], [fakename=variable]").html(str);
        if (value) {
            $("[name=returnVariable], [fakename=variable]").val(value);
        }
    };

    // WebAPI任务详情
    showContent.getTaskApiInfo = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_task_api_information", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items[0];
                var modalSelector = $("#J_task_option_1 a[data-id=" + params.taskType + "]").data("target");
                var formName = $(modalSelector).find("form[type=main]").attr("name");
                App.setFormData(formName, items);
                if (modalSelector === '#J_modal_AS') {
                    var apiParamsInputCommon = items.apiParamsInputCommon && JSON.parse(items.apiParamsInputCommon) || [];
                    var apiParamsCommonHtml = '';
                    apiParamsInputCommon.forEach(function (item, index) {
                        if (index === 0) {
                            apiParamsCommonHtml = "<div name=\"apiParamsInputCommon\" style=\"position: relative;height: 60px;\">\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Name\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <input type=\"text\" class=\"form-control\" maxlength=\"64\" value=\"" + item.name + "\" name=\"name\" placeholder=\"64 characters maximum\">\n                                </div>\n                            </div>\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Value\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <input type=\"text\" class=\"form-control\" maxlength=\"64\" name=\"value\" value=\"" + item.value + "\" placeholder=\"64 characters maximum\">\n                                </div>\n                            </div>\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Location\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <select class=\"form-control\" name=\"position\">\n                                    " + (item.position === 'Header' ? ' <option value="Header" selected>Header</option>' : ' <option value="Header">Header</option>') + "\n                                    " + (item.position === 'Body' ? ' <option value="Body" selected>Body</option>' : ' <option value="Body">Body</option>') + "\n                                    </select>\n                                </div>\n                            </div>\n                            <a style=\"position: relative;top: 8px;right: 0;\" title=\"\" id='add'><i class=\"fa fa-plus\"></i></a>\n                        </div>";
                        } else {
                            apiParamsCommonHtml = apiParamsCommonHtml + ("<div name=\"apiParamsInputCommon\" style=\"position: relative;height: 60px;\">\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Name\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <input type=\"text\" class=\"form-control\" maxlength=\"64\" value=\"" + item.name + "\" name=\"name\" placeholder=\"64 characters maximum\">\n                                </div>\n                            </div>\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Value\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <input type=\"text\" class=\"form-control\" maxlength=\"64\" value=\"" + item.value + "\" name=\"value\" placeholder=\"64 characters maximum\">\n                                </div>\n                            </div>\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Location\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <select class=\"form-control\" name=\"position\">\n                                    " + (item.position === 'Header' ? ' <option value="Header" selected>Header</option>' : ' <option value="Header">Header</option>') + "\n                                    " + (item.position === 'Body' ? ' <option value="Body" selected>Body</option>' : ' <option value="Body">Body</option>') + "\n                                    </select>\n                                </div>\n                            </div>\n                            <a style=\"position: relative;top: 8px;right: 0;\" id='del' title=\"\"><i class=\"fa fa-trash-o\"></i></a>\n                        </div>");
                        }
                    });
                    $('#tab_14_2 [name=apiParamsInputCommon]').after(apiParamsCommonHtml);
                    $('#tab_14_2 [name=apiParamsInputCommon]')[0].remove();
                    var apiParamsInput = items.apiParamsInput && JSON.parse(items.apiParamsInput) || [];
                    var apiParamsHtml = '';
                    apiParamsInput.forEach(function (item, index) {
                        if (index === 0) {
                            apiParamsHtml = "<div name=\"apiParamsInput\" style=\"position: relative;height: 60px;\">\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Name\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <input type=\"text\" class=\"form-control\" maxlength=\"64\" value=\"" + item.name + "\" name=\"name\" placeholder=\"64 characters maximum\">\n                                </div>\n                            </div>\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Value\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <input type=\"text\" class=\"form-control\" maxlength=\"64\" name=\"value\" value=\"" + item.value + "\" placeholder=\"64 characters maximum\">\n                                </div>\n                            </div>\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Location\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <select class=\"form-control\" name=\"position\">\n                                    " + (item.position === 'Header' ? ' <option value="Header" selected>Header</option>' : ' <option value="Header">Header</option>') + "\n                                    " + (item.position === 'Body' ? ' <option value="Body" selected>Body</option>' : ' <option value="Body">Body</option>') + "\n                                    </select>\n                                </div>\n                            </div>\n                            <a style=\"position: relative;top: 8px;right: 0;\" title=\"\" id='add'><i class=\"fa fa-plus\"></i></a>\n                        </div>";
                        } else {
                            apiParamsHtml = apiParamsHtml + ("<div name=\"apiParamsInput\" style=\"position: relative;height: 60px;\">\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Name\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <input type=\"text\" class=\"form-control\" maxlength=\"64\" value=\"" + item.name + "\" name=\"name\" placeholder=\"64 characters maximum\">\n                                </div>\n                            </div>\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Value\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <input type=\"text\" class=\"form-control\" maxlength=\"64\" value=\"" + item.value + "\" name=\"value\" placeholder=\"64 characters maximum\">\n                                </div>\n                            </div>\n                            <div class=\"form-group col-md-4\">\n                                <label class=\"control-label col-md-4\">\n                                    <span>Location\uFF1A</span>\n                                </label>\n                                <div class=\"form-group col-md-8\">\n                                    <select class=\"form-control\" name=\"position\">\n                                    " + (item.position === 'Header' ? ' <option value="Header" selected>Header</option>' : ' <option value="Header">Header</option>') + "\n                                    " + (item.position === 'Body' ? ' <option value="Body" selected>Body</option>' : ' <option value="Body">Body</option>') + "\n                                    </select>\n                                </div>\n                            </div>\n                            <a style=\"position: relative;top: 8px;right: 0;\" id='del' title=\"\"><i class=\"fa fa-trash-o\"></i></a>\n                        </div>");
                        }
                    });
                    $('#tab_14_3 [name=apiParamsInput]').after(apiParamsHtml);
                    $('#tab_14_3 [name=apiParamsInput]')[0].remove();
                    var apiParamsOutput = items.apiParamsOutput && JSON.parse(items.apiParamsOutput) || [];
                    if (apiParamsOutput[0]) {
                        $('#tab_14_3 [name=apiParamsOutput] [name=name]').val(apiParamsOutput[0].name);
                        $('#tab_14_3 [name=apiParamsOutput] [name=successful]').val(apiParamsOutput[0].successful);
                        $('#tab_14_3 [name=apiParamsOutput] [name=failed]').val(apiParamsOutput[0].failed);
                    }
                    $('#tab_14_3 [name=requestType]').val(items.requestType);
                    $('#tab_14_3 [name=responseDataFormat]').val(items.responseDataFormat);
                }
                App.updateUniform();
                $(modalSelector + " [type=jstree]").jstree(true).open_all();
                $(modalSelector + " [type=jstree] [folderid=" + items.folderId + "]>.jstree-anchor").click(); // 注：这个click事件写在main.js
                $(modalSelector + " .J_save").data("tasktype", params.taskType).data("type", "edit"); // 把重要参数绑在保存按钮上
                $(modalSelector + " [name=requestSecretWord]").removeAttr("changed"); // 接口返回密码是des加密，是不可逆，用changed属性判断密码是否被修改过 被修改了就再次加密
                $(modalSelector).modal("show");
            }
        });
    };

    // 查询任务详情
    showContent.getTaskInfo = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_task_detail_info", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items[0];
                var modalSelector = $("#J_task_option_1 a[data-id=" + params.taskType + "]").data("target");
                var formName = $(modalSelector).find("form[type=main]").attr("name");
                // 赋值
                showContent.sftpSecretword = items.sftpSecretword;
                App.setFormData(formName, items);

                // 文件格式转换任务
                if (modalSelector === '#J_modal_TFP') {
                    showContent.dbTable = items.dbTable;
                    showContent.columnFileName = items.columnFileName;
                    showContent.columnFileData = items.columnFileData;
                    $("#J_select2_single_tab_13_1").change(); // 来源数据链接
                }
                // 抽取任务
                if (modalSelector === "#J_modal_TE") {
                    // if (items.targetTableFlag == "1") {
                    //     $(`${modalSelector} [name=targetTableFlag]`).click(); // checkbox
                    // }
                    // showContent.keyField = items.keyField; // 3级联动，保存值方便赋值
                    showContent.sourceTables = items.sourceTables;
                    showContent.targetTable = items.targetTable;
                    $("#J_select2_single_tab_1_1").change(); // 来源数据链接
                    $("#J_select2_single_tab_1_3").change(); // 目标数据链接
                    $("[name=submitNum]").val(items.submitNum); // 每行提交行数
                    items.transScript && showContent.cm_TE.setValue(sqlFormatter.format(items.transScript, {
                        language: "n1ql", // Defaults to "sql"
                        indent: "    " // Defaults to two spaces
                    }));
                    items.createTableScript && showContent.cm_TE_2.setValue(sqlFormatter.format(items.createTableScript));
                    items.deleteSql && showContent.cm_TE_3.setValue(sqlFormatter.format(items.deleteSql));
                    // if (items.createTableScript) {
                    //     $("#J_sql_created").attr("contenteditable", "false");
                    // }
                    $("[name=beforeRule]").change();
                    var dataFildItems = JSON.parse(items.mappingInfo).mappingColumn;
                    if (dataFildItems.length > 0) {
                        require.async("./template/data-field-list.handlebars", function (compiled) {
                            $("#J_data_field_tbody").html(compiled(dataFildItems));
                            showContent.haddleDataField.init(dataFildItems);
                            App.initCheckableTable($("#J_data_field_table"));
                        });
                    }
                }
                if (modalSelector === "#J_modal_TT") {
                    $("#J_select2_single_tab_2_2").change();
                    if (items.command) {
                        showContent.cm_TT.setValue(items.command);
                    }
                }
                if (modalSelector === "#J_modal_TV") {
                    $("#J_select2_single_tab_3_2").change();
                    items.variableScript && showContent.cm_TV.setValue(sqlFormatter.format(items.variableScript));
                }
                // 存储过程 
                if (modalSelector === "#J_modal_TP") {
                    showContent.procedureName = items.procedureName;
                    $("#J_data_source_select2").change();
                    var taskParameters = JSON.parse(items.taskParameters);
                    // 参数
                    showContent.haddleParams.setData(taskParameters.parameters);
                    showContent.setOptions(items.returnVariable);
                    $("[fakename=rvariable]").val(taskParameters.returnmessage.rvariable); // 执行返回信息
                    // 成功判断条件
                    $.each($("#J_success_condition [fakename]"), function () {
                        var fakename = $(this).attr("fakename");
                        $(this).val(taskParameters.successcondition[fakename]);
                    });
                }

                // 导入文件 
                if (modalSelector === "#J_modal_TI") {
                    if (items.fileUrl) {
                        $("[data-provides=fileinput]").removeClass("fileinput-new").addClass("fileinput-exists");
                        $(".fileinput-filename").html(items.fileName + " ");
                        $("[data-importtype] [name=fileUrl]").val(items.fileUrl);
                        $("[data-importtype] [name=fileType]").val(items.fileType);
                        $("[data-importtype] [name=fileName]").val(items.fileName);
                        $(PAGE + " select[name=fileType]").change();
                    }
                    showContent.targetTable = items.targetTable;
                    // showContent.keyField = items.keyField; // 3级联动，保存值方便赋值
                    $("#J_select2_single_tab_1_9").val(items.targetConnectionId).change(); // 目标数据连接
                    $("[name=submitNum]").val(items.submitNum).change(); // 每行提交行数
                    $("[name=beforeRule]").change();
                    $("[name=fileClass]").val("TASK");
                    if (items.startImportLine && items.startImportLine !== "1") {
                        $("#J_import_txt_start_line input")[1].click();
                        $("[name=startImportLine]").val(items.startImportLine);
                    } else {
                        $("#J_import_txt_start_line input")[0].click(); // 首行导入
                    }
                    items.deleteSql && showContent.cm_TI.setValue(sqlFormatter.format(items.deleteSql));
                    var _dataFildItems = JSON.parse(items.mappingInfo).mappingColumn;
                    if (_dataFildItems.length > 0) {
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = _dataFildItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var item = _step.value;

                                item.columnName = item.targetColumn;
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        require.async("./template/data-field-list-2.handlebars", function (compiled) {
                            $("#J_data_field_tbody_2").html(compiled(_dataFildItems));
                            showContent.haddleDataField_2.init(_dataFildItems);
                            App.initCheckableTable($("#J_data_field_table_2"));
                        });
                    }
                }

                // 导出文件 
                if (modalSelector === "#J_modal_TF") {
                    // showContent.sourceTable = items.sourceTable;
                    $("#J_select2_single_tab_6_2").change(); // 数据连接
                    items.command && showContent.cm_TF.setValue(sqlFormatter.format(items.command));
                    $("[name=headFlag]").change();
                }

                // 数据剖析
                if (modalSelector === "#J_modal_DQ") {
                    showContent.applyParam = items.applyParam;
                    $("#J_select2_single_tab_11_1").val(items.ruleFolderId).change(); // 所属目录
                }
                // 数据同步
                if (modalSelector === "#J_modal_DR") {
                    $("#J_modify_filename").html("");
                    if (items.sourceUrl !== "all") {
                        $("#tab_12_3 .zdy").click();
                        $("[name=a1006FilesPath]").val(items.sourceUrl);
                    } else {
                        $("#tab_12_3 .all").click();
                    }
                    if (items.isRename === "0") {
                        // 使用点击不修改radio,并不消失修改文件名称部分
                        $("[name=targetFileName]").hide().attr("type", "hidden");
                        $("[name=sourceFileName]").hide().attr("type", "hidden");
                        $("#modify_file_content").hide();
                    }
                    if ($("#modify_file_content [name=targetFileName]").val()) {
                        $("#modify_file_content [name=targetFileName]").blur();
                    }
                }
                // 压缩打包
                if (modalSelector === "#J_modal_TZ") {
                    if (items.a1005FilesPath) {
                        $("#J_TZ_file_range input")[1].click();
                    } else {
                        $("#J_TZ_file_range input")[0].click(); // 压缩文件范围
                    }
                }
                App.updateUniform();
                $(modalSelector + " [type=jstree]").jstree(true).open_all();
                $(modalSelector + " [type=jstree] [folderid=" + items.folderId + "]>.jstree-anchor").click(); // 注：这个click事件写在main.js
                $(modalSelector + " .J_save").data("tasktype", params.taskType).data("type", "edit"); // 把重要参数绑在保存按钮上
                $(modalSelector + " [name=userPassword]").removeAttr("changed"); // 接口返回密码是des加密，是不可逆，用changed属性判断密码是否被修改过 被修改了就再次加密
                $(modalSelector).modal("show");
            }
        });
    };

    // 移动任务
    showContent.moveTaskInfo = function (params) {
        App.blockUI({
            boxed: true,
            message: "Processing..."
        });
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_task_folder_trans", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                toastr.success(data.bcjson.msg);
                $("#J_foldname_tree li[folderId=" + params.targetFolderId + "]>a").click();
                showContent.getTaskList();
                $("#J_task_move_modal").modal("hide");
            } else {
                toastr.error(data.bcjson.msg);
            }
            App.unblockUI();
        });
    };

    // 删除任务
    showContent.delTaskInfo = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_task_info_del", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                App.unblockUI();
                toastr.success(data.bcjson.msg);
                showContent.getTaskList();
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    // 复制任务
    showContent.copyTaskInfo = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_task_info_copy", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                App.unblockUI();
                toastr.success(data.bcjson.msg);
                showContent.getTaskList();
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    // 查看相关作业
    showContent.checkRelateJob = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_relate_job_info", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                if (data.bcjson.lengths > 0) {
                    require.async("./template/job-list.handlebars", function (compiled) {
                        $("#J_relate_job_list").html(compiled(data.bcjson.items));
                    });
                } else {
                    $("#J_relate_job_list").html("<tr><td colspan=\"2\" class=\"text-center\">No Data</td></tr>");
                }
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    // 保存任务信息 新增 编辑 通用
    showContent.setTaskInfo = function (params, oparatetype, cb) {
        App.blockUI({
            boxed: true,
            message: "Processing..."
        });
        var api = oparatetype === "add" ? "bayconnect.superlop.set_task_info" : "bayconnect.superlop.set_task_info_modify";
        $.kingdom.doKoauthAdminAPI(api, "v4.0", params, function (data) {
            App.unblockUI();
            if (data.bcjson.flag == "1") {
                toastr.success(data.bcjson.msg);
                if (typeof cb === "function") cb(data);
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    // 保存WEBAPI任务信息 新增 编辑 通用
    showContent.setWebTaskInfo = function (params, cb) {
        App.blockUI({
            boxed: true,
            message: "Processing..."
        });
        var api = "bayconnect.superlop.set_task_api_information";
        $.kingdom.doKoauthAdminAPI(api, "v4.0", params, function (data) {
            App.unblockUI();
            if (data.bcjson.flag == "1") {
                toastr.success(data.bcjson.msg);
                if (typeof cb === "function") cb(data);
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    // 保存任务信息  通用
    showContent.setEditTaskInfo = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_task_info_modify", "v4.0", params, function (data) {
            // if (data.bcjson.flag == "1") {

            // }
        });
    };

    // 清空内容 通用
    showContent.clearData = function () {
        // 表单清空
        $.each($(".modal form[type=main]"), function () {
            var formName = $(this).attr("name");
            App.clearForm(formName);
        });
        // 特殊字段清空
        showContent.haddleParams.delAllRow();
        // showContent.haddleParams_DQ.delAllRow();
        // showContent.haddleParams_DQ_S.delAllRow();
        $(".select2-hidden-accessible").empty().clearInputs();
        $("[name=returnVariable]").html("");
        $("[name=submitNum]").val("4096");
        $(".modal input").prop("checked", false).parent().removeClass("checked");
        $("#J_sql_preview_table, #J_data_field_tbody, #J_sql_preview_thead, #J_data_field_tbody_2, #J_query_datafield_result_table").html("");
        $("[name=importType]")[0].click();
        $("#J_import_txt_start_line input")[0].click(); // 首行导入    
        $("#tab_12_3 .zdy").click(); // 数据上报新增页面默认
        // 当数据上报页面选中全部后保存 再点新增弹框是否修改文件名称value消失
        $("#J_is_modify_file input[name=isRename]:eq(0)").val("0");
        $("#J_is_modify_file input[name=isRename]:eq(1)").val("1");
        $("#J_modify_filename").html("");
        $("#J_is_modify_file input")[1].click();
        $("#J_TZ_file_range input")[0].click(); // 压缩文件范围
        $("[data-provides=fileinput]").addClass("fileinput-new").removeClass("fileinput-exists"); // 清空文件上传框
        $(".fileinput-filename").html("");
        $("[name=fileClass]").val("TASK");
        showContent.cm_TE.setValue("");
        showContent.cm_TE_2.setValue("");
        showContent.cm_TE_3.setValue("");
        showContent.cm_TT.setValue("");
        showContent.cm_TV.setValue("");
        showContent.cm_TP.setValue("");
        showContent.cm_TI.setValue("");
        // showContent.cm_DQ.setValue("");
        showContent.cm_TF.setValue("");
        $("[name=beforeRule]").change();
        App.updateUniform();
    };

    // 查询数据连接 （目标表和源表）通用
    showContent.getDataSourceList = function (cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_source_config", "v4.0", {}, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                var arr = [{
                    id: "",
                    text: ""
                }];
                if (items && items.length > 0) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var item = _step2.value;

                            arr.push({
                                id: item.connectionId,
                                text: item.connectionName
                            });
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }

                // 数据抽取 -> 数据连接 源
                $("#J_select2_single_tab_1_1").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                });

                // 数据抽取 -> 数据连接 目标
                $("#J_select2_single_tab_1_3").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                });
                // 执行SQL
                $("#J_select2_single_tab_2_2").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                });

                // 变量
                $("#J_select2_single_tab_3_2").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                });
                // 存储任务
                $("#J_data_source_select2").select2({
                    data: arr,
                    placeholder: "- Please select a type -"
                });

                // 导入文本 目标数据源
                $("#J_select2_single_tab_1_9").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                });

                // 文件格式转换 数据源
                $("#J_select2_single_tab_13_1").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                });

                // 导出文本 数据源
                $("#J_select2_single_tab_6_2").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                });

                // 格式转换 数据源
                $("#J_select2_single_tab_13_1").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                });

                // 数据剖析 -> 数据连接 源
                // $("#J_select2_single_tab_11_1").select2({
                //     data: arr,
                //     placeholder: '- Please select a type -',
                // });

                typeof cb === "function" && cb();
            }
        });
    };

    // 查询数据表 通用
    showContent.getTableList = function (params, selector, isTags, cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_metadata_table_info", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                var arr = [{
                    id: "",
                    text: ""
                }];
                var arr2 = [];
                if (items) {
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var item = _step3.value;

                            arr.push({
                                id: item.tableId,
                                text: item.schemName + "." + item.tableName + "(" + (item.tableDesc || item.mdType) + ")"
                            });
                            arr2.push({
                                id: item.tableId,
                                text: item.schemName + "." + item.tableName
                            });
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                }
                $(selector).empty().clearInputs();
                $(selector).select2({
                    data: arr,
                    placeholder: '- Please select a type -',
                    tags: isTags // 是否允许手动输入
                });
                // 把原始值放到data属性上 为了比较是否手动输入
                $(selector).data("origin", arr2);
                // 回调赋值
                typeof cb === "function" && cb();
            }
        });
    };

    // 数据剖析 -> tab2 查询规则文件夹
    showContent.getRuleFolder = function (cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_folder_menu", "v4.0", {
            fileType: "3"
        }, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                var arr = [{
                    id: "",
                    text: ""
                }];
                if (items && items.length > 0) {
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var item = _step4.value;

                            arr.push({
                                id: item.folderId,
                                text: item.foldName
                            });
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }
                }

                // 数据剖析 -> 规则文件夹
                $("#J_select2_single_tab_11_1").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                });

                typeof cb === "function" && cb();
            }
        });
    };

    // 数据剖析 -> tab2 查询规则下拉
    showContent.getRuleList = function (params, cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_rule_info", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items,
                    arr = [];
                if (items && items.length > 0) {
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var item = _step5.value;

                            arr.push({
                                id: item.ruleId,
                                text: item.ruleName
                            });
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                }
                $("#J_select2_multi_tab_11_1").empty().clearInputs();
                // 数据抽取 -> 数据连接 源
                $("#J_select2_multi_tab_11_1").select2({
                    data: arr,
                    placeholder: '- Please select a type -',
                    multiple: true
                }).data("obj", items);
                typeof cb === "function" && cb();
            }
        });
    };

    // 数据抽取任务->源->生成查询语句
    showContent.getSQL = function (params, cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_qry_statement", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                // $("[name=transScript]").val(data.bcjson.items[0].qryStatement);
                // $("#J_sql").html(data.bcjson.items[0].qryStatement);
                var qryStatement = data.bcjson.items[0].qryStatement;
                showContent.cm_TE.setValue(qryStatement);
                // showContent.cm_DQ.setValue(qryStatement);
                typeof cb === "function" && cb(qryStatement);
            }
        });
    };

    // 数据抽取任务->源->查询预览
    showContent.getPreviewSQL = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_qry_statement_result", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                if (!items || items.length === 0) {
                    toastr.info("No Data");
                    return;
                }
                var thead = "<thead><tr><th style=\"width: 40px\"> No </th>",
                    tbody = "<tbody>",
                    len = items.length;
                for (var i = 0; i < len; i++) {
                    var item = items[i];
                    var temp = "<tr><td> " + (i + 1) + " </td>";
                    for (var j in item) {
                        if (i === 0) {
                            thead += "<th> " + j + " </th>";
                        }
                        temp += "<td> " + item[j] + " </td>";
                    }
                    temp += "</tr>";
                    tbody += temp;
                }
                thead += "</tr></thead>";
                tbody += "</tbody>";
                var table = "<div class=\"table-scrollable mt10\" style=\"max-height:500px;\">\n                    <table class=\"table table-striped table-bordered table-hover order-column\">\n                        " + thead + "\n                        " + tbody + "\n                    </table>\n                </div>";
                $("#J_sql_preview_table, #J_query_datafield_result_table").html(table);
            }
        });
    };

    // 数据抽取任务->目标->生成建表语句
    showContent.getBuildTableSQL = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_create_statement", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                // $("[name=createTableScript]").val(data.bcjson.items[0].createStatement.replace("(表)", ""));
                showContent.cm_TE_2.setValue(data.bcjson.items[0].createStatement.replace(/\([\u4e00-\u9fa5]+\)/g, ""));
            }
        });
    };

    // 数据抽取任务->字段映射->获取字段
    showContent.getDataField = function (params, type) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_column_mapping_info", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                if (items.length === 0) {
                    toastr.info("Mapping field is missing.");
                    return;
                }
                // 判断表名是否手输
                var origin = $("#J_select2_multi_tab_1_3").data("origin");
                var isInput = true; // 是否手输
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = origin[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var id = _step6.value.id;

                        if (id === params.targetTableId) {
                            isInput = false;
                        }
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                if (isInput) {
                    var sql = $("#J_cm_TE_2").val().replace(/[\n]/g, " ").replace(/[\t]/g, " ");
                    if (!sql) {
                        toastr.info("Object SQL is missing.");
                        return;
                    }
                    var sqlDatafield = filterSqlField(sql);
                    for (var i = 0, len = items.length; i < len; i++) {
                        if (sqlDatafield[i]) {
                            items[i].targetColumn = sqlDatafield[i];
                        }
                    }
                }
                require.async("./template/data-field-list.handlebars", function (compiled) {
                    showContent.dataFildItems = items;
                    var rows = showContent.haddleDataField.getRow();
                    // 没有数据直接渲染
                    if (rows === 0 || params.searchType === "2" || params.searchType === "3" || type === "refresh") {
                        $("#J_data_field_tbody").html(compiled(items));
                        showContent.haddleDataField.init(items);
                        App.initCheckableTable($("#J_data_field_table"));
                        // 有数据则弹框
                    } else {
                        $("#J_haddle_new_data .colored-red").html(rows);
                        $("#J_haddle_new_data .colored-blue").html(items.length);
                        $("#J_haddle_new_data").css({
                            "height": "auto",
                            "opacity": "1",
                            "padding": "8px 10px",
                            "transition": ".5s ease-in-out"
                        });
                    }
                });
            }
        });
    };

    // 筛选sql字段
    function filterSqlField(sql) {
        var matchArr = sql.match(/(\(\s+|,\s+)\w+\s/g);
        return matchArr.map(function (item, i) {
            return item.replace(/(\(|,|\s)/g, "");
        });
    }

    // 数据抽取任务->字段映射-> 插入的字段 操作处理
    showContent.haddleDataField = {
        // 初始化
        init: function init(items) {
            var html_t = "<select class=\"form-control input-sm\"><option value=\"\">- Please select a type -</option>";
            var html_input_t = "<input class=\"form-control\" type=\"text\">";
            var html_s = "<select class=\"form-control input-sm\"><option value=\"\">- Please select a type -</option>";
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = items[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var item = _step7.value;

                    if (item.targetColumn) {
                        html_t += "<option value=\"" + item.targetColumn + "\">" + item.targetColumn + "</option>";
                    }
                    html_s += "<option value=\"" + item.sourceColumn + "\">" + item.sourceColumn + "</option>";
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            html_t += "</select>";
            html_s += "</select>";

            $.each($("#J_data_field_tbody [data-type=target]:not([inited])"), function () {
                var text = $.trim($(this).html());
                if (text) {
                    $(this).html(html_t).attr("inited", "inited").children().val(text);
                }
            });
            $.each($("#J_data_field_tbody [data-type=source]:not([inited])"), function () {
                var text = $.trim($(this).html());
                if (text) {
                    $(this).html(html_s).attr("inited", "inited").children().val(text);
                } else {
                    $(this).html(html_input_t);
                }
            });
            $("#J_data_field_tbody [data-type=target] select:first").change();
        },
        // 重置字段值
        refresh: function refresh() {
            $.each($("#J_data_field_tbody tr td[data-type]"), function () {
                var origin = $(this).data("origin");
                $(this).children().val(origin);
            });
        },
        // 获取行数
        getRow: function getRow() {
            return $("#J_data_field_tbody tr").length;
        },
        // 增加新的
        appendNew: function appendNew() {
            var arr = [];
            var newItem = [];
            $.each($("#J_data_field_tbody tr [data-type=target]"), function () {
                var v = $(this).children().val();
                arr.push(v);
            });
            var items = showContent.dataFildItems;
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = items[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var item = _step8.value;

                    if (!arr.includes(item.targetColumn)) {
                        newItem.push(item);
                    }
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            require.async("./template/data-field-list.handlebars", function (compiled) {
                $("#J_data_field_tbody").append(compiled(newItem));
                showContent.haddleDataField.init(newItem);
                showContent.haddleDataField.reorder();
                App.initCheckableTable($("#J_data_field_table"));
            });
            showContent.haddleDataField.reorder();
        },
        // 添加所有
        appendAll: function appendAll() {
            require.async("./template/data-field-list.handlebars", function (compiled) {
                $("#J_data_field_tbody").append(compiled(showContent.dataFildItems));
                showContent.haddleDataField.init(showContent.dataFildItems);
                showContent.haddleDataField.reorder();
                App.initCheckableTable($("#J_data_field_table"));
            });
        },
        // 清空并添加所有
        clearAppendAll: function clearAppendAll() {
            require.async("./template/data-field-list.handlebars", function (compiled) {
                $("#J_data_field_tbody").html(compiled(showContent.dataFildItems));
                showContent.haddleDataField.init(showContent.dataFildItems);
                App.initCheckableTable($("#J_data_field_table"));
            });
        },
        // 删除选中行
        delCheckedRow: function delCheckedRow() {
            if ($("#J_data_field_tbody input[type=checkbox]:checked").length === 0) {
                toastr.info("Please select the Row");
            }
            $.each($("#J_data_field_tbody input[type=checkbox]:checked"), function (i) {
                $(this).closest("tr").remove();
            });
            showContent.haddleDataField.reorder();
        },
        // 重新排序
        reorder: function reorder() {
            $.each($("#J_data_field_tbody tr"), function (i) {
                $(this).find("td:first").text(i + 1);
            });
        },
        // 获取数据集
        getData: function getData() {
            var arr = new Array();
            // let arrCheck = [],  // 不重复数组
            //     flag = true;  // 是否重复
            $.each($("#J_data_field_tbody tr"), function (i) {
                var sourceValue = $(this).find("[data-type=source] select").val();
                var targetValue = $(this).find("[data-type=target] select").data("v");
                var obj = {
                    no: (i + 1).toString(),
                    sourceColumn: sourceValue,
                    targetColumn: targetValue
                    // if(arrCheck.includes(targetValue)) {
                    //     flag = false;
                    //     toastr.info("目标字段不可被映射多次");
                    //     return false;
                    // }
                    // arrCheck.push(targetValue);
                    // 字段有映射才传入
                };if (sourceValue && targetValue) {
                    arr.push(obj);
                }
            });
            return JSON.stringify({ "mappingColumn": arr });
        }
    };

    // 查询存储过程 存储过程任务->存储过程
    showContent.getStoredProcedure = function (params, cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_qry_statement_result", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                var arr = [{
                    id: "",
                    text: ""
                }];
                if (items && items.length > 0) {
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                        for (var _iterator9 = items[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                            var OBJECTNAME = _step9.value.OBJECTNAME;

                            arr.push({
                                id: OBJECTNAME,
                                text: OBJECTNAME
                            });
                        }
                    } catch (err) {
                        _didIteratorError9 = true;
                        _iteratorError9 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                _iterator9.return();
                            }
                        } finally {
                            if (_didIteratorError9) {
                                throw _iteratorError9;
                            }
                        }
                    }
                }
                $("#J_stored_procedure_select2").empty().clearInputs();
                $("#J_stored_procedure_select2").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                    // tags: true
                });
                // 把原始值放到data属性上 为了比较是否手动输入
                $("#J_stored_procedure_select2").data("origin", arr);
                // 回调赋值
                typeof cb === "function" && cb();
            }
        });
    };

    // 查询存储过程 存储过程任务->存储过程预览 && 参数筛选
    showContent.getStoredProcedurePreview = function (params, cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_proc_statement", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                typeof cb === "function" && cb(data);
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    // 存储过程->测试存储过程
    showContent.testStore = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_proc_test_info", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                toastr.success(data.bcjson.msg);
            } else {
                toastr.error(data.bcjson.msg);
            }
            App.unblockUI();
        });
    };

    // 导入文本->字段映射->获取字段
    showContent.getDataField_2 = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_metadata_column_info", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                if (items.length === 0) {
                    toastr.info("Mapping field is missing.");
                    return;
                }
                require.async("./template/data-field-list-2.handlebars", function (compiled) {
                    $("#J_data_field_tbody_2").html(compiled(items));
                    showContent.haddleDataField_2.init(items);
                    App.initCheckableTable($("#J_data_field_table_2"));
                });
            }
        });
    };

    // 文件格式转换->转换设置->获取字段
    showContent.getDataField_3 = function (params, selector, cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_metadata_column_info", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                if (items.length === 0) {
                    return;
                }
                var arr = items.map(function (item) {
                    return {
                        id: item.columnName,
                        text: item.columnName
                    };
                });

                // for (let i in parseDictData[dictType]) {
                //     let obj = {
                //         id: i,
                //         text: parseDictData[dictType][i],
                //     }
                //     arr.push(obj);
                // }
                // 渲染数据
                if (selector) {
                    template = "common-template/dict-option.handlebars";
                    var array = selector.split(",");
                    array.forEach(function (item) {
                        require.async($.kingdom.kconfig().root + template, function (compiled) {
                            $(item).html(compiled(arr));
                        });
                    });
                    // 不渲染 则返回查询结果
                }
                if (cb) cb();
            }
        });
    };

    // 导入文本->字段映射-> 插入的字段 操作处理
    showContent.haddleDataField_2 = {
        // 初始化
        init: function init(items) {
            var html_t = "<select class=\"form-control input-sm\"><option value=\"\">- Please select a type -</option>";
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = items[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var item = _step10.value;

                    html_t += "<option value=\"" + item.columnName + "\">" + item.columnName + "</option>";
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            html_t += "</select>";

            $.each($("#J_data_field_tbody_2 [data-type=target]:not([inited])"), function () {
                var v = $.trim($(this).data("origin"));
                $(this).html(html_t).attr("inited", "inited").children().val(v);
            });
            $("#J_data_field_tbody_2 [data-type=target] select:first").change();
        },
        // 重置字段值
        refresh: function refresh() {
            $.each($("#J_data_field_tbody_2 tr td[data-type]"), function () {
                var origin = $(this).data("origin");
                $(this).children().val(origin);
            });
        },
        // 获取行数
        getRow: function getRow() {
            return $("#J_data_field_tbody_2 tr").length;
        },
        // 删除选中行
        delCheckedRow: function delCheckedRow() {
            if ($("#J_data_field_tbody_2 input[type=checkbox]:checked").length === 0) {
                toastr.info("Please select the Row");
            }
            $.each($("#J_data_field_tbody_2 input[type=checkbox]:checked"), function (i) {
                $(this).closest("tr").remove();
            });
            showContent.haddleDataField_2.reorder();
        },
        // 重新排序
        reorder: function reorder() {
            $.each($("#J_data_field_tbody_2 tr"), function (i) {
                $(this).find("td:first").text(i + 1);
                $(this).find("td[data-type=import]").html(" The " + (i + 1) + " Column ");
            });
        },
        // 获取数据集
        getData: function getData() {
            var arr = new Array();
            // let arrCheck = [],  // 不重复数组
            //     flag = true;  // 是否重复
            $.each($("#J_data_field_tbody_2 tr"), function (i) {
                var targetColumn = $(this).find("[data-type=target] select").data("v"),
                    obj = {
                    no: (i + 1).toString(),
                    sourceColumn: (i + 1).toString(),
                    targetColumn: targetColumn
                };
                arr.push(obj);
                // if(arrCheck.includes(targetColumn)) {
                //     flag = false;
                //     toastr.info("目标表字段不可被映射多次");
                //     return false;
                // }
                // arrCheck.push(targetColumn);
            });
            return JSON.stringify({ "mappingColumn": arr });
        }
    };
    showContent.getDictShield = function () {};
    // 所有表单校验配置
    showContent.initForm = function () {

        // 数据抽取
        $('#J_form_TE').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                sourceConnection: {
                    required: true
                },
                sourceTables: {
                    required: true
                },
                targetConnection: {
                    required: true
                },
                targetTable: {
                    required: true
                },
                submitNum: {
                    required: true,
                    numCheck: true
                },
                // rollbackFlag: {
                //     required: true,
                // },
                deleteSql: {
                    required: true
                }

            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        // 执行SQL
        $('#J_form_TT').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                connectionId: {
                    required: true
                },
                transRule: {
                    required: true
                },
                command: {
                    required: true
                    // notNumberAndEng: true,
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        //  变量设置弹框
        $('#J_form_TV').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                variableName: {
                    required: true,
                    specialCharacter: true
                },
                connectionId: {
                    required: true
                },
                variableScript: {
                    required: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        // 存储过程
        $('#J_form_TP').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                dbConnection: {
                    required: true
                },
                procedureName: {
                    required: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        // 导出文本
        $('#J_form_TF').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                dbConnection: {
                    required: true
                },
                command: {
                    required: true
                    // notNumberAndEng: true,
                },
                extendName: {
                    required: true
                },
                exportPath: {
                    required: true,
                    maxlength: 128
                },
                exportName: {
                    required: true,
                    maxlength: 128
                },
                catalogFlag: {
                    required: true
                },
                addFlag: {
                    required: true
                },
                headFlag: {
                    required: true
                },
                taskSeparator: {
                    required: true
                },
                headerContent: {
                    required: true
                }

            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        // 发送邮件
        $('#J_form_TM').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                recieveAddress: {
                    required: true
                },
                // codeFlag: {
                //     required: true
                // },
                codeType: {
                    required: true
                },
                mailTopic: {
                    required: true
                },
                mailNote: {
                    required: true
                }

            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        // 导入
        $('#J_form_TI').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                fileType: {
                    required: true
                },
                fileUrl: {
                    required: true,
                    maxlength: 64
                },
                fileName: {
                    required: true,
                    maxlength: 64
                },
                taskSeparator: {
                    required: true
                },
                submitNum: {
                    required: true,
                    numCheck: true
                },
                // rollbackFlag: {
                //     required: true
                // },
                beforeRule: {
                    required: true
                },
                deleteFileFlag: {
                    required: true
                },
                deleteSql: {
                    required: true
                },
                targetConnectionId: {
                    required: true
                },
                targetTable: {
                    required: true
                },
                startImportLine: {
                    required: true,
                    startImportLineCheck: true
                },
                sftpIp: {
                    required: true
                },
                sftpPort: {
                    required: true
                },
                sftpUsername: {
                    required: true
                },
                sftpSecretword: {
                    required: true
                },
                sftpPath: {
                    required: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        // 压缩打包
        $('#J_form_TZ').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                compressType: {
                    required: true
                },
                filePath: {
                    required: true
                },
                fileName: {
                    required: true,
                    maxlength: 64
                },
                a1005FilesPath: {
                    required: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        // 数据剖析
        $('#J_form_DQ').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                ruleFolderId: {
                    required: true
                },
                ruleids: {
                    required: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        // 文件格式转换
        $('#J_form_TFP').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                connectionId: {
                    required: true
                },
                dbTable: {
                    required: true
                },
                columnFileName: {
                    required: true
                },
                columnFileData: {
                    required: true
                },
                isAuth: {
                    required: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        // 执行Web任务
        $('#J_form_AS').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                baseUrl: {
                    required: true
                },
                subUrl: {
                    required: true
                },
                requestUserName: {
                    required: true
                },
                requestSecretWord: {
                    required: true
                },
                requestType: {
                    required: true
                },
                responseDataFormat: {
                    required: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        // 数据上报
        $('#J_form_DR').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                taskName: {
                    required: true
                },
                folderName: {
                    required: true
                },
                uploadUrl: {
                    required: true
                },
                sourceUrl: {
                    required: true
                },
                isRename: {
                    required: true
                },
                targetFileName: {
                    required: true
                },
                sourceFileName: {
                    required: true
                },
                a1006FilesPath: {
                    required: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });

        $.validator.addMethod("startImportLineCheck", function (value) {
            // if (/^([1-9]\d+|[2-9])$/.test(value)) {
            //     return true;
            // } else {
            //     return false;
            // }
            return (/^([1-9]\d+|[2-9])$/.test(value)
            );
        }, "Please input an integer > 1");
    };

    function createCodeMirror(prop, dbDom, textareaId, refreshTrigger) {
        return new initCodeMirror(prop, dbDom, textareaId, refreshTrigger);
    }
    /*
        @prop： 实例名字 
        @dbDom: 数据源的dom，取数据源查询下面的表
        @textareaId： 绑定的textarea的ID
        @refreshTrigger: 触发dom显示的元素 ,codemirror 不能初始化隐藏元素，需要dom显示时才加载
    */
    function initCodeMirror(prop, dbDom, textareaId, refreshTrigger) {
        var _this = this;
        this.option = {
            mode: "text/x-plsql", // 实现sql代码高亮
            lineNumbers: true,
            lineWiseCopyCut: true,
            extraKeys: { "Ctrl-Space": "autocomplete" },
            hintOptions: {
                tables: {}
            }
            // 初始化
        };showContent[prop] = CodeMirror.fromTextArea(document.getElementById(textareaId), this.option);
        // 绑定textarea值
        showContent[prop].on("change", function (instance, changeObj) {
            $("#" + textareaId).val(showContent[prop].getValue()).change();
        });
        // 监听输入
        showContent[prop].on("keyup", function (cm, event) {
            var connection_id = $(dbDom).val(),
                point = showContent[prop].getCursor(),
                lastLine = showContent[prop].getLine(point.line).replace(/ /g, "\t");
            _this.autoComplete(cm, event, connection_id, point, lastLine);
        });
        // dom可见时，refresh一下样式不错乱
        $(refreshTrigger).click(function () {
            if (showContent[prop]) {
                setTimeout(function () {
                    showContent[prop].refresh();
                }, 10);
            }
        });
        // textera改变时触发校验 防止红色提示不消失
        var modal = $("#" + textareaId).closest(".modal");
        modal.on('shown.bs.modal', function () {
            setTimeout(function () {
                showContent[prop].refresh();
            }, 10);
        });
        // textera改变时触发校验 防止红色提示不消失
        $("#" + textareaId).on("change", function () {
            $(this).closest("form").validate().element(this);
        });
    }
    // 根据源和用户  查表
    initCodeMirror.prototype.getTable = function (params, cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_db_metadata_tables", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items,
                    obj = {};
                if (items.length === 0) {
                    return;
                }
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = items[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var item = _step11.value;

                        obj[params.schema + "." + item.TABLE_NAME] = [];
                    }
                } catch (err) {
                    _didIteratorError11 = true;
                    _iteratorError11 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                            _iterator11.return();
                        }
                    } finally {
                        if (_didIteratorError11) {
                            throw _iteratorError11;
                        }
                    }
                }

                cb(obj);
            }
        });
    };
    // 自动补全
    initCodeMirror.prototype.autoComplete = function (cm, event, connection_id, point, lastLine) {
        var _this2 = this;

        // 所有的字母和'$','{','.'在键按下之后都将触发自动完成             
        if (!cm.state.completionActive && (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode == 52 || event.keyCode == 219)) {
            CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
        }
        // 点号
        if (event.keyCode === 190) {
            var schema;
            lastLine.split("\t").forEach(function (item, i) {
                if (lastLine.lastIndexOf(item) + item.length === point.ch) {
                    schema = item.replace(/[.\s\t]/g, "");
                }
            });
            if (!schema) return;
            this.getTable({
                schema: schema,
                connection_id: connection_id
            }, function (obj) {
                _this2.option.hintOptions.tables = obj;
                CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
            });
        }
    };

    module.exports = showContent;
});