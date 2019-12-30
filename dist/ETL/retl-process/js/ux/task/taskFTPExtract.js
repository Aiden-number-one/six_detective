var _taskEType;// 页面数据来源-转换任务或作业流程
$(function() {
	_taskEType = $("#_taskEType").val();
});

// 新建
function addFTP() {
	$("#fromResultFTP").trigger("click");
	$('#t_newTask_FTP').window('open');
	$("#FTPtabs").tabs('select', "基本信息");
	initFTP();
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName = $("#search_folderName").val();// 当前所属文件夹名称
	_id = sfolderId;
	_text = sfolderName;
	getTreeInfo("folderId14");
	getTreeFolder("folderId14");
	forchangeInfo();
};

// 保存信息
function saveFTP() {
	var taskNo;
	var taskName;
	var NoName;
	var taskId;
	if (_taskEType == 'forJob') {// 来自作业流程页面
		taskNo = $("#taskNo14").val();
		taskName = $("#taskName14").val();
		NoName = "【" + taskNo + "】" + taskName;
		taskId = $("#taskId14").val();
	}
	if ($("#formFTP").form('validate')) {// 启用校验
		var data = $('#formFTP').serialize();
		$.ajax({
			type : "POST",
			url : "task/saveFTP.action",
			data : data,
			success : function(msg) {
				$.messager.alert('提示', "保存成功", 'info');
				$("#fromResultFTP").trigger("click");
				$('#t_newTask_FTP').window('close');
				// 保存后信息处理
				if (_taskEType == 'forTask') {
					var surl = "task/treeList.action?id=NULL&vartype=''";
					showTree(surl);
					sqlWhere();
				} else if (_taskEType == 'forJob') {
					var tid = msg.tid;
					var taskNoName = $("#taskNoName14").val();
					if (taskNoName != NoName) {
						// 重新加载下拉框信息
						$("#i_nodeItem_id14").combobox({
							valueField : 'id',
							textField : 'name',
							editable : true,
							url : 'job/taskList.action?type=14',
							onLoadSuccess : function() {
								var data = $('#i_nodeItem_id14').combobox('getData');
								if (data.length > 0) {
									$('#i_nodeItem_id14').combobox('select', tid);
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
function canleFTP() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultFTP").trigger("click");
			$('#t_newTask_FTP').window('close');
		}
	});
}

// 编辑
function editTaskFTP(tid, ttype, url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$('#t_newTask_FTP').window('open');
			$("#fromResultFTP").trigger("click");
			loadFTP(data.data);
			getTreeInfo("folderId14");
			// console.log(data.data);
			$("#formFTP").form('myLoad', data.data);
			$("#taskId14").val(data.data.taskId);
			$('#folderId14').combotree('setValue', data.data.folderId);
			$('#folderId14').combotree('setValue', data.data.folderId);
			$("#taskDesc14").textbox("setValue", data.data.taskDesc);
			$('#forRModuleNameFTP').val('TASKFTP');
			$('#forRTableNameFTP').val('TB_TASK_FTP');
			forchangeInfo();
		}
	});
}

// 页面级联处理
function forchangeInfo() {
	changeFTPType();
	changeDownExistFile();
	// changeDateFormat();
}

// 上传下载操作
function changeFTPType() {
	var ftype = $("#ftpType ").combobox('getValue');// 获取选中的value;
	// 获取select 选中的 text :
	// $("#ftpType").find("option:selected").text();
	if (ftype == 'U') {
		$("#forUp").show();
		$("#forDown").hide();
	} else {
		$("#forUp").hide();
		$("#forDown").show();
	}
}
// 覆盖文件处理
function changeDownExistFile() {
	var rep = $('#downIfCoverFile').is(':checked');// 是否选中
	if (rep) {
		$('#downExistFile').combobox("enable");
	} else {
		$('#downExistFile').combobox("disable");
	}
}
// 指定日期时间格式
function changeDateFormat() {
	var rep = $('#downIfAssignFormat').is(':checked');// 是否选中
	if (rep) {
		$('#downDatetimeFormat').combobox("enable");
		$("#downIfAddDate").removeAttr("disabled");
	} else {
		$('#downDatetimeFormat').combobox("disable");
		$("#downIfAddDate").attr("disabled", "disabled");
	}
}

// 加载信息
function initFTP() {
	// 上传下载类型
	$("#ftpType").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FTP_TYPE',
		editable : true,
		required : true,
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		onChange : function() {
			changeFTPType();
		},
		onLoadSuccess : function() {
			var data = $('#ftpType').combobox('getData');
			if (data.length > 0) {
				$('#ftpType').combobox('select', data[0].dictdataValue);
			}
		}
	});
	// 控制编码
	// $("#codeType14").combobox({
	// url : 'sysDictionaryData/getValues.action?dictValue=FILE_CHARSET',
	// editable : true,
	// required : true,
	// valueField : 'dictdataName',
	// textField : 'dictdataName',
	// onLoadSuccess : function() {
	// var data = $('#codeType14').combobox('getData');
	// if (data.length > 0) {
	// $('#codeType14').combobox('select', data[0].dictdataName);
	// }
	// }
	// });
	// 指定日期时间格式
	// $("#downDatetimeFormat").combobox({
	// valueField : 'dictdataName',
	// textField : 'dictdataName',
	// editable : false,// 不可编辑
	// url : 'sysDictionaryData/getValues.action?dictValue=BATCH_FORMAT',
	// onLoadSuccess : function() {
	// $("#downDatetimeFormat").combobox('setValue','YYYYMMDD');//默认值
	// $("#downDatetimeFormat").combobox('setText','YYYYMMDD');//默认值
	// }
	// });
	// 文件已存在时处理方式
	$("#downExistFile").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=EXISTFILE_TYPE',
		editable : true,
		required : true,
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		onLoadSuccess : function() {
			var data = $('#downExistFile').combobox('getData');
			if (data.length > 0) {
				$('#downExistFile').combobox('select', data[2].dictdataValue);
			}
		}
	});
}

// 加载信息--编辑
function loadFTP(result) {
	// 上传下载类型
	$("#ftpType").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FTP_TYPE',
		editable : true,
		required : true,
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		onChange : function() {
			changeFTPType();
		},
		onLoadSuccess : function() {
			var data = $('#ftpType').combobox('getData');
			if (data.length > 0) {
				$('#ftpType').combobox('select', result.ftpType);
			}
		}
	});
	// 控制编码
	// $("#codeType14").combobox({
	// url : 'sysDictionaryData/getValues.action?dictValue=FILE_CHARSET',
	// editable : true,
	// required : true,
	// valueField : 'dictdataName',
	// textField : 'dictdataName',
	// onLoadSuccess : function() {
	// $('#codeType14').combobox('select', result.codeType);
	// }
	// });
	// 指定日期时间格式
	// $("#downDatetimeFormat").combobox({
	// valueField : 'dictdataName',
	// textField : 'dictdataName',
	// editable : false,// 不可编辑
	// url : 'sysDictionaryData/getValues.action?dictValue=BATCH_FORMAT',
	// onLoadSuccess : function() {
	// $("#downDatetimeFormat").combobox('setValue',result.downDatetimeFormat);//默认值
	// $("#downDatetimeFormat").combobox('setText',result.downDatetimeFormat);//默认值
	// }
	// });
	// 文件已存在时处理方式
	$("#downExistFile").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=EXISTFILE_TYPE',
		editable : true,
		required : true,
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		onLoadSuccess : function() {
			$('#downExistFile').combobox('select', result.downExistFile);
		}
	});
}

/**
 * 测试连接
 * 
 * @returns
 */
function testFTP() {
	Peony.progress();
	var data = $('#formFTP').serialize();
	$.post("taskFTP/testConnection.action", data, function(data) {
		Peony.closeProgress();
		if (data.success) {
			Peony.alert('提示', data.msg, 'info');
		} else {
			Peony.alert('提示', data.msg, 'error');
		}
	});
}
