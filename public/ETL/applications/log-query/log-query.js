define(function (require, exports, module) {
	var showContent = require("theme/log-query/log-queryShow");
	require("plugins/jquery-validation/js/jquery.validate");
	require("plugins/jstree/dist/jstree");
	require("plugins/jstree/dist/themes/default/style.css");

	var init = {
		load: function () {
			showContent._load(); //加载页面数据
		}
	};
	$(function () {

		//主动点开计划执行日历
		$("body").on("click", "#log-query a[href='#lg-tab_0-3']", function () {
			setTimeout(function () {
				if ($("#lg-tab_0-3 .fc-view-container .fc-basic-view").length === 0) {
					$('#lq-calendar').fullCalendar("today");
				}
			}, 0);
		});

		// tab1,2
		//点击错误信息，显示错误详情
		$("body").on("click", "#log_batch_query_list .executeMsg,#J_lq_tab1_query_table .executeMsg", function () {
			$("#lg-perform-detail-modal").modal("show");
			$("#lg-perform-detail-modal-msg").html($(this).html().replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'));
		});

		//对tab1页面的搜索管理
		//option
		$("body").on("change", "#J_lq_tab1_query_form select[name='queryType']", function () {
			$("#J_lq_tab1_query_form input[name='batchNo'],#J_lq_tab1_query_form input[name='jobName']").toggleClass("hide").val("");
		});

		//搜索功能
		$("body").on("click", "#J_lq_tab1_query_form button[type='submit']", function () {
			if(!App.checkDate($('#J_lq_tab1_query_form'), "执行时间")){
				return false;
			}
			var params = App.getFormParams("J_lq_tab1_query_form");
			delete params.queryType;
			params.beginDate = $.kingdom.clearDateFormat(params.beginDate);
			params.endDate = $.kingdom.clearDateFormat(params.endDate);
			showContent.getWorkChart(params);
		});

		//对tab2页面的搜索管理

		//option
		$("body").on("change", "#J_lq_tab2_query_form select[name='queryType']", function () {
			$("#J_lq_tab2_query_form input[name='batchNo'],#J_lq_tab2_query_form input[name='jobName']").toggleClass("hide").val("");
		});
		//搜索功能
		$("body").on("click", "#J_lq_tab2_query_form button[type='submit']", function () {
			// 由于tab3点击过来时查询需要清除sessionStorage
			sessionStorage.removeItem("calendarJumpParams");
			if(!App.checkDate($('#J_lq_tab2_query_form'), "操作时间")){
				return false;
			}
			var params = App.getFormParams("J_lq_tab2_query_form");
			delete params.queryType;
			params.beginDate = $.kingdom.clearDateFormat(params.beginDate);
			params.endDate = $.kingdom.clearDateFormat(params.endDate);
			showContent.getLogBatchList(params);
		});
		$(window).bind('hashchange', function() {
				// 由于tab3点击过来时切换页面需要清除sessionStorage
				sessionStorage.removeItem("calendarJumpParams");
			});
		  //点击错误信息，显示错误详情
		  $("body").on("click", ".page-log-query #log-query-table-tree .execute-error-msg", function() {

            // var errorMsg = showContent.currentMsgCollection[$(this).attr("errorindex")];
            let errorMsg = $(this).attr("msg");
            $("#pg-log-query-detail-modal").modal("show");
            $("#pg-log-query-detail-modal-msg").html(errorMsg.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'));
		});
		 // 改变视图
		 $("body").on("click", ".page-log-query #J_change_view_log_query", function() {
            // let checked = $("#perform-monitoring .tab-content .jstree-anchor.jstree-clicked"),
            //     jobId = checked.attr("jobid"),
            //     batchNo = checked.attr("batchno");
            let jobId = saveJobid,
                batchNo = saveBatchNo;
            if (!jobId) {
                return;
            }
            if ($("#J_change_view_log_table1").is(":visible")) {
                $("#J_change_view_log_table1").hide();
                $("#J_change_view_log_job").show();
                $("#J_change_view_log_job iframe").attr("src", "/retl-process/monitor.html?jobId=" + jobId + "&batchNo=" + batchNo);

            } else {
                $("#J_change_view_log_table1").show();
                $("#J_change_view_log_job").hide();
                //清除iframe中流程轮询
                var iframWindow = $("#J_change_view_log_job iframe")[0].contentWindow
                iframWindow.clearInterval(iframWindow.setIntervalVarIframe);
            }
        });

		//对tab3页面的搜索管理

		//点击搜索
		$("body").on("click", "#lq_calendar_modal_search_form button[type='submit']", function () {
			//获取已经选取的调度计划，并存到公共中
			var scheduleId = "";
			$.each($("#lg-schedule-list-menu-calendar .title-color-blue"), function (index, value) {
				scheduleId = scheduleId + $(value).attr("scheduleid") + ",";
			});
			if (!scheduleId) {
				scheduleId = scheduleId.substring(0, scheduleId.length - 1);
			}
			showContent.eventScheduleId = scheduleId;

			//获取已经选取的执行状态，并存到公共中
			var flagId = "";
			$.each($("#lg-flag-list-menu-calendar .title-color-blue"), function (index, value) {
				flagId = flagId + $(value).attr("flagid") + ",";
			});
			if (flagId) {
				flagId = flagId.substring(0, flagId.length - 1);
			}
			showContent.eventExecuteStatus = flagId;
			var paramsMap = {
				startTime: showContent.eventStartTime,
				endTime: showContent.eventEndTime,
				scheduleId: showContent.eventScheduleId,
				executeFlag: showContent.eventExecuteStatus,
			};
			showContent.requestScheduleCalendarInfo(paramsMap, true);
		});

		//点击重置
		$("body").on("click", "#lq_calendar_modal_search_form button[type='reset']", function () {
			$("#lg-schedule-list-menu-calendar div,#lg-flag-list-menu-calendar div").removeClass("title-color-blue")
		});

		//两个搜索框的多选处理
		$("body").on("click", "#lg-schedule-list-menu-calendar div,#lg-flag-list-menu-calendar div", function (e) {
			$(this).toggleClass("title-color-blue");

			var selectString = "";
			//得出class为title-color-blue的div，则拼成字符串

			var id = $(this).closest(".dropdown-menu").attr("id")

			$.each($("#" + id + " div"), function (index, value) {
				if ($(value).attr("class") === "title-color-blue") {
					selectString = selectString + $(value).text() + ",";
				}
			});
			$("#" + id).siblings("input").val(selectString);
		});



	})

	module.exports = init;
})