var taskArr;
var condition = "1=1";// 修改后的查询条件
var sqlWhereNum=0;//查询条件加载次数
$(function() {
	$('#data-list').datagrid({
		toolbar: '#tb'
	});
	
//	var surl = "graphInfo/dataList.action?sourceConnection=&sourceTables=";
	showdataGrid(condition);

	// datagrid跟随浏览器调整大小
	$(window).resize(function() {
		$('#data-list').datagrid('resize', {
			width : $("#width_title").width()+15,
			height : $(window).height() - 75,
		});
	});
	
	//隐藏查询条件
	$('#for_search').hide();
	//折叠
	$("#Stop_x").click(function() {
		stopStyle('shrink_screen_where','shrink_bottom',80,90,125);
	})
	// 展开
	$("#Stop_s").click(function() {
		stopStyle('shrink_bottom','shrink_screen_where',140,160,200);
	})
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
// 点击进入新建页面
$('#addgraph').unbind('click').click(function() {
	$("#fromResult").trigger("click");
	$('#t_newGraph').window('open');
	initData();
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	$('#taskId').combobox('setValue','');
	$('#taskId').combobox({
		   editable : true,
	       valueField:'taskId',
	       textField:'text',
	       url:'graphInfo/allTaskInfo.action',
	       onLoadSuccess: function () { 
				 $('#taskId').combobox('setValue','');
				 taskArr=$('#taskId').combobox("getData");
//				 console.log(JSON.stringify(taskArr));
			}
	});
	
});
//保存信息
function saveGraphInfo() {
	if ($("#formInfo").form('validate')) {// 启用校验
		//TODO 判断属于任务的合法性
		$.ajax({
			type : "get",
			url : "graphInfo/allTaskIds.action",
//			data : data,
			success : function(result) {
				var tid= $('#taskId').combobox('getValue');
				if(JSON.stringify(result).indexOf(tid) == -1){
					$.messager.alert('提示', "选择的所属任务信息不存在,请检查.", 'warning');
				}else{
					var data = formToString($("#formInfo").get(0));
					$.ajax({
						type : "POST",
						url : "graphInfo/saveGraph.action",
						data : data,
						success : function(msg) {
							$.messager.alert('提示', "保存成功", 'info');
							// 清空form信息
							$("#fromResult").trigger("click");
							$('#t_newGraph').window('close');
//							var surl = "graphInfo/dataList.action?sourceConnection=&sourceTables=";
//							showdataGrid(surl);
							sqlWhere();
						}
					});
				}
			}
		}); 
	} else {
		$.messager.alert('提示', "有非空字段需要填写，请检查.", 'warning');
	}
}
//取消
function canleGraphInfo() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			 $("#fromResult").trigger("click");
//			$("#formInfo").empty();
			$('#t_newGraph').window('close');
		}
	});
}
//编辑
$('#editgraph').unbind('click').click(function() {
	// 获取选中行
	var node = $('#data-list').datagrid('getChecked');
	if (node.length == 0) {
		$.messager.alert('警告', '未选择记录.', 'warning');
	} else if (node.length > 1) {
		$.messager.alert('警告', '只能选择一条待编辑信息.', 'warning');
	}else if (node[0].graphId ==  null || node[0].graphId =='') {
		$.messager.alert('警告', '只能编辑自定义类型的信息', 'warning');
	} else {
		editGraph(node[0].graphId);
	}
});
//编辑信息
function editGraph(graphId) {
	$('#t_newGraph').window('open');
	$("#fromResult").trigger("click");
	$("#graphId").val(graphId);
//	var data = {};
//	data.taskId = taskId;
	$.ajax({
		type : "get",
		dataType : 'json',
		url : "graphInfo/getId.action?graphId="+graphId,
//		data : data,
		success : function(result) {
			loadDataInfo(result);
			$("#formInfo").form('myLoad', result.data);
			$('#forRModuleName').val('GRAPHINFO');
			$('#forRTableName').val('TB_GRAPHINFO');
		}
	});
}
// 删除 
$('#deletegraph').unbind('click').click(function() {
	var forAlert='';
	// 获取选中行
	var nodes = $('#data-list').datagrid('getChecked');
	if (nodes.length == 0) {
		$.messager.alert('警告', '请选择待删除记录.', 'warning');
	} else {
		var arr = [];
		$.each(nodes, function(i, node) {
			var gid=node["graphId"];
			if(forAlert == ''){
				forAlert=gid;
			}else{
				forAlert=forAlert+","+gid;
			}	
			arr.push('id=' + gid);
				
		});
		if(forAlert.split(',').indexOf('') != -1){ 
			$.messager.alert('警告', '只能删除自定义信息.', 'warning');
		}
		$.messager.confirm('确认提示', '您确定要删除信息吗？', function(r) {
			var data = arr.join("&");
			if (r) {
				$.ajax({
					type : "post",
					dataType : 'json',
					url : "graphInfo/delete.action?id=" + data,
					data : data,
					success : function(msg) {
//						var surl = "graphInfo/dataList.action?sourceConnection=&sourceTables=";
//						showdataGrid(surl);
//						console.log(forAlert.length);
						sqlWhere();
					}
				});
			}
		});
	}
});



// 查询按钮
function search_event() {
	var sdb = $('#search_dbConnection').combobox('getValue');
	var stable = $('#search_sourceTables').val();
	var surl = "graphInfo/dataList.action?sourceConnection=" + sdb + "&sourceTables=" + stable;
	surl = encodeURI(surl);
	surl = encodeURI(surl);
	showdataGrid(surl);
}
//查询血缘关系图-修改为不选中时也可以跳转查询
$('#searchgraph').unbind('click').click(function() {
	var node = $('#data-list').datagrid('getChecked');
	var sdb='';
	var stable='';
	var src='';
	if (node.length > 1) {
		$.messager.alert('警告', '只能选择一条待查看表信息.', 'warning');
		return false;
	} else if (node.length != 0){
		sdb = node[0].sourceConnection;
		stable = node[0].sourceTables;
		src=node[0].src;
	}
	window.open("graphInfo/searchgraph.action?sourceConnection=" + sdb + "&srcConnName="
			+ src+ "&sourceTables="+ stable);
});

// 加载信息
function initData() {
	// 数据连接--源
	$("#sourceConnection").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		url : 'tbMdTable/listConnnectAll.action',
		onChange : function(newValue, oldValue) {
			$.get('tbMdTable/connnectTable.action', {
				id : newValue
			}, function(data) {
				var tinfo = $("#sourceTables").combobox('getText');// 当前table值信息
				if (tinfo != "") {
					sourceTables.combobox("clear").combobox('loadData', data).combobox('setValue', tinfo);
				} else {
					sourceTables.combobox("clear").combobox('loadData', data);
				}
			}, 'json');
		}
	});
	// 源表
	var sourceTables = $("#sourceTables").combobox({
		// editable : false,
		valueField : 'tableName',
		textField : 'stname'
	});
	// 数据连接--目标
	$("#targetConnection").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		url : 'tbMdTable/listConnnect.action',
		onChange : function(newValue, oldValue) {
//			$("#targetCon").val(newValue);
			$.get('tbMdTable/connnectTable.action', {
				id : newValue
			}, function(data) {
				var tinfo = $("#targetTable").combobox('getText');// 当前table值信息
				if (tinfo != "") {
					$("#targetTable").combobox("clear").combobox('loadData', data).combobox('setValue', tinfo);
				} else {
					$("#targetTable").combobox("clear").combobox('loadData', data);
				}
			}, 'json');
		}
	});
	// 目标表
	var targetTable = $("#targetTable").combobox({
		// editable : false,
		valueField : 'stname',
		textField : 'stname'
	});
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

function loadDataInfo(result) {
	var sdb=result.data.sourceConnection;
	var tdb=result.data.targetConnection;
	$('#taskId').combobox({
		editable : true,
		valueField:'taskId',
		textField:'text',
		url:'graphInfo/allTaskInfo.action',
		 onLoadSuccess: function () { 
			 $('#taskId').combobox('setValue',result.data.taskId);
			 taskArr=$('#taskId').combobox("getData");
		}
	}); 
	// 数据连接--源
	$("#sourceConnection").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		url : 'tbMdTable/listConnnectAll.action',
		onChange : function(newValue, oldValue) {
			$.get('tbMdTable/connnectTable.action', {
				id : newValue
			}, function(data) {
				var tinfo = $("#sourceTables").combobox('getText');// 当前table值信息
				if (tinfo != "") {
					sourceTables.combobox("clear").combobox('loadData', data).combobox('setValue', tinfo);
				} else {
					sourceTables.combobox("clear").combobox('loadData', data);
				}
			}, 'json');
		}
	});
	// 源表
	var sourceTables = $("#sourceTables").combobox({
		// editable : false,
		valueField : 'tableName',
		textField : 'stname',
		url : 'tbMdTable/connnectTable.action?id=' + sdb
	});
	// 数据连接--目标
	$("#targetConnection").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		url : 'tbMdTable/listConnnect.action',
		onChange : function(newValue, oldValue) {
//			$("#targetCon").val(newValue);
			$.get('tbMdTable/connnectTable.action', {
				id : newValue
			}, function(data) {
				var tinfo = $("#targetTable").combobox('getText');// 当前table值信息
				if (tinfo != "") {
					$("#targetTable").combobox("clear").combobox('loadData', data).combobox('setValue', tinfo);
				} else {
					$("#targetTable").combobox("clear").combobox('loadData', data);
				}
			}, 'json');
		}
	});
	// 目标表
	var targetTable = $("#targetTable").combobox({
		// editable : false,
		valueField : 'stname',
		textField : 'stname',
		url : 'tbMdTable/connnectTable.action?id=' + tdb
	});
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

// 右侧数据显示
function showdataGrid(condition) {
	if (condition == undefined || condition == ""){
		condition = " 1=1 ";
	}
	condition = encodeURI(condition);
	condition = encodeURI(condition);
	$('#data-list').datagrid({
		title : '血缘分析信息',
		url : "graphInfo/dataListWhere.action?condition="
			+ condition ,
		idField : 'graphId',
		pagination : true, // 分页
		rownumbers : true, // 行号
		singleSelect : true,// 单选
		checkOnSelect : true,
		autoRowHeight : false,// 是否设置基于该行内容的行高度
		remoteSort : false,
		striped : true,// 奇偶行显示不同背景色
		fitColumns : false,// 自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动。
		pageSize : 30,// 每页显示的记录条数，默认为10
//		resizable :true,
		pageList : [ 10, 30, 50, 100, 500 ],
		columns : [ [ {
			field : 'sourceConnection',
			hidden : true
		}, {
			field : 'targetConnection',
			hidden : true
		}, {
			field : 'graphId',
			checkbox : true
		},{
			field : 'graphType',
			hidden : true
		},{
			field : 'graphTypeName',
			title : '关系来源',
			width : 80,
			sortable : true
		},{
			field : 'src',
			title : '源连接',
			width : 100,
			sortable : true
		},{
			field : 'sourceTables',
			title : '源表',
			width : 150,
			sortable : true
		}, {
			field : 'tar',
			title : '目标连接',
			width : 100,
			sortable : true
		}, {
			field : 'targetTable',
			title : '目标表',
			width : 150,
			sortable : true
		}, {
			field : 'modifiedTime',
			title : '最后修改时间',
			width : 80,
			sortable : true
		},{
			field : 'taskNo',
			title : '任务编号',
			width : 80,
			sortable : true
		}, {
			field : 'taskName',
			title : '任务名称',
			width : 80,
			sortable : true
		}, {
			field : 'tasktype',
			title : '任务类型',
			width : 120,
			sortable : true
		} ] ],
		onClickRow : function(index, row) { // 单击行事件
			// ---------for TEST
			// 结合SHIFT,CTRL,ALT键实现单选或多选------------
			if (index != selectIndexs.firstSelectRowIndex && !inputFlags.isShiftDown1) {
				selectIndexs.firstSelectRowIndex = index; // alert('firstSelectRowIndex,
				// sfhit
				// = '
				// +
				// index);
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
			// ---------for TEST
			// 结合SHIFT,CTRL,ALT键实现单选或多选------------
		}
	});
}
// form数据封装
function formToString(formObj) {
	var allStr = "";
	if (formObj) {
		var elementsObj = formObj.elements;
		var obj;
		if (elementsObj) {
			for (var i = 0; i < elementsObj.length; i += 1) {
				obj = elementsObj[i];
				if (obj.name != undefined && obj.name != "") {
					allStr += "&" + obj.name + "=" + encodeURIComponent(obj.value);
				}
			}
		} else {
			// alert("没有elements对象!");
			$.messager.alert('提示', "没有elements对象！", 'info');
			return;
		}
	} else {
		// alert("form不存在!");
		$.messager.alert('提示', "form不存在！", 'info');
		return;
	}
	return allStr;
}

function getRealPath() {
	var localObj = window.location;
	var contextPath = localObj.pathname.split("/")[1];
	var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
	return basePath;
};
/*
 * 获取应用根路径 @return {TypeName}
 */
function getContextPath() {
	var pathname = location.pathname;
	return pathname.substr(0, pathname.indexOf('/', 1));
}



