var rowCount = 0;
var _taskEType;// 页面数据来源-转换任务或作业流程

$(function() {
	_taskEType = $("#_taskEType").val();
});

/**
 * 添加信息
 */
function addWs() {
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName = $("#search_folderName").val();// 当前所属文件夹名称
	_id = sfolderId;
	_text = sfolderName;
	initWs();
	$("#filetabs").tabs('select', "基本信息");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	$("#jsonPart").hide();
	$("#jsonPart *").attr("disabled", true);
	$(".div_post_params").hide();
}

/**
 * 编辑信息
 * 
 * @param data
 */
function editTaskW(tid, ttype, url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			initWs();
			$("#formWs").form('myLoad', data.data);
			$("#taskId12").val(data.data.taskId);
			$('#folderId12').combotree('setValue', data.data.folderId);
			var returnType = data.data.returnType;
			handleReturnType(returnType);
			handleReqType(data.data.reqType);
			var jsonObj = JSON.parse(data.data.parameters);
			var dataList = jsonObj.parameters;
			if (returnType === '1') {
				for (var i = 0; i < dataList.length; i++) {
					addLineWsXml(i, dataList[i]);
				}
			} else {
				for (var i = 0; i < dataList.length; i++) {
					addLineWsJson(i, dataList[i]);
				}
			}
			$(".validatebox-tip").remove();
			$(".tooltip").removeClass("tooltip tooltip-right");

			$("#targetConnectionWs").combobox('setValue', data.data.targetConnection);
			$("#targetTableWs").combobox('setValue', data.data.targetTable);
			$("#brforeRuleWs").combobox('setValue', data.data.brforeRule);
			$("#encode").combobox({
				onLoadSuccess : function() {
					$("#encode").combobox('setValue', data.data.encode);
				}
			});
			if (data.data.brforeRule != '1') {
				$("#deleteSqlWs").val(data.data.deleteSql);
			}
			ttableInfoWs(data.data.brforeRule);
			$('#forRModuleNameWS').val('TASKWS');
			$('#forRTableNameWS').val('TB_TASK_WS');
		}
	});
}

/**
 * 初始化
 */
function initWs() {
	rowCount = 0;
	$("#fromResultWs").trigger("click");
	$('#t_newTask_ws').window('open');
	getTreeInfo("folderId12");
	getTreeFolder("folderId12");
	delAllLine(true);
	btnAddWsXml();
	btnAddWsJson();
	$('#deleteSqlWs').textareafullscreen();

	// 数据连接--目标
	$("#targetConnectionWs").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		url : 'tbMdTable/listConnnect.action',
		onChange : function(newValue, oldValue) {
			$.get('tbMdTable/connnectTable.action', {
				id : newValue
			}, function(data) {
				targetTableWs.combobox("clear").combobox('loadData', data);
			}, 'json');
		}
	});

	// 目标表
	var targetTableWs = $("#targetTableWs").combobox({
		// editable : false,
		valueField : 'stname',
		textField : 'stname'
	});

	// 目标写入前的操作
	$("#brforeRuleWs").combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		url : 'sysDictionaryData/getValuesCale.action?dictValue=BEFORE_RULE',
		onChange : function(newValue, oldValue) {
			ttableInfoWs(newValue);
		}
	});

	// 编码
	$("#encode").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FILE_CHARSET',
		editable : false,
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		onLoadSuccess : onLoadSuccess
	});
}

// 目标表删除语句--删除前操作类型和关键字是否为必填项变化
function ttableInfoWs(id) {
	var str;
	var ttable = $("#targetTableWs").combobox('getText');
	var _deleteSql = $("#deleteSqlWs");
	if (id == '1') {// 不删除
		_deleteSql.val("");// 删除语句为空且不可编辑
		_deleteSql.attr("disabled", true);
	} else if (id == '5') {// 自定义
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		_deleteSql.val(str);
		_deleteSql.attr("disabled", false);// 删除语句可编辑
	}
}

// 返回类型操作
$('#returnType').change(function() {
	var val = $(this).children('option:selected').val();
	handleReturnType(val);
});

// 请求方式操作
$('#reqType').change(function() {
	var val = $(this).children('option:selected').val();
	handleReqType(val);
});

/**
 * 根据返回类型显示字段信息
 */
function handleReturnType(val) {
	if (val === '1') {
		$(".xmlPart").show();
		$(".jsonPart").hide();
		$(".xmlPart *").removeAttr("disabled");
		$(".jsonPart *").attr("disabled", true);
	} else {
		$(".xmlPart").hide();
		$(".jsonPart").show();
		$(".xmlPart *").attr("disabled", true);
		$(".jsonPart *").removeAttr("disabled");
	}
}

/**
 * 根据请求方式显示字段信息
 */
function handleReqType(val) {
	if (val === '1') {
		$(".div_post_params").hide();
	} else {
		$(".div_post_params").show();
	}
}

// 保存Ws信息
function saveTaskWs() {
	var taskNo, taskName, noName, taskId;
	if (_taskEType == 'forJob') {// 来自作业流程页面
		taskNo = $("#taskNo12").val();
		taskName = $("#taskName12").val();
		noName = "【" + taskNo + "】" + taskName;
		taskId = $("#taskId12").val();
	}
	if ($("#formWs").form('validate')) {// 启用校验
		var data = $("#formWs").serialize();
		$.ajax({
			type : "POST",
			url : "taskWs/save.action",
			data : data,
			success : function(msg) {
				$.messager.alert('提示', "保存成功", 'info');
				// 清空form信息
				$("#fromResultWs").trigger("click");
				$('#t_newTask_ws').window('close');
				// 保存后信息处理
				if (_taskEType == 'forTask') {
					sqlWhere();
				} else if (_taskEType == 'forJob') {
					var tid = msg.taskId;
					// //判断是否需要重新加载下拉框数据
					var taskNoName = $("#taskNoName12").val();
					if (taskNoName != noName) {
						// 重新加载下拉框信息
						$("#i_nodeItem_id12").combobox({
							valueField : 'id',
							textField : 'name',
							editable : true,
							url : 'job/taskList.action?type=12',
							onLoadSuccess : function() {
								var data = $('#i_nodeItem_id12').combobox('getData');
								if (data.length > 0) {
									$('#i_nodeItem_id12').combobox('select', tid);
								}
							}
						});
					}
				}
			}
		});
	} else {
		$.messager.alert('提示', "有非空字段需要填写，请检查.", 'waring');
	}
}
// 取消
function canleTaskWs() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultWs").trigger("click");
			$('#t_newTask_ws').window('close');
		}
	});
}

// ----------------------------- xml
function btnAddWsXml() {
	$('#addLineWsXml').unbind('click').click(addLineWsXml); // 新增一行
	$('#delAllLineWsXml').unbind('click').click(function() {// 删除全部
		var tab = document.getElementById("tbWsXml");
		var rows = tab.rows.length;
		if (rows > 1) {// 表头信息
			$.messager.confirm('确认', '您确定要删除记录？', function(r) {
				if (r) {
					rowCount = 0;
					delAllLine(true);
				}
			});
		} else {
			$.messager.alert('提示', "无待删除信息！", 'info');
		}
	});
}

function addLineWsXml(i, data) {
	rowCount++;
	var table = $("#tbWsXml");
	var html = "<tr class='tb-line'>";
	html += "	<td width=\"5%\"><input name=\"no\" class=\"easyui-validatebox text-name\" style=\"width:100%;border-style: none; text-align: center;\" value=\""
			+ rowCount + "\" data-options=\"editable :false\"></td>";
	html += "	<td width=\"15%\"><input name=\"name\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%;\" data-options=\"required:true\"></td>";
	html += "	<td width=\"35%\"><input name=\"path\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%;\" data-options=\"required:true\"></td>";
	html += "	<td width=\"5%\"><select  name=\"node\" id=\"node" + i
			+ "\" class=\"form-control\"  data-options=\"\" style=\"width:95%;\"><option value=\"1\">节点</option>"
			+ "<option value=\"2\">属性</option></select></td>";
	html += "	<td width=\"5%\">" + "<select  name=\"type\"  id=\"type" + i
			+ "\" class=\"form-control\" data-options=\"\" style=\"width:95%;\">" + "<option value=\"1\">数字型</option>"
			+ "<option value=\"2\">字符型</option>" + "</select>" + "</td>";
	html += "	<td width=\"15%\"><select  name=\"removeSpaceType\" id=\"removeSpaceType"
			+ i
			+ "\" class=\"form-control\"  data-options=\"\" style=\"width:95%;\"><option value=\"1\">不去除</option>"
			+ "<option value=\"2\">去除左空格</option><option value=\"3\">去除右空格</option><option value=\"4\">去除左右空格</option></select></td>";
	// html += " <td><select name=\"isRepeat\" id=\"isRepeat" + i
	// + "\" class=\"form-control\" data-options=\"\"
	// style=\"width:95%;\"><option value=\"Y\">是</option>"
	// + "<option value=\"N\">否</option></select></td>";
	html += "	<td width=\"7%\" align=\"center\"><a class=\"easyui-linkbutton remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
	html += "	</td>";
	html += "</tr>";
	var line = $(html);
	// 版定删除按钮事件
	$(".remove-btn", line).click(function() {
		$.messager.confirm('确认', '您确定要删除记录？', function(r) {
			if (r) {
				rowCount--;
				delLine(line);
			}
		});
	});
	$.parser.parse(line);// 解析esayui标签
	table.append(line);
	if (data) {
		$("input[name='name']", line).val(data.name);
		$("input[name='path']", line).val(data.path);
		$("#node" + i + " option").each(function(j) {
			if (this.value == data.node) {
				this.selected = true;
			}
		});
		$("#type" + i + " option").each(function(j) {
			if (this.value == data.type) {
				this.selected = true;
			}
		});
		$("#removeSpaceType" + i + " option").each(function(j) {
			if (this.value == data.removeSpaceType) {
				this.selected = true;
			}
		});
		$("#isRepeat" + i + " option").each(function(j) {
			if (this.value == data.isRepeat) {
				this.selected = true;
			}
		});
	}
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
}

// ----------------------------- json
function btnAddWsJson() {
	$('#addLineWsJson').unbind('click').click(addLineWsJson); // 新增一行
	$('#delAllLineWsJson').unbind('click').click(function() {// 删除全部
		var tab = document.getElementById("tbWsJson");
		var rows = tab.rows.length;
		if (rows > 1) {// 表头信息
			$.messager.confirm('确认', '您确定要删除记录？', function(r) {
				if (r) {
					rowCount = 0;
					delAllLine(true);
				}
			});
		} else {
			$.messager.alert('提示', "无待删除信息！", 'info');
		}
	});
}

function addLineWsJson(i, data) {
	var table = $("#tbWsJson");
	rowCount++;
	var html = "<tr class='tb-line'>";
	html += "	<td width=\"5%\"><input name=\"no\" class=\"easyui-validatebox text-name\" style=\"width:100%;border-style: none; text-align: center;\" value=\""
			+ rowCount + "\" data-options=\"editable :false\"></td>";
	html += "	<td width=\"15%\"><input name=\"name\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%;\" data-options=\"required:true\"></td>";
	html += "	<td width=\"35%\"><input name=\"path\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%;\" data-options=\"required:true\"></td>";
	html += "		<td width=\"7%\">" + "<select  name=\"type\"  id=\"type" + i
			+ "\" class=\"form-control\" data-options=\"\" style=\"width:95%;\">" + "<option value=\"1\">数字型</option>"
			+ "<option value=\"2\">字符型</option>" + "</select>" + "</td>";
	html += "	<td width=\"10%\"><select  name=\"removeSpaceType\" id=\"removeEmptyType"
			+ i
			+ "\" class=\"form-control\"  data-options=\"\" style=\"width:95%;\"><option value=\"1\">不去除字符串首尾空字符</option>"
			+ "<option value=\"2\">去除字符串首部空字符</option><option value=\"3\">去除字符串尾部空字符</option><option value=\"4\">去除字符串首尾空字符</option></select></td>";
	// html += " <td width=\"5%\"><select name=\"isRepeat\" id=\"isRepeat" + i
	// + "\" class=\"form-control\" data-options=\"\"
	// style=\"width:95%;\"><option value=\"true\">是</option>"
	// + "<option value=\"false\">否</option></select></td>";
	html += "	<td width=\"7%\" align=\"center\"><a class=\"easyui-linkbutton remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
	html += "	</td>";
	html += "</tr>";
	var line = $(html);
	// 版定删除按钮事件
	$(".remove-btn", line).click(function() {
		$.messager.confirm('确认', '您确定要删除记录？', function(r) {
			if (r) {
				rowCount--;
				delLine(line);
			}
		});
	});
	$.parser.parse(line);// 解析esayui标签
	table.append(line);
	if (data) {
		$("input[name='name']", line).val(data.name);
		$("input[name='path']", line).val(data.path);
		$("#type" + i + " option").each(function(j) {
			if (this.value == data.type) {
				this.selected = true;
			}
		});
		$("#removeEmptyType" + i + " option").each(function(j) {
			if (this.value == data.removeEmptyType) {
				this.selected = true;
			}
		});
		$("#isRepeat" + i + " option").each(function(j) {
			if (this.value == data.isRepeat) {
				this.selected = true;
			}
		});
	}
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
}

/**
 * 接口返回数据预览
 * 
 * @returns
 */
function previewWs() {
	Peony.progress();
	$.post("taskWs/preview", {
		url : $("input[name='url']").val(),
		reqType : $("#reqType").val(),
		postParams : $("input[name='postParams']").val(),
		returnType : $("#returnType").val()
	}, function(data) {
		Peony.closeProgress();
		if (data.info) {
			$("#preview_ws").val(data.info);
		} else {
			Peony.alert('提示', "数据预览失败——" + data.error, 'error');
		}

	});
}