var _taskEType;//页面数据来源-转换任务或作业流程
var command2Editor;
$(function() {
	_taskEType=$("#_taskEType").val();
	command2Editor = CodeMirror.fromTextArea(document.getElementById('command2'), {
		    lineNumbers: false,//显示行数
		    mode: 'text/x-sql',//模式
		    smartIndent: true,//自动缩进是否开启
		    matchBrackets : true,//括号匹配
		    autofocus: false, //是否在初始化时自动获取焦点
		    tabSize : 2, 
		    lineWrapping : true,
		    scrollbarStyle :null//不显示滚动条
		  });
	command2Editor.setOption("extraKeys", {
	        // F11键切换全屏
	        "F11": function(cm) {
	        	var maxFlag=$('#t_newTask_sql').window('options')["maximized"];//是否最大化
	        	if(maxFlag){
	        		if(cm.getOption("fullScreen")){
	        			$("#t_newTask_sql").window('restore');
	        			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        		}else{
	        			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        		}
	        	}else{
	        		$("#t_newTask_sql").window('maximize');
					cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        	}
	        },
	        // Esc键退出全屏
	        "Esc": function(cm) {
	        	$("#t_newTask_sql").window('restore');
	            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        }
	    });
	  $('#t_newTask_sql').window({
			onResize :function(){
				var h=$('#t_newTask_sql').height();
				command2Editor.setSize('auto',h-220);
			}
		});
	   $('#sqltabs').tabs({//处理点击才显示的问题
		    onSelect:function(title,index){
		    	command2Editor.refresh();
		    }
		});
});

//打开SQL命令窗口。
function addSQL() {
	initSQL();
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName=$("#search_folderName").val();//当前所属文件夹名称
	_id = sfolderId;
	_text= sfolderName;
	getTreeInfo("folderId2");
	getTreeFolder("folderId2");
	$("#fromResultSQL").trigger("click");
	$('#t_newTask_sql').window('open');
	$("#sqltabs").tabs('select', "基本信息");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
//	$('#command2').textareafullscreen();
	command2Editor.setValue('');
};

// 保存变量信息
function saveSQL() {
	if(_taskEType == 'forTask'){
		var command2 = command2Editor.getValue();
		if (command2 == null || command2 == '') {
			$.messager.alert('提示', "执行脚本不能为空！", 'warning');
			return false;
		}
	}
	var taskNo;
	var taskName;
	var NoName;
	var taskId;
	if(_taskEType == 'forJob'){//来自作业流程页面
		 taskNo = $("#taskNo2").val();
		 taskName = $("#taskName2").val();
		 NoName = "【" + taskNo + "】" + taskName;
		 taskId = $("#taskId2").val();
	}
	if ($("#formSQL").form('validate')) {// 启用校验
		command2Editor.save();
		var data = $('#formSQL').serialize();
		$.ajax({
			type : "POST",
			url : "task/saveT.action",
			data : data,
			success : function(msg) {
				$.messager.alert('提示', "保存成功", 'info');
				$("#fromResultSQL").trigger("click");
				$('#t_newTask_sql').window('close');
				//保存后信息处理
				if(_taskEType == 'forTask'){
					sqlWhere();
				}else if(_taskEType == 'forJob'){
					var tid = msg.taskId;
					var taskNoName = $("#taskNoName2").val();
					if (taskNoName != NoName) {
						// 重新加载下拉框信息
						$("#i_nodeItem_id2").combobox({
								valueField : 'id',
								textField : 'name',
								editable : true,
								url : 'job/taskList.action?type=2',
								onLoadSuccess : function() {
									var data = $('#i_nodeItem_id2').combobox('getData');
									if (data.length > 0) {
										$('#i_nodeItem_id2').combobox('select',tid);
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
function canleSQL() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultSQL").trigger("click");
			$('#t_newTask_sql').window('close');
		}
	});
}

//编辑变量
function editTaskT(tid, ttype,url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$("#fromResultSQL").trigger("click");
			$('#t_newTask_sql').window('open');
			initSQL();
			getTreeInfo("folderId2");
			$("#formSQL").form('myLoad', data.data);
			$("#taskId2").val(data.data.taskId);
			$("#connectionId2")
					.combobox('setValue', data.data.connectionId);
			$("#transRule2").combobox('setValue', data.data.transRule);
			$('#folderId2').combotree('setValue', data.data.folderId);
			// 全屏
//			$('#command2').textareafullscreen();
			command2Editor.setValue(data.data.command);
			$('#forRModuleNameT').val('TASKT');
			$('#forRTableNameT').val('TB_TASK_T');
		}
	});
}
//加载信息
function initSQL() {
	// 数据连接--执行SQL
	var dbConnection2 = $("#connectionId2").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		url : 'tbMdTable/listConnnect.action',
		onLoadSuccess : onLoadSuccess2
	});
	// 执行方式--执行SQL
	$("#transRule2").combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		url : 'sysDictionaryData/getValues.action?dictValue=SQL_TYPE',
		onLoadSuccess : onLoadSuccess2
	});
}
function onLoadSuccess2() {
	var id = $("#taskId2").val();
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