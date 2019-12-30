var _taskEType;//页面数据来源-转换任务或作业流程
var command6Editor;
$(function() {
	_taskEType=$("#_taskEType").val();
	command6Editor = CodeMirror.fromTextArea(document.getElementById('command6'), {
	    lineNumbers: false,//显示行数
	    mode: 'text/x-sql',//模式
	    smartIndent: true,//自动缩进是否开启
	    matchBrackets : true,//括号匹配
	    autofocus: true, //是否在初始化时自动获取焦点
	    tabSize : 2, 
	    lineWrapping : true,
	    scrollbarStyle :null//不显示滚动条
	  });
	command6Editor.setOption("extraKeys", {
        // F11键切换全屏
        "F11": function(cm) {
        	var maxFlag=$('#t_newTask_surface').window('options')["maximized"];//是否最大化
        	if(maxFlag){
        		if(cm.getOption("fullScreen")){
        			$("#t_newTask_surface").window('restore');
        			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        		}else{
        			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        		}
        	}else{
        		$("#t_newTask_surface").window('maximize');
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        	}
        },
        // Esc键退出全屏
        "Esc": function(cm) {
        	$("#t_newTask_surface").window('restore');
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
    });
	  $('#t_newTask_surface').window({
			onResize :function(){
				var h=$('#t_newTask_surface').height();
				command6Editor.setSize('auto',h-250);
			}
		});
	   $('#stabs').tabs({//处理点击才显示的问题
		    onSelect:function(title,index){
		    	command6Editor.refresh();
		    }
		});
});

function addSurface() {
	$("#fromResultS").trigger("click");
	$('#t_newTask_surface').window('open');
	$("#stabs").tabs('select', "基本信息");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName=$("#search_folderName").val();//当前所属文件夹名称
	_id = sfolderId;
	_text= sfolderName;
	getTreeInfo("folderId6");
	getTreeFolder("folderId6");
//	$('#command6').textareafullscreen();
	command6Editor.setValue('');
};

// 保存信息
function saveSurface() {
	var taskNo;
	var taskName;
	var NoName;
	var taskId;
	if(_taskEType == 'forJob'){//来自作业流程页面
		 taskNo = $("#taskNo6").val();
		 taskName = $("#taskName6").val();
		 NoName = "【" + taskNo + "】" + taskName;
		 taskId = $("#taskId6").val();
	}
	if ($("#formS").form('validate')) {// 启用校验
		command6Editor.save();
		var data = $('#formS').serialize();
		$.ajax({
			type : "POST",
			url : "task/saveS.action",
			data : data,
			success : function(msg) {
				$.messager.alert('提示', "保存成功", 'info');
				$("#fromResultS").trigger("click");
				$('#t_newTask_surface').window('close');
				//保存后信息处理
				if(_taskEType == 'forTask'){
					sqlWhere();
				}else if(_taskEType == 'forJob'){
					var tid = msg.taskId;
					// //判断是否需要重新加载下拉框数据
					var taskNoName = $("#taskNoName6").val();
					if (taskNoName != NoName) {
						// 重新加载下拉框信息
						$("#i_nodeItem_id6").combobox(
						{
							valueField : 'id',
							textField : 'name',
							editable : true,
							url : 'job/taskList.action?type=6',
							onLoadSuccess : function() {
								var data = $('#i_nodeItem_id6').combobox('getData');
								if (data.length > 0) {
									$('#i_nodeItem_id6').combobox('select',tid);
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
function canleSurface() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultS").trigger("click");
			$('#t_newTask_surface').window('close');
		}
	});
}

//编辑
function editTaskS(tid, ttype,url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$("#fromResultS").trigger("click");
			getTreeInfo("folderId6");
			$("#formS").form('myLoad', data.data);
			$("#taskId6").val(data.data.taskId);
			$('#folderId6').combotree('setValue', data.data.folderId);
			$('#t_newTask_surface').window('open');
			// 全屏
//			$('#command6').textareafullscreen();
			command6Editor.setValue(data.data.command);
			$('#forRModuleNameS').val('TASKS');
			$('#forRTableNameS').val('TB_TASK_S');
		}
	});
}
