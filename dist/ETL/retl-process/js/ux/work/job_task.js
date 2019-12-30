//------------------------节点取消操作 start---------------
//数据抽取
function resetE() {
	$('#nodeformbox1').window('close');
}
// 执行SQL
function resetSQL() {
	$('#nodeformbox2').window('close');
}
// 变量设置
function resetV() {
	$('#nodeformbox3').window('close');
}
// 作业流程
function resetJob() {
	$('#nodeformbox4').window('close');
}
// 存储过程
function resetP() {
	$('#nodeformbox5').window('close');
}
// 外部程序
function resetS() {
	$('#nodeformbox6').window('close');
}
// 导出文本
function resetF() {
	$('#nodeformbox8').window('close');
}
// 发送邮件
function resetM() {
	$('#nodeformbox9').window('close');
}
// 执行Kettle
function resetK() {
	$('#nodeformbox10').window('close');
}
// 执行JS
function resetJ() {
	$('#nodeformbox11').window('close');
}
// 执行Webserive
function resetWs() {
	$('#nodeformbox12').window('close');
}

//数据剖析
function resetdanaly() {
	$('#nodeformbox13').window('close');
}

//FTP文件上传下载
function resetFTP() {
	$('#nodeformbox14').window('close');
}

//文件格式转换
function resetTFP() {
	$('#nodeformbox18').window('close');
}

//WebApi
function resetAS() {
	$('#nodeformbox19').window('close');
}
// ------------------------节点取消操作 end---------------
var _id, _text = '';
// ------------------------导出文本 start---------------
// 打开编辑操作
function taskFInfo() {
	var id = $('#i_nodeItem_id8').combobox('getValue');// 获取值
	if (id == null || id == '' || id == 'undefined') {// 新建邮件任务
		addTaskFile();
	} else {// 编辑任务
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=8",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$("#fromResultText").trigger("click");
					$('#t_newTask_text').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id8').combobox('getText'); // 获取文本值
					$("#taskNoName8").val(name);
					editALLInfo(id, 8);
				}
			}
		});
	}
}
// ------------------------导出文本end---------------
// ------------------------发送邮件start---------------
// 打开编辑操作
function taskMInfo() {
	var id = $('#i_nodeItem_id9').combobox('getValue');// 获取值
	if (id == null || id == '' || id == 'undefined') {// 新建邮件任务
		addMail();
	} else {// 编辑任务
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=9",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$("#fromResultMail").trigger("click");
					$('#t_newTask_mail').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id9').combobox('getText'); // 获取文本值
					$("#taskNoName9").val(name);
					editALLInfo(id, 9);
				}
			}
		});
	}
}

// ------------------------发送邮件end---------------
// ------------------------执行Kettle start---------------
// 打开编辑操作
function taskKInfo() {
	var id = $('#i_nodeItem_id10').combobox('getValue');// 获取值
	if (id == null || id == '' || id == 'undefined') {// 新建邮件任务
		addKettle();
	} else {// 编辑任务
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=10",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$("#fromResultK").trigger("click");
					$('#t_newTask_kettle').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id10').combobox('getText'); // 获取文本值
					$("#taskNoName10").val(name);
					editALLInfo(id, 10);
				}
			}
		});
	}
}
// ------------------------执行Kettle end---------------
// ------------------------数据抽取 start---------------
// 打开编辑操作
function taskEInfo() {
	var id = $('#i_nodeItem_id1').combobox('getValue');// 获取id值
	if (id == null || id == '' || id == 'undefined') {// 新建任务
		addTaskE();
	} else {
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=1",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$("#fromResultE").trigger("click");
					$('#t_newTask_data').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id1').combobox('getText'); // 获取文本值
					$("#taskNoName1").val(name);
					editALLInfo(id, 1);
				}
			}
		});
	}
}

// ------------------------数据抽取 end---------------
// ------------------------外部程序 start---------------
// 打开编辑操作
function taskSInfo() {
	var id = $('#i_nodeItem_id6').combobox('getValue');// 获取值
	if (id == null || id == '' || id == 'undefined') {// 新建任务
		addSurface();
	} else {
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=6",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$("#fromResultS").trigger("click");
					$('#t_newTask_surface').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id6').combobox('getText'); // 获取文本值
					$("#taskNoName6").val(name);
					editALLInfo(id, 6);
				}
			}
		});
	}
}

// ------------------------外部程序end---------------
// ------------------------执行SQL start---------------
// 打开编辑操作
function taskSQLInfo() {
	var id = $('#i_nodeItem_id2').combobox('getValue');// 获取值
	if (id == null || id == '' || id == 'undefined') {// 新建邮件任务
		addSQL();
	} else {// 编辑任务
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=2",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$("#fromResultSQL").trigger("click");
					$('#t_newTask_sql').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id2').combobox('getText'); // 获取文本值
					$("#taskNoName2").val(name);
					editALLInfo(id, 2);
				}
			}
		});
	}
}
// ------------------------执行SQL end---------------
// ------------------------变量 start---------------
// 打开编辑操作
function taskVInfo() {
	var id = $('#i_nodeItem_id3').combobox('getValue');// 获取值
//	console.log(id)
	if (id == null || id == '' || id == 'undefined') {// 新建任务
		addVariate();
	} else {
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=3",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$("#fromResult").trigger("click");
					$('#t_newTask_variate').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id3').combobox('getText'); // 获取文本值

					$("#taskNoName3").val(name);
					editALLInfo(id, 3);

				}
			}
		});
	}
}
// 编辑变量
function editALLInfo(tid, ttype) {
	var url="task/getIdByNum.action?taskId=" + tid + "&taskType=" + ttype;
	if (ttype == '1') {// 数据抽取
		editTaskE(tid, ttype,url);
	}else if (ttype == '3') {// 变量设置
		editTaskV(tid, ttype,url);
	}else if (ttype == '2') {// 执行SQL
		editTaskT(tid, ttype,url);
	}else if (ttype == '5') {// 存储过程
		editTaskP(tid, ttype,url);
	}else if (ttype == '6') {// 外部命令
		editTaskS(tid, ttype,url);
	}else if (ttype == '8') {// 导出文本
		editTaskF(tid, ttype,url);
	}else if (ttype == '9') {// 发送邮件
		editTaskM(tid, ttype,url);
	}else if (ttype == '10') {// 执行kettle
		editTaskK(tid, ttype,url);
	}else if (ttype == '11') {// 执行JS
		editTaskJ(tid, ttype,url);
	}else if (ttype == '12') {// 执行webservice
		editTaskW(tid, ttype,url);
	}else if (ttype == '13') {// 数据剖析
		editTaskDQ(tid, ttype,url);
	}else if (ttype == '14') {// FTP文件
		editTaskFTP(tid, ttype,url);
	}
}

// ------------------------存储过程 start---------------
// 打开编辑操作
function taskPInfo() {
	var id = $('#i_nodeItem_id5').combobox('getValue');// 获取值
	if (id == null || id == '' || id == 'undefined') {// 新建任务
		addProcedure();
	} else {
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=5",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$("#fromResultP").trigger("click");
					$('#t_newTask_stored').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id5').combobox('getText'); // 获取文本值
					$("#taskNoName5").val(name);
					editALLInfo(id, 5);
				}
			}
		});
	}
}

// ------------------------执行JS start---------------
// 打开编辑操作
function taskJInfo() {
	var id = $('#i_nodeItem_id11').combobox('getValue');// 获取值
	if (id == null || id == '' || id == 'undefined') {// 新建任务
		addJS();
	} else {
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=11",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$("#fromResultJS").trigger("click");
					$('#t_newTask_js').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id11').combobox('getText'); // 获取文本值
					$("#taskNoName11").val(name);
					editALLInfo(id, 11);
				}
			}
		});
	}
}

// ------------------------执行JS end---------------
//------------------------执行webservice start---------------
// 打开编辑操作
function taskWsInfo() {
	var id = $('#i_nodeItem_id12').combobox('getValue');// 获取值
	if (id == null || id == '' || id == 'undefined') {// 新建任务
		addWs();
	} else {
		// 查看该任务是否已删除
		$.get("task/getIdByNum.action?taskId=" + id + "&taskType=12", function(result) {
			if (result.info != '') {
				$.messager.alert('提示', result.info, 'waring');
			}   else {
				$(".validatebox-tip").remove();
				$(".validatebox-invalid")
						.removeClass("validatebox-invalid");
				var name = $('#i_nodeItem_id12').combobox('getText'); // 获取文本值
				$("#taskNoName12").val(name);
				editALLInfo(id, 12);
			}
		}, 'json');
	}
}

//------------------------执行webservice end---------------
//------------------------数据剖析 start---------------
//打开编辑操作
function taskDQInfo() {
	var id = $('#i_nodeItem_id13').combobox('getValue');// 获取值
	if (id == null || id == '' || id == 'undefined') {// 新建任务
		addDQ();
	} else {
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=13",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$('#t_newTask_DQ').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id13').combobox('getText'); // 获取文本值
					$("#taskNoName13").val(name);
					editALLInfo(id, 13);
				}
			}
		});
	}
}
//------------------------数据剖析 end---------------
//------------------------FTP文件 start---------------
//打开编辑操作
function taskFTPInfo() {
	var id = $('#i_nodeItem_id14').combobox('getValue');// 获取值
	if (id == null || id == '' || id == 'undefined') {// 新建任务
		addFTP();
	} else {
		// 查看该任务是否已删除
		$.ajax({
			type : "get",
			url : "task/getIdByNum.action?taskId=" + id + "&taskType=14",
			success : function(result) {
				if (result.info != '') {
					$.messager.alert('提示', result.info, 'waring');
				}  else {
					$("#fromResultFTP").trigger("click");
					$('#t_newTask_FTP').window('open');
					$(".validatebox-tip").remove();
					$(".validatebox-invalid")
							.removeClass("validatebox-invalid");
					var name = $('#i_nodeItem_id14').combobox('getText'); // 获取文本值
					$("#taskNoName14").val(name);
					editALLInfo(id, 14);
				}
			}
		});
	}
}

//------------------------FTP文件 end---------------
// ------------------树形文件夹处理 star------------
// 树形下拉框加载
function getTreeInfo(id) {
	$('#' + id).combotree(
			{
				url : "task/treeFolder.action?id=NULL&vartype=''",
				required : true,
				onBeforeExpand : function(node) {
					var url = "task/treeFolder.action?vartype="
							+ node.attributes.vartype;
					$(this).tree("options").url = url;
					return true;
				},
				onExpand : function(node) {
					var children = $(this).tree('getChildren', node.id);
					if (children.length <= 0) {
						row.leaf = true;
						$(this).tree('refresh', node.id);
					}
				},
				onLoadSuccess : function(node, data) {
					var t = $(this);
					if (data) {
						$(data).each(function(index, d) {
							// 默认展开第一层
							if (this.state == 'closed' && this.parentId == '') {
								var children = t.tree('getChildren');
								for (var i = 0; i < children.length; i++) {
									t.tree('expand', children[i].target);
								}
							}
						});
						if (_id != '') {
							defaultValue(id, _id, _text);
						}
					}
				}
			});
}

// 为combotree增加默认值隐藏节点，解决因异步加载导致默认值id直接显示到文本框中的问题
// cbtid:combotree的id
// defval:生成节点的id
// deftext：生成节点的文本用于显示
function defaultValue(cbtid, defVal, defText) {
	var combotree = $("#" + cbtid);
	var tree = combotree.combotree('tree');
	var defNode = tree.tree("find", defVal);
	if (!defNode) {
		tree.tree('append', {
			data : [ {
				id : defVal,
				text : defText
			} ]
		});
		defNode = tree.tree("find", defVal);
		// console.log(defNode);
		// console.log(combotree);
		combotree.combotree('setValue', defVal);
		tree.tree('select', defNode.target);
		defNode.target.style.display = 'none';
	} else {
		combotree.combotree('setValue', defVal);
	}
}

// 树形获取所属文件夹信息
function getTreeFolder(id) {
	var node = $('#list_taskflow').tree('getSelected');
	if (node) {
		var nodes = {};
		var ttype = node.taskType;
		var pid;
		if (ttype == '7') {// 本身是文件，获取本身id
			pid = node.id;// 需要处理
		} else {// 任务，获取父类id
			pid = node.folderId;// 需要处理
		}
		$('#' + id).combotree('setValue', pid);
	}
}
// ------------------树形文件夹处理 end------------

// 当改变剖析方法的时候清空value值
function clearValue(ts) {
	$(ts).parent().next().next().find("input[name='config']").val("");
}