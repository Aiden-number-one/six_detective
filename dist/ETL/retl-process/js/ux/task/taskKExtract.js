var _taskEType;//页面数据来源-转换任务或作业流程
$(function() {
	_taskEType=$("#_taskEType").val();
});

//打开页面
function addKettle() {
	$("#fromResultK").trigger("click");
	initKettleInfo();
	_addKettle();
	$('#t_newTask_kettle').window('open');
	$("#kettletabs").tabs('select', "基本信息");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName=$("#search_folderName").val();//当前所属文件夹名称
	_id = sfolderId;
	_text= sfolderName;
	getTreeInfo("folderId10");
	getTreeFolder("folderId10");
}

//保存
function saveKettle() {
	var taskNo;
	var taskName;
	var NoName;
	var taskId;
	if(_taskEType == 'forJob'){//来自作业流程页面
		 taskNo = $("#taskNo10").val();
		 taskName = $("#taskName10").val();
		 NoName = "【" + taskNo + "】" + taskName;
		 taskId = $("#taskId10").val();
	}
	if ($("#formK").form('validate')) {// 启用校验
		var data = $('#formK').serialize();
		$.ajax({
			type : "POST",
			url : "task/saveKettle.action",
			data : data,
			success : function(msg) {
				$.messager.alert('提示', "保存成功", 'info');
				$("#fromResultK").trigger("click");
				$('#t_newTask_kettle').window('close');
				//保存后信息处理
				if(_taskEType == 'forTask'){
					sqlWhere();
				}else if(_taskEType == 'forJob'){
					var tid = msg.taskId;
					// 判断是否需要重新加载下拉框数据
					var taskNoName = $("#taskNoName10").val();
					if (taskNoName != NoName) {
						// 重新加载下拉框信息
						$("#i_nodeItem_id10").combobox(
								{
									valueField : 'id',
									textField : 'name',
									editable : true,
									url : 'job/taskList.action?type=10',
									onLoadSuccess : function() {
										var data = $('#i_nodeItem_id10').combobox(
												'getData');
										if (data.length > 0) {
											$('#i_nodeItem_id10').combobox(
													'select', tid);
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
//编辑变量
function editTaskK(tid, ttype,url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$("#fromResultK").trigger("click");
			$('#t_newTask_kettle').window('open');
			$(".validatebox-tip").remove();
			$(".validatebox-invalid").removeClass("validatebox-invalid");
			getTreeInfo("folderId10");
			initKettleInfo();
			$("#formK").form('myLoad', data.data);
			$("#taskId10").val(data.data.taskId);
			$('#folderId10').combotree('setValue', data.data.folderId);
			delKettleAllLine(true);
			if(data.data.executeParameter != ""){
				var jsonObj = JSON.parse(data.data.executeParameter);
				var dataList = jsonObj[0].parameters;
				for (var int = 0; int < dataList.length; int++) {
					addKettleData(int, dataList[int]);
				}
			}
			$(".validatebox-tip").remove();
			$(".tooltip").removeClass("tooltip tooltip-right");

			// 新增资源库配置
			handleCallType(data.data.callType);
			$("#connectionKettle").combobox(
					{
						onLoadSuccess : function() {
							$('#connectionKettle').combobox('setValue',
									data.data.connectionId);
						}
					});
			$('#forRModuleNameK').val('TASKK');
			$('#forRTableNameK').val('TB_TASK_KETTLE');
		}
	});
}
//加载数据
function initKettleInfo() {
	initKettle();
	// 文件类型
	var fileType = $("#fileType").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=KETTLE_TYPE',
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		panelHeight : 'auto',
		onLoadSuccess : onLoadSuccess10
	});
}

//取消
function canleKettle() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultK").trigger("click");
			$('#t_newTask_kettle').window('close');
		}
	});
}

function onLoadSuccess10() {
	var id = $("#taskId10").val();
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
//按钮--添加一行和删除绑定
function addOneKettelLine() {
	addKettleLine();
}

function addKettleData(i, data) {
	var table = $("#btn-kettle");
	var html = "<tr class='tb-kettleLine'>";
	html += "	<td width=\"10%\"><input name=\"no\" class=\"easyui-validatebox text-name\" style=\"width:100%;border-style: none; text-align: center;\" value=\""
			+ (i + 1) + "\" data-options=\"editable :false\"></td>";
	html += "	<td width=\"30%\"><input name=\"name\" value=\""
			+ data.name
			+ "\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%\" data-options=\"required:true\"></td>";
	html += "	<td width=\"40%\"><input name=\"value\" value=\""
			+ data.value
			+ "\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%;\" data-options=\"required:true\"></td>";
	html += "	<td align=\"center\" width=\"20%\"><a class=\"easyui-linkbutton kettleDel-btn remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
	html += "	</td>";
	html += "</tr>";
	var line = $(html);
	// 选定删除按钮事件
	$(".kettleDel-btn", line).click(function() {
		$.messager.confirm('确认', '您确定要删除记录？', function(r) {
			if (r) {
				delKettleLine(line);
			}
		});
	});
	$.parser.parse(line);// 解析esayui标签
	table.append(line);
}
function addKettleLine(i, data) {
	var table = $("#btn-kettle");
	var tab = document.getElementById("btn-kettle");
	var rows = tab.rows.length;
	var html = "<tr class='tb-kettleLine'>";
	html += "	<td width=\"10%\"><input name=\"no\" class=\"easyui-validatebox text-name\" style=\"width:100%;border-style: none; text-align: center;\" value=\""
			+ rows + "\" data-options=\"editable :false\"></td>";
	html += "	<td width=\"30%\"><input name=\"name\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%\" data-options=\"required:true\"></td>";
	html += "	<td width=\"40%\"><input name=\"value\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%;\" data-options=\"required:true\"></td>";
	html += "	<td align=\"center\" width=\"20%\"><a class=\"easyui-linkbutton kettleDel-btn remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
	html += "	</td>";
	html += "</tr>";
	var line = $(html);
	// 选定删除按钮事件
	$(".kettleDel-btn", line).click(function() {
		$.messager.confirm('确认', '您确定要删除记录？', function(r) {
			if (r) {
				delKettleLine(line);
			}
		});
	});
	if (data) {
		$("input[name='no']", line).val(i + 1);
		$("input[name='name']", line).val(data.name);
		$("input[name='value']", line).val(data.value);
	}
	$.parser.parse(line);// 解析esayui标签
	table.append(line);
}

// 删除全部
function delKettleAllLine(b) {
	if (b) {
		$(".tb-kettleLine").each(function(i, line) {
			delKettleLine($(line));
		});
	}
}
// 删除单行
function delKettleLine(line) {
	if (line) {
		line.fadeOut("fast", function() {
			$(this).remove();
		});
	}
}


/**
 * 初始化
 */
function initKettle() {
	$("#connectionKettle").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		url : 'tbMdTable/listConnnect.action'
	});
}

/**
 * 添加
 */
function _addKettle() {
	$("#forDBRepo,#forFileRepo,.forRepository").hide();
	$("#forDBRepo,#forFileRepo,.forRepository *").attr("disabled", true);
}

$('#callType').change(function() {
	var val = $(this).children('option:selected').val();
	handleCallType(val);
});

/**
 * 根据调用类型显示字段信息
 */
function handleCallType(val) {
	if (val === '1') { // 文件直接调用
		$("#forKettleFile").show();
		$("#forKettleFile *").removeAttr("disabled");
		$("#forDBRepo,#forFileRepo,.forRepository").hide();
		$("#forDBRepo *,#forFileRepo *,.forRepository *").attr("disabled", true);
	} else if (val === '2') { // 数据资源库
		$("#forDBRepo,.forRepository").show();
		$("#forDBRepo *,.forRepository *").removeAttr("disabled");
		$("#forKettleFile,#forFileRepo").hide();
		$("#forKettleFile *,#forFileRepo *").attr("disabled", true);
	} else { // 文件资源库
		$("#forFileRepo,.forRepository").show();
		$("#forFileRepo *,.forRepository *").removeAttr("disabled");
		$("#forKettleFile,#forDBRepo").hide();
		$("#forKettleFile *,#forDBRepo *").attr("disabled", true);
	}
}