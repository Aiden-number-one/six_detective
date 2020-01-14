var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 * @Author: Sean Mu 
 * @Date: 2018-09-25 11:07:42 
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-04-18 17:19:18
 */

define(function (require, exports, module) {
    var showContent = {};
    require("plugins/jstree/dist/jstree");
    require("plugins/drag/kd_drag.js");
    require("plugins/jstree/dist/themes/default/style.css");
    require("plugins/select2/js/select2.js");
    require("plugins/select2/css/select2.css");
    require("plugins/bootstrap-fileinput/bootstrap-fileinput.js");
    require("plugins/bootstrap-fileinput/bootstrap-fileinput.css");
    showContent.load = function () {
        App.initCheckableTable($("#connect-data-result"));
        showContent.initForm();
        showContent.get_source_connect_List();
        showContent.getCurrentTreeData = [];
        showContent.getConnectTypeData = [];
        showContent.targetTable = null; // 存放目标对象 (Excel类，数据回显时使用)

        //初始化字典操作
        $.kingdom.getDict("ROLLBACK_FLAG", "[name=rollbackFlag]"); // 数据抽取任务->目标->提交方式
        $.kingdom.getDict("BEFORE_RULE", "[name=beforeRule]"); // 数据抽取任务->目标->目标写入前操作
    };
    // 获取数据源数据
    showContent.get_source_connect_List = function (val) {
        var paramsMap = val ? { connectionName: val } : {};
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_source_config", "v4.0", paramsMap, function (data) {
            var items = data.bcjson.items || data.bcjson;
            if (data.bcjson.flag == "1" && items) {
                require.async("./template/data-source-configuration-list.handlebars", function (compiled) {
                    $(".data-source-configuration-list").html(compiled(items));
                    if (!items[0]) {
                        return false;
                    }
                    var connectionName = items[0].connectionName;
                    var connectionType = items[0].connectionType;
                    $(".data-source-r-header").find("strong").html(connectionName);
                    $(".data-source-r-header").find("span").html(connectionType);
                    $(".data-source-configuration-list li:first-child").click();
                });
            }
        });
    };
    // 获取所属用户下拉框
    showContent.getUser = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_schemas_from_tables_info", "v4.0", params, function (data) {
            var items = data.bcjson.items || data.bcjson;
            if (data.bcjson.flag == "1" && items) {
                require.async("./template/data-source-configuration-option.handlebars", function (compiled) {
                    $("#J_dsc_list_detail #schemName").html("<option value=''>- Please select a type -</option>" + compiled(items));
                });
            }
        });
    };
    // 获取驱动类型
    showContent.getConnectType = function (typeName) {
        var paramsMap = {};
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_driver_info", "v4.0", paramsMap, function (data) {
            var items = data.bcjson.items || data.bcjson;
            showContent.list = items;
            if (data.bcjson.flag == "1" && items) {
                showContent.getConnectTypeData = items;
                require.async("./template/connect-type-list.handlebars", function (compiled) {
                    $("#connection_type").html(compiled(items));
                    //第一次进入则url模板
                    App.clearForm("data-connect-add-form");
                    $("#data-connect-add-form input[name='principal']").closest(".form-group").addClass("hide");
                    $("#J_dsc_commonType_add input[name=jdbc_string]").val(items[0] && items[0].urlInfo);
                    showContent.currentUrlInfo = items[0] && items[0].urlInfo;
                    if (typeName === "MySQL") {
                        typeName = "Mysql";
                    } else if (typeName === "Excel") {
                        typeName = "XLS文件";
                    } else if (typeName === "CSV") {
                        typeName = "TXT/CSV文件";
                    } else if (typeName === "星环INCEPTOR") {
                        typeName = "星环Inceptor";
                    } else if (typeName === "CDH") {
                        $("#data-connect-add-form input[name='principal']").closest(".form-group").removeClass("hide");
                    }
                    $.each(items, function (i, item) {
                        if (item.driverName.toUpperCase() === typeName.toUpperCase()) {
                            $("#data-connect-add-form input[name='db_port']").val(item.dbPort);
                        }
                    });
                    $($("#connection_type").find("option[driverName='" + typeName + "']")[0]).attr("selected", "true").change();
                });
            }
        });
    };
    //  获取修改弹框中驱动类型
    showContent.getConnectType_edit = function (params) {
        var paramsMap = {};
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_driver_info", "v4.0", paramsMap, function (data) {
            var items = data.bcjson.items || data.bcjson;
            showContent.list = items;
            showContent.data = items;
            if (data.bcjson.flag == "1" && items) {
                showContent.getConnectTypeData = items;
                require.async("./template/connect-type-list.handlebars", function (compiled) {
                    $("#connection_type_edit").html(compiled(items));
                    $($("#connection_type_edit").find("option[driverName='" + params + "']")[0]).attr("selected", "true");
                });
            }
        });
    };

    //  获取数据源结果
    showContent.qry_connect_data = function (params) {
        var connection_id = $(".data-source-configuration-list .click-add-background").attr("connection_id");
        var _params = {
            connection_id: connection_id
        }; // 这里用来传特殊参数
        _params = _extends(_params, params);
        $.kingdom.getList({
            apiName: "bayconnect.superlop.get_metadata_table_info",
            apiVision: "v4.0",
            params: _params,
            tableId: "connect-data-result",
            formName: "data-source-configuration-form",
            pageId: "dsc-pages",
            template: "data-source-configuration/template/data-source-configuration-datasourcedetail.handlebars",
            cb: showContent.qry_connect_data
        });
        $("#connect-data-result .checked").removeClass('checked');
    };

    //  测试数据连接提交
    showContent.testDataConnectList = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_source_connect_test", "v4.0", params, function (data) {
            App.unblockUI();
            var items = data.bcjson;
            if (items.flag == "0") {
                toastr.error(items.msg);
            } else {
                toastr.success(items.msg);
            }
        });
    };
    // 新增连接数据/编辑连接数据
    showContent.addDataConnectList = function (params) {
        var paramsMap = $.extend({ opType: "ADD" }, params);
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_data_source_config", "v4.0", paramsMap, function (data) {
            App.unblockUI();
            var items = data.bcjson;
            if (items.flag == "0") {
                toastr.error(items.msg);
            } else {
                //新增后清空以前数据
                //$("#addReceivbleForm input").val("");
                toastr.success(items.msg);
                App.clearForm("data-connect-add-form");
                showContent.get_source_connect_List();
            }
        });
    };
    // 修改连接数据
    showContent.editDataConnectList = function (params) {
        var paramsMap = $.extend({ opType: "UPD" }, params);
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_data_source_config", "v4.0", paramsMap, function (data) {
            App.unblockUI();

            var items = data.bcjson;
            if (items.flag == "0") {
                toastr.error(items.msg);
            } else {
                //新增后清空以前数据
                //$("#addReceivbleForm input").val("");
                toastr.success(items.msg);
                showContent.get_source_connect_List();
            }
        });
    };
    // 删除连接数据
    showContent.deleteDataConnect = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_data_source_config", "v4.0", params, function (data) {
            App.unblockUI();
            var items = data.bcjson;
            if (items.flag == "0") {
                toastr.error(items.msg);
            } else {
                //新增后清空以前数据
                //$("#addReceivbleForm input").val("");
                toastr.success(items.msg);
                showContent.get_source_connect_List();
            }
        });
    };

    //查询导入元数据问题
    showContent.getImportDataSource = function (connection_id) {
        var params = {
            connection_id: connection_id
        };
        $("#J_tree_import").jstree("destroy");
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_db_metadata_schemas", "v4.0", params, function (data) {

            //取消交互
            App.unblockUI();
            if (data.bcjson.flag === '1') {
                var items = data.bcjson.items;
                showContent.getCurrentTreeData = items;
                showContent.generateTree(items);
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };
    // 获取文件地址
    showContent.listImport = function (params) {
        return new Promise(function (resolve, reject) {
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_metadata_table_export_info", "v4.0", params, function (data) {
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
    showContent.listImport2 = function (params, i) {
        return new Promise(function (resolve, reject) {
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.file_info", "v4.0", params, function (data) {
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
    showContent.listImport3 = function (params, i) {
        var url = "/superlop/restv2/admin/v2.0/bayconnect.superlop.file_download_quick.json?fileClass=" + params.fileClass + "&filePath=" + params.filePath;
        // p=" + encodeURI(JSON.stringify(params));
        try {
            var a = document.createElement("a");
            a.href = url;
            a.download = true;
            a.click();
            App.unblockUI();
        } catch (e) {
            console.error(e);
        }
    };

    //生成数操作
    showContent.generateTree = function (items, isSearch) {
        var mainTreeData = [];
        if (!items) {
            return false;
        }
        $.each(items, function (index, value) {
            var children = [];
            // value.tableList.length > 5000 ? [].concat(value.tableList).slice(0,30) : 
            $.each(value.tableList, function (childIndex, childValue) {
                var obj = {};
                if (childValue.tableType === "TABLE") {
                    obj.text = childValue.tableName + "<span style='font-size:12px;font-weight:100;'>（Table）</span>";
                } else {
                    obj.text = childValue.tableName + "<span style='font-size:12px;font-weight:100;'>（View）</span>";
                }
                obj.id = "child-" + value.schemaName + "-" + childIndex;
                obj.children = false;
                if (childValue.tableType === "TABLE") {
                    obj.icon = "glyphicon glyphicon-list-alt";
                } else {
                    obj.icon = "glyphicon glyphicon-modal-window";
                }
                if (childValue.isExist === "Y") {
                    obj.a_attr = { "class": "is-exit-table" };
                }
                children.push(obj);
            });
            var obj = {
                text: value.schemaName + "<span style='font-size:12px;font-weight:100;'>（" + value.tableCounts + "）</span>",
                id: "parent" + index,
                children: children
            };
            mainTreeData.push(obj);
        });
        $("#J_tree_import").jstree("destroy");
        $("#J_tree_import").jstree({
            ui: {
                theme_name: "checkbox"
            },
            core: {
                themes: {
                    responsive: false
                },
                check_callback: !0,
                data: mainTreeData,
                multiple: false,
                dblclick_toggle: false //禁用tree的双击展开
            },
            types: {
                default: {
                    icon: "glyphicon glyphicon-user"
                }
            },
            plugins: ["types", "checkbox", "themes", "html_data"],
            checkbox: {
                keep_selected_style: false, //是否默认选中
                three_state: true, //父子级别级联选择
                tie_selection: false
            }
        }).on("loaded.jstree", function () {
            if (isSearch) {
                $("#J_tree_import").jstree("open_all");
            }
        });
    };

    //进行数据保存
    showContent.saveTableList = function () {
        var connection_id = $(".data-source-configuration-list .click-add-background").attr("connection_id");
        var node = $.kingdom.uniqueArray($("#J_tree_import").jstree("get_checked"));
        var selectData = [];
        $.each(node, function (index, value) {
            if (value.indexOf("child") > -1) {
                var tableName = $("#" + value + " a").text().split("（")[0];
                var schemaIdName = $("#" + value).closest(".jstree-children").parent("li").find("a:eq(0)").text().split("（")[0];
                selectData.push(schemaIdName + "." + tableName);
            }
        });
        var params = {
            connection_id: connection_id,
            tables_info: selectData.join(",")
        };

        App.blockUI({
            boxed: true,
            message: "Saving..."
        });
        //保证blockUI在modal的上层
        $(".blockPage").css("z-index", "9999999999999");

        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_db_metadata", "v4.0", params, function (data) {
            App.unblockUI();
            if (data.bcjson.flag === "1") {
                toastr.success("Saved Successfully");

                //modal弹出框消失
                $(".modal-header button.close").click();

                //查询出新增过的新的列表
                var paramsSend = {};
                paramsSend.pageNumber = "1";
                showContent.qry_connect_data(paramsSend);
                showContent.getUser({ "connection_id": showContent.connect_id });
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    //获取选中的checkbox中的tableid及当前的connection_id
    showContent.getCheckBoxTableid = function () {
        var connection_id = $(".data-source-configuration-list .click-add-background").attr("connection_id");
        var checkedDom = $("#connect-data-result .checked");

        var tableArray = [];
        $.each(checkedDom, function (index, value) {
            //如果是表头全选checkbox则跳过
            if ($(value).find("group-checkable").length > 0) {
                return false;
            }
            var tableid = $(value).closest("td").data("tableid");
            tableArray.push(tableid);
        });
        var params = {
            connection_id: connection_id,
            tables_id: tableArray.join(",")
        };
        return params;
    };

    //进行数据删除
    showContent.deleteTableList = function (isRightActionDelete, tableid) {
        var params = {};
        if (isRightActionDelete) {
            var connection_id = $(".data-source-configuration-list .click-add-background").attr("connection_id");
            params.connection_id = connection_id;
            params.tables_id = tableid;
        } else {
            params = showContent.getCheckBoxTableid();
            if (!params) {
                App.unblockUI();
                return false;
            }
        }
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_metadata_tables_del", "v4.0", params, function (data) {
            App.unblockUI();
            if (data.bcjson.flag === "1") {
                toastr.success(data.bcjson.msg);

                //查询删除后的新的列表
                var paramsSend = {};
                paramsSend.pageNumber = "1";
                showContent.qry_connect_data(paramsSend);
                showContent.getUser({ "connection_id": showContent.connect_id });
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    //进行同步表结构
    showContent.metadataTablesUpd = function () {
        var params = showContent.getCheckBoxTableid();
        if (!params) {
            App.unblockUI();
            return false;
        }
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_metadata_tables_upd", "v4.0", params, function (data) {
            App.unblockUI();
            if (data.bcjson.flag === "1") {
                toastr.success("Update successfully");

                //查询同步后的新的列表
                var paramsSend = {};
                paramsSend.pageNumber = "1";
                showContent.qry_connect_data(paramsSend);
                showContent.getUser({ "connection_id": showContent.connect_id });
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    //进行更新表记录行数
    showContent.tableRecordcountUpd = function () {
        var params = showContent.getCheckBoxTableid();
        if (!params) {
            App.unblockUI();
            return false;
        }
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_table_recordcount_upd", "v4.0", params, function (data) {
            App.unblockUI();
            if (data.bcjson.flag === "1") {
                toastr.success("Succeed");

                //查询删除后的新的列表
                var paramsSend = {};
                paramsSend.pageNumber = "1";
                showContent.qry_connect_data(paramsSend);
                showContent.getUser({ "connection_id": showContent.connect_id });
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    //进行批量同步表结构
    showContent.metadataTablesUpdBatch = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_metadata_tables_upd", "v4.0", params, function (data) {
            App.unblockUI();
            if (data.bcjson.flag === "1") {
                toastr.success("Batch update successfully");
                showContent.qry_connect_data();
                showContent.getUser({ "connection_id": showContent.connect_id });
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    //进行批量同步表结构
    showContent.tableRecordcountUpdBatch = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_table_recordcount_upd", "v4.0", params, function (data) {
            App.unblockUI();
            if (data.bcjson.flag === "1") {
                toastr.success("Batch update successfully");
                showContent.qry_connect_data();
                showContent.getUser({ "connection_id": showContent.connect_id });
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };
    //获取第二个tab页的列信息
    showContent.getTabColumnInfo = function (tableId) {
        var paramsMap = {};
        paramsMap.table_id = tableId;
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_metadata_column_info", "v4.0", paramsMap, function (data) {
            var items = data.bcjson.items || data.bcjson;
            if (data.bcjson.flag == "1" && items) {
                require.async("./template/tab-column-info-list.handlebars", function (compiled) {
                    $("#des-showtable-info-2-table-body").html(compiled(items));
                });
            }
        });
    };

    //预览操作
    showContent.previewAction = function (schema, table_name) {
        var paramsMap = {};
        paramsMap.connection_id = $(".data-source-configuration-list .click-add-background").attr("connection_id");
        paramsMap.schema = schema;
        paramsMap.table_name = table_name;

        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_metadata_table_perform", "v4.0", paramsMap, function (data) {
            var tableHeader = "<th></th>";
            var tableBody = "";
            var items = data.bcjson.items || data.bcjson;
            if (data.bcjson.flag == "1" && items[0]) {
                for (var singleHeaderName in items[0]) {
                    tableHeader = tableHeader + "<th> " + singleHeaderName + "</th>";
                }

                //获取列表头部html
                $("#des-showtable-info-3-thead-tr").html(items[0] ? tableHeader : "");

                var index = 1;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var singleData = _step.value;

                        var columnData = "";
                        columnData = columnData + "<td class='t-c'> " + index + "</td>";
                        index++;

                        for (var insideObj in singleData) {
                            columnData = columnData + "<td> " + singleData[insideObj] + "</td>";
                        }
                        tableBody = tableBody + "<tr>" + columnData + "</tr>";
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

                $("#des-showtable-info-3-table-body").html(tableBody);
                $("#des-showtable-info-3-table").removeAttr("style");
            } else {
                $("#des-showtable-info-3-table").css("display", "none");
                $("#des-showtable-info-3-table").closest("div").append("<div style='text-align: center;font-size: 14px;margin-top: 20px;'>No Data</div>");
            }
        });
    };

    //表单校验
    showContent.initForm = function () {
        $("#data-connect-add-form").validate({
            debug: true,
            errorElement: "span", //default input error message container
            errorClass: "help-block", // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                connection_type: {
                    required: true
                },
                connection_name: {
                    required: true,
                    maxlength: 64
                },
                server: {
                    required: true
                },
                db_port: {
                    required: true
                },
                db_user: {
                    required: true
                },
                db_database: {
                    required: true
                },
                db_password: {
                    required: true
                },
                jdbc_string: {
                    required: true
                },
                max_connect_count: {
                    numCheck: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {
                //display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest(".form-group").addClass("has-error"); // set error class to the control group
            },
            success: function success(label) {
                label.closest(".form-group").removeClass("has-error");
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });
        $("#data-connect-edit-form").validate({
            debug: true,
            errorElement: "span", //default input error message container
            errorClass: "help-block", // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                connection_type_edit: {
                    required: true
                },
                connection_name_edit: {
                    required: true
                },
                server: {
                    required: true
                },
                db_port: {
                    required: true
                },
                db_user: {
                    required: true
                },
                db_database: {
                    required: true
                },
                db_password: {
                    required: true
                },
                jdbc_string: {
                    required: true
                },
                max_connect_count: {
                    numCheck: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {
                //display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest(".form-group").addClass("has-error"); // set error class to the control group
            },
            success: function success(label) {
                label.closest(".form-group").removeClass("has-error");
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });
    };

    //判断是否需要更新checkbox
    showContent.shouldUpdateCheck = function () {
        var trueAmount = 0;
        $.each(showContent.filterMainTree, function (index, value) {
            if (value) {
                trueAmount++;
            }
        });
        showContent.filterMainTreeAmount++;
        return showContent.filterMainTreeAmount <= trueAmount;

        // if (showContent.filterMainTreeAmount > trueAmount) {
        //     return false;
        // } else {
        //     return true;
        // }
    };

    //上传图片
    showContent.upLoad = function (fileName, fileType) {

        //addtrue 用于判断是否从增添驱动弹出框中上传
        var options = {
            url: window.location.origin + "/superlop/restv2/admin/v2.0/bayconnect.superlop.file_upload.json",
            type: "POST",
            dataType: "json",
            success: function success(data) {
                App.unblockUI();
                if (typeof data == "string") {
                    data = eval("(" + data + ")");
                }
                $("#J_mock_form_collection_form input[name='fileName']").val(fileName);
                $("#J_mock_form_collection_form input[name='fileUrl']").val(data.bcjson.msg);
                var html = '<li><div><i style="padding-right: 10px" class="glyphicon glyphicon-file"></i><span type=' + fileType + ' fileurl=' + data.bcjson.msg + '>' + fileName + '</span><i style="float: right" class="glyphicon glyphicon-trash"></i></div></li>';
                $("#data-source-configuration .excel-choose-block-inside ul").append(html);
                $("#data-source-configuration .excel-bottom span span").html($("#data-source-configuration .excel-choose-block-inside ul li").length);

                //临时代码，后期要改
                if ($("#data-source-configuration .excel-choose-block-inside ul li").length === 1) {
                    showContent.getExcelContentList();
                }
            },
            error: function error(e) {
                toastr.info("Fail");
                App.unblockUI();
            }
        };
        $("#J_mock_form_collection_form").ajaxSubmit(options);
    };

    //获取excel内容
    showContent.getExcelContentList = function () {
        //若无文件，则不获取当前excel的内容
        if ($("#data-source-configuration .excel-choose-block-inside ul li span").length === 0) {
            return false;
        }
        var fileUrl = $("#data-source-configuration .excel-choose-block-inside ul li span:eq(0)").attr("fileurl");
        var fileType = $("#data-source-configuration .excel-choose-block-inside ul li span:eq(0)").attr("type");
        var paramsMap = { fileUrl: fileUrl, fileType: fileType };
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_file_content_info", "v4.0", paramsMap, function (data) {
            if (data.bcjson.flag === "1") {

                showContent.tableHead = [];

                //生成表头
                var headData = data.bcjson.items[0];
                var theadFirst = '<th class="t-c">序号</th>';
                var theadOption = '<th style="width:80px;">指定表头</th><th class="t-c">序号</th>';
                var num = 0;
                for (var headItems in headData) {
                    theadFirst = theadFirst + "<th>" + headData[headItems] + "</th>";
                    theadOption = theadOption + "<th>F" + num + "</th>";
                    num++;
                    showContent.tableHead.push(headData[headItems]);
                }
                theadFirst = "<tr>" + theadFirst + "</tr>";
                theadOption = "<tr>" + theadOption + "</tr>";

                var newItems = [].concat(data.bcjson.items);
                data.bcjson.items.shift();

                //把第一行作为表头 -> 表内容
                var headBody = data.bcjson.items;
                var tableBodyFirst = "";
                var columnIndex = 0;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = headBody[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var singleData = _step2.value;

                        var index = 0;
                        columnIndex++;
                        // '<td class="hide t-c" class="t-c"><input type="checkbox"></td>';
                        var columnData = '<td class="t-c">' + columnIndex + '</td>';
                        for (var insideObj in singleData) {
                            columnData = columnData + "<td> " + singleData[insideObj] + "</td>";
                            index++;
                        }
                        if (index === num) {
                            tableBodyFirst = tableBodyFirst + "<tr>" + columnData + "</tr>";
                        }
                    }

                    //指定表头 -> 表内容
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

                var tableBodyOption = '';
                var columnIndex1 = 0;
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = newItems[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var singleData1 = _step3.value;

                        var index1 = 0;
                        columnIndex1++;
                        var columnData1 = '<td class="t-c" class="t-c"><input type="checkbox"></td><td class="t-c">' + columnIndex1 + '</td>';
                        for (var insideObj1 in singleData1) {
                            columnData1 = columnData1 + "<td> " + singleData1[insideObj1] + "</td>";
                            index1++;
                        }
                        if (index1 === num) {
                            tableBodyOption = tableBodyOption + "<tr>" + columnData1 + "</tr>";
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

                $("#J_dsc_produce_head").html(theadFirst);
                $("#J_dsc_produce_body").html(tableBodyFirst);
                $("#J_dsc_produce_head_option").html(theadOption);
                $("#J_dsc_produce_body_option").html(tableBodyOption);
                $("#J_dsc_produce_head").closest(".table-scrollable").removeClass("hide");
                App.initCheckableTable($("#J_dsc_produce_table"));
            } else {
                toastr.info("生成表失败");
            }
        });
    };

    //excel类型的数据回显
    showContent.getExcelFileTypeData = function (paramsMap) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_file_data_source_info", "v4.0", paramsMap, function (data) {
            var items = data.bcjson.items || data.bcjson;
            if (data.bcjson.flag == "1" && items[0]) {

                //tab1页面回显

                //连接名称
                $("#J_excel_add_tab1 input[name=connectionName]").val(items[0].connectionName);

                //文件excel显示
                var html = '<li><div><i style="padding-right: 10px" class="glyphicon glyphicon-file"></i><span type=' + items[0].fileType + ' fileurl=' + items[0].fileUrl + '>' + items[0].fileName + '</span><i style="float: right" class="glyphicon glyphicon-trash"></i></div></li>';
                $("#data-source-configuration .excel-choose-block-inside ul").append(html);
                $("#data-source-configuration .excel-bottom span span").html($("#data-source-configuration .excel-choose-block-inside ul li").length);
                showContent.getExcelContentList();

                //tab2页面回显
                App.setFormData("J_excel_add_tab2_form", items[0]);
                showContent.getDataSourceList(function () {
                    showContent.targetTable = items[0].targetTable;
                    $("#J_select2_dcs_target_data_connect").val(items[0].targetConnectionId).change();
                });

                //tab3字段映射
                var dataFildItems = JSON.parse(items[0].mappingInfo).mappingColumn;
                showContent.dataFildItems = dataFildItems;
                if (dataFildItems.length > 0) {
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = dataFildItems[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var item = _step4.value;

                            item.rowsCount = dataFildItems.length;
                            item.columnName = item.targetColumn;
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

                    require.async("./template/data-field-list-2.handlebars", function (compiled) {
                        $("#J_dsc_field_map_body").html(compiled(dataFildItems));
                        showContent.haddleDataField_2.edit(dataFildItems);
                        App.initCheckableTable($("#J_dsc_field_map_table"));
                    });
                }
            } else {
                toastr.info("数据异常，暂时无法修改");
            }
        });
    };

    //excel查询列表信息
    showContent.getExcelFileDetail = function (paramsMap) {
        $.kingdom.getList({
            apiName: "bayconnect.superlop.get_file_data_source_info",
            apiVision: "v4.0",
            params: paramsMap,
            tableId: "J_file_data_result",
            pageId: "J_file_data_result_page",
            formName: "data-source-configuration-form",
            template: "data-source-configuration/template/data-source-configuration-datasourcedetail-file.handlebars"
        });
    };

    /**
     * params：此数据连接id、文件类型、文件路径、文件名
     * des：获取当前数据连接中，其中一个文件的表详情
     */
    showContent.getExcelSingleFileDetail = function (paramsMap) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_target_table_data_info", "v4.0", paramsMap, function (data) {
            var items = data.bcjson.items || data.bcjson;
            if (data.bcjson.flag == "1" && items) {

                //获取返回数据中，单个数据的最大长度（即非null数据的个数）。
                var maxLength = 0;
                $.each(items, function (index, item) {
                    var currentIndex = 0;
                    for (var singItem in item) {
                        if (!!item[singItem]) {
                            currentIndex++;
                            if (maxLength < currentIndex) {
                                maxLength = currentIndex;
                            }
                        }
                    }
                });

                //处理表格头部头部
                var head = "<tr currentpreparams=" + JSON.stringify(paramsMap) + ">";
                $.each(items[0], function (index, item) {
                    //若此item为null则不显示
                    if (!!item) {
                        var headName = item.match(/head:\{(.*)\}/);
                        headName = headName ? headName[1] : item;
                        head += "<th>" + headName + "</th>";
                    }
                });
                //根据最大长度进行补长度操作
                var needFillAmount = maxLength - (head.split("<th>").length - 1);
                for (var i = 0; i < needFillAmount; i++) {
                    head += "<th></th>";
                }
                //增添操作字段
                head += "<th class='t-c'>操作</th>";
                head += "</tr>";
                //处理table的body
                var body = "";
                items.shift();
                $.each(items, function (index, item) {
                    var singleTr = "<tr currentdata=" + JSON.stringify(item) + ">";
                    var singleTd = "";
                    $.each(item, function (index, item) {
                        if (!!item) {
                            singleTd += "<td currentkey=" + index + ">" + item + "</td>";
                        }
                    });
                    //根据最大长度进行补长度操作
                    var needFillAmount = maxLength - (singleTd.split("</td>").length - 1);
                    if (needFillAmount !== maxLength) {
                        for (var i = 0; i < needFillAmount; i++) {
                            singleTd += "<td></td>";
                        }
                        //增添操作字段
                        singleTd += "<td class='t-c'><a href='javascript:;'>编辑</a></td>";
                    }

                    singleTr += singleTd + "</tr>";
                    body += singleTr;
                });
                $("#J_single_file_data_result_head").html(head);
                $("#J_single_file_data_result_body").html(body);
            } else {
                toastr.info("数据异常,无法查看");
            }
        });
    };

    /**
    * params：此数据连接id、文件类型、文件路径、文件名、修改的数据集合
    * des：修改当前数据连接中，其中一个文件的表内的数据
    */
    showContent.editExcelSingleFileDetail = function (paramsMap) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_target_table_data", "v4.0", paramsMap, function (data) {
            App.unblockUI();
            var items = data.bcjson.items || data.bcjson;
            if (data.bcjson.flag == "1" && items) {
                delete paramsMap.dataInfo;
                showContent.getExcelSingleFileDetail(paramsMap);
            } else {
                toastr.info("保存失败");
            }
        });
    };

    // 查询数据连接 （目标表和源表）通用
    showContent.getDataSourceList = function (cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_source_config", "v4.0", {}, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                var str = "";
                var arr = [{
                    id: "",
                    text: ""
                }];
                if (items && items.length > 0) {
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var item = _step5.value;

                            str += "<option value=\"" + item.connectionId + "\"\">" + item.connectionName + "</option>";
                            arr.push({
                                id: item.connectionId,
                                text: item.connectionName
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
                // 导入文本 目标数据源
                $("#J_select2_dcs_target_data_connect").select2({
                    data: arr,
                    placeholder: '- Please select a type -'
                });

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
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = items[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var item = _step6.value;

                            arr.push({
                                id: item.tableId,
                                text: item.schemName + "." + item.tableName + "(" + item.mdType + ")"
                            });
                            arr2.push({
                                id: item.tableId,
                                text: item.schemName + "." + item.tableName
                            });
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

    // 导入文本->字段映射->获取字段
    showContent.getDataField_2 = function (params, cb) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_metadata_column_info", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                if (items.length === 0) {
                    toastr.info("没有查询到映射字段");
                    return;
                }
                var index = 0;
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = items[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var item = _step7.value;

                        item.rowsCount = items.length;
                        item.tableHeader = showContent.tableHead[index];
                        index++;
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

                require.async("./template/data-field-list-2.handlebars", function (compiled) {
                    $("#J_dsc_field_map_body").html(compiled(items));
                    showContent.haddleDataField_2.init(items);
                    App.initCheckableTable($("#J_dsc_field_map_table"));
                    typeof cb === "function" && cb();
                });
            }
        });
    };

    // 导入文本->字段映射-> 插入的字段 操作处理
    showContent.haddleDataField_2 = {
        // 初始化
        init: function init(items) {
            var html_t = "<select class=\"form-control input-sm\">";
            html_t += "<option value=\"\">--Please select a type--</option>";
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = items[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var item = _step8.value;

                    html_t += "<option value=\"" + item.columnName + "\">" + item.columnName + "</option>";
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

            html_t += "</select>";

            $.each($("#J_dsc_field_map_body [data-type=target]"), function () {
                var text = $.trim($(this).html());
                if (text) {
                    $(this).html(html_t).attr("inited", "inited").children().val(text);
                }
            });
        },
        // 编辑赋值
        edit: function edit(items) {
            var html_t = "<select class=\"form-control input-sm\">";
            html_t += "<option value=\"\">--Please select a type--</option>";
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = items[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var item = _step9.value;

                    html_t += "<option value=\"" + item.columnName + "\">" + item.columnName + "</option>";
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

            html_t += "</select>";

            $.each($("#J_dsc_field_map_body [data-type=target]:not([inited])"), function () {
                var text = $.trim($(this).html());
                if (text) {
                    $(this).html(html_t).attr("inited", "inited").children().val(text);
                }
            });
        },
        // 重置字段值
        refresh: function refresh() {
            $.each($("#J_dsc_field_map_body tr td[data-type]"), function () {
                var origin = $(this).data("origin");
                $(this).children().val(origin);
            });
        },
        // 获取行数
        getRow: function getRow() {
            return $("#J_dsc_field_map_body tr").length;
        },
        // 删除选中行
        delCheckedRow: function delCheckedRow() {
            $.each($("#J_dsc_field_map_body input[type=checkbox]:checked"), function (i) {
                $(this).closest("tr").remove();
            });
            showContent.haddleDataField_2.reorder();
        },
        // 重新排序
        reorder: function reorder() {
            $.each($("#J_dsc_field_map_body tr"), function (i) {
                $(this).find("td:first").text(i + 1);
                $(this).find("td[data-type=import]").html(" \u7B2C " + (i + 1) + " \u5217 ");
            });
        },
        // 获取数据集
        getData: function getData() {
            var arr = new Array();
            $.each($("#J_dsc_field_map_body tr"), function (i) {
                var targetColumn = $(this).find("[data-type=target] select").val(),

                // len = $("#J_dsc_field_map_body tr").length,
                no = "";
                no = (i + 1).toString();
                var obj = {
                    no: no,
                    sourceColumn: no,
                    targetColumn: targetColumn
                    // 字段有映射才传入
                };if (targetColumn) {
                    arr.push(obj);
                }
            });
            return JSON.stringify({ "mappingColumn": arr });
        }
    };

    //隐藏或显示block -> 新增非excel、文件类;数据库类;连接详情类;修改类;
    showContent.hideShowBlock = function (selector) {

        $("#data-source-configuration #J_dsc_back_to_list").addClass("hide");

        $("#data-source-configuration #J_dsc_list_detail," + "#data-source-configuration #J_dsc_commonType_add," + "#data-source-configuration #J_dsc_fileType_add," + "#data-source-configuration #J_dsc_file_list_detail," + "#data-source-configuration #J_dsc_file_list_single_detail," + "#data-source-configuration #J_dsc_commonType_edit").addClass("hide");
        $("#data-source-configuration " + selector).removeClass("hide");
    };

    //清除excel表单数据
    showContent.clearFileBlock = function () {
        //tab1
        $("#J_excel_add_tab1 input[name='connectionName']").val("");
        $("#J_dsc_clear_file").click();

        //tab2
        App.clearForm("J_excel_add_tab2_form");
        $(".select2-hidden-accessible").empty().clearInputs();

        //tab3
        $("#J_dsc_field_map_body").html("");

        //返回第一步
        $("#data-source-configuration #J_dsc_pre_step").click();
        $("#data-source-configuration #J_dsc_pre_step").click();
    };

    //追加代码
    // showContent.appendNode = function(){
    //     var ref = $('#J_tree_import').jstree(true);
    //     ref.create_node("#parent0",{"children": [],"icon": "glyphicon glyphicon-list-alt","id": "child-APPQOSSYS-10","text": "WLM_CLASSIFIER_PLAN<span style='font-size:12px;font-weight:100;'>（表）</span>"},"last", false, false)
    // }

    module.exports = showContent;
});