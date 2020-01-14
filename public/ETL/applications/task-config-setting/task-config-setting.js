var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 * @Author: limin01
 * @Date: 2018-08-10
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-04-09 13:16:57
 */

define(function (require, exports, module) {
    var showContent = require("./task-config-settingShow");
    var PAGE = location.hash.split("?")[0].replace("#", ".page-");
    var init = {
        load: function load() {
            showContent._load(); //加载页面数据
            //初始化拖动

            showContent.sftpSecretword = "";
            var oBar = document.getElementById("J_drag_bar1");
            var oTarget = document.getElementById("J_drag_bar1");
            startDrag(oBar, oTarget, ".left-side-config", ".right-content-config", function () {
                //   LFWIDTH = $('.left-side').width();

            });
        }
    };
    $(function () {
        //在进行dom操作的时候，务必指定dom的唯一class标识


        var haddleParams = new App.handleParams("#J_store_params"); // 实例化 参数操作
        showContent.haddleParams = haddleParams;

        // const haddleParams_DQ = new App.handleParams("#J_dq_params");  // 实例化 参数操作
        // showContent.haddleParams_DQ = haddleParams_DQ;

        // const haddleParams_DQ_S = new App.handleParams("#J_dq_success_params");  // 实例化 参数操作
        // showContent.haddleParams_DQ_S = haddleParams_DQ_S;
        // 左侧树名称超出隐藏
        $("body").on("click", PAGE + " #J_foldname_tree .jstree-ocl", function () {
            App.treeEllipsis("#J_foldname_tree");
        });

        // 点击左侧树
        $("body").on("click", PAGE + " #J_foldname_tree .jstree-anchor", function () {
            showContent.getTaskList();
        });

        // 高级查询 
        $("body").on("click", PAGE + " #J_task_search", function () {
            showContent.getTaskList();
        });

        // 密码修改过 则加密
        $("body").on("change", PAGE + " [name=userPassword]", function () {
            $(this).attr("changed", "changed");
        });
        $("body").on("change", PAGE + " [name=requestSecretWord]", function () {
            $(this).attr("changed", "changed");
        });

        // 点击弹框保存 通用
        $("body").on("click", PAGE + " .J_save", function () {
            var oparatetype = $(this).data("type"); // 判断新增或修改
            var taskType = $(this).data("tasktype");
            var formId = $(this).data("formid");
            var modalId = $(this).data("modalid");
            if ($('#' + formId).valid()) {
                var formParams = App.getFormParams(formId);
                formParams.taskType = taskType;
                formParams.creator = localStorage.getItem('loginName');
                // 抽取任务
                if (modalId === "J_modal_TE") {
                    if (!$("#J_select2_multi_tab_1_1").val()) {
                        toastr.info("Please select source table.");
                        return false;
                    }
                    if (!$("#J_select2_multi_tab_1_3").val()) {
                        toastr.info("Please select target table.");
                        return false;
                    }
                    // let res = /^[^\u4e00-\u9fa5]{0,}$/;
                    // if (!res.test($("#J_cm_TE_2").val())) {
                    //     toastr.info("生成对象语句不能包含中文");
                    //     return false;
                    // }
                    formParams.transScript = $("#J_cm_TE").val();
                    formParams.createTableScript = $("#J_cm_TE_2").val();
                    // formParams.targetTableFlag = $(`#${modalId} [name=targetTableFlag]:checked`).length == "1" ? "1" : "0";
                    formParams.sourceTables = $("#J_select2_multi_tab_1_1").select2('data')[0].text.replace(/\(.+\)/g, ""); // 存表名
                    formParams.targetTable = $("#J_select2_multi_tab_1_3").select2('data')[0].text.replace(/\(.+\)/g, ""); // 存表名
                    var origin = $("#J_select2_multi_tab_1_3").data("origin");
                    var include = false; // 判断是否手动输入的标识
                    if (origin.length > 0) {
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = origin[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var text = _step.value.text;

                                if (formParams.targetTable === text) {
                                    include = true;
                                }
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
                    }
                    formParams.mappingInfo = showContent.haddleDataField.getData(); // 封装参数集

                    // 如果没有映射关系， 且不是目标表名不是手动输入
                    if (JSON.parse(formParams.mappingInfo).mappingColumn.length === 0 && include) {
                        toastr.info("Mapping field is missing.");
                        return false;
                    }

                    // 存储任务
                } else if (modalId === "J_modal_TP") {
                    var flag = true;
                    haddleParams.getData(function (parameters) {
                        if (!parameters) {
                            toastr.info("params is missing.");
                            flag = false;
                        }
                        var successcondition = App.getFormParamsFakeName("#J_success_condition");
                        var rvariable = $("[fakename=rvariable]").val();
                        var obj = {
                            returnmessage: {
                                rvariable: rvariable
                            },
                            parameters: parameters,
                            successcondition: successcondition
                        };
                        // 封装参数集
                        formParams.taskParameters = JSON.stringify(obj);
                    });
                    if (!flag) return false;
                    // 邮件
                } else if (modalId === "J_modal_TM") {
                    // 修改过则加密
                    if ($("[name=userPassword]").attr("changed")) {
                        formParams.userPassword = $.des.getDes(formParams.userPassword);
                        $("[name=userPassword]").removeAttr("changed");
                    }
                    // 导入文本
                } else if (modalId === "J_modal_TI") {
                    if ($("#" + modalId + " [name=importType]:checked").val() === "0" && $("#" + modalId + " .fileinput [name=fileUrl]").val() == "") {
                        toastr.info("Please upload a file.");
                        return;
                    }
                    formParams.fileUrl = $("[data-importtype=" + formParams.importType + "] [name=fileUrl]").val();
                    formParams.fileType = $("[data-importtype=" + formParams.importType + "] [name=fileType]").val();
                    formParams.fileName = $("[data-importtype=" + formParams.importType + "] [name=fileName]").val();
                    if (formParams.importType === "0") {
                        if (formParams.fileUrl.indexOf('.') === -1) {
                            formParams.fileUrl = formParams.fileUrl;
                            // + '/' + formParams.fileName;
                        }
                    }
                    if (formParams.importType === "2") {
                        if (oparatetype === "add") {
                            formParams.sftpSecretword = $.des.getDes(formParams.sftpSecretword);
                        } else if (showContent.sftpSecretword && showContent.sftpSecretword !== formParams.sftpSecretword) {
                            formParams.sftpSecretword = $.des.getDes(formParams.sftpSecretword);
                        }
                    }
                    // 目标表字段不可被映射多次
                    // let flagArr = [], include = false;
                    // $.each($("#J_data_field_tbody_2 tr"), function(i) {
                    //     let targetValue = $(this).find("[data-type=target] select").val();
                    //     if (flagArr.includes(targetValue)) {
                    //         include = true;
                    //     }

                    //     flagArr.push(targetValue);
                    // });
                    // if (include) {
                    //     toastr.info("目标表字段不可被映射多次");
                    //     return;
                    // };
                    formParams.targetTable = $("#J_select2_multi_tab_1_9").select2('data')[0].text.replace(/\(.+\)/g, ""); // 存表名

                    formParams.mappingInfo = showContent.haddleDataField_2.getData(); // 封装参数集
                    // 数据剖析
                } else if (modalId === "J_modal_DQ") {
                    var ruleIds = $("#J_select2_multi_tab_11_1").select2("val"),
                        obj = $("#J_select2_multi_tab_11_1").data("obj"),
                        applyParam = ruleIds.map(function (item, i) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = obj[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var o = _step2.value;

                                if (o.ruleId === item) {
                                    return o;
                                }
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
                    });
                    formParams.applyParam = JSON.stringify(applyParam);
                    // let alyParam = App.getTableParamsFakeName("#J_dq_params"),
                    // successParam = App.getTableParamsFakeName("#J_dq_success_params");
                    // let obj = {};
                    // for (let item of alyParam) {
                    //     if (obj.hasOwnProperty(item.colName)) {
                    //         toastr.info("字段名不能重复");
                    //         return false;
                    //     } else {
                    //         obj[item.colName] = "";
                    //     }
                    // }
                    // obj = {};
                    // for (let item of successParam) {
                    //     if (obj.hasOwnProperty(item.ruleName)) {
                    //         toastr.info("字段名不能重复");
                    //         return false;
                    //     } else {
                    //         obj[item.ruleName] = "";
                    //     }
                    // }
                    // formParams.alyParam = JSON.stringify(alyParam);
                    // formParams.successParam = JSON.stringify(successParam);
                    // formParams.sourceTables = $("#J_select2_multi_tab_11_1").select2('data')[0].text.replace(/\(.+\)/g, "");  // 存表名
                } else if (modalId === "J_modal_DR") {
                    if (formParams.sourceUrl && formParams.sourceUrl === "0") {
                        formParams.sourceUrl = $("[name=a1006FilesPath]").val();
                    }
                } else if (modalId === "J_modal_TFP") {
                    formParams.dbTable = $("#J_select2_multi_tab_13_1").select2('data')[0].text.replace(/\(.+\)/g, "");
                }
                formParams.taskDesc = formParams.taskDesc && formParams.taskDesc.substring(0, 1024);
                // 执行Web任务
                if (modalId === "J_modal_AS") {
                    if (oparatetype === 'add') {
                        formParams.operType = 'addApi';
                    } else {
                        formParams.operType = 'updateApi';
                    }
                    var apiParamsInputCommon = [];
                    $.each($('#tab_14_2 [name=apiParamsInputCommon]'), function (i) {
                        var name = $(this).find("[name=name]").val();
                        var value = $(this).find("[name=value]").val();
                        var position = $(this).find("[name=position]").val();
                        apiParamsInputCommon.push({
                            name: name,
                            value: value,
                            position: position
                        });
                    });
                    formParams.apiParamsInputCommon = JSON.stringify(apiParamsInputCommon);
                    var apiParamsInput = [];
                    $.each($('#tab_14_3 [name=apiParamsInput]'), function (i) {
                        var name = $(this).find("[name=name]").val();
                        var value = $(this).find("[name=value]").val();
                        var position = $(this).find("[name=position]").val();
                        apiParamsInput.push({
                            name: name,
                            value: value,
                            position: position
                        });
                    });
                    formParams.apiParamsInput = JSON.stringify(apiParamsInput);
                    var apiParamsOutput = [];
                    $.each($('#tab_14_3 [name=apiParamsOutput]'), function (i) {
                        var name = $(this).find("[name=name]").val();
                        var successful = $(this).find("[name=successful]").val();
                        var failed = $(this).find("[name=failed]").val();
                        apiParamsOutput.push({
                            name: name,
                            successful: successful,
                            failed: failed
                        });
                    });
                    formParams.apiParamsOutput = JSON.stringify(apiParamsOutput);

                    // 修改过则加密
                    if ($("[name=requestSecretWord]").attr("changed")) {
                        formParams.requestSecretWord = $.des.getDes(formParams.requestSecretWord);
                        $("[name=requestSecretWord]").removeAttr("changed");
                    }
                    App.blockUI({
                        boxed: true,
                        message: "Processing..."
                    });
                    showContent.setWebTaskInfo(formParams, function (data) {
                        // 触发查询列表
                        $("#J_foldname_tree [folderid=" + formParams.folderId + "]>.jstree-anchor").click();
                        $("#" + modalId).modal("hide");
                    });
                    return;
                }
                App.blockUI({
                    boxed: true,
                    message: "Processing..."
                });
                showContent.setTaskInfo(formParams, oparatetype, function (data) {
                    // 触发查询列表
                    $("#J_foldname_tree [folderid=" + formParams.folderId + "]>.jstree-anchor").click();
                    $("#" + modalId).modal("hide");
                });
            } else {
                toastr.info("Please check the invalid fields");
            }
        });

        $("body").on("change", '#tab_14_2 [name=baseUrl]', function (e) {
            debugger;
            $('#tab_14_3 #baseUrl').text(e.target.value);
        });

        $("body").on("hide.bs.modal", '#J_modal_AS', function () {
            $('#tab_14_2 [name=apiParamsInputCommon] #del,  #tab_14_3 [name=apiParamsInput] #del').parent().remove();
            $('#tab_14_3 #baseUrl').text("");
        });

        // 点击新增下拉框 操作类型，保存操作类型
        $("body").on("click", PAGE + " #J_task_option_1 li a", function () {
            var taskType = $(this).data("id");
            var modalSelector = $(this).attr("data-target");
            var folderId = $("#J_foldname_tree [aria-selected=true]").attr("folderid");
            $(modalSelector + " .J_save").data("tasktype", taskType).data("type", "add"); // 把重要参数绑在保存按钮上
            // 请空数据
            showContent.clearData();
            if (taskType === "DQ") {
                showContent.getRuleFolder();
            } else {
                showContent.getDataSourceList();
            }
            // $(`${PAGE} [name=dataTimeType]`)[0].closest("label").click(); // 触发日期选择
            // 选中modal里的树
            $(modalSelector + " [type=jstree]").jstree().open_all();
            $(modalSelector + " [type=jstree] [folderid=" + folderId + "]>.jstree-anchor").click(); // 注：这个click事件写在main.js
        });

        // 点击编辑
        $("body").on("click", PAGE + " #J_task_edit", function () {
            var dom = $("#J_task_table tbody input:checked"),
                taskType = dom.data("tasktype"),
                taskId = dom.data("taskid");
            if (dom.length !== 1) {
                toastr.info("Please select one job only");
                return;
            }
            // 请空数据
            showContent.clearData();
            // 查询规则文件夹
            if (taskType === "DQ") {
                showContent.getRuleFolder(function () {
                    showContent.getTaskInfo({
                        taskId: taskId,
                        taskType: taskType
                    });
                });
                return;
            }
            if (taskType === 'AS') {
                showContent.getTaskApiInfo({
                    taskId: taskId,
                    taskType: taskType
                });
                return;
            }
            // 查询数据源
            showContent.getDataSourceList(function () {
                showContent.getTaskInfo({
                    taskId: taskId,
                    taskType: taskType
                });
            });
        });

        // 点击移动
        $("body").on("click", PAGE + " #J_task_move", function () {
            var dom = $("#J_task_table tbody input:checked"),
                folderId = dom.eq(0).data("folderid"),
                arr = [];
            if (dom.length === 0) {
                toastr.info("Please select one job at least");
                return;
            }
            $.each(dom, function () {
                var taskId = $(this).data("taskid"),
                    taskType = $(this).data("tasktype");
                arr.push({
                    taskId: taskId,
                    taskType: taskType
                });
            });
            $(PAGE + " #J_task_move_modal [data-type=confirm]").data("arr", arr);
            // 选中modal里的树
            $("#J_task_move_modal [type=jstree]").jstree(true).open_all();
            $("#J_task_move_modal [type=jstree] [folderid=" + folderId + "]>.jstree-anchor").click();
            $("#J_task_move_modal").modal("show");
        });

        // 点击移动确认
        $("body").on("click", PAGE + " #J_task_move_modal [data-type=confirm]", function () {
            var targetFolderId = $("#J_task_move_modal [name=folderId]").val();
            if (!targetFolderId) {
                toastr.info("Please select the target file");
                return;
            }
            var arr = $(this).data("arr"),
                taskInfo = arr.map(function (item, i) {
                return _extends(item, {
                    targetFolderId: targetFolderId
                });
            });
            $("#J_task_move_modal").modal("show");
            showContent.moveTaskInfo({
                taskInfo: JSON.stringify(taskInfo)
            });
        });

        // 删除任务
        $("body").on("click", PAGE + " #J_task_del", function () {
            var dom = $("#J_task_table tbody input:checked"),
                arr = [];
            if (dom.length === 0) {
                toastr.info("Please select one job at least");
                return;
            }
            $.each(dom, function () {
                var taskId = $(this).data("taskid"),
                    taskType = $(this).data("tasktype");
                arr.push({
                    taskId: taskId,
                    taskType: taskType
                });
            });
            bootbox.confirm("Please confirm that you want to delete this task.", function (result) {
                if (result) {
                    App.blockUI({
                        boxed: true,
                        message: "Processing..."
                    });
                    showContent.delTaskInfo({
                        taskList: JSON.stringify(arr)
                    });
                }
            });
        });

        // 点击复制
        $("body").on("click", PAGE + " #J_copy_task", function () {
            var dom = $("#J_task_table tbody input:checked");
            if (dom.length !== 1) {
                toastr.info("Please select one job only");
                return;
            }
            App.blockUI({
                boxed: true,
                message: "Processing..."
            });
            var taskId = dom.data("taskid");
            var taskType = dom.data("tasktype");
            showContent.copyTaskInfo({
                taskId: taskId,
                taskType: taskType,
                creator: localStorage.getItem('loginName')
            });
        });

        // 点击查看相关作业
        $("body").on("click", PAGE + " #J_check_relate_job", function () {
            var dom = $("#J_task_table tbody input:checked");
            if (dom.length !== 1) {
                toastr.info("Please select one job only");
                return;
            }
            var taskId = dom.data("taskid");
            showContent.checkRelateJob({ taskId: taskId });
            $("#J_relate_job_modal").modal("show");
        });
        // 点击作业名称跳转至编辑页面
        $("body").on("click", PAGE + " #J_relate_job_list a", function () {
            var jobId = $(this).data("obj").jobId;
            var jobName = $(this).data("obj").jobName;
            var folderId = $(this).data("obj").folderId;
            if (jobId) window.open("/retl-process/design.html?jobId=" + jobId + "&jobName=" + jobName + "&folderId=" + folderId);
        });
        // 数据抽取任务->源->生成查询语句
        $("body").on("click", PAGE + " #J_get_sql", function () {
            if (!$("#J_select2_multi_tab_1_1").val()) {
                toastr.info("Source object is missing.");
                return;
            }
            var tableId = $("#J_select2_multi_tab_1_1").val();
            showContent.getSQL({ tableId: tableId });
        });

        // 数据抽取任务->源->查询预览
        $("body").on("click", PAGE + " #J_preview_sql", function () {
            var connectionId = $("#J_select2_single_tab_1_1").val();
            var previewStatement = $("#J_cm_TE").val().replace(/[\n]/g, " ").replace(/[\t]/g, " "); // 去掉回车换
            if (!connectionId) {
                toastr.info("Please select source data.");
                return;
            }
            if (!previewStatement) {
                toastr.info("Source SQL is missing.");
                return;
            }
            // let res = /^[^\u4e00-\u9fa5]{0,}$/;
            // if (!res.test(previewStatement)) {
            //     toastr.info("源表查询语句不能包含中文");
            //     return;
            // }
            showContent.getPreviewSQL({
                connectionId: connectionId,
                previewStatement: previewStatement,
                previewNum: "10"
            });
        });

        // 数据抽取任务->目标->生成建表语句
        $("body").on("click", PAGE + " #J_crate_build_table_sql", function () {
            if (!$("#J_select2_single_tab_1_1").val()) {
                toastr.info("Please select source data source.");
                return;
            }
            if (!$("#J_select2_single_tab_1_3").val()) {
                toastr.info("Please selecct target data source.");
                return;
            }
            if (!$("#J_select2_multi_tab_1_1").val()) {
                toastr.info("Please select source table.");
                return;
            }
            if (!$("#J_select2_multi_tab_1_3").val()) {
                toastr.info("Please select target table.");
                return;
            }
            var sourceConnectionId = $("#J_select2_single_tab_1_1").val(),
                targetConnectionId = $("#J_select2_single_tab_1_3").val(),
                soureTableId = $("#J_select2_multi_tab_1_1").val(),
                targetTableName = $("#J_select2_multi_tab_1_3").select2('data')[0].text,
                origin = $("#J_select2_multi_tab_1_3").data("origin"),
                isInput = true; // 是否自定义输入
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = origin[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var text = _step3.value.text;

                    if (text === targetTableName.replace(/\(.+\)/g, "")) {
                        isInput = false;
                    }
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

            if (!isInput) {
                toastr.info("Generation only allowed when target object is customized");
                return;
            }
            // $("#J_cm_TE_2").attr("contenteditable", "true");
            showContent.getBuildTableSQL({
                sourceConnectionId: sourceConnectionId,
                targetConnectionId: targetConnectionId,
                targetTableName: targetTableName,
                soureTableId: soureTableId
            });
        });

        // 数据抽取任务->字段映射->获取字段 等操作
        $("body").on("click", PAGE + " #J_get_data_btns [data-type]", function () {
            if (!$("#J_select2_multi_tab_1_1").val()) {
                toastr.info("Please select source table.");
                return;
            }
            if (!$("#J_select2_multi_tab_1_3").val()) {
                toastr.info("Please select target table.");
                return;
            }
            var type = $(this).data("type");
            var soureTableId = $("#J_select2_multi_tab_1_1").val();
            var targetTableId = $("#J_select2_multi_tab_1_3").val();
            // 刷新
            if (type === "refresh") {
                showContent.getDataField({
                    targetTableId: targetTableId,
                    soureTableId: soureTableId,
                    searchType: "1",
                    sortType: "1"
                }, type);
                // 删除
            } else if (type === "del") {
                showContent.haddleDataField.delCheckedRow();
                // 获取字段
            } else if (type === "get") {
                var searchType = $(this).data("search-type").toString();
                showContent.getDataField({
                    targetTableId: targetTableId,
                    soureTableId: soureTableId,
                    searchType: searchType,
                    sortType: "1"
                }, type);
            }
        });

        // 数据抽取任务->字段映射->获取字段->增加字段 等操作
        $("body").on("click", PAGE + " #J_haddle_new_data .close", function () {
            $("#J_haddle_new_data").css({
                "height": "0",
                "opacity": "0",
                "padding": "0 10px",
                "transition": "0s"
            });
            $(PAGE + " #J_haddle_new_data [type=radio]").prop("checked", false);
            jQuery.uniform.update();
        });

        // 数据抽取任务->字段映射->获取字段->增加字段 等操作
        $("body").on("click", PAGE + " #J_haddle_new_data [type=radio]", function () {
            var v = $(this).val();
            if (v === "0") {
                showContent.haddleDataField.appendNew();
            } else if (v === "1") {
                showContent.haddleDataField.appendAll();
            } else if (v === "2") {
                showContent.haddleDataField.clearAppendAll();
            }
            $("#J_haddle_new_data").css({
                "height": "0",
                "opacity": "0",
                "transition": "0s"
            });
            $(PAGE + " #J_haddle_new_data [type=radio]").prop("checked", false);
            jQuery.uniform.update();
        });

        // 数据抽取任务->目标->目标写入前操作 联动 && 导入->导入设置
        $("body").on("change", PAGE + " [name=beforeRule]", function () {
            var v = $(this).val();
            if (v == "5") {
                $(this).parents(".form-group").siblings(".J_show_delete_sql").show();
                $(this).parents(".form-group").siblings(".J_show_delete_sql").find("[name=deleteSql]").removeAttr("type");
                if (showContent.cm_TE_3) {
                    setTimeout(function () {
                        showContent.cm_TE_3.refresh();
                    }, 0);
                }
                if (showContent.cm_TI) {
                    setTimeout(function () {
                        showContent.cm_TI.refresh();
                    }, 0);
                }
            } else {
                $(this).parents(".form-group").siblings(".J_show_delete_sql").hide();
                $(this).parents(".form-group").siblings(".J_show_delete_sql").find("[name=deleteSql]").attr("type", "hidden");
            }
        });

        // 导入类型切换
        $("body").on("change", PAGE + " [name=importType]", function () {
            var v = $(this).val();
            // $(`[data-importtype] input,[data-importtype] select`).val(''); // 清空
            $(".fileinput-filename").html('');
            $("[data-dismiss=fileinput]").click();
            $("[data-importtype=" + v + "]").show().find(".form-control:not([ignore])").attr("type", "text");
            $("[data-importtype=" + v + "]").siblings("[data-importtype]").hide().find(".form-control:not([ignore])").attr("type", "hidden");
            $("[data-filetype-index=" + v + "]").change();
            if (v === "0") {
                $("#J_import_task_separator").css("display", "none");
            } else if (v === "1") {
                //     let val = $("#J_import_path").val().replace($(`[data-importtype=1] [name=fileName]`).val(),"")
                //     $("#J_import_path").val(val);
                //     let fileName = $(`[data-importtype=1] [name=fileName]`).val().match(/.+\./)[0];
                //    let val1 = fileName.substring(0,fileName.length-1);
                //    $(`[data-importtype=1] [name=fileName]`).val(val1);
            } else if (v === "2") {
                $("[data-importtype=2] [name=sftpSecretword]").attr("type", "password");
            }
        });

        // 文件类型切换
        $("body").on("change", PAGE + " select[name=fileType]", function () {
            var fileType = $(this).val();
            // $("#J_import_task_separator [name=taskSeparator]").val("");
            //     fileName = $("[name=fileName]").val(),
            //     hasSuffix = fileName.lastIndexOf(".") > -1, // 是否有后缀
            //     newFileName;
            //     if (hasSuffix) {
            //         newFileName = fileName.replace(fileName.substring(fileName.lastIndexOf(".") + 1), fileType);
            //     } else {
            //         newFileName = fileName + '.' + fileType;
            //     }
            // $("[name=fileType]").val(fileType);
            // if (fileName) {
            //     $("[name=fileName]").val(newFileName);
            //     $(".fileinput-filename").text(newFileName);
            // }
            // 是否显示导入文本开始位置
            if (fileType === "xls" || fileType === "xlsx" || fileType === "csv") {
                $("#J_import_txt_start_line_wrap").show().find(".form-control").attr("type", "text");
                $("[name=startImportLine]").hide().attr("type", "hidden");
            } else {
                $("#J_import_txt_start_line_wrap").hide().find(".form-control").attr("type", "hidden");
            }

            // 是否显示分隔符
            if (fileType === "txt" || fileType === "dbf" || fileType === "dat") {
                $("#J_import_task_separator").show().find(".form-control").attr("type", "text");
                if (fileType === "dbf") {
                    $("#J_import_task_separator [name=taskSeparator]").val("1");
                    $("#J_import_task_separator").css("display", "none");
                }
            } else {
                $("#J_import_task_separator").hide().find(".form-control").attr("type", "hidden");
            }
        });

        // 导入类型切换
        $("body").on("change", PAGE + " #J_import_txt_start_line input", function () {
            var v = $(this).val();
            if (v === "1") {
                $("[name=startImportLine]").hide().attr("type", "hidden");
            } else {
                $("[name=startImportLine]").show().attr("type", "text").val(v);
            }
        });

        // 压缩文件范围切换
        $("body").on("change", PAGE + " #J_TZ_file_range input", function () {
            var v = $(this).val();
            if (v === "0") {
                $("[name=a1005FilesPath]").show().attr("type", "text");
            } else {
                $("[name=a1005FilesPath]").hide().attr("type", "hidden");
            }
        });
        // 数据上报同步范围切换
        $("body").on("change", PAGE + " #J_sync_rangge input", function () {
            var v = $(this).val();
            if (v === "0") {
                $("[name=a1006FilesPath]").show().attr("type", "text");
                $("#modify_file_content").show().find("input").attr("type", "text");
                $("#tab_12_3 .row > .form-group:nth-child(2)").show().find("input").attr("type", "radio");
            } else {
                $("[name=a1006FilesPath]").hide().attr("type", "hidden");
                $("#modify_file_content").hide().find("input").attr("type", "hidden");
                $("#tab_12_3 .row > .form-group:nth-child(2)").hide().find("input").attr("type", "hidden");
            }
        });
        // 是否修改文件名称切换
        $("body").on("change", PAGE + " #J_is_modify_file input", function () {
            var v = $(this).val();
            if (v === "0") {
                $("[name=targetFileName]").hide().attr("type", "hidden");
                $("[name=sourceFileName]").hide().attr("type", "hidden");
                $("#modify_file_content").hide();
            } else {
                $("[name=targetFileName]").show().attr("type", "text");
                $("[name=sourceFileName]").show().attr("type", "text");
                $("#modify_file_content").show();
            }
        });
        $("body").on("blur", PAGE + " #tab_12_3 input[name=targetFileName]", function () {
            var oldArry = $(PAGE + " #tab_12_3 input[name=sourceFileName]").val().split(",");
            var newArry = $(PAGE + " #tab_12_3 input[name=targetFileName]").val().split(",");
            var datas = [];
            if (newArry.length === oldArry.length) {
                $.each(newArry, function (index, value) {
                    datas.push({ "newValue": newArry[index], "oldValue": oldArry[index] });
                });
                require.async("./template/modify-filename-list.handlebars", function (compiled) {
                    $("#J_modify_filename").html(compiled(datas));
                });
            } else {
                toastr.error("The number of modified files is inconsistent with the number of original files.");
                $("#J_modify_filename").html('');
            }
        });
        // 导入 -> 自动填入文件名  瞎jb改， 改个锤子 先注释掉
        // $("body").on("change", "#J_import_path", function(e) {
        //     let v = $(this).val(),
        //         reg = /^\/[\s\S]+[.]+/;
        //     if (reg.test(v)) {
        //         let fileName = v.substring(v.lastIndexOf("/") + 1);
        //         $(this).next("[name=fileName]").val(fileName);
        //     }
        // })

        // 抽取 -> 目标表改变  目标批次字段删除了 先注释
        // $("body").on("change", "#J_select2_multi_tab_1_3", function(e) {
        //     showContent.getKeyDataField({
        //        table_id: e.currentTarget.value
        //     });
        // });

        // 数据抽取 -> 数据连接 源
        $("body").on("change", "#J_select2_single_tab_1_1", function (e) {
            showContent.getTableList({
                connection_id: e.currentTarget.value
            }, "#J_select2_multi_tab_1_1", false, function () {
                if (showContent.sourceTables) {
                    // 取对应ID ,因为接口存的表名
                    var origin = $("#J_select2_multi_tab_1_1").data("origin");
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = origin[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _step4$value = _step4.value,
                                id = _step4$value.id,
                                text = _step4$value.text;

                            if (text === showContent.sourceTables) {
                                $("#J_select2_multi_tab_1_1").val(id).change();
                                // showContent.getSQL({ tableId: id }); // 生成源表查询语句
                                // showContent.getBuildTableSQL({
                                //     soureTableId: id,
                                //     targetTableName: showContent.targetTable
                                // }); // 生成建表语句
                            }
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
                showContent.sourceTables = "";
            });
        });

        // 数据抽取 -> 数据连接 目标
        $("body").on("change", "#J_select2_single_tab_1_3", function (e) {
            showContent.getTableList({
                connection_id: e.currentTarget.value
            }, "#J_select2_multi_tab_1_3", true, function () {
                var include = false; // 是否手输
                if (showContent.targetTable) {
                    // 取对应ID ,因为接口存的表名
                    var origin = $("#J_select2_multi_tab_1_3").data("origin");
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = origin[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var _step5$value = _step5.value,
                                id = _step5$value.id,
                                text = _step5$value.text;

                            if (text === showContent.targetTable) {
                                $("#J_select2_multi_tab_1_3").val(id).change();
                                include = true;
                            }
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
                } else {
                    $("#J_select2_multi_tab_1_3").change();
                }

                // 如果目标表是手输保存的,则添加选项
                if (showContent.targetTable && !include) {
                    $("#J_select2_multi_tab_1_3").append("<option value=\"" + showContent.targetTable + "\" selected>" + showContent.targetTable + "</option>");
                    $("#J_select2_multi_tab_1_3").change();
                }

                showContent.targetTable = "";
            });
        });

        // 存储任务
        $("body").on("change", "#J_data_source_select2", function (e) {
            showContent.getStoredProcedure({
                connectionId: e.currentTarget.value,
                objectType: "PROCEDURE"
            }, function () {
                var isInput = true; // 是否手输
                // 编辑
                if (showContent.procedureName) {
                    var origin = $("#J_stored_procedure_select2").data("origin");
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = origin[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var text = _step6.value.text;

                            if (text === showContent.procedureName) {
                                $("#J_stored_procedure_select2").val(showContent.procedureName).change();
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
                } else {
                    // $("#J_stored_procedure_select2").change(); // 新增时触发change事件
                }
                if (showContent.procedureName && isInput) {
                    // 如果目标表是手输保存的,procedureName
                    $("#J_stored_procedure_select2").append("<option value=\"" + showContent.procedureName + "\" selected>" + showContent.procedureName + "</option>");
                    $("#J_stored_procedure_select2").change();
                }

                showContent.procedureName = "";
            });
        });

        $("body").on("click", "#J_test_store", function (e) {
            var dbConnection = $("#J_data_source_select2").val(),
                procedureName = $("#J_stored_procedure_select2").val(),
                parameters = App.getTableParamsFakeName("#J_store_params");
            if (!dbConnection) {
                toastr.info("Please select data source.");
                return;
            }
            if (!procedureName) {
                toastr.info("Please select SP.");
                return;
            }
            if (!parameters) {
                toastr.info("params is missing.");
                return;
            }
            App.blockUI({
                boxed: true,
                message: "Processing..."
            });
            showContent.testStore({
                dbConnection: dbConnection,
                procedureName: procedureName,
                parameters: JSON.stringify(parameters)
            });
        });

        // 存储过程改变
        $("body").on("change", "#J_stored_procedure_select2", function (e) {
            // 预览
            showContent.getStoredProcedurePreview({
                dbConnection: $("#J_data_source_select2").val(),
                procedureName: e.currentTarget.value,
                procType: "1"
            }, function (data) {
                var items = data.bcjson.items;
                var str = "";
                if (items && items.length > 0) {
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = items[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var TEXT = _step7.value.TEXT;

                            str += TEXT;
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

                    showContent.cm_TP.setValue(str);
                    $("[name=procLastUpdate]").val(items[0].LASTTIME);
                }
            });
            if (showContent.procedureName) {
                // 如果是编辑 不掉接口
                return;
            }
            haddleParams.delAllRow();
            // 查参数
            showContent.getStoredProcedurePreview({
                dbConnection: $("#J_data_source_select2").val(),
                procedureName: e.currentTarget.value,
                procType: "2"
            }, function (data) {
                var items = data.bcjson.items;
                var arr = [];
                if (items && items.length > 0) {
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = items[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var _step8$value = _step8.value,
                                POSITION = _step8$value.POSITION,
                                ARGUMENT_NAME = _step8$value.ARGUMENT_NAME,
                                IN_OUT = _step8$value.IN_OUT,
                                DATA_TYPE = _step8$value.DATA_TYPE;

                            arr.push({
                                no: POSITION,
                                name: ARGUMENT_NAME,
                                direction: IN_OUT,
                                type: DATA_TYPE,
                                value: ""
                            });
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

                    haddleParams.setData(arr); // 插入参数
                    showContent.setOptions(); // 插入option变量名
                }
            });
        });

        // 变量设置->变量定义->查询预览
        $("body").on("click", PAGE + " #J_query_datafield", function () {
            var connectionId = $("#J_modal_TV [name=dbConnection]").val();
            var previewStatement = $("#J_modal_TV [name=variableScript]").val().replace(/[\n]/g, " ").replace(/[\t]/g, " "); // 去掉回车换
            if (!connectionId) {
                toastr.info("Please select source data.");
                return;
            }
            if (!previewStatement) {
                toastr.info("Source SQL is missing.");
                return;
            }
            // let res = /^[^\u4e00-\u9fa5]{0,}$/;
            // if (!res.test(previewStatement)) {
            //     toastr.info("源表查询语句不能包含中文");
            //     return;
            // }
            showContent.getPreviewSQL({
                connectionId: connectionId,
                previewStatement: previewStatement,
                previewNum: "10"
            });
        });

        // 导入文本 -> 目标数据源
        $("body").on("change", "#J_select2_single_tab_1_9", function (e) {
            showContent.getTableList({
                connection_id: e.currentTarget.value
            }, "#J_select2_multi_tab_1_9", false, function () {
                if (showContent.targetTable) {
                    // 取对应ID ,因为接口存的表名
                    var origin = $("#J_select2_multi_tab_1_9").data("origin");
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                        for (var _iterator9 = origin[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                            var _step9$value = _step9.value,
                                id = _step9$value.id,
                                text = _step9$value.text;

                            if (text === showContent.targetTable) {
                                $("#J_select2_multi_tab_1_9").val(id).change();
                            }
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
                } else {
                    $("#J_select2_multi_tab_1_9").change();
                }
                showContent.targetTable = "";
            });
        });

        // 文件格式转换 -> 目标数据源
        $("body").on("change", "#J_select2_single_tab_13_1", function (e) {
            showContent.getTableList({
                connection_id: e.currentTarget.value
            }, "#J_select2_multi_tab_13_1", false, function () {
                if (showContent.dbTable) {
                    // 取对应ID ,因为接口存的表名
                    var origin = $("#J_select2_multi_tab_13_1").data("origin");
                    var _iteratorNormalCompletion10 = true;
                    var _didIteratorError10 = false;
                    var _iteratorError10 = undefined;

                    try {
                        for (var _iterator10 = origin[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                            var _step10$value = _step10.value,
                                id = _step10$value.id,
                                text = _step10$value.text;

                            if (text === showContent.dbTable) {
                                $("#J_select2_multi_tab_13_1").val(id).change();
                                // showContent.getSQL({ tableId: id }); // 生成源表查询语句
                                // showContent.getBuildTableSQL({
                                //     soureTableId: id,
                                //     targetTableName: showContent.targetTable
                                // }); // 生成建表语句
                            }
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
                }
                showContent.dbTable = "";
                $('[name=columnFileName],[name=columnFileData]').empty().clearInputs();
            });
        });

        $("body").on("change", "#J_select2_multi_tab_13_1", function (e) {
            $('[name=columnFileName],[name=columnFileData]').empty().clearInputs();
            showContent.getDataField_3({
                table_id: e.currentTarget.value
            }, "[name=columnFileName],[name=columnFileData]", function () {
                $('[name=columnFileName]').val(showContent.columnFileName);
                $('[name=columnFileData]').val(showContent.columnFileData);
            });
        });

        // 数据剖析 -> 文件夹改变
        $("body").on("change", "#J_select2_single_tab_11_1", function (e) {
            showContent.getRuleList({
                folderId: e.currentTarget.value,
                pageNumber: "1",
                pageSize: "9999"
            }, function () {
                if (showContent.applyParam) {
                    var applyParam = JSON.parse(showContent.applyParam),
                        ruleIds = applyParam.map(function (item, i) {
                        return item.ruleId;
                    });
                    $("#J_select2_multi_tab_11_1").val(ruleIds).change();
                    showContent.applyParam = "";
                }
            });
        });

        // 导入 -> 目标表改变  目标批次字段删除了 先注释
        // $("body").on("change", "#J_select2_multi_tab_1_9", function(e) {
        //     showContent.getKeyDataField({
        //        table_id: e.currentTarget.value
        //     });
        // });

        // placeholder
        $("body").on('select2:open', '#J_select2_single_tab_1_1, #J_select2_multi_tab_1_1, #J_select2_multi_tab_11_1, #J_select2_single_tab_1_3, #J_select2_multi_tab_1_3, #J_select2_single_tab_1_9, #J_select2_multi_tab_1_9, #J_select2_single_tab_13_1, #J_select2_multi_tab_13_1, #J_stored_procedure_select2, #J_data_source_select2', function (element) {
            var text = element.currentTarget.dataset.searchplaceholder;
            $('.select2-search__field').attr('placeholder', text);
        });

        // 数据剖析 -> 查询sql
        // $("body").on("click", `${PAGE} #J_get_sql_DQ`, function() {
        //     if ($("#J_select2_multi_tab_11_1").val()) {
        //         let tableId = $("#J_select2_multi_tab_11_1").val();
        //         showContent.getSQL({ tableId }, data => {
        //             data = data.replace(/[\n\t↵]/g, "");
        //             var arr = data.substring(data.indexOf("SELECT") + 6, data.lastIndexOf("FROM")).split(",");
        //             showContent.haddleParams_DQ.delAllRow();
        //             showContent.haddleParams_DQ_S.delAllRow();
        //             $("#J_dq_params [data-clone-sample] [fakename=colName]").html("");
        //             arr.forEach((item, i) => {
        //                 $("#J_dq_params [data-clone-sample] [fakename=colName]").append(`<option value="${arr[i]}">${arr[i]}</option>`);
        //             });
        //             // 编辑赋值
        //             if (showContent.alyParam) {
        //                 showContent.haddleParams_DQ.setData(JSON.parse(showContent.alyParam));
        //                 $("#J_dq_params tr:not([data-clone-sample]) [fakename=colName]").last().change();
        //                 showContent.alyParam = "";
        //             }
        //             if (showContent.successParam) {
        //                 showContent.haddleParams_DQ_S.setData(JSON.parse(showContent.successParam));
        //                 showContent.successParam = "";
        //             }
        //         });
        //     }
        // });

        // 存储过程改变
        $("body").on("change", "#J_store_params [fakename=name], #J_store_params [fakename=direction]", function () {
            showContent.setOptions();
        });

        // 存储过程任务->存储过程设置-> 参数 操作
        $("body").on("click", PAGE + " #J_modal_TP [name=oparate]", function () {
            var type = $(this).data("type");
            if (type === "add") {
                haddleParams.addRow();
            } else if (type === "batchAdd") {
                haddleParams.batchAddRow();
            } else if (type === "delAll") {
                haddleParams.delAllRow();
                showContent.setOptions(); // 返回值变量名 下拉框根据表里数据变化
            } else if (type === "del") {
                haddleParams.delRow($(this));
                showContent.setOptions(); // 返回值变量名 下拉框根据表里数据变化
            }
        });

        // 导出 -> 头部改变
        $("body").on("change", "[name=headFlag]", function () {
            var v = $(this).val();
            if (v == "N") {
                $("#J_header_content").hide().find("[name=headerContent]").attr("type", "hidden");
            } else {
                $("#J_header_content").show().find("[name=headerContent]").attr("type", "text");
            }
        });

        // Web Task -> isAuth Change
        $("body").on("change", "[name=isAuth]", function () {
            debugger;
            var v = $(this).val();
            if (v == "0") {
                $("#userParams").hide().find("[name=requestUserName]").attr("type", "hidden");
                $("#userParams").find("[name=requestSecretWord]").attr("type", "hidden");
            } else {
                $("#userParams").show().find("[name=requestUserName]").attr("type", "text");
                $("#userParams").find("[name=requestSecretWord]").attr("type", "password");
            }
        });

        // 导入文本任务->字段映射->获取字段 等操作
        $("body").on("click", PAGE + " #J_get_data_btns_2 [data-type]", function () {
            if (!$("#J_select2_multi_tab_1_9").val()) {
                toastr.info("Please select target table.");
                return;
            }
            var type = $(this).data("type");
            var table_id = $("#J_select2_multi_tab_1_9").val();
            // 刷新
            if (type === "refresh" || type === "get") {
                showContent.getDataField_2({
                    table_id: table_id
                });
                // 删除
            } else if (type === "del") {
                showContent.haddleDataField_2.delCheckedRow();
                // 获取字段
            }
        });

        // $("body").on("change", `${PAGE} [data-type=target] select`, function() {
        //     let siblings = $(this).closest("tr").siblings().find("[data-type=target] select");
        //     let v = $(this).val(), _this = $(this);;
        //     $.each(siblings, function() {
        //         let siblingV = $(this).val();
        //         if (siblingV && siblingV === v) {
        //             toastr.info("目标字段不可被映射多次，请重新选择");
        //             _this.val("");
        //             return;
        //         }
        //     })
        // });

        // 数据抽取，导入设置 字段映射
        $("body").on("change", PAGE + " [data-type=target] select", function () {
            var dom = $(this).closest("tbody").find("[data-type=target] select").data("v", "");
            dom.find("option").removeAttr("disabled");
            $.each(dom, function () {
                var v = $(this).val();
                if (v) {
                    dom.find("option[value=" + v + "]").attr("disabled", "");
                    $(this).data("v", v);
                }
            });
        });
        // 数据抽取，导入设置 字段映射 源字段失焦事件
        $("body").on("blur", PAGE + " [data-type=source] input", function () {
            var val = $(this).val();
            var second = $(this).attr("second"); //用于判断option是替换值还是新增;
            // 如果已经新增过的option则更改其值
            if (second || second == "") {
                if (val) {
                    $(this).hide();
                    if (second == "") {
                        //如果是点击删除option的请选择后输入框失焦此时应该新增option
                        var option = "<option value=" + val + " second=" + val + ">" + val + "</option>";
                        $(this).hide();
                        $(PAGE + " [data-type=source] select").append(option).show();
                        $(this).closest("td").find("select").val(val);
                        return;
                    }
                    if ($(this).closest("td").find("select option[second=" + second + "]").length > 0) {
                        //如果找到对应option则修改
                        $(PAGE + " [data-type=source]").find("select option[second=" + second + "]").val(val).text(val).attr("second", val);
                        $(this).closest("td").find("select").show();
                    } else {
                        //为找到则新增
                        var _option = "<option value=" + val + " second=" + val + ">" + val + "</option>";
                        $(PAGE + " [data-type=source] select").append(_option);
                        $(this).closest("td").find("select").val(val);
                        $(this).closest("td").find("select").show();
                    }
                } else {
                    $(this).hide();
                    var selectValue = $(this).closest("td").find("select").val();
                    $(PAGE + " [data-type=source] select option[value=" + selectValue + "]").remove();
                    $(this).attr("isOptionClick", "1"); //请选择option是否能够点击
                    $(this).closest("td").find("select").show();
                }
            } else {
                if (val) {
                    //    第一次失焦时且输入框有值的情况
                    $(this).hide();
                    var _option2 = "<option value=" + val + " second=" + val + ">" + val + "</option>";
                    var html_input_t = "<input class=\"form-control\" type=\"text\" second=" + val + ">";
                    $(PAGE + " [data-type=source] select").append(_option2);
                    var html = "<select class=\"form-control input-sm source-add-select\">" + $(PAGE + " [data-type=source] select").html() + "</select>";
                    $(this).closest("td").append(html);
                    $(this).closest("td").find("select").val(val);
                    $("body").on("dblclick", PAGE + " .source-add-select", function () {
                        if (!$(this).find("option:selected").attr("second") && !$(this).closest("td").find("input").attr("isOptionClick")) return;
                        //点击非新增的option无效，如果是删除后的请选择可以点击
                        if ($(this).closest("td").find("input").attr("isOptionClick")) {
                            $(this).closest("td").find("input").removeAttr("isOptionClick");
                        }
                        if ($(this).closest("td").find("input").attr("second")) {
                            $(this).hide();
                            $(this).closest("td").find("input").show().val($(this).val()).attr("second", $(this).val());
                        } else {
                            $(this).closest("td").find("input").remove();
                            $(this).closest("td").append(html_input_t);
                            $(this).closest("td").find("input").show().val($(this).val()).attr("second", $(this).val());
                            $(this).hide();
                        }
                    });
                }
            }
            //    $(this)
        });

        // 执行Web任务 -> 添加公共参数
        $("body").on("click", '#tab_14_2 [name=apiParamsInputCommon] #add', function () {
            var html_t = "<div name=\"apiParamsInputCommon\" style=\"position: relative;height: 60px;\">\n                <div class=\"form-group col-md-4\">\n                    <label class=\"control-label col-md-4\">\n                        <span>Name\uFF1A</span>\n                    </label>\n                    <div class=\"form-group col-md-8\">\n                        <input type=\"text\" class=\"form-control\" maxlength=\"64\" name=\"name\" placeholder=\"64 characters maximum\">\n                    </div>\n                </div>\n                <div class=\"form-group col-md-4\">\n                    <label class=\"control-label col-md-4\">\n                        <span>Value\uFF1A</span>\n                    </label>\n                    <div class=\"form-group col-md-8\">\n                        <input type=\"text\" class=\"form-control\" maxlength=\"64\" name=\"value\" placeholder=\"64 characters maximum\">\n                    </div>\n                </div>\n                <div class=\"form-group col-md-4\">\n                    <label class=\"control-label col-md-4\">\n                        <span>Location\uFF1A</span>\n                    </label>\n                    <div class=\"form-group col-md-8\">\n                        <select class=\"form-control\" name=\"position\">\n                            <option value=\"Header\">Header</option>\n                            <option value=\"Body\">Body</option>\n                        </select>\n                    </div>\n                </div>\n                <a style=\"position: relative;top: 8px;right: 0;\" id='del' title=\"\"><i class=\"fa fa-trash-o\"></i></a>\n            </div>";
            $(this).parent().after(html_t);
        });

        // 执行Web任务 -> 添加api参数
        $("body").on("click", '#tab_14_3 [name=apiParamsInput] #add', function () {
            var html_t = "<div name=\"apiParamsInput\" style=\"position: relative;height: 60px;\">\n                <div class=\"form-group col-md-4\">\n                    <label class=\"control-label col-md-4\">\n                        <span>Name\uFF1A</span>\n                    </label>\n                    <div class=\"form-group col-md-8\">\n                        <input type=\"text\" class=\"form-control\" maxlength=\"64\" name=\"name\" placeholder=\"64 characters maximum\">\n                    </div>\n                </div>\n                <div class=\"form-group col-md-4\">\n                    <label class=\"control-label col-md-4\">\n                        <span>Value\uFF1A</span>\n                    </label>\n                    <div class=\"form-group col-md-8\">\n                        <input type=\"text\" class=\"form-control\" maxlength=\"64\" name=\"value\" placeholder=\"64 characters maximum\">\n                    </div>\n                </div>\n                <div class=\"form-group col-md-4\">\n                    <label class=\"control-label col-md-4\">\n                        <span>Location\uFF1A</span>\n                    </label>\n                    <div class=\"form-group col-md-8\">\n                        <select class=\"form-control\" name=\"position\">\n                            <option value=\"Header\">Header</option>\n                            <option value=\"Body\">Body</option>\n                        </select>\n                    </div>\n                </div>\n                <a style=\"position: relative;top: 8px;right: 0;\" id='del' title=\"\"><i class=\"fa fa-trash-o\"></i></a>\n            </div>";
            $(this).parent().after(html_t);
        });

        // 执行Web任务 -> 删除公共和api参数
        $("body").on("click", '#tab_14_2 [name=apiParamsInputCommon] #del,  #tab_14_3 [name=apiParamsInput] #del', function () {
            $(this).parent().remove();
        });

        // 数据剖析->剖析对象->查询预览
        // $("body").on("click", `${PAGE} #J_preview_sql_DQ`, function() {
        //     let connectionId = $("#J_select2_single_tab_11_1").val();
        //     let previewStatement = $("#J_cm_DQ").val().replace(/[\n]/g, " ").replace(/[\t]/g, " "); // 去掉回车换
        //     if (!connectionId) {
        //         toastr.info("请选择源数据");
        //         return;
        //     }
        //     if (!previewStatement) {
        //         toastr.info("源表查询语句不能为空");
        //         return;
        //     }
        //     let res = /^[^\u4e00-\u9fa5]{0,}$/;
        //     if (!res.test(previewStatement)) {
        //         toastr.info("源表查询语句不能包含中文");
        //         return;
        //     }
        //     showContent.getPreviewSQL({
        //         connectionId,
        //         previewStatement,
        //         previewNum: "10"
        //     });
        // });

        // 数据剖析 参数 操作
        // $("body").on("click", "#J_dq_params_btn [data-type]", function() {
        //     let type = $(this).data("type");
        //     switch (type) {
        //         case "add": haddleParams_DQ.addRowDQ();
        //             break;
        //         case "addAll": haddleParams_DQ.addAllRow();
        //             break; 
        //         case "delAll": haddleParams_DQ.delAllRow();
        //             break;
        //     }
        //     $("#J_dq_params tr:not([data-clone-sample]) [fakename=colName]").last().change();

        // });

        // 数据剖析 参数 操作
        // $("body").on("click", "#J_dq_params [data-type=analy]", function() {
        //     $("#J_analy_modal").modal("show");
        //     $(this).addClass("current");
        //     $("#J_analy_modal input[type=checkbox]").prop("checked", false);
        //     let config = $(this).prev().val();
        //     if (config) {
        //         config.split(",").forEach((item, i) => {
        //             if (item === "1") {
        //                 $("#J_analy_modal input[type=checkbox]").eq(i).prop("checked", true);
        //             }
        //         })
        //     }
        //     jQuery.uniform.update();

        // });

        // 数据剖析 参数 操作
        // $("body").on("click", "#J_analy_modal #J_analy_save", function() {
        //     let arr = [];
        //     $.each($("#J_analy_modal input[type=checkbox]"), function() {
        //         if ($(this).prop("checked")) {
        //             arr.push("1");
        //         } else {
        //             arr.push("0");
        //         }
        //     });
        //     $("[data-type=analy].current").removeClass("current").prev().val(arr.join(","));
        //     $("#J_analy_modal").modal("hide");
        // });

        // 数据剖析 参数 操作
        // $("body").on("click", "#J_dq_params [data-type=del]", function() {
        //     haddleParams_DQ.delRow($(this));
        //     $("#J_dq_params tr:not([data-clone-sample]) [fakename=colName]").last().change();
        // });

        // 数据剖析 成功判断条件 操作
        // $("body").on("click", "#J_dq_success_params_btn [data-type]", function() {
        //     let type = $(this).data("type");
        //     switch (type) {
        //         case "add": haddleParams_DQ_S.addRowDQ_S();
        //             break;
        //         case "addAll": haddleParams_DQ_S.addAllRow_S();
        //             break; 
        //         case "delAll": haddleParams_DQ_S.delAllRow();
        //             break;
        //     }
        //     $("#J_dq_success_params tr:not([data-clone-sample]) [fakename=ruleName]").change();
        // });

        // 数据剖析 成功判断条件 操作
        // $("body").on("click", "#J_dq_success_params [data-type=del]", function() {
        //     haddleParams_DQ_S.delRow($(this));
        // });

        // 剖析规则改变，动态添加成功条件
        // $("body").on("change", "#J_dq_params tr:not([data-clone-sample]) [fakename=colName], #J_dq_params tr:not([data-clone-sample]) [fakename=analyType]", function() {
        //     $("#J_dq_success_params [fakename=ruleName]").html("");
        //     let arr = [];
        //     $.each($("#J_dq_params tr:not([data-clone-sample]) [fakename=colName]"), function() {
        //         let v = $(this).val();
        //         if (arr.includes(v)) {
        //             return;
        //         }
        //         arr.push(v);
        //         $("#J_dq_success_params [fakename=ruleName]").append(`<option value="${$(this).val()}">${$(this).val()}</option>`);
        //     });
        //     $("#J_dq_success_params tr:not([data-clone-sample]) [fakename=ruleName]").change();
        // });

        // 剖析规则改变，动态添加成功条件
        // $("body").on("change", "#J_dq_success_params tr:not([data-clone-sample]) [fakename=ruleName]", function() {
        //     let v = $(this).val(), _this = $(this);
        //     $.each($("#J_dq_params tr:not([data-clone-sample]) [fakename=colName]"), function() {
        //         if ($(this).val() === v) {
        //             let analyType = $(this).parent().siblings().find("[fakename=analyType] option:selected").text();
        //             _this.parent().siblings().find("[fakename=ruleType]").val(analyType);
        //         }
        //     })
        // });
    });
    module.exports = init;
});