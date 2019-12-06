var _taskEType;//页面数据来源-转换任务或作业流程
var command8Editor;
$(function() {
	_taskEType=$("#_taskEType").val();
	command8Editor = CodeMirror.fromTextArea(document.getElementById('command8'), {
		    lineNumbers: false,//显示行数
		    mode: 'text/x-sql',//模式
		    smartIndent: true,//自动缩进是否开启
		    matchBrackets : true,//括号匹配
		    autofocus: true, //是否在初始化时自动获取焦点
		    tabSize : 2, 
		    lineWrapping : true,
		    scrollbarStyle :null//不显示滚动条
		  });
	command8Editor.setOption("extraKeys", {
	        // F11键切换全屏
	        "F11": function(cm) {
	        	var maxFlag=$('#t_newTask_text').window('options')["maximized"];//是否最大化
	        	if(maxFlag){
		            if(cm.getOption("fullScreen")){
	        			$("#t_newTask_text").window('restore');
	        			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        		}else{
	        			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        		}
	        	}else{
	        		$("#t_newTask_text").window('maximize');
					cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        	}
	        },
	        // Esc键退出全屏
	        "Esc": function(cm) {
	        	$("#t_newTask_text").window('restore');
	            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        }
	    });
	  $('#t_newTask_text').window({
			onResize :function(){
				var h=$('#t_newTask_text').height();
				command8Editor.setSize('auto',h-520);
			}
		});
	   $('#filetabs').tabs({//处理点击才显示的问题
		    onSelect:function(title,index){
		    	command8Editor.refresh();
		    }
		});
});
function addTaskFile() {
	$("#fromResultText").trigger("click");
	initTaskFielInfo();
	$('#t_newTask_text').window('open');
	$("#filetabs").tabs('select', "基本信息");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName=$("#search_folderName").val();//当前所属文件夹名称
	_id = sfolderId;
	_text= sfolderName;
	getTreeInfo("folderId8");
	getTreeFolder("folderId8");
//	$('#command8').textareafullscreen();
	command8Editor.setValue();
}
// 保存信息
function saveTaskFile() {
	var taskNo;
	var taskName;
	var NoName;
	var taskId;
	if(_taskEType == 'forJob'){//来自作业流程页面
		 taskNo = $("#taskNo8").val();
		 taskName = $("#taskName8").val();
		 NoName = "【" + taskNo + "】" + taskName;
		 taskId = $("#taskId8").val();
	}
	if ($("#formText").form('validate')) {// 启用校验
		var command8 = command8Editor.getValue();
		if (command8 == '') {
			$.messager.alert('提示', "查询语句不能为空", 'waring');
		} else {
			command8Editor.save();
			var data = $('#formText').serialize();
			$.ajax({
				type : "POST",
				url : "task/saveTaskFile.action",
				data : data,
				success : function(msg) {
					$.messager.alert('提示', "保存成功", 'info');
					$("#fromResultText").trigger("click");
					$('#t_newTask_text').window('close');
					//保存后信息处理
					if(_taskEType == 'forTask'){
						sqlWhere();
					}else if(_taskEType == 'forJob'){
						var tid = msg.taskId;
						// //判断是否需要重新加载下拉框数据
						var taskNoName = $("#taskNoName8").val();
						if (taskNoName != NoName) {
							// 重新加载下拉框信息
							$("#i_nodeItem_id8").combobox(
							{
								valueField : 'id',
								textField : 'name',
								editable : true,
								url : 'job/taskList.action?type=8',
								onLoadSuccess : function() {
									var data = $('#i_nodeItem_id8').combobox('getData');
									if (data.length > 0) {
										$('#i_nodeItem_id8').combobox('select', tid);
									}
								}
							});
						}
					}
				}
			});
		}
	} else {
		$.messager.alert('提示', "有非空字段需要填写，请检查.", 'waring');
	}
}
function canleTaskFile() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultText").trigger("click");
			$('#t_newTask_text').window('close');
		}
	});
}

//编辑
function editTaskF(tid, ttype,url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$("#fromResultText").trigger("click");
			$('#t_newTask_text').window('open');
			getTreeInfo("folderId8");
			initTaskFielInfo();
			$("#formText").form('myLoad', data.data);
			$("#taskId8").val(data.data.taskId);
//			$('#folderId8').combotree('setValue', data.data.folderId);
			$('#folderId8').combotree('setValue', data.data.folderId);
//			$('#command8').textareafullscreen();
			command8Editor.setValue(data.data.command);
			$('#forRModuleNameF').val('TASKF');
			$('#forRTableNameF').val('TB_TASK_FILE');
		}
	});
}

function initTaskFielInfo() {
	// 数据连接
	$("#dbConnection8").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,
		url : 'tbMdTable/listConnnectAll.action'
	});
	// 扩展名
	$("#extendName").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=EXTEND_NAME',
		editable : false,
		required : true,
		valueField : 'dictdataName',
		textField : 'dictdataName',
		onLoadSuccess : onLoadSuccess8
	});
	// 分隔符
	$("#taskSeparator").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=CON_SEPARATOR',
		editable : true,
		required : true,
		valueField : 'dictdataName',
		textField : 'dictdataName',
		// onChange : function(newValue, oldValue) {
		// if(newValue.length>1){
		// $.messager.alert('警告', '最大输入长度为1.', 'warning');
		// $("#taskSeparator").combobox('setText',',');
		// }
		// },
		onLoadSuccess : onLoadSuccess8
	});
	// 导出文本格式
	$("#formatType").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FORMAT_TYPE',
		editable : false,
		required : true,
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		onLoadSuccess : onLoadSuccess8
	});
	// 编码
	$("#codeType").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FILE_CHARSET',
		editable : true,
		required : true,
		valueField : 'dictdataName',
		textField : 'dictdataName',
		onLoadSuccess : onLoadCodeType
	});
}

// 导出文本任务是否新增判断
function onLoadSuccess8() {
	var id = $("#taskId8").val();
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

function onLoadCodeType() {
	var id = $("#taskId8").val();
	if (id == null || id === "") { // 当新增表单时
		var target = $(this);
		var data = target.combobox("getData");
		var options = target.combobox("options");
		if (data && data.length > 0) {
			var fs = data[4];
			target.combobox("setValue", fs[options.valueField]); // 默认选中UTF-8
		}
	}
}
