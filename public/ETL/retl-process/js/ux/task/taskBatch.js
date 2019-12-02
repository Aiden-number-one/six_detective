var scon = [];// 目标数据连接选中值
var tcon = [];// 源数据连接选中值
var _data = new Array();
$(function() {
	var win = $.messager.progress({
		title : '请稍后',
		msg : '正在加载数据...'
	});
	$
			.ajax({
				type : "get",
				dataType : 'json',
				url : "task/taskListBatch.action?floderId=038d570fe3554ffca136d52988abf479",
				success : function(data) {
					loadData();
					delAllLine(true);
					// btnAdd();
					$.each(data.rows, function(i, btn) {
						addLine(i, btn);
					});
					$.messager.progress('close');
				}
			})
});

function loadData() {
	// 所属目录
	$.ajax({
		url : 'task/treeFolderBatch.action?id=NULL',
		type : "post",
		async : false,
		dataType : 'json',
		data : {},
		success : function(result) {
			_data[0] = result;
		}
	});
	// 数据连接--来源
	$.ajax({
		url : 'tbMdTable/listConnnectAllBacth.action',
		type : "post",
		async : false,
		dataType : 'json',
		data : {},
		success : function(result) {
			_data[1] = result;
		}
	});
	// 数据连接--目标
	$.ajax({
		url : 'tbMdTable/listConnnectBatch.action',
		type : "post",
		async : false,
		dataType : 'json',
		data : {},
		success : function(result) {
			_data[2] = result;
		}
	});
	// 目标写入前的操作
	$.ajax({
		url : 'sysDictionaryData/getValuesBatch.action?dictValue=BEFORE_RULE',
		type : "post",
		async : false,
		dataType : 'json',
		data : {},
		success : function(result) {
			_data[3] = result;
		}
	});
	//自动建表 
	$.ajax({
		url : 'sysDictionaryData/getValuesBatch.action?dictValue=TRUE_FLAG',
		type : "post",
		async : false,
		dataType : 'json',
		data : {},
		success : function(result) {
			_data[4] = result;
		}
	});
	//每次执行批次数  	
	$.ajax({
		url : 'sysDictionaryData/getValuesBatch.action?dictValue=SUBMIT_NUM',
		type : "post",
		async : false,
		dataType : 'json',
		data : {},
		success : function(result) {
			_data[5] = result;
		}
	});
	//提交方式  
	$.ajax({
		url : 'sysDictionaryData/getValuesBatch.action?dictValue=ROLLBACK_FLAG',
		type : "post",
		async : false,
		dataType : 'json',
		data : {},
		success : function(result) {
			_data[6] = result;
		}
	});
	
}

// 新增一行
$('#addLine_btn').unbind('click').click(function() {
	var rows = document.getElementById("btn-tb1").rows.length;
	addLine(rows - 1, '');
});
// 删除全部
$('#delAllLine_btn').unbind('click').click(function() {
	var table = $("#btn-tb1"); // 待操作表单
	var tab = document.getElementById("btn-tb1");
	var rows = tab.rows.length;
	if (rows > 1) {// 表头信息
		$.messager.confirm('确认', '您确定要删除记录？', function(r) {
			if (r) {
				delAllLine(true);
			}
		});
	} else {
		$.messager.alert('提示', "无待删除信息！", 'info');
	}
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
});

// 保存数据-数据抽取
function saveEBacth() {
	var rows = document.getElementById("btn-tb1").rows.length;
	var flag = true;
	for (var i = 0; i < rows - 1; i++) {
		if ($("#deleteFlag" + i).val() == undefined) { // 本行删除后
			rows = rows + 1;
			continue;
		}
		var taskNo = $("#taskNo" + i).val();
		var taskName = $("#taskName" + i).val();
		if (taskNo === '' && taskName === '') { // 当都为空时跳过忽略
			continue;
		} else {
			var folderId = $("#folderId" + i).combobox('getValue');
			var sourceConnection = $("#sourceConnection" + i).combobox(
					'getValue');
			var sourceTables = $("#sourceTables" + i).combobox('getValue');
			var targetConnection = $("#targetConnection" + i).combobox(
					'getValue');
			var targetTable = $("#targetTable" + i).combobox('getValue');
			var brforeRule = $("#brforeRule" + i).combobox('getValue');
			if (folderId === '') {
				alert("『所属目录』不能为空！");
				flag = false;
			} else if (taskNo === '') {
				alert("『任务编号』不能为空！");
				flag = false;
			} else if (taskName === '') {
				alert("『任务名称』不能为空！");
				flag = false;
			} else if (sourceConnection === '') {
				alert("『源数据连接』不能为空！");
				flag = false;
			} else if (sourceTables === '') {
				alert("『源表』不能为空！");
				flag = false;
			} else if (targetConnection === '') {
				alert("『目标数据连接』不能为空！");
				flag = false;
			} else if (targetTable === '') {
				alert("『目标表』不能为空！");
				flag = false;
			} else if (brforeRule === '') {
				alert("『目标写入前操作』不能为空！");
				flag = false;
			}
			if (!flag)
				break;
		}
		var del = $("#deleteSql" + i).val(); // 目标删除语句
		if (del != null && del != '') {
			if (del.indexOf(",") > 0) {// 包含逗号，暂时替换为中文逗号
				del = del.replace(/,/g, "，");
			}
			$("#deleteSql2" + i).val(del);
		}
		var tsql = $("#transScript" + i).val(); // 源表查询语句
		if (tsql != null && tsql != '') {
			if (tsql.indexOf(",") > 0) {// 包含逗号，暂时替换为中文逗号
				tsql = tsql.replace(/,/g, "，");
			}
			$("#transScript" + i).val(tsql);
		}
//		var ifCheck;
//		var rep = $('#rollbackFlag' + i).is(':checked');// 是否选中
//		if (rep) {
//			ifCheck = "T";
//		} else {
//			ifCheck = "F";
//		}
//		$("#rollbackFlag" + i).val(ifCheck);
	}
	if (flag) {
		var data = $('#formEBatch').serialize();
		$.ajax({
			type : "POST",
			url : "task/saveTaskEBatch.action",
			data : data,
			success : function(msg) {
				$.messager.alert('提示', "保存成功", 'info');
				window.location.href = "task/list.action";
			}
		});
	}
}
// 返回主页面
function gobackTask() {
	window.location.href = "task/list.action";
}

function addLine(i, data) {
	var table = $("#btn-tb1");
	var tab = document.getElementById("btn-tb1");
	var rows = tab.rows.length;
	var html = "<tr class='tb-line bor_no'>";
	// 序号
	html += "	<td><span style=\"display:block;text-align: center\">" + rows
			+ "</span></td>";
	// 所属目录
	html += "	<td style=\"width:140px;\"><input class=\"easyui-combotree\" name=\"folderId\" id=\"folderId"
			+ i
			+ "\" type=\"text\" style=\"width:140px;height:25px;\">"
			+ "</td>";
	// 编号
	html += "	<td style=\"width:80px;\"><input name=\"taskNo\" id=\"taskNo" + i
			+ "\" class=\"Task-number form-control\" type=\"text\"></td>";
	// 名称
	html += "	<td style=\"width:115px;\"><input name=\"taskName\" id=\"taskName"
			+ i + "\" class=\"Task-number form-control\" type=\"text\"></td>";
	// 源数据连接
	html += "	<td style=\"width:130px;\"><input class=\"easyui-combobox form-control\" name=\"sourceConnection\" id=\"sourceConnection"
			+ i + "\" type=\"text\" style=\"height:25px;width:130px;\"></td>";
	// 源表
	html += "	<td style=\"width:156px;\"><input class=\"easyui-combobox form-control\" name=\"sourceTables\" id=\"sourceTables"
			+ i + "\" type=\"text\" style=\"height:25px;width:156px;\"></td>";
	// 源表查询语句
	html += "	<td  style=\"width:170px;\"><textarea class=\"form-control text_control\"  name=\"transScript\"  id=\"transScript"
			+ i
			+ "\" rows=\"3\" style=\"height:25px;width:170px;\"></textarea></td>";
	// 目标数据连接
	html += "	<td style=\"width:130px;\"><input class=\"easyui-combobox form-control\" name=\"targetConnection\" id=\"targetConnection"
			+ i + "\" type=\"text\" style=\"height:25px;width:130px;\"></td>";
	// 目标表
	html += "	<td style=\"width:160px;\"><input class=\"easyui-combobox form-control\" name=\"targetTable\" id=\"targetTable"
			+ i + "\" type=\"text\" style=\"height:25px;width:160px;\"></td>";
	// 每批提交行数
	html += "	<td style=\"width:70px;\"><input class=\"easyui-combobox form-control\"  name=\"submitNum2\"  id=\"submitNum"
			+ i + "\" type=\"text\" style='width:70px;height:25px;' ></td>";
	// 失败后回滚-提交方式
	html += "	<td style=\"width:70px;\"><input class=\"easyui-combobox form-control\" name=\"rollbackFlag\" id=\"rollbackFlag"
			+ i + "\" type=\"text\" style=\"height:25px;width:75px;\"></td>";
	// 写入前操作
	html += "	<td style=\"width:110px;\"><input class=\"easyui-combobox  form-control\" name=\"brforeRule\" id=\"brforeRule"
			+ i + "\" type=\"text\" style=\"height:25px;width:110px;\"></td>";
	// 批次字段
	html += "	<td style=\"width:90px;\"><input class=\"hidden\" type=\"text\" name=\"keyField\" id=\"keyFieldx"
			+ i
			+ "\"><input class=\"easyui-combobox  form-control\"  id=\"keyField"
			+ i
			+ "\" type=\"text\" "
			+ " style=\"height:25px;width:90px;\"></td>";
	// 目标表删除语句
	html += "	<td  style=\"width:170px;\"><input class=\"hidden\" type=\"text\" name=\"deleteSql\" id=\"deleteSql2"
			+ i
			+ "\" value=\"0\"><input class=\"hidden\" type=\"text\" name=\"deleteScript\" id=\"deleteScript"
			+ i
			+ "\"><textarea class=\"form-control text_control\"  id=\"deleteSql"
			+ i
			+ "\" rows=\"3\" style=\"height:25px;width:170px;\"></textarea></td>";
	//自动建表
	html += "	<td style=\"width:60px;\"><input class=\"easyui-combobox form-control\" name=\"targetTableFlag\" id=\"targetTableFlag"
			+ i + "\" type=\"text\" style=\"height:25px;width:60px;\"></td>";
	html += "	<td><a class=\"easyui-linkbutton remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
	html += "	<input class=\"hidden\" name=\"deleteFlag\" id=\"deleteFlag" + i
			+ "\">";
	html += "	</td>";
	html += "</tr>";
	var line = $(html);
	// 版定删除按钮事件
	$(".remove-btn", line).click(function() {
		$.messager.confirm('确认', '您确定要删除记录？', function(r) {
			if (r) {
				delLine(line);
			}
		});
	});

	$.parser.parse(line);// 解析esayui标签
	table.append(line);
	// 加载下拉框信息
	if (i == 0) {
		initEInfoFirst(i);
	} else {
		initEInfo(i);
	}
	var s = $('#targetConnection' + i).combobox('getValue');
	var t = $('#sourceConnection' + i).combobox('getValue');
	scon[i] = s;
	tcon[i] = t;
}

// 删除全部
function delAllLine(b) {
	if (b) {
		$(".tb-line").each(function(i, line) {
			delLine($(line));
		});
	}
}
// 删除单行
function delLine(line) {
	if (line) {
		line.fadeOut("fast", function() {
			$("input[name='deleteFlag']", line).val(1); // 设置删除状态
			$(this).remove();
		});
	}
}

// 竖向目标表事件
function editOtherTable(i, data) {
	for (var j = i + 1; i < scon.length; j++) {
		if (scon[j] == '-1') {
			$("#targetTable" + j).combobox("clear").combobox('loadData', data);
		} else {
			break;
		}
	}
}
// 竖向源表事件
function editOtherSourceTable(i, data) {
	for (var j = i + 1; i < tcon.length; j++) {
		if (tcon[j] == '-1') {
			$("#sourceTables" + j).combobox("clear").combobox('loadData', data);
		} else {
			break;
		}
	}
}
//加载第一行数据
function initEInfoFirst(i) {
	// 所属目录
	$('#folderId' + i).combotree({
		data : _data[0],
		required : true
	});
	// 数据连接--来源
	$("#sourceConnection" + i).combobox(
			{
				valueField : 'connectionId',
				textField : 'connectionName',
				editable : false,// 不可编辑
				required : true,
				data : _data[1],
				onChange : function(newValue, oldValue) {
					tcon[i] = newValue;
					$.get('tbMdTable/connnectTable.action', {
						id : newValue
					}, function(data) {
						var sinfo = $("#sourceTables" + i).combobox('getText');// 当前table值信息
						if (sinfo != "") {
							$("#sourceTables" + i).combobox("clear").combobox(
									'loadData', data)
									.combobox('setText', sinfo);
						} else {
							$("#sourceTables" + i).combobox("clear").combobox(
									'loadData', data);
						}
						editOtherSourceTable(i, data);
					}, 'json');
				}
			});

	// 来源表
	var sourceTables = $("#sourceTables" + i).combobox({
		method : 'get',
		valueField : 'stname',
		textField : 'stname',
		panelHeight : '150',
		required : true
	});
	// 数据连接--目标
	$("#targetConnection" + i).combobox(
			{
				valueField : 'connectionId',
				textField : 'connectionName',
				editable : false,// 不可编辑
				required : true,
				data : _data[2],
				onChange : function(newValue, oldValue) {
					$("#targetCon").val(newValue);
					scon[i] = newValue;
					$.get('tbMdTable/connnectTable.action', {
						id : newValue
					}, function(data) {
						var tinfo = $("#targetTable" + i).combobox('getText');// 当前table值信息
						var kId = $("#keyField" + i).combobox('getText');// 当前关键字信息
						$("#kId").val(kId);
						if (tinfo != "") {
							$("#targetTable" + i).combobox("clear").combobox(
									'loadData', data)
									.combobox('setText', tinfo);
						} else {
							$("#targetTable" + i).combobox("clear").combobox(
									'loadData', data);
						}
						// 更改竖向其他目标表的数值
						editOtherTable(i, data);
					}, 'json');
				}
			});

	// 目标表
	var targetTable = $("#targetTable" + i).combobox(
			{
				valueField : 'stname',
				textField : 'stname',
				required : true,
				onChange : function(newValue, oldValue) {
					var tCon = $("#targetCon").val();
					var kId = $("#keyField" + i).combobox('getText');
					$.get('tbMdTable/getColumns.action', {
						tableName : newValue,
						connectionId : tCon
					}, function(data) {
						if (kId != "") {
							$("#keyField" + i).combobox("clear").combobox(
									'loadData', data).combobox('setText', kId);
						} else {
							$("#keyField" + i).combobox("clear").combobox(
									'loadData', data);
						}
					}, 'json');
				}
			});
	// 目标写入前的操作
	$("#brforeRule" + i).combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		required : true,
		data : _data[3],
		onChange : function(newValue, oldValue) {
			ttableInfo(newValue, i);
		},
		onLoadSuccess: function () {
			$("#brforeRule" + i).combobox("setValue", '1');  
			ttableInfo('1', i);
		}
	});
	// 关键字
	var keyField = $("#keyField" + i).combobox({
		valueField : 'columnName',
		textField : 'columnName',
		onChange : function(newValue, oldValue) {
			// keyInfo(i);
			keyInfo(i, newValue);
		}
	});
	// 自动建表
	$("#targetTableFlag" + i).combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		required : false,
		data : _data[4],
		value : 'F'
	});
	// 每批提交行数
	$("#submitNum" + i).combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		required : false,
		data : _data[5],
		value : '5000'
	});
	// 提交方式-回滚
	$("#rollbackFlag" + i).combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		required : false,
		data : _data[6],
		value : 'T'
	});
}
function initEInfo(i) {
	// 所属目录
	$('#folderId' + i).combotree({
		data : _data[0],
		value : '-1',
		required : true
	});
	// 数据连接--来源
	$("#sourceConnection" + i).combobox(
			{
				valueField : 'connectionId',
				textField : 'connectionName',
				editable : false,// 不可编辑
				required : true,
				data : _data[1],
				value : '-1',
				onChange : function(newValue, oldValue) {
					tcon[i] = newValue;
					$.get('tbMdTable/connnectTable.action', {
						id : newValue
					}, function(data) {
						var sinfo = $("#sourceTables" + i).combobox('getText');// 当前table值信息
						if (sinfo != "") {
							$("#sourceTables" + i).combobox("clear").combobox(
									'loadData', data)
									.combobox('setText', sinfo);
						} else {
							$("#sourceTables" + i).combobox("clear").combobox(
									'loadData', data);
						}
						editOtherSourceTable(i, data);
					}, 'json');
				}
			});

	// 来源表
	var sourceTables = $("#sourceTables" + i).combobox({
		method : 'get',
		valueField : 'stname',
		textField : 'stname',
		panelHeight : '150',
		required : true
	});
	// 数据连接--目标
	$("#targetConnection" + i).combobox(
			{
				valueField : 'connectionId',
				textField : 'connectionName',
				editable : false,// 不可编辑
				required : true,
				data : _data[2],
				value : '-1',
				onChange : function(newValue, oldValue) {
					$("#targetCon").val(newValue);
					scon[i] = newValue;
					$.get('tbMdTable/connnectTable.action', {
						id : newValue
					}, function(data) {
						var tinfo = $("#targetTable" + i).combobox('getText');// 当前table值信息
						var kId = $("#keyField" + i).combobox('getText');// 当前关键字信息
						$("#kId").val(kId);
						if (tinfo != "") {
							$("#targetTable" + i).combobox("clear").combobox(
									'loadData', data)
									.combobox('setText', tinfo);
						} else {
							$("#targetTable" + i).combobox("clear").combobox(
									'loadData', data);
						}
						// 更改竖向其他目标表的数值
						editOtherTable(i, data);
					}, 'json');
				}
			});

	// 目标表
	var targetTable = $("#targetTable" + i).combobox(
			{
				valueField : 'stname',
				textField : 'stname',
				required : true,
				onChange : function(newValue, oldValue) {
					var tCon = $("#targetCon").val();
					var kId = $("#keyField" + i).combobox('getText');
					$.get('tbMdTable/getColumns.action', {
						tableName : newValue,
						connectionId : tCon
					}, function(data) {
						if (kId != "") {
							if (kId == "同上") {
								$("#keyField" + i).combobox("clear").combobox(
										'loadData', data).combobox('setValue',
										'-1').combobox('setText', kId);
							} else {
								$("#keyField" + i).combobox("clear").combobox(
										'loadData', data).combobox('setText',
										kId);
							}
						} else {
							$("#keyField" + i).combobox("clear").combobox(
									'loadData', data);
						}
					}, 'json');
				}
			});
	// 目标写入前的操作
	$("#brforeRule" + i).combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		required : true,
		data : _data[3],
		value : '-1',
		onChange : function(newValue, oldValue) {
			ttableInfo(newValue, i);
		}
	});
	// 关键字
	var keyField = $("#keyField" + i).combobox({
		valueField : 'columnName',
		textField : 'columnName',
		onChange : function(newValue, oldValue) {
			keyInfo(i, newValue);
		}
	});
	$("#keyField" + i).combobox('setValue', '-1').combobox('setText', '同上');
	$('#keyFieldx' + i).val("-1");
	
	// 自动建表
	$("#targetTableFlag" + i).combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		required : false,
		data : _data[4],
		value : '-1'
	});
	// 每批提交行数
	$("#submitNum" + i).combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		required : false,
		data : _data[5],
		value : '-1'
	});
	// 提交方式-回滚
	$("#rollbackFlag" + i).combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		required : false,
		data : _data[6],
		value : '-1'
	});
}
// 表中下拉数据处理
// 目标表删除语句--删除前操作类型和关键字是否为必填项变化
function ttableInfo(id, i) {
	var str;
	var ttable = $("#targetTable" + i).combobox('getText');
	var tkey = $("#keyField" + i).combobox('getText');
	var kId = $("#kId").val();
	// var fordeleteSql=$("#fordeleteSql").val();
	if (id == '1') {// 不删除
		$("#deleteSql" + i).val("");// 删除语句为空且不可编辑
		$('#deleteSql' + i).attr("disabled", true);
		// $("#keyField").combobox({required:false,value : tkey});
		$('#keyField' + i).combobox('setValue', '').combobox('setText', '');// 关键批次字段为空，且不可选择编辑
		$('#keyField' + i).combobox("disable");
		$('#keyFieldx' + i).val("0");
		$("#deleteSql2" + i).val("0");
		$("#deleteScript" + i).val("");
	} else if (id == '2') {// 清空目标表
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		$("#deleteSql" + i).val(str);
		$('#deleteSql' + i).attr("disabled", false);// 删除语句可编辑
		$('#keyField' + i).combobox('setValue', '').combobox('setText', '');// 关键批次字段为空，且不可选择编辑
		$('#keyField' + i).combobox("disable");
		$('#keyFieldx' + i).val("0");
		$("#deleteSql2" + i).val(str);
		$("#deleteScript" + i).val("DELETE  FROM  目标表名");
	} else if (id == '3') {// 删除已有
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		if (tkey == null || tkey == '') {
			if (kId == null || kId == '') {
				str = str + " WHERE 关键字段  IN (SELECT 关键字段  FROM (源表查询语句))";
			} else {
				str = str + " WHERE " + kId + "  IN (SELECT " + kId
						+ "  FROM (源表查询语句))";
			}
		} else {
			str = str + " WHERE " + tkey + "  IN (SELECT " + tkey
					+ "  FROM (源表查询语句))";
		}
		$("#deleteSql" + i).val(str);
		$("#deleteSql2" + i).val(str);
		$("#deleteScript" + i)
				.val(
						"DELETE  FROM  目标表名  WHERE 关键字段  IN (SELECT 关键字段  FROM (源表查询语句))");
		$('#deleteSql' + i).attr("disabled", false);// 删除语句可编辑
		$('#keyField' + i).combobox("enable");// 关键批次可选择编辑
		if (tkey == null || tkey == '') {
			if (kId == null || kId == '') {
				$('#keyField' + i).combobox('setValue', '').combobox('setText',
						'');
				$('#keyFieldx' + i).val("0");
			} else {
				$('#keyField' + i).combobox('setValue', kId).combobox(
						'setText', kId);
				$('#keyFieldx' + i).val(kId);
			}
		} else {
			$('#keyField' + i).combobox('setValue', tkey).combobox('setText',
					tkey);
			$('#keyFieldx' + i).val(tkey);
		}
	} else if (id == '4') {// 删除本批次
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		if (tkey == null || tkey == '') {
			if (kId == null || kId == '') {
				str = str + " WHERE 关键字段  = ${HDIBATCHNO}";
			} else {
				str = str + " WHERE " + kId + " =  ${HDIBATCHNO}";
			}
		} else {
			str = str + " WHERE " + tkey + " =  ${HDIBATCHNO}";
		}
		$("#deleteSql" + i).val(str);
		$("#deleteSql2" + i).val(str);
		$("#deleteScript" + i).val(
				"DELETE  FROM  目标表名  WHERE 关键字段  = ${HDIBATCHNO}");
		$('#deleteSql' + i).attr("disabled", false);// 删除语句可编辑
		$('#keyField' + i).combobox("enable");// 关键批次可选择编辑
		if (tkey == null || tkey == '') {
			if (kId == null || kId == '') {
				$('#keyField' + i).combobox('setValue', '').combobox('setText',
						'');
				$('#keyFieldx' + i).val("0");
			} else {
				$('#keyField' + i).combobox('setValue', kId).combobox(
						'setText', kId);
				$('#keyFieldx' + i).val(kId);
			}
		} else {
			$('#keyField' + i).combobox('setValue', tkey).combobox('setText',
					tkey);
			$('#keyFieldx' + i).val(tkey);
		}
	} else if (id == '5') {// 自定义
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		$("#deleteSql" + i).val(str);
		$("#deleteSql2" + i).val(str);
		$("#deleteScript" + i).val("DELETE  FROM  目标表名");
		$('#deleteSql' + i).attr("disabled", false);// 删除语句可编辑
		$('#keyField' + i).combobox("disable");// 关键批次不可选择编辑
		$('#keyField' + i).combobox('setValue', '').combobox('setText', '');// 关键批次字段为空，且不可选择编辑
		$('#keyFieldx' + i).val("0");
	}
}
// 目标表删除语句--关键字变化
function keyInfo(i, newValue) {
	var str;
	var id = $("#brforeRule" + i).combobox('getValue');
	var ttable = $("#targetTable" + i).combobox('getText');
	var tkey = $("#keyField" + i).combobox('getText');
	var kId = $("#kId").val();
	$('#keyFieldx' + i).val(newValue);
	if (id == '1') {// 不删除
		$("#deleteSql").val("");
		$("#deleteSql2" + i).val("0");
	} else if (id == '2') {// 清空目标表
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		$("#deleteSql" + i).val(str);
		$("#deleteSql2" + i).val(str);
	} else if (id == '3') {// 删除已有
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		if (tkey == null || tkey == '') {
			if (kId == null || kId == '') {
				str = str + " WHERE 关键字段  IN (SELECT 关键字段  FROM (源表查询语句))";
			} else {
				str = str + " WHERE " + kId + "  IN (SELECT " + kId
						+ "  FROM (源表查询语句))";
			}
		} else {
			str = str + " WHERE " + tkey + "  IN (SELECT " + tkey
					+ "  FROM (源表查询语句))";
		}
		$("#deleteSql" + i).val(str);
		$("#deleteSql2" + i).val(str);
	} else if (id == '4') {// 删除本批次
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		if (tkey == null || tkey == '') {
			if (kId == null || kId == '') {
				str = str + " WHERE 关键字段  = ${HDIBATCHNO}";
			} else {
				str = str + " WHERE " + kId + " =  ${HDIBATCHNO}";
			}
		} else {
			str = str + " WHERE " + tkey + " =  ${HDIBATCHNO}";
		}
		$("#deleteSql" + i).val(str);
		$("#deleteSql2" + i).val(str);
	} else if (id == '5') {// 自定义
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		$("#deleteSql" + i).val(str);
		$("#deleteSql2" + i).val(str);
	}
}
