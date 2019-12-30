var _jobId, 
_jobName = '';
var condition = "1=1";// 修改后的查询条件
var sqlWhereNum=0;//查询条件加载次数
$(function() {
	$('#ril').unbind('click').click(function() {
		$(location).attr('href', getRealPath() + "/task/cale.action");
	});
	// 加载调度计划信息
	showdataGrid(condition);
	// datagrid跟随浏览器调整大小
	$(window).resize(function() {
		$('#data-list').datagrid('resize', {
			width : $(window).width() - 20,
			height : $(window).height() - 80,
		});
	});
	//隐藏查询条件
	$('#for_search').hide();
	//折叠
	$("#Stop_x").click(function() {
		stopStyle('shrink_screen_where','shrink_bottom',80,90,125);
	});
	// 展开
	$("#Stop_s").click(function() {
		stopStyle('shrink_bottom','shrink_screen_where',140,160,200);
	});
	$('#data-list').datagrid({
		toolbar : '#tb'
	});
});
//是否显示搜索
function searchShow(){
	var state=document.getElementById('for_search').style.display;
	if(state == 'none'){
		showStyle(125,sqlWhereNum);
		sqlWhereNum=sqlWhereNum+1;
	}else{
		hideStyle(40,80);
	}
}

//新增
function addSchedule(){
	_jobId = '';
	$("#fromResult").trigger("click");
	$('#t_newTask_schedule').window('open');
	getdefultTime();
	initSchedule();
	getTreeJob();
	// 弹出窗口；
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
}
// 保存
function saveSchedule() {
	if ($("#formInfo").form('validate')) {// 启用校验
		var reg = /^(\-?)\d+(\.\d+)?$/;
		var inter = $("#interval").val()
		var batchI = $("#batchInterval").val()
		if (inter > 0 && reg.test(inter) && /^\d+$/.test(inter) && /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/.test(batchI)
				&& reg.test(batchI)) {
			var data = $('#formInfo').serialize();
			$.ajax({
				type : "POST",
				url : "etlSchedule/save.action",
				data : data,
				success : function(data) {
					if (data.success) {
						Peony.alert('提示', data.msg, 'info');
						// $("#fromResult").trigger("click");
						$("#fromResult").empty();
						$('#t_newTask_schedule').window('close');
						sqlWhere();
					} else {
						Peony.alert('提示', data.msg, 'error');
					}
				}
			});
		} else {
			if (!!inter > 0 || !reg.test(inter) || !/^\d+$/.test(inter)) {
				$.messager.alert('提示', "执行频度必须为大于0的整数.", 'waring');
			}
			if (!/^(0|[1-9][0-9]*|-[1-9][0-9]*)$/.test(batchI) || !reg.test(batchI)) {
				$.messager.alert('提示', "数据批次时间执行前必须为整数.", 'waring');
			}

		}
	} else {
		$.messager.alert('提示', "有非空字段需要填写，请检查.", 'waring');
	}
}

//编辑
$('#editSchedule').unbind('click').click(function() {
	// 获取选中行
	var node = $('#data-list').datagrid('getChecked');
	if (node.length == 0) {
		$.messager.alert('警告', '未选择记录.', 'warning');
	} else if (node.length > 1) {
		$.messager.alert('警告', '只能选择一条待编辑信息.', 'warning');
	}else {
		editSchedule(node[0].scheduleId);
	}
});

// 编辑变量
function editSchedule(sid) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : "etlSchedule/getId.action?scheduleId=" + sid,
		success : function(data) {
			_jobId = data.data.jobId;
			_jobName = data.data.jobName;
			// $("#fromResult").trigger("click");
			$("#fromResult").empty();
			$('#t_newTask_schedule').window('open');
			initSchedule();
			getTreeJob();
			var sdate = data.data.validstartDate;
			var edate = data.data.validendDate;
			$("#formInfo").form('load', data.data);
			$("#scheduleId").val(data.data.scheduleId);
			$("#frequency").combobox('setValue', data.data.frequency);
			$("#batchfrequency").combobox('setValue', data.data.batchfrequency);
			$("#batchFormat").combobox('setValue', data.data.batchFormat);
			$('#jobId').combotree('setValue', data.data.jobId);
			$('#validstartDate').datetimebox('setValue', sdate);
			$('#validendDate').datetimebox('setValue', edate);

			if (data.data.startFlag == '2') {
				$("#startFlag").prop("checked", true);
			}
			if (data.data.repeatFlag == 'N') {// 执行一次选中
				$("#repeatFlag").prop("checked", true);
			}
			// $('#validstartDate').datetimebox('setValue',data.data.validstartDate)
			if (data.data.beforeTime != null) {
				document.getElementById('beforeTime').innerText = "上次执行时间： " + data.data.beforeTime;
			}
			if (data.data.nextTime != null) {
				document.getElementById('nextTime').innerText = "下次执行时间： " + data.data.nextTime;
			}
			$('#forRModuleName').val('SCHEDULE');
			$('#forRTableName').val('TB_ETL_SCHEDULE');
		}
	});
}
// 取消
function canleSchedule() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			// $("#fromResult").trigger("click");
			$("#fromResult").empty();
			$('#t_newTask_schedule').window('close');
		}
	});
}

//删除
$('#deleteSchedule').unbind('click').click(function() {
	// 获取选中行
	var nodes = $('#data-list').datagrid('getChecked');
	if (nodes.length == 0) {
		$.messager.alert('警告', '请选择待删除记录.', 'warning');
	} else {
		var arr = [];
		$.each(nodes, function(i, node) {
			arr.push('id=' + node["scheduleId"]);
		});
		var data = arr.join("&");
		$.messager.confirm('确认', '您确定要删除信息吗？', function(r) {
			if (r) {
				$.ajax({
					type : "post",
					dataType : 'json',
					url : "etlSchedule/delete.action",
					data:data,
					success : function(data) {
						sqlWhere();
					}
				});
			}
		});
	}
});
// 关闭调度计划
function shutdownSchedule(sid) {
	$.messager.confirm('确认提示', '您确定要关闭该计划？', function(r) {
		if (r) {
			$.ajax({
				type : "get",
				dataType : 'json',
				url : "etlSchedule/shut.action?scheduleId=" + sid,
				success : function(data) {
					sqlWhere();
				}
			});
		}
	});
}

// 开启调度计划
function startSchedule(sid) {
	$.messager.confirm('确认提示', '您确定要开启该计划？', function(r) {
		if (r) {
			$.ajax({
				type : "get",
				dataType : 'json',
				url : "etlSchedule/launch.action?scheduleId=" + sid,
				success : function(data) {
					if (data.success) {
						sqlWhere();
					} else {
						Peony.alert('提示', data.msg, 'error');
					}
				}
			});
		}
	});
}

// 查询
function search_event() {
	var sname = $('#scheduleName_search').val();
	var jobNo = $('#search_jobNo').val();
	var jobName = $('#search_jobName').val();
	// console.log(sname + "," + jobNo + "," + jobName);
	var surl = "etlSchedule/dataList.action?scheduleName=" + sname + "&jobNo=" + jobNo + "&jobName=" + jobName;
	surl = encodeURI(surl);
	surl = encodeURI(surl);
	showdataGrid(surl);
}
// 加载调度计划信息
function initSchedule() {
	// 执行频度
	var frequency = $("#frequency").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FREQUENCY',
		editable : false,
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		// value:'D' //默认选中
		onLoadSuccess : onLoadSuccess
	});
	// 数据批次时间频度
	$("#batchfrequency").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FREQUENCY_BATCH',
		editable : false,
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		onLoadSuccess : onLoadSuccess
	});

	// 成功邮件数据加载
	$("#succeedMailId, #faultMailId").combobox({
		url : 'tbMailInfo/listMail.action',
		editable : false,
		valueField : 'taskId',
		textField : 'taskName',
		formatter : function(row) {
			if (row.taskName != '---请选择---') {
				return '<span class="item-text">【' + row.taskNo + '】' + row.taskName + '</span>';
			} else {
				return '<span class="item-text">' + row.taskName + '</span>';
			}
		}
	});
	// 数据批次号格式
	$("#batchFormat").combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		url : 'sysDictionaryData/getValues.action?dictValue=BATCH_FORMAT',
		onLoadSuccess : onLoadSuccess
	});
}
// 默认时间设置
function getdefultTime() {
	var d = new Date();
	var s1 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " 00:00:00";
	var s2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate() + 1) + " 00:00:00";
	var s = "2099-01-01 00:00:00";
	$('#validstartDate,#executeTime,#validendDate').datetimebox({
		showSeconds : true
	});
	$('#validstartDate').datetimebox('setValue', s1);
	$('#executeTime').datetimebox('setValue', s2);
	$('#validendDate').datetimebox('setValue', s);
}
// 默认选中第一条
function onLoadSuccess() {
	var id = $("#scheduleId").val();
	if (id == null || id === "") { // 当新增表单时
		var target = $(this);
		var data = target.combobox("getData");
		var options = target.combobox("options");
		if (data && data.length > 0) {
			var fs = data[0];
			target.combobox("setValue", fs[options.valueField]);
		}
	}
}

// 树形下拉框加载job
function getTreeJob() {
	$('#jobId').combotree({
		url : "job/treeList3.action?id=NULL&vartype=''",
		required : true,
		onBeforeExpand : function(node) {
			var url = "job/treeList3.action?vartype=" + node.attributes.vartype;
			$(this).tree("options").url = url;
			return true;
		},
		onExpand : function(node) {
			var children = $(this).tree('getChildren', node.id);
			if (children.length <= 0) {
				row.leaf = true;
				$(this).tree('refresh', node.id);
			}
		},
		onLoadSuccess : function(node, data) {
			var t = $(this);
			if (data) {
				$(data).each(function(index, d) {
					// 默认展开第一层
					if (this.state == 'closed' && this.parentId == '') {
						var children = t.tree('getChildren');
						for (var i = 0; i < children.length; i++) {
							t.tree('expand', children[i].target);
						}
					}
				});
				if (_jobId != '') {
					defaultValue('jobId', _jobId, _jobName);
				}
			}
		},
		onSelect : function(node) {
			// alert(node.id+","+node.text+","+node.attributes.taskType);
			// if (node.attributes.taskType == '7') {
			// $.messager.alert('提示', "该选项为文件夹，请重新选择！", 'waring');
			// $('#jobId').combotree("setValue", "");
			// }
		}
	});
}

// 为combotree增加默认值隐藏节点，解决因异步加载导致默认值id直接显示到文本框中的问题
// cbtid:combotree的id
// defval:生成节点的id
// deftext：生成节点的文本用于显示
function defaultValue(cbtid, defVal, defText) {
	var combotree = $("#" + cbtid);
	var tree = combotree.combotree('tree');
	var defNode = tree.tree("find", defVal);
	if (!defNode) {
		tree.tree('append', {
			data : [ {
				id : defVal,
				text : defText
			} ]
		});
		defNode = tree.tree("find", defVal);
		// console.log(defNode);
		// console.log(combotree);
		combotree.combotree('setValue', defVal);
		tree.tree('select', defNode.target);
		defNode.target.style.display = 'none';
	} else {
		combotree.combotree('setValue', defVal);
	}
}

// 右侧数据显示
function showdataGrid(condition) {
	if (condition == undefined || condition == ""){
		condition = " 1=1 ";
	}
	condition = encodeURI(condition);
	condition = encodeURI(condition);
	$('#data-list').datagrid(
			{
				title : '调度计划信息',
				url : "etlSchedule/viewListWhere.action?condition="
					+ condition,
				idField : 'scheduleId',
				pagination : true, // 分页
				rownumbers : true, // 行号
				singleSelect : true,// 单选
				checkOnSelect : true,
				autoRowHeight : false,// 是否设置基于该行内容的行高度
				remoteSort : false,
				striped : true,// 奇偶行显示不同背景色
				fitColumns : false,// 自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动。
				pageSize : 30,// 每页显示的记录条数，默认为10
				pageList : [ 10, 30, 50, 100 ],
				columns : [ [
						{
							field : 'scheduleId',
							checkbox : true
						},
						{
							field : 'scheduleName',
							title : '计划名称',
							width : '15%',
							sortable : true
						},
						{
							field : 'jobno',
							title : '作业编号',
							width : '13%',
							sortable : true
						},
						{
							field : 'jobname',
							title : '作业名称',
							width : '15%',
							sortable : true
						},
						{
							field : 'beforeTime',
							title : '上次执行时间',
							width : '15%',
							sortable : true
						},
						{
							field : 'lastExecStateName',
							title : '最后一次执行状态',
							width : '15%',
							sortable : true
						},
						{
							field : 'nextTime',
							title : '下次执行时间',
							width : '15%',
							sortable : true
						},
						{
							field : '_operate',
							title : '操作',
							width : '10%',
							formatter : function(value, row, index) {
								if (row.startFlag == '2') {
									return  '<a href="javascript:void(0)" onclick="shutdownSchedule(\''
											+ row.scheduleId + '\')" class=\"switch_a\" ><i></i></a>';
								} else {
									return  '<a href="javascript:void(0)" onclick="startSchedule(\'' + row.scheduleId
											+ '\')" class=\"switch_a\"><i style=\"left:-36px;\"></i></a>';
								}
							}
						} ] ],
						onClickRow : function(index, row) { // 单击行事件
							// ---------for TEST
							// 结合SHIFT,CTRL,ALT键实现单选或多选------------
							if (index != selectIndexs.firstSelectRowIndex && !inputFlags.isShiftDown1) {
								selectIndexs.firstSelectRowIndex = index; 
							}
							if (inputFlags.isShiftDown1) {
								$('#data-list').datagrid('clearSelections');
								selectIndexs.lastSelectRowIndex = index;
								var tempIndex = 0;
								if (selectIndexs.firstSelectRowIndex > selectIndexs.lastSelectRowIndex) {
									tempIndex = selectIndexs.firstSelectRowIndex;
									selectIndexs.firstSelectRowIndex = selectIndexs.lastSelectRowIndex;
									selectIndexs.lastSelectRowIndex = tempIndex;
								}
								for (var i = selectIndexs.firstSelectRowIndex; i <= selectIndexs.lastSelectRowIndex; i++) {
									$('#data-list').datagrid('selectRow', i);
								}
							}
							// 结合SHIFT,CTRL,ALT键实现单选或多选------------
						}
			});
}

function getRealPath() {
	var localObj = window.location;
	var contextPath = localObj.pathname.split("/")[1];
	var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
	return basePath;
};

$("#cron_Expression").click(function() {
	$('#t_cron_Expression').window('open');
	$("#cron").val($("#cronExpression").val())

})

// cron表达式取消
function cron_cancel() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			// $("#fromResult").trigger("click");
			// $("#fromResult").empty();
			$('#t_cron_Expression').window('close');
		}
	});
}

// cron表达式保存

function cron_Preservation() {
	$("#cronExpression").val($("#cron").val())
	$('#t_cron_Expression').window('close');

}
