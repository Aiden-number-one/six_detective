var easyui_tree_options;// 节点层级
var taskJobList;
var transfer = [];
var _id, _text = '';
var condition = "1=1";// 修改后的查询条件
var initRows = 0;
var sqlWhereNum=0;//查询条件加载次数
$(function() {
	// 加载左侧任务信息
	var surl = "task/treeList.action?id=NULL&vartype=''";
	showTree("");
	showTree(surl);
	// 获取第一层文件夹id,默认记载第一层文件夹下数据
	$.ajax({
		type : "get",
		url : "task/getFistFile.action?id=NULL",
		success : function(result) {
			$("#search_folderId").val(result.data.folderId);
			$("#search_folderName").val(result.data.folderName);

			showdataGrid(condition);

			$("#forFileName").text(" / " + result.data.folderName);
		}
	});
	// 显示按钮信息
//	$('#data-list').datagrid({
//		toolbar : '#tb'
//	});
	// 获取分页信息
//	$('#data-list').datagrid({
//		loadFilter : pagerFilter
//	}).datagrid('loadData', getData());
	
	// datagrid跟随浏览器调整大小
	$(window).resize(function() {
		$("#cc").css("height", document.body.clientHeight-10).css("width", document.body.clientWidth);
		$("#west").css("height", document.body.clientHeight-40);
		$("#center").css("width", document.body.clientWidth-$("#west").width()); 
		$("#width_title").css("width", document.body.clientWidth-$("#west").width()-20); 
		$('#data-list').datagrid('resize', {
			width : document.body.clientWidth-$("#west").width()-45,
			height : document.body.clientHeight-80
		});
	});
	// datagrid跟随layout调整大小
	 $('#cc').layout({
		  onCollapse: function(){//折叠后
			  $("#width_title").css("width", $("#cc").width()-37); 
			  $('#data-list').datagrid('resize', {
					width : $("#cc").width()-45,
				});
		  },
		  onExpand: function(){
			  $("#width_title").css("width", $("#cc").width()-$("#west").width()-37); 
			  $('#data-list').datagrid('resize', {
					width : $("#cc").width()-$("#west").width()-45,
				});
		  }
	});
	 //左右拖拽调整大小
	 $('#cc').layout('panel', 'west').panel({
		 onResize:function(){
			 $("#width_title").css("width", $("#cc").width()-$("#west").width()-37); 
			 $('#data-list').datagrid('resize', {
					width : $("#cc").width()-$("#west").width()-45,
				});
		 }
	 }); 
	// 获得tree的层数
	easyui_tree_options = {
		length : 0, // 层数
		getLevel : function(treeObj, node) { // treeObj为tree的dom对象，node为选中的节点
			while (node != null) {
				node = $(treeObj).tree('getParent', node.target)
				easyui_tree_options.length++;
			}
			var length1 = easyui_tree_options.length;
			easyui_tree_options.length = 0; // 重置层数
			return length1;
		}
	}
	// 全屏信息
	// $('#variableScript3').textareafullscreen();
	// createFullScreen('#variableScript3,#deleteSql,#transScript,#command2,#command6,#command8');
	//隐藏查询条件
	$('#for_search').hide();
	//折叠
	$("#Stop_x").click(function() {
		stopStyle('shrink_screen_where','shrink_bottom',80,90,125);
	})
	// 展开
	$("#Stop_s").click(function() {
		stopStyle('shrink_bottom','shrink_screen_where',140,160,200);
	})
});

//是否显示搜索
function searchShow(){
	var state=document.getElementById('for_search').style.display;
	if(state == 'none'){
		showStyle(125,sqlWhereNum);
		sqlWhereNum=sqlWhereNum+1;
	}else{
		hideStyle(40,80);
	}
}
//查询子目录按钮事件
function checkSearch(){
	sqlWhere();
}

// 获取查询条件信息
function getSearchInfo() {
	var data = {};
	var fid = $("#search_folderId").val();
	var taskNo = $("#search_taskNo").val();
	taskNo = encodeURI(taskNo);
	taskNo = encodeURI(taskNo);
	var taskName = $("#search_taskName").val();
	taskName = encodeURI(taskName);
	taskName = encodeURI(taskName);
	var taskType = $("#search_taskType").val();
	var ifCheck;
	var rep = $('#ifCheck').is(':checked');// 是否选中
	if (rep) {
		ifCheck = "Y";
	} else {
		ifCheck = "N";
	}
	data.fid = fid;
	data.taskNo = taskNo;
	data.taskName = taskName;
	data.taskType = taskType;
	data.ifCheck = ifCheck;
	return data;
}

// 批量新增代码----------start---------
/**
 * 获取项目的绝对路径
 * 
 * @returns {String}
 */
function getRealPath() {
	var localObj = window.location;
	var contextPath = localObj.pathname.split("/")[1];
	var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
	return basePath;
};
// 批量新增处理--数据抽取
$('#addEBatch').unbind('click').click(function() {
	$(location).attr('href', getRealPath() + "/task/addTask.action");
});
// 批量新增处理--执行SQL
$('#addSQLBatch').unbind('click').click(function() {
	$(location).attr('href', getRealPath() + "/task/addTaskSQL.action");
});
// 批量新增处理--执行外部命令任务
$('#addSBatch').unbind('click').click(function() {
	$(location).attr('href', getRealPath() + "/task/addTaskS.action");
});
// 批量新增处理--文本导出任务
$('#addFileBatch').unbind('click').click(function() {
	$(location).attr('href', getRealPath() + "/task/addTaskFile.action");
});
// 批量新增代码----------end---------

// 新版页面按钮事件-------------start-----------

// 新增执行SQL
$('#addSQL').click(function() {
	addSQL();
});
// 新增数据剖析
$('#addDQ').click(function() {
	addDQ();
});
// 新增变量
$('#addV').click(function() {
	addVariate();
});
// 新增存储过程
$('#addP').click(function() {
	addProcedure();
});
// 新增外部程序
$('#addS').click(function() {
	addSurface();
});
// 新建导出文本任务
$('#addFile').click(function() {
	addTaskFile();
});
// 新建发送邮件任务
$('#addMail').click(function() {
	addMail();
});
// 新建执行Kettle
$('#addKettle').click(function() {
	addKettle();
});
// 新建执行JS文件
$('#addJS').click(function() {
	addJS();
});
//新建Webservice
$('#addWS').click(function() {
	addWs();
});
//新建FTP文件
$('#addFTP').click(function() {
	addFTP();
});

// 查看作业信息
$('#searchJob').click(function() {
	searchJob();
});
// 编辑
$('#editTask').click(function() {
	// 获取选中行
	var node = $('#data-list').datagrid('getChecked');
	if (node.length == 0) {
		$.messager.alert('警告', '未选择记录.', 'warning');
	} else if (node.length > 1) {
		$.messager.alert('警告', '只能选择一条待编辑任务.', 'warning');
	} else {
		editALLInfo(node[0].taskId, node[0].tasktype);
	}
});
// 复制
$('#copyTask').click(function() {
	var records1 = $('#data-list').datagrid('getSelections'); // 获取所有选中的行
	if (records1 == null || records1 == '') {
		Peony.alert('警告', '请选择待复制的记录.', 'warning');
	} else {
		var data = {};
		$.each(records1, function(i, record) {
			if (i == 0) {
				data.taskId = record.taskId;
				data.taskType = record.tasktype;
			} else {
				var t = record.taskId;
				var tt = record.tasktype;
				data.taskId = data.taskId + "," + t;
				data.taskType = data.taskType + "," + tt;
			}
		});
		$.ajax({
			type : "post",
			dataType : 'json',
			url : "task/copyInfo.action",
			data : data,
			success : function(msg) {
				sqlWhere();
			}
		});
	}
});
// 删除
$('#deleteTask').click(function() {
	// 获取选中行
	var nodes = $('#data-list').datagrid('getChecked');
	if (nodes.length == 0) {
		$.messager.alert('警告', '请选择待删除记录.', 'warning');
	} else {
		$.messager.confirm('确认提示', '您确定要删除任务信息吗？', function(r) {
			var arr = [];
			$.each(nodes, function(i, node) {
				arr.push('id=' + node["taskId"]);
			});
			var data = arr.join("&");
			if (r) {
				$.ajax({
					type : "post",
					dataType : 'json',
					url : "task/delete.action?id=" + data,
					data : data,
					success : function(msg) {
						$.messager.alert('提示', "删除成功", 'info');
						// 更新左侧树信息
						sqlWhere();
					}
				});
			}
		});
	}
});
// 移动文件夹
$('#moveTask').click(
		function() {
			// 获取选中行
			var node = $('#data-list').datagrid('getChecked');
			if (node.length == 0) {
				$.messager.alert('警告', '未选择记录.', 'warning');
			} else {
				// 获取选中的信息
				$("#fromResultM").trigger("click");
				$('#t_moveTask_file').window('open');
				getTreeInfo("folderIdM");// 加载树形信息
				transfer = []
				$.each(node, function(i) {
					$.ajax({
						type : "get",
						dataType : 'json',
						url : "task/getId.action?taskId=" + node[i].taskId
								+ "&taskType=" + node[i].tasktype,
						success : function(result) {
							transfer.push(result)
							$('#folderIdM').combotree('setValue',
									result.data.folderId);
							$('#taskIdM').val(result.data.taskId);
							$('#taskType').val(result.data.taskType);
							_id = result.data.folderId;
							_text = result.data.folderIdName;
						}
					});
				});
			}
		});
// 新版页面按钮事件-------------end-----------
// 查看所属作业事件处理-------------start-----------
function searchJob() {
	// $('#t_newTask_JobInfo').window('open');
	// 获取选中行
	var node = $('#data-list').datagrid('getChecked');
	if (node.length == 0) {
		$.messager.alert('警告', '未选择记录.', 'warning');
	} else if (node.length > 1) {
		$.messager.alert('警告', '只能选择一条待查看任务.', 'warning');
	} else {
		// 获取选中的信息
		$.ajax({
			type : "get",
			dataType : 'json',
			url : "task/taskJobList.action?taskId=" + node[0].taskId,
			success : function(result) {
				$('#t_newTask_JobInfo').window({
					onMaximize : function() {
						$('#task-job').datagrid({
							width : $(window).width() * 0.9
						});
						$('#task-job').datagrid('loadData', taskJobList);
					},
					onRestore : function() {
						$('#task-job').datagrid({
							width : $(window).width() * 0.27
						});
						$('#task-job').datagrid('loadData', taskJobList);
					}
				});
				$('#t_newTask_JobInfo').window('open');
				taskJobList = result.rows;
				if (result.rows.length > 0) {
					$("#fortaskjob").show();
					$("#othertaskjob").hide();
					$('#task-job').datagrid('loadData', result.rows);
				} else {
					$("#fortaskjob").hide();
					$("#othertaskjob").show();
				}

			}
		});
	}
}
var grid = $('#task-job').datagrid({
	url : '',
	striped : true,
	rownumbers : true,
	pagination : false,
	singleSelect : true,
	idField : 'jobId',
	columns : [ [ {
		width : '99%',
		title : '作业信息',
		field : 'jobNoName',
		sortable : true
	/*
	 * styler : function(value, row, index) { return 'border:0;'; }
	 */
	} ] ]
});
// 查看所属作业事件处理-------------end-----------
// 移动文件夹事件处理-------------start-----------
// 保存移动文件夹信息
function saveMove() {
	if ($("#formMove").form('validate')) {// 启用校验

		$.each(transfer, function(j) {
			var taskId = transfer[j].data.taskId;
			var taskType = transfer[j].data.taskType;
			var folderId = $('#folderIdM').combotree('getValue');
			$.ajax({
				type : "get",
				url : "task/saveMove.action?folderId=" + folderId + "&taskId="
						+ taskId + "&taskType=" + taskType,
				// data: data,
				success : function(msg) {
					if (msg.success == false) {
						$.messager.alert('提示', transfer[j].data.taskName
								+ "保存失败", 'info');
					}
					$("#fromResultM").trigger("click");
					$('#t_moveTask_file').window('close');
					sqlWhere();
				}
			});
		})
		$.messager.alert('提示', "保存成功", 'info');

	}
}
// 取消
function canleMove() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultM").trigger("click");
			$('#t_moveTask_file').window('close');
		}
	});
}

// 移动文件夹事件处理-------------end-----------
// 删除任务信息
function delTaskInfo(tid, ttype) {
	$.messager.confirm('确认', '您确定要删除信息吗？', function(r) {
		if (r) {
			$.ajax({
				type : "get",
				dataType : 'json',
				url : "task/deleteOne.action?id=" + tid + "&taskType=" + ttype,
				success : function(msg) {
					$.messager.alert('提示', "删除成功", 'info');
					var surl = "task/treeList.action?id=NULL&vartype=''";
					showTree(surl);
				}
			});
		}
	});
}

// 编辑信息
function editALLInfo(tid, ttype) {
	var url = "task/getId.action?taskId=" + tid + "&taskType=" + ttype;
	if (ttype == 'TE') {// 数据抽取
		editTaskE(tid, ttype, url);
	} else if (ttype == 'TV') {// 变量设置
		editTaskV(tid, ttype, url);
	} else if (ttype == 'TT') {// 执行SQL
		editTaskT(tid, ttype, url);
	} else if (ttype == 'TP') {// 存储过程
		editTaskP(tid, ttype, url);
	} else if (ttype == 'TS') {// 外部程序
		editTaskS(tid, ttype, url);
	} else if (ttype == 'TF') {// 导出文本
		editTaskF(tid, ttype, url);
	} else if (ttype == 'TM') {// 发送邮件
		editTaskM(tid, ttype, url);
	} else if (ttype == 'TK') {// 执行kettle
		editTaskK(tid, ttype, url);
	} else if (ttype == 'TJ') {// 执行JS任务
		editTaskJ(tid, ttype, url);
	} else if (ttype == 'TW') {// 执行webservice
		editTaskW(tid, ttype, url);
	} else if (ttype == 'DQ') {// 数据剖析
		editTaskDQ(tid, ttype, url);
	} else if (ttype == 'FTP') {//FTP文件
		editTaskFTP(tid, ttype,url);
	} 

}

// ------------------------变量 end---------------
// ------------------------数据剖析 开始---------------
// ------------------------数据剖析 结束---------------
// 加载任务树信息
function showTree(url) {
	$('#list_taskflow').tree(
			{
				url : url,
				method : 'get',
				animate : true,
				checkbox : false,
				cascadeCheck : false,// 层叠选中
				onlyLeafCheck : true,
				lines : true,// 显示虚线效果
				onBeforeExpand : function(node) {
					var url = "task/treeList.action?vartype="
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
					}
				},
				onClick : function(node) {
					var ttype = node.attributes.taskType;
					var fid = node.id;
					$("#search_folderId").val(fid);
					$("#search_folderName").val(node.text);
					$("#forFileName").text(" / " + node.text);
					sqlWhere();
				},
				onContextMenu : function(e, node) {
					e.preventDefault();
					$(this).tree('select', node.target);
					$('#t_rm_catalog').menu('show', {
						left : e.pageX,
						top : e.pageY
					});
				}
			// onContextMenu : function(e, node) {
			// if (!$(this).tree('isLeaf', node.target)) {
			// e.preventDefault();
			// $(this).tree('select', node.target);
			// $('#jobflow_right_menu').menu('show', {
			// left : e.pageX,
			// top : e.pageY
			// });
			// } else {
			// e.preventDefault();
			// $(this).tree('select', node.target);
			// $('#jobflow_right_menu_job').menu('show', {
			// left : e.pageX,
			// top : e.pageY
			// });
			// }
			// }
			});

}

// 查询方法--之前
function search_event() {
	var fid = $("#search_folderId").val();
	var taskNo = $("#search_taskNo").val();
	taskNo = encodeURI(taskNo);
	taskNo = encodeURI(taskNo);
	var taskName = $("#search_taskName").val();
	taskName = encodeURI(taskName);
	taskName = encodeURI(taskName);
	var taskType = $("#search_taskType").val();
	var ifCheck;
	var rep = $('#ifCheck').is(':checked');// 是否选中
	if (rep) {
		ifCheck = "Y";
	} else {
		ifCheck = "N";
	}
	showdataGrid("");
	var surl = "task/viewdataList.action?fid=" + fid + "&taskNo=" + taskNo
			+ "&taskName=" + taskName + "&taskType=" + taskType + "&ifCheck="
			+ ifCheck;
	showdataGrid(surl);
}
// ------------------树形文件夹处理 star------------
// 新增文件夹
function addFile() {
	var node = $('#list_taskflow').tree('getSelected');// 选中的节点
	var th = $("#list_taskflow").tree();// 当前tree的DOM
	var levelInfo = easyui_tree_options.getLevel(th, node);
	if (levelInfo >= 5) {
		$.messager.alert('提示', "文件夹层数不可超过五级", 'waring');
	} else {
		$('#t_newTask_file').window('open');
		$('#saveType').val("1");// 新增
		$("#findId").val(node.id);
		$(".validatebox-tip").remove();
		$(".validatebox-invalid").removeClass("validatebox-invalid");
	}
}
function saveFile() {
	var findId = $("#findId").val();// 打开页面前选中的节点
	if (findId != "") {// 新增时有该参数，编辑时没有
		var node = $('#list_taskflow').tree('find', findId);
		$('#list_taskflow').tree('select', node.target);// 设置选中该节点
	}
	var savetype = $('#saveType').val();
	if ($("#formF").form('validate')) {// 启用校验
		var node = $('#list_taskflow').tree('getSelected');
		if (node) {
			var nodes = {};
			var fid = $('#folderIdF').val();
			var fname = $('#folderName').val();
			var ttype = node.taskType;
			var pid;
			// if(ttype == '7'){//本身是文件，获取本身id
			// pid=node.id;//需要处理
			// }else{//任务，获取父类id
			// pid=node.folderId;//需要处理
			// }
			if (savetype == '1') {// 新增
				pid = node.id;
			} else {// 编辑
				pid = node.folderId;// 需要处理
			}
			nodes.folderId = fid;
			nodes.folderName = fname;
			nodes.parentId = pid;
			nodes.fileType = '2';
			$.ajax({
				type : "POST",
				url : "job/saveFiles.action",
				data : nodes,
				success : function(msg) {
					if (msg.flag == '1') {
						$.messager.alert('提示', msg.info, 'info');
						$("#fromResultF").trigger("click");
						$('#t_newTask_file').window('close');
						// 查询
						var surl = "task/treeList.action?id=NULL&vartype=''";
						showTree(surl);
					} else {
						$.messager.alert('提示', msg.info, 'info');
					}
				}
			});
		}
	}
}
function editFile() {
	$('#t_newTask_file').window('open');
	var node = $('#list_taskflow').tree('getSelected');
	if (node) {
		var fid = node.id;
		$.ajax({
			type : "get",
			url : "job/getFolder.action?folderId=" + fid,
			success : function(result) {
				$('#folderIdF').val(node.id);
				$('#folderName').val(result.data.folderName);
				$('#saveType').val("2");// 编辑
				$(".validatebox-tip").remove();
				$(".validatebox-invalid").removeClass("validatebox-invalid");
			}
		});
	}
}
// 取消
function canleFile() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultF").trigger("click");
			$('#t_newTask_file').window('close');
		}
	});
}

// 删除文件夹
function deleteFile() {
	var node = $('#list_taskflow').tree('getSelected');
	if (node.parentId === '') {
		$.messager.alert('提示', "该文件夹为根目录，不可删除！", 'warning');
		return false;
	}
	if (node) {
		$.messager.confirm('确认提示','您确定要删除该文件夹吗？',function(r) {
			if (r) {
				$.ajax({
					type : "get",
					// dataType : 'json',
					url : "task/ifLast.action?id="+ node.id,
					success : function(msg) {
						if (msg == false) {// 含有子节点
							$.messager.alert('提示',"该文件夹下含有文件夹或者任务，请先清空该文件夹才可以删除！",'warning');
							// var  m=confirm("该文件夹下含有文件夹或者任务，确定要删除吗？");
//							$.messager.confirm('确认提示','该文件夹下含有文件夹或者任务，确定要删除吗？',function(r) {
//									if (r) {
//										$.ajax({
//											type : "get",
//											// dataType
//											// :
//											// 'json',
//											url : "task/deleteFolder.action?id="+ node.id,
//											success : function(msg) {
//												$.messager.alert('提示',"删除成功！",'info');
//												var surl = "task/treeList.action?id=NULL&vartype=''";
//												showTree(surl);
//											}
//										});
//									}
//								});
						} else {
							// 删除文件夹操作
							$.ajax({
									type : "get",
									// dataType :
									// 'json',
									url : "task/deleteFolder.action?id="+ node.id,
									success : function(msg) {
										$.messager.alert('提示',"删除成功！",'info');
										var surl = "task/treeList.action?id=NULL&vartype=''";
										showTree(surl);
									}
								});
						}
					}
				});
			}
		});
	} else {
		$.messager.alert('提示', "请选择待删除文件夹", 'warning');
	}
}

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

// 右侧数据显示
function showdataGrid(condition) {
	if (condition == undefined || condition == "")
		condition = " 1=1 ";
	var ifCheck;
	var rep = $('#ifCheck').is(':checked');// 是否选中
	if (rep) {
		ifCheck = "Y";
	} else {
		ifCheck = "N";
	}
	var fid = $("#search_folderId").val();
	condition = encodeURI(condition);
	condition = encodeURI(condition);
	$.ajax({
		type : "get",
		url : "task/viewdataListWhere.action?condition=" + condition
				+ "&ifCheck=" + ifCheck + "&fid=" + fid,
		success : function(data) {
			var noHtml;
			if (data.rows != undefined) {
				var task_name
				$.each(data.rows, function(i, dc) {
					if (dc.tasktype == 'TE') {
						task_name = '数据抽取';
					} else if (dc.tasktype == 'TT') {
						task_name = '执行SQL';
					} else if (dc.tasktype == 'TV') {
						task_name = '变量设置';
					} else if (dc.tasktype == 'TP') {
						task_name = '存储过程';
					} else if (dc.tasktype == 'TS') {
						task_name = '外部程序';
					} else if (dc.tasktype == 'TF') {
						task_name = '导出文本';
					} else if (dc.tasktype == 'TM') {
						task_name = '发送邮件';
					} else if (dc.tasktype == 'TK') {
						task_name = '执行Kettle';
					} else if (dc.tasktype == 'TJ') {
						task_name = '执行JS语句';
					} else if (dc.tasktype == 'TW') {
						task_name = '执行Webservice';
					} else if (dc.tasktype == 'DQ') {
						task_name = '数据剖析';
					} else if (dc.tasktype == 'FTP') {
						task_name = 'FTP文件';
					}

					noHtml = noHtml + "<tr><td>" + dc.folderName + "</td><td>"
							+ dc.taskNo + "</td><td>" + dc.taskName
							+ "</td><td>" + task_name + "</td><td>" + dc.src
							+ "</td><td>" + dc.tar + "</td><td>"
							+ dc.targetTable + "</td><td>" + dc.modifiedTime
							+ "</td></tr>";
				})
				$("#data-none").html(noHtml)
			}
		}
	});
	$('#data-list')
			.datagrid(
					{
						title : '任务信息',
						url : "task/viewdataListWhere.action?condition="
								+ condition + "&ifCheck=" + ifCheck + "&fid="
								+ fid,
						idField : 'taskId',
						pagination : true, // 分页
						rownumbers : true, // 行号
						singleSelect : true,// 单选
						checkOnSelect : true,
						autoRowHeight : false,// 是否设置基于该行内容的行高度
						remoteSort : false,
						striped : true,// 奇偶行显示不同背景色
						toolbar : '#tb',
						fitColumns : false,// 自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动。
						pageSize : 30,// 每页显示的记录条数，默认为10
						pageList : [ 10, 30, 50, 100, 500 ],
						columns : [ [
								{
									field : 'folderId',
									hidden : true
								},
								{
									field : 'taskId',
									checkbox : true
								},
								{
									field : 'folderName',
									title : '所属文件夹',
									width : '11%',
									sortable : true
//									formatter : function(value, row, index) {
//										return "<span title='" + value + "'>" + value + "</span>";  
//									}
								},
								{
									field : 'taskNo',
									title : '任务编号',
									 width : '8%',
									sortable : true
								},
								{
									field : 'taskName',
									title : '任务名称',
									 width : '10%',
									sortable : true
								},
								{
									field : 'tasktype',
									title : '任务类型',
									 width : '10%',
									sortable : true,
									formatter : function(value, row, index) {
										if (row.tasktype == 'TE') {
											var path = getContextPath()
													+ "/images/task/icon03.png";
											return '<img src=' + path
													+ ' />  数据抽取';
										} else if (row.tasktype == 'TT') {
											var path = getContextPath()
													+ "/images/task/icon02.png";
											return '<img src=' + path
													+ ' />  执行SQL';
										} else if (row.tasktype == 'TV') {
											var path = getContextPath()
													+ "/images/task/icon01.png";
											return '<img src=' + path
													+ ' />  变量设置';
										} else if (row.tasktype == 'TP') {
											var path = getContextPath()
													+ "/images/task/icon05.png";
											return '<img src=' + path
													+ ' />  存储过程';
										} else if (row.tasktype == 'TS') {
											var path = getContextPath()
													+ "/images/task/icon06.png";
											return '<img src=' + path
													+ ' />  外部程序';
										} else if (row.tasktype == 'TF') {
											var path = getContextPath()
													+ "/images/task/icon08.png";
											return '<img src=' + path
													+ ' />  导出文本';
										} else if (row.tasktype == 'TM') {
											var path = getContextPath()
													+ "/images/task/icon09.png";
											return '<img src=' + path
													+ ' />  发送邮件';
										} else if (row.tasktype == 'TK') {
											var path = getContextPath()
													+ "/images/task/icon10.png";
											return '<img src=' + path
													+ ' />  执行Kettle';
										} else if (row.tasktype == 'TJ') {
											var path = getContextPath()
													+ "/images/task/icon11.png";
											return '<img src=' + path
													+ ' />  执行JS语句';
										} else if (row.tasktype == 'TW') {
											var path = getContextPath()
													+ "/images/task/icon12.png";
											return '<img src=' + path
													+ ' />  执行Webservice';
										} else if (row.tasktype == 'DQ') {
											var path = getContextPath()
													+ "/images/task/icon13.png";
											return '<img src=' + path
													+ ' />  数据剖析';
										} else if (row.tasktype == 'FTP'){
							var path = getContextPath()+ "/images/task/icon14.png";
							return '<img src=' + path+ ' />  FTP文件';
						}
									}
								}, {
									field : 'src',
									title : '源连接',
									 width : '11%',
									sortable : true
								}, {
									field : 'tar',
									title : '目标连接',
									 width : '11%',
									sortable : true
								}, {
									field : 'targetTable',
									title : '目标表',
									 width : '16%',
									sortable : true
								}, {
									field : 'modifiedTime',
									title : '最后修改时间',
									 width : '13%',
									sortable : true
								}, {
									field : 'modifieder',
									title : '修改人',
									 width : '8%',
									sortable : true
								} ] ],
						onClickRow : function(index, row) { // 单击行事件
							// ---------for TEST
							// 结合SHIFT,CTRL,ALT键实现单选或多选------------
							if (index != selectIndexs.firstSelectRowIndex
									&& !inputFlags.isShiftDown1) {
								selectIndexs.firstSelectRowIndex = index;
							}
							if (inputFlags.isShiftDown1) {
								$('#data-list').datagrid('clearSelections');
								selectIndexs.lastSelectRowIndex = index;
								var tempIndex = 0;
								if (selectIndexs.firstSelectRowIndex > selectIndexs.lastSelectRowIndex) {
									tempIndex = selectIndexs.firstSelectRowIndex;
									selectIndexs.firstSelectRowIndex = selectIndexs.lastSelectRowIndex;
									selectIndexs.lastSelectRowIndex = tempIndex;
								}
								for (var i = selectIndexs.firstSelectRowIndex; i <= selectIndexs.lastSelectRowIndex; i++) {
									$('#data-list').datagrid('selectRow', i);
								}
							}
							// ---------for TEST
							// 结合SHIFT,CTRL,ALT键实现单选或多选------------
						}
					});
}

// -------------------------------------------------------------------------------
// 结合SHIFT,CTRL,ALT键实现单选或多选
// -------------------------------------------------------------------------------
var KEY = {
	SHIFT : 16,
	CTRL : 17,
	ALT : 18,
	DOWN : 40,
	RIGHT : 39,
	UP : 38,
	LEFT : 37
};
var selectIndexs = {
	firstSelectRowIndex : 0,
	lastSelectRowIndex : 0
};
var inputFlags = {
	isShiftDown : false,
	isCtrlDown : false,
	isAltDown : false
}

function keyPress(event) {// 响应键盘按下事件
	var e = event || window.event;
	var code = e.keyCode | e.which | e.charCode;
	switch (code) {
	case KEY.SHIFT:
		inputFlags.isShiftDown = true;
		$('#data-list').datagrid('options').singleSelect = false;
		break;
	case KEY.CTRL:
		inputFlags.isCtrlDown = true;
		$('#data-list').datagrid('options').singleSelect = false;
		break;
	/*
	 * case KEY.ALT: inputFlags.isAltDown = true;
	 * $('#dataListTable').datagrid('options').singleSelect = false; break;
	 */
	default:
	}
}

function keyRelease(event) { // 响应键盘按键放开的事件
	var e = event || window.event;
	var code = e.keyCode | e.which | e.charCode;
	switch (code) {
	case KEY.SHIFT:
		inputFlags.isShiftDown = false;
		selectIndexs.firstSelectRowIndex = 0;
		$('#data-list').datagrid('options').singleSelect = true;
		break;
	case KEY.CTRL:
		inputFlags.isCtrlDown = false;
		selectIndexs.firstSelectRowIndex = 0;
		$('#data-list').datagrid('options').singleSelect = true;
		break;
	/*
	 * case KEY.ALT: inputFlags.isAltDown = false;
	 * selectIndexs.firstSelectRowIndex = 0;
	 * $('#dataListTable').datagrid('options').singleSelect = true; break;
	 */
	default:
	}
}

$("#exportTask").click(function() {
	$("#export").window('open')
})

// 导出任务信息
$("#Excellent").click(function() {
	var nameText = $("#name_text").val();
	var CSV_cc = $("#cc_csv").combobox('getValue')
	var csv_excel
	if (CSV_cc == 'excel') {
		csv_excel = 'xls'
	} else {
		csv_excel = 'csv'
	}
	$(this).attr('download', nameText + '.' + csv_excel)
	if (CSV_cc == 'excel') {
		return ExcellentExport.excel(this, 'data_excel')
	} else {
		return ExcellentExport.csv(this, 'data_excel')
	}

})
// 取消导出操作
$("#Excellent_cancel").click(function() {
	$("#export").window('close')
})
/*
 * 获取应用根路径 @return {TypeName}
 */
function getContextPath() {
	var pathname = location.pathname;
	return pathname.substr(0, pathname.indexOf('/', 1));
}

// 分页
//function getData() {
//	var rows = [];
//	for (var i = 1; i <= 800; i++) {
//		var amount = Math.floor(Math.random() * 1000);
//		var price = Math.floor(Math.random() * 1000);
//		rows.push({
//			inv : 'Inv No ' + i,
//			date : $.fn.datebox.defaults.formatter(new Date()),
//			name : 'Name ' + i,
//			amount : amount,
//			price : price,
//			cost : amount * price,
//			note : 'Note ' + i
//		});
//	}
//	return rows;
//}

//function pagerFilter(data) {
//	if (typeof data.length == 'number' && typeof data.splice == 'function') { // is
//		// array
//		data = {
//			total : data.length,
//			rows : data
//		}
//	}
//	var dg = $(this);
//	var opts = dg.datagrid('options');
//	var pager = dg.datagrid('getPager');
//	pager.pagination({
//		onSelectPage : function(pageNum, pageSize) {
//			opts.pageNumber = pageNum;
//			opts.pageSize = pageSize;
//			pager.pagination('refresh', {
//				pageNumber : pageNum,
//				pageSize : pageSize
//			});
//			dg.datagrid('loadData', data);
//		}
//	});
//	if (!data.originalRows) {
//		data.originalRows = (data.rows);
//	}
//	var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
//	var end = start + parseInt(opts.pageSize);
//	data.rows = (data.originalRows.slice(start, end));
//	return data;
//}
