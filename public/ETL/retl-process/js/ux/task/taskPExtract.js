var _taskEType;//页面数据来源-转换任务或作业流程
$(function() {
	_taskEType=$("#_taskEType").val();
});

//打开存储过程信息窗口。
function addProcedure() {
	initProcedure();
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName=$("#search_folderName").val();//当前所属文件夹名称
	_id = sfolderId;
	_text= sfolderName;
	getTreeInfo("folderId5");
	getTreeFolder("folderId5");
	delAllLine(true);
	btnAdd();
	$("#fromResultP").trigger("click");
	$('#t_newTask_stored').window('open');
	$("#ptabs").tabs('select', "基本信息");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
};
//按钮--添加一行和删除绑定
function btnAdd() {
	$('#addLine_btn').unbind('click').click(addLine); // 新增一行
	$('#delAllLine_btn').unbind('click').click(function() {// 删除全部
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
}
//保存存储过程
function saveProcedure() {
	var taskNo;
	var taskName;
	var NoName;
	var taskId;
	if(_taskEType == 'forJob'){//来自作业流程页面
		 taskNo = $("#taskNo5").val();
		 taskName = $("#taskName5").val();
		 NoName = "【" + taskNo + "】" + taskName;
		 taskId = $("#taskId5").val();
	}
	if ($("#formP").form('validate')) {// 启用校验
		var data = $('#formP').serialize();
		$.ajax({
			type : "POST",
			url : "task/saveP.action",
			data : data,
			success : function(msg) {
				$.messager.alert('提示', "保存成功！", 'info');
				$("#fromResult").trigger("click");
				$('#t_newTask_stored').window('close');
				//保存后信息处理
				if(_taskEType == 'forTask'){
					sqlWhere();
				}else if(_taskEType == 'forJob'){
					var tid = msg.taskId;
					// 判断是否需要重新加载下拉框数据
					var taskNoName = $("#taskNoName5").val();
					if (taskNoName != NoName) {
						// 重新加载下拉框信息
						$("#i_nodeItem_id5").combobox(
								{
									valueField : 'id',
									textField : 'name',
									editable : true,
									url : 'job/taskList.action?type=5',
									onLoadSuccess : function() {
										var data = $('#i_nodeItem_id5').combobox(
												'getData');
										if (data.length > 0) {
											$('#i_nodeItem_id5').combobox('select',
													tid);
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
//取消
function cancelProcedure() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultP").trigger("click");
			$('#t_newTask_stored').window('close');
		}
	});
}

//编辑变量
function editTaskP(tid, ttype,url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$("#fromResultP").trigger("click");
			initProcedure();
			var conId = data.data.dbConnection;
			$("#procedureName5").combobox({
				valueField : 'name',
				textField : 'name',
				editable : true,// 可编辑
				url : 'dbConnection/getProNames.action?conId=' + conId,
				onChange : function(newValue, oldValue) {
					$.ajax({
						type : "POST",
						url : "dbConnection/getcolumnList.action",
						dataType : "json",
						data : {
							conId : conId,
							proName : newValue
						},
						success : function(msg) {
							delAllLine(true);
							for (var int = 0; int < msg.length; int++) {
								addLine(int + 1, msg[int]);
							}
						}
					});
				}
			});
			getTreeInfo("folderId5");
			$("#formP").form('myLoad', data.data);
			$("#taskId5").val(data.data.taskId);
			$('#folderId5').combotree('setValue', data.data.folderId);
			delAllLine(true);
			btnAdd();
			$.each(data.data.paraList, function(i, btn) {
				addLine(i, btn);
			});
			$(".validatebox-tip").remove();
			$(".tooltip").removeClass("tooltip tooltip-right");
			$('#t_newTask_stored').window('open');
			$('#forRModuleNameP').val('TASKP');
			$('#forRTableNameP').val('TB_TASK_P');
		}
	});
}
//加载存储过程信息
function initProcedure() {
	// 数据连接--存储过程
	var dbConnection2 = $("#dbConnection5").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		url : 'tbMdTable/listConnnect.action',
		onLoadSuccess : onLoadSuccess5,
		onChange : function(newValue, oldValue) {
			//清空原有数据
			$("#procedureName5").combobox("loadData", []);
			// 当数据连接改变时，相应的存储过程名字也改变
			var conId = newValue;
			$("#procedureName5").combobox({
				valueField : 'name',
				textField : 'name',
				editable : true,// 可编辑
				url : 'dbConnection/getProNames.action?conId=' + conId,
				onLoadSuccess : onLoadSuccess5,
				onChange : function(newValue, oldValue) {
					delAllLine(true);
					$.ajax({
						type : "POST",
						url : "dbConnection/getcolumnList.action",
						dataType : "json",
						data : {
							conId : conId,
							proName : newValue
						},
						success : function(msg) {
							for (var int = 0; int < msg.length; int++) {
								addLine(int + 1, msg[int]);
							}
						}
					});
				}
			});
		}
	});
	// 返回值类型
	$("#returnDatatype5").combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		url : 'sysDictionaryData/getValues.action?dictValue=RETURN_TYPE',
		onLoadSuccess : onLoadSuccess5
	});
	
}

function onLoadSuccess5() {
	var id = $("#taskId5").val();
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

function addLine(i, data) {
	var table = $("#btn-tb1");
	var tab = document.getElementById("btn-tb1");
	var rows = tab.rows.length;
	var html = "<tr class='tb-line'>";
	html += "	<td width=\"5%\"><input name=\"no\" class=\"easyui-validatebox text-name\" style=\"width:100%;border-style: none; text-align: center;\" value=\""
			+ rows + "\" data-options=\"editable :false\"></td>";
	html += "	<td width=\"23%\"><input name=\"name\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%\" data-options=\"required:true\"></td>";
	html += "	<td width=\"15%\">"
			+ "<select  name=\"direction\" id=\"direction"
			+ i
			+ "\" class=\"form-control\"  data-options=\"\" style=\"width:95%;\">"
			+ "<option value=\"IN\">IN</option>"
			+ "<option value=\"OUT\">OUT</option>"
			+ "<option value=\"INOUT\">INOUT</option>" + "</select>" + "</td>";
	html += "	<td width=\"20%\">"
			+ "<select  name=\"type\"  id=\"PTypeValue"
			+ i
			+ "\" class=\"form-control\" data-options=\"\" style=\"width:95%;\">"
			+ "<option value=\"4\">INTEGER</option>"
			+ "<option value=\"6\">FLOAT</option>"
			+ "<option value=\"8\">DOUBLE</option>"
			+ "<option value=\"3\">DECIMAL</option>"
			+ "<option value=\"1\">CHAR</option>"
			+ "<option value=\"12\">VARCHAR</option>"
			+ "<option value=\"-1\">LONGVARCHAR</option>"
			+ "<option value=\"91\">DATE</option>"
			+ "<option value=\"92\">TIME</option>"
			+ "<option value=\"93\">TIMESTAMP</option>"
			+ "<option value=\"16\">BOOLEAN</option>"
			+ "<option value=\"-9\">NVARCHAR</option>"
			+ "<option value=\"-16\">LONGNVARCHAR</option>" + "</select>"
			+ "</td>";
	html += "	<td width=\"27%\"><input name=\"value\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%;\" data-options=\"required:true\"></td>";
	html += "	<td width=\"10%\"><a class=\"easyui-linkbutton remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
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
	if (data) {
		$("input[name='no']", line).val(data.no);
		$("input[name='name']", line).val(data.name);
		$("input[name='value']", line).val(data.value);
	}
	$.parser.parse(line);// 解析esayui标签
	table.append(line);
	$("#direction" + i + " option").each(function(j) {
		if (this.value == data.direction) {
			this.selected = true;
		}
	});
	$("#PTypeValue" + i + " option").each(function(k) {
		if (this.value == data.type) {
			this.selected = true;
		}
	});
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