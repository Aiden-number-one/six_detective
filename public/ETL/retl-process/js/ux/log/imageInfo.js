var heights = 390;
var condition = "1=1";
var ids = 0;
// -------------------新版页面代码 start 20170503----------
$(function () {
	initSearchData(); //加载查询条件
	initDataGrid('');
	showdataGrid(condition);
	// datagrid跟随浏览器调整大小
	$(window).resize(function () {
		$("#m-graph-wrap").height($(window).height() - heights);
		$('#data_list').datagrid('resize', {
			width: $("#m-imageInfo").width() - 15,
			height: $(window).height() - heights
		});
	});
	$('#ril').unbind('click').click(function () {
		$(location).attr('href', getRealPath() + "/task/cale.action");
	});

	// 柱形图页面跳转
	$('#tx').unbind('click').click(function () {
		$(location).attr('href', getRealPath() + "/tbDiMonitorLog/imageInfo.action");
	});
	//展开
	$("#Stop_s").click(function () {
		$("#formSearch").addClass('shrink_bottom').removeClass('shrink_screen_where');
		heights = heights + 77;
		$("#m-graph-wrap").height($(window).height() - heights - 10);
		$('#data_list').datagrid('resize', {
			width: $("#m-imageInfo").width() - 15,
			height: $(window).height() - heights
		});
	});
	//折叠
	$("#Stop_x").click(function () {
		$("#formSearch").addClass('shrink_screen_where').removeClass('shrink_bottom');
		heights = heights - 77;
		$("#m-graph-wrap").height($(window).height() - heights - 10);
		$('#data_list').datagrid('resize', {
			width: $("#m-imageInfo").width() - 15,
			height: $(window).height() - heights
		});
	});
});

function forChart(data) {
	// 基于准备好的dom，初始化echarts实例
	var dom = document.getElementById('main');
	var myChart = echarts.init(dom);
	myChart.clear();
	myChart.hideLoading();
	var dlength = data.data.length;
	var startInfo;
	if (dlength > 9) {
		startInfo = (dlength - 9) / dlength * 100; // 设置默认显示10条数据的位置
	} else {
		startInfo = dlength;
	}
	if (data.data != null && dlength > 0) {
		$("#_tips").html("[点击柱图下钻]");
		// 元数据处理，e.g. metadata.init().xxx
		var metadata = {
			flag: true,
			quarter: [],
			xinfo: [],
			ySuccessinfo: [],
			yErrorinfo: [],
			yRinfo: [],
			yOtherinfo: [],
			yinfo: [],
			x_major_offset: dlength,
			testInfo: [], // 自定义参数数据，存储了executorId字段信息
			jobNos: [],
			jobNames: [],
			init: function init() {
				// 首次初始化
				if (metadata.flag) {
					// 数据遍历
					for (var i = 0; i < dlength; i++) {
						// if(i<2){
						// debugger;
						if (i == 0) {
							metadata.quarter.push(data.data[i]);
						} else {
							// 与子分类列匹配
							metadata.quarter.push(data.data[i - 1] === data.data[i] ? '' : data.data[i]);
						}
						// Y数据中每一个类型的个数都需要和X中的个数相对应，否则数据无法正确匹配，
						// 因此分类型的Y轴数据不能用push赋值，需要对应i进行赋值 wfy 20170512
						// 数组显示赋空值时，不能为0，可以设置为-
						// console.log(data.data[i]);
						var executeFlag = data.data[i].executeFlagId;
						if (executeFlag == "S") {
							metadata.yRinfo[i] = '-';
							metadata.yErrorinfo[i] = '-';
							metadata.yOtherinfo[i] = '-';
							metadata.ySuccessinfo[i] = data.data[i].duration;
							metadata.testInfo[i] = data.data[i].executorId;
						} else if (executeFlag == "F") {
							metadata.yRinfo[i] = '-';
							metadata.yErrorinfo[i] = data.data[i].duration;
							metadata.yOtherinfo[i] = '-';
							metadata.ySuccessinfo[i] = '-';
							metadata.testInfo[i] = data.data[i].executorId;
						} else if (executeFlag == "R" || executeFlag == "E") {
							metadata.yRinfo[i] = data.data[i].duration;
							metadata.yErrorinfo[i] = '-';
							metadata.yOtherinfo[i] = '-';
							metadata.ySuccessinfo[i] = '-';
							metadata.testInfo[i] = data.data[i].executorId;
						} else if (executeFlag == "B" || executeFlag == "I") {
							metadata.yRinfo[i] = '-';
							metadata.yErrorinfo[i] = '-';
							metadata.yOtherinfo[i] = data.data[i].duration;
							metadata.ySuccessinfo[i] = '-';
							metadata.testInfo[i] = data.data[i].executorId;
						}
						metadata.jobNos[i] = data.data[i].jobNo;
						metadata.jobNames[i] = data.data[i].jobName;
						metadata.xinfo.push(data.data[i].batchNo);
						metadata.x_major_offset = metadata.x_major_offset > data.data[i].length ? metadata.x_major_offset : data.data[i].length;
					}
					metadata.flag = false;
				}
				return metadata;
			}
		};
		// 指定图表的配置项和数据
		var option = {
			tooltip: {
				trigger: 'item',
				formatter: function formatter(params) {
					var res = '【' + metadata.init().jobNos[params.dataIndex] + '】' + metadata.init().jobNames[params.dataIndex] + '<br/>' + params.seriesName + '<br/>' + params.name + ' : ' + params.value;
					return res;
				}
			},
			// 是否启用拖拽重计算特性，默认关闭(即值为false)
			calculable: true,
			legend: {
				// legend的data: 用于设置图例，data内的字符串数组需要与sereis数组内每一个series的name值对应
				data: ['成功完成', '出错完成', '执行中', '中断']
			},
			xAxis: {
				type: 'category',
				show: true,
				//				inverse :true,
				data: metadata.init().xinfo
			},
			yAxis: {
				// name:"执行时长：(秒)",
				show: true,
				axisLabel: { // 显示格式化
					formatter: '{value} s'
				}
			},
			//			startInfo = dlength;
			dataZoom: [{
				show: true,
				start: startInfo, // 数据窗口范围的起始百分比
				end: 100
			}, {
				type: 'inside',
				start: 94,
				end: 100
			}, {
				show: false, // Y轴拖拽是否显示问题，如果为true则显示
				yAxisIndex: 0,
				filterMode: 'empty',
				width: 30,
				height: '100%', // 可以影响拖拽时显示的个数
				showDataShadow: false,
				left: '93%'
			}],
			// 用于设置图表数据之
			series: [{
				name: '成功完成',
				type: 'bar',
				stack: '状态',
				barWidth: 35, // 柱图宽度
				barGap: '20%', // 两个柱型之间的距离
				barMinHeight: 10,
				itemStyle: { // 系列级个性化
					normal: {
						color: '#7CCD7C' // 鼠标以及上侧方框显示颜色
					}
				},
				data: metadata.init().ySuccessinfo,
				rawdate: metadata.init().testInfo
				// 添加了rawdate参数（自定义的）
			}, {
				name: '出错完成',
				type: 'bar',
				stack: '状态',
				barWidth: 35,
				barGap: '20%',
				barMinHeight: 10,
				itemStyle: {
					normal: {
						barBorderColor: '#f2b968',
						color: '#f2b968'
					}
				},
				data: metadata.init().yErrorinfo,
				rawdate: metadata.init().testInfo
				// 添加了rawdate参数（自定义的）
			}, {
				name: '执行中',
				type: 'bar',
				stack: '状态',
				barWidth: 35,
				barGap: '20%',
				barMinHeight: 10,
				itemStyle: {
					normal: {
						barBorderColor: '#63B8FF', // --蓝色
						color: '#63B8FF'
					}
				},
				data: metadata.init().yRinfo,
				rawdate: metadata.init().testInfo
				// 添加了rawdate参数（自定义的）
			}, {
				name: '中断',
				type: 'bar',
				stack: '状态',
				barWidth: 35,
				barGap: '20%',
				barMinHeight: 10,
				itemStyle: {
					normal: {
						color: '#dd6e78'
					}
				},
				data: metadata.init().yOtherinfo,
				rawdate: metadata.init().testInfo
				// 添加了rawdate参数（自定义的）
			}]
		};
		// option.series[param.seriesIndex].rawdate[param.dataIndex];
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		myChart.on('click', function (param) {
			var cloudid;
			if (typeof param.seriesIndex != 'undefined') {
				cloudid = option.series[param.seriesIndex].rawdate[param.dataIndex];
				// 查询日志信息
				$("#jkjginfo1").html('作业名称：【' + metadata.init().jobNos[param.dataIndex] + '】' + metadata.init().jobNames[param.dataIndex]);
				$("#jkjg-st").html("执行批次：" + param.name);
				showLogInfo(cloudid, param.name);
				$(".s-svg g g g").remove();
				init_graph(cloudid, param.name); // 调用画布信息
				//					var win = $.messager.progress({
				//						title : '请稍后',
				//						msg : '正在加载中...',
				//					});
			}
			var data = {};
			data.executorId = cloudid;
			data.batchNo = param.name;
			$.ajax({
				type: "post",
				dataType: 'json',
				data: data,
				url: "tbDiMonitorLog/searchByexecutorId2.action",
				success: function success(data) {
					// echarts 钻取（DrillDown）
					forChart2(data);
				}
			});
		});
	}
}

function forChart2(data) {
	// 基于准备好的dom，初始化echarts实例
	var dom = document.getElementById('main');
	var myChart = echarts.init(dom);
	myChart.clear();
	myChart.hideLoading();
	var dlength = data.data.length;
	if (data.data != null && dlength > 0) {
		$("#_tips").html("[点击柱图返回]");
		// 元数据处理，e.g. metadata.init().xxx
		var metadata = {
			flag: true,
			quarter: [],
			xinfo: [],
			ySuccessinfo: [],
			yErrorinfo: [],
			yRinfo: [],
			yOtherinfo: [],
			yinfo: [],
			x_major_offset: dlength,
			testInfo: [], // 自定义参数数据，存储了executorId字段信息
			jobNos: [],
			jobNames: [],
			init: function init() {
				// 首次初始化
				if (metadata.flag) {
					// 数据遍历
					for (var i = 0; i < dlength; i++) {
						// if(i<2){
						// debugger;
						if (i == 0) {
							metadata.quarter.push(data.data[i]);
						} else {
							// 与子分类列匹配
							metadata.quarter.push(data.data[i - 1] === data.data[i] ? '' : data.data[i]);
						}
						// Y数据中每一个类型的个数都需要和X中的个数相对应，否则数据无法正确匹配，
						// 因此分类型的Y轴数据不能用push赋值，需要对应i进行赋值 wfy 20170512
						// 数组显示赋空值时，不能为0，可以设置为-
						// console.log(data.data[i]);
						var executeFlag = data.data[i].executeFlagId;
						if (executeFlag == "S") {
							metadata.yRinfo[i] = '-';
							metadata.yErrorinfo[i] = '-';
							metadata.yOtherinfo[i] = '-';
							metadata.ySuccessinfo[i] = data.data[i].duration;
						} else if (executeFlag == "F") {
							metadata.yRinfo[i] = '-';
							metadata.yErrorinfo[i] = data.data[i].duration;
							metadata.yOtherinfo[i] = '-';
							metadata.ySuccessinfo[i] = '-';
							metadata.testInfo[i] = data.data[i].executorId;
						} else if (executeFlag == "R" || executeFlag == "E") {
							metadata.yRinfo[i] = data.data[i].duration;
							metadata.yErrorinfo[i] = '-';
							metadata.yOtherinfo[i] = '-';
							metadata.ySuccessinfo[i] = '-';
							metadata.testInfo[i] = data.data[i].executorId;
						} else if (executeFlag == "B" || executeFlag == "I") {
							metadata.yRinfo[i] = '-';
							metadata.yErrorinfo[i] = '-';
							metadata.yOtherinfo[i] = data.data[i].duration;
							metadata.ySuccessinfo[i] = '-';
							metadata.testInfo[i] = data.data[i].executorId;
						}
						metadata.jobNos[i] = data.data[i].jobNo;
						metadata.jobNames[i] = data.data[i].jobName;
						metadata.xinfo.push(data.data[i].nodeName);
						metadata.x_major_offset = metadata.x_major_offset > data.data[i].length ? metadata.x_major_offset : data.data[i].length;
					}
					metadata.flag = false;
				}
				return metadata;
			}
		};
		// 指定图表的配置项和数据
		var option = {
			tooltip: {
				trigger: 'item',
				formatter: function formatter(params) {
					var res = '【' + metadata.init().jobNos[params.dataIndex] + '】' + metadata.init().jobNames[params.dataIndex] + '<br/>' + params.seriesName + '<br/>' + params.name + ' : ' + params.value;
					return res;
				}
			},
			// 是否启用拖拽重计算特性，默认关闭(即值为false)
			calculable: true,
			legend: {
				// legend的data: 用于设置图例，data内的字符串数组需要与sereis数组内每一个series的name值对应
				data: ['成功完成', '出错完成', '执行中', '中断']
			},
			xAxis: {
				type: 'category',
				show: true,
				data: metadata.init().xinfo
			},
			yAxis: {
				// name:"执行时长：(秒)",
				show: true,
				axisLabel: { // 显示格式化
					formatter: '{value} s'
				}
			},
			dataZoom: [{
				show: true,
				start: 0, // 下侧拖拽显示开始位置
				end: 100
			}, {
				type: 'inside',
				start: 94,
				end: 100
			}, {
				show: false, // Y轴拖拽是否显示问题，如果为true则显示
				yAxisIndex: 0,
				filterMode: 'empty',
				width: 30,
				height: '100%', // 可以影响拖拽时显示的个数
				showDataShadow: false,
				left: '93%'
			}],
			// 用于设置图表数据之
			series: [{
				name: '成功完成',
				type: 'bar',
				stack: '状态',
				barWidth: 35, // 柱图宽度
				barGap: '20%', // 两个柱型之间的距离
				barMinHeight: 10,
				itemStyle: { // 系列级个性化
					normal: {
						color: '#7CCD7C' // 鼠标以及上侧方框显示颜色
					}
				},
				data: metadata.init().ySuccessinfo,
				rawdate: metadata.init().testInfo
				// 添加了rawdate参数（自定义的）
			}, {
				name: '出错完成',
				type: 'bar',
				stack: '状态',
				barWidth: 35,
				barGap: '20%',
				barMinHeight: 10,
				itemStyle: {
					normal: {
						barBorderColor: '#f2b968',
						color: '#f2b968'
					}
				},
				data: metadata.init().yErrorinfo,
				rawdate: metadata.init().testInfo
				// 添加了rawdate参数（自定义的）
			}, {
				name: '执行中',
				type: 'bar',
				stack: '状态',
				barWidth: 35,
				barGap: '20%',
				barMinHeight: 10,
				itemStyle: {
					normal: {
						barBorderColor: '#63B8FF', // --蓝色
						color: '#63B8FF'
					}
				},
				data: metadata.init().yRinfo,
				rawdate: metadata.init().testInfo
				// 添加了rawdate参数（自定义的）
			}, {
				name: '中断',
				type: 'bar',
				stack: '状态',
				barWidth: 35,
				barGap: '20%',
				barMinHeight: 10,
				itemStyle: {
					normal: {
						color: '#dd6e78'
					}
				},
				data: metadata.init().yOtherinfo,
				rawdate: metadata.init().testInfo
				// 添加了rawdate参数（自定义的）
			}]
		};
		// option.series[param.seriesIndex].rawdate[param.dataIndex];
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		myChart.on('click', function (param) {
			$('#data_list').datagrid('loadData', {
				total: 0,
				rows: []
			});
			showdataGrid(condition);
		});
	}
}

// TODO
// 画布全量初始化 --- 获取全量xml
function init_graph(executorId, batchNo) {
	var executorId = executorId;
	var batchNo = batchNo;
	$.ajax({
		type: "get",
		url: "tbDiMonitorLog/getMonitorXML.action?executorId=" + executorId + "&batchNo=" + batchNo,
		success: function success(xmls) {
			var xml_text = '';
			if (xmls) {
				if (xmls.length) {
					xml_text = xmls[0].XMLString;
					graphic.xmlDoc = xml_text;
					graphic.reappearXmlDoc();
					graphic.initCanvas();
					graphic.update();
				} else {
					alert('请求全量xml为空');
				}
			} else {
				alert('请求全量xml出错');
			}
			// console.log(xmls);
			// TODO 解析详细的xml信息并放在画布中
		},
		error: function error() {
			$(".s-svg g g g").remove();
		}
	});
}
// 根据executorId查询第三部分详细信息
function showLogInfo(executorId, batchNo) {
	var win = $.messager.progress({
		title: 'Wating',
		msg: 'Loading...'
	});
	var surl = "tbDiMonitorLog/searchByexecutorId.action?executorId=" + executorId + "&batchNo=" + batchNo;
	initDataGrid(surl);
}
// 重置方法
function doReset() {
	$('#searchForm').form('reset');
}

// 列表信息
function showdataGrid(condition) {
	//	Peony.progress();
	var data = {};
	var scheduleId = $("#h_scheduleId").val();
	var batchNo = $("#h_batchNo").val();
	var executorId = $("#h_executorId").val();
	var executeType = $("#h_executeType").val();
	var executeFlag = $("#h_executeFlag").val();
	if (scheduleId != "" || batchNo != "" || executorId != "" || executeType != "" || executeFlag != "") {
		data.scheduleId = scheduleId;
		data.batchNo = batchNo;
		data.executorId = executorId;
		data.executeType = executeType;
		data.executeFlag = executeFlag;
	}
	data.condition = condition;
	// "sysIndex/getBatchById.action?scheduleId="+sid,
	$.ajax('tbDiMonitorLog/searchListImage.action', {
		type: 'post',
		dataType: 'json',
		data: data,
		success: function success(data) {
			//			Peony.closeProgress();
			forChart(data);
			//			$('#data_list').datagrid('loadData', data);
		}
	});
}

function initDataGrid(url) {
	$('#data_list').datagrid({
		url: url,
		idField: 'monitorId',
		view: scrollview, // 虚拟滚动
		rownumbers: true, // 行号
		singleSelect: true, // 单选
		checkOnSelect: true,
		width: '100%',
		autoRowHeight: false, // 是否设置基于该行内容的行高度
		remoteSort: false,
		striped: true, // 奇偶行显示不同背景色
		multiSort: true, // 多列排序
		pageNumber: 1,
		pageSize: 50,
		columns: [[{
			field: 'monitorId',
			hidden: true
		}, {
			title: '作业执行ID',
			field: 'executorId',
			width: 130,
			sortable: true
		}, {
			title: '层',
			field: 'monitorLevel',
			width: 30,
			sortable: true
		}, {
			field: 'nodeName',
			title: '节点名称',
			width: 150,
			sortable: true
		}, {
			field: 'memberType',
			title: '节点类型',
			width: 90,
			sortable: true
		}, {
			title: '序号',
			field: 'orderNo',
			width: 30,
			sortable: true
		}, {
			title: '任务编号',
			field: 'memberNo',
			width: 200,
			sortable: true
		}, {
			field: 'memberName',
			title: '任务名称',
			width: 200,
			sortable: true
		}, {
			field: 'batchNo',
			title: '批号',
			width: 100,
			sortable: true
		}, {
			field: 'scheduleName',
			title: '调度计划',
			width: 130,
			sortable: true
		}, {
			field: 'executeType',
			title: '方式',
			width: 50,
			sortable: true
		}, {
			field: 'startTime',
			title: '开始时间',
			width: 130,
			sortable: true
		}, {
			field: 'endTime',
			title: '结束时间',
			width: 130,
			sortable: true
		}, {
			field: 'duration',
			title: '时长(秒)',
			width: 50,
			sortable: true
		}, {
			field: 'deleteNum',
			title: '删除行数',
			width: 70,
			sortable: true
		}, {
			field: 'insertNum',
			title: '插入行数',
			width: 70,
			sortable: true
		}, {
			field: 'executeFlag',
			title: '执行状态',
			width: 70,
			sortable: true
		}, {
			field: 'executeMsg',
			title: '执行信息',
			width: 500,
			formatter: function formatter(value, row, index) {
				if ("数据剖析任务" == row.memberType) {
					return "<a href=\"javascript:void(0)\" onclick=\"showDetail('" + value + "')\"><font color='blue'>剖析结果<img src='images/right.png' class='right_img' /></font></a>";
				} else {
					return "<span title='" + value + "' ondblclick ='showMsg(this)'>" + value + "</span>";
				}
			},
			sortable: true
		}]],
		rowStyler: function rowStyler(index, row) {
			var executeFlag = row.executeFlagId;
			if (executeFlag == 'F' || executeFlag == 'B' || executeFlag == 'A' || executeFlag == 'I') {
				return 'font-weight:16px;font-weight:bold;color:#f00;';
			}
		},
		onLoadSuccess: function onLoadSuccess() {
			Peony.closeProgress();
		}
	});
}

function getRealPath() {
	var localObj = window.location;
	var contextPath = localObj.pathname.split("/")[1];
	var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
	return basePath;
};

//双击展示执行信息
function showMsg(obj) {
	var str = $(obj).text();
	var h, w, r, c;
	if (str.length > 100) {
		h = 490;
		w = 600;
		r = 22;
		c = 92;
	} else {
		h = 300;
		w = 400;
		r = 10;
		c = 57;
	}
	$.messager.show({
		title: '执行信息',
		msg: "<textarea style='border: 0;word-wrap:normal;white-space:nowrap;resize:none;' rows='" + r + "' cols='" + c + "'>" + $(obj)[0].innerHTML,
		width: w,
		height: h,
		showType: null,
		timeout: 0,
		style: {}
	});
}

$("#Stop2").click(function () {
	if ($("#Stop_left2").css('left') == '0px') {
		$("#Stop_left2").animate({
			left: "-170px"
		});
		$(this).animate({
			left: "100%"
		});
		$("#m-imageInfo").animate({
			left: "20px"
		});
		$("#m-imageInfo").css("width", "calc(100% - 20px)");
		$("#Stop_img").attr('src', 'images/left.png');
		$('#data_list').datagrid('resize', {
			width: $("#m-imageInfo").width() - 15
		});
	} else {
		$("#Stop_left2").animate({
			left: "0px"
		});
		$(this).animate({
			left: "91%"
		});
		$("#m-imageInfo").animate({
			left: "180px"
		});
		$("#m-imageInfo").css("width", "calc(100% - 180px)");
		$("#Stop_img").attr('src', 'images/right1.png');
		$('#data_list').datagrid('resize', {
			width: $("#m-imageInfo").width() - 15
		});
	}
});
$("#gotop").click(function () {
	$("#c-border").slideToggle();
	$("#gotop").toggleClass('godownbtn');
	$("#gotop").toggleClass('gotopbtn');
	if ($("#gotop").attr('class') == 'gotopbtn') {
		heights = heights + 200;
		$("#m-graph-wrap").height($(window).height() - heights - 10);
		$('#data_list').datagrid('resize', {
			width: $("#m-imageInfo").width() - 15,
			height: $(window).height() - heights
		});
	} else {
		heights = heights - 200;
		$("#m-graph-wrap").height($(window).height() - heights - 10);
		$('#data_list').datagrid('resize', {

			width: $("#m-imageInfo").width() - 15,
			height: $(window).height() - heights
		});
	}
});

// 切换画布
$('#switchDisplay').click(function () {

	$("#m-graph-wrap").height($(window).height() - heights - 10);

	$("#svgbox svg").height($(window).height());
	if ($('#m-graph-wrap').css("display") == 'none') {
		$('#m-graph-wrap').show();
		$('#mainDiv').hide();
	} else {
		$('#mainDiv').show();
		$('#m-graph-wrap').hide();
	}
	$('#data_list').datagrid('resize', {
		width: $("#m-imageInfo").width() - 15,
		height: $(window).height() - heights
	});
});
//跳转查询第二部分日志明细查询
$('#chaxun').unbind('click').click(function () {
	// window.location.href = "tbDiMonitorLog/logInfo.action";
	$(location).attr('href', getRealPath() + "/tbDiMonitorLog/logInfo.action");
});

function showDetail(path) {
	// window.open("task/getSummery.action?path=" + encodeURI(path));
	openWindowWithPost("task/getSummary.action", "blank", "path", path);
}

/**
 * window.open模拟表单POST提交
 * 
 * @param url
 *            请求地址
 * @param targetName
 *            window.open targetName
 * @param inputName
 *            文本域名称类似 ?path=xxx
 * @param inputValue
 *            文本域值
 */
function openWindowWithPost(url, targetName, inputName, inputValue) {
	var tempForm = document.createElement("form");
	tempForm.id = "tempForm1";
	tempForm.method = "post";
	tempForm.action = url;
	tempForm.target = targetName;
	var hideInput = document.createElement("input");
	hideInput.type = "hidden";
	hideInput.name = inputName;
	hideInput.value = inputValue;
	tempForm.appendChild(hideInput);
	if (tempForm.attachEvent) {
		// IE
		tempForm.attachEvent("onsubmit", function () {
			window.open('about:blank', 'blank');
		});
	} else if (tempForm.addEventListener) {
		// DOM Level 2 standard
		tempForm.addEventListener("onsubmit", function () {
			window.open('about:blank', 'blank');
		});
	}
	document.body.appendChild(tempForm);
	if (document.createEvent) {
		// DOM Level 2 standard
		evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("submit", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		tempForm.dispatchEvent(evt);
	} else if (tempForm.fireEvent) {
		// IE
		tempForm.fireEvent('onsubmit');
	}
	// 必须手动的触发
	tempForm.submit();
	document.body.removeChild(tempForm);
}