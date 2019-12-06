define(function (require, exports, module) {
    var showContent = require("./task-plan-settingShow");
    require("plugins/jquery-validation/js/jquery.validate");
    require("plugins/jstree/dist/jstree");
    require("plugins/jstree/dist/themes/default/style.css");
    require("plugins/jquery-validation/js/additional-methods.js");
    var init = {
        load: function () {
            showContent._load(); //加载页面数据
        }
    };
    $(function () {

        //调度计划搜索管理
        $("body").on("click", "#J_tps_search_form button[type=submit]", function () {
            if (!App.checkDate($("#J_tps_search_form"), "上次执行时间")) {
                return false;
            }
            var params = App.getFormParams("J_tps_search_form");
            params.pageNumber = "1"
            showContent.getTaskSetList(params);
        });

        // 点击下拉搜索
        $("body").on("change", `#J_task_plan_options`, function() {
            $(this).next().attr("name", $(this).val());
        });

        //点击弹出新增页面弹框
        $("body").on("click", "#J_add_plan_btn", function () {
            App.clearForm("J_form_basc");
            $("#J_form_basc input[name='scheduleLaw']")[0].click();
            $("#J_add_plan_modal").modal("show");
            $("#J_add_plan_modal .modal-header h4").text("新增调度计划");
            $(".J_form_basc_submit").attr("id", "J_form_basc_submit_add");
            $("#task-plan-setting #J_plan_setting_time").css("display", "none");
        });

        //点击弹出编辑页面弹框
        $("body").on("click", "#J_edit_plan_btn", function () {
            $("#task-plan-setting #J_plan_setting_time").css("display", "block");
            App.clearForm("J_form_basc");
            // var params = {};
            var obj = $("#taskSetList .checker input:checked ").data("obj");
            var length = $("#taskSetList .checker input:checked ").length;
            if (!length) {
                toastr.info("Please select records");
            } else if (length > 1) {
                toastr.info("Please select a record");
            } else {
                $("#J_add_plan_modal .modal-header h4").text("修改调度计划");
                $(".J_form_basc_submit").attr("id", "J_form_basc_submit_edit");
                App.setFormData("J_form_basc", obj);
                if (obj.executeTime) {
                    $("#J_form_basc [name=executeTime]").val($.kingdom.toDateTime(obj.executeTime));
                }
                if (obj.validStartDate) {
                    $("#J_form_basc [name=validStartDate]").val($.kingdom.toDateTime(obj.validStartDate));
                }
                if (obj.validEndDate) {
                    $("#J_form_basc [name=validEndDate]").val($.kingdom.toDateTime(obj.validEndDate));
                }
                if (obj.validEndDate === "20991231235959") {
                    $("#J_form_basc [fakename=forever]").click();
                    $("[name=validStartDate], [name=validEndDate]").val("");
                }
                $("#J_plan_setting_time .prev_time").html($.kingdom.toDateTime(obj.beforeTime));
                if (!obj.nextTime) {
                    $("#J_plan_setting_time .next_time").html("0000-00-00 00:00:00");
                } else {
                    $("#J_plan_setting_time .next_time").html($.kingdom.toDateTime(obj.nextTime));
                }
                $("#J_add_plan_modal").modal("show");
            }
        });

        //点击弹出删除弹框
        $("body").on("click", "#J_delete_btn", function () {
            var checkDom = $("#task_set_table .checked");
            var checkArray = [];
            $.each(checkDom, function (index, value) {
                if (
                    $(value)
                        .closest("tr")
                        .data("scheduleid")
                ) {
                    checkArray.push(
                        $(value)
                            .closest("tr")
                            .data("scheduleid")
                    );
                }
            });
            var params = {};
            params.scheduleId = checkArray.join(",");
            if (checkArray.length === 0) {
                toastr.info("Please select records");
            } else {
                bootbox.confirm("确定删除吗？", function (result) {
                    if (result) {
                        App.blockUI({
                            boxed: true,
                            message: "删除中..."
                        });
                        showContent.deletePlanSet(params);
                    }
                });
            }
        });

        //点击修改页面保存按钮
        $("body").on("click", "#J_form_basc_submit_edit", function () {
            if ($('#J_form_basc').valid()) {
                let paramsMap = App.getFormParams("J_form_basc");
                paramsMap.executeTime = paramsMap.executeTime.replace(/[\s-:]/g, "");
                paramsMap.validStartDate = paramsMap.validStartDate.replace(/[\s-:]/g, "");
                paramsMap.validEndDate = paramsMap.validEndDate.replace(/[\s-:]/g, "");
                if ($("#J_form_basc [fakename=forever]:checked").length === 1) {
                    paramsMap.validStartDate = $.kingdom.timeFormat(new Date().getTime()).replace(/[-: ]/g, "")
                    paramsMap.validEndDate = "20991231235959";
                }
                if (parseInt(paramsMap.validStartDate) > parseInt(paramsMap.validEndDate)) {
                    toastr.info("Start time should be earlier than end time");
                    return;
                }
                if ($("#uniform-inlineCheckbox2 span").hasClass("checked")) {
                    paramsMap.startFlag = "2";
                } else {
                    paramsMap.starFlat = "3";
                }
                // 判断是否执行一次
                if ($("#uniform-repeatFlag span").hasClass("checked")) {
                    paramsMap.repeatFlag = "Y";
                } else {
                    paramsMap.repeatFlag = "N";
                }
                App.blockUI({
                    boxed: true,
                    message: "Processing..."
                });
                showContent.editPlanSet(paramsMap);
            } else {
                toastr.info("Please check the invalid fields");
            }
        });

        //点击新增页面保存按钮
        $("body").on("click", "#J_form_basc_submit_add", function () {
            if ($('#J_form_basc').valid()) {
                let paramsMap = App.getFormParams("J_form_basc");
                paramsMap.executeTime = paramsMap.executeTime.replace(/[\s-:]/g, "");
                var cronExpression = paramsMap.cronExpression.replace(/ /g, "");
                var scheduleInterval = paramsMap.scheduleInterval.replace(/ /g, "");
                var frequency = paramsMap.frequency.replace(/ /g, "");
                if (!cronExpression) {
                    if (!scheduleInterval || !frequency) {
                        toastr.info("Please input the Schedule Frequency or CRON statement");
                        return false;
                    }
                }
                paramsMap.validStartDate = paramsMap.validStartDate.replace(/[\s-:]/g, "");
                paramsMap.validEndDate = paramsMap.validEndDate.replace(/[\s-:]/g, "");
                if ($("#J_form_basc [fakename=forever]:checked").length === 1) {
                    let myDate =new Date();
                    let year = myDate.getFullYear();
                    let month = myDate.getMonth()+1;
                    let date =  myDate.getDate(); //获取当前日(1-31)  
                    let hour =  myDate.getHours(); //获取当前小时数(0-23)  
                    let minute = myDate.getMinutes(); //获取当前分钟数(0-59)  
                    let second = myDate.getSeconds(); //获取当前秒数(0-59)  
                      paramsMap.validStartDate = $.kingdom.timeFormat(
                          new Date(`${year-1}-${month}-${date} ${hour}:${minute}:${second}`).getTime()).replace(/[-: ]/g, "")
                    paramsMap.validEndDate = "20991231235959";
                }
                if (parseInt(paramsMap.validStartDate) > parseInt(paramsMap.validEndDate)) {
                    toastr.info("Start time should be earlier than end time");
                    return;
                }
                //开启状态 默认开启
                paramsMap.startFlag = "2";
                App.blockUI({
                    boxed: true,
                    message: "Processing..."
                });
                showContent.addPlanSet(paramsMap);
            } else {
                toastr.info("Please check the invalid fields");
            }
        });

        // 点击corn表达式弹框
        $("body").on("click", "#J_cron_btn", function () {
            $("#J_crons_modal").modal("show");
        });

        //选择秒、分、时 radio
        $("body").on(
            "click",
            "#tab_s .line input[type='radio']," +
            "#tab_m .line input[type='radio']," +
            "#tab_h .line input[type='radio']," +
            "#tab_d .line input[type='radio']," +
            "#tab_w .line input[type='radio']," +
            "#tab_o .line input[type='radio']," +
            "#tab_y .line input[type='radio']",
            function () {
                var tabid = $(this)
                    .closest(".tab-pane")
                    .attr("id");
                var findIndexObj = {
                    tab_s: 0,
                    tab_m: 1,
                    tab_h: 2,
                    tab_d: 3,
                    tab_o: 4,
                    tab_w: 5,
                    tab_y: 6
                };
                //crons_set_table 下的input框
                var inputIndex = findIndexObj[tabid];
                var index = $("#" + tabid + " .line input[type='radio']").index(this);
                var towInput;
                if (index === 0 && inputIndex < 6) {
                    $("#crons_set_table input:eq(" + inputIndex + ")").val("*");
                } else if (index === 1 && inputIndex < 5) {
                    towInput =
                        $("#" + tabid + " .line:eq(1) input:eq(1)").val() +
                        "-" +
                        $("#" + tabid + " .line:eq(1) input:eq(2)").val();
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(towInput);
                } else if (index === 2 && inputIndex < 5) {
                    var threeInput =
                        $("#" + tabid + " .line:eq(2) input:eq(1)").val() +
                        "/" +
                        $("#" + tabid + " .line:eq(2) input:eq(2)").val();
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(threeInput);
                } else if (index === 3 && inputIndex < 3) {
                    var fourInput = getSecondCheckBox(tabid);
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(fourInput);
                } else if (index === 3 && inputIndex === 3) {
                    var fiveInput =
                        $("#" + tabid + " .line:eq(3) input:eq(1)").val() + "W";
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(fiveInput);
                } else if (index === 4 && inputIndex === 3) {
                    $("#crons_set_table input:eq(" + inputIndex + ")").val("L");
                } else if (index === 5 && inputIndex === 3) {
                    $("#crons_set_table input:eq(" + inputIndex + ")").val("?");
                } else if ((index === 6 && inputIndex === 3) || (index === 5 && inputIndex === 5) || (index === 4 && inputIndex === 4)) {
                    var sixInput = getSecondCheckBox(tabid);
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(sixInput);
                } else if (index === 1 && inputIndex === 5) {
                    towInput =
                        $("#" + tabid + " .line:eq(1) input:eq(1)").val() +
                        "/" +
                        $("#" + tabid + " .line:eq(1) input:eq(2)").val();
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(towInput);
                } else if (index === 2 && inputIndex === 5) {
                    towInput =
                        $("#" + tabid + " .line:eq(2) input:eq(1)").val() +
                        "#" +
                        $("#" + tabid + " .line:eq(2) input:eq(2)").val();
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(towInput);
                } else if (index === 3 && inputIndex === 5) {
                    towInput =
                        $("#" + tabid + " .line:eq(3) input:eq(1)").val() + "L";
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(towInput);
                } else if (index === 4 && inputIndex === 5) {
                    $("#crons_set_table input:eq(" + inputIndex + ")").val("?");
                } 
                // else if (index === 5 && inputIndex === 5) {
                //     var sixInput = getSecondCheckBox(tabid);
                //     $("#crons_set_table input:eq(" + inputIndex + ")").val(sixInput);
                // } 
                else if (index === 3 && inputIndex === 4) {
                    $("#crons_set_table input:eq(" + inputIndex + ")").val("?");
                } 
                // else if (index === 4 && inputIndex === 4) {
                //     var sixInput = getSecondCheckBox(tabid);
                //     $("#crons_set_table input:eq(" + inputIndex + ")").val(sixInput);
                // } 
                else if (index === 0 && inputIndex === 6) {
                    $("#crons_set_table input:eq(" + inputIndex + ")").val("");
                } else if (index === 1 && inputIndex === 6) {
                    $("#crons_set_table input:eq(" + inputIndex + ")").val("*");
                } else if (index === 2 && inputIndex === 6) {
                    towInput =
                        $("#" + tabid + " .line:eq(2) input:eq(1)").val() +
                        "-" +
                        $("#" + tabid + " .line:eq(2) input:eq(2)").val();
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(towInput);
                }
                cornAciton();
            }
        );

        // //选择 周期 -- - -- 秒、分、时、日
        $("body").on(
            "click",
            "#tab_s .line:eq(1) .bootstrap-touchspin-down," +
            "#tab_s .line:eq(1) .bootstrap-touchspin-up," +
            "#tab_m .line:eq(1) .bootstrap-touchspin-down," +
            "#tab_m .line:eq(1) .bootstrap-touchspin-up," +
            "#tab_h .line:eq(1) .bootstrap-touchspin-down," +
            "#tab_h .line:eq(1) .bootstrap-touchspin-up," +
            "#tab_d .line:eq(1) .bootstrap-touchspin-down," +
            "#tab_d .line:eq(1) .bootstrap-touchspin-up," +
            "#tab_o .line:eq(1) .bootstrap-touchspin-down," +
            "#tab_o .line:eq(1) .bootstrap-touchspin-up," +
            "#tab_y .line:eq(2) .bootstrap-touchspin-down," +
            "#tab_y .line:eq(2) .bootstrap-touchspin-up",
            function () {
                var tabid = $(this)
                    .closest(".tab-pane")
                    .attr("id");
                var findIndexObj = {
                    tab_s: "0",
                    tab_m: "1",
                    tab_h: "2",
                    tab_d: "3",
                    tab_o: "4",
                    tab_w: "5",
                    tab_y: "6"
                };
                //crons_set_table 下的input框
                var inputIndex = findIndexObj[tabid];
                var towInput;
                if (getRadioIndex(tabid) === 1) {
                    towInput =
                        $("#" + tabid + " .line:eq(1) input:eq(1)").val() +
                        "-" +
                        $("#" + tabid + " .line:eq(1) input:eq(2)").val();
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(towInput);
                } else if (getRadioIndex(tabid) === 2 && inputIndex === "6") {
                    towInput =
                        $("#" + tabid + " .line:eq(2) input:eq(1)").val() +
                        "-" +
                        $("#" + tabid + " .line:eq(2) input:eq(2)").val();
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(towInput);
                }
                cornAciton();
            }
        );

        //周期 从星期 ---- （1表示星期天，2表示星期一， 依次类推）
        $("body").on(
            "click",
            "#tab_w .line:eq(1) .bootstrap-touchspin-down," +
            "#tab_w .line:eq(1) .bootstrap-touchspin-up",
            function () {
                var tabid = $(this)
                    .closest(".tab-pane")
                    .attr("id");
                var findIndexObj = {
                    tab_s: "0",
                    tab_m: "1",
                    tab_h: "2",
                    tab_d: "3",
                    tab_w: "5"
                };
                //crons_set_table 下的input框
                var inputIndex = findIndexObj[tabid];
                if (getRadioIndex(tabid) === 1) {
                    var towInput =
                        $("#" + tabid + " .line:eq(1) input:eq(1)").val() +
                        "/" +
                        $("#" + tabid + " .line:eq(1) input:eq(2)").val();
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(towInput);
                }
                cornAciton();
            }
        );

        // //周期 从星期 ---- （1表示星期天，2表示星期一， 依次类推）
        $("body").on(
            "click",
            "#tab_w .line:eq(2) .bootstrap-touchspin-down," +
            "#tab_w .line:eq(2) .bootstrap-touchspin-up",
            function () {
                var tabid = $(this)
                    .closest(".tab-pane")
                    .attr("id");
                var findIndexObj = {
                    tab_s: "0",
                    tab_m: "1",
                    tab_h: "2",
                    tab_d: "3",
                    tab_w: "5"
                };
                //crons_set_table 下的input框
                var inputIndex = findIndexObj[tabid];
                if (getRadioIndex(tabid) === 2) {
                    var towInput =
                        $("#" + tabid + " .line:eq(2) input:eq(1)").val() +
                        "#" +
                        $("#" + tabid + " .line:eq(2) input:eq(2)").val();
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(towInput);
                }
                cornAciton();
            }
        );

        // //本月最后一个星期...（1表示星期天，2表示星期一， 依次类推）
        $("body").on(
            "click",
            "#tab_w .line:eq(3) .bootstrap-touchspin-down," +
            "#tab_w .line:eq(3) .bootstrap-touchspin-up",
            function () {
                var tabid = $(this)
                    .closest(".tab-pane")
                    .attr("id");
                var findIndexObj = {
                    tab_s: "0",
                    tab_m: "1",
                    tab_h: "2",
                    tab_d: "3",
                    tab_w: "5"
                };
                //crons_set_table 下的input框
                var inputIndex = findIndexObj[tabid];
                if (getRadioIndex(tabid) === 3) {
                    var towInput =
                        $("#" + tabid + " .line:eq(3) input:eq(1)").val() + "L";
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(towInput);
                }
                cornAciton();
            }
        );

        //选择 从 -- 秒、分、时、日开始 每 -- 秒、分、时、日 执行一下
        $("body").on(
            "click",
            "#tab_s .line:eq(2) .bootstrap-touchspin-down," +
            "#tab_s .line:eq(2) .bootstrap-touchspin-up," +
            "#tab_m .line:eq(2) .bootstrap-touchspin-down," +
            "#tab_m .line:eq(2) .bootstrap-touchspin-up," +
            "#tab_h .line:eq(2) .bootstrap-touchspin-down," +
            "#tab_h .line:eq(2) .bootstrap-touchspin-up," +
            "#tab_d .line:eq(2) .bootstrap-touchspin-down," +
            "#tab_d .line:eq(2) .bootstrap-touchspin-up," +
            "#tab_o .line:eq(2) .bootstrap-touchspin-down," +
            "#tab_o .line:eq(2) .bootstrap-touchspin-up",
            function () {
                var tabid = $(this)
                    .closest(".tab-pane")
                    .attr("id");
                var findIndexObj = {
                    tab_s: "0",
                    tab_m: "1",
                    tab_h: "2",
                    tab_d: "3",
                    tab_o: "4",
                    tab_w: "5"
                };
                //crons_set_table 下的input框
                var inputIndex = findIndexObj[tabid];
                if (getRadioIndex(tabid) === 2) {
                    var threeInput =
                        $("#" + tabid + " .line:eq(2) input:eq(1)").val() +
                        "/" +
                        $("#" + tabid + " .line:eq(2) input:eq(2)").val();
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(threeInput);
                }
                cornAciton();
            }
        );

        //指定具体秒
        $("body").on(
            "click",
            "#tab_s .checkbox-div input,#tab_m .checkbox-div input,#tab_h .checkbox-div input,#tab_d .checkbox-div input,#tab_w .checkbox-div input,#tab_o .checkbox-div input",
            function () {
                var tabid = $(this)
                    .closest(".tab-pane")
                    .attr("id");
                var findIndexObj = {
                    tab_s: "0",
                    tab_m: "1",
                    tab_h: "2",
                    tab_d: "3",
                    tab_o: "4",
                    tab_w: "5"
                };
                //crons_set_table 下的input框
                var inputIndex = findIndexObj[tabid];
                if (getRadioIndex(tabid) === 3 || (getRadioIndex(tabid) === 6 && inputIndex === "3") || (getRadioIndex(tabid) === 5 && inputIndex === "5") || (getRadioIndex(tabid) === 4 && inputIndex === "4")) {
                    var fourInput = getSecondCheckBox(tabid);
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(fourInput);
                } 
                // else if (getRadioIndex(tabid) === 6 && inputIndex === "3") {
                //     var fourInput = getSecondCheckBox(tabid);
                //     $("#crons_set_table input:eq(" + inputIndex + ")").val(fourInput);
                // } else if (getRadioIndex(tabid) === 5 && inputIndex === "5") {
                //     var fourInput = getSecondCheckBox(tabid);
                //     $("#crons_set_table input:eq(" + inputIndex + ")").val(fourInput);
                // } else if (getRadioIndex(tabid) === 4 && inputIndex === "4") {
                //     var fourInput = getSecondCheckBox(tabid);
                //     $("#crons_set_table input:eq(" + inputIndex + ")").val(fourInput);
                // }
                cornAciton();
            }
        );

        //日 每月 ... 号最近的那个工作日
        $("body").on(
            "click",
            "#tab_d .line:eq(3) .bootstrap-touchspin-down,#tab_d .line:eq(3) .bootstrap-touchspin-up",
            function () {
                var tabid = $(this)
                    .closest(".tab-pane")
                    .attr("id");
                var findIndexObj = {
                    tab_s: "0",
                    tab_m: "1",
                    tab_h: "2",
                    tab_d: "3"
                };
                //crons_set_table 下的input框
                var inputIndex = findIndexObj[tabid];
                if (getRadioIndex(tabid) === 3) {
                    var fiveInput =
                        $("#" + tabid + " .line:eq(3) input:eq(1)").val() + "W";
                    $("#crons_set_table input:eq(" + inputIndex + ")").val(fiveInput);
                }
                cornAciton();
            }
        );

        //判断（秒、分钟、小时、日、周、月、年）tab页，第几个checkbox被选中
        function getRadioIndex(tabid) {
            var checkBoxElement = $("#" + tabid + " .line .radio span");
            var indexCheck = 0;
            $.each(checkBoxElement, function (index, value) {
                if ($(value).attr("class") === "checked") {
                    indexCheck = index;
                }
            });
            return indexCheck;
        }

        //判断0-59秒checkbox，选择的情况
        function getSecondCheckBox(tabid) {
            var checkString = "";
            var checkEle = $("#" + tabid + " .checkbox-div");
            $.each(checkEle, function (index, value) {
                if (
                    $(value)
                        .find("span")
                        .attr("class") === "checked"
                ) {
                    checkString = checkString + "," + index;
                }
            });
            if (checkString === "") {
                $("#" + tabid + " .checkbox-div:eq(0) input").click();
                return "0";
            }
            return checkString.substring(1, checkString.length);
        }

        //赋值corn表达式
        function cornAciton() {
            //统一处理Cron 表达式
            var finalInput = "";
            $.each($("#crons_set_table input"), function (index, value) {
                if (index < 7) {
                    if (index === 0) {
                        finalInput = $(value).val().toString();
                    } else {
                        finalInput = finalInput + " " + $(value).val().toString();
                    }

                }
            });
            $("#tps-cron-input").val(finalInput);
        }

        //作业树的处理
        //控制只准选择没有父级菜单的作业
        $("body").on(
            "click",
            "#task-plan-setting [type=treeselectchild] .jstree-anchor",
            function () {
                if (
                    $(this)
                        .closest("li")
                        .attr("class")
                        .indexOf("jstree-leaf") > -1
                ) {
                    var jobid = $(this)
                        .attr("id")
                        .match(/tbs-tree-(.*)_anchor/)[1];
                    $(this)
                        .parents("[type=treeselectchild]")
                        .siblings("input[type=hidden]")
                        .val(jobid);
                    $(this)
                        .parents("[type=treeselectchild]")
                        .siblings(".dropdown-toggle")
                        .val($(this).text())
                        .attr("aria-expanded", "false")
                        .parent()
                        .removeClass("open");
                }
            }
        );

        //保存表达式到上一个页面
        $("body").on("click", ".J_form_corn_btn", function () {
            $("#J_crons_modal").modal("hide");
            $("textarea[name='cronExpression']").val($("#tps-cron-input").val());
        });

        //判断执行频率keyup
        $("body").on("keyup", "#J_form_basc input[name='scheduleInterval']", function () {
            showContent.handleFrequency();
        });

        //根据执行频率，生成相应的corn表达式
        $("body").on("change", "#J_form_basc input[name='scheduleInterval'],#J_form_basc select[name='frequency']", function () {
            showContent.handleFrequency();
        });
    });

    module.exports = init;
});