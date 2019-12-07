var _taskEType;// 页面数据来源-转换任务或作业流程
var successInfoArr=[];//剖析规则中的选中数据存储-原始
//var successDelArr=[];//成功条件页面当前数据存储
var transScriptDQEditor;  
$(function() {
	_taskEType = $("#_taskEType").val();
	transScriptDQEditor = CodeMirror.fromTextArea(document.getElementById('transScriptDQ'), {
	    lineNumbers: false,//显示行数
	    mode: 'text/x-sql',//模式
	    smartIndent: true,//自动缩进是否开启
	    matchBrackets : true,//括号匹配
	    autofocus: false, //是否在初始化时自动获取焦点
	    tabSize : 2, 
	    lineWrapping : true,
	    scrollbarStyle :null//不显示滚动条
	  });
	transScriptDQEditor.setOption("extraKeys", {
	        // F11键切换全屏
	        "F11": function(cm) {
	        	var maxFlag=$('#t_newTask_DQ').window('options')["maximized"];//是否最大化
	        	if(maxFlag){
		            if(cm.getOption("fullScreen")){
	        			$("#t_newTask_DQ").window('restore');
	        			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        		}else{
	        			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        		}
	        	}else{
	        		$("#t_newTask_DQ").window('maximize');
					cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        	}
	        },
	        // Esc键退出全屏
	        "Esc": function(cm) {
	        	$("#t_newTask_DQ").window('restore');
	            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        }
	    });
	  $('#t_newTask_DQ').window({
			onResize :function(){
				var h=$('#t_newTask_DQ').height();
				transScriptDQEditor.setSize('auto',h-310);
			}
		});
	   $('#dqtabs').tabs({
		    onSelect:function(title,index){
		    	transScriptDQEditor.refresh();
		    }
		});
});
/**
 * 增加数据质量
 */
function addDQ() {
	$("#fromResultDQ").trigger("click");
	$("#dbConnection13").combobox("clear");
	$("#tableId").combobox("clear");
	$('#t_newTask_DQ').window('open');
	initDQ();
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName = $("#search_folderName").val();// 当前所属文件夹名称
	_id = sfolderId;
	_text = sfolderName;
	getTreeInfo("folderId13");
	getTreeFolder("folderId13");
	delAllLine(true);
	$("#dqtabs").tabs('select', "基本信息");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	//TODO 删除成功条件
	successInfoArr=[];
	emptySuccessTable();
	//清空源表查询语句
//	$("#transScriptDQ").val('');
	transScriptDQEditor.setValue('');
	$("#colDetailInfo").val('');
	$('#successParam').val('');
};

// 保存变量信息
function saveAnaly() {
	var taskNo;
	var taskName;
	var NoName;
	var taskId;
	if (_taskEType == 'forJob') {// 来自作业流程页面
		taskNo = $("#taskNo13").val();
		taskName = $("#taskName13").val();
		NoName = "【" + taskNo + "】" + taskName;
		taskId = $("#taskId13").val();
	}
	var rows = document.getElementById("btn-tb2").rows.length;
	if ($("#formDQ").form('validate')) {// 启用校验
		if ($("#taskNo13").val() == "") {
			$.messager.alert('提示', "任务编号必填", 'waring');
		} else if ($("#taskName13").val() == "") {
			$.messager.alert('提示', "任务名称必填", 'waring');
		} else if (($('#tableId').combobox('getValue') == "" && transScriptDQEditor.getValue() == "")) {
			$.messager.alert('提示', "表名或者SQL语句必填", 'waring');
		} else if (rows == 1) {
			$.messager.alert('提示', "至少添加一条剖析项", 'waring');
		} else {
			var isNull = false;
			$("#btn-tb2").find("tr").each(function(i, value) {
				if ($(this).find("select[name='analyType']").val() == '7') {
					var refValue = $(this).find("input[name='config']").val();
					if (refValue.indexOf("あ") == -1) {
						isNull = true;
					}

				}
			})
			if (isNull) {
				$.messager.alert('提示', "参照完整性检查需要配置参数，请检查.", 'waring');
			} else {
				var valueNull = false;
				var ruleNameNull = false;
				//【成功条件】值信息
				$("select[name='ruleName']").each(function(j, value) {
					var rId=value.id;
					if($('#'+rId).val() == '' || $('#'+rId).val() == null){
						ruleNameNull=true;
						return false;//退出循环
					}
				});
				$("input[name='value']").each(function(j, value) {
					var vId=value.id;
					if($('#'+vId).val() == '' || $('#'+vId).val() == null){
						valueNull=true;
						return false;
					}
				});
				if (ruleNameNull) {
					$.messager.alert('提示', "成功条件中剖析规则不能为空，请检查.", 'waring');
				}else if (valueNull) {
					$.messager.alert('提示', "成功条件中值不能为空，请检查.", 'waring');
				}else{
					//移除disable属性，用于传参
					$("input[name='ruleType']").removeAttr("disabled");
					transScriptDQEditor.save();
					$.ajax({
						type : "POST",
						url : "task/saveDQ.action",
						dataType : 'json',
						data : $('#formDQ').serialize(),
						success : function(msg) {
							$.messager.alert('提示', "保存成功！", 'info');
							$("#fromResultDQ").trigger("click");
							$('#t_newTask_DQ').window('close');
							if (_taskEType == 'forTask') {
								sqlWhere();
							} else if (_taskEType == 'forJob') {
								var tid = msg.taskId;
								// //判断是否需要重新加载下拉框数据
								var taskNoName = $("#taskNoName13").val();
								if (taskNoName != NoName) {
									// 重新加载下拉框信息
									$("#i_nodeItem_id13").combobox({
										valueField : 'id',
										textField : 'name',
										editable : true,
										url : 'job/taskList.action?type=13',
										onLoadSuccess : function() {
											var data = $('#i_nodeItem_id13').combobox('getData');
											if (data.length > 0) {
												$('#i_nodeItem_id13').combobox('select',tid);
											}
										}
									});
								}
							}
						}
					});
				}
			}

		}

	} else {
		$.messager.alert('提示', "有非空字段需要填写，请检查.", 'waring');
	}
}
// 取消
function cancelAnaly() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$('#t_newTask_DQ').window('close');
		}
	});
}

// 编辑变量
function editTaskDQ(tid, ttype, url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url,
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$("#fromResultDQ").trigger("click");
			$('#t_newTask_DQ').window('open');
			$("#dbConnection13").combobox("clear");
			$("#tableId").combobox("clear");
			$.messager.progress({
				title : '请稍后',
				msg : '正在加载中...',
			});
			loadDQ();
			$("#formDQ").form('myLoad', data.data);
			$("#colDetailInfo").val("");
			getTreeInfo("folderId13");
			$("#taskId13").val(data.data.taskId);
			$('#folderId13').combotree('setValue', data.data.folderId);
			$("#dbConnection13").combobox('setValue',data.data.dbConnection);
			if (data.data.sourceTables) {
				$("#tableId").combobox('setValues',data.data.sourceTables.split(","));
			}
//			$("#transScriptDQ").val(data.data.rssql);
			gerSql();
			transScriptDQEditor.setValue(data.data.rssql);
			$("#dbConnectionDq").val(data.data.dbConnection);
			var para = JSON.parse(data.data.alyParam);
			$(".tb-line").each(function() {
				$(this).remove();
			});
			successInfoArr=[];
			//清空之前成功条件的信息
			emptySuccessTable();
			//最终确定展示的后台保存的内容，但是下拉框数据依然是【数据剖析】页面
			for (var i = 0; i < para.length; i++) {
				if (i == 0) {
					$("#colDetailInfo").val(para[0].colInfo);
				}
				//暂时没有赋值规则类型名称
//				successInfoArr.push((i+1)+":"+para[i].colName+";"+para[i].analyType);
				successInfoArr.push((i+1)+":"+para[i].colName);
				//剖析规则
				addOne(i, para[i], "2");
			}
//			console.log(successInfoArr);
			//添加成功条件
			if(data.data.successParam != ""  &&  data.data.successParam != null ){
				//用于回显信息
				$('#successParam').val(data.data.successParam);
				var successInfo=JSON.parse(data.data.successParam);
				for (var i = 0; i < successInfo.length; i++) {
					var infoData=successInfo[i].ruleName+";"+successInfo[i].ruleType;
					addSuccessOne(i, infoData, "2");
				}
			}else{
				$('#successParam').val('');
				//不再直接级联添加信息
//				for (var i = 0; i < successInfoArr.length; i++) {
//					addSuccessOne(i, successInfoArr[i], "2");
//				}
			}
			$.messager.progress('close');
			$('#forRModuleNameDQ').val('TASKDQ');
			$('#forRTableNameDQ').val('TB_TASK_DQ');
		}
	});
}
/**
 * 加载下来信息
 */
function loadDQ() {
	$("#dbConnection13").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		onLoadSuccess : gerSql,
		url : 'tbMdTable/listConnnectJdbc.action',
		onChange : function(newValue, oldValue) {
			var conId = newValue;
			$("#tableId").combobox({
				valueField : 'tableName',
				textField : 'stname',
				multiple : true,
				url : 'tbMdTable/connnectTable.action?id=' + conId,
				formatter : function(row) {
					var opts = $(this).combobox('options');
					return '<input type="checkbox" class="combobox-checkbox">'
					+ row[opts.textField]
				},
				onChange : function(newValue, oldValue) {
					gerSql();
				},
				onShowPanel : function() {
					var opts = $(this).combobox('options');
					var target = this;
					var values = $(target).combobox('getValues');
					$.map(values, function(value) {
						var el = opts.finder.getEl(target, value);
						el.find('input.combobox-checkbox')._propAttr('checked',
								true);
					})
				},
				onLoadSuccess : function() {
					var opts = $(this).combobox('options');
					var target = this;
					var values = $(target).combobox('getValues');
					$.map(values, function(value) {
						var el = opts.finder.getEl(target, value);
						el.find('input.combobox-checkbox')._propAttr('checked',
								true);
					})
				},
				onSelect : function(row) {
					var opts = $(this).combobox('options');
					var el = opts.finder.getEl(this, row[opts.valueField]);
					el.find('input.combobox-checkbox')._propAttr('checked',
							true);
				},
				onUnselect : function(row) {
					var opts = $(this).combobox('options');
					var el = opts.finder.getEl(this, row[opts.valueField]);
					el.find('input.combobox-checkbox')._propAttr('checked',
							false);
				}
			});
		}
	});

}
/**
 * 初始化下来信息
 */
function initDQ() {
	$("#dbConnection13").combobox({
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,// 不可编辑
		onLoadSuccess : onLoadSuccess,
		url : 'tbMdTable/listConnnectJdbc.action',
		onChange : function(newValue, oldValue) {
			var conId = newValue;
			$("#tableId").combobox({
				valueField : 'tableName',
				textField : 'stname',
				url : 'tbMdTable/connnectTable.action?id=' + conId,
				multiple : true,
				formatter : function(row) {
					var opts = $(this).combobox('options');
					return '<input type="checkbox" class="combobox-checkbox">'
					+ row[opts.textField]
				},
				onChange : function(newValue, oldValue) {
					gerSql();
				},
				onShowPanel : function() {
					var opts = $(this).combobox('options');
					var target = this;
					var values = $(target).combobox('getValues');
					$.map(values, function(value) {
						var el = opts.finder.getEl(target, value);
						el.find('input.combobox-checkbox')._propAttr('checked',
								true);
					})
				},
//				onLoadSuccess : function() {
//					var opts = $(this).combobox('options');
//					var target = this;
//					var values = $(target).combobox('getValues');
//					$.map(values, function(value) {
//						var el = opts.finder.getEl(target, value);
//						el.find('input.combobox-checkbox')._propAttr('checked',
//								true);
//					})
//				},
				onSelect : function(row) {
					var opts = $(this).combobox('options');
					var el = opts.finder.getEl(this, row[opts.valueField]);
					el.find('input.combobox-checkbox')._propAttr('checked',
							true);
				},
				onUnselect : function(row) {
					var opts = $(this).combobox('options');
					var el = opts.finder.getEl(this, row[opts.valueField]);
					el.find('input.combobox-checkbox')._propAttr('checked',
							false);
				},
				onLoadSuccess : onLoadSuccess
			});
		}
	});

}
/**
 * 加载成功后执行的内容
 */
function onLoadSuccess() {
	var id = $("#taskId13").val();
	if (id == null || id == "") { // 当新增表单时
		var target = $(this);
		var data = target.combobox("getData");
		var options = target.combobox("options");
		if (data && data.length > 0) {
			var fs = data[0];
			target.combobox("setValue", fs[options.valueField]);
		}
	}
	gerSql();
}

// 移除一行
function removeLine(ts) {
	$(ts).parent().parent().remove();
	$("#expectId").find("tr").each(function(i, value) {
		$(this).find("td").each(function(i1, value1) {
			if (i1 == 0) {
				$(this).find("span").each(function(i2, value2) {
					if (i2 == 0) {
						$(this).html((i + 1) + ":");
					}
				})
			}
		})
	})

}
function removeLine1(ts) {
	$(ts).parent().parent().remove();
	$("#expressId").find("tr").each(function(i, value) {
		$(this).find("td").each(function(i1, value1) {
			if (i1 == 0) {
				$(this).html((i + 1));
			}
		})
	})

}

// 执行查询
$("#stopQueryDQ").hide();
$("#showInfoDQ").click(
		function() {
			$("#showInfoDQ").hide();
			$("#stopQueryDQ").show();
			var datanulldiv = $('#datanulldivDQ');
			datanulldiv.empty();// 清除以前提醒数据
			datanulldiv.show();
			datanulldiv.append('<span>正在查询中...</span>');
			var variableInfo = $("#variableInfoDQ").val();
			var arr = new Array();
			arr = jsonData;
			var transScript; // 转换脚本
			var sourceConnection;
			var sourceTable;
			var _taskType = $("#_taskTypeDQ").val();
			if (_taskType === '3') { // 变量
				sourceConnection = $('#dbConnection13').combobox('getValue');
				sourceTable = "";
				transScript = $("#variableScript3").val();
			} else if (_taskType === '1') { // 异构
				sourceConnection = $('#dbConnection13').combobox('getValue');
				sourceTable = $('#tableId').combobox('getValue');
//				transScript = $("#transScriptDQ").val();
				transScript = transScriptDQEditor.getValue();
			}
			var varKey = "";
			var varValue = "";
			for (var i = 0; i < arr.length; i++) {
				var v = JSON.stringify(arr[i]).replace('"', '')
						.replace('"', '');
				varKey += v + ",";
				varValue += $("#" + v).val() + ",";
			}
			var array = [];
			var columns = [];
			if (sourceTable == undefined) {
				sourceTable = ' ';
			}
			var _data = {};
			_data.sourceConnection = sourceConnection;
			_data.sourceTable = sourceTable;
			_data.transScript = transScript;
			_data.varKey = varKey;
			_data.varValue = varValue;
			_data.category = $('#category').val();
			// ajax提交form
			$.ajax('task/getDataFields.action', {
				type : 'post',
				dataType : 'json',
				data : _data,
				success : function(data) {
					$("#showInfoDQ").show();
					$("#stopQueryDQ").hide();
					datanulldiv.empty();
					$("#fordatagridDQ").show();
					var info = data.info
					var table = $("#str-listDQ");
					if (info == '0') {
						metaLsit = data.metaList;
						$(metaLsit).each(function() {
							array.push({
								field : '',
								title : '',
								sortable : '',
								width : ''
							});
							// sum++;
						});
						columns.push(array);
						// num=(100/sum).toFixed(0)+"%";//N为保留几位小数
						$(metaLsit).each(
								function(index, el) {
									columns[0][index]['field'] = el;
									columns[0][index]['title'] = el;
									columns[0][index]['width'] = 100;
									columns[0][index]['sortable'] = true;
									columns[0][index]['formatter'] = function(
											value, row, index) {
										return '<span title=' + value + '>'
												+ value + '</span>';
									};
								});
						var url = "task/preview.action";
						showPreviewListDQ(columns, url, _data);
					} else {
						$("#fordatagridDQ").hide();// 清除表格中以前查询的数据
						var remindmanager = data.error;
						datanulldiv.show();
						datanulldiv.empty();
						datanulldiv.append(remindmanager);
					}

				}
			});
		});

// 展示表数据信息
function showPreviewListDQ(columns, url, params) {
	$('#str-listDQ').datagrid({
		url : url,
		view : scrollview, // 虚拟滚动
		rownumbers : true,
		singleSelect : false,
		remoteSort : false,
		pageSize : 20,
		height : 280,
		columns : columns,
		queryParams : params,
		onLoadError : function(data) { // 打印异常信息
			Peony.alert('提示', data.responseText, 'error');
		}
	})
}

// 停止查询
$("#stopQueryDQ").click(function() {
	$("#showInfoDQ").show();
	$("#stopQueryDQ").hide();
	var datanulldiv = $('#datanulldivDQ');
	datanulldiv.empty();
	datanulldiv.show();
	datanulldiv.append('<span>执行查询中止中...</span>');
	$.ajax('task/stopQueryForPreview.action', {
		type : 'post',
		dataType : 'json',
		data : {},
		success : function(data) {
			datanulldiv.empty();// 清除以前提醒数据
			datanulldiv.append('<span>执行查询已中止</span>');
		},
		error : function(data) {
			datanulldiv.empty();// 清除以前提醒数据
			datanulldiv.append('<span>执行失败——' + data.error + '</span>');
		}
	});
});

// 取消查询预览
$("#cancelInfoDQ").click(function() {
	$('#t_test_variate_DQ').window('close');
});

// 生成sql
$("#btn_generateSql").click(function() {
	// 根据源表的第一个表的表结构产生 select 语句，把每个字段都写上去且独占一行
	var conn = $("#dbConnection13").combobox('getValue');
	var table = $("#tableId").combobox('getValue');
	if (conn.length == 0) {
		Peony.alert('提示', '请先选择一个“来源数据连接”。', 'warning');
		return false;
	}
	if (table.length == 0) {
		Peony.alert('提示', '请先选择一个“源表”。', 'warning');
		return false;
	}
	var tab = table.split(",")[0];
	$.get("task/generateSelectScript?connection=" + conn + "&table="
			+ tab, function(data) {
		if (data.success) {
//			$("#transScriptDQ").val(data.msg);
			transScriptDQEditor.setValue(data.msg);
			gerSql();
		} else {
			Peony.alert('提示', data.msg, 'error');
		}
	});
});
// 处理数字
function dealNumber(ts, type, value) {
	var select = "";
	if (value == "") {
		select = "<table class='yahei' border='1' cellspacing='0'>"
				+ "<tr><td width='20px' align='center'>1</td><td>&nbsp;&nbsp;<input checked=\"true\"  type=\"checkbox\" id='numName0' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;所有行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2<td>&nbsp;&nbsp;<input checked=\"true\"  type=\"checkbox\" id='numName1' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;Null值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>3<td>&nbsp;&nbsp;<input checked=\"true\"  type=\"checkbox\" id='numName2' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;零值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>4<td>&nbsp;&nbsp;<input  checked=\"true\" type=\"checkbox\" id='numName3' name=\"numName\" /><font size='2'>&nbsp;&nbsp;正值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>5<td>&nbsp;&nbsp;<input checked=\"true\" type=\"checkbox\" id='numName4' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;负值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>6<td>&nbsp;&nbsp;<input checked=\"true\" type=\"checkbox\" id='numName5' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;最大值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>7<td>&nbsp;&nbsp;<input checked=\"true\" type=\"checkbox\" id='numName6' name=\"numName\" /><font size='2'>&nbsp;&nbsp;最小值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>8<td>&nbsp;&nbsp;<input checked=\"true\" type=\"checkbox\" id='numName7' name=\"numName\" /><font size='2'>&nbsp;&nbsp;汇总值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>9<td>&nbsp;&nbsp;<input checked=\"true\" type=\"checkbox\" id='numName8' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;平均值</font>&nbsp;</td></tr>"
				+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);
	} else {
		select = "<table class='yahei' border='1' cellspacing='0'>"
				+ "<tr><td width='20px' align='center'>1</td><td>&nbsp;&nbsp;<input   type=\"checkbox\" id='numName0' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;所有行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td>&nbsp;&nbsp;<input  type=\"checkbox\" id='numName1' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;Null值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>3</td><td>&nbsp;&nbsp;<input  type=\"checkbox\" id='numName2' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;零值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>4</td><td>&nbsp;&nbsp;<input  type=\"checkbox\" id='numName3' name=\"numName\" /><font size='2'>&nbsp;&nbsp;正值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>5</td><td>&nbsp;&nbsp;<input  type=\"checkbox\" id='numName4' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;负值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>6</td><td>&nbsp;&nbsp;<input  type=\"checkbox\" id='numName5' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;最大值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>7</td><td>&nbsp;&nbsp;<input  type=\"checkbox\" id='numName6' name=\"numName\" /><font size='2'>&nbsp;&nbsp;最小值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>8</td><td>&nbsp;&nbsp;<input  type=\"checkbox\" id='numName7' name=\"numName\" /><font size='2'>&nbsp;&nbsp;汇总值</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>9</td><td>&nbsp;&nbsp;<input  type=\"checkbox\" id='numName8' name=\"numName\"  /><font size='2'>&nbsp;&nbsp;平均值</font>&nbsp;</td></tr>"
				+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);
		var getValue = value.split(",");

		for (var int = 0; int < getValue.length; int++) {
			if (getValue[int] == "1") {
				$("#numName" + int).attr("checked", 'true');
			}
		}
	}

	$("#openEditor").dialog({
		title : "数字型分析",
		width : 600,
		height : 400,
		closed : false,
		cache : false,
		href : '',
		center : true,
		modal : true,
		toolbar : [ {
			text : '保存',
			iconCls : 'icon-save',
			handler : function() {
				var arr = document.getElementsByName('numName');
				var ifExcute = "";
				for (var int = 0; int < arr.length; int++) {
					if (int == 0) {
						if (arr[int].checked) {
							ifExcute = "1";
						} else {
							ifExcute = "0";
						}
					} else {
						if (arr[int].checked) {
							ifExcute = ifExcute + "," + "1";
						} else {
							ifExcute = ifExcute + "," + "0";
						}
					}

				}
				$($(ts).next()).val(ifExcute);
				$("#openEditor").dialog('close');
			}
		} ],
	});
}
// 处理值匹配
function dealMatcher(ts, type, value) {
	var select = "";
	if (value == "") {
		var content = "<div>"
				+ select
				+ "</div><div class=\"label-title\">期望值</div>"
				+ "<span class='l-btn-text'>大小写是否敏感：&nbsp;</span><input checked=\"true\"  type=\"checkbox\" id='ifCase' name=\"ifCase\"  />"
				+ "<span class='l-btn-text'>&nbsp;&nbsp;&nbsp;空格是否敏感：&nbsp;</span><input checked=\"true\" id='ifSpace' type=\"checkbox\" name=\"ifSpace\"  />"
				+ "<table class='yahei' style='border-collapse:separate;border-spacing:0px 10px;' id='expectId'>"
				+ "<tr><td style='width:30px'><span class='l-btn-text'>1：</span></td><td><input name='expectName' class=\"easyui-validatebox form-control\" style='width:300px;height:24px;border-radius:0px;' type='text'></td>"
				+ "<td style='width:100px;' align=\"center\" ><a  class=\"l-btn l-btn-small l-btn-plain\" onclick='removeLine(this)' href='javascript:void(0)'><span class='l-btn-left l-btn-icon-left'><span class='l-btn-text'>移除</span><span class='l-btn-icon icon-remove'></span></span></a></td>"
				+ "</tr>" + "</table>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);

	} else {
		var content = "<div>"
				+ select
				+ "</div><div class=\"label-title\">期望值</div>"
				+ "<table><tr><td width='160px'><span class='l-btn-text'>大小写是否敏感：&nbsp;</span><input checked=\"true\"  type=\"checkbox\" id='ifCase' name=\"ifCase\"  /></td>"
				+ "<td><span class='l-btn-text'>&nbsp;&nbsp;&nbsp;空格是否敏感：&nbsp;</span><input checked=\"true\" id='ifSpace' type=\"checkbox\" name=\"ifSpace\"  /></td>"
				+ "</tr></table>"
				+ "<table class='yahei' style='border-collapse:separate;border-spacing:0px 10px;' id='expectId'>"
				+ "<tr><td style='width:30px'><span class='l-btn-text'>1：</span></td><td><input style='width:300px;height:24px;border-radius:0px;' class=\"easyui-validatebox form-control\" name='expectName'  type='text'></td></tr><tr><td><span class='l-btn-text'>2：</span></td><td><input name='expectName' style='width:300px;height:24px;border-radius:0px;' class=\"easyui-validatebox form-control\" type='text'></td>"
				+ "<td style='width:100px;' align=\"center\" ><a  class=\"l-btn l-btn-small l-btn-plain\" onclick='removeLine(this)' href='javascript:void(0)'><span class='l-btn-left l-btn-icon-left'><span class='l-btn-text'>移除</span><span class='l-btn-icon icon-remove'></span></span></a></td>"
				+ "</tr>" + "</table>";
		var html = content;
		$("#openEditor").empty();
		$.parser.parse(html);
		$("#openEditor").append(html);
		var config = JSON.parse(value.replace(/'/g, "\""));
		var ifCase = config.ifCase;
		var ifSpace = config.ifSpace;
		var expVals = config.expectVal;
		if (ifCase == "1") {
			$("#ifCase").attr('checked', 'true');
		} else {
			$("#ifCase").removeAttr("checked");
		}
		if (ifSpace == "1") {
			$("#ifSpace").attr('checked', 'true');
		} else {
			$("#ifSpace").removeAttr("checked");
		}
		var evalues = expVals.split(",");
		if (evalues.length > 0) {
			$("#expectId").empty();
			for (var i = 0; i < evalues.length; i++) {
				if (evalues[i].indexOf("~") > 0) {
					$("#expectId").append(
							"<tr><td style='width:30px'><span class='l-btn-text'>"
									+ (i + 1)
									+ "：</span></td><td style='width:300px;'><input value="
									+ evalues[i].split("~")[0]
									+ " style='width:145px;height:24px;border-radius:0px;float:left;' class=\"easyui-validatebox form-control\" name='expectName' type='text'><input value="
									+ evalues[i].split("~")[1]
									+ " style='width:145px;height:24px;border-radius:0px;float:left;margin-left:10px;' class=\"easyui-validatebox form-control\" name='expectName' type='text'></td>"
									+ "<td style='width:100px;' align=\"center\" ><a  class=\"l-btn l-btn-small l-btn-plain\" onclick='removeLine(this)' href='javascript:void(0)'><span class='l-btn-left l-btn-icon-left'><span class='l-btn-text'>移除</span><span class='l-btn-icon icon-remove'></span></span></a></td>"
									+ "</tr>");
				} else {
					$("#expectId").append(
							"<tr><td style='width:30px'><span class='l-btn-text'>"
									+ (i + 1)
									+ "：</span></td><td><input style='width:300px;height:24px;border-radius:0px;' class=\"easyui-validatebox form-control\" name='expectName' value='"
									+ evalues[i]
									+ "' type='text'></td>"
									+ "<td style='width:100px;' align=\"center\" ><a  class=\"l-btn l-btn-small l-btn-plain\" onclick='removeLine(this)' href='javascript:void(0)'><span class='l-btn-left l-btn-icon-left'><span class='l-btn-text'>移除</span><span class='l-btn-icon icon-remove'></span></span></a></td>"
									+ "</tr>");
				}
			}
		}
	}

	$("#openEditor").dialog({
			title : "值匹配检查",
			width : 600,
			height : 400,
			closed : false,
			cache : false,
			center : true,
			modal : true,
			toolbar : [{
				text : '保存',
				iconCls : 'icon-save',
				handler : function() {
					var ifCase = "0";
					var ifSpace = "0";
					var ifExcute = "";
					var expVals = "";
					if ($("#ifCase").is(':checked')) {
						ifCase = "1";
					}
					if ($("#ifSpace").is(':checked')) {
						ifSpace = "1";
					}
					$("#expectId").find("tr").each(function(value, i) {
							var innerValue = "";
							$(this).find("input[name=expectName]").each(
									function(val,ii) {
										if (val == 0) {
											innerValue = $(
													this)
													.val();
										} else {
											innerValue = innerValue+ "~"+ $(this).val();
										}
									})
							if (value == 0) {
								expVals = innerValue;
							} else {
								expVals = expVals
										+ ","
										+ innerValue;
							}
						})
					var arr = document.getElementsByName('expName');
					var config = {
						method : '',
						expectVal : expVals,
						ifCase : ifCase,
						ifSpace : ifSpace
					}
					$($(ts).next()).val(
							JSON.stringify(config).replace(
									/"/gm, "'"));
					$("#openEditor").dialog('close');
				}
			},
			{
				text : '增加期望值',
				iconCls : 'icon-add',
				handler : function() {
					var len = $("#expectId").find("tr").length;
					$("#expectId").append(
							"<tr><td style='width:30px'><span class='l-btn-text'>"
									+ Number(len + 1)
									+ "：</span></td><td><input style='width:300px;height:24px;border-radius:0px;' class=\"easyui-validatebox form-control\" name='expectName' type='text'></td>"
									+ "<td style='width:100px;' align=\"center\" ><a  class=\"l-btn l-btn-small l-btn-plain\" onclick='removeLine(this)' href='javascript:void(0)'><span class='l-btn-left l-btn-icon-left'><span class='l-btn-text'>移除</span><span class='l-btn-icon icon-remove'></span></span></a></td>"
									+ "</tr>");

				}
			},
			{
				text : '增加期望值范围',
				iconCls : 'icon-add',
				handler : function() {
					var len = $("#expectId").find("tr").length;
					$("#expectId").append(
							"<tr><td style='width:30px'><span class='l-btn-text'>"
									+ Number(len + 1)
									+ "：</span></td><td style='width:300px;'><input style='width:145px;height:24px;border-radius:0px;float:left;' class=\"easyui-validatebox form-control\" name='expectName' type='text'><input style='width:145px;height:24px;border-radius:0px;float:left;margin-left:10px;' class=\"easyui-validatebox form-control\" name='expectName' type='text'></td>"
									+ "<td style='width:100px;' align=\"center\" ><a  class=\"l-btn l-btn-small l-btn-plain\" onclick='removeLine(this)' href='javascript:void(0)'><span class='l-btn-left l-btn-icon-left'><span class='l-btn-text'>移除</span><span class='l-btn-icon icon-remove'></span></span></a></td>"
									+ "</tr>");

				}
			} ],
		});
}
// 处理字符值
function dealCharactor(ts, type, value) {
	var select = "";
	if (value == "") {
		select = "<table class='yahei' border='1' cellspacing='0'>"
				+ "<tr><td width='20px' align='center'>1</td><td width='130px'><input checked=\"true\"  type=\"checkbox\" id='charaName0' name=\"charaName\"  /><font size='2'>&nbsp;&nbsp;所有行数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>9</td><td width='130px'><input  checked=\"true\"   type=\"checkbox\" id='charaName1' name=\"charaName\"  /><font size='2'>&nbsp;&nbsp;空值行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td><input checked=\"true\" type=\"checkbox\" id='charaName2' name=\"charaName\"  /><font size='2'>&nbsp;&nbsp;有空格行数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>10</td><td><input checked=\"true\" type=\"checkbox\" id='charaName3' name=\"charaName\"  /><font size='2'>&nbsp;&nbsp;全大写数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>3</td><td><input checked=\"true\" type=\"checkbox\" id='charaName4' name=\"charaName\"  /><font size='2'>&nbsp;&nbsp;全小写数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>11</td><td><input checked=\"true\" type=\"checkbox\" id='charaName5' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;总字符数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>4</td><td><input checked=\"true\" type=\"checkbox\" id='charaName6' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;最大字符数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>12</td><td><input checked=\"true\" type=\"checkbox\" id='charaName7' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;最小字符数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>5</td><td><input checked=\"true\" type=\"checkbox\" id='charaName8' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;平均字符数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>13</td><td><input checked=\"true\" type=\"checkbox\" id='charaName9' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;前后有空格数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>6</td><td><input checked=\"true\" type=\"checkbox\" id='charaName10' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;前有空格数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>14</td><td><input checked=\"true\" type=\"checkbox\" id='charaName11' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;后有空格数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>7</td><td><input checked=\"true\" type=\"checkbox\" id='charaName12' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;最大空格数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>15</td><td><input checked=\"true\" type=\"checkbox\" id='charaName13' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;数字字符数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>8</td><td><input checked=\"true\" type=\"checkbox\" id='charaName14' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;纯字母字符数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>16</td><td><input checked=\"true\" type=\"checkbox\" id='charaName15' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;包含特殊字符数</font>&nbsp;</td></tr>"
				+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);

	} else {
		select = "<table class='yahei' border='1' cellspacing='0'>"
				+ "<tr><td width='20px' align='center'>1</td><td width='130px'><input   type=\"checkbox\" id='charaName0' name=\"charaName\"  /><font size='2'>&nbsp;&nbsp;所有行数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>9</td><td width='130px'><input     type=\"checkbox\" id='charaName1' name=\"charaName\"  /><font size='2'>&nbsp;&nbsp;空值行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td><input  type=\"checkbox\" id='charaName2' name=\"charaName\"  /><font size='2'>&nbsp;&nbsp;有空格行数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>10</td><td><input  type=\"checkbox\" id='charaName3' name=\"charaName\"  /><font size='2'>&nbsp;&nbsp;全大写数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>3</td><td><input  type=\"checkbox\" id='charaName4' name=\"charaName\"  /><font size='2'>&nbsp;&nbsp;全小写数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>11</td><td><input  type=\"checkbox\" id='charaName5' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;总字符数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>4</td><td><input  type=\"checkbox\" id='charaName6' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;最大字符数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>12</td><td><input  type=\"checkbox\" id='charaName7' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;最小字符数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>5</td><td><input  type=\"checkbox\" id='charaName8' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;平均字符数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>13</td><td><input  type=\"checkbox\" id='charaName9' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;前后有空格数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>6</td><td><input  type=\"checkbox\" id='charaName10' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;前有空格数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>14</td><td><input  type=\"checkbox\" id='charaName11' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;后有空格数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>7</td><td><input  type=\"checkbox\" id='charaName12' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;最大空格数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>15</td><td><input  type=\"checkbox\" id='charaName13' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;数字字符数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>8</td><td><input  type=\"checkbox\" id='charaName14' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;纯字母字符数</font>&nbsp;</td>"
				+ "<td width='20px' align='center'>16</td><td><input  type=\"checkbox\" id='charaName15' name=\"charaName\" /><font size='2'>&nbsp;&nbsp;包含特殊字符数</font>&nbsp;</td></tr>"
				+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);
		var getValue = value.split(",");

		for (var int = 0; int < getValue.length; int++) {
			if (getValue[int] == "1") {
				$("#charaName" + int).attr("checked", 'true');
			}
		}
	}

	$("#openEditor").dialog({
		title : "字符值分析",
		width : 600,
		height : 400,
		closed : false,
		cache : false,
		href : '',
		center : true,
		modal : true,
		toolbar : [ {
			text : '保存',
			iconCls : 'icon-save',
			handler : function() {
				var arr = document.getElementsByName('charaName');
				var ifExcute = "";
				for (var int = 0; int < arr.length; int++) {
					if (int == 0) {
						if (arr[int].checked) {
							ifExcute = "1";
						} else {
							ifExcute = "0";
						}
					} else {
						if (arr[int].checked) {
							ifExcute = ifExcute + "," + "1";
						} else {
							ifExcute = ifExcute + "," + "0";
						}
					}

				}
				$($(ts).next()).val(ifExcute);
				$("#openEditor").dialog('close');
			}
		} ],
	});

}
// 处理日期值
function dealDate(ts, type, value) {
	var select = "";
	if (value == "") {
		select = "<table class='yahei' border='1' cellspacing='0'>"
				+ "<tr><td width='20px' align='center'>1</td><td><input  checked=\"true\"  type=\"checkbox\" id='dateName0' name=\"dateName\"  /><font size='2'>&nbsp;&nbsp;所有行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td><input  checked=\"true\" type=\"checkbox\" id='dateName1' name=\"dateName\"  /><font size='2'>&nbsp;&nbsp;Null值行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>3</td><td><input  checked=\"true\" type=\"checkbox\" id='dateName2' name=\"dateName\"  /><font size='2'>&nbsp;&nbsp;最大日期</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>4</td><td><input  checked=\"true\" type=\"checkbox\" id='dateName3' name=\"dateName\" /><font size='2'>&nbsp;&nbsp;最小日期</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>5</td><td><input  checked=\"true\" type=\"checkbox\" id='dateName4' name=\"dateName\"  /><font size='2'>&nbsp;&nbsp;最大时间</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>6</td><td><input  checked=\"true\" type=\"checkbox\" id='dateName5' name=\"dateName\"  /><font size='2'>&nbsp;&nbsp;最小时间</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>7</td><td><input  checked=\"true\" type=\"checkbox\" id='dateName6' name=\"dateName\" /><font size='2'>&nbsp;&nbsp;平均值</font>&nbsp;</td></tr>"
				+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);

	} else {
		select = "<table class='yahei' border='1' cellspacing='0'>"
				+ "<tr><td width='20px' align='center'>1</td><td><input    type=\"checkbox\" id='dateName0' name=\"dateName\"  /><font size='2'>&nbsp;&nbsp;所有行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td><input   type=\"checkbox\" id='dateName1' name=\"dateName\"  /><font size='2'>&nbsp;&nbsp;Null值行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>3</td><td><input   type=\"checkbox\" id='dateName2' name=\"dateName\"  /><font size='2'>&nbsp;&nbsp;最大日期</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>4</td><td><input   type=\"checkbox\" id='dateName3' name=\"dateName\" /><font size='2'>&nbsp;&nbsp;最小日期</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>5</td><td><input   type=\"checkbox\" id='dateName4' name=\"dateName\"  /><font size='2'>&nbsp;&nbsp;最大时间</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>6</td><td><input   type=\"checkbox\" id='dateName5' name=\"dateName\"  /><font size='2'>&nbsp;&nbsp;最小时间</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>7</td><td><input   type=\"checkbox\" id='dateName6' name=\"dateName\" /><font size='2'>&nbsp;&nbsp;平均值</font>&nbsp;</td></tr>"
				+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);
		var getValue = value.split(",");
		for (var int = 0; int < getValue.length; int++) {
			if (getValue[int] == "1") {
				$("#dateName" + int).attr("checked", 'true');
			}
		}
	}

	$("#openEditor").dialog({
		title : "日期值分析",
		width : 600,
		height : 400,
		closed : false,
		cache : false,
		href : '',
		center : true,
		modal : true,
		toolbar : [ {
			text : '保存',
			iconCls : 'icon-save',
			handler : function() {
				var arr = document.getElementsByName('dateName');
				var ifExcute = "";
				for (var int = 0; int < arr.length; int++) {
					if (int == 0) {
						if (arr[int].checked) {
							ifExcute = "1";
						} else {
							ifExcute = "0";
						}
					} else {
						if (arr[int].checked) {
							ifExcute = ifExcute + "," + "1";
						} else {
							ifExcute = ifExcute + "," + "0";
						}
					}

				}
				$($(ts).next()).val(ifExcute);
				$("#openEditor").dialog('close');
			}
		} ],
	});

}
// 处理布尔值
function dealBoolean(ts, type, value) {
	var select = "";
	if (value == "") {
		select = "<table class='yahei' border='1' cellspacing='0'>"
				+ "<tr><td width='20px' align='center'>1</td><td><input  checked=\"true\"  type=\"checkbox\" id='boolName0' name=\"boolName\"  /><font size='2'>&nbsp;&nbsp;所有行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td><input  checked=\"true\" type=\"checkbox\" id='boolName1' name=\"boolName\"  /><font size='2'>&nbsp;&nbsp;Null值行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>3</td><td><input  checked=\"true\" type=\"checkbox\" id='boolName2' name=\"boolName\"  /><font size='2'>&nbsp;&nbsp;真值数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>4</td><td><input  checked=\"true\" type=\"checkbox\" id='boolName3' name=\"boolName\" /><font size='2'>&nbsp;&nbsp;假值数</font>&nbsp;</td></tr>"
				+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);
	} else {
		select = "<table class='yahei' border='1' cellspacing='0'>"
				+ "<tr><td width='20px' align='center'>1</td><td><input    type=\"checkbox\" id='boolName0' name=\"boolName\"  /><font size='2'>&nbsp;&nbsp;所有行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td><input   type=\"checkbox\" id='boolName1' name=\"boolName\"  /><font size='2'>&nbsp;&nbsp;Null值行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>3</td><td><input   type=\"checkbox\" id='boolName2' name=\"boolName\"  /><font size='2'>&nbsp;&nbsp;真值数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>4</td><td><input   type=\"checkbox\" id='boolName3' name=\"boolName\" /><font size='2'>&nbsp;&nbsp;假值数</font>&nbsp;</td></tr>"
				+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);
		var getValue = value.split(",");
		for (var int = 0; int < getValue.length; int++) {
			if (getValue[int] == "1") {
				$("#boolName" + int).attr("checked", 'true');
			}
		}
	}

	$("#openEditor").dialog({
		title : "布尔值分析",
		width : 600,
		height : 400,
		closed : false,
		cache : false,
		href : '',
		center : true,
		modal : true,
		toolbar : [ {
			text : '保存',
			iconCls : 'icon-save',
			handler : function() {
				var arr = document.getElementsByName('boolName');
				var ifExcute = "";
				for (var int = 0; int < arr.length; int++) {
					if (int == 0) {
						if (arr[int].checked) {
							ifExcute = "1";
						} else {
							ifExcute = "0";
						}
					} else {
						if (arr[int].checked) {
							ifExcute = ifExcute + "," + "1";
						} else {
							ifExcute = ifExcute + "," + "0";
						}
					}

				}
				$($(ts).next()).val(ifExcute);
				$("#openEditor").dialog('close');
			}
		} ],
	});

}
// 处理重复值检查
function dealRepeat(ts, type, value) {
	var select = "";
	if (value == "") {
		select = "<table class='yahei' border='1' cellspacing='0'>"
//				+ "<tr><td width='20px' align='center'>1</td><td><input  checked=\"true\"  type=\"checkbox\" id='uniqueName0' name=\"uniqueName\"  /><font size='2'>&nbsp;&nbsp;所有行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>2</td><td><input  checked=\"true\" type=\"checkbox\" id='uniqueName1' name=\"uniqueName\"  /><font size='2'>&nbsp;&nbsp;空值行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>3</td><td><input  checked=\"true\" type=\"checkbox\" id='uniqueName2' name=\"uniqueName\"  /><font size='2'>&nbsp;&nbsp;唯一值行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>4</td><td><input  checked=\"true\" type=\"checkbox\" id='uniqueName3' name=\"uniqueName\" /><font size='2'>&nbsp;&nbsp;重复值行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>1</td><td><input  checked=\"true\"  type=\"checkbox\" id='uniqueName0' name=\"uniqueName\"  /><font size='2'>&nbsp;&nbsp;大小写敏感</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td><input  checked=\"true\" type=\"checkbox\" id='uniqueName1' name=\"uniqueName\"  /><font size='2'>&nbsp;&nbsp;空格敏感</font>&nbsp;</td></tr>"
			+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);

	} else {
		select = "<table class='yahei' border='1' cellspacing='0'>"
//				+ "<tr><td width='20px' align='center'>1</td><td><input    type=\"checkbox\" id='uniqueName0' name=\"uniqueName\"  /><font size='2'>&nbsp;&nbsp;所有行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>2</td><td><input   type=\"checkbox\" id='uniqueName1' name=\"uniqueName\"  /><font size='2'>&nbsp;&nbsp;空值行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>3</td><td><input   type=\"checkbox\" id='uniqueName2' name=\"uniqueName\"  /><font size='2'>&nbsp;&nbsp;唯一值行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>4</td><td><input   type=\"checkbox\" id='uniqueName3' name=\"uniqueName\" /><font size='2'>&nbsp;&nbsp;重复值行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>1</td><td><input    type=\"checkbox\" id='uniqueName0' name=\"uniqueName\"  /><font size='2'>&nbsp;&nbsp;大小写敏感</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td><input   type=\"checkbox\" id='uniqueName1' name=\"uniqueName\"  /><font size='2'>&nbsp;&nbsp;空格敏感</font>&nbsp;</td></tr>"
			+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);
		var getValue = value.split(",");
		for (var int = 0; int < getValue.length; int++) {
			if (getValue[int] == "1") {
				$("#uniqueName" + int).attr("checked", 'true');
			}
		}
	}

	$("#openEditor").dialog({
		title : "重复值检查",
		width : 600,
		height : 400,
		closed : false,
		cache : false,
		href : '',
		center : true,
		modal : true,
		toolbar : [ {
			text : '保存',
			iconCls : 'icon-save',
			handler : function() {
				var arr = document.getElementsByName('uniqueName');
				var ifExcute = "";
				for (var int = 0; int < arr.length; int++) {
					if (int == 0) {
						if (arr[int].checked) {
							ifExcute = "1";
						} else {
							ifExcute = "0";
						}
					} else {
						if (arr[int].checked) {
							ifExcute = ifExcute + "," + "1";
						} else {
							ifExcute = ifExcute + "," + "0";
						}
					}

				}
				$($(ts).next()).val(ifExcute);
				$("#openEditor").dialog('close');
			}
		} ],
	});

}
// 处理表达式匹配
function dealExpre(ts, type, value) {
	var html = "<table style=\"border-collapse:separate; border-spacing:2px 10px;\">"
			+ "<tr><td  style='width:50px;'>序号</td><td align='center' style='width:150px;'>名称</td><td align='center' style='width:300px;'>表达式</td></tr></table>"
			+ "<table id='expressId' style=\"border-collapse:separate; border-spacing:2px 10px;\">"
	if (value == "") {
		html = html
				+ "<tr><td style='width:50px;'>1</td><td style='width:150px;'><input class=\"easyui-validatebox form-control\" id='exp0'  name=\"expName\"  style=\"width:150px;height:24px;\"></td><td style='width:300px;'><input class=\"easyui-validatebox form-control\" type='text' style='width:300px;height:24px;border-radius:2px;' id='expVal0' name='expValue'></td>"
				+ "<td style='width:100px;' align=\"center\" ><a  class=\"l-btn l-btn-small l-btn-plain\" onclick='removeLine1(this)' href='javascript:void(0)'><span class='l-btn-left l-btn-icon-left'><span class='l-btn-text'>移除</span><span class='l-btn-icon icon-remove'></span></span></a></td>"
				+ "</tr>"
		html = html + "</table>";
		$("#openEditor").empty();
		$("#openEditor").append(html);
		$("input[name='expName']").each(function(){
			$(this).combobox({
					valueField : 'dictdataValue',
					textField : 'dictdataName',
					url : "sysDictionaryData/getValues2.action?dictValue=DATA_ANALYS_EXPRESS",
					onChange : function(newValue,
							oldValue) {
						$(this)
								.parent()
								.next()
								.find(
										"input[name='expValue']")
								.empty();
						$(this)
								.parent()
								.next()
								.find(
										"input[name='expValue']")
								.val(newValue);
					},
					onLoadSuccess : null
				});
			});
	} else {
		var config = JSON.parse(value.replace(/'/g, "\""));
		var jsonArr = config.method;
		for (var int = 0; int < jsonArr.length; int++) {
			html = html
					+ "<tr><td style='width:50px;'>"
					+ (int + 1)
					+ "</td><td style='width:150px;'>"
					+ "<input  style=\"width:150px;height:24px;\" class=\"easyui-validatebox form-control\"  "
					+ " value='"
					+ jsonArr[int].name
					+ "' id='exp"
					+ int
					+ "' name='expName'></td><td style='width:300px;'><input  class=\"easyui-validatebox form-control\" style='width:300px;height:24px;border-radius:2px;' type='text' value='"
					+ jsonArr[int].value
					+ "' id='expVal"
					+ int
					+ "' name='expValue'></td><td style='width:100px;' align=\"center\" ><a  class=\"l-btn l-btn-small l-btn-plain\" onclick='removeLine1(this)' href='javascript:void(0)'><span class='l-btn-left l-btn-icon-left'><span class='l-btn-text'>移除</span><span class='l-btn-icon icon-remove'></span></span></a></td></tr>";
		}

		html = html + "</table>";
		$("#openEditor").empty();
		$("#openEditor").append(html);
		for (var int = 0; int < jsonArr.length; int++) {
			$("#exp" + int).combobox({
					valueField : 'dictdataValue',
					textField : 'dictdataName',
					url : "sysDictionaryData/getValues2.action?dictValue=DATA_ANALYS_EXPRESS",
					onSelect : function(newValue, oldValue) {
						$(this).parent().next().find(
								"input[name='expValue']").val(
								newValue.dictdataValue);

					},
					onLoadSuccess : null
				});
		}
	}

	$("#openEditor").dialog({
				title : "表达式匹配",
				width : 600,
				height : 400,
				closed : false,
				cache : false,
				href : '',
				center : true,
				modal : true,
				toolbar : [{
					text : '保存',
					iconCls : 'icon-save',
					handler : function() {
						var objArr = new Array();
						$("input[name='expName']").each(
								function(i, value) {
									var map = new Object();
									map.name = $(
											"#exp" + i)
											.combobox(
													'getText');
									map.value = $(
											"#expVal"
													+ i)
											.val();
									objArr[i] = map;

								})

						var config = {
							method : objArr
						}
						$($(ts).next()).val(JSON.stringify(config).replace(/"/gm, "'"));
						$("#openEditor").dialog('close');
					}
				},
				{
					text : '增加表达式',
					iconCls : 'icon-add',
					handler : function() {
						var len = $("#expressId").find("tr").length;
						$("#expressId").append(
								"<tr><td style='width:50px;'>"
										+ Number(len + 1)
										+ "</td><td style='width:150px;'><input style=\"width:150px;height:24px;\" class=\"easyui-validatebox form-control\" type='text' id='exp"
										+ (Number(len))
										+ "' name='expName'></td><td style='width:300px;'><input  class=\"easyui-validatebox form-control\" style=\"width:300px;height:24px;border-radius:2px;\" type='text' id='expVal"
										+ (Number(len))
										+ "' name='expValue'></td><td style='width:100px;' align=\"center\" ><a  class=\"l-btn l-btn-small l-btn-plain\" onclick='removeLine1(this)' href='javascript:void(0)'><span class='l-btn-left l-btn-icon-left'><span class='l-btn-text'>移除</span><span class='l-btn-icon icon-remove'></span></span></a></td></tr>");

						$("input[name='expName']").each(function(i, value) {
									$(this).combobox({
											valueField : 'dictdataValue',
											textField : 'dictdataName',
											url : "sysDictionaryData/getValues2.action?dictValue=DATA_ANALYS_EXPRESS",
											onSelect : function(
													newValue,
													oldValue) {
												$(
														value)
														.parent()
														.next()
														.find(
																"input[name='expValue']")
														.val(
																newValue.dictdataValue)

											},
											onLoadSuccess : null
										});
						});
					}
				} ],
	});
}
// 处理参照完整性检查
function dealRefer(ts, type, value) {
	var rvalue = value;
	var matchHtml = "<form id='dataSForm'>"
			+ "<table style='border-collapse:separate;border-spacing:10px;' id='expressTableId'> "
			+ "<tr><td class='Newly_build' style='width:150px;'>数据连接:&nbsp;&nbsp;&nbsp;</td><td><select   style='width:350px;height:25px;' class='select-combobox' name='dataSName' id='dataSName'></select></td></tr>"
			+ "<tr><td class='Newly_build' style='width:150px;'>模式名称:&nbsp;&nbsp;&nbsp;</td><td><select  style='width:350px;height:25px;' class='select-combobox' name='scheName' id='scheName'></select></td></tr>"
			+ "<tr><td class='Newly_build' style='width:150px;'>表名称:&nbsp;&nbsp;&nbsp;</td><td><select  style='width:350px;height:25px;' class='select-combobox' name='tableName' id='tableName'></select></td></tr>"
			+ "<tr><td class='Newly_build' style='width:150px;'>列名称:&nbsp;&nbsp;&nbsp;</td><td><select  style='width:350px;height:25px;' name='colName' class='select-combobox' id='colName' ></select></td></tr>"
			+ "<tr><td class='Newly_build' style='width:150px;'>查询语句:&nbsp;&nbsp;&nbsp;</td><td> <textarea name=\"tasksql\" id=\"tasksql\" style=\"border-radius:2px;\" class=\"form-control\" rows=\"3\" ></textarea></td></tr>"
			+ "<tr><td class='Newly_build' style='width:150px;'>是否忽略null值:&nbsp;&nbsp;&nbsp;</td><td><input name='checkName'  type='checkbox'></td></tr>"
			+ "<tr><td class='Newly_build' style='width:150px;'>采用SQL算法:&nbsp;&nbsp;&nbsp;</td><td><input name='checkSqlName'  type='checkbox'></td></tr>";
	matchHtml = matchHtml + "</table></form>";
	$("#openEditor").empty();
	$("#openEditor").append(matchHtml);
	if (rvalue != "") {
		var arr = rvalue.split('あ');
		var arr0 = arr[0]
		if (arr[4] == '1') {
			$("[name='checkName']").attr("checked", 'true');
		} else {
			$("[name='checkName']").removeAttr("checked");
		}
		if (arr[6] == '1') {
			$("[name='checkSqlName']").attr("checked", 'true');
		} else {
			$("[name='checkSqlName']").removeAttr("checked");
		}
		$("#tasksql").val(arr[5]);
		$('#dataSName').combobox({
				url : 'tbMdTable/listConnnectJdbc.action?flag=1',
				valueField : 'connectionId',
				textField : 'connectionName',
				onLoadSuccess : function() {
					$('#dataSName').combobox('setValue', arr0);
					$('#scheName').combobox({
							url : 'd_quality/getSches.action?conId='+ arr0,
							valueField : 'schemName',
							textField : 'schemName',
							onLoadSuccess : function() {
								$('#scheName').combobox('setValue',arr[1]);
								$('#tableName').combobox({
										url : 'd_quality/getScheTableList.action?id='
												+ arr0
												+ "&schem="
												+ arr[1],
										valueField : 'tableName',
										textField : 'tableName',
										onLoadSuccess : function() {
											$('#tableName').combobox('setValue',arr[2]);
											$('#colName').combobox({
													url : 'd_quality/getCols.action?conId='
															+ arr0
															+ "&tbName="
															+ arr[2],
													valueField : 'columnName',
													textField : 'columnName',
													onLoadSuccess : function() {
														$('#colName').combobox('setValue',arr[3]);
													}
											})

										}
								})

							}
						})
				},
				onSelect : function(rec) {
					arr0 = rec.connectionId;
					$('#scheName').combobox({
							url : 'd_quality/getSches.action?conId='
									+ arr0,
							valueField : 'schemName',
							textField : 'schemName',
							onSelect : function(rec) {
								$('#tableName').combobox({
										url : 'd_quality/getScheTableList.action?id='
												+ arr0
												+ "&schem="
												+ rec.schemName,
										valueField : 'tableName',
										textField : 'tableName',
										onSelect : function(rec) {
											$('#colName').combobox({
												url : 'd_quality/getCols.action?conId='
														+ arr0
														+ "&tbName="
														+ rec.tableName,
												valueField : 'columnName',
												textField : 'columnName',

											})
										}
								})
							}
					})
				}

			})

	} else {
		var arr0 = "";
		$('#dataSName').combobox({
				url : 'tbMdTable/listConnnectJdbc.action?flag=1',
				valueField : 'connectionId',
				textField : 'connectionName',
				onSelect : function(rec) {
					arr0 = rec.connectionId;
					$('#scheName').combobox({
							url : 'd_quality/getSches.action?conId='
									+ arr0,
							valueField : 'schemName',
							textField : 'schemName',
							onSelect : function(rec) {
								$('#tableName').combobox({
										url : 'd_quality/getScheTableList.action?id='
												+ arr0
												+ "&schem="
												+ rec.schemName,
										valueField : 'tableName',
										textField : 'tableName',
										onSelect : function(rec) {
											$('#colName').combobox({
													url : 'd_quality/getCols.action?conId='
															+ arr0
															+ "&tbName="
															+ rec.tableName,
													valueField : 'columnName',
													textField : 'columnName',

													})
												}
										})
									}
							})
						}
					})
	}

	$("#openEditor").dialog({
			title : "参照完整性检查",
			width : 600,
			height : 400,
			closed : false,
			cache : false,
			href : '',
			center : true,
			modal : true,
			toolbar : [ {
				text : '保存',
				iconCls : 'icon-save',
				handler : function() {
					var dataS = $("#dataSName").combobox('getValue');
					var schem = $("#scheName").combobox('getValue');
					var tableName = $("#tableName").combobox('getValue');
					var colName = $("#colName").combobox('getValue');
					var tasksql = $("#tasksql").val();
					var checkName = "";
					var checkSqlName = "";
					$('input[name="checkName"]').each(function(i, dom) {
						if ($(this).is(':checked')) {
							checkName = "1";
						} else {
							checkName = "0";
						}
					});

					$('input[name="checkSqlName"]').each(function(i, dom) {
						if ($(this).is(':checked')) {
							checkSqlName = "1";
						} else {
							checkSqlName = "0";
						}
					});

					$($(ts).next()).val(
							dataS + "あ" + schem + "あ" + tableName + "あ"
									+ colName + "あ" + checkName + "あ"
									+ tasksql + "あ" + checkSqlName);
					$("#openEditor").dialog('close');
				}
			} ]
		});
	}
// 处理值分布分析
function dealDistribute(ts, type, value) {
	var select = "";
	if (value == "") {
		select = "<table class='yahei' border='1' cellspacing='0'>"
//				+ "<tr><td width='20px' align='center'>1</td><td><input  checked=\"true\"  type=\"checkbox\" id='valName0' name=\"valName\"  /><font size='2'>&nbsp;所有行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>2</td><td><input  checked=\"true\" type=\"checkbox\" id='valName1' name=\"valName\"  /><font size='2'>&nbsp;空值行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>3</td><td><input  checked=\"true\" type=\"checkbox\" id='valName2' name=\"valName\"  /><font size='2'>&nbsp;唯一值行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>4</td><td><input  checked=\"true\" type=\"checkbox\" id='valName3' name=\"valName\" /><font size='2'>&nbsp;重复值行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>1</td><td><input  checked=\"true\"  type=\"checkbox\" id='valName0' name=\"valName\" disabled=true /><font size='2'>&nbsp;大小写敏感</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td><input  checked=\"true\" type=\"checkbox\" id='valName1' name=\"valName\" disabled=true /><font size='2'>&nbsp;空格敏感</font>&nbsp;</td></tr>"
			+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);

	} else {
		select = "<table class='yahei' border='1' cellspacing='0'>"
//				+ "<tr><td width='20px' align='center'>1</td><td><input    type=\"checkbox\" id='valName0' name=\"valName\"  /><font size='2'>&nbsp;所有行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>2</td><td><input   type=\"checkbox\" id='valName1' name=\"valName\"  /><font size='2'>&nbsp;空值行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>3</td><td><input   type=\"checkbox\" id='valName2' name=\"valName\"  /><font size='2'>&nbsp;唯一值行数</font>&nbsp;</td></tr>"
//				+ "<tr><td width='20px' align='center'>4</td><td><input   type=\"checkbox\" id='valName3' name=\"valName\" /><font size='2'>&nbsp;重复值行数</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>1</td><td><input    type=\"checkbox\" id='valName0' name=\"valName\" disabled=true /><font size='2'>&nbsp;大小写敏感</font>&nbsp;</td></tr>"
				+ "<tr><td width='20px' align='center'>2</td><td><input   type=\"checkbox\" id='valName1' name=\"valName\" disabled=true /><font size='2'>&nbsp;空格敏感</font>&nbsp;</td></tr>"
			+ "</table>";
		var content = "<div>" + select + "</div>";
		var html = content;
		$("#openEditor").empty();
		$("#openEditor").append(html);
		var getValue = value.split(",");
		for (var int = 0; int < getValue.length; int++) {
			if (getValue[int] == "1") {
				$("#valName" + int).attr("checked", 'true');
			}
		}
	}

	$("#openEditor").dialog({
		title : "值分布分析",
		width : 600,
		height : 400,
		closed : false,
		cache : false,
		href : '',
		center : true,
		modal : true,
		toolbar : [ {
			text : '保存',
			iconCls : 'icon-save',
			handler : function() {
				var arr = document.getElementsByName('valName');
				var ifExcute = "";
				for (var int = 0; int < arr.length; int++) {
					if (int == 0) {
						if (arr[int].checked) {
							ifExcute = "1";
						} else {
							ifExcute = "0";
						}
					} else {
						if (arr[int].checked) {
							ifExcute = ifExcute + "," + "1";
						} else {
							ifExcute = ifExcute + "," + "0";
						}
					}

				}
				$($(ts).next()).val(ifExcute);
				$("#openEditor").dialog('close');
			}
		} ],
	});

}
/**
 * 当点击规则编辑按钮时，选择执行哪个js方法
 * @param ts
 */
function configAnaly(ts) {
	var type = $($(ts).parent().prev().prev().find("select")).val();
	var value = $($(ts).next()).val();
	switch (type) {
	case "0"://数字型分析
		dealNumber(ts, type, value);
		break;
	case "1"://值匹配检查
		dealMatcher(ts, type, value);
		break;
	case "2"://字符值分析
		dealCharactor(ts, type, value);
		break;
	case "3"://日期值分析
		dealDate(ts, type, value);
		break;
	case "4"://布尔值分析
		dealBoolean(ts, type, value);
		break;
	case "5"://重复值检查
		dealRepeat(ts, type, value);
		break;
	case "6"://表达式匹配
		dealExpre(ts, type, value);
		break;
	case "7"://参照完整性检查
		dealRefer(ts, type, value);
		break;
	case "8"://值分布分析
		dealDistribute(ts, type, value);
		break;
	default:
		break;
	}
}
//添加所有的字段的时候，增加行剖析规则
function addAll() {
	var dbconnect = $("#dbConnection13").combobox("getValue");
	initRows = document.getElementById("btn-tb2").rows.length;
	if ($("#colDetailInfo").val() == "") {
		 $.messager.progress({
				title : '请等待',
				msg : '正在加载中...'
			});
		$.ajax({
			type : "POST",
			url : "task/getColInfo.action",
			dataType : 'json',
			data : {
				dbconnect : dbconnect,
				sql : $("#dqSql").val()
			},
			success : function(msg) {
				$.messager.progress('close');
				$("#colDetailInfo").val(JSON.stringify(msg).replace(/"/gm, "'"));
				var rows = initRows
				for (var int = 0; int < msg.length; int++) {
					addOne((int + rows-1), msg[int], "1");
//					addSuccessOne((int + rows-1), successInfoArr[successInfoArr.length-1], "");
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				$.messager.progress('close');
				Peony.alert('提示',JSON.parse(jqXHR.responseText).msg,'error');
			}
		})
	} else {
		var msg = JSON.parse($("#colDetailInfo").val().replace(/'/g, "\""));
		var rows = initRows;
		for (var int = 0; int < msg.length; int++) {
			addOne((int + rows-1), msg[int], "1");
//			addSuccessOne((int + rows-1), successInfoArr[successInfoArr.length-1], "");
		}
	}
}
/**
 * 当改变剖析字段列的时候改变相应的剖析类型
 * @param ts
 * @param i
 */
function changeColType(ts, i) {
	var type = $(ts).find("option:selected").attr("title");
//	console.log($(ts).find("option:selected"));
	$($(ts).parent().next().find("input")).val(type);
	changeMethod(type, "analyType" + i);
//	var typeName=$("#analyType" + i).find("option:selected").text();//选中的文本
//	var analyTypeStr=$("#analyType" + i).val();//选中的值
	var typeName=$("#analyType" + i).val();
	//修改之前的下拉框信息
	var beforeInfo=successInfoArr[i];
//	console.log(beforeInfo);
	var nameStr=(i+1)+":"+$(ts).find("option:selected").attr("value");
	successInfoArr[i]=nameStr+";"+typeName;
//	console.log(successInfoArr);
	//修改对应的成功条件信息-删除该行之前的信息，再新增该条信息
	//获取该行的某列信息
//	console.log($("select[name='ruleName']"));
	//级联成功条件信息
	var trSum=(($("#btn-tb3").find("tr")).length)-1;
	if(trSum > 0){//不是第一行数据
		for(var j=0;j<trSum;j++){
			if(j == i){
				//规则
				$("#ruleName"+j).append("<option title='"+nameStr+"' value='"+nameStr+"'>"+nameStr+"</option>");  
				$("#ruleName"+j+" option[value='"+beforeInfo.split(";")[0]+"']").remove();  
				$("#ruleName"+j).val(nameStr); 
				//类型
//				$("#ruleType"+j).append("<option title='"+typeName+"' value='"+analyTypeStr+"'>"+typeName+"</option>");  
//				$("#ruleType"+j+" option[value='"+beforeInfo.split(";")[1].split(":")[1]+"']").remove();  
//				$("#ruleType"+j).val(analyTypeStr);
			}else{
				//规则
				$("#ruleName"+j).append("<option title='"+nameStr+"' value='"+nameStr+"'>"+nameStr+"</option>");  
				$("#ruleName"+j+" option[value='"+beforeInfo.split(";")[0]+"']").remove();  
				//类型
//				$("#ruleType"+j).append("<option title='"+typeName+"' value='"+analyTypeStr+"'>"+typeName+"</option>");  
//				$("#ruleType"+j+" option[value='"+beforeInfo.split(";")[1].split(":")[1]+"']").remove();  
			}
		}
	}
}
/**
 * 生成SQL语句
 */
function gerSql() {
	var tabName = $("#tableId").combobox("getValue");
//	var sql = $("#transScriptDQ").val();
	var sql = transScriptDQEditor.getValue();
	if (tabName != "" && sql == "") {
		$("#dqSql").val("select * from " + tabName);
	} else {
		$("#dqSql").val(sql);
	}
	//清除对应字段隐参信息
//	$("#colDetailInfo").val('');	
}
/**
 * 删除所有的行
 */
function delAllLine1() {
	var table = $("#btn-tb2"); // 待操作表单
	var tab = document.getElementById("btn-tb2");
	var rows = tab.rows.length;
	if (rows > 1) {// 表头信息
		delAllLine(true);
		//清空【成功条件】信息
		emptySuccessTable();
		//清空数组信息
		successInfoArr=[];
	} else {
		$.messager.alert('提示', "无待删除信息！", 'info');
	}
}

//删除一行信息，级联【成功条件】
function removeOneLine(ts,i) {
//	console.log($(ts).parent().parent().find('input').eq(0).val());
	var rowIndx=$(ts).parent().parent().find('input').eq(0).val();//当前实际行数，用于数组下标取值
	rowIndx=parseInt(rowIndx)-1;
	$.messager.confirm('确认', '您确定要删除记录？', function(r) {
		if (r) {
			//级联【成功条件】信息，包括对应行数据和其他行下拉框数据
//			var checkIndex = $('#colName'+i).get(0).selectedIndex; //索引值
			var ruleName=(i+1)+":"+$('#colName'+i).val();
			var ruleType=$('#analyType'+i).val();
			var len=successInfoArr.length;
			var temporaryArr=successInfoArr;//暂时存储之前的数组
			var delInfo=temporaryArr[rowIndx].split(";")[0];//要删除的下拉框信息
			if(len > rowIndx){//不是最后一行数据
				successInfoArr.splice(rowIndx,1);//删除该元素
				for(var k=rowIndx;k<(len-1);k++){
					successInfoArr[k]=(k+1)+":"+successInfoArr[k].split(";")[0].split(":")[1]+";"+successInfoArr[k].split(";")[1];
				}
			}else{
				successInfoArr.pop();//删除最后一个数据
			}
//			//删除其他行对应的下拉框数据
//			$('#btn-tb3 tr:eq('+(i+1)+')').remove();//第一行是表头
			//清空表信息重新添加
//			emptySuccessTable();
			//获取成功条件信息
			$("select[name='ruleName']").each(function(j, value) {
					var rId=value.id;
					var brforeStr=$("#" + rId).val(); 
					console.log(rId);
					console.log(brforeStr);
					$("#" + rId).empty();
					var info= "";
					for(var index = 0;index < successInfoArr.length;index++){
						var name=successInfoArr[index].split(";")[0];
						info = info + "<option title='" + name
						+ "' value ='" + name + "'>"
						+ name + "</option>";
					}
					$("#" + rId).append(info);
					if(j >= i){//删除行
						$("#" + rId).val('');
						$("#" + rId).val('');
					}else{
						$("#" + rId).val(brforeStr);
					}
			});
			//删除该行数据
			$(ts).parent().parent().remove();
			$("#btn-tb2").find("tr").each(function(i, value) {
				$(this).find("td").each(function(i1, value1) {
					if (i1 == 0) {
						$(this).find("input").each(function(i2, value2) {
							if (i2 == 0) {
								$(this).val(i);
							}
						})
					}
				})
			});
		}
	});

}
/**
 * 增加一行或者多行的时候执行这个方法
 * @param i
 * @param data
 * @param pos 0-新增一条，1-新增全部，2-编辑
 */
function addOne(i, data, pos) {
	var table = $("#btn-tb2");
	var tab = document.getElementById("btn-tb2");
	var rows = tab.rows.length;
	var html = "<tr class='tb-line'>";
	html += "	<td style='width:40px;'><input name=\"no\" class=\"easyui-validatebox text-name\" style=\"width:100%;border-style: none; text-align: center;\" value=\""
			+ rows + "\" data-options=\"editable :false\"></td>";
	html += "	<td width=\"260px;\">" + "<select onChange='changeColType(this,"
			+ i + ")' name='colName'    id=\"colName" + i
			+ "\" class=\"form-control\" style=\"width:95%;\">" + "</td>";
	html += "	<td style='width:120px;'>"
			+ "<input   id=\"colType"
			+ i
			+ "\" class=\"form-control\" name='colType' readonly='readonly'  data-options=\"\" style=\"width:95%;\">"
			+ "</td>";
	html += "	<td style='width:150px;'>"
			+ "<select onchange='clearValue(this,"+i+")'  name=\"analyType\"  id=\"analyType"
			+ i
			+ "\" class=\"form-control\" data-options=\"\" style=\"width:95%;\">"
			+ "<option value=\"0\">数字型分析</option>"
			+ "<option value=\"1\">值匹配检查</option>"
			+ "<option value=\"2\">字符值分析</option>"
			+ "<option value=\"3\">日期值分析</option>"
			+ "<option value=\"4\">布尔值分析</option>"
			+ "<option value=\"5\">重复值检查</option>"
			+ "<option value=\"6\">表达式匹配</option>"
			+ "<option value=\"7\">参照完整性</option>"
			+ "<option value=\"8\">值分布分析</option>" + "</select>" + "</td>";
	html += "	<td style='width:60px;'>"
			+ "<select name=\"ifValied\"  id=\"ifValied"
			+ i
			+ "\" class=\"form-control\" data-options=\"\" style=\"width:95%;\">"
			+ "<option value=\"1\">是</option>"
			+ "<option value=\"0\">否</option>" + "</select>" + "</td>";
	html += "	<td style='width:70px;' align=\"center\" ><a onclick='configAnaly(this)'  class=\"easyui-linkbutton \"  iconCls=\"icon-edit\" plain=\"true\"></a><input name='config' type='hidden'><a  class=\"easyui-linkbutton\" onclick='removeOneLine(this,"+i+")'  iconCls=\"icon-remove\" plain=\"true\"></a></td>";
	html += "</tr>";
	var line = $(html);
	$.parser.parse(line);// 解析esayui标签
	table.append(line);
	var dbconnect = $("#dbConnection13").combobox("getValue");
	var cname = "";
	var ctype = "";
	var ops = "";
	var msg = "";
	if ($("#colDetailInfo").val() != "") {
		msg = JSON.parse($("#colDetailInfo").val().replace(/'/g, "\""));
	}
//	console.log(msg);
	if (pos == "0") {
		// 增加一条数据时
		for (var int = 0; int < msg.length; int++) {
			ops = ops + "<option title='" + msg[int].dataTypeName
					+ "' value ='" + msg[int].columnName + "'>"
					+ msg[int].columnName + "</option>"
		}
		$("#colName" + i).append(ops);
		if (msg[0]) {
			$("#colName" + i).val(msg[0].columnName);
			$("#colType" + i).val(msg[0].dataTypeName);
		}
		var tp = $("#colType" + i).val();
		changeMethod(tp, "analyType" + i);
		//新增成功条件信息
		var rname=rows+":"+($("#colName" + i).val());
//		successInfoArr.push(rname+";"+($("#analyType" + i).val()));
		successInfoArr.push(rname);
//		console.log(successInfoArr);
		//之前成功条件中下拉框数据更新
		var trSum=(($("#btn-tb3").find("tr")).length)-1;
		if(trSum > 0){//不是第一行数据
			for(var j=0;j<trSum;j++){
				$("#ruleName"+j).append("<option title='"+rname+"' value='"+rname+"'>"+rname+"</option>");  
			}
		}
		
	} else if (pos == "1") {
		// 增加全部时
		for (var int = 0; int < msg.length; int++) {
			ops = ops + "<option title='" + msg[int].dataTypeName
					+ "' value ='" + msg[int].columnName + "'>"
					+ msg[int].columnName + "</option>"
		}
		$("#colName" + i).append(ops);
		$("#colName" + i).val(msg[rows - initRows].columnName);
		$("#colType" + i).val(msg[rows - initRows].dataTypeName);
		var tp = $("#colType" + i).val();
		changeMethod(tp, "analyType" + i);
		//成功条件信息
		var rname=rows+":"+($("#colName" + i).val());
//		successInfoArr.push(rname+";"+($("#analyType" + i).val()));
		successInfoArr.push(rname);
		var trSum=(($("#btn-tb3").find("tr")).length)-1;
		if(trSum > 0){//不是第一行数据
			for(var j=0;j<trSum;j++){
				$("#ruleName"+j).append("<option title='"+rname+"' value='"+rname+"'>"+rname+"</option>");  
			}
		}
	} else {
		// 编辑一条数据时
		// 如果列信息为空，则请求数据库
		if ($("#colDetailInfo").val() == "") {
			$.ajax({
				type : "POST",
				url : "task/getColInfo.action",
				dataType : 'json',
				data : {
					dbconnect : $("#dbConnectionDq").val(),
					sql : $("#dqSql").val()
				},
				success : function(msgData) {
					$("#colDetailInfo").val(
							JSON.stringify(msgData).replace(/"/gm, "'"));
					for (var int = 0; int < msgData.length; int++) {
						ops = ops + "<option title='"
								+ msgData[int].dataTypeName + "' value ='"
								+ msgData[int].columnName + "'>"
								+ msgData[int].columnName + "</option>"
					}
					$("#colName" + i).append(ops);
					$("#colName" + i).val(data.colName);
					$("#colType" + i).val(data.colType);
					var tp = $("#colType" + i).val();
					changeMethod(tp, "analyType" + i);
					$("#analyType" + i).val(data.analyType);
					$("#ifValied" + i).val(data.ifValied);
					$(line).find("input[name='config']").val(data.config);
					//successInfoArr值可能修改过顺序，需要判断对应序列号进行添加
					var typeName=$("#analyType" + i).find("option:selected").text();
					for(var k=0;k<successInfoArr.length;k++){
						if(successInfoArr[k].split(";")[0].split(":")[0] == (i+1)){
							successInfoArr[k]=successInfoArr[k]+";"+typeName;
							break;
						}
					}
				},
				error : function(jqXHR, textStatus, errorThrown) {
					$.messager.alert('提示', '无法找到该表的字段信息！');
				}
			})
		} else {
			for (var int = 0; int < msg.length; int++) {
				ops = ops + "<option title='" + msg[int].dataTypeName
						+ "' value ='" + msg[int].columnName + "'>"
						+ msg[int].columnName + "</option>"
			}
			$("#colName" + i).append(ops);
			$("#colName" + i).val(data.colName);
			$("#colType" + i).val(data.colType);
			var tp = $("#colType" + i).val();
			changeMethod(tp, "analyType" + i);
			$("#analyType" + i).val(data.analyType);
			$("#ifValied" + i).val(data.ifValied);
			$(line).find("input[name='config']").val(data.config);
		}
	}
	//执行先后顺序问题
	if(!(pos == "2" && $("#colDetailInfo").val() == "")){
		//添加规则类型名称
		var typeName=$("#analyType" + i).find("option:selected").text();
		//successInfoArr值可能修改过顺序，需要判断对应序列号进行添加
		for(var k=0;k<successInfoArr.length;k++){
			if(successInfoArr[k].split(";")[0].split(":")[0] == (i+1)){
				successInfoArr[k]=successInfoArr[k]+";"+typeName;
				break;
			}
		}
	}
}
/**
 * 根据字段类型选择下来要显示的剖析类型
 * @param type
 * @param mid
 */
function changeMethod(type, mid) {
	$("#" + mid).empty();
	var html = "";
	if (type == "STRING") {
		html = "<option value=\"1\">值匹配检查</option>"
				+ "<option selected=\"selected\" value=\"2\">字符值分析</option>"
				+ "<option value=\"4\">布尔值分析</option>"
				+ "<option value=\"5\">重复值检查</option>"
				+ "<option value=\"6\">表达式匹配</option>"
				+ "<option value=\"7\">参照完整性</option>"
				+ "<option value=\"8\">值分布分析</option>";

	} else if (type == "NUMBER") {
		html = "<option selected=\"selected\" value=\"0\">数字型分析</option>"
				+ "<option  value=\"1\">值匹配检查</option>"
				+ "<option value=\"4\">布尔值分析</option>"
				+ "<option value=\"5\">重复值检查</option>"
				+ "<option value=\"6\">表达式匹配</option>"
				+ "<option value=\"7\">参照完整性</option>"
				+ "<option value=\"8\">值分布分析</option>";
	} else {
		html = "<option value=\"1\">值匹配检查</option>"
				+ "<option selected=\"selected\" value=\"3\">日期值分析</option>"
				+ "<option value=\"5\">重复值检查</option>"
				+ "<option value=\"6\">表达式匹配</option>"
				+ "<option value=\"7\">参照完整性</option>"
				+ "<option value=\"8\">值分布分析</option>";
	}
	$("#" + mid).append(html);
}
// 增加一条剖析信息
function addOneLine() {
	$.messager.progress({
		title : '请等待',
		msg : '正在加载中...'
	});
	var dbconnect = $("#dbConnection13").combobox("getValue");
	$.ajax({
		type : "POST",
		url : "task/getColInfo.action",
		dataType : 'json',
		data : {
			dbconnect : dbconnect,
			sql : $("#dqSql").val()
		},
		success : function(msg) {
			$.messager.progress('close');
			$("#colDetailInfo").val(JSON.stringify(msg).replace(/"/gm, "'"));
			var tab = document.getElementById("btn-tb2");
			var rows = tab.rows.length;
			addOne(rows-1, "", 0);
//			addSuccessOne(rows-1, successInfoArr[successInfoArr.length-1], "");//暂时不需要该功能
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$.messager.progress('close');
			Peony.alert('提示',JSON.parse(jqXHR.responseText).msg,'error');
		}
	})

}
// 查询预览
function searchPreviw_DQ() {
	$('#t_test_variate_DQ').window('open');
	$('#datanulldivDQ').hide();// 隐藏
	$("#_taskTypeDQ").val("1");
	// $("#_preview, #_execRes").show();
//	var transScript = $('#transScriptDQ').val();
	var transScript = transScriptDQEditor.getValue();
	getVariable_DQ(transScript);
	$("#fordatagridDQ").hide();
}

function getVariable_DQ(transScript) {
	$("#variableInfoDQ").val("");// 清空之前的赋值信息
	$.ajax('task/getVariable.action',{
		type : 'post',
		dataType : 'json',
		data : {
			transScript : transScript
		},
		success : function(data) {
			jsonData = "";
			jsonData = data;
			var table1 = $("#str-listDQ");
			table1.html("");
			$.each(data,function(i, String) {
				var k = i + 1;
				var html = "<tr>";
				html += "	<td align='center'> <label for=\"dataBaseD\" class=\"col-sm-3 control-label\">"
						+ k + "</label></td>";
				html += "	<td align=\"center\" ><label for=\"dataBaseD\" class=\"col-sm-3 control-label\">"
						+ String
						+ "</label></td>";
				html += "	<td><div class=\"col-sm-9\"><input id=\""
						+ String
						+ "\"  name=\""
						+ String
						+ "\" type=\"text\" class=\"easyui-validatebox form-control\"></div></td>";
				html += "	</td>";
				html += "</tr>";
				var line = $(html);
				$.parser.parse(line);// 解析esayui标签
				table.append(line);
				$("#variableInfoDQ").val(String);// 变量测试时用于变量查询结果的列名显示
			});
		}
	});
}
/**
 * 清空数据
 * @param ts
 */
// 当改变剖析方法的时候清空value值
function clearValue(ts,i) {
	//级联【成功条件】规则类型信息
	var typeStr=$(ts).find("option:selected").attr("value");
	var typeName=$(ts).find("option:selected")[0].text;
	//之前的类型信息
//	var beforeType=successInfoArr[i].split(";")[1];
//	successInfoArr[i]=successInfoArr[i].split(";")[0]+";"+typeStr+":"+typeName;
//	//修改信息
//	$("#ruleType"+i).append("<option value='"+typeStr+"'>"+typeName+"</option>");  
//	$("#ruleType"+i+" option[value='"+beforeType.split(":")[0]+"']").remove();  
//	$("#ruleType"+i).val(typeStr);
	successInfoArr[i]=successInfoArr[i].split(";")[0]+";"+typeName;
	//修改信息
	$("#ruleType"+i).val(typeName);
	//原有的清空数据信息
	$(ts).parent().next().next().find("input[name='config']").val("");
}

/**
 * 刷新字段
 */
function refreshCol() {
	$.messager.progress({
		title : '请稍后',
		msg : '正在加载中...',
	});
	gerSql();
	var dbc = $('#dbConnection13').combobox('getValue');
	if (dbc == "") {
		dbc = $("#dbConnectionDq").val();
	}
	$.ajax({
		type : "POST",
		url : "task/getColInfo.action",
		dataType : 'json',
		data : {
			dbconnect : dbc,
			sql : $("#dqSql").val()
		},
		success : function(msgData) {
			$("#colDetailInfo")
					.val(JSON.stringify(msgData).replace(/"/gm, "'"));
			var msg = msgData;
			var ops = "";
			for (var int = 0; int < msg.length; int++) {
				ops = ops + "<option title='" + msg[int].dataTypeName
						+ "' value ='" + msg[int].columnName + "'>"
						+ msg[int].columnName + "</option>"
			}
			$(".tb-line").each(function(i, val) {
				$(this).find("select[name='colName']").each(function(i1, val1) {
					if (i1 == 0) {
						var value = $(this).val();
						$(this).empty();
						$(this).append(ops);
						$(this).val(value);
					}
				})
			});
			$.messager.progress('close');
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$.messager.alert('提示', '无法找到该表的字段信息！');
			$.messager.progress('close');
		}
	})
}

/**-------成功判断条件  start--------------*/

/**
 * 增加一行--成功条件
 * i:行信息
 * data:数组信息
 * pos：类型
 */
function addSuccessOne(i, data, pos) {
	var table = $("#btn-tb3");
	var tab = document.getElementById("btn-tb3");
	var rows = tab.rows.length;
	var html = "<tr class='tb-line3'>";
	html += "	<td style='width:30px;'><input name=\"no\" class=\"easyui-validatebox text-name\" style=\"width:100%;border-style: none; text-align: center;\" value=\""
			+ rows + "\" data-options=\"editable :false\"></td>";
	//剖析规则
	html += "	<td width=\"250px;\">" + "<select onChange='changeType(this,"
			+ i + ")' name='ruleName'    id=\"ruleName" + i
			+ "\" class=\"form-control\" style=\"width:95%;\">" + "</td>";
	//剖析类型
//	html += "	<td width=\"150px;\">" + "<select name='ruleType'  id=\"ruleType" + i
//			+ "\" class=\"form-control\"  disabled=\"disabled\"  style=\"width:95%;\">" + "</td>";
	html += "	<td style='width:140px;'> <input   id=\"ruleType"
			+ i
			+ "\" class=\"form-control\" name='ruleType' disabled=\"disabled\"  data-options=\"\" style=\"width:95%;\">"
			+ "</td>";
	//结果数值
	html += "	<td style='width:140px;'>"
			+ "<select  name=\"variable\"  id=\"variable"
			+ i
			+ "\" class=\"form-control\" data-options=\"\" style=\"width:95%;\">"
			+ "<option value=\"0\">所有行数</option>"
			+ "<option value=\"1\">空值行数</option>"
			+ "<option value=\"2\">匹配行数</option>"
			+ "<option value=\"3\">未匹配行数</option>"
			+ "<option value=\"4\">重复值数</option>"
			+ "<option value=\"5\">唯一值数</option>"
			+ "</select>" + "</td>";
	//操作符
	html += "  <td style='width:110px;'>"
		    +"<select name=\"operator\"  id=\"operator"
		    + i
		    + "\" class=\"form-control\" style=\"width: 95%;\">"
	        + "<option value=\"1\">等于</option>"
	        + "<option value=\"2\">不等于</option>"
	        + "<option value=\"3\">为空</option>"
	        + "<option value=\"4\">不为空</option>"
			+ "<option value=\"5\">包含</option>"
			+ "<option value=\"6\">不包含</option>"
			+ "<option value=\"7\">开始是</option>"
			+ "<option value=\"8\">开始不是</option>"
			+ "<option value=\"9\">结尾是</option>"
			+ "<option value=\"10\">结尾不是</option>"
			+ "<option value=\"11\">在列表中</option>"
			+ "<option value=\"12\">不在列表中</option>"
			+ "<option value=\"13\">大于</option>"
			+ "<option value=\"14\">大于等于</option>"
			+ "<option value=\"15\">小于</option>"
			+ "<option value=\"16\">小于等于</option>"
			+ "</select>  </td>";
	//值
	html += "  <td style='width:90px;'><input type=\"text\" class=\"form-control\" id=\"value" 
				+ i + "\" name=\"value\" style=\"width: 95%;\"></td>";
	//关系
	html += "  <td style='width:80px;'>" 
			+"<select name=\"relation\"  id=\"relation"
		    + i
		    + "\" class=\"form-control\" style=\"width: 95%;\">"
			+ "<option value=\"1\">AND</option>"
			+ "<option value=\"2\">OR</option>"
			+ "</select>  </td>";
	//操作
	html += "	<td style='width:30px;' align=\"center\" ><a  class=\"easyui-linkbutton\" onclick='removeSuccessOneLine(this)'  iconCls=\"icon-remove\" plain=\"true\"></a></td>";
	html += "</tr>";
	var line = $(html);
	$.parser.parse(line);// 解析esayui标签
	table.append(line);
	var ops = "";//规则
	var opsType="";//类型
	var msg = "";
	for (var k = 0; k < successInfoArr.length; k++) {
		var str=successInfoArr[k];
		var ruleStr=successInfoArr[k].split(";")[0];
//		var typeStr=successInfoArr[k].split(";")[1];
		ops = ops + "<option title='" + ruleStr
		+ "' value ='" + ruleStr + "'>"
		+ ruleStr + "</option>";
		//类型
//		opsType= opsType + "<option title='" + typeStr.split(":")[0]
//		+ "' value ='" + typeStr.split(":")[0] + "'>"
//		+ typeStr.split(":")[1] + "</option>";
	}
	$("#ruleName" + i).append(ops);
	$("#ruleName" + i).val(data.split(";")[0]);
//	$("#ruleType" + i).append(opsType);
//	$("#ruleType" + i).val(data.split(";")[1].split(":")[0]);
	$("#ruleType" + i).val(data.split(";")[1]);
	if(pos == '2'){//编辑
		var sParam=$('#successParam').val();
		if(sParam != null && sParam != ''){
			sParam=JSON.parse(sParam);
			$('#variable'+i).val(sParam[i].variable);
			$('#operator'+i).val(sParam[i].operator);
			$('#value'+i).val(sParam[i].value);
			$('#relation'+i).val(sParam[i].relation);
		}
		
	}
}

//规则和类型级联事件
function changeType(ts,i){
	var ruleName=$("#ruleName" + i).val();
	if(ruleName == '' || ruleName == null){
		$("#ruleType" + i).val('');
	}else{
		var index=ruleName.split(":")[0];
		//对应的数组信息
		var info=successInfoArr[index-1];
//	$("#ruleType" + i).val(info.split(";")[1].split(":")[0]);
		if($("#ruleName" + i).val() == ''){
			$("#ruleType" + i).val('');
		}else{
			$("#ruleType" + i).val(info.split(";")[1]);
		}
	}
}

//清空table信息
function emptySuccessTable(){
	$("#btn-tb3 tbody").html("");
}

//新增一行数据方法
function addLineSuccess(){
	//除去表头之后行数信息
	var initRows = document.getElementById("btn-tb3").rows.length-1;
	//目前最后一行的id数值，用行数是不准确的，防止先删除后再新增的情况发生
	var arr=$("select[name='ruleName']");
	if(arr != null && arr.length >0){
		var forId=$("select[name='ruleName']")[arr.length-1].id;
		forId=forId.substr(forId.length-1,1);
		initRows=parseInt(forId)+1;
	}
	if(successInfoArr != null && successInfoArr.length > 0){
		if(successInfoArr.length > initRows){
			addSuccessOne(initRows, successInfoArr[initRows], "");
		}else{
			addSuccessOne(initRows, successInfoArr[0], "");
		}
	}else{
		$.messager.alert('提示', '请先设置剖析规则信息！','warning');
	}
}
//删除全部
function delAllLineSuccess(){
	var table = $("#btn-tb3"); // 待操作表单
	var tab = document.getElementById("btn-tb3");
	var rows = tab.rows.length;
	if (rows > 1) {// 表头信息
		$(".tb-line3").each(function(i, line) {
			delLine($(line));
		});
	} else {
		$.messager.alert('提示', "无待删除信息！", 'info');
	}
}

//删除一行
function removeSuccessOneLine(ts){
	$.messager.confirm('确认', '您确定要删除记录？', function(r) {
		if (r) {
			$(ts).parent().parent().remove();
			$("#btn-tb3").find("tr").each(function(i, value) {
				$(this).find("td").each(function(i1, value1) {
					if (i1 == 0) {
						$(this).find("input").each(function(i2, value2) {
							if (i2 == 0) {
								$(this).val(i);
							}
						})
					}
				})
			})
		}
	});
}

/**-------成功判断条件  end--------------*/