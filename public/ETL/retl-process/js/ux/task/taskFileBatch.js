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
					delAllLine(true);
					$.each(data.rows, function(i, btn) {
						addLine(i, btn);
					});

					$.messager.progress('close');
				}
			})
});

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
});

// 保存数据-数据抽取
function saveSQLBacth() {
	if ($("#formFileBatch").form('validate')) {// 启用校验
		var rows = document.getElementById("btn-tb1").rows.length;
		for (var i = 0; i < rows - 1; i++) {
			var del = $("#command" + i).val(); // 查询语句
			if (del != null && del != '') {
				if (del.indexOf(",") > 0) {// 包含逗号，暂时替换为中文逗号
					del = del.replace(/,/g, "，");
				}
				$("#commandx" + i).val(del);
			}
			var ts = $('#taskSeparator' + i).combobox('getValue');// 分隔符
			if (ts == ',') {
				$("#taskSeparatorx" + i).val("a");
			} else {
				$("#taskSeparatorx" + i).val(ts);
			}
			var cc = $('#closeCharacter' + i).val();// 封闭符
			if (cc == ',') {
				$("#closeCharacterx" + i).val("a");
			} else {
				$("#closeCharacterx" + i).val(cc);
			}
			var ifcatalogFlag, ifaddFlag, ifheadFlag;
			var rep = $('#catalogFlag' + i).is(':checked');// 是否选中
			if (rep) {
				ifcatalogFlag = "Y";
			} else {
				ifcatalogFlag = "N";
			}
			var rep2 = $('#addFlag' + i).is(':checked');// 是否选中
			if (rep2) {
				ifaddFlag = "Y";
			} else {
				ifaddFlag = "N";
			}
			var rep3 = $('#headFlag' + i).is(':checked');// 是否选中
			if (rep3) {
				ifheadFlag = "Y";
			} else {
				ifheadFlag = "N";
			}
			$("#catalogFlagx" + i).val(ifcatalogFlag);
			$("#addFlagx" + i).val(ifaddFlag);
			$("#headFlagx" + i).val(ifheadFlag);
		}
		var data = $('#formFileBatch').serialize();
		if (data == null || data == '') {
			$.messager.alert('提示', "请添加待保存任务信息.", 'waring');
		} else {
			$.ajax({
				type : "POST",
				url : "task/saveTaskFileBatch.action",
				data : data,
				success : function(msg) {
					$.messager.alert('提示', "保存成功", 'info');
					window.location.href = "task/list.action";
				}
			});
		}
	} else {
		$.messager.alert('提示', "有非空字段需要填写，请检查.", 'waring');
	}
}
// 返回主页面
function gobackTask() {
	this.location.href = "task/list.action";
}

function addLine(i, data) {
	var table = $("#btn-tb1");
	var tab = document.getElementById("btn-tb1");
	var rows = tab.rows.length;
	var html = "<tr class='tb-line bor_no'>";
	// 序号
	html += "	<td width=\"40px\"><span style=\"width:40px;display:block;text-align: center\">"
			+ rows + "</span></td>";
	// 所属目录
	html += "	<td width=\"170px\">"
			+ "<input class=\"easyui-combotree\" name=\"folderId\" id=\"folderId"
			+ i + "\" type=\"text\" " + "data-options=\"\" "
			+ " style=\"width:150px;height:24px;\">" + "</td>";
	// 编号
	html += "	<td width=\"115px\"><input name=\"taskNo\" id=\"taskNo"
			+ i
			+ "\" class=\"easyui-validatebox Task-number form-control\" type=\"text\" style=\"width:110px;\" data-options=\"required:true\"></td>";
	// 名称
	html += "<td width=\"115px\">"
			+ "<input name=\"taskName\" id=\"taskName"
			+ i
			+ "\" class=\"easyui-validatebox Task-number form-control\" type=\"text\" style=\"width:110px;\" data-options=\"required:true\"></td>";
	// 数据连接
	html += "<td width=\"170px\">"
			+ "<input class=\"easyui-combobox  form-control\" name=\"dbConnection\" id=\"dbConnection"
			+ i + "\" type=\"text\" " + "data-options=\" \" "
			+ " style=\"width:170px;height:24px;\">" + "</td>";
	// 查询语句
	html += "<td width=\"170px\">"
			+ "<input class=\"hidden\" type=\"text\" name=\"command\" id=\"commandx"
			+ i + "\" value=\"0\"> "
			+ "<textarea class=\"form-control  text_control\"  id=\"command"
			+ i
			+ "\" rows=\"3\" style=\"width:170px;height:24px;\"></textarea>"
			+ "</td>";
	// 导出文件类型
	html += "<td width=\"170px\">"
			+ "<input class=\"easyui-combobox  form-control\" name=\"extendName\" id=\"extendName"
			+ i + "\" type=\"text\" " + "data-options=\"\" "
			+ " style=\"width:170px;height:24px;\">" + "</td>";
	// 导出文件名
	html += "<td width=\"115px\">"
			+ "<input name=\"exportName\" id=\"exportName"
			+ i
			+ "\" class=\"easyui-validatebox Task-number form-control\" type=\"text\" style=\"width:110px;\" data-options=\"required:true\"></td>";
	// 创建父目录
	html += "<td>"
			+ "<input class=\"hidden\" type=\"text\" name=\"catalogFlag\" id=\"catalogFlagx"
			+ i
			+ "\"> "
			+ "<input type=\"checkbox\"   id=\"catalogFlag"
			+ i
			+ "\" value=\"Y\"  checked=\"checked\" style=\"width:80px;height:12px;\" > "
			+ "</td>";
	// 追加方式
	html += "<td>"
			+ "<input class=\"hidden\" type=\"text\" name=\"addFlag\" id=\"addFlagx"
			+ i
			+ "\"> "
			+ "<input type=\"checkbox\"   id=\"addFlag"
			+ i
			+ "\" value=\"Y\"  checked=\"checked\" style=\"width:80px;height:12px;\" > "
			+ "</td>";
	// 头部
	html += "<td width=\"50px\">"
			+ "<input class=\"hidden\" type=\"text\" name=\"headFlag\" id=\"headFlagx"
			+ i
			+ "\"> "
			+ "<input type=\"checkbox\"   id=\"headFlag"
			+ i
			+ "\" value=\"Y\"  checked=\"checked\" style=\"width:50px;height:12px;\" > "
			+ "</td>";
	// 分隔符
	html += "<td width=\"170px\">"
			+ "<input class=\"hidden\" type=\"text\" name=\"taskSeparator\" id=\"taskSeparatorx"
			+ i
			+ "\"> "
			+ "<input class=\"easyui-combobox  form-control\"  id=\"taskSeparator"
			+ i + "\" type=\"text\" " + "data-options=\"\" "
			+ " style=\"width:150px;height:24px;\">" + "</td>";
	// 封闭符
	html += "<td width=\"115px\">"
			+ "<input class=\"hidden\" type=\"text\" name=\"closeCharacter\" id=\"closeCharacterx"
			+ i
			+ "\"> "
			+ "<input  id=\"closeCharacter"
			+ i
			+ "\" class=\"easyui-validatebox Task-number form-control\" type=\"text\" "
			+ "style=\"width:124px;\" data-options=\"required:true\" maxlength=\"10\" value=\"''\"></td>";
	// 格式
	html += "<td width=\"170px\">"
			+ "<input class=\"easyui-combobox  form-control\" name=\"formatType\" id=\"formatType"
			+ i + "\" type=\"text\" " + "data-options=\"\" "
			+ " style=\"width:170px;height:24px;\">" + "</td>";
	// 编码
	html += "<td width=\"115px\">"
			+ "<input class=\"easyui-combobox  form-control\" name=\"codeType\" id=\"codeType"
			+ i + "\" type=\"text\" " + "data-options=\"\" "
			+ " style=\"width:150px;height:24px;\">" + "</td>";
	// 添加文本结束行
	html += "<td width=\"170px\">"
			+ "<input name=\"fileendinfo\" id=\"fileendinfo"
			+ i
			+ "\" class=\"easyui-validatebox Task-number form-control\" type=\"text\" style=\"width:110px;\"></td>";
	// 操作
	html += "	<td width=\"50px\"><a class=\"easyui-linkbutton remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
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
		initFileInfoFirst(i);
	} else {
		initFileInfo(i);
	}
	$("#commandx" + i).val("0");// 默认值为0，为后台拼接字符串使用
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
			$(this).remove();
		});
	}
}

function initFileInfoFirst(i) {
	// 所属目录
	$('#folderId' + i).combotree({
		url : "task/treeFolder.action?id=NULL",
		required : true
	});
	// 数据连接
	$("#dbConnection" + i).combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		required : true,
		url : 'tbMdTable/listConnnectAll.action'
	});
	// 导出文本类型
	$("#extendName" + i).combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=EXTEND_NAME',
		editable : false,
		required : true,
		valueField : 'dictdataName',
		textField : 'dictdataName'
	});
	// 分隔符
	$("#taskSeparator" + i).combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=CON_SEPARATOR',
		editable : true,
		required : true,
		valueField : 'dictdataName',
		textField : 'dictdataName'
	});
	// 导出文本格式
	$("#formatType" + i).combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FORMAT_TYPE',
		editable : false,
		required : true,
		valueField : 'dictdataValue',
		textField : 'dictdataName'
	});
	// 编码
	$("#codeType" + i).combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FILE_CHARSET',
		editable : true,
		required : true,
		valueField : 'dictdataName',
		textField : 'dictdataName'
	});

}
function initFileInfo(i) {
	// 所属目录
	$('#folderId' + i).combotree(
			{
				url : "task/treeFolderBatch.action?id=NULL",
				required : true,
				onLoadSuccess : function() {
					$('#folderId' + i).combotree('setValue', '-1').combotree(
							'setText', '同上');
				}
			});
	// 数据连接
	$("#dbConnection" + i).combobox(
			{
				valueField : 'connectionId',
				textField : 'connectionName',
				editable : false,// 不可编辑
				required : true,
				url : 'tbMdTable/listConnnectAllBacth.action',
				onLoadSuccess : function() {
					$('#dbConnection' + i).combobox('setValue', '-1').combobox(
							'setText', '同上');
				}
			});
	// 导出文本类型
	$("#extendName" + i)
			.combobox(
					{
						url : 'sysDictionaryData/getValuesBatch.action?dictValue=EXTEND_NAME',
						editable : false,
						required : true,
						valueField : 'dictdataName',
						textField : 'dictdataName',
						onLoadSuccess : function() {
							$('#extendName' + i).combobox('setValue', '-1')
									.combobox('setText', '同上');
						}
					});
	// 分隔符
	$("#taskSeparator" + i)
			.combobox(
					{
						url : 'sysDictionaryData/getValuesBatch.action?dictValue=CON_SEPARATOR',
						editable : true,
						required : true,
						valueField : 'dictdataName',
						textField : 'dictdataName',
						onLoadSuccess : function() {
							$('#taskSeparator' + i).combobox('setValue', '-1')
									.combobox('setText', '同上');
						}
					});
	// 导出文本格式
	$("#formatType" + i)
			.combobox(
					{
						url : 'sysDictionaryData/getValuesBatch.action?dictValue=FORMAT_TYPE',
						editable : false,
						required : true,
						valueField : 'dictdataValue',
						textField : 'dictdataName',
						onLoadSuccess : function() {
							$('#formatType' + i).combobox('setValue', '-1')
									.combobox('setText', '同上');
						}
					});
	// 编码
	$("#codeType" + i)
			.combobox(
					{
						url : 'sysDictionaryData/getValuesBatch.action?dictValue=FILE_CHARSET',
						editable : true,
						required : true,
						valueField : 'dictdataName',
						textField : 'dictdataName',
						onLoadSuccess : function() {
							$('#codeType' + i).combobox('setValue', '-1')
									.combobox('setText', '同上');
						}
					});
}
