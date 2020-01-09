define(function (require, exports, module) {
    var showContent = require("./database-importShow");
    var PAGE = location.hash.split("?")[0].replace("#", ".page-");
    var init = {
        load: function load() {
            showContent._load(); //加载页面数据
        }
    };
    $(function () {

        $("body").on("click", "#J_expend_list,[name=closeList],.slide-mask", function () {
            if ($(".export-list").css("opacity") === "0") {
                $(".export-list").css("transform", "translateX(0px)");
                $(".export-list").css("opacity", "1");
                $(".slide-mask").show();
                showContent.unScroll();
                showContent.getExportList();
            } else {
                showContent.reScroll();
                $(".export-list").css("transform", "translateX(800px)");
                $(".export-list").css("opacity", "0");
                $(".slide-mask").hide();
            }
        });

        // 点查询
        $("body").on("click", "#J_export_list_search", function () {
            showContent.getList();
        });

        // enter
        $("body").on("keydown", "#J_export_list_form [name=objectName]", function (e) {
            if (e.keyCode == "13") {
                e.preventDefault();
                showContent.getList();
            }
        });

        // 1点击右侧日志查询
        $("body").on("click", PAGE + " #J_export_search", function () {
            if (!App.checkDate($("#J_export_form"), "发生时间")) {
                return;
            }
            showContent.getExportList();
        });

        // 点击下载文件
        $("body").on("click", "[name=download]", function () {
            var filePath = $(this).attr("filePath");
            App.blockUI({
                boxed: true,
                message: "Processing..."
            });
            showContent.downloadFile({
                fileClass: "CONFIG",
                filePath: filePath
            }).then(function (data) {
                return showContent.downloadFile2({
                    fileClass: "CONFIG",
                    downloadToken: data.bcjson.items[0].downloadToken,
                    _s_t_i_0000: $.kingdom.getValue("x-trace-user-id")
                });
            }).catch(function (data) {
                console.error(data);
            });
        });
        // 点击重新导出文件
        $("body").on("click", "[name=reExport]", function () {
            var logId = $(this).attr("logId");
            var objectName = $(this).attr("objectName");
            $("#J_reExport_edit_fileName [name=fileName]").val(objectName.substring(5, objectName.length - 4) + "-副本");
            $("#J_edit_fileName_reExport_modal").modal("show");
            showContent.reExportParams = { logId: logId };
        });
        // 点击重新导出功能确定按钮
        $("body").on("click", PAGE + " .reExport_edit_fileName_submit", function () {
            if ($('#J_reExport_edit_fileName').validate().form()) {
                $(".success-info-wrap .fileName").html($("#J_reExport_edit_fileName [name=fileName]").val());
                $("#J_edit_fileName_reExport_modal").modal("hide");
                showContent.reExport($.extend(showContent.reExportParams, { "objectName": $("#J_reExport_edit_fileName [name=fileName]").val() }));
            }
        });
        $("body").on("mouseover", "#import_question_title", function () {
            $(this).addClass("open");
        });
        $("body").on("mouseout", "#import_question_title", function () {
            $(this).removeClass("open");
        });
        // 点列表头部依赖导出功能
        $("body").on("click", "#J_export_rely", function () {
            var dom = $("#J_table_tree tbody input:checked");
            if (dom.length === 0) {
                toastr.info("Please Select");
                return;
            }
            $("#J_edit_fileName [name=fileName]").val("未命名" + showContent.timestampToTime());
            $("#J_edit_fileName [name=fileName]").attr("listExport", false);
            $("#J_edit_fileName [name=fileName]").attr("dataType", "1");
            $("#J_edit_fileName_modal").modal("show");
        });
        // 点击导出功能确定按钮
        $("body").on("click", PAGE + " .edit_fileName_submit", function () {
            if ($('#J_edit_fileName').validate().form()) {
                $(".success-info-wrap .fileName").html($("#J_edit_fileName [name=fileName]").val());
                var dataType = $("#J_edit_fileName [name=fileName]").attr("dataType");

                // 判断是否为列表导出   
                if ($("#J_edit_fileName [name=fileName]").attr("listExport") == "true") {
                    showContent.export($.extend(showContent.exportListParams, { dataType: dataType }, { "objectName": $("#J_edit_fileName [name=fileName]").val() }));
                    return;
                }
                var params = showContent.filterCondition();
                var objectName = $("#collapseExample002 [name=objectName]").val();
                var paramsMap = $.extend({ objectName: objectName }, { dataType: dataType }, params);
                showContent.export($.extend(paramsMap, { "objectName": $("#J_edit_fileName [name=fileName]").val() }));
            }
        });
        // 点列表头部导出
        $("body").on("click", "#J_export", function () {
            var dom = $("#J_table_tree tbody input:checked");
            if (dom.length === 0) {
                toastr.info("Please Select");
                return;
            }

            $("#J_edit_fileName [name=fileName]").val("未命名" + showContent.timestampToTime());
            $("#J_edit_fileName [name=fileName]").attr("listExport", false);
            $("#J_edit_fileName [name=fileName]").attr("dataType", "0");
            $("#J_edit_fileName_modal").modal("show");
        });

        // 点击列表内 导出
        $("body").on("click", PAGE + " #J_table_tree [name=\"export\"]", function () {
            //点击列表内导出时清空全部选中状态
            if ($("#J_table_tree [type=checkbox]:checked").length > 0) {
                if ($("#J_table_tree tr span:eq(0)").attr("class") === "checked") {
                    $("#J_table_tree tr input:eq(0)").click();
                } else {
                    $("#J_table_tree tr input:eq(0)").click();
                    $("#J_table_tree tr input:eq(0)").click();
                }
            }
            //选中当前行
            $(this).closest("tr").find("[type=checkbox]").click();
            var level = $(this).closest("tr").attr("level"),
                // 当前导出的level
            level2 = $("#J_table_tree [level=2] [type=checkbox]"),
                // 所有level2
            arr3 = [],
                // 单个的数据集 array
            arr2 = [],
                // 父类的数据集 array
            objectType = void 0; // 父类的数据集 传参
            // 选中所有父类

            if (level === "1") {
                level2.length && $.each(level2, function () {
                    var ot = $(this).attr("objecttype");
                    arr2.push(ot);
                });
                objectType = arr2.join(",");
                // 选中一个父类
            } else if (level === "2") {
                objectType = $(this).closest("tr").find("[type=checkbox]").attr("objecttype");
            } else if (level !== "1" && level !== "2") {
                var checkedAll = $("#J_table_tree [type=checkbox]:checked"); // 所有被选中的checkBoxed
                $.each(checkedAll, function () {
                    var obj = "";
                    if ($(this).attr("obj")) {
                        obj = JSON.parse($(this).attr("obj"));
                    }
                    if (obj) {
                        if (!obj.folderName) {
                            var _obj = obj,
                                _objectType = _obj.objectType,
                                objectId = _obj.objectId,
                                _objectName = _obj.objectName,
                                tableName = _obj.tableName,
                                columnsId = _obj.columnsId,
                                objectClassType = _obj.objectClassType,
                                folderId = _obj.folderId;

                            arr3.push({
                                objectType: _objectType,
                                objectId: objectId,
                                objectName: _objectName,
                                tableName: tableName,
                                columnsId: columnsId,
                                objectClassType: objectClassType,
                                folderId: folderId
                            });
                        }
                    }
                });
                // let { objectType, objectId, objectName, tableName, columnsId, objectClassType, folderId } = obj;
                // arr3.push({
                // 	objectType,
                // 	objectId,
                // 	objectName,
                // 	tableName,
                // 	columnsId,
                // 	objectClassType,
                // 	folderId,
                // });
            }
            var objectName = $("#collapseExample002 [name=objectName]").val();
            showContent.exportListParams = {
                objectType: objectType,
                objectName: objectName,
                objectList: JSON.stringify(arr3)
            };
            $("#J_edit_fileName [name=fileName]").val("未命名" + showContent.timestampToTime());
            $("#J_edit_fileName [name=fileName]").attr("listExport", true);
            $("#J_edit_fileName [name=fileName]").attr("dataType", "0");
            $("#J_edit_fileName_modal").modal("show");
        });
        // 点列表头部导入
        $("body").on("click", "#J_import", function () {
            if ($("#J_import_file").val() == "") {
                toastr.error("请先选择zip文件!");
                return;
            }
            if ($("select[name=execDbConnectionId]").val() == "") {
                toastr.error("请先选择数据连接!");
                return;
            }
            var tables = $("#J_import_modal .tab-content table");
            var paramsMaps = [];

            $.each(tables, function (i, table) {
                var dom = $(table).find("tbody input:checked");
                titleName = $("#J_import_modal [href=#tab_3_" + i + "]").html();
                if (dom.length === 0) {
                    toastr.info(" " + titleName + "\u8BF7\u5148\u9009\u62E9\u6570\u636E");
                    return false;
                }
                var params = showContent.filterConditionImport(i);
                var execDbConnectionId = $("#J_import_form [name=execDbConnectionId]").val();
                var deZipPaths = showContent.deZipPaths;
                var paramsMap = $.extend({ execDbConnectionId: execDbConnectionId, "deZipPath": deZipPaths[i] }, params);
                paramsMaps.push(paramsMap);
            });
            tables.length === paramsMaps.length && showContent.import({ "jsonConfig": paramsMaps });

            // let params = showContent.filterConditionImport();
            // let execDbConnectionId = $("#J_import_form [name=execDbConnectionId]").val();
            // let deZipPath = showContent.deZipPath;
            // let paramsMap = $.extend({ execDbConnectionId, deZipPath }, params);
        });

        // 点导入
        $("body").on("click", "#J_tree_import", function () {
            App.clearForm("J_import_form");
            $("#J_import_form [name=file]").val("");
            $("#J_import_form span[role=textbox]").html("");
            $("#J_import_modal .nav-tabs").html("");
            $("#J_import_modal .tab-content").html("");
            $("#execDbConnection").html("");
            $("#J_import_modal").modal("show");
        });

        // 选取文件后
        $("body").on("change", "#J_import_file", function () {
            showContent.getImportList();
        });

        // 点击规则操作
        $("body").on("click", PAGE + " #J_export_list [name=del]", function (e) {
            e.stopPropagation();
            var logId = $(this).attr("logId");
            bootbox.confirm("Please Confirm to delete", function (result) {
                if (result) {
                    showContent.del({
                        logId: logId
                    });
                }
            });
        });
        // 点击错误日志
        $("body").on("click", PAGE + " #J_export_list [name=\"checklog\"]", function () {
            var filename = $(this).attr("filename"),
                content = $(this).attr("content");
            showContent.downloadLog(filename, content);
        });
    });
    module.exports = init;
});
//