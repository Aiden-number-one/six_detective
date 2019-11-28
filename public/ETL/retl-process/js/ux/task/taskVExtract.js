var _taskEType;//页面数据来源-转换任务或作业流程
var variableEditor;
$(function() {
	_taskEType=$("#_taskEType").val();
	//codemirror
	 variableEditor = CodeMirror.fromTextArea(document.getElementById('variableScript3'), {
		    lineNumbers: false,//显示行数
		    mode: 'text/x-sql',//模式
		    smartIndent: true,//自动缩进是否开启
		    matchBrackets : true,//括号匹配
		    autofocus: true, //是否在初始化时自动获取焦点
		    tabSize : 2, 
		    lineWrapping : true,
		    scrollbarStyle :null//不显示滚动条
		  });
	  variableEditor.setOption("extraKeys", {
	        // F11键切换全屏
	        "F11": function(cm) {
	        	var maxFlag=$('#t_newTask_variate').window('options')["maximized"];//是否最大化
//	        	var wrap = cm.getWrapperElement();
//	        	var w=wrap.style.width;
//	        	console.log(w+"--------"+$(window).width());
	        	if(maxFlag){
	        		if(cm.getOption("fullScreen")){//当下是否全屏状态--非手动全屏，为了实现F11事件添加
	        			$("#t_newTask_variate").window('restore');
	        			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        		}else{
//	        			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        		}
	        	}else{
	        		$("#t_newTask_variate").window('maximize');
					cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        	}
	        },
	        // Esc键退出全屏
	        "Esc": function(cm) {
//	        	$("#t_newTask_variate").window('restore');
	            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        }
	    });
	  $('#t_newTask_variate').window({
//			onMaximize : function() {
////				variableEditor.setOption("tabSize","4");
//				alert("11111111");
//			},
//			onRestore : function() {
//				variableEditor.setOption("tabSize","2");
//			},
			onResize :function(){
				var h=$('#t_newTask_variate').height();
				variableEditor.setSize('auto',h-220);
			}
		});
	   $('#vtabs').tabs({//处理点击才显示的问题
		    onSelect:function(title,index){
		        variableEditor.refresh();
		    }
		});
});

//打开变量信息窗口。
function addVariate() {
	$("#fromResult").trigger("click");
	$('#t_newTask_variate').window('open');
	$("#vtabs").tabs('select', "基本信息");
	initVariate();
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName=$("#search_folderName").val();//当前所属文件夹名称
	_id = sfolderId;
	_text= sfolderName;
	getTreeInfo("folderId3");
	getTreeFolder("folderId3");
//	$('#variableScript3').textareafullscreen();
	variableEditor.setValue('');
};

// 保存变量信息
function saveVariate() {
	var taskNo;
	var taskName;
	var NoName;
	var taskId;
	if(_taskEType == 'forJob'){//来自作业流程页面
		 taskNo = $("#taskNo3").val();
		 taskName = $("#taskName3").val();
		 NoName = "【" + taskNo + "】" + taskName;
		 taskId = $("#taskId3").val();
	}
	if ($("#formV").form('validate')) {// 启用校验
		variableEditor.save();
		var data = $('#formV').serialize();
		$.ajax({
			type : "POST",
			url : "task/saveV.action",
			data : data,
			success : function(msg) {
				$.messager.alert('提示', "保存成功", 'info');
				$("#fromResult").trigger("click");
				$('#t_newTask_variate').window('close');
				//保存后信息处理
				if(_taskEType == 'forTask'){
					var surl = "task/treeList.action?id=NULL&vartype=''";
					showTree(surl);
					sqlWhere();
				}else if(_taskEType == 'forJob'){
					var tid = msg.tid;
					var taskNoName = $("#taskNoName3").val();
					if (taskNoName != NoName) {
						// 重新加载下拉框信息
						$("#i_nodeItem_id3").combobox(
								{
									valueField : 'id',
									textField : 'name',
									editable : true,
									url : 'job/taskList.action?type=3',
									onLoadSuccess : function() {
										var data = $('#i_nodeItem_id3').combobox(
												'getData');
										if (data.length > 0) {
											$('#i_nodeItem_id3').combobox('select',
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
// 取消
function canleVariable() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResult").trigger("click");
			$('#t_newTask_variate').window('close');
		}
	});
}

//编辑变量
function editTaskV(tid, ttype,url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$('#t_newTask_variate').window('open');
			$("#fromResult").trigger("click");
			loadVariate(data.data);
			getTreeInfo("folderId3");
			$("#formV").form('myLoad', data.data);
			$("#taskId3").val(data.data.taskId);
			$("#dbConnection3")
					.combobox('setValue', data.data.dbConnection);
			$('#folderId3').combotree('setValue', data.data.folderId);
			$("#taskDesc3").textbox("setValue", data.data.taskDesc);
			// 全屏
//			$('#variableScript3').textareafullscreen();
			variableEditor.setValue(data.data.variableScript);
			$('#forRModuleNameV').val('TASKV');
			$('#forRTableNameV').val('TB_TASK_V');
		}
	});
}
//测试
function testVariable() {
//	var transScript = $("#variableScript3").val();// 赋值语句
	var transScript=variableEditor.getValue();
	// 判断赋值语句中是否包含变量
	$('#t_test_variate').window('open');// 打开窗口
	$("#_preview, #_execRes").hide();
	$("#_taskType").val("3");
	getVariable(transScript);
	if(_taskEType == 'forTask'){
		$("#fordatagrid").hide();
	}else if(_taskEType == 'forJob'){
		document.getElementById("t_test_variate").title = "项目信息";
		showPreviewList("");
		$('#str-list').datagrid('loadData', {
			total : 0,
			rows : []
		});
	}
}

//加载变量信息
function initVariate() {
	// 数据连接--变量
	var dbConnection1 = $("#dbConnection3").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		url : 'tbMdTable/listConnnect.action',
		onLoadSuccess : function() {
			var data = $('#dbConnection3').combobox('getData');
			if (data.length > 0) {
				$('#dbConnection3').combobox('select', data[0].connectionId);
			}
		}
	});
}
// 加载变量信息--编辑
function loadVariate(result) {
	// 数据连接--变量
	var dbConnection1 = $("#dbConnection3").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		url : 'tbMdTable/listConnnect.action',
		onLoadSuccess : function() {
			$('#dbConnection3').combobox('select', result.dbConnection);
		}
	});
}
