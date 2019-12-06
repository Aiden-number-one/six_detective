var _jobId, _jobName = '';
$(function() {
	// 加载全局变量设置信息
	showdataGrid("");
	var surl = "global/dataList.action?globalName=null";
	showdataGrid(surl);
	// datagrid跟随浏览器调整大小
	$(window).resize(function() {
		$('#data-list').datagrid('resize', {
			width : $(window).width() * 1,
			height : $(window).height() * 0.8
		}).datagrid('resize', {
			width : $(window).width() * 0.97,
			height : $(window).height() * 0.8
		});
	});

});
// 点击进入新建页面
$('#btn-newGlobal').click(function() {
	_jobId = '';
	$("#fromResult").trigger("click");
	$('#t_newTask_global').window('open');
	getTreeJob();
	// 弹出窗口；
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
});
// 保存
function saveGlobal() {
	if ($("#formInfo").form('validate')) {// 启用校验
		var data = $('#formInfo').serialize();
//		console.log(data);
		$.ajax({
			type : "POST",
			url : "global/save.action",
			data : data,
			success : function(msg) {
				if(msg.info == ''){
					$.messager.alert('提示', "保存成功", 'info');
					// $("#fromResult").trigger("click");
					$("#fromResult").empty();
					$('#t_newTask_global').window('close');
					var surl = "global/dataList.action?globalName=null";
					showdataGrid(surl);
				}else{
					$.messager.alert('提示', msg.info, 'error');
				}
			}
		});
	} else {
		$.messager.alert('提示', "有非空字段需要填写，请检查.", 'waring');
	}
}

// 编辑变量
function editGlobal(sid) {
	// $("#fromResult").trigger("click");
	$.ajax({
		type : "get",
		dataType : 'json',
		url : "global/getId.action?globalId=" + sid,
		success : function(data) {
			_jobId = data.data.jobId;
			_jobName = data.data.jobName;
			// $("#fromResult").trigger("click");
			$("#fromResult").empty();
			$('#t_newTask_global').window('open');
			getTreeJob();
			$("#formInfo").form('load', data.data);
			$("#globalId").val(data.data.globalId);
			$('#jobId').combotree('setValues', data.data.jobId);
		}
	});
}
// 取消
function canleGlobal() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			// $("#fromResult").trigger("click");
			$("#fromResult").empty();
			$('#t_newTask_global').window('close');
		}
	});
}

// 删除信息
function deleteGlobal(sid) {
	$.messager.confirm('确认', '您确定要删除信息吗？', function(r) {
		if (r) {
			$.ajax({
				type : "get",
				dataType : 'json',
				url : "global/delete.action?id=" + sid,
				success : function(data) {
					var surl = "global/dataList.action?globalName=null";
					showdataGrid(surl);
				}
			});
		}
	});
}
// 查询
function search_event() {
	var sname = $('#globalName_search').val();
	var surl = "global/dataList.action?globalName=" + sname;
	surl = encodeURI(surl);
	surl = encodeURI(surl);
	showdataGrid(surl);
}

// 默认选中第一条
function onLoadSuccess() {
	var id = $("#globalId").val();
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

// 树形下拉框加载job
function getTreeJob() {
	$('#jobId').combotree({
		url : "job/treeList3.action?id=NULL&vartype=''",
		required : false,
		checkbox : true,
		editable:false,
		cascadeCheck : true,
		multiple : true,
		onBeforeExpand : function(node) {
			var url = "job/treeList3.action?vartype=" + node.attributes.vartype;
			$(this).tree("options").url = url;
			return true;
		},
		onExpand : function(node) {
			var children = $(this).tree('getChildren', node.id);
			if (children.length <= 0) {
				row.leaf = true;
				$(this).tree('refresh', node.id);
			}
			var val=$('#jobId').combotree('getValue');
			if(val){
				var t=val.split(",");
				for(var i=0;i<t.length;i++){
					var combotree = $("#jobId");
					var tree = combotree.combotree('tree');
					var defNode = tree.tree("find", t[i]);
//					console.log(defNode);
					if(defNode){
						tree.tree('select', defNode.target);
					}
				}
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
				if(_jobId != '') {
					defaultValue('jobId', _jobId, _jobName);
				}
			}
		}
//		onSelect : function(node) {
//			// alert(node.id+","+node.text+","+node.attributes.taskType);
////			if (node.attributes.taskType == '7') {
////				$.messager.alert('提示', "该选项为文件夹，请重新选择！", 'waring');
////				$('#jobId').combotree("setValue", "");
////			}
//		},
	});
}

// 为combotree增加默认值隐藏节点，解决因异步加载导致默认值id直接显示到文本框中的问题
// cbtid:combotree的id
// defval:生成节点的id
// deftext：生成节点的文本用于显示
function defaultValue(cbtid, defVal, defText) {
	var combotree = $("#" + cbtid);
//	var tree = combotree.combotree('tree');
//	var valArr=defVal.split(",");
//	var textArr=defText.split(",");
//	for(var i=0;i<valArr.length;i++){
//		var defNode = tree.tree("find", valArr[i]);
//		if (!defNode) {
//			tree.tree('append', {
//				data : [ {
//					id : valArr[i],
//					text : textArr[i]
//				} ]
//			});
//			defNode = tree.tree("find", valArr[i]);
//			combotree.combotree('setValue', valArr[i]);
//			tree.tree('select', defNode.target);
//			defNode.target.style.display = 'none';
//		} else {
////			combotree.combotree('setValue', valArr[i]);
//		}
//	}
	combotree.combotree('setText', defText);
}

// 右侧数据显示
function showdataGrid(url) {
	$('#data-list').datagrid(
			{
				title : '全局变量信息',
				url : url,
				idField : 'globalId',
				pagination : true, // 分页
				rownumbers : true, // 行号
				singleSelect : true,// 单选
				checkOnSelect : true,
				autoRowHeight : false,// 是否设置基于该行内容的行高度
				remoteSort : false,
				striped : true,// 奇偶行显示不同背景色
				fitColumns : true,// 自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动。
				pageSize : 100,// 每页显示的记录条数，默认为10
				pageList : [ 10, 30, 50, 100 ],
				columns : [ [
						{
							field : 'globalId',
							hidden : true
						},
						{
							field : 'globalName',
							title : '变量名称',
							width : '30%',
							sortable : true
						},
						{
							field : 'globalValue',
							title : '变量值',
							width : '30%',
							sortable : true
						},
						{
							field : 'jobName',
							title : '应用作业',
							 width : '30%',
							sortable : true
						},
						{
							field : '_operate',
							title : '操作',
							 width : '11%',
							formatter : function(value, row, index) {
								return '<a href="javascript:void(0)" onclick="editGlobal(\''
										+ row.globalId
										+ '\')"><strong>编辑</strong></a>&nbsp;&nbsp;&nbsp;'
										+ '<a href="javascript:void(0)" onclick="deleteGlobal(\''
										+ row.globalId
										+ '\')"><strong>删除</strong></a>&nbsp;&nbsp;&nbsp;'
							}
						} ] ]
			});
}

function getRealPath() {
	var localObj = window.location;
	var contextPath = localObj.pathname.split("/")[1];
	var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
	return basePath;
};

