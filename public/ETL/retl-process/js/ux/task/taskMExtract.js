var _taskEType;//页面数据来源-转换任务或作业流程
$(function() {
//	$('#addV').unbind('click').click(function() {
//		addVariate();
//	});
	_taskEType=$("#_taskEType").val();
});

function addMail() {
	$("#fromResultMail").trigger("click");
	initMailInfo();
	changeInfo();
	$('#t_newTask_mail').window('open');
	$("#mailtabs").tabs('select', "基本信息");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName=$("#search_folderName").val();//当前所属文件夹名称
	_id = sfolderId;
	_text= sfolderName;
	getTreeInfo("folderId9");
	getTreeFolder("folderId9");
}

// 保存信息
function saveMail() {
	var taskNo;
	var taskName;
	var NoName;
	var taskId;
	if(_taskEType == 'forJob'){//来自作业流程页面
		 taskNo = $("#taskNo9").val();
		 taskName = $("#taskName9").val();
		 NoName = "【" + taskNo + "】" + taskName;
		 taskId = $("#taskId9").val();
	}
	if ($("#formMail").form('validate')) {// 启用校验
		var data = $('#formMail').serialize();
		$.ajax({
			type : "POST",
			url : "task/saveTaskMail.action",
			data : data,
			success : function(msg) {
				$.messager.alert('提示', "保存成功", 'info');
				$("#fromResultMail").trigger("click");
				$('#t_newTask_mail').window('close');
				//保存后信息处理
				if(_taskEType == 'forTask'){
					sqlWhere();
				}else if(_taskEType == 'forJob'){
					var tid = msg.taskId;
					// 判断是否需要重新加载下拉框数据
					var taskNoName = $("#taskNoName9").val();
					if (taskNoName != NoName) {
						// 重新加载下拉框信息
						$("#i_nodeItem_id9").combobox(
								{
									valueField : 'id',
									textField : 'name',
									editable : true,
									url : 'job/taskList.action?type=9',
									onLoadSuccess : function() {
										var data = $('#i_nodeItem_id9').combobox(
												'getData');
										if (data.length > 0) {
											$('#i_nodeItem_id9').combobox('select',
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
function canleMail() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultMail").trigger("click");
			$('#t_newTask_mail').window('close');
		}
	});
}
//编辑变量
function editTaskM(tid, ttype,url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$("#fromResultMail").trigger("click");
			$('#t_newTask_mail').window('open');
			getTreeInfo("folderId9");
			initMailInfo();
			$("#formMail").form('myLoad', data.data);
			$("#taskId9").val(data.data.taskId);
			$('#folderId9').combotree('setValue', data.data.folderId);
			if (data.data.validateFlag == 'Y') {// 用户验证
				$('#userName').attr("disabled", false);
				$('#password').attr("disabled", false);
			} else {
				$('#userName').attr("disabled", "disabled");
				$('#password').attr("disabled", "disabled");
			}
			if (data.data.safeValidate == 'Y') {// 使用安全验证
				$('#safeConnectType').combobox("enable");
			} else {
				$('#safeConnectType').combobox("disable");
			}
			if (data.data.codeFlag == 'Y') { // 使用HTML邮件格式
				$('#codeType9').combobox("enable");
			} else {
				$('#codeType9').combobox("disable");
			}
			$('#forRModuleNameM').val('TASKM');
			$('#forRTableNameM').val('TB_MAIL_INFO');
		}
	});
}
//发送测试
function testMail() {
	if ($("#formMail").form('validate')) {// 启用校验
		var data = $('#formMail').serialize();
		// Peony.progress('请稍候', '连接中...');
		$.ajax({
			type : "POST",
			url : "tbMailInfo/testInfo.action",
			data : data,
			success : function(data) {
				$.messager.alert('提示', data.msg, 'info');
			}
		});
	}

}
// 是否用户验证
function changeValidateFlag() {
	var rep = $('#validateFlag').is(':checked');// 是否选中
	if (rep) {
		$('#userName').attr("disabled", false);
		$('#password').attr("disabled", false);
	} else {
		$('#userName').attr("disabled", "disabled");
		$('#password').attr("disabled", "disabled");
	}
}
// 使用安全验证
function changeSafeValidate() {
	var rep = $('#safeValidate').is(':checked');// 是否选中
	if (rep) {
		$('#safeConnectType').combobox("enable");
	} else {
		$('#safeConnectType').combobox("disable");
	}
}
// 使用HTML邮件格式
function changeCodeFlag() {
	var rep = $('#codeFlag').is(':checked');// 是否选中
	if (rep) {
		$('#codeType9').combobox("enable");
	} else {
		$('#codeType9').combobox("disable");
	}
}
// 加载数据
function initMailInfo() {
	// 安全连接类型
	var safeConnectType = $("#safeConnectType").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=SAFE_CONNECT_TYPE',
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		panelHeight : 'auto',
		// disabled:'disabled',
		onLoadSuccess : onLoadSuccess9
	});
	// 编码
	$("#codeType9").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FILE_CHARSET',
		editable : true,
		required : true,
		valueField : 'dictdataName',
		textField : 'dictdataName',
		onLoadSuccess : onLoadSuccess9
	});
}
function changeInfo() {
	// 用户验证
	changeValidateFlag();
	// 安全验证
	changeSafeValidate();
	// 使用HTML邮件格式
	changeCodeFlag();
}

// 发送邮件任务是否新增判断
function onLoadSuccess9() {
	var id = $("#taskId9").val();
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
