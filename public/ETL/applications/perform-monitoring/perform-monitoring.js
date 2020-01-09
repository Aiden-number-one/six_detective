/*
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-04-10 15:46:28
 */
define(function (require, exports, module) {
    var showContent = require("./perform-monitoringShow");
    require("plugins/jquery-validation/js/jquery.validate");
    var PAGE = location.hash.split("?")[0].replace("#", ".page-");
    var init = {
        load: function load() {
            showContent._load(); //加载页面数据
            var oBar = document.getElementById("J_drag_bar8");
            var oTarget = document.getElementById("J_drag_bar8");
            startDrag(oBar, oTarget, ".left-side-monitoring", ".right-content-monitoring", function () {
                LFWIDTH = $('.left-side1').width();
            });
            $('#perform-monitoring').css('margin-top', 0);
        }
    };
    saveJobid = ""; //保存点击左侧树时的任务id
    saveBatchNo = ""; //保存点击左侧树时的任务编号

    $(function () {

        // $("body").on("click","#J_tableList .jstree-anchor>div",function() {
        //     let jobId = $("#J_pm_top_jobno").text(),
        //         nodeName = $(this).attr("nodeName"),
        // params = {
        //     jobId:"DQ_TEST",
        //     nodeName:"START",
        //     // searchDate:"20181220"
        // }; 
        // $("#J_iframe").attr("src", "/iframe/iframe-monitor.html?" + encodeURIComponent(JSON.stringify(params)));
        // });

        //控制点击三角形滑动饼图区域
        $("body").on("click", "#perform-monitoring .img-absolute-block .img-absolute", function () {
            var index = $("#perform-monitoring .img-absolute-block .img-absolute").index($(this));
            var hasMoved;
            if (index === 0) {
                hasMoved = $("#right-content-middle-round").scrollLeft() - 868;
                $('#right-content-middle-round').animate({ scrollLeft: hasMoved + 'px' }, 300);
            } else {
                hasMoved = $("#right-content-middle-round").scrollLeft() + 868;
                $('#right-content-middle-round').animate({ scrollLeft: hasMoved + 'px' }, 300);
            }
        });
        $("body").on("click", "#perform-monitoring [href=#J_tps_1_4]", function () {
            $(".my_search").removeClass("hide");
            $(".search").addClass("hide");
        });
        $("body").on("click", "#perform-monitoring [href=#J_tps_1_5]", function () {
            $(".search").removeClass("hide");
            $(".my_search").addClass("hide");
        });
        //点击饼状图
        $("body").on("click", "#perform-monitoring .circleChart-box", function () {
            var job_detail = {};
            job_detail.jobId = $("#perform-monitoring #right-content-top #J_pm_top_jobno").attr("jobId");
            job_detail.batchNo = $(this).find(".circleChart-text div").html();
            var paramDom = $(this).find(".circleChart-text div");
            var items = {
                batchNo: paramDom.attr("batchNo"),
                zxsj: paramDom.attr("zxsj"),
                jobName: paramDom.attr("jobname"),
                jobId: paramDom.attr("jobid"),
                jobNo: paramDom.attr("jobno"),
                errorNum: paramDom.attr("errornum"),
                startTime: paramDom.attr("starttime"),
                endTime: paramDom.attr("endtime"),
                executeTypeName: paramDom.attr("executetypeName"),
                executeFlag: paramDom.attr("executeflag"),
                isDependNewExecute: "1",
                newExecuteFlag: $("#right-content-middle-round .circleChart-text:eq(0) div").attr("executeflag") //最新批次的执行状态（第一块数据的按钮是根据最新的批次来显示）
            };
            showContent.getThirdBoardData(items, job_detail, true);
        });

        window.addEventListener("hashchange", function (data) {
            if (data.oldURL.split("#")[1] === "perform-monitoring") {
                clearInterval(showContent.setIntervalLeftBox);
                clearInterval(showContent.timeInterval);
                clearInterval(showContent.setInterval);
                var iframWindow = $("#perform-monitoring #J_change_view_job iframe")[0].contentWindow;
                iframWindow.clearInterval(iframWindow.setIntervalVarIframe);
            }
        });

        //enter搜索
        $("body").on("keydown", "#perform-monitoring #J_pm_jobname_tree_search", function (event) {
            if (event.keyCode == 13) {
                $("#perform-monitoring #J_pm_jobname_tree_search_btn").click();
            }
        });
        //enter搜索
        $("body").on("keydown", "#perform-monitoring #J_pm_jobname_my_tree_search", function (event) {
            if (event.keyCode == 13) {
                $("#perform-monitoring #J_pm_jobname_my_tree_search_btn").click();
            }
        });
        // hover左侧树全部
        $("body").on("mouseenter", "#J_pm_jobname_tree .jstree-anchor", function (e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).find(".jstree-operate").length === 1) {
                return;
            }
            var level = $(this).closest("li").attr("aria-level");
            if ($(this).find(".jstree-operate").length === 1) {
                return;
            }
            if (level === "1") {
                // $(this).after(`<div class="jstree-operatemin"><a name="add" title="新增"><i class="glyphicon glyphicon-plus"></i></a><a name="edit" title="编辑"><i class="glyphicon glyphicon-pencil"></i></a></div>`);
            } else if (level === "2") {
                $(this).append("<div class=\"jstree-operate\"><a name=\"add\" title=\"Add to my tasks\"><i class=\"fa fa-plus-circle\" style=\"color: #3fc9d5\"></i></a></div>");
                // $(this).append(`<div class="jstree-operate"><a name="add" title="新增"><i class="fa fa-plus-circle" style="color: #3fc9d5"></i></a><a name="del" title="删除"><i class="fa fa-times-circle"></i></a></div>`);
            } else if (level === "3") {
                $(this).append("<div class=\"jstree-operate\"><a name=\"add\" title=\"Add to my tasks\"><i class=\"glyphicon glyphicon-plus\"></i></a><a name=\"edit\" title=\"\u7F16\u8F91\"><i class=\"glyphicon glyphicon-pencil\"></i></a></div>");
                // $(this).append(`<div class="jstree-operate"><a name="add" title="新增"><i class="glyphicon glyphicon-plus"></i></a><a name="edit" title="编辑"><i class="glyphicon glyphicon-pencil"></i></a><a name="del" title="删除"><i class="glyphicon glyphicon-trash"></i></a></div>`);
            } else {
                $(this).append("<div class=\"jstree-operate\"><a name=\"add\" title=\"Add to my tasks\"><i class=\"glyphicon glyphicon-plus\"></i></a></div>");
                // $(this).append(`<div class="jstree-operate"><a name="add" title="新增"><i class="glyphicon glyphicon-plus"></i></a><a name="del" title="删除"><i class="glyphicon glyphicon-trash"></i></a></div>`);
            }
        });

        // hover左侧树我的
        $("body").on("mouseenter", "#J_pm_jobname_my_tree .jstree-anchor", function (e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).find(".jstree-operate").length === 1) {
                return;
            }
            var level = $(this).closest("li").attr("aria-level");
            if ($(this).find(".jstree-operate").length === 1) {
                return;
            }
            if (level === "1") {
                // $(this).after(`<div class="jstree-operatemin"><a name="add" title="新增"><i class="glyphicon glyphicon-plus"></i></a><a name="edit" title="编辑"><i class="glyphicon glyphicon-pencil"></i></a></div>`);
            } else if (level === "2") {
                $(this).append("<div class=\"jstree-operate\"><a name=\"del\" title=\"DELETE\"><i class=\"fa fa-times-circle\"></i></a></div>");
            } else if (level === "3") {
                $(this).append("<div class=\"jstree-operate\"><a name=\"del\" title=\"DELETE\"><i class=\"glyphicon glyphicon-trash\"></i></a></div>");
            } else {
                $(this).append("<div class=\"jstree-operate\"><a name=\"del\" title=\"DELETE\"><i class=\"glyphicon glyphicon-trash\"></i></a></div>");
            }
        });

        // 移除hover效果
        $("body").on("mouseleave", "#J_pm_jobname_tree .jstree-anchor", function () {
            $(".jstree-operate").remove();
        });

        // 移除hover效果
        $("body").on("mouseleave", "#J_pm_jobname_my_tree .jstree-anchor", function () {
            $(".jstree-operate").remove();
        });

        // 新增树
        $("#J_pm_jobname_tree").on("click", ".jstree-operate [name=add]", function (e) {
            var params = {};
            e.stopPropagation();
            e.preventDefault();
            params.jobId = $(this).closest(".jstree-anchor").attr("jobid");
            console.log(params);
            showContent.addMyTree(params);
            return false;
        });

        // 删除树
        $("#J_pm_jobname_my_tree").on("click", ".jstree-operate [name=del]", function (e) {
            var params = {};
            e.stopPropagation();
            e.preventDefault();
            params.jobId = $(this).closest(".jstree-anchor").attr("jobid");
            showContent.delMyTree(params);
            return false;
        });
        //搜索问题
        $("body").on("click", "#perform-monitoring #J_pm_jobname_tree_search_btn", function () {
            var params = {
                jobName: $("#perform-monitoring #J_pm_jobname_tree_search").val()
                //清除之前轮询，开启新的轮询
            };clearInterval(showContent.setIntervalLeftBox);
            showContent.getLeftBoxList(params, true);
            showContent.setIntervalLeftBox = setInterval(function () {
                showContent.getLeftBoxList(params, true);
            }, 2000);
        });
        //搜索问题
        $("body").on("click", "#perform-monitoring #J_pm_jobname_my_tree_search_btn", function () {
            var params = {
                jobName: $("#perform-monitoring #J_pm_jobname_my_tree_search").val(),
                info: "focus"
            };
            showContent.getLeftBoxMyList(params, true);
        });
        // 点击选择任务中的任务
        $("body").on("click", "[href=#pm-tab_1_3]", function (e) {
            var checkDom = $("#J_pm_tab3_body .checked");
            var checkArray = [];
            $.each(checkDom, function (index, value) {
                if ($(value).closest("tr").data("params").taskVars) {
                    checkArray.push($(value).closest("tr").data("params").taskVars);
                }
            });

            function uniq(array) {
                var temp = []; //一个新的临时数组
                for (var i = 0; i < array.length; i++) {
                    if (temp.indexOf(array[i]) == -1) {
                        temp.push(array[i]);
                    }
                }
                return temp;
            }
            checkArray = uniq(checkArray.join(",").split(","));
            var params = {};
            params.varInfo = checkArray.join(",");
            $.extend(params, showContent.jobId);
            showContent.variableSetting(params);
        });
        //点击左边的列表的渲染右边详情
        $("body").on("click", "#perform-monitoring  #J_pm_jobname_tree .jstree-children .jstree-children a,#perform-monitoring  #J_pm_jobname_my_tree .jstree-children .jstree-children a", function () {
            clearInterval(showContent.setInterval);
            clearInterval(showContent.timeInterval);

            //清除变量设置
            showContent.handleParams.delAllRow();

            $("#perform-monitoring #pm-add li:eq(0) a").click();

            $("#right-content-table").css({ "display": "block" });
            var jobId = $(this).attr("jobid");
            var batchNo = $(this).attr("batchno");
            var executeFlag = $(this).attr("executeflag");
            saveJobid = jobId;
            saveBatchNo = batchNo;
            var paramsMap = {};
            paramsMap.jobId = jobId;
            var job_detail = {};
            job_detail.jobId = jobId;
            job_detail.batchNo = batchNo;
            $("#J_change_view_job iframe").attr("src", "/ETL/retl-process/monitor.html"); //切换时清空iframe
            //获取table树之前，清空当前树
            $("#J_tableList").jstree('destroy');

            if (batchNo && batchNo !== "null") {
                showContent.getTableData(job_detail, executeFlag);
                $("#J_change_view_job iframe").attr("src", "/ETL/retl-process/monitor.html?jobId=" + jobId + "&batchNo=" + batchNo);
            } else {
                $("#perform-monitoring-table-tree").empty();
                $("#perform-monitoring-table-tree").html('<div id="J_tableList" style="text-align:center;padding:8px 0;">No Data</div>');
            }

            //为R的话，则不会获取RightTopBlock中的内容。所以需要主动获取。
            if (executeFlag === "N" || executeFlag === "null") {
                showContent.getRightTopBoxList(paramsMap);
            }
        });

        //获取批号格式--字典
        $.kingdom.getDict("BATCH_FORMAT", "#BatchNumberFormat");

        //执行任务--获取弹框“执行”的参数

        //点击弹框执行按钮执行任务
        $("body").on("click", ".page-perform-monitoring  #J_perform_task", function () {

            var paramsMap = {};

            //是否强制执行
            paramsMap.isConfirm = $("#pm-tab_1_1 input[name=isConfirm]:checked").val();

            //变量设置->处理作业执行配置信息的相关信息
            if (showContent.handleParams) {
                showContent.handleParams.getData(function (data) {
                    paramsMap.inputVarList = data;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var items = _step.value;

                            delete items.no;
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
                });
            }

            paramsMap.inputVarList = paramsMap.inputVarList.length ? JSON.stringify(paramsMap.inputVarList) : "";

            //选择任务
            if ($("input[name='optionsRadios']:checked").val() === "option1") {
                //从某点开始
                paramsMap.startFrom = JSON.stringify($("#J_pm_tab3_select option:selected").data("params"));
            } else {
                //执行部分任务
                paramsMap.partTaskList = [];
                $.each($("#J_pm_tab3_table input:checked"), function () {
                    if ($(this).closest("tr").data("params")) {
                        paramsMap.partTaskList.push($(this).closest("tr").data("params"));
                    }
                });
                paramsMap.partTaskList = paramsMap.partTaskList.length ? JSON.stringify(paramsMap.partTaskList) : "";
            }

            paramsMap.jobId = showContent.jobId.jobId;

            showContent.performTask(paramsMap);
        });

        //点击开始按钮 执行任务
        $("body").on("click", ".page-perform-monitoring #J_start_task", function () {
            //当前点击按钮的状态
            var currentClass = $(this).find("img").hasClass("current-play");
            var static_ = $(this).find("img").hasClass("static");
            if (currentClass) {
                bootbox.confirm("Confirm to stop", function (result) {
                    if (result) {
                        App.blockUI({
                            boxed: true,
                            message: "processing..."
                        });
                        var currentJobId = showContent.jobId.jobId;
                        var batchNo = $("#circle0").siblings(".circleChart-text").find("div").text();
                        showContent.stopCurrentTask(currentJobId, batchNo);
                    }
                });
                return false;
            } else if (static_) {
                return false;
            } else {
                $("#pm-add").modal("show");
            }
        });

        //点击错误信息，显示错误详情
        $("body").on("click", ".page-perform-monitoring #perform-monitoring-table-tree .execute-error-msg", function () {

            // var errorMsg = showContent.currentMsgCollection[$(this).attr("errorindex")];
            var errorMsg = $(this).attr("msg");
            $("#pg-perform-detail-modal").modal("show");
            $("#pg-perform-detail-modal-msg").html(errorMsg.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'));
        });

        // 改变视图
        $("body").on("click", ".page-perform-monitoring #J_change_view", function () {
            // let checked = $("#perform-monitoring .tab-content .jstree-anchor.jstree-clicked"),
            //     jobId = checked.attr("jobid"),
            //     batchNo = checked.attr("batchno");
            var jobId = saveJobid,
                batchNo = saveBatchNo;
            if (!jobId) {
                return;
            }
            if ($("#J_change_view_table").is(":visible")) {
                $("#J_change_view_table").hide();
                $("#J_change_view_job").show();
                $("#J_change_view_job iframe").attr("src", "/ETL/retl-process/monitor.html?jobId=" + jobId + "&batchNo=" + batchNo);
            } else {
                $("#J_change_view_table").show();
                $("#J_change_view_job").hide();
                //清除iframe中流程轮询
                var iframWindow = $("#perform-monitoring #J_change_view_job iframe")[0].contentWindow;
                iframWindow.clearInterval(iframWindow.setIntervalVarIframe);
            }
        });

        // 执行监控->作业执行配置信息->变量设置 操作
        $("body").on("click", "#perform-monitoring #pm-tab_1_3 [name=oparate]", function () {
            var type = $(this).data("type");
            if (type === "add") {
                showContent.handleParams.addRow();
            } else if (type === "delAll") {
                showContent.handleParams.delAllRow();
            } else if (type === "del") {
                showContent.handleParams.delRow($(this));
            }
        });

        //作业执行配置信息 -> 选择任务 从某点开始、执行部分任务下面的checkbox或select选中时，两者所对应的单选框也被选中
        $("body").on("change", "#perform-monitoring #pm-tab_1_3 input[type=checkbox],#perform-monitoring #pm-tab_1_3 #J_pm_tab3_select", function () {
            $(this).closest(".form-group").find(".radio input")[0].click();
        });

        // 全屏时表格高度
        $("body").on("click", PAGE + " .fullscreen", function () {
            if (!$(this).hasClass("on")) {
                $('#J_change_view_table').css('height', 360);
                $('#J_change_view_job iframe').css('height', 360);
            } else {
                $('#J_change_view_table').css('height', 'calc(100vh - 65px');
                $('#J_change_view_job iframe').css('height', 'calc(100vh - 65px');
            }
        });

        // 全屏时表格高度
        $("body").on("change", PAGE + " [name=\"optionsRadios\"]", function () {
            var v = $(this).val();
            if (v === "option1") {
                $("#J_pm_tab3_select").show();
                $("#J_pm_tab3_table").hide();
            } else {
                $("#J_pm_tab3_select").hide();
                $("#J_pm_tab3_table").show();
            }
        });
    });
    module.exports = init;
});