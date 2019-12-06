define(function (require, exports, module) {
    var showContent = require("./data-source-configurationShow");
    var init = {
        load: function () {
            showContent.load(); //加载页面数据
            showContent.connect_id = "";
            showContent.db_password = "";
            var oBar = document.getElementById("J_drag_bar7");
            var oTarget = document.getElementById("J_drag_bar7");
            startDrag(oBar, oTarget, ".left-side-source", ".right-content-source", function () {
                LFWIDTH = $('.left-side').width();
               
            });
        }
    };
    $(function () {

        //数据连接 -> 左边数据列表查询（enter 及 按钮）
        $("body").on("keydown", "#data-source-configuration #J_dsc_list_search", function (event) {
            if (event.keyCode == 13) {
                $("#data-source-configuration #dsc-search").click();
            }
        });

        $("body").on("click", "#data-source-configuration #dsc-search", function () {
            var value = $(this).siblings("input").val();
            showContent.get_source_connect_List(value);
        });
        $("body").on("click", "#data-source-configuration #data-source-configuration-reset", function () {
           $("#data-source-configuration-form #schemName").val("");
           $("#data-source-configuration-form #tableName").val("");
           $("#data-source-configuration-query").click();
        });
        //  点击查询获取表格信息
        $("body").on("click", "#data-source-configuration-query", function () {
          let params = App.getFormParams("data-source-configuration-form");
          params.connectionId = showContent.connect_id;
           if (showContent.connection_type.indexOf("文件") > -1) {
            showContent.hideShowBlock("#J_dsc_file_list_detail");
            showContent.getExcelFileDetail(params);
        } else {
            showContent.hideShowBlock("#J_dsc_list_detail");
            showContent.qry_connect_data(params);
        }
        });
        // 点击源数据获取右边详情信息
        $("body").on("click", "#data-source-configuration .data-source-configuration-list li", function () {
            var params = {};
            params.pageNumber = "1";
            $(this).addClass("click-add-background");
            $(this)
                .siblings()
                .removeClass("click-add-background");

            //处理头部 
            var data = $(this).find("span a").data("params")
           showContent.connect_id = data.connect_id;
           showContent.connection_type = data.connection_type;
            $("#J_dsc_list_detail_title_type span").html(data.connection_name + "<span> / " + data.connection_type + "</span>");
            showContent.getUser({connection_id:data.connect_id});
            //判断修改数据连接的类型为数据库类或文件类
            if (data.connection_type.indexOf("文件") > -1) {
                showContent.hideShowBlock("#J_dsc_file_list_detail");
                showContent.getExcelFileDetail({ connectionId: data.connect_id });
            } else {
                showContent.hideShowBlock("#J_dsc_list_detail");
                showContent.qry_connect_data(params);
            }

        });

        //点击新增弹出框的任意一种类型
        $("body").on("click", "#data-source-configuration .winbd li", function () {
            //若为Excel或CVS则是其的专属页面，否则为正常新增页面
            if ($(this).find("a .txt").text() === "Excel" || $(this).find("a .txt").text() === "CSV") {
                showContent.getConnectType($(this).find("a .txt").text());
                showContent.clearFileBlock();
                showContent.hideShowBlock("#J_dsc_fileType_add");
                showContent.fileEdit = false;
            } else {
                showContent.getConnectType($(this).find("a .txt").text());
                showContent.hideShowBlock("#J_dsc_commonType_add");
            }
            $("#J_dsc_list_detail_title_type span").html("Create Data Source<span> / " + $(this).find("a .txt").text() + "</span>");

            //关闭当前modal
            $("#data-connect-add-type button").click();

            //获取数据源
            showContent.getDataSourceList();
            $("#data-source-configuration [name=submitNum]").val("4096");
        });
        //输入principal输入框写入url中
        $("body").on("blur", "#data-connect-add-form input[name='principal']", function () {
            // 获取值时会重复添加principal=
            let arr  = $("#J_dsc_commonType_add input[name=jdbc_string]").val().split(";principal=");
            let val ="";
            if(arr.length==2){
                val = arr[0];
            }else{
               val = $("#J_dsc_commonType_add input[name=jdbc_string]").val();
            }
            // 当输入框为空时清除principal=
            if($(this).val()!=""){
            $("#J_dsc_commonType_add input[name=jdbc_string]").val(`${val};principal=${$(this).val()}`);
            }else{
                $("#J_dsc_commonType_add input[name=jdbc_string]").val(val);
            }

        })
        //新增弹框测试源数据
        $("body").on("click", "#data-source-configuration #test-data-connect", function () {
            if (!$("#data-connect-add-form")
                .validate()
                .form()
            ) {
                return false;
            }
            var params = {};
            params.connection_name = $("#connection_name").val();
            params.connection_desc = $(
                "#data-connect-add-form input[name='connection_desc']"
            ).val();
            params.connection_type = $("#connection_type").val();
            params.server = $("#data-connect-add-form input[name='server']").val();
            params.db_port = $("#data-connect-add-form input[name='db_port']").val();
            params.db_database = $(
                "#data-connect-add-form input[name='db_database']"
            ).val();
            params.db_user = $("#data-connect-add-form input[name='db_user']").val();
            var db_password = $(
                "#data-connect-add-form input[name='db_password']"
            ).val();

            params.db_password = $.des.getDes(db_password);

            params.jdbc_string = $(
                "#data-connect-add-form input[name='jdbc_string']"
            ).val();
            params.max_connect_count = $(
                "#data-connect-add-form input[name='max_connect_count']"
            ).val();
            params.driverInfo = $("#connection_type option:selected").attr(
                "className"
            );
            App.blockUI({
                boxed: true,
                message: "Testing..."
            });
            showContent.testDataConnectList(params);
        });

        //新增源数据
        $("body").on("click", "#data-source-configuration #data-connect-add-submit", function () {
            if (!$("#data-connect-add-form")
                .validate()
                .form()
            ) {
                return false;
            }
            var params = {};
            params.connection_name = $("#connection_name").val();
            params.connection_desc = $(
                "#data-connect-add-form input[name='connection_desc']"
            ).val();
            params.connection_type = $("#connection_type").val();
            params.server = $("#data-connect-add-form input[name='server']").val();
            params.db_port = $("#data-connect-add-form input[name='db_port']").val();
            params.db_database = $(
                "#data-connect-add-form input[name='db_database']"
            ).val();
            params.db_user = $("#data-connect-add-form input[name='db_user']").val();

            params.db_password = $.des.getDes(
                $("#data-connect-add-form input[name='db_password']").val()
            );
            params.jdbc_string = $(
                "#data-connect-add-form input[name='jdbc_string']"
            ).val();
            params.max_connect_count = $(
                "#data-connect-add-form input[name='max_connect_count']"
            ).val();
            params.driverInfo = $("#connection_type option:selected").attr(
                "className"
            );
            App.blockUI({
                boxed: true,
                message: "Creating..."
            });
            showContent.addDataConnectList(params);
        });
        // 修改赋值
        $("body").on("click", "#data-source-configuration .data-source-configuration-list li a", function (e) {

            //阻止冒泡
            e.stopPropagation();

            //处理变色问题
            $("#data-source-configuration .data-source-configuration-list li").removeClass("click-add-background");
            $(this).closest("li").addClass("click-add-background");

            //获取此连接的数据
            var data = $(this).data("params");

            //处理头部
            $("#J_dsc_list_detail_title_type span").html(data.connection_name + "<span> / " + data.connection_type + "</span>");

            //判断修改数据连接的类型为数据库类或文件类
            if (data.connection_type.indexOf("文件") > -1) {
                showContent.clearFileBlock();
                showContent.hideShowBlock("#J_dsc_fileType_add");
                showContent.getExcelFileTypeData({
                    connectionId: data.connect_id
                })
                showContent.fileEdit = true;
                return false;
            }

            showContent.hideShowBlock("#J_dsc_commonType_edit");


            showContent.getConnectType_edit(data.connection_type);
            console.log(showContent.list);
            //  data = JSON.parse(data);
            showContent.connect_id = data.connect_id;
            showContent.db_password = data.db_password;
            $("#connection_type_edit").val(data.connection_type);
            $("#connection_name_edit").val(data.connection_name);
            $("#data-connect-edit-form input[name='connection_desc']").val(
                data.connection_desc
            );
            $("#data-connect-edit-form input[name='server']").val(data.server);
            $("#data-connect-edit-form input[name='db_port']").val(data.db_port);
            $("#data-connect-edit-form input[name='db_database']").val(
                data.db_database
            );
            $("#data-connect-edit-form input[name='db_user']").val(data.db_user);
            $("#data-connect-edit-form input[name='db_password']").val(
                data.db_password
            );
            $("#data-connect-edit-form input[name='jdbc_string']").val(
                data.jdbc_string
            );
            $("#data-connect-edit-form input[name='max_connect_count']").val(
                data.max_connect_count
            );
        });
        // 修改数据源
        $("body").on("click", "#data-source-configuration #data-connect-edit-submit", function () {
            if (!$("#data-connect-edit-form")
                .validate()
                .form()
            ) {
                return false;
            }

            var params = {};
            params.connection_id = showContent.connect_id;
            params.connection_name = $("#connection_name_edit").val();
            params.connection_desc = $(
                "#data-connect-edit-form input[name='connection_desc']"
            ).val();
            params.connection_type = $("#connection_type_edit").val();
            params.server = $("#data-connect-edit-form input[name='server']").val();
            params.db_port = $("#data-connect-edit-form input[name='db_port']").val();
            params.db_database = $(
                "#data-connect-edit-form input[name='db_database']"
            ).val();
            params.db_user = $("#data-connect-edit-form input[name='db_user']").val();
            params.jdbc_string = $(
                "#data-connect-edit-form input[name='jdbc_string']"
            ).val();
            params.max_connect_count = $(
                "#data-connect-edit-form input[name='max_connect_count']"
            ).val();
            params.driverInfo = $("#connection_type_edit option:selected").attr(
                "className"
            );
            if (
                showContent.db_password &&
                showContent.db_password ==
                $("#data-connect-edit-form input[name='db_password']").val()
            ) {
                params.db_password = showContent.db_password;
            } else {
                params.db_password = $.des.getDes(
                    $("#data-connect-edit-form input[name='db_password']").val()
                );
            }
            App.blockUI({
                boxed: true,
                message: "modifying..."
            });
            showContent.editDataConnectList(params);
        });
        // 删除数据源
        $("body").on(
            "click",
            "#data-source-configuration .data-source-configuration-list li .delBtn",
            function () {
                var params = {};
                params.connection_id = $(this).attr("connection_id");
                params.opType = "del";
                params.driver_id = $(this).attr("driver_id");
                bootbox.confirm("Please confirm to delete", function (result) {
                    if (result) {
                        App.blockUI({
                            boxed: true,
                            message: "Deleting..."
                        });
                        showContent.deleteDataConnect(params);
                    }
                });
            }
        );
        // 修改弹框测试数据源
        $("body").on("click", "#data-source-configuration #J_edit_test_submit", function () {
            if (!$("#data-connect-edit-form")
                .validate()
                .form()
            ) {
                return false;
            }
            var params = {};
            params.connection_name = $("#connection_name_edit").val();
            params.connection_desc = $(
                "#data-connect-edit-form input[name='connection_desc']"
            ).val();
            params.connection_type = $("#connection_type_edit").val();
            params.server = $("#data-connect-edit-form input[name='server']").val();
            params.db_port = $("#data-connect-edit-form input[name='db_port']").val();
            params.db_database = $(
                "#data-connect-edit-form input[name='db_database']"
            ).val();
            params.db_user = $("#data-connect-edit-form input[name='db_user']").val();
            params.jdbc_string = $(
                "#data-connect-edit-form input[name='jdbc_string']"
            ).val();
            params.max_connect_count = $(
                "#data-connect-edit-form input[name='max_connect_count']"
            ).val();
            params.driverInfo = $("#connection_type_edit option:selected").attr(
                "className"
            );
            if (
                showContent.db_password &&
                showContent.db_password ==
                $("#data-connect-edit-form input[name='db_password']").val()
            ) {
                params.db_password = showContent.db_password;
            } else {
                params.db_password = $.des.getDes(
                    $("#data-connect-edit-form input[name='db_password']").val()
                );
            }
            App.blockUI({
                boxed: true,
                message: "Testing..."
            });
            showContent.testDataConnectList(params);
        });
        //点击导入弹出导入框
        $("body").on("click", "#data-source-configuration #data_connect_import_btn", function () {
            $("#dsc-seach-metadata-input").val("");
            $("#data_connect_import_modal").modal("show");

            //调用查询接口数据接口
            var connection_id = $(
                ".data-source-configuration-list .click-add-background"
            ).attr("connection_id");

            //交互
            App.blockUI({
                boxed: true,
                message: "Search..."
            });
            showContent.getImportDataSource(connection_id);
        });
        //修改数据库/模式值
        $("body").on(
            "change",
            "#data-source-configuration #data-connect-edit-form input[name='db_database']",
            function () {
                $("#data-connect-edit-form input[name='jdbc_string']").val();
            }
        );
        // 新增弹框驱动名称change时
        $("body").on("change", "#data-source-configuration #connection_type", function () {
            // var urlInfo = $(this)
            //     .find("option:selected")
            //     .attr("urlinfo");
            let driverid = $(this).find("option:selected").attr("driverid");
            var jdbc_string
                $.each(showContent.getConnectTypeData,function(i,item){
                    if(item.driverId===driverid){
                        $("#data-connect-add-form input[name='db_port']").val(item.dbPort);
                         jdbc_string= item.urlInfo;    
                    }
                });
                if($(this).find("option:selected").html()=="CDH"){
                    $("#data-connect-add-form input[name='principal']").closest(".form-group").removeClass("hide");
                }else{
                    $("#data-connect-add-form input[name='principal']").closest(".form-group").addClass("hide");
                }          
                var port = $("#data-connect-add-form input[name='db_port']").val();
                // jdbc_string_用于给相应框赋值,jdbc_string用于比较是否给jdbc_string框添加disable属性
                var jdbc_string_ = jdbc_string;
            if ((jdbc_string_.indexOf("{host}:{port}") > -1)) {
                $("#data-connect-add-form input[name=jdbc_string]").val(jdbc_string_);
                jdbc_string_ = jdbc_string_.replace("{port}", port);
            }                    
            $("#data-connect-add-form input[name=jdbc_string]").val(jdbc_string_);
            $("#J_dsc_list_detail_title_type span").html("Create Data Source<span> / " + $(this).find("option:selected").html() + "</span>");

            //每次更换type，需要对url模板输入框进行修改
            $("#J_dsc_commonType_add input[name=jdbc_string]").attr("disabled", "disabled");
            $("#isUrlinfoDisable-add").closest("span").removeClass("checked");
            // var jdbc_string = $("#data-connect-add-form input[name='jdbc_string']").val();
            if (!(jdbc_string.indexOf("{host}:{port}") > -1)) {
                $("#J_dsc_commonType_add input[name=jdbc_string]").removeAttr("disabled");
                $("#isUrlinfoDisable-add").closest("span").addClass("checked");
            }
            showContent.currentUrlInfo = jdbc_string;
        });
        $("body").on("change", "#data-source-configuration #connection_type_edit", function () {
            var urlInfo = $(this)
                .find("option:selected")
                .attr("urlinfo");
            let driverid = $(this).find("option:selected").attr("driverid");
            $("#data-connect-edit-form input[name='jdbc_string']").val(urlInfo);
            $.each(showContent.getConnectTypeData,function(i,item){
                if(item.driverId===driverid){
                    $("#data-connect-edit-form input[name='db_port']").val(item.dbPort);
                }
            });    
            $("#data-connect-edit-form input[name='jdbc_string']").attr("disabled", "disabled");
            $("#isUrlinfoDisable-edit").closest("span").removeClass("checked");
            var jdbc_string = $("#data-connect-edit-form input[name='jdbc_string']").val();
            if (!(jdbc_string.indexOf("{host}:{port}") > -1)) {
                $("#data-connect-edit-form input[name=jdbc_string]").removeAttr("disabled");
                $("#isUrlinfoDisable-edit").closest("span").addClass("checked");
            } else {
                var host = $("#data-connect-edit-form input[name='server']").val();
                var port = $("#data-connect-edit-form input[name='db_port']").val();
                var database = $("#data-connect-edit-form input[name='db_database']").val();
                if (host) {
                    jdbc_string = jdbc_string.replace("{host}", host);
                }
                if (port) {
                    jdbc_string = jdbc_string.replace("{port}", port);
                }
                if (database) {
                    jdbc_string = jdbc_string.replace("{database}", database);
                }
                $("#data-connect-edit-form input[name='jdbc_string']").val(jdbc_string);
            }
        });

        
        $("body").on("change", "#data-source-configuration #isUrlinfoDisable-add", function () {
            if ($("#isUrlinfoDisable-add").closest("span").attr("class") === "checked") {
                $("#J_dsc_commonType_add input[name=jdbc_string]").removeAttr("disabled");
            } else {
                $("#J_dsc_commonType_add input[name=jdbc_string]").attr("disabled", "disabled");
            }
        });

        $("body").on("change", "#data-source-configuration #isUrlinfoDisable-edit", function () {
            if ($("#isUrlinfoDisable-edit").closest("span").attr("class") === "checked") {
                $("#data-connect-edit-form input[name=jdbc_string]").removeAttr("disabled");
            } else {
                $("#data-connect-edit-form input[name=jdbc_string]").attr("disabled", "disabled");
            }
        });
        //新增窗口：主机、端口号失去焦点
        $("body").on("blur", "#data-source-configuration #data-connect-add-form input[name='server'],#data-connect-add-form input[name='db_port'],#data-connect-add-form input[name='db_database']", function () {
            var jdbc_string = showContent.currentUrlInfo;
            if (!(jdbc_string.indexOf("{host}:{port}") > -1)) {
                return false;
            }
            var host = $("#data-connect-add-form input[name='server']").val();
            var port = $("#data-connect-add-form input[name='db_port']").val();
            var database = $("#data-connect-add-form input[name='db_database']").val();
            if (host) {
                jdbc_string = jdbc_string.replace("{host}", host);
            }
            if (port) {
                jdbc_string = jdbc_string.replace("{port}", port);
            }
            if (database) {
                jdbc_string = jdbc_string.replace("{database}", database);
            }
            let val=$("#J_dsc_commonType_add input[name=principal]").val();
            // 当输入框为空时清除principal=
            if(val!=""){
            $("#J_dsc_commonType_add input[name=jdbc_string]").val(`${jdbc_string};principal=${val}`);
            }else{
                $("#J_dsc_commonType_add input[name=jdbc_string]").val(jdbc_string);
            }
           
          
        });

        //修改窗口：主机、端口号失去焦点
        $("body").on("blur", "#data-source-configuration #data-connect-edit-form input[name='server'],#data-source-configuration #data-connect-edit-form input[name='db_port'],#data-source-configuration #data-connect-edit-form input[name='db_database']", function () {
            var jdbc_string = $("#connection_type_edit").find("option:selected").attr("urlinfo");
            if (!(jdbc_string.indexOf("{host}:{port}") > -1)) {
                return false;
            }
            var host = $("#data-connect-edit-form input[name='server']").val();
            var port = $("#data-connect-edit-form input[name='db_port']").val();
            var database = $("#data-connect-edit-form input[name='db_database']").val();
            if (host) {
                jdbc_string = jdbc_string.replace("{host}", host);
            }
            if (port) {
                jdbc_string = jdbc_string.replace("{port}", port);
            }
            if (database) {
                jdbc_string = jdbc_string.replace("{database}", database);
            }
            $("#data-connect-edit-form input[name='jdbc_string']").val(jdbc_string);
        });


        //点击保存按钮
        $("body").on("click", "#data-source-configuration #import_submit", function () {
            //保存前先将子元素渲染
            var node = $.kingdom.uniqueArray($("#J_tree_import").jstree("get_checked"));
            $.each(node, function (index, value) {
                if (value.indexOf("child") === -1 && $("#" + value + " > ul").length === 0) {
                    $("#" + value + " > i").click();
                    $("#" + value + " > ul").addClass("jstree-hide")
                }
            });
            showContent.saveTableList();
        });

        //点击删除按钮
        $("body").on("click", "#data-source-configuration #dsc-delete-table", function () {
            if ($("#J_data_connect_table .checked").length === 0) {
                toastr.info("Please select the object");
                return false
            }
            bootbox.confirm("Please confirm to delete", function (result) {
                if (result) {
                    App.blockUI({
                        boxed: true,
                        message: "Deleting..."
                    });
                    showContent.deleteTableList();
                }
            });
        });

        //点击同步表结构按钮
        $("body").on("click", "#data-source-configuration #dsc-tables-upd", function () {
            if ($("#J_data_connect_table .checked").length === 0) {
                toastr.info("Please select the object");
                return false
            }
            bootbox.confirm("Please confirm to update field.", function (result) {
                if (result) {
                    App.blockUI({
                        boxed: true,
                        message: "updating..."
                    });
                    showContent.metadataTablesUpd();
                }
            });
        });

        //点击更新表记录行数按钮
        $("body").on("click", "#data-source-configuration #dsc-table_recordcount_upd", function () {
            if ($("#J_data_connect_table .checked").length === 0) {
                toastr.info("Please select the object");
                return false
            }
            bootbox.confirm("Please confirm to update row number.", function (result) {
                if (result) {
                    App.blockUI({
                        boxed: true,
                        message: "updating..."
                    });
                    showContent.tableRecordcountUpd();
                }
            });
        });

        //点击批量同步表结构按钮
        $("body").on("click", "#data-source-configuration #dsc-tables-upd-batch", function () {
            bootbox.confirm("Please confirm to batch update field.", function (result) {
                if (result) {
                    App.blockUI({
                        boxed: true,
                        message: "updating..."
                    });
                    var connection_id = $(
                        ".data-source-configuration-list .click-add-background"
                    ).attr("connection_id");
                    showContent.metadataTablesUpdBatch({
                        allCheckFlag: "Y",
                        connection_id
                    });
                }
            });
        });

        //点击批量更新表记录行数按钮
        $("body").on("click", "#data-source-configuration #dsc-table_recordcount_upd_batch", function () {
            bootbox.confirm("Please confirm to batch update row number.", function (result) {
                if (result) {
                    App.blockUI({
                        boxed: true,
                        message: "updating..."
                    });
                    var connection_id = $(
                        ".data-source-configuration-list .click-add-background"
                    ).attr("connection_id");
                    showContent.tableRecordcountUpdBatch({
                        allCheckFlag: "Y",
                        connection_id
                    });
                }
            });
        });
          // 点击列表导出
          $(`body`).on("click", "#J_list_export", function() {
            // let dom = $("#J_data_connect_table input:checked");
            // if (dom.length === 0) {
            //     toastr.info("请先选择数据");
            //     return;
            // }
            // if($("#connect-data-result thead input:checked").length){
                showContent.listImport({
                    connection_id:showContent.connect_id,
                    tableId:""
                }).then(data=>showContent.listImport2({
                    fileClass: "ZIP",
                    filePath: data.bcjson.items[0].filePatch
                }).then(data=>showContent.listImport3({
                    fileClass: "ZIP",
                    downloadToken: data.bcjson.items[0].downloadToken,
                    _s_t_i_0000: $.kingdom.getValue("x-trace-user-id"),
                })))
                return;
            // }
            // if(dom.length>0){
            //     let tableIdArry = [];
            //     $.each(dom, function(i,val) {
            //    let tableId1 = $(dom[i]).parents("td").attr("data-tableid");
            //     tableIdArry.push(tableId1);
            //     });
            //     let tableId =  tableIdArry.join(",");
            //     showContent.listImport({
            //         connection_id:showContent.connect_id,
            //         tableId
            //     }).then(data=>showContent.listImport2({
            //         fileClass: "ZIP",
            //         filePath: data.bcjson.items[0].filePatch
            //     }).then(data=>showContent.listImport3({
            //         fileClass: "ZIP",
            //         downloadToken: data.bcjson.items[0].downloadToken,
            //         _s_t_i_0000: $.kingdom.getValue("x-trace-user-id"),
            //     })))
            // }
           
        });
        //列表查看按钮显示
        $("body").on("click", "#data-source-configuration #dsc-modal-check", function () {
            $("#des-table-info-modal").modal("show");
            //自动点击到第一个tab
            $("#des-table-info-modal ul li a:eq(0)").click()

            //获取第一个tab页的内容（信息）
            $("#des-table-info-modal #des-showtable-info-1-form input[name='tableName']").val($(this).closest("td").data("tablename"));
            $("#des-table-info-modal #des-showtable-info-1-form input[name='tableCat']").val($(this).closest("td").data("tablecat"));
            $("#des-table-info-modal #des-showtable-info-1-form input[name='mdType']").val($(this).closest("td").data("mdtype"));
            $("#des-table-info-modal #des-showtable-info-1-form input[name='tableDesc']").val($(this).closest("td").data("tabledesc"));
            $("#des-table-info-modal #des-showtable-info-1-form input[name='schemName']").val($(this).closest("td").data("schemname"));

            //获取第二个tab页的内容（列信息）
            showContent.getTabColumnInfo($(this).closest("td").data("tableid"));


            //给第三个tab页面的按钮增添数据
            $("#des-showtable-info-3-button").attr("tablename", $(this).closest("td").data("tablename"));
            $("#des-showtable-info-3-button").attr("schemname", $(this).closest("td").data("schemname"));

            //清空之前的表内容
            $("#des-showtable-info-3-table-body").html("");
            $("#des-showtable-info-3-thead-tr").html("");
            $("#des-showtable-info-3-table").siblings("img").remove();

            //自动点击预览按钮
            $("#des-showtable-info-3-button").click();

        });

        //列表单个删除
        $("body").on("click", "#data-source-configuration #dsc-modal-delete", function () {
            var tableid = $(this).closest("td").data("tableid")
            bootbox.confirm("Please confirm to delete", function (result) {
                if (result) {
                    App.blockUI({
                        boxed: true,
                        message: "Deleting..."
                    });
                    showContent.deleteTableList(true, tableid);
                }
            });
        });

        //预览
        $("body").on("click", "#data-source-configuration #des-showtable-info-3-button", function () {
            var tablename = $(this).attr("tablename");
            var schemname = $(this).attr("schemname");
            showContent.previewAction(schemname, tablename);
        });

        //元表搜索（enter搜索）
        $("body").on("keydown", "#data-source-configuration #dsc-seach-metadata-input", function (event) {
            if (event.keyCode == 13) {
                $("#data-source-configuration #dsc-seach-metadata").click();
            }
        });

        //元表搜索
        $("body").on("click", "#data-source-configuration #dsc-seach-metadata", function () {
            var searchValue = $("#data-source-configuration #dsc-seach-metadata-input").val().toUpperCase();
            var newItems = [];
            $.each(showContent.getCurrentTreeData, function (index, value) {
                var obj = $.extend({}, value);
                var newTableList = [];
                $.each(obj.tableList, function (tableIndex, tableValue) {
                    newTableList.push(tableValue);
                });
                obj.tableList = newTableList;
                newItems.push(obj);
            });
            $.each(newItems, function (index, value) {
                for (var i = 0, length = value.tableList.length; i < length; i++) {
                    if (value.tableList[i]) {
                        if (value.tableList[i].tableName.toUpperCase().indexOf(searchValue) <= -1) {
                            value.tableList.splice(i--, 1);
                        }
                    }
                }
                value.tableCounts = value.tableList.length.toString();
            });
            showContent.generateTree(newItems, true);
        });

        //点击添加文件按钮
        $("body").on("click", "#data-source-configuration #J_dsc_add_file", function () {
            $("#J_mock_form_collection input[type=file]").click();
        });

        //检测form表单，文件input
        $("body").on("change", "#data-source-configuration #J_mock_form_collection_form input[name='file']", function (data) {
            var splitArray = data.currentTarget.files[0].name.split(".");
            var fileType = splitArray[splitArray.length - 1];
            if (fileType === "xls" || fileType === "xlsx") {
                App.blockUI({
                    boxed: true,
                    message: "Uploading..."
                });
                showContent.upLoad(data.currentTarget.files[0].name, fileType);
            } else {
                toastr.info("XLS file or XLSW file only");
            }
        });

        //点击删除按钮
        $("body").on("click", "#data-source-configuration .excel-choose-block-inside ul li .glyphicon-trash", function () {
            //删除或清空，则清除表格，重新获取
            $("#J_mock_form_collection_form input[name='file']").val("");
            $(this).closest("li").remove();
            $("#data-source-configuration .excel-bottom span span").html($("#data-source-configuration .excel-choose-block-inside ul li").length);
            $("#J_dsc_produce_head").html("");
            $("#J_dsc_produce_body").html("");
            $("#J_dsc_produce_head_option").html("");
            $("#J_dsc_produce_body_option").html("");
            $("#J_dsc_produce_head").closest(".table-scrollable").toggleClass("hide");
            showContent.getExcelContentList();
        });

        //点击清空按钮
        $("body").on("click", "#data-source-configuration #J_dsc_clear_file", function () {
            //删除或清空，则清除表格，重新获取
            $("#J_mock_form_collection_form input[name='file']").val("");
            $("#data-source-configuration .excel-choose-block-inside ul li").remove();
            $("#data-source-configuration .excel-bottom span span").html("0");
            $("#J_dsc_produce_head").html("");
            $("#J_dsc_produce_body").html("");
            $("#J_dsc_produce_head_option").html("");
            $("#J_dsc_produce_body_option").html("");
            $("#J_dsc_produce_head").closest(".table-scrollable").addClass("hide");
            showContent.getExcelContentList();
        });

        //导入文本 目标对象select
        $("body").on("change", "#J_select2_dcs_target_data_connect", function (e) {
            showContent.getTableList({
                connection_id: e.currentTarget.value
            }, "#J_select2_des_target_object", false, () => {
                if (showContent.targetTable) {
                    // 取对应ID ,因为接口存的表名
                    let origin = $("#J_select2_des_target_object").data("origin");
                    for (let { id, text } of origin) {
                        if (text === showContent.targetTable) {
                            $("#J_select2_des_target_object").val(id).change();
                        }
                    }
                } else {
                    $("#J_select2_des_target_object").change();
                }
                showContent.targetTable = "";
            });
        });

        // 导入 -> 数据时间切换
        $("body").on("click", `#data-source-configuration [name=dataTimeType]`, function () {
            let v = $(this).val();
            let option = {
                rtl: false,
                orientation: "left",
                todayBtn: "linked",
                autoclose: true,
                language: 'zh-CN',
                todayHighlight: true,
                startView: 2,
                maxViewMode: 2,
                minViewMode: 2,
                format: "yyyy"
            };
            if (v == "0") { // 日
                option.startView = 0;
                option.maxViewMode = 0;
                option.minViewMode = 0;
                option.format = "yyyymmdd";
            } else if (v == "1") {  // 月
                option.startView = 1;
                option.maxViewMode = 1;
                option.minViewMode = 1;
                option.format = "yyyymm";
            } else { // 年
                option.startView = 2;
                option.maxViewMode = 2;
                option.minViewMode = 2;
                option.format = "yyyy";
                $(this).val(v.substring(0, 4));
            }
            if (jQuery().datepicker) {
                $('[name=dataTime]').datepicker("remove");
                $('[name=dataTime]').datepicker(option);
                $('[name=dataTime]').datepicker('setDate', new Date());
            }
        });

        //文件类新增、编辑页面tab3页面 字段映射 按钮操作
        $("body").on("click", "#data-source-configuration #J_excel_add_tab3_btn [data-type]", function () {
            let type = $(this).data("type");
            let table_id = $("#J_excel_add_tab2_form select[name='targetTable']").val()
            if (type === "refresh") {
                // 刷新
                showContent.getDataField_2({
                    table_id
                });
            } else if (type === "del") {
                // 删除
                showContent.haddleDataField_2.delCheckedRow();
            }
        });

        //切换 把第一行作为表头、手动指定
        $("body").on("change", "#J_excel_add_tab1 input[name=headType]", function () {
            var type = $(this).val();
            if (type === "0") {
                $("#J_dsc_produce_table").removeClass("hide");
                $("#J_dsc_produce_table_option").addClass("hide");
            } else {
                $("#J_dsc_produce_table").addClass("hide");
                $("#J_dsc_produce_table_option").removeClass("hide");
            }
        });

        //处理上一步的问题处理
        $("body").on("click", "#data-source-configuration #J_dsc_pre_step", function () {
            var index = $("#J_dsc_fileType_add li").index($("#J_dsc_fileType_add li.active"));
            if (index === 0) {
                return false;
            } else if (index === 1) {
                $("#data-source-configuration #J_dsc_fileType_add .tabbable-line li").removeClass("active");
                $("#data-source-configuration #J_dsc_fileType_add .tabbable-line li:eq(0)").addClass("active");

                $("#data-source-configuration #J_dsc_fileType_add .tab-pane").removeClass("active")
                $("#data-source-configuration #J_excel_add_tab1").addClass("active")
            } else if (index === 2) {
                $("#data-source-configuration #J_dsc_fileType_add .tabbable-line li").removeClass("active");
                $("#data-source-configuration #J_dsc_fileType_add .tabbable-line li:eq(1)").addClass("active");

                $("#data-source-configuration #J_dsc_fileType_add .tab-pane").removeClass("active")
                $("#data-source-configuration #J_excel_add_tab2").addClass("active")
            }
        });

        //处理下一步的问题处理
        $("body").on("click", "#data-source-configuration #J_dsc_next_step", function () {
            var index = $("#J_dsc_fileType_add li").index($("#J_dsc_fileType_add li.active"));
            var params = {};

            //第一步
            //新建连接名称
            var connectionName = $("#data-source-configuration #J_excel_add_tab1 input[name='connectionName']").val();
            params.connectionName = connectionName;

            //上传文件名、文件url及文件类型
            var currentFile = $("#data-source-configuration #J_excel_add_tab1 .excel-choose-block-inside li:eq(0) span");
            var fileName = currentFile.html();
            var fileUrl = currentFile.attr("fileurl");
            var fileType = currentFile.attr("type");
            params.fileName = fileName;
            params.fileUrl = fileUrl;
            params.fileType = fileType;

            var headLine = ""
            //表头相关
            var headType = $("#J_excel_add_tab1 input[name=headType]:checked").val();
            if (headType === "0") {
                //把第一行作为表头
                headLine = "0";
            } else {
                //手动指定
                $.each($("#J_dsc_produce_table_option input[type=checkbox]:checked"), function () {
                    headLine = headLine + $("#J_dsc_produce_table_option input[type=checkbox]").index($(this)) + ",";
                });
                headLine = headLine.substring(0, headLine.length - 1)
            }

            //第二步
            params = Object.assign(params, App.getFormParams('J_excel_add_tab2_form'));
            if ($("#J_excel_add_tab2_form select[name='targetTable']").val()) {
                params.targetTable = $("#J_excel_add_tab2_form select[name='targetTable']").select2('data')[0].text.replace("(表)", "");
            }

            //第三步
            params.mappingInfo = showContent.haddleDataField_2.getData();


            if (index === 0) {
                //表单校验
                if (!connectionName) {
                    toastr.info("Source Name is missing!");
                    return false;
                }
                if ($("#data-source-configuration #J_excel_add_tab1 .excel-choose-block-inside li").length === 0) {
                    toastr.info("Please upload a file");
                    return false;
                }

                $("#data-source-configuration #J_dsc_fileType_add .tabbable-line li").removeClass("active");
                $("#data-source-configuration #J_dsc_fileType_add .tabbable-line li:eq(1)").addClass("active");

                $("#data-source-configuration #J_dsc_fileType_add .tab-pane").removeClass("active")
                $("#data-source-configuration #J_excel_add_tab2").addClass("active")


            } else if (index === 1) {

                showContent.getDataField_2({ table_id: $("#J_excel_add_tab2_form select[name='targetTable']").val() });

                $("#data-source-configuration a[href='#J_excel_add_tab3']").click();

                $("#data-source-configuration #J_dsc_fileType_add .tabbable-line li").removeClass("active");
                $("#data-source-configuration #J_dsc_fileType_add .tabbable-line li:eq(2)").addClass("active");

                $("#data-source-configuration #J_dsc_fileType_add .tab-pane").removeClass("active")
                $("#data-source-configuration #J_excel_add_tab3").addClass("active")
            } else if (index === 2) {
                //接口提交
                params.DBTYPE = "FILE";
                params.connectionType = $("#connection_type").val(); //drivenID
                params.headLine = headLine;
                if (showContent.fileEdit) {
                    params.opType = "UPD";
                    params.connectionId = $("#data-source-configuration .data-source-configuration-list .click-add-background").attr("connection_id");
                }
                showContent.addDataConnectList(params);
            }
        });

        //获取excel文件列表查看信息
        $("body").on("click", "#data-source-configuration #J_file_data_result_body #dsc-modal-check-file", function () {
            var parentTr = $(this).closest("td");
            var connectionId = parentTr.attr("connectionid");
            var fileUrl = parentTr.attr("fileurl");
            var fileType = parentTr.attr("filetype");
            var fileName = parentTr.attr("filename");
            var params = {
                connectionId: connectionId,
                fileUrl: fileUrl,
                fileType: fileType,
                fileName: fileName
            }
            showContent.hideShowBlock("#J_dsc_file_list_single_detail");
            $("#data-source-configuration #J_dsc_back_to_list").removeClass("hide")
            showContent.getExcelSingleFileDetail(params);
        });

        //点击单个excel查看详情时，详情里的编辑操作
        $("body").on("click", "#data-source-configuration #J_single_file_data_result_body a", function () {
            var currentTr = $(this).closest("tr");
            var allTd = currentTr.find("td");
            if ($(this).html() === "编辑") {
                $.each(allTd, function (index, item) {
                    if (index !== allTd.length - 1) {
                        var val = $(item).html();
                        var width = $(item).width();
                        $(item).html("<input type='text' style='width:" + width + "px'/>")
                        $(item).find("input").val(val);
                    } else {
                        $(item).html("<a href='javascript:;'>SAVE</a>");
                    }
                });
            } else {
                var data = JSON.parse($(this).closest("tr").attr("currentdata"));
                var allInput = $(this).closest("tr").find("input");
                var objArr = [];
                $.each(allInput, function (index, item) {
                    var obj = {};
                    objArr.push(obj);
                    obj.key = $(item).closest("td").attr("currentkey");
                    obj.val = $(item).val();
                    if ($(item).val() === data[obj.key]) {
                        obj.isTrans = 0;
                    } else {
                        obj.isTrans = 1;
                    }
                });
                //交互
                App.blockUI({
                    boxed: true,
                    message: "Saving..."
                });
                //调用接口，保存数据
                var preParams = JSON.parse($(this).closest("table").find("thead tr").attr("currentpreparams"));
                preParams.dataInfo = objArr;
                showContent.editExcelSingleFileDetail(preParams);
            }
        });



        //点击保存按钮

        //点击返回按钮
        $("body").on("click", "#data-source-configuration #J_dsc_back_to_list", function () {
            showContent.hideShowBlock("#J_dsc_file_list_detail");
        });

        //点击展开按钮
        // $("#J_tree_import_block").scroll(function () {
        //     //获取已经打开的节点
        //     var allOpenNode = $("#data-source-configuration .jstree-node.jstree-open");
        //     //得到未加载完的、已打开的、offsetTop最小的节点
        //     var minOffsetHeight = Infinity;
        //     var minOffsetNode = null;
        //     $.each(allOpenNode, function (index, item) {
        //         //当前node的table数量
        //         var tableCount = parseInt($(item).find("span:eq(0)").html().match(/（(.*)）/)[1]);
        //         var displayTableCount = $(item).find("ul li").length;
        //         if (tableCount > displayTableCount) {
        //             if ($(item).position().top < minOffsetHeight) {
        //                 minOffsetHeight = $(item).position().top;
        //                 minOffsetNode = $(item);
        //             }
        //         }
        //     });

        //     if(!minOffsetNode){
        //         return false;
        //     }
            
        //     //若当前需要加载的节点的倒数第二个节点加载出来，则开始追加新的节点到树上
        //     if ((minOffsetNode.find(".jstree-children li:eq(-2)").position().top-400) < 70) {
        //         debugger;
        //         //获取当前树的实例
        //         var ref = $('#J_tree_import').jstree(true);
        //         //当前父节点的数据对象
        //         var needAppendData = showContent.getCurrentTreeData[parseInt(minOffsetNode.attr("id").match(/parent(.*)/)[1])];
        //         //当前父节点已有的子节点的个数
        //         var currentNeedAppendNodeChild = minOffsetNode.find(".jstree-children li").length;
        //         //追加100个节点
        //         var needAppendArray = needAppendData.tableList.slice(currentNeedAppendNodeChild, currentNeedAppendNodeChild+30);
        //         for (var i = 0; i<30; i++) {
        //             var childValue = needAppendArray[i];
        //             if(!childValue){
        //                 break;
        //             }
        //             var obj = {};
        //             if (childValue.tableType === "TABLE") {
        //                 obj.text = childValue.tableName + "<span style='font-size:12px;font-weight:100;'>（表）</span>";
        //             } else {
        //                 obj.text = childValue.tableName + "<span style='font-size:12px;font-weight:100;'>（视图）</span>";
        //             }
        //             obj.id = "child-" + needAppendData.schemaName + "-" + (currentNeedAppendNodeChild+i);
        //             obj.children = false;
        //             if (childValue.tableType === "TABLE") {
        //                 obj.icon = "glyphicon glyphicon-list-alt"
        //             } else {
        //                 obj.icon = "glyphicon glyphicon-modal-window"
        //             }
        //             if (childValue.isExist === "Y") {
        //                 obj.a_attr = { "class": "is-exit-table" };
        //             }
        //             ref.create_node(minOffsetNode.attr("id"), obj , "last", false, false)
        //         }
        //     }

        //     //删除node的操作


        //     //为加载完，但
        // });

    });

    module.exports = init;
});