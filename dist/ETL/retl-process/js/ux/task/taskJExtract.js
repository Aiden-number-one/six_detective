var _taskEType;//页面数据来源-转换任务或作业流程
var command11Editor;
$(function() {
	_taskEType=$("#_taskEType").val();
	command11Editor = CodeMirror.fromTextArea(document.getElementById('command11'), {
	    lineNumbers: false,//显示行数
	    mode: 'text/javascript',//模式
	    smartIndent: true,//自动缩进是否开启
	    matchBrackets : true,//括号匹配
	    autofocus: true, //是否在初始化时自动获取焦点
	    tabSize : 2, 
	    lineWrapping : true,
	    scrollbarStyle :null//不显示滚动条
	  });
	command11Editor.setOption("extraKeys", {
	        // F11键切换全屏
	        "F11": function(cm) {
	        	var maxFlag=$('#t_newTask_js').window('options')["maximized"];//是否最大化
	        	if(maxFlag){
	        		if(cm.getOption("fullScreen")){
	        			$("#t_newTask_js").window('restore');
	        			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        		}else{
	        			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        		}
	        	}else{
	        		$("#t_newTask_js").window('maximize');
					cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        	}
	        },
	        // Esc键退出全屏
	        "Esc": function(cm) {
	        	$("#t_newTask_js").window('restore');
	            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        }
	    });
	  $('#t_newTask_js').window({
			onResize :function(){
				var h=$('#t_newTask_js').height();
				command11Editor.setSize('auto',h-340);
			}
		});
	   $('#jstabs').tabs({//处理点击才显示的问题
		    onSelect:function(title,index){
		    	command11Editor.refresh();
		    }
		});
});

//打开页面
function addJS() {
	$("#fromResultJS").trigger("click");
	$('#t_newTask_js').window('open');
	$("#jstabs").tabs('select', "基本信息");
	delAllLineJS(true);
	btnAddJS();
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName=$("#search_folderName").val();//当前所属文件夹名称
	_id = sfolderId;
	_text= sfolderName;
	getTreeInfo("folderId11");
	getTreeFolder("folderId11");
//	$('#command11').textareafullscreen();
	command11Editor.setValue('');
};

//保存
function saveJS() {
	var taskNo;
	var taskName;
	var NoName;
	var taskId;
	if(_taskEType == 'forJob'){//来自作业流程页面
		 taskNo = $("#taskNo11").val();
		 taskName = $("#taskName11").val();
		 NoName = "【" + taskNo + "】" + taskName;
		 taskId = $("#taskId11").val();
	}
	if ($("#formJS").form('validate')) {// 启用校验
		command11Editor.save();
		var data = $('#formJS').serialize();
		$.ajax({
			type : "POST",
			url : "task/saveJ.action",
			data : data,
			success : function(msg) {
				$.messager.alert('提示', "保存成功", 'info');
				$("#fromResultJS").trigger("click");
				$('#t_newTask_js').window('close');
				//保存后信息处理
				if(_taskEType == 'forTask'){
					sqlWhere();
				}else if(_taskEType == 'forJob'){
					var tid = msg.taskId;
					// //判断是否需要重新加载下拉框数据
					var taskNoName = $("#taskNoName11").val();
					if (taskNoName != NoName) {
						// 重新加载下拉框信息
						$("#i_nodeItem_id11").combobox(
						{
							valueField : 'id',
							textField : 'name',
							editable : true,
							url : 'job/taskList.action?type=11',
							onLoadSuccess : function() {
								var data = $('#i_nodeItem_id11').combobox('getData');
								if (data.length > 0) {
									$('#i_nodeItem_id11').combobox('select', tid);
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
//编辑
function editTaskJ(tid, ttype,url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$("#fromResultJS").trigger("click");
			getTreeInfo("folderId11");
			$("#formJS").form('myLoad', data.data);
			$("#taskId11").val(data.data.taskId);
			$('#folderId11').combotree('setValue', data.data.folderId);
			delAllLineJS(true);
			btnAddJS();
			$.each(data.data.paraList, function(i, btn) {
				addLineJS(i, btn);
			});
			$(".validatebox-tip").remove();
			$(".tooltip").removeClass("tooltip tooltip-right");
			$('#t_newTask_js').window('open');
			// 全屏
//			$('#command11').textareafullscreen();
			command11Editor.setValue(data.data.command);
			$('#forRModuleNameJ').val('TASKJ');
			$('#forRTableNameJ').val('TB_TASK_J');
		}
	});
}

//取消
function canleJS() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultJS").trigger("click");
			$('#t_newTask_js').window('close');
		}
	});
}
function btnAddJS() {
	$('#addLine_btnJS').unbind('click').click(addLineJS); // 新增一行
	$('#delAllLine_btnJS').unbind('click').click(function() {// 删除全部
		var table = $("#btn-tbJS"); // 待操作表单
		var tab = document.getElementById("btn-tbJS");
		var rows = tab.rows.length;
		if (rows > 1) {// 表头信息
			$.messager.confirm('确认', '您确定要删除记录？', function(r) {
				if (r) {
					delAllLineJS(true);
				}
			});
		} else {
			$.messager.alert('提示', "无待删除信息！", 'info');
		}
	});
}

function addLineJS(i, data) {
	var table = $("#btn-tbJS");
	var tab = document.getElementById("btn-tbJS");
	var rows = tab.rows.length;
	var html = "<tr class='tb-line'>";
	html += "	<td width=\"5%\"><input name=\"no\" class=\"easyui-validatebox text-name\" style=\"width:100%;border-style: none; text-align: center;\" value=\""
			+ rows + "\" data-options=\"editable :false\"></td>";
	html += "	<td width=\"40%\"><input name=\"scriptVar\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%\" data-options=\"required:true\"></td>";
	html += "	<td width=\"45%\"><input name=\"hhdiVar\" class=\"easyui-validatebox form-control\" type=\"text\" style=\"width:95%;\" data-options=\"required:true\"></td>";
	html += "	<td width=\"10%\"><a class=\"easyui-linkbutton remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
	html += "	</td>";
	html += "</tr>";
	var line = $(html);
	// 版定删除按钮事件
	$(".remove-btn", line).click(function() {
		$.messager.confirm('确认', '您确定要删除记录？', function(r) {
			if (r) {
				delLineJS(line);
			}
		});
	});
	if (data) {
		$("input[name='scriptVar']", line).val(data.scriptVar);
		$("input[name='hhdiVar']", line).val(data.hhdiVar);
	}
	$.parser.parse(line);// 解析esayui标签
	table.append(line);
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
}

// 删除全部
function delAllLineJS(b) {
	if (b) {
		$(".tb-line").each(function(i, line) {
			delLineJS($(line));
		});
	}
}
// 删除单行
function delLineJS(line) {
	if (line) {
		line.fadeOut("fast", function() {
			$(this).remove();
		});
	}
}