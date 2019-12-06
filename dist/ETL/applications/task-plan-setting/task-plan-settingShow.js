

define(function (require, exports, module) {
    require("plugins/bootstrap-switch/js/bootstrap-switch.min.js");
    require("plugins/bootstrap-switch/css/bootstrap-switch.min.css");
    require("plugins/bootstrap-touchspin/bootstrap.touchspin.min.css");
    require("plugins/bootstrap-touchspin/bootstrap.touchspin.min.js");
    var showContent = {};
    showContent._load = function () {
        // 查询频度字典
        $.kingdom.getDict("FREQUENCY", "#J_task_set");
        $.kingdom.getDict("FREQUENCY", "#J_task_set2");
        $.kingdom.getDict("BATCH_FORMAT", "#batchFormat");
        $.kingdom.getDict("LAST_EXEC_STATE", "[name=lastExecState]");

        let lastExecState = sessionStorage.getItem("type");
        if (lastExecState) {
            $("[name=lastExecState]").val(lastExecState);
            $(`.page-task-plan-setting .collapse-control`).click();
        }
        sessionStorage.setItem("type", "");

        App.initUniform();
        App.handleDatePickers();
        App.handleDateTimePickers();
        showContent.getTaskSetList();
        showContent.getNewTree();
        showContent.setInitValue();
        showContent.initForm();
        // showContent.getNowTime();
    };

    //初始化switch及input内的值
    showContent.setInitValue = function () {
        $("#tab_s .line:eq(1) input:eq(1)").TouchSpin({ min: 1, max: 58, step: 1 }).val("1");
        $("#tab_s .line:eq(1) input:eq(2)").TouchSpin({ min: 2, max: 59, step: 1 }).val("2");
        $("#tab_s .line:eq(2) input:eq(1)").TouchSpin({ min: 0, max: 59, step: 1 }).val("0");
        $("#tab_s .line:eq(2) input:eq(2)").TouchSpin({ min: 1, max: 59, step: 1 }).val("1");

        $("#tab_m .line:eq(1) input:eq(1)").TouchSpin({ min: 1, max: 58, step: 1 }).val("1");
        $("#tab_m .line:eq(1) input:eq(2)").TouchSpin({ min: 2, max: 59, step: 1 }).val("2");
        $("#tab_m .line:eq(2) input:eq(1)").TouchSpin({ min: 0, max: 59, step: 1 }).val("0");
        $("#tab_m .line:eq(2) input:eq(2)").TouchSpin({ min: 1, max: 59, step: 1 }).val("1");

        $("#tab_h .line:eq(1) input:eq(1)").TouchSpin({ min: 0, max: 23, step: 1 }).val("0");
        $("#tab_h .line:eq(1) input:eq(2)").TouchSpin({ min: 2, max: 23, step: 1 }).val("2");
        $("#tab_h .line:eq(2) input:eq(1)").TouchSpin({ min: 0, max: 23, step: 1 }).val("0");
        $("#tab_h .line:eq(2) input:eq(2)").TouchSpin({ min: 1, max: 23, step: 1 }).val("1");

        $("#tab_d .line:eq(1) input:eq(1)").TouchSpin({ min: 1, max: 31, step: 1 }).val("1");
        $("#tab_d .line:eq(1) input:eq(2)").TouchSpin({ min: 2, max: 31, step: 1 }).val("2");
        $("#tab_d .line:eq(2) input:eq(1)").TouchSpin({ min: 1, max: 31, step: 1 }).val("1");
        $("#tab_d .line:eq(2) input:eq(2)").TouchSpin({ min: 1, max: 31, step: 1 }).val("1");
        $("#tab_d .line:eq(3) input:eq(1)").TouchSpin({ min: 1, max: 31, step: 1 }).val("1");

        $("#tab_o .line:eq(1) input:eq(1)").TouchSpin({ min: 1, max: 12, step: 1 }).val("1");
        $("#tab_o .line:eq(1) input:eq(2)").TouchSpin({ min: 2, max: 12, step: 1 }).val("2");
        $("#tab_o .line:eq(2) input:eq(1)").TouchSpin({ min: 1, max: 12, step: 1 }).val("1");
        $("#tab_o .line:eq(2) input:eq(2)").TouchSpin({ min: 1, max: 12, step: 1 }).val("1");

        $("#tab_w .line:eq(1) input:eq(1)").TouchSpin({ min: 1, max: 7, step: 1 }).val("1");
        $("#tab_w .line:eq(1) input:eq(2)").TouchSpin({ min: 2, max: 7, step: 1 }).val("2");
        $("#tab_w .line:eq(2) input:eq(1)").TouchSpin({ min: 1, max: 4, step: 1 }).val("1");
        $("#tab_w .line:eq(2) input:eq(2)").TouchSpin({ min: 1, max: 7, step: 1 }).val("1");
        $("#tab_w .line:eq(3) input:eq(1)").TouchSpin({ min: 1, max: 7, step: 1 }).val("1");

        $("#tab_y .line:eq(2) input:eq(1)").TouchSpin({ min: new Date().getFullYear(), max: 3000, step: 1 }).val(new Date().getFullYear().toString());
        $("#tab_y .line:eq(2) input:eq(2)").TouchSpin({ min: new Date().getFullYear() + 1, max: 3000, step: 1 }).val((new Date().getFullYear() + 1).toString());

        var allTabPane = $("#J_crons_modal .tab-pane");
        $.each(allTabPane, function (index, value) {
            if (index === 3) {
                $(value).find(".line:eq(5) input[type=radio]").click();
            } else {
                $(value).find(".line:eq(0) input[type=radio]").click();
            }
        });

    }

    showContent.getNewTree = function () {
        $.kingdom.doKoauthAdminAPI(
            "bayconnect.superlop.get_jobs_list",
            "v4.0", {
                pageSize: '999',
                pageNumber: '1'
            },
            function (data) {
                if (data.bcjson.flag == "1" && data.bcjson.totalCount && data.bcjson.totalCount > 0) {
                    var items = data.bcjson.items;
                    var rootArray = [];
                    for (var single of items) {
                        var folderName = single.folderName;
                        var jobName = single.jobName;
                        var jobId = single.jobId;
                        var folderArray = folderName.split("/");
                        var currentPath = rootArray;
                        $.each(folderArray, function (index, value) {
                            var lastone = false;
                            if (index === folderArray.length - 1) {
                                lastone = true;
                            }
                            var findExitName = false;
                            for (var items1 of currentPath) {
                                if (value === items1.text) {
                                    if (lastone) {
                                        items1.children.push({ text: jobName, id: "tbs-tree-" + jobId });
                                    } else {
                                        currentPath = items1.children;
                                    }
                                    findExitName = true;
                                    break;
                                }
                            }
                            if (!findExitName) {
                                if (lastone) {
                                    currentPath.push({ text: value, children: [{ text: jobName, id: "tbs-tree-" + jobId }] });
                                } else {
                                    currentPath.push({ text: value, children: [] });
                                    currentPath = currentPath[currentPath.length - 1].children;
                                }
                            }
                        });
                    }
                    $(".J_tree_work").jstree({
                        types: {
                            default: {
                                icon: false // 删除默认图标
                            }
                        },
                        core: {
                            data: rootArray,
                            themes: {
                                responsive: false
                            },
                            check_callback: true
                        },
                        plugins: ["types", "themes", "html_data", "contextmenu", "state"]
                    });
                }
            }
        );
    };
    //  获取当前时间
    showContent.getNowTime = function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate =
            date.getFullYear() +
            seperator1 +
            month +
            seperator1 +
            strDate +
            " " +
            date.getHours() +
            seperator2 +
            date.getMinutes() +
            seperator2 +
            date.getSeconds();
        $(".prev_time").html(currentdate);
        $(".next_time").html(currentdate);
    };

    // 查询列表
    showContent.getTaskSetList = params => {
        $.kingdom.getList({
            apiName: "bayconnect.superlop.get_schedule_info",
            apiVision: "v4.0",
            params: params,
            tableId: "task_set_table",
            pageId: "task_set_pages",
            template: "task-plan-setting/template/task-set-list.handlebars",
            formName: "J_tps_search_form",
            cb: showContent.getTaskSetList
        }, (data) => {
            var items = data.bcjson.items;
            $(".make-switch").bootstrapSwitch({
                onText: "ON", // 设置ON文本
                offText: "OFF", // 设置OFF文本
                onColor: "success", // 设置ON文本颜色     (info/success/warning/danger/primary)
                offColor: "default", // 设置OFF文本颜色        (info/success/warning/danger/primary)
                size: "mini", // 设置控件大小,从小到大  (mini/small/normal/large)
                // 当开关状态改变时触发
                onSwitchChange: function (event, state) {
                    //创建开关
                    var index = $(".make-switch").index($(this));
                    var item = items[index];
                    App.blockUI({
                        boxed: true,
                        message: state ? "开启中" : "关闭中"
                    });
                    showContent.setSwitchAction(state, item);
                }
            });
            
            $('#task_set_table tbody tr .bootstrap-switch').click(function(e) {
                e.stopPropagation();
            });
        });
    };
    // 新增调度计划
    showContent.addPlanSet = function (params) {
        var paramsMap = $.extend({ operType: "ADD" }, params);
        $.kingdom.doKoauthAdminAPI(
            "bayconnect.superlop.set_schedule_info_modify",
            "v4.0",
            paramsMap,
            data => {
                App.unblockUI();
                if (data.bcjson.flag == "1") {
                    toastr.success(data.bcjson.msg);
                    $("#J_add_plan_modal").modal("hide");
                    //新增成功后，清空表单
                    App.clearForm("J_form_basc");
                    showContent.getTaskSetList();
                } else {
                    toastr.error(data.bcjson.msg);
                }
            }
        );
    };
    // 修改调度计划
    showContent.editPlanSet = function (params) {
        var obj = $("#taskSetList .checker input:checked ").data("obj");
        var paramsMap = $.extend(obj, params);
        paramsMap = $.extend({ operType: "UPD" }, paramsMap);
        $.kingdom.doKoauthAdminAPI(
            "bayconnect.superlop.set_schedule_info_modify",
            "v4.0",
            paramsMap,
            data => {
                App.unblockUI();
                if (data.bcjson.flag == "1") {
                    toastr.success(data.bcjson.msg);
                    $("#J_add_plan_modal").modal("hide");
                    //新增成功后，清空表单
                    App.clearForm("J_form_basc");
                    showContent.getTaskSetList();
                } else {
                    toastr.error(data.bcjson.msg);
                }
            }
        );

    };
    // 删除调度计划
    showContent.deletePlanSet = function (params) {
        var paramsMap = $.extend({ operType: "DEL" }, params);
        $.kingdom.doKoauthAdminAPI(
            "bayconnect.superlop.set_schedule_info_modify",
            "v4.0",
            paramsMap,
            data => {
                if (data.bcjson.flag == "1") {
                    $("#J_add_plan_modal").modal("hide");
                    toastr.success(data.bcjson.msg);
                } else {
                    toastr.error(data.bcjson.msg);
                }
                App.unblockUI();
                showContent.getTaskSetList();
            }
        );
    };
    //开启或关闭
    showContent.setSwitchAction = function (state, item) {
        var paramsMap = $.extend({ operType: "UPD" }, item);
        if (state) {
            paramsMap.startFlag = "2"
        } else {
            paramsMap.startFlag = "3"
        }
        $.kingdom.doKoauthAdminAPI(
            "bayconnect.superlop.set_schedule_info_modify",
            "v4.0",
            paramsMap,
            data => {
                App.unblockUI();
                if (data.bcjson.flag == "1") {
                    toastr.success(data.bcjson.msg);
                } else {
                    showContent.getTaskSetList();
                    toastr.error(data.bcjson.msg);
                }
            }
        );
    }

    // 所有表单校验配置
    showContent.initForm = () => {
        // 
        $('#J_form_basc').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                scheduleName: {
                    required: true
                },
                jobName: {
                    required: true,
                },
                validStartDate: {
                    conditionRequired: true,
                },
                validEndDate: {
                    conditionRequired: true,
                },
                executeTime: {
                    required: true
                },
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function (element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            submitHandler: function (form) { }
        });
        $.validator.addMethod("conditionRequired", function (value, element) {
            if ($("[fakename=forever]:checked").length === 0) {
                // if (!value) {
                //     return false;
                // } else {
                //     return true;
                // }
                return !!value;
            } else {
                return true;
            }
        }, "param is missing");
        $.validator.addMethod("executeRequired", function (value, element) {
            // if ($("#J_form_basc textarea[name=cronExpression]").val().replace(/ /g, "") === "") {
            //     return false;
            // } else {
            //     return true
            // }
            return $("#J_form_basc textarea[name=cronExpression]").val().replace(/ /g, "") !== "";
        }, "param is missing");
    }

    //对执行频度方面的处理
    showContent.handleFrequency = function () {
        //输入框内的值
        var frequencyInput = $("#J_form_basc input[name='scheduleInterval']");
        var val = frequencyInput.val();
        var valInt = parseInt(val);
        if (!/^[1-9]\d*$/.test(val)) {
            frequencyInput.val("");
            $("#J_form_basc textarea[name='cronExpression']").val("");
            return false;
        }
        //频率输入框的最大值，最小值
        var min = -Infinity;
        var max = Infinity;

        //执行频率所对应的单位
        var frequency = $("#J_task_set").val();

        if (frequency === "H") {
            //小时
            min = 0;
            max = 11;
        } else if (frequency === "I") {
            //分钟
            min = 0;
            max = 59;
        } else if (frequency === "D") {
            //日
            min = 0;
            max = 30;
        }

        if (valInt > max) {
            frequencyInput.val(max);
        }

        if (valInt < min) {
            frequencyInput.val(min);
        }

        //获取执行频率的单位类型
        var frequency1 = $("#J_form_basc select[name='frequency']").val();
        //获取执行频率的input
        var scheduleInterval = frequencyInput.val();
        //初始化填入textarea的corn表达式
        var cornExpression = "";
        if (frequency1 === "I") {
            cornExpression = `0 */${scheduleInterval} * * * ?`
        } else if (frequency1 === "H") {
            cornExpression = `0 0 */${scheduleInterval} * * ?`
        } else if (frequency1 === "D") {
            cornExpression = `0 0 0 */${scheduleInterval} * ?`
        }
        //设置textarea
        $("#J_form_basc textarea[name='cronExpression']").val(cornExpression);
    }
    module.exports = showContent;
});