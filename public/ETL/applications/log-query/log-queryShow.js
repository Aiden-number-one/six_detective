var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(function (require, exports, module) {
    require("assets/js/global/tableTree");
    require("assets/plugins/fullcalendar/fullcalendar.min.js");
    var showContent = {};
    saveJobid = ""; //保存点击左侧树时的任务id
    saveBatchNo = ""; //保存点击左侧树时的任务编号

    showContent._load = function () {
        App.initUniform();
        App.handleDatePickers();
        App.handleDateTimePickers();
        var params = $("#local-data").data("params"); // 首页跳过来
        if (params) {
            showContent.getWorkChart2(params);
            $("#local-data").data("params", "");
        } else {
            showContent.getWorkChart({});
        }
        // 顶部铃铛跳转过来
        //  isJump判断是否是从铃铛跳转过来
        var isJump = sessionStorage.getItem("isJump");
        $("#header_notification_bar").mouseout(); //页面刷新铃铛弹框将会出现
        if (isJump) {
            $("#Id-statistics-cat a:nth-child(2)").click().find("label").addClass("active"); //跳转过来选项卡颜色没有发生改变
            $("#Id-statistics-cat a:nth-child(2)").siblings().find("label").removeClass("active");
            $("#lg-tab_0-2 .collapse-control").click(); //点击高级搜索
            sessionStorage.setItem("isJump", "");
            //获取到当前时间
            (function getCurrentTimeLog() {
                $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_sys_current_date", "v4.0", {}, function (data) {
                    if (data.bcjson.flag === "1" && data.bcjson.items[0]) {
                        var times = data.bcjson.items[0].currentDate;
                        var startDate = times.substring(0, 8);
                        var toDay = startDate.substring(0, 4) + "-" + startDate.substring(4, 6) + "-" + startDate.substring(6, 8);
                        $("#J_lq_tab2_query_form [name=beginDate]").val(toDay + " 00:00:00");
                        $("#J_lq_tab2_query_form [name=endDate]").val(toDay + " 23:59:59");
                        $("#J_lq_tab2_query_form [type=submit]").click();
                    }
                });
            })();
        } else {
            // 获得tab2列表信息
            showContent.getLogBatchList();
        }
        $('#lq-calendar').fullCalendar(showContent.options);
        showContent.getScheduleList();
        showContent.getExecuteFlag();
    };
    // 获取作业图表数据
    showContent.getWorkChart = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_monitor_log_info", "v4.0", params, function (data) {
            var items = data.bcjson.items || data.bcjson;
            showContent.workListFirst = items;
            var xAxis = [],
                series = [],
                flagArr = [],
                legendData = [],
                paramsMap = {
                xAxis: xAxis,
                series: series,
                legendData: legendData
            };
            if (data.bcjson.flag == "1" && items && items.length > 0) {
                // 首次进入默认渲染第一个根柱子的表格数据
                saveJobid = items[0].jobId;
                saveBatchNo = items[0].batchNo;
                $("#grapy_work_name").html(items[0].jobName);
                $("#grapy_batch_no").html(items[0].batchNo);
                showContent.getThirdBoardData(items[0]);
                var paramsMapTable = {};
                paramsMapTable.batchNo = items[0].batchNo;
                paramsMapTable.jobId = items[0].jobId;
                showContent.getScheduleSomeList(paramsMapTable);
                var colorMapping = {
                    S: '#3fc9d5',
                    F: '#F1C40F',
                    R: '#659be0',
                    B: '#ed6b75',
                    N: '#bac3d0'
                };
                showContent.jobNameArr = []; // 存储作业名称，柱状图tooltip显示
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        if (!flagArr[item.executeFlag]) {
                            flagArr[item.executeFlag] = {};
                            var option = {
                                executeFlag: item.executeFlag,
                                name: item.executeFlagName,
                                type: 'bar',
                                stack: "Time",
                                // barGap: 0,
                                label: {},
                                data: [],
                                //配置样式
                                itemStyle: {
                                    normal: {
                                        color: colorMapping[item.executeFlag]
                                    }
                                }
                            };
                            series.push(option);
                            legendData.push(item.executeFlagName);
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

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _item = _step2.value;

                        showContent.jobNameArr.push('【' + _item.batchNo + '】' + _item.jobName);
                        xAxis.push($.kingdom.toDateTime(_item.endTime));
                        if (flagArr[_item.executeFlag]) {
                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = series[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var serie = _step3.value;

                                    if (_item.executeFlag == serie.executeFlag) {
                                        serie.data.push(_item.duration / 1000 || 0);
                                    } else {
                                        serie.data.push("-");
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

                showContent.createWorkGraph(paramsMap);
            } else {
                $("#work_log_grapy").html("<span style='margin-left:410px'>No Data</span>");
            }
        });
    };
    // 初始化柱状图
    showContent.createWorkGraph = function (params) {

        var myChart = echarts.init(document.getElementById('work_log_grapy'));
        // var app = {};
        // var labelOption = {

        // };
        var option = {
            title: {
                text: 'Schedule Log Analysis[Click the bar to view the detail]',
                left: 10,
                textStyle: {
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function formatter(params) {
                    var tar = { dataIndex: 0, seriesName: '', name: '', value: '' };
                    for (var i = 0; i < params.length; i++) {
                        if (params[i].value != "-") {
                            tar = params[i];
                        }
                    }
                    return showContent.jobNameArr[tar.dataIndex] + '<br/>' + tar.seriesName + '<br/>' + tar.name + ' ： ' + tar.value;
                }
            },
            legend: {
                data: params.legendData,
                top: 30
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                axisTick: { show: false },
                data: params.xAxis
            }],
            yAxis: [{
                type: 'value',
                splitLine: { show: false },
                axisLabel: { formatter: '{value} s' }
            }],
            dataZoom: [{
                type: 'inside',
                xAxisIndex: [0],
                start: 0,
                end: 10
            }, {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100
            }],
            series: params.series
        };
        // debugger;
        myChart.setOption(option);
        window.onresize = myChart.resize;
        myChart.on("click", function (params) {
            var paramsMap = {};
            var jobName = "";
            $.each(showContent.workListFirst, function (i, item) {
                if ($.kingdom.toDateTime(item.endTime) == params.name) {
                    paramsMap.batchNo = item.batchNo;
                    paramsMap.jobId = item.jobId;
                    jobName = item.jobName;
                    showContent.getThirdBoardData(item);
                    saveJobid = item.jobId;
                    saveBatchNo = item.batchNo;
                }
            });

            showContent.getWorkChart2(paramsMap);
            showContent.tab1SearchParamsCurrent = paramsMap;
            showContent.getScheduleSomeList($.extend({ pageNumber: "1" }, showContent.tab1SearchParamsCurrent));
            $("#grapy_work_name").html(jobName);
            $("#grapy_batch_no").html(paramsMap.batchNo);
        });
    };

    // 点击柱状后的图表
    showContent.getWorkChart2 = function (params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_current_job_monitor_log_info", "v4.0", params, function (data) {
            var items = data.bcjson.items || data.bcjson;
            showContent.workListSecond = items;
            var xAxis = [],
                series = [],
                flagArr = [],
                legendData = [],
                paramsMap = {
                xAxis: xAxis,
                series: series
            };
            if (data.bcjson.flag == "1" && items && items.length > 0) {

                var colorMapping = {
                    S: '#3fc9d5',
                    F: '#F1C40F',
                    R: '#659be0',
                    B: '#ed6b75',
                    N: '#bac3d0'
                };
                showContent.jobNameArr = []; // 存储作业名称，柱状图tooltip显示
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var item = _step4.value;

                        if (!flagArr[item.executeFlag]) {
                            flagArr[item.executeFlag] = {};
                            var option = {
                                executeFlag: item.executeFlag,
                                name: item.executeFlagName,
                                type: 'bar',
                                stack: 'Count',
                                // barGap: 0,
                                label: {},
                                data: [],
                                //配置样式
                                itemStyle: {
                                    normal: {
                                        color: colorMapping[item.executeFlag]
                                    }
                                }
                            };
                            series.push(option);
                            legendData.push(item.executeFlagName);
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

                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var _item2 = _step5.value;

                        showContent.jobNameArr.push('【' + _item2.batchNo + '】' + _item2.jobName);
                        xAxis.push(_item2.nodeName);
                        if (flagArr[_item2.executeFlag]) {
                            var _iteratorNormalCompletion6 = true;
                            var _didIteratorError6 = false;
                            var _iteratorError6 = undefined;

                            try {
                                for (var _iterator6 = series[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                    var serie = _step6.value;

                                    if (_item2.executeFlag == serie.executeFlag) {
                                        serie.data.push(_item2.duration / 1000 || 0);
                                    } else {
                                        serie.data.push("-");
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

                showContent.createWorkGraph2(paramsMap);
            } else {
                $("#work_log_grapy").html("<span style='margin-left:410px'>No Data</span>");
            }
        });
    };
    // 初始化柱状图2
    showContent.createWorkGraph2 = function (params) {

        var myChart = echarts.init(document.getElementById('work_log_grapy'));
        // var app = {};
        // var labelOption = {

        // };
        var option = {
            title: {
                text: 'Schedule Log Analysis[Click the bar to back]',
                left: 10,
                textStyle: {
                    fontSize: 14
                }
            },
            color: ['#7ccd7c', '#f1b967', '#63b8fd', '#dd6e78'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function formatter(params) {
                    var tar = { dataIndex: 0, seriesName: '', name: '', value: '' };
                    for (var i = 0; i < params.length; i++) {
                        if (params[i].value != "-") {
                            tar = params[i];
                        }
                    }
                    return showContent.jobNameArr[tar.dataIndex] + '<br/>' + tar.seriesName + '<br/>' + tar.name + ' ：  ' + tar.value;
                }
            },
            legend: {
                data: params.legendData,
                top: 30
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                axisTick: { show: false },
                data: params.xAxis
                // data:['2014','2015','2016','2017']
            }],
            yAxis: [{
                type: 'value',
                axisLabel: { formatter: '{value} s' }
            }],
            dataZoom: [{
                show: true,
                start: 0,
                end: 100,
                zoomOnMouseWheel: true
            }],
            series: params.series
        };
        myChart.setOption(option);
        window.onresize = myChart.resize;
        myChart.on("click", function (params) {
            var paramsMap2 = {};
            var jobName = "";
            $.each(showContent.workListSecond, function (i, item) {
                if (item.executeMsg == item.name) {
                    paramsMap2.batchNo = item.batchNo;
                    paramsMap2.jobId = item.jobId;
                    jobName = item.jobName;
                }
            });
            showContent.getWorkChart(paramsMap2);
        });
    };

    // 获取列表
    showContent.getScheduleSomeList = function (params) {
        var paramsMap = params;
        paramsMap.logType = "2";
        $.kingdom.getList({
            apiName: "bayconnect.superlop.get_monitor_log_detail_info",
            apiVision: "v4.0",
            params: paramsMap,
            tableId: "J_lq_tab1_query_table",
            template: "log-query/template/single-job-log-list.handlebars",
            pageSize: "999"
        });
    };

    //tab2
    showContent.getLogBatchList = function (params) {
        var paramsMap = $.extend({}, params);
        var calendarJumpParams = sessionStorage.getItem("calendarJumpParams");
        if (sessionStorage.getItem("calendarJumpParams")) {
            paramsMap = $.extend({}, params, JSON.parse(calendarJumpParams));
        }
        paramsMap.logType = "1";
        $.kingdom.getList({
            apiName: "bayconnect.superlop.get_monitor_log_detail_info",
            apiVision: "v4.0",
            params: paramsMap,
            tableId: "log_batch_query_list",
            pageId: "log_query_pages",
            formName: "J_lq_tab2_query_form",
            template: "log-query/template/log_batch_list.handlebars",
            cb: showContent.getLogBatchList
        });
    };

    showContent.eventStartTime = "";
    showContent.eventEndTime = "";
    showContent.eventCallback = "";
    showContent.eventScheduleId = "";
    showContent.eventExecuteStatus = "";

    showContent.options = {
        header: {
            right: 'prev,next today',
            left: 'title'
            // right: ''
        },
        defaultDate: new Date().Format("yyyy-mm-dd"),
        editable: true,
        monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        eventLimit: false, // allow "more" link when too many events
        eventStartEditable: true,
        dayClick: function dayClick(date, jsEvent, view) {

            console.log('Clicked on: ' + date.format());

            console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

            console.log('Current view: ' + view.name);
        },
        eventClick: function eventClick(event, jsEvent, view) {
            showContent.displayDetail(event);
        },
        eventMouseover: function eventMouseover(event, jsEvent, view) {
            $(this).find('.fc-title').attr('title', $(this).find('.fc-title').html());
        },
        eventDrop: function eventDrop(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
            // 拖动某个日程到新位置时，日程时间改变，此处可做相关处理
            console.log(event + dayDelta + minuteDelta + allDay + revertFunc + jsEvent + ui + view);
        },
        // events:JSON.parse(itemString)
        events: function events(start, end, timezone, callback) {
            var startFomateDate = start._d.getFullYear().toString() + (start._d.getMonth() + 1 < 10 ? "0" + (start._d.getMonth() + 1) : start._d.getMonth() + 1) + (start._d.getDate() < 10 ? "0" + start._d.getDate() : start._d.getDate());

            var endFomateDate = end._d.getFullYear().toString() + (end._d.getMonth() + 1 < 10 ? "0" + (end._d.getMonth() + 1) : end._d.getMonth() + 1) + (end._d.getDate() < 10 ? "0" + end._d.getDate() : end._d.getDate());

            showContent.eventStartTime = startFomateDate;
            showContent.eventEndTime = endFomateDate;
            showContent.eventCallback = callback;

            var paramsMap = {};
            paramsMap.startTime = startFomateDate;
            paramsMap.endTime = endFomateDate;
            paramsMap.scheduleId = showContent.eventScheduleId;
            paramsMap.executeFlag = showContent.eventExecuteStatus;
            showContent.requestScheduleCalendarInfo(paramsMap);
        }
    };

    //获取日历信息详情（第三tab页）
    showContent.requestScheduleCalendarInfo = function (paramsMap, isSelect) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_schedule_calendar_info", "v4.0", paramsMap, function (data) {
            if (data.bcjson.flag === "1") {
                var optionData = [];
                var items = data.bcjson.items || [];
                if (items.length > 0) {
                    $.each(items, function (i, value) {
                        var scheduleInfo = value.scheduleInfo;
                        if (scheduleInfo.length !== 0) {
                            var typeS = 0,
                                arrayS = []; //成功执行
                            var typeF = 0,
                                arrayF = []; //出错完成
                            var typeB = 0,
                                arrayB = []; //出错中断
                            $.each(scheduleInfo, function (scheduleInfoIndex, singleValue) {
                                if (singleValue['executeFlag'] == "B") {
                                    typeB++;
                                    arrayB.push(singleValue);
                                } else if (singleValue['executeFlag'] == "F") {
                                    typeF++;
                                    arrayF.push(singleValue);
                                } else if (singleValue['executeFlag'] == "S") {
                                    typeS++;
                                    arrayS.push(singleValue);
                                }
                            });
                            if (typeS !== 0) {
                                optionData.push({
                                    start: value.scheduleDate,
                                    end: value.scheduleDate,
                                    title: "Succeed(" + typeS + ")",
                                    currentAllData: arrayS,
                                    className: "success-complete"
                                });
                            }
                            if (typeF !== 0) {
                                optionData.push({
                                    start: value.scheduleDate,
                                    end: value.scheduleDate,
                                    title: "Error completed(" + typeF + ")",
                                    currentAllData: arrayF,
                                    className: "error-complete"
                                });
                            }
                            if (typeB !== 0) {
                                optionData.push({
                                    start: value.scheduleDate,
                                    end: value.scheduleDate,
                                    title: "Error Interrupt(" + typeB + ")",
                                    currentAllData: arrayB,
                                    className: "error-suspend"

                                });
                            }
                        }
                    });
                }
            }
            if (isSelect) {
                $('#lq-calendar').fullCalendar('refetchEvents');
            } else {
                showContent.eventCallback(optionData);
            }
        });
    };

    //调度计划select具体列表（第三tab页）
    showContent.getScheduleList = function () {
        var paramsMap = { "pageNumber": "1", "pageSize": "999" };
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_schedule_info", "v4.0", paramsMap, function (data) {
            if (data.bcjson.flag === "1") {
                var items = data.bcjson.items || [];
                if (items.length > 0) {
                    var scheduleList = "";
                    $.each(items, function (index, value) {
                        scheduleList = scheduleList + "<div style='padding: 4px 12px' scheduleId='" + value.scheduleId + "'>" + value.scheduleName + "</div>";
                    });
                    $("#lg-schedule-list-menu-calendar").html(scheduleList);
                }
            }
        });
    };

    //获取执行状态具体列表（第三tab页）
    showContent.getExecuteFlag = function () {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_dict_data_list", "v4.0", {}, function (data) {
            if (data.bcjson.flag === "1") {
                var items = data.bcjson.items || [];
                var EXECUTE_FLAG = items[0]['EXECUTE_FLAG'];
                if (EXECUTE_FLAG) {
                    var flagList = "";
                    $.each(EXECUTE_FLAG, function (index, value) {
                        if (index === "B" || index === "F" || index == "S") {
                            flagList = flagList + "<div style='padding: 4px 12px;' flagId='" + index + "'>" + value + "</div>";
                        }
                    });
                    $("#lg-flag-list-menu-calendar").html(flagList);
                }
            }
        });
    };

    showContent.displayDetail = function (event) {
        var startTimeStr = '';
        if (event.currentAllData.length > 0) {
            startTimeStr = event.currentAllData[0].startTimeStr;
        }
        var params = App.getFormParams("J_lq_tab2_query_form");
        var startTime = startTimeStr.substring(0, 4) + "-" + startTimeStr.slice(4, 6) + "-" + startTimeStr.slice(6, 8) + " " + "00:00:00";
        var endTime = startTimeStr.substring(0, 4) + "-" + startTimeStr.slice(4, 6) + "-" + startTimeStr.slice(6, 8) + " " + "23:59:00";
        $("#J_lq_tab2_query_form input[name=beginDate]").val(startTime);
        $("#J_lq_tab2_query_form input[name=endDate]").val(endTime);
        $("#Id-statistics-cat [href=#lg-tab_0-2]").click().find("label").addClass("active");
        $("#Id-statistics-cat [href=#lg-tab_0-3]").find("label").removeClass("active");
        $("#lg-tab_0-2 div[href=#J_lq_tab2_query_block]").click();
        var calendarJumpParams = $.extend({ "executeFlagName": event.currentAllData[0].executeFlagName }, { "executeType": "A" });
        sessionStorage.setItem("calendarJumpParams", JSON.stringify(calendarJumpParams));
        showContent.getLogBatchList($.extend(params, calendarJumpParams));
        // $("#J_calendar_detail_modal").modal("show");
        // require.async("template/log_batch_list.handlebars", compiled => {
        //     $("#log_batch_query_list tbody").html(compiled(event.currentAllData));
        // })
    };
    function formart1(name, executeFlag) {
        var color;
        if (executeFlag === 'B') {
            color = '#ed6b75';
        } else if (executeFlag === "R") {
            color = '#659be0';
        } else if (executeFlag === "S") {
            color = '#3fc9d5';
        } else if (executeFlag === "F") {
            color = '#F1C40F';
        } else if (executeFlag === "N") {
            color = '#bac3d0';
        }
        return "<span style=\"color:" + color + "\">" + name + "</span>";
    }

    function formart3(nodeName, executeFlag, executeMsg) {
        return "<span style=\"margin-right: 10px;\" title='" + nodeName + "' >" + nodeName + ("F,B".includes(executeFlag) ? "<i class='fa fa-info-circle' title='" + executeMsg.substring(0, 100) + "'></i>" : "") + "</span>";
    }
    function formart2(executeMsg) {
        return "<span class=\"execute-error-msg\" msg='" + executeMsg.replace(/\'/g, "\"") + "' style=\"color:#3fc9d5;cursor:pointer;\">" + executeMsg.substring(0, 100) + "</span>";
    }
    // 将数据格式转化成tabletree需要的数据
    function gene(items) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            var _loop = function _loop() {
                var item = _step7.value;

                if (!item.parentMonitorId) {
                    var data = [{
                        id: item.monitorId,
                        pId: "-1",
                        columns: {
                            "Task Sequence No.": item.orderNo,
                            "Node": {
                                formatter: function formatter() {
                                    return formart3(item.nodeName, item.executeFlag, item.executeMsg);
                                }
                            },
                            "Task Name": item.jobname,
                            "Task Type": item.memberTypeName,
                            "Delete Count": item.deleteNum,
                            "Insert Count": item.insertNum,
                            "Start Time": $.kingdom.toDateTime(item.startTime),
                            "Duration": $.kingdom.formatMillisecond(item.zxsj),
                            "Execution Status": {
                                formatter: function formatter() {
                                    return formart1(item.executeFlagName, item.executeFlag);
                                }
                            },
                            "Execution Info.(Click to view all Info.)": {
                                formatter: function formatter() {
                                    return formart2(item.executeMsg);
                                }
                            }
                        },
                        children: []
                    }];
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        var _loop4 = function _loop4() {
                            var item1 = _step8.value;

                            if (item1.parentMonitorId === item.monitorId) {
                                var obj = {
                                    id: item1.monitorId,
                                    pId: item1.parentMonitorId,
                                    attr: {
                                        obj: JSON.stringify(item1)
                                    },
                                    columns: {
                                        "Task Sequence No.": item1.orderNo,
                                        "Node": {
                                            formatter: function formatter() {
                                                return formart3(item1.nodeName, item1.executeFlag, item1.executeMsg);
                                            }
                                        },
                                        "Task Name": item1.jobname,
                                        "Task Type": item1.memberTypeName,
                                        "Delete Count": item1.deleteNum,
                                        "Insert Count": item1.successNum,
                                        "Start Time": $.kingdom.toDateTime(item1.startTime),
                                        "Duration": $.kingdom.formatMillisecond(item1.zxsj),
                                        "Execution Status": {
                                            formatter: function formatter() {
                                                return formart1(item1.executeFlagName, item1.executeFlag);
                                            }
                                        },
                                        "Execution Info.(Click to view all Info.)": {
                                            formatter: function formatter() {
                                                return formart2(item1.executeMsg);
                                            }
                                        }
                                    },
                                    children: []
                                };
                                data[0].children.push(obj);
                            }
                        };

                        for (var _iterator8 = items[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            _loop4();
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

                    var children = data[0].children;
                    for (var i = 0, len = children.length; i < len; i++) {
                        var _iteratorNormalCompletion9 = true;
                        var _didIteratorError9 = false;
                        var _iteratorError9 = undefined;

                        try {
                            var _loop2 = function _loop2() {
                                var item2 = _step9.value;

                                if (item2.parentMonitorId === children[i].id) {
                                    var obj = {
                                        id: item2.monitorId,
                                        pId: item2.parentMonitorId,
                                        attr: {
                                            obj: JSON.stringify(item2)
                                        },
                                        columns: {
                                            "Task Sequence No.": item2.orderNo,
                                            "Node": {
                                                formatter: function formatter() {
                                                    return formart3(item2.nodeName, item2.executeFlag, item2.executeMsg);
                                                }
                                            },
                                            "Task Name": item2.jobname,
                                            "Task Type": item2.memberTypeName,
                                            "Delete Count": item2.deleteNum,
                                            "Insert Count": item2.successNum,
                                            "Start Time": $.kingdom.toDateTime(item2.startTime),
                                            "Duration": $.kingdom.formatMillisecond(item2.zxsj),
                                            "Execution Status": {
                                                formatter: function formatter() {
                                                    return formart1(item2.executeFlagName, item2.executeFlag);
                                                }
                                            },
                                            "Execution Info.(Click to view all Info.)": {
                                                formatter: function formatter() {
                                                    return formart2(item2.executeMsg);
                                                }
                                            }
                                        },
                                        children: []
                                    };
                                    data[0].children[i].children.push(obj);
                                }
                            };

                            for (var _iterator9 = items[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                _loop2();
                            }
                            /**
                                * @description: 第四级数据
                                * @param {type} 
                                * @return: 
                                * @Author: xiaojun
                                * @Date: 2019-06-25 14:57:00
                                */
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

                        var children1 = data[0].children[i].children;
                        var _iteratorNormalCompletion10 = true;
                        var _didIteratorError10 = false;
                        var _iteratorError10 = undefined;

                        try {
                            var _loop3 = function _loop3() {
                                var item3 = _step10.value;

                                for (var j = 0, _len = children1.length; j < _len; j++) {
                                    if (item3.parentMonitorId === children1[j].id) {
                                        var obj = {
                                            id: item3.monitorId,
                                            pId: item3.parentMonitorId,
                                            attr: {
                                                obj: JSON.stringify(item3)
                                            },
                                            columns: {
                                                "Task Sequence No.": item3.orderNo,
                                                "Node": {
                                                    formatter: function formatter() {
                                                        return formart3(item3.nodeName, item3.executeFlag, item3.executeMsg);
                                                    }
                                                },
                                                "Task Name": item3.jobname,
                                                "Task Type": item3.memberTypeName,
                                                "Delete Count": item3.deleteNum,
                                                "Insert Count": item3.successNum,
                                                "Start Time": $.kingdom.toDateTime(item3.startTime),
                                                "Duration": $.kingdom.formatMillisecond(item3.zxsj),
                                                "Execution Status": {
                                                    formatter: function formatter() {
                                                        return formart1(item3.executeFlagName, item3.executeFlag);
                                                    }
                                                },
                                                "Execution Info.(Click to view all Info.)": {
                                                    formatter: function formatter() {
                                                        return formart2(item3.executeMsg);
                                                    }
                                                }
                                            },
                                            children: []
                                        };
                                        data[0].children[i].children[j].children.push(obj);
                                    }
                                }
                            };

                            for (var _iterator10 = items[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                                _loop3();
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
                    return {
                        v: data
                    };
                }
            };

            for (var _iterator7 = items[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var _ret = _loop();

                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
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
    }
    //获取大框table的数据
    showContent.getTableData = function (params) {
        $('#bottom-content-table').show();
        var paramsMap = $.extend({}, params);
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_detail_flow_info", "v4.0", paramsMap, function (data) {
            // console.log(data);
            var items = data.bcjson.items || data.bcjson;
            if (data.bcjson.flag == "1") {
                $("#J_tableList").jstree('destroy');
                if (items.length > 0) {
                    showContent.currentMsgCollection = {};
                    //存放错误信息
                    $.each(items, function (index, item) {
                        showContent.currentMsgCollection[index] = item.executeMsg;
                        item['errorIndex'] = index;
                    });
                    var data_ = gene(items);
                    $("#log-query-table-tree").tableTree({
                        data: data_
                    });
                    var a = $("#log-query-table-tree").tableTree({
                        widthScale: 2,
                        data: data_
                    });
                    a.openNode($('[pkey="-1"]').attr('key'));
                    // if (executeFlag === "R") {

                    //     showContent.preTableData = [];

                    //     //执行中状态，所有的叶子节点，若无执行结果的状态则，给与display none
                    //     if ($("#log-query-table-tree .jstree-leaf").length > 1) {
                    //         $("#log-query-table-tree .jstree-leaf").css("display", "none");
                    //     }

                    //     showContent.updateTableData(paramsMap);
                    //     showContent.setInterval = setInterval(function() {
                    //         showContent.updateTableData(paramsMap);
                    //     }, 3000)
                    // }
                } else {
                    $('#J_tableList').html("<image src='assets/img/nonedata.png'/>").css('text-align', "center");
                }
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };
    /**
                * @param {Object} items - 渲染所需要的数据源
                * @param {Object} param - 查询新的数据源所需要的参数
                * @param {Bool} isClickPie - 是否通过点击右边图中的圆形Echart而加载
                */
    showContent.getThirdBoardData = function (item) {
        var paramsMap = {};
        paramsMap.batchNo = item.batchNo;
        paramsMap.jobId = item.jobId;
        showContent.getTableData(paramsMap);
        require.async("./template/perform-rightMiddle-tast.handlebars", function (compiled) {
            $(".page-log-query #right-content-middle-tast").html(compiled([item]));
        });
    };
    module.exports = showContent;
});