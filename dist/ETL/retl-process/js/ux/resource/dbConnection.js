var conId = "";
var forColumnList;
var forPreviewList;
var FWQ2 = ''
var Thats = 20;
var condition = "1=1";// 修改后的查询条件
var sqlWhereNum=0;//查询条件加载次数
$(function() {
	showList();
//	showDriveList();
	// datagrid跟随浏览器调整大小
	$(window).resize(function() {
		$("#cc").css("height", document.body.clientHeight-10).css("width", document.body.clientWidth);
		$("#west").css("height", document.body.clientHeight-40);
		$("#center").css("width", document.body.clientWidth-$("#west").width()); 
		$("#width_title").css("width", document.body.clientWidth-$("#west").width()-20); 
		$('#data-list').datagrid('resize', {
			width : $(window).width() - $("#west").width()-25,
			height : $(window).height() - 80
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
			  $("#width_title").css("width", $("#cc").width()-$("#west").width()-17); 
			  $('#data-list').datagrid('resize', {
					width : $("#cc").width()-$("#west").width()-25,
				});
		  }
	});
	 //左右拖拽调整大小
	 $('#cc').layout('panel', 'west').panel({
		 onResize:function(){
			 $("#width_title").css("width", $("#cc").width()-$("#west").width()-17); 
			 $('#data-list').datagrid('resize', {
					width : $("#cc").width()-$("#west").width()-25,
				});
		 }
	 }); 
	// 表信息预览弹出框自适应
	$('#Modal-tableEdit').window({
		onMaximize : function() {

			$("#Modal-tableEdit .panel .panel-body-noborder").height($('#Modal-tableEdit').height())
			$('#columnList').datagrid('loadData', forColumnList);
			$('#previewList').datagrid({
				height : $('#Modal-tableEdit').height() * 0.8,
			});
			$('#columnList').datagrid({
				height : $('#Modal-tableEdit').height() - 30,
				shadow : false
			});
			$('#tabs').tabs({
				height : $('#Modal-tableEdit').height() - 30,
				shadow : false
			});
		},
		onRestore : function() {
			$('#previewList').datagrid({
				height : $('#Modal-tableEdit').height() * 0.7,
			});
			$('#tabs').tabs({
				height : $(window).height() * 0.5,
				shadow : false
			});
			$('#columnList').datagrid({
				height : 280,
				shadow : false
			});
		}
	});
	// 新增数据连接
	$('#btn-dbManager').click(function() {
		// 弹出窗口；
		$('#dbAdmin').window('open');
		$("#fromResultdb").trigger("click");
		initDataInfo();
		initSelectEvents1();// 加载下拉框信息
		editURL();
		$("#connectionId").val('');
		$(".validatebox-tip").remove();
		$(".validatebox-invalid").removeClass("validatebox-invalid");
	});
	// 点击进入元数据导入页面
	// $('#btn-driveM-importData').click(function(){
	$('#importData').click(function() {
				showTree("");
				$('#tt').tree('loadData', []);
				// $("#search_tableName").val("");
				$("#search_tableName").searchbox('setValue', '');
				var connectionId = $("#forconnectionId").val();
				var databasetype = $("#forDatabasetype").val();
				var forconnectionTypeName = $("#forconnectionTypeName").val();
				$("#forSearch").hide();
				$("#forData").hide();
				$("#forError").show();// 显示
				$("#forButton").hide();
				$("#forError").html("数据查询中，请稍等-------------");
				if (databasetype != "2") {// 关系型
					$.ajax({
						type : "get",
						dataType : 'json',
						url : "dbConnection/dataList3.action?id=" + connectionId + "&schemName=" + "&tName=",
						success : function(reslut) {
							if (reslut.info == '1') {
								$("#forError").html(reslut.error);
							} else {
								$("#forSearch").show();
								$("#forData").show();
								$("#forError").hide();
								$("#forButton").show();
								$('#tt').tree('loadData', reslut.data);
							}
						}
					});
					if (forconnectionTypeName.trim() == 'MSSQLSERVER' || forconnectionTypeName.trim() == 'ORACLE') {
						$.ajax({
							type : "get",
							dataType : 'json',
							url : "dbConnection/searchAllSchemName.action?id=" + connectionId,
							success : function(data) {
								$("#forschemNameStr").val(data.info);
							}
						});
					}
				} else {
					var filePath = $("#forfilePath").val();
					var fileExtName = $("#forfileExtName").val();
					$("#forSearch").show();
					$("#forData").show();
					$("#forError").hide();
					$("#forButton").show();
					var surl = "dbConnection/dataListTxt.action?cid=" + connectionId + "&filePath=" + filePath
							+ "&fileExtName=" + fileExtName + "&tName=";
					showTree("");
					showTree(surl);
				}
				$('#metaDataAdmin').window('open');
			});
	// 点击进入新增表页面
	$('#btn-driveM-newtable').click(function() {
		// 弹出窗口
		$('#Modal-newtable').window('open');
		loadTableInfo();
		$('#m-btn-addTable').bind('click', saveTableInfo);
	});
	$('#data-list').datagrid({
		toolbar : '#tb'
	});
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
// 查询
function search_event() {
	var connectionId = $("#forconnectionId").val();
	var tableName = $('#search_tableName2').val();
	var mdType = $('#search_mdType').val();
	var tableCat = $('#search_tableCat').val();
	var schemName = $('#search_schemName').val();
	var surl = "tbMdTable/tableList.action?connectionId=" + connectionId + "&tableName=" + tableName + "&mdType="
			+ mdType + "&tableCat=" + tableCat + "&schemName=" + schemName;
	surl = encodeURI(surl);
	surl = encodeURI(surl);
	showdataGrid(surl);
}

// 新版页面修改 wfy20170406 start----------------
// 保存元数据
function saveMetadata() {
	var databasetype = $("#forDatabasetype").val();
	// 获取选中的tree信息
	var dlist = $('#tt').tree('getChecked');
	var lastLsit;
	// console.log(dlist);
	if (dlist.length > 0) {
		for (var i = 0; i < dlist.length; i++) {
			var ifSchem = dlist[i].attributes.ifSchem;
			// console.log(ifSchem);
			if (ifSchem == "Y") {
				dlist.splice(i, 1);// 删除
			}
		}
		// console.log(dlist);
		var tablejson = JSON.stringify(dlist);
		// console.log(tablejson);
		var data = {};
		Peony.progress();
		if (databasetype != "2") {// 关系型
			data.tablejson = tablejson;
			$.ajax({
				type : "post",
				dataType : 'json',
				data : data,
				url : "tbMdTable/saveDataListNew.action",
				success : function(msg) {
					Peony.closeProgress();
					$.messager.alert('提示', msg.info, 'info');
					$('#metaDataAdmin').window('close');
					// 刷新右侧数据信息
//					var surl = "tbMdTable/tableList.action?connectionId=" + dlist[0].id;
//					showdataGrid(surl);
					$("#search_connectionId").val(dlist[0].id);
					sqlWhere();
				}
			});
		} else {// 文本型
			tablejson = encodeURI(tablejson);
			tablejson = encodeURI(tablejson);
			$.ajax({
				type : "get",
				dataType : 'json',
				url : "tbMdTable/saveDataListTextNew.action?tablejson=" + tablejson,
				success : function(msg) {
					Peony.closeProgress();
					$.messager.alert('提示', msg.info, 'info');
					$('#metaDataAdmin').window('close');
					// 刷新右侧数据信息
//					var surl = "tbMdTable/tableList.action?connectionId=" + dlist[0].connectionId;
//					showdataGrid(surl);
					$("#search_connectionId").val(dlist[0].connectionId);
					sqlWhere();
				}
			});
		}
	} else {
		$.messager.alert('提示', '请选择待导入表信息.', 'warning');
	}

}
// 同步表信息
$('#reloadTable').click(function() {
	var row = $('#data-list').datagrid('getChecked');
	var forconnectionId = $("#forconnectionId").val();
	// console.log(forconnectionId);
	if (row == null || row.length <= 0) {
		$.messager.alert('提示', "请选择待同步表信息", 'warning');
		return false;
	} else {
		var data = {};
		var tableIds = [], tableNames = [], schemNames = [], mdTypes = [], tableDescs = [], tableCats = [];
		$.each(row, function(i, record) {
			tableIds.push(record["tableId"]);
			tableNames.push(record["tableName"]);
			schemNames.push(record["schemName"]);
			mdTypes.push(record["mdType"]);
			tableDescs.push(record["tableDesc"]);
			tableCats.push(record["tableCat"]);
		});
		data.connectionId = row[0]["connectionId"];
		data.tableIds = tableIds;
		data.tableNames = tableNames;
		data.schemNames = schemNames;
		data.mdTypes = mdTypes;
		data.tableDescs = tableDescs;
		data.tableCats = tableCats;
		// console.log(data);
		var databasetype = $("#forDatabasetype").val();
		Peony.progress();
		if (databasetype != "2") {// 关系型
			$.ajax({
				type : "post",
				dataType : 'json',
				traditional : true,
				url : "tbMdTable/refreshDataList.action",
				data : data,
				success : function(data) {
					Peony.closeProgress();
					$.messager.alert('提示', data.info, 'info');
					// 刷新选中行数据
//					var surl = "tbMdTable/tableList.action?connectionId=" + forconnectionId;
//					showdataGrid(surl);
					$("#search_connectionId").val(forconnectionId);
					sqlWhere();
				}
			});
		} else {
			$.ajax({
				type : "post",
				dataType : 'json',
				traditional : true,
				url : "tbMdTable/refreshDataListTxt.action",
				data : data,
				success : function(data) {
					Peony.closeProgress();
					$.messager.alert('提示', data.info, 'info');
					// 刷新选中行数据
//					var surl = "tbMdTable/tableList.action?connectionId=" + forconnectionId;
//					showdataGrid(surl);
					$("#search_connectionId").val(forconnectionId);
					sqlWhere();
				}
			});
		}
	}
});

/*
 * 更新记录数
 */
$('#updateRows').click(
		function() {
			var row = $('#data-list').datagrid('getChecked');
			var forconnectionId = $("#forconnectionId").val();
			if (row == null || row.length <= 0) {
				$.messager.alert('提示', "请选择待更新记录表信息", 'warning');
				return false;
			} else {
				var data = {};
				var tableIds = [], tableNames = [], schemNames = [];
				$.each(row, function(i, record) {
					tableIds.push(record["tableId"]);
					tableNames.push(record["tableName"]);
					schemNames.push(record["schemName"]);
				});
				data.connectionId = row[0]["connectionId"];
				data.tableIds = tableIds;
				data.tableNames = tableNames;
				data.schemNames = schemNames;
				// console.log(data);
				Peony.progress("请稍候", "正在更新记录数...&nbsp;&nbsp;&nbsp;&nbsp;"
						+ "<a href='javascript:cancelUpdateRows();'>取消更新</a>");
				$.ajax({
					type : "post",
					dataType : 'json',
					traditional : true,
					data : data,
					url : "tbMdTable/updateRows.action",
					success : function(data) {
						Peony.closeProgress();
						$.messager.alert('提示', data.info, 'info');
						// 刷新选中行数据
//						var surl = "tbMdTable/tableList.action?connectionId=" + forconnectionId;
//						showdataGrid(surl);
						$("#search_connectionId").val(forconnectionId);
						sqlWhere();
					}
				});
			}
		});

function cancelUpdateRows() {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : "tbMdTable/cancelUpdateRows.action",
		success : function(data) {
			Peony.closeProgress();
			// if (data.error == null) {
			// $.messager.alert('提示', '已取消更新记录数！', 'info');
			// } else {
			// $.messager.alert('提示', data.error, 'error');
			// }
		}
	});
}

// 查询元数据表信息--表名称
function doSearch(value) {
	var connectionId = $("#forconnectionId").val();
	var forconnectionTypeName = $("#forconnectionTypeName").val();
	value = encodeURI(value);
	value = encodeURI(value);
	var databasetype = $("#forDatabasetype").val();
	var schemName = "";
	// console.log("forconnectionTypeName--------"+forconnectionTypeName);
	if (forconnectionTypeName.trim() == 'MSSQLSERVER' || forconnectionTypeName.trim() == 'ORACLE') {
		// 获取tree所有节点
		// var nodes =$('#tt').tree('getChildren');
		// // console.log(nodes);
		// if(nodes != null && nodes.length > 0){
		// for(var i=0;i<nodes.length;i++){
		// // console.log(nodes[i].state);
		// if( nodes[i].state== 'closed'){//非表信息
		// if(i==0){
		// schemName=nodes[i].text;
		// }else{
		// schemName=schemName+","+nodes[i].text;
		// }
		// }else{
		// continue;
		// }
		// }
		// }
		schemName = $("#forschemNameStr").val();
	}
	// console.log("schemName--------"+schemName);
	Peony.progress();
	if (databasetype != "2") {// 关系型
		$.ajax({
			type : "get",
			dataType : 'json',
			url : "dbConnection/dataList4.action?id=" + connectionId + "&schemName=" + schemName + "&tName=" + value,
			success : function(data) {
				// console.log(data);
				Peony.closeProgress();
				$('#tt').tree('loadData', data);
			}
		});
	} else {
		var filePath = $("#forfilePath").val();
		var fileExtName = $("#forfileExtName").val();
		$.ajax({
			type : "get",
			dataType : 'json',
			url : "dbConnection/dataListTxt.action?cid=" + connectionId + "&filePath=" + filePath + "&fileExtName="
					+ fileExtName + "&tName=" + value,
			success : function(data) {
				Peony.closeProgress();
				$('#tt').tree('loadData', data);
			}
		});
	}
}

// 新版页面修改 -- end----------------

// ----------页面上侧按钮实现 20170329 start---------------
// 编辑
$('#editable').click(function() {
	// 获取选中行
	var node = $('#data-list').datagrid('getChecked');
	if (node.length == 0) {
		$.messager.alert('警告', '未选择记录.', 'warning');
	} else if (node.length > 1) {
		$.messager.alert('警告', '只能选择一条待编辑任务.', 'warning');
	} else {
		editTable(node[0].connectionId, node[0].tableId, node[0].topString, node[0].databasetype);
	}
});
// 删除
$('#deleteTable').click(function() {
	// deleteTable(\''+row.connectionId+'\',\''+row.tableId+'\')
	// 获取选中行
	var nodes = $('#data-list').datagrid('getChecked');
	// alert(nodes[0].connectionId);
	if (nodes.length == 0) {
		$.messager.alert('警告', '请选择待删除记录.', 'warning');
	} else {
		$.messager.confirm('确认提示', '您确定要删除表信息吗？', function(r) {
			var arr = [];
			$.each(nodes, function(i, node) {
				arr.push('id=' + node["tableId"]);
			});
			var data = arr.join("&");
			if (r) {
				$.ajax({
					type : "post",
					dataType : 'json',
					url : "tbMdTable/delete.action?id=" + data,
					data : data,
					success : function(msg) {
//						var surl = "tbMdTable/tableList.action?connectionId=" + nodes[0].connectionId;
//						showdataGrid(surl);
						$("#search_connectionId").val(nodes[0].connectionId);
						sqlWhere();
					}
				});
			}
		});
	}
});
// ----------页面上侧按钮实现 end---------------
function importData() {
	alert('点击编辑db');
}
// 加载数据连接列表信息
function showList() {
	var data = {};
	$.ajax('dbConnection/dataList2.action', {
		type : 'post',
		dataType : 'json',
		data : data,
		success : function(data) {
			$("#groupresource > li").each(function() {
				$(this).remove();
			});
			for (var i = 0; i < data.length; i++) {
				var resorceInfo = '<li connectionId="' + data[i].connectionId + '" iconName="' + data[i].iconName
						+ '" connectionTypeName="' + data[i].connectionTypeName + ' " connectionName="'
						+ data[i].connectionName + '"' + ' " databasetype="' + data[i].databasetype + '"'
						+ ' " filePath="' + data[i].filePath + '"' + ' " fileExtName="' + data[i].fileExtName + '"'
						+ ' " conSeparator="' + data[i].conSeparator + '"'
						+ ' class="list-group-item clearfix"><i class="glyphicon pull-left"><img src="images/db/'
						+ data[i].iconName + '.jpg" class="fwq_img"></i>'
						+ '<div class="pull-left"><h5 class="text-nowrap">' + data[i].connectionName + '</h5>'
						+ '<p class="text-nowrap">' + data[i].connectionTypeName + '</p></div>'
						+ '<div class="pull-right"><i connectionId="' + data[i].connectionId
						+ '" class="glyphicon glyphicon-edit"></i>' + '<i connectionId="' + data[i].connectionId
						+ '" class="glyphicon glyphicon-trash"></i></div></li>';
				$("#groupresource").append(resorceInfo);
			}
			// 点击编辑数据连接信息
			$('#dataresource ul>li>div>i.glyphicon-edit').bind('click', editDBInfo);
			// 点击删除数据连接信息
			$('#dataresource ul>li>div>i.glyphicon-trash').bind('click', delDBInfo);
			// 点击查询表信息
			$('#dataresource ul>li').bind('click', load_dataresource);
			// 左侧加载该连接的名称信息
			$("#forTableName").text(data[0].connectionName + " / <small>" + data[0].connectionTypeName + "</small>");
			// 加载左侧该连接下表信息，默认加载第一个
			//改为初次加载第一个，其他加载之前选中的信息
			var forSearchId=$("#forSearchId").val();
			var lastId;//当前选中的connectionId
			var index;//待选中li个数
			if(forSearchId == '' || forSearchId == 'undefined'){
				lastId=data[0].connectionId;
			}else{
				lastId=forSearchId;
			}
			var connections =document.getElementsByTagName('li');
			for(var i=0;i<connections.length;i++){
//				console.log($(LIs[i]).attr('connectionId'));
				if($(connections[i]).attr('connectionId')==lastId){
					index=i;
					
				}
			}
			showdataGrid(condition);
//			var surl = "tbMdTable/tableList.action?connectionId=" + lastId;
//			showdataGrid(surl);
			$("#search_connectionId").val(lastId);
			showdataGrid(condition);
			$('#groupresource>li').eq(index).trigger('click');// 添加背景色
//			$("#groupresource").find("li").addClass("c-li-active") 
			$("#forconnectionId").val(lastId);
			$("#forDatabasetype").val(data[index].databasetype);
			// $("#forconnectionTypeName").val(data[0].connectionTypeName);
			if (data[index].databasetype == "2") {
				$("#forfilePath").val(data[index].filePath);
				$("#forfileExtName").val(data[index].fileExtName);
				$("#forconSeparator").val(data[index].conSeparator);
			}
		},
		error : function() {
			$.messager.alert('提示', '执行失败,请联系系统管理员.', 'error');
		}
	});
}

// 保存连接信息
function saveDBInfo() {
	if ($("#editDBFormb").form('validate')) {// 启用校验
		var jdbcStr=$("#jdbcString").val();
		if(jdbcStr == '' || jdbcStr == 'undefined'){
			JointJDBC();
		}
		// 不等于隐藏样式提交序列
		var data = $("#editDBFormb input").not(".hideCss").serialize();
		// var data=formToString($("#editDBFormb").get(0))
		//编辑时
//		$("#forSearchId").val($("#forconnectionId").val());
		$.ajax({
			type : "POST",
			url : "dbConnection/saveNew.action",
			data : data,
			success : function(msg) {
				//编辑或新增时保存，数据连接回显时使用
				$("#forSearchId").val(msg.connectionId);
				$.messager.alert('提示', "保存成功", 'info');
				showList();
				$("#fromResultdb").trigger("click");
				$('#dbAdmin').window('close');
			}
		});
	}
}

//URL为空时拼接获取信息
function JointJDBC(){
	var befJDBC = $("#beforeJDBC").val();// 始终保存默认的信息
	// 获取当前的三个参数信息
	var server = $("#server").val();
	var port = $("#port").val();
	var database = $("#database").val();
	befJDBC = befJDBC == '' ? befJDBC : befJDBC.replace('{host}', server);
	if (befJDBC != '') {
		if (befJDBC.indexOf("[:{port}]") != -1) {// 存在
			befJDBC = befJDBC.replace('[:{port}]', ":" + port);
		} else if (befJDBC.indexOf("{port}") != -1) {
			befJDBC = befJDBC.replace('{port}', port);
		}
	}
	if (befJDBC != '') {
		if (befJDBC.indexOf("[{database}]") != -1) {// 存在
			befJDBC = befJDBC.replace('[{database}]', database);
		} else if (befJDBC.indexOf("{database}") != -1) {// 如ORACLE
			befJDBC = befJDBC.replace('{database}', database);
		}
	}
	$("#jdbcString").val(befJDBC);
	$("#jdbcString2").val(befJDBC);
}
// 添加背景色
function load_dataresource() {
	var _this = $(this);
	if (!_this.hasClass('c-li-active')) {
		searchTableList(_this);
	}
	if (!_this.hasClass('c-li-active')) {
		_this.addClass('c-li-active');
		_this.siblings('li').removeClass('c-li-active');
	}

}
// 是否自定义JDBC串事件
function editURL() {
	var rep = $('#jdbcFlag').is(':checked');// 是否选中
	if (rep) {
		$('#jdbcString').attr("disabled", false);
	} else {
		$('#jdbcString').attr("disabled", "disabled");
	}
}
// 修改JDBC串
function changJDBC() {
	var jbnc = $("#jdbcString").val();
	$("#jdbcString2").val(jbnc);
}
// 编辑连接信息
function editDBInfo() {
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	$('#dbAdmin').window('open');
	$("#fromResultdb").trigger("click");
	var connectionId = $(this).attr('connectionId');
	// var connectionId=$(_this).attr('driveId');
	$.ajax({
		type : "get",
		dataType : 'json',
		url : "dbConnection/getIdNew.action?connectionId=" + connectionId,
		success : function(data) {
			$('#forPort').val(data.port);
			loadDataInfo(data);
			initSelectEvents1();// 加载下拉框信息
			$("#editDBFormb").form('myLoad', data);
			editURL();
			$("#jdbcString").val(data.jdbcString);
			$("#jdbcString2").val(data.jdbcString);
			$("#beforeJDBC").val(data.beforeJDBC);
			changeDBTypeLoad(data.connectionType, data.fileExtName);// 数据库类型触发页面显示内容
			$("#fileExtName").val(data.fileExtName);
			if (data.maxConnectCount == null) {
				if(data.databasetype != '2'){
					$("#mixConnect").val('100');
				}else{
					$("#mixConnect2").val('100');
				}
				
			} else {
				if(data.databasetype != '2'){
					$("#mixConnect").val(data.maxConnectCount);
				}else{
					$("#mixConnect2").val(data.maxConnectCount);
				}
				
			}
			$('#forRModuleName').val('DB');
			$('#forRTableName').val('TB_DB_CONNECTION');
		}
	});
}

// 删除连接信息
function delDBInfo() {
	var connectionId = $(this).attr('connectionId');
	$.messager.confirm('确认', '您确定要删除信息吗？', function(r) {
		if (r) {
			$.ajax({
				type : "get",
				dataType : 'json',
				url : "dbConnection/deleteNew.action?connectionId=" + connectionId,
				success : function(msg) {
					$.messager.alert('提示', msg.info, 'info');
					showList();
				}
			});
		}
	});
}
// 连接测试
function connectDBInfo() {
	var jdbcStr=$("#jdbcString").val();
	if(jdbcStr == '' || jdbcStr == 'undefined'){
		JointJDBC();
	}
	var databasetype = $('#databasetype').val();
	category = $('#category').val();
	Peony.progress();
	if (databasetype != 2) {// 关系型数据库
		$.ajax({
			type : "POST",
			url : "dbConnection/connectInfoNew.action",
			data : formToString($("#editDBFormb").get(0)),
			success : function(data) {
				Peony.closeProgress();
				$.messager.alert('提示', data.info, 'info');
			},
			error : function() {
				Peony.closeProgress();
				$.messager.alert('提示', '连接失败.', 'error');
			}
		});
	} else {
		$.ajax({
			type : "POST",
			url : "dbConnection/connectTextNew.action",
			data : formToString($("#editDBFormb").get(0)),
			success : function(data) {
				Peony.closeProgress();
				$.messager.alert('提示', data.info, 'info');
			},
			error : function() {
				Peony.closeProgress();
				$.messager.alert('提示', '连接失败.', 'error');
			}
		});
	}
}
// 新增连接加载数据
function initDataInfo() {
	// var data={};
	// //数据连接类型
	// $.ajax('driverInfo/checkboxList.action', {
	// type : 'post',
	// dataType : 'json',
	// data : data,
	// success : function(data) {
	// $("#connectionType > option").each(function(){
	// $(this).remove();
	// });
	// for(var i = 0; i < data.length; i++){
	// // var option=' <option value
	// ="'+data[i].driveId+'">'+data[i].driveName+'</option>';
	// // console.log(option);
	// $("#connectionType").append($("<option
	// value="+data[i].driveId+">"+data[i].driveName+"</option>"));
	// }
	// $("#jdbcString").val(data[0].urlInfo);
	// $("#jdbcString2").val(data[0].urlInfo);
	// }
	// });
	$("#connectionType").combobox({
		valueField : 'driveId',
		textField : 'driveName',
		editable : false,// 不可编辑
		url : 'driverInfo/checkboxList.action',
		onChange : function(newValue, oldValue) {
			changeDBType(newValue);
		},
		onLoadSuccess : onLoadSuccess
	});
}
// 编辑连接加载数据
function loadDataInfo(dbInfo) {
	$("#connectionType").combobox({
		valueField : 'driveId',
		textField : 'driveName',
		editable : false,// 不可编辑
		url : 'driverInfo/checkboxList.action',
		onChange : function(newValue, oldValue) {
			changeDBType(newValue);
		}
	});
}
// 修改数据连接类型带来的jdbc串等信息改变
function changeDBTypeLoad(idval, fileExtName) {
	$.ajax('driverInfo/getId.action?driveId=' + idval, {
		type : 'get',
		dataType : 'json',
		success : function(data) {
			$("#beforeJDBC").val(data.urlInfo);
			$("#driverInfo").val(data.className);
			// 新增，查询数据库类型 0301
			$("#databasetype").val(data.databasetype);
			$("#category").val(data.category);// 驱动类型
			if (data.databasetype != 2) {// 关系型数据库
				$("#forDB").attr("style", "display:block;");// 显示
				$("#forTEXT").attr("style", "display:none;");
				$("#forDB input").removeClass('hideCss');
				$("#forTEXT input").addClass('hideCss');
				// $('#m-btn-testconnect').removeAttr("disabled");
				$('#server,#port').validatebox({//#database,#user,#password允许非空
					required : true,
				});
				$('#fileExtName,#filePath').validatebox({
					required : false,
				});

				handleOfSAP(data);
				handleOfOLAP(data);
				var forPort=$('#forPort').val();
				if(forPort == ''){
					if(data.post != 0){//驱动链接数据库中保存的端口号信息
						$("#port").val(data.post);
					}else{
						$("#port").val("");
					}
				}
			} else {// 文本型
				$("#forDB").attr("style", "display:none;");// 隐藏
				$("#forTEXT").attr("style", "display:block;");
				$("#forDB input").addClass('hideCss');
				$("#forTEXT input").removeClass('hideCss');
				// 按钮设置
				// $('#m-btn-testconnect').attr('disabled',"true");
				// 非空校验设置
				$('#server,#port').validatebox({//,#user,#password
					required : false,
				});
				$("#ifData").removeAttr("disabled");
				if (data.category == '9') {// 只有TXT格式时才会显示内容分隔符
					$("#conInfo").show();
					$('#fileExtName').val(fileExtName);// 扩展名
				} else {
					$("#conInfo").hide();
					if (data.category == '8') {// csv
						$("#conSeparator").combobox('setValue', ",");
						$('#fileExtName').val(fileExtName);// 扩展名
					} else if (data.category == '10') {
						$('#conSeparator').combobox('setValue', "");
						$('#fileExtName').val(fileExtName);// 扩展名
						$("#ifData").attr("disabled", "disabled"); // xls时该项不编辑
						// |
						// lee/17.4.25
					}
				}
				// $('#fileCharset').combobox({
				// required : true,
				// });
			}
			$(".validatebox-tip").remove();
			$(".validatebox-invalid").removeClass("validatebox-invalid");
			changeJDBC();
		}
	});
}
// 修改数据连接类型带来的jdbc串等信息改变
function changeDBType(idval) {
	// var idval=$("#connectionType").val();
	$.ajax('driverInfo/getId.action?driveId=' + idval, {
		type : 'get',
		dataType : 'json',
		success : function(data) {
			// $("#jdbcString").val(data.urlInfo);
			$("#beforeJDBC").val(data.urlInfo);
			// $("#jdbcString2").val(data.urlInfo);
			$("#driverInfo").val(data.className);
			// 新增，查询数据库类型 0301
			$("#databasetype").val(data.databasetype);
			$("#category").val(data.category);// 驱动类型
			if (data.databasetype != 2) {// 关系型数据库
				$("#forDB").attr("style", "display:block;");// 显示
				$("#forTEXT").attr("style", "display:none;");
				$("#forDB input").removeClass('hideCss');
				$("#forTEXT input").addClass('hideCss');
				// $('#m-btn-testconnect').removeAttr("disabled");
				$('#server,#port').validatebox({//,#user,#password
					required : true,
				});
				$('#fileExtName,#filePath').validatebox({
					required : false,
				});

				handleOfSAP(data);
				handleOfOLAP(data);
				if(data.post != 0){
					$("#port").val(data.post);
				}else{
					$("#port").val("");
				}
				// $('#fileCharset,#conSeparator').combobox({
				// required : false,
				// });
			} else {// 文本型
				$("#forDB").attr("style", "display:none;");// 隐藏
				$("#forTEXT").attr("style", "display:block;");
				$("#forDB input").addClass('hideCss');
				$("#forTEXT input").removeClass('hideCss');
				// 按钮设置
				// $('#m-btn-testconnect').attr('disabled',"true");
				// 非空校验设置
				$('#server,#port').validatebox({//,#user,#password
					required : false,
				});
				// $('#fileExtName,#filePath').validatebox({
				// required : true,
				// });
				$("#ifData").removeAttr("disabled");
				if (data.category == '9') {// 只有TXT格式时才会显示内容分隔符
					// $('#conSeparator').combobox({
					// required : true,
					// });
					$("#conInfo").show();
					$('#fileExtName').val(".txt");// 扩展名
					$("#conSeparator").combobox('setValue', ",");
				} else {
					$("#conInfo").hide();
					// $("#conSeparator").combobox({
					// required:false
					// });
					if (data.category == '8') {// csv
						$("#conSeparator").combobox('setValue', ",");
						$('#fileExtName').val(".csv");// 扩展名
					} else if (data.category == '10') {
						$('#conSeparator').combobox('setValue', "");
						$('#fileExtName').val(".xlsx");// 扩展名
						$("#ifData").attr("disabled", "disabled");
					}
				}
				// $('#fileCharset').combobox({
				// required : true,
				// });
			}
			$(".validatebox-tip").remove();
			$(".validatebox-invalid").removeClass("validatebox-invalid");
			changeJDBC();
		}
	});
}

/**
 * sap方式表单处理
 * 
 * @param data
 */
function handleOfSAP(data) {
	if (data.category === '14') {
		$("#lable_port_name").text("客户端编号");
		$("#lable_db_name").text("系统编号");
		$(".normal").hide();
	} else {
		$("#lable_port_name").text("端口号");
		$("#lable_db_name").text("数据库/模式");
		$(".normal").show();
	}
}

/**
 * olap方式表单处理
 * 
 * @param data
 */
function handleOfOLAP(data) {
	var lableDBName;
	if ($("#category").val() === '15') { // 为 OLAP 时
		$('.checkbox').hide();
		var $jdbcString = $('#jdbcString');
		$jdbcString.attr("disabled", false);
		if ($jdbcString.val() === '') {
			$jdbcString.val('jdbc:xmla:Server=');
		}
		$('#server,#port').validatebox({//,#user,#password
			required : false,
		});
		$jdbcString.validatebox({
			required : true,
		});
		
		lableDBName = "目录";
	} else {
		$('.checkbox').show();
		editURL();

		if (data.category === '14') {
			lableDBName = "系统编号";
		} else {
			lableDBName = "数据库/模式";
		}
	}
	$("#lable_db_name").text(lableDBName);
}

// 文本资源
function initSelectEvents1() {
	// 文本字符集
	$("#fileCharset").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=FILE_CHARSET',
		editable : true,
		valueField : 'dictdataName',
		textField : 'dictdataName',
		onLoadSuccess : onLoadSuccess
	});
	// 内容分隔符
	$("#conSeparator").combobox({
		url : 'sysDictionaryData/getValues.action?dictValue=CON_SEPARATOR',
		editable : true,
		valueField : 'dictdataName',
		textField : 'dictdataName',
		onLoadSuccess : onLoadSuccess
	});
}
// 数据连接是否新增判断
function onLoadSuccess() {
	var id = $("#connectionId").val();
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
function changeJDBC() {
	var category = $("#category").val();
	if (category === '14' || category === '15') { // SAP 和 OLAP 时
		return;
	}
	// 获取当前JDBC状态是否可以自定义
	var befJDBC = $("#beforeJDBC").val();// 始终保存默认的信息
	// console.log("befJDBC-----"+befJDBC);
	// 获取当前的三个参数信息
	var server = $("#server").val();
	var port = $("#port").val();
	var database = $("#database").val();
	var rep = $('#jdbcFlag').is(':checked');// 是否选中
	// console.log("--------"+server);

	if (!rep) { // 没有选中，可以编辑
		befJDBC = befJDBC == '' ? befJDBC : befJDBC.replace('{host}', server);
		// befJDBC=befJDBC == '' ?
		// befJDBC:befJDBC.replace('[:{port}]',":"+port);
		if (befJDBC != '') {
			if (befJDBC.indexOf("[:{port}]") != -1) {// 存在
				befJDBC = befJDBC.replace('[:{port}]', ":" + port);
			} else if (befJDBC.indexOf("{port}") != -1) {
				befJDBC = befJDBC.replace('{port}', port);
			}
		}
		if (befJDBC != '') {
			if (befJDBC.indexOf("[{database}]") != -1) {// 存在
				befJDBC = befJDBC.replace('[{database}]', database);
			} else if (befJDBC.indexOf("{database}") != -1) {// 如ORACLE
				befJDBC = befJDBC.replace('{database}', database);
			}
		}
		$("#jdbcString").val(befJDBC);
		$("#jdbcString2").val(befJDBC);
	}
}

// 新建表加载数据
function loadTableInfo() {
	var data = {};
	// 数据连接
	$.ajax('dbConnection/dataList2.action', {
		type : 'post',
		dataType : 'json',
		data : data,
		success : function(data) {
			$("#connectionId2 > option").each(function() {
				$(this).remove();
			});
			for (var i = 0; i < data.length; i++) {
				$("#connectionId2").append(
						$("<option value=" + data[i].connectionId + ">" + data[i].connectionName + "</option>"));
			}
		},
		onLoadSuccess : function() {
			var fdata = $('#connectionType').combobox('getData');
			if (fdata.length > 0) {
				// console.log("data.connectionType==="+data.connectionType);
				$('#connectionType').combobox('select', data.connectionType);
			}
		}
	});
	// 对象类型
	$.ajax('sysDictionaryData/getValues.action?dictValue=MD_TYPE', {
		type : 'post',
		dataType : 'json',
		data : data,
		success : function(data) {
			$("#mdType > option").each(function() {
				$(this).remove();
			});
			for (var i = 0; i < data.length; i++) {
				$("#mdType").append(
						$("<option value=" + data[i].dictdataValue + ">" + data[i].dictdataName + "</option>"));
			}
		}
	});

}

// ---------------------------------------驱动信息----------------
// 加载驱动列表信息
function showDriveList() {
	var data = {};
	$.ajax('driverInfo/dataList.action', {
		type : 'post',
		dataType : 'json',
		data : data,
		success : function(data) {
			// 清除原有信息
			$("#groupdrive > li").each(function() {
				$(this).remove();
			});
			for (var i = 0; i < data.rows.length; i++) {
				// console.log(data.rows[i].driveId+"------"+data.rows[i].driveName);
				var style = data.rows[i].statetype;
				// console.log("列表删除时style-----------"+style);
				var disableds = style == 1 ? 'disabled' : '';
				var driveInfo = '<li class="list-group-item clearfix" driveId="' + data.rows[i].driveId
						+ '" statetype="' + data.rows[i].statetype + '">'
						+ '<i class="glyphicon glyphicon-random pull-left"></i>' + '<h5 class="text-nowrap pull-left">'
						+ data.rows[i].driveName + '</h5>' + '<button driveId="' + data.rows[i].driveId + '" '
						+ disableds + '  class="glyphicon glyphicon-trash pull-right" ></button>  ';
				$("#groupdrive").append(driveInfo);
			}
			// 点击编辑驱动信息
			$('#driveManager ul>li').bind('click', editDriveInfo);
			// 点击删除信息
			$('#driveManager ul li button').bind('click', delDriveInfo);
			// 默认查询第一条信息
			var driveid = data.rows[0].driveId;
			DriveInfoById(driveid, "");
		},
		error : function() {
			// alert('执行失败,请联系系统管理员.');
			$.messager.alert('提示', '执行失败,请联系系统管理员.', 'error');
		}
	});

}
// 新增驱动
function forsave() {
	$('#driveAdmin').window('open');
	$("#fromResult").trigger("click");
	$("#forName").text("");
	$("#driveId").val("");
	$("#statetype").val("");
}

// 保存--驱动
function saveDriveInfo() {
	if ($("#editFormb").form('validate')) {// 启用校验
		$.ajax({
			type : "POST",
			url : "driverInfo/save.action",
			data : formToString($("#editFormb").get(0)),
			success : function(data) {
				// alert(data.info);
				$.messager.alert('提示', data.info, 'error');
				$("#fromResult").trigger("click");
				showDriveList();
			},
			error : function(data) {
				// alert('执行失败:'+data.info);
				$.messager.alert('提示', data.info, 'error');
			}
		});
	}
}

// 重置
function resetDriveInfo() {
	$("#fromResult").trigger("click");
	var driveId = $("#driveId").val();
	var style = $("#statetype").val();
	// console.log("重置时------"+driveId+"-----"+style);
	$.ajax({
		type : "get",
		dataType : 'json',
		url : "driverInfo/getId.action?driveId=" + driveId + "&stateType=" + style,
		success : function(data) {
			$("#editFormb").form('myLoad', data);
		}
	});
}
// driverManager li 点击事件--编辑
function editDriveInfo() {
	$("#fromResult").trigger("click");
	var driveId = $(this).attr('driveId');
	var style = $(this).attr('statetype');
	// if(style == '1'){
	// $('#restInfo').attr('disabled',"true");
	// $('#saveInfo').attr('disabled',"true");
	// $("#restInfo").css("color","#D1D1D1");
	// $("#saveInfo").css("color","#D1D1D1");
	// }else{
	// $('#restInfo').removeAttr("disabled");
	// $('#saveInfo').removeAttr("disabled");
	// $("#restInfo").css("color","");
	// $("#saveInfo").css("color","");
	// }
	$.ajax({
		type : "get",
		dataType : 'json',
		url : "driverInfo/getId.action?driveId=" + driveId + "&stateType=" + style,
		success : function(data) {
			$("#editFormb").form('myLoad', data);
		}
	});
}
// 编辑--传参查询方法
function DriveInfoById(id, style) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : "driverInfo/getId.action?driveId=" + id + "&stateType=" + style,
		success : function(data) {
			$("#editFormb").form('myLoad', data);
		}
	});
}

// 删除--驱动
function delDriveInfo() {
	var driveId = $(this).attr('driveId');
	$.messager.confirm('确认', '您确定要删除记录？', function(r) {
		if (r) {
			$.ajax({
				type : "get",
				dataType : 'json',
				url : "driverInfo/delete.action?driveId=" + driveId,
				// data: formToString($("#editFormb").get(0)),
				success : function(msg) {
					// alert(msg.info);
					$.messager.alert('提示', msg.info, 'info');
					showDriveList();
				}
			});
		}
	});
}

// form数据封装
function formToString(formObj) {
	var allStr = "";
	if (formObj) {
		var elementsObj = formObj.elements;
		var obj;
		if (elementsObj) {
			for (var i = 0; i < elementsObj.length; i += 1) {
				obj = elementsObj[i];
				if (obj.name != undefined && obj.name != "") {
					allStr += "&" + obj.name + "=" + encodeURIComponent(obj.value);
				}
			}
		} else {
			// alert("没有elements对象!");
			$.messager.alert('提示', "没有elements对象!", 'warning');
			return;
		}
	} else {
		// alert("form不存在!");
		$.messager.alert('提示', "form不存在!", 'warning');
		return;
	}
	return allStr;
}

// 上传信息
function importInfo() {
	var filename = $("#libraries").val();
	// console.log("filename==="+filename);
	var filetype = filename.substring(filename.length - 3, filename.length);
	if (filename == "") {
		// alert('请选择待上传文件');
		$.messager.alert('提示', '请选择待上传文件', 'info');
	} else {
		if (filetype != "jar") {
			// alert('只能选择.jar文件.');
			$.messager.alert('提示', '只能选择.jar文件.', 'warning');
		} else {
			var formData = new FormData();
			formData.append('file', $('#libraries')[0].files[0]);
			$.ajax({
				url : 'driverInfo/importJAR.action',
				type : 'POST',
				cache : false,
				data : formData,
				processData : false,
				contentType : false
			}).done(function(res) {
				if (res.info == "") {
					// alert("导入成功");
					$.messager.alert('提示', "导入成功", 'info');
					$("#address").val(filename);
				} else {
					// alert("导入失败，原因是："+res.info);
					$.messager.alert('提示', "导入失败，原因是：" + res.info, 'error');
				}
			}).fail(function(res) {
				// alert("导入失败，原因是："+res.info);
				$.messager.alert('提示', "导入失败，原因是：" + res.info, 'error');
			});
		}
	}
}

// -------------------------表信息------------------------------------------
// 加载列表信息
function searchTableList(_this) {
	// var connectionId=$(this).attr('connectionId');
	// var connectionName=$(this).attr('connectionName');
	var connectionId = $(_this).attr('connectionId');
	var connectionName = $(_this).attr('connectionName');
	var connectionTypeName = $(_this).attr('connectionTypeName');
	var databasetype = $(_this).attr('databasetype');
	var iconName = $(_this).attr('iconName');
	// console.log(connectionTypeName);
	FWQ2 = "<img src='images/db/" + iconName + ".jpg' class='fwq_img1'>"

	$("#fwq_tb").html(FWQ2)
	if (databasetype == '2') {
		$("#forfilePath").val($(_this).attr('filePath'));
		$("#forfileExtName").val($(_this).attr('fileExtName'));
		$("#forconSeparator").val($(_this).attr('conSeparator'));
	}
	$("#forTableName").html(connectionName + " / <small>" + connectionTypeName + "<small>");
	$("#forconnectionId").val(connectionId);
	$("#forDatabasetype").val(databasetype);
	$("#forconnectionTypeName").val(connectionTypeName);
//	var surl = "tbMdTable/tableList.action?connectionId=" + connectionId;
//	showdataGrid(surl);
	$("#search_connectionId").val(connectionId);
	sqlWhere();
	// 取消选择行
	$('#data-list').datagrid('clearSelections');
}

// 数据连接页面显示表信息
function showdataGrid(condition) {
	if (condition == undefined || condition == ""){
		condition = " 1=1 ";
	}
//	if (Thats == "") {
//		Thats = 20;
//	} else {
//		Thats = $(".pagination-page-list").find("option:selected").text();
//	}
	var cid = $("#search_connectionId").val();
	condition = encodeURI(condition);
	condition = encodeURI(condition);
	$('#data-list').datagrid(
			{
				title : '元数据',
				url : "tbMdTable/viewListWhere.action?condition="
					+ condition+ "&cid="+ cid,
				idField : 'tableId',
				pagination : true,// 分页
				rownumbers : true,
				singleSelect : false,
				striped : true,// 奇偶行显示不同背景色
				checkOnSelect : true,
				fitColumns : false,
				pageSize : 30,
				pageList : [ 10, 30, 50, 100 ],
				remoteSort : false,
				columns : [ [
						{
							field : 'topString',
							hidden : true
						},
						{
							field : 'databasetype',
							hidden : true
						},
						{
							field : 'tableId',
							checkbox : true
						},
						{
							field : 'connectionId',
							hidden : true
						},
						{
							field : 'tableName',
							title : '表名',
							width : '20%',
							sortable : true
						},
						{
							field : 'mdType',
							title : '表类型',
							width : '10%',
							sortable : true,
							formatter : function(value, row, index) {
								if (row.mdType == 'T')
									return '表';
								else if (row.mdType == 'V')
									return '视图';
								else
									return mdType;
							}
						},
						{
							field : 'tableCat',
							title : '目录',
							width : '15%',
							sortable : true
						},
						{
							field : 'schemName',
							title : '模式',
							width : '10%',
							sortable : true
						},
						{
							field : 'tableDesc',
							title : '备注',
							width : '20%',
							sortable : true
						},
						{
							field : 'recordCount',
							title : '行数',
							width : '10%',
							sortable : true
						},
						{
							field : '_operate',
							title : '操作',
							width : '13%',
							formatter : function(value, row, index) {
								// return '<a href="javascript:void(0)"
								// onclick="editTable(\''+row.connectionId+'\',\''+row.tableId+'\')"><span
								// style="color:
								// green;">编辑</span></a>&nbsp;&nbsp;&nbsp;'+
								// '<a href="javascript:void(0)"
								// onclick="deleteTable(\''+row.connectionId+'\',\''+row.tableId+'\')"><span
								// style="color: green;">删除</span></a>';
								return '<button id="sss-btn" class="btn btn-xs ibtn" onclick="editTable(\''
										+ row.connectionId + '\',\'' + row.tableId + '\',\'' + row.tableName + '\',\''
										+ row.topString + '\',\'' + row.databasetype + '\',\'' + row.schemName
										+ '\')"><i class="glyphicon glyphicon-search"></i></button>&nbsp;&nbsp;&nbsp;'
										+ '<button class="btn btn-xs ibtn" onclick="deleteTable(\'' + row.connectionId
										+ '\',\'' + row.tableId
										+ '\')"><i class="glyphicon glyphicon-remove"></i></button>';
							}
						} ] ]
			})
}
// function test() {
// showColumnList("");
// }
function test2() {
	showPreviewList("");
}
// 表信息数据预览
function searchData() {
	Peony.progress();
	var datanulldiv = $('#datanulldiv');
	datanulldiv.empty();// 清除以前提醒数据
	datanulldiv.show();
	var searchConnectionId = $("#searchConnectionId").val();
	var tableName = $("#searchtableName").val();
	var topString = $("#searchTopString").val();
	var topNum = $("#topNum").val();
	var databasetype = $("#searchdatabasetype").val();
	var tableId = $("#tableId3").val();
	var schemName = $("#searchSchemName").val();
	var _data = {};
	_data.connectionId = searchConnectionId;
	_data.tableName = tableName;
	_data.topString = topString;
	_data.topNum = topNum;
	_data.databasetype = databasetype;
	_data.tableId = tableId;
	_data.schemName = schemName;
	$("#fordatagrid").show();
	// showPreviewList("");
	$.ajax({
		type : "post",
		dataType : 'json',
		url : "tbMdTable/searchData.action",
		data : _data,
		success : function(data) {
			Peony.closeProgress();
			var array = [];
			var columns = [];
			// var sum = 0;
			// var num = 0;
			if (data.info == '0') {
				$(data.metaList).each(function() {
					array.push({
						field : '',
						title : '',
						sortable : '',
						width : ''
					});
					// sum++;
				});
				columns.push(array);
				// num = (100 / sum).toFixed(0) + "%";// N为保留几位小数
				$(data.metaList).each(function(index, el) {
					columns[0][index]['field'] = el;
					columns[0][index]['title'] = el;
					columns[0][index]['width'] = 100;
					columns[0][index]['sortable'] = true;
				});
				var url = "tbMdTable/preview.action";
				showPreviewList(columns, url, _data);
			} else {
				$("#fordatagrid").hide();// 清除表格中以前查询的数据
				var remindmanager = data.error;
				datanulldiv.show();
				datanulldiv.empty();
				datanulldiv.append(remindmanager);
			}
		}
	});
}
// 编辑表信息
function editTable(cid, tid, tname, topString, databasetype, schemName) {
	$('#Modal-tableEdit').window('open');
	$('#tabs').tabs({
		height : 330,
		shadow : false
	});
	$("#searchConnectionId").val(cid);
	$("#searchtableName").val(tname);
	$("#searchTopString").val(topString);
	$("#searchdatabasetype").val(databasetype);
	$("#searchSchemName").val(schemName);
	var data = {};
	data.connectionId = cid;
	data.tableId = tid;
	data.topString = topString;
	data.databasetype = databasetype;
	data.schemName = schemName;
	var array = [];
	var columns = [];
	var sum = 0;
	var num = 0;
	Peony.progress();

	$("#checkId").val(tid);
	$("#topNum").val("100");// 默认100

	// showColumnList("");
	// $('#columnList').datagrid('loadData', {
	// total : 0,
	// rows : []
	// });
	// 预览信息处理，暂时不需要显示 wfy 20170510
	$("#fordatagrid").hide();
	// showPreviewList("");
	$('#datanulldiv').html("")
	// $('#previewList').datagrid('loadData', {
	// total : 0,
	// rows : []
	// });
	// $('#previewList').datagrid({
	// columns : [ [] ],
	// rownumbers : false,
	// pagination : false
	// });
	$.ajax({
		type : "get",
		dataType : 'json',
		url : "tbMdTable/searchAllInfo.action",
		data : data,
		success : function(data) {
			// showDriveList();
			Peony.closeProgress();
			// 填充表数据
			$("#tableId3").val(data.tagTable.tableId);
			$("#connectionId3").val(data.tagTable.connectionId);
			$("#mdType3").val(data.tagTable.mdType);
			$("#connectionIdName").val(data.tagTable.connectionIdName);
			$("#mdTypeName").val(data.tagTable.mdTypeName);
			$("#tableName3").val(data.tagTable.tableName);
			$("#schemName3").val(data.tagTable.schemName);
			$("#tableCat3").val(data.tagTable.tableCat);
			$("#tableDesc3").val(data.tagTable.tableDesc);
			// 列信息
			// $('#columnList').datagrid('loadData', { total: 0, rows: [] });
			showColumnList('', data.columnList)
			// $('#columnList').datagrid('loadData', data.columnList);
			forColumnList = data.columnList
		}
	});
}

// 删除表信息
function deleteTable(cid, tid) {
	$.messager.confirm('确认提示', '您确定要删除信息吗？', function(r) {
		if (r) {
			$.ajax({
				type : "get",
				dataType : 'json',
				url : "tbMdTable/delete.action?id=" + tid,
				success : function(data) {
//					var surl = "tbMdTable/tableList.action?connectionId=" + cid;
//					showdataGrid(surl);
					$("#search_connectionId").val(cid);
					sqlWhere();
				}
			});
		}
	});
}

// 展示列基本信息
function showColumnList(url, datas) {
	$('#columnList').datagrid({
		url : url,
		rownumbers : true,
		singleSelect : false,
		pagination : false,// 分页
		remoteSort : false,
		striped : true,// 奇偶行显示不同背景色
		checkOnSelect : true,
		fitColumns : false,
		fixed : true,
		idField : 'columnId',
		columns : [ [ {
			field : 'tableId',
			hidden : true
		}, {
			field : 'columnId',
			hidden : true
		}, {
			field : 'columnName',
			title : '列名',
			width : 150,
			sortable : false
		}, {
			field : 'columnType',
			title : '类型',
			width : 100,
			sortable : false
		}, {
			field : 'columnLength',
			title : '长度',
			width : 40,
			sortable : false
		}, {
			field : 'columnPrecision',
			title : '精度',
			width : 40,
			sortable : false
		}, {
			field : 'nullFlag',
			title : '为空',
			width : 40,
			sortable : false
		}, {
			field : 'autoincrementFlag',
			title : '自增',
			width : 40,
			sortable : false
		}, {
			field : 'primaryFlag',
			title : '主键',
			width : 40,
			sortable : false
		}, {
			field : 'foreignKeyFlag',
			title : '外键',
			width : 40,
			sortable : false
		}, {
			field : 'columnDefault',
			title : '默认值',
			width : 60,
			sortable : false
		}, {
			field : 'columnDesc',
			title : '描述',
			width : 100,
			sortable : false
		} ] ],
	// onLoadSuccess : function(data) {
	// $('#columnList').datagrid({
	// height : $('#tabs').height() - 80,
	// // height: $(window).height()*0.7
	// });
	//			
	// },
	})
	$('#columnList').datagrid('loadData', datas);

}

// //展示表数据信息
function showPreviewList(columns, url, params) {
	$('#previewList').datagrid({
		url : url,
		view : scrollview, // 虚拟滚动
		rownumbers : true,
		singleSelect : false,
		remoteSort : false,
		striped : true,
		pageSize : 20,
		height : $('#tabs').height() - 130,
		columns : columns,
		queryParams : params
	})
}

function showTree(url) {
	$('#tt').tree({
		url : url,
		method : 'get',
		animate : true,
		checkbox : true,
		cascadeCheck : true,// 层叠选中
		onlyLeafCheck : false,
		lines : true,// 显示虚线效果
		onBeforeExpand : function(node) {
			// console.log(JSON.stringify(node));
			// console.log("空间--"+node.attributes.schemName);
			var url = "dbConnection/dataList4.action?schemName=" + node.attributes.schemName + "&tName=";
			$("#tt").tree("options").url = url;
			return true;
		},
		onExpand : function(node) {
			var children = $("#tt").tree('getChildren', node.id);
			if (children.length <= 0) {
				row.leaf = true;
				$("#tt").tree('refresh', node.id);
			}
		},
		onClick : function(node) {
			if (!$('#tt').tree('isLeaf', node.target)) {
				var surl = "tbMdTable/tableList.action?connectionId=" + node.id;
				showTableList("");
				$('#table-list').datagrid('loadData', {
					total : 0,
					rows : []
				});
			}
		}
	// onLoadSuccess:function(node, data){
	// console.log(data[0].id);
	// showTableList();
	// var surl="tbMdTable/tableList.action?connectionId="+data[0].id;
	// showTableList(surl);
	// }
	});
}
// 右移数据
function moveRight() {
	// 获取原有功能
	// 获取选中的信息
	showTableList("");
	var tname = $("#tt").tree('getChecked');
	// 获取右侧datagrid现有值
	var dlist = $('#table-list').datagrid('getData');
	// console.log("右侧数据=="+dlist.rows.length);
	var exist = 0;
	for (var i = 0; i < tname.length; i++) {
		exist = 0;
		var otherName = tname[i].attributes.otherName
		// console.log("otherName==="+otherName);
		// console.log("Name==="+tname[i].text);
		if (dlist.rows.length > 0) {
			for (var k = 0; k < dlist.rows.length; k++) {
				// console.log("右侧name==="+dlist.rows[k].tableName);
				if (dlist.rows[k].tableName == otherName || dlist.rows[k].tableName == tname[i].text) {
					exist = 1;
					break;
				}
			}
		}
		if (exist == 0) {
			$('#table-list').datagrid('appendRow', {
				connectionId : tname[i].id,
				tableName : tname[i].text,
				mdType : tname[i].attributes.mdType,
				tableCat : tname[i].attributes.tableCat,
				schemName : tname[i].attributes.tableSchemaName,
				tableDesc : tname[i].attributes.remarks,
				tableId : tname[i].attributes.tableId,
				otherName : tname[i].attributes.otherName,
				ifNew : '1'
			});
		}
	}
}
// 设置背景色
function changeColor() {
	$('#table-list').datagrid({
		rowStyler : function(index, row) {
			if (row.ifNew == '1') {
				return 'background-color:red;';
			}
		}
	});
}
// 左移数据
function moveLeft() {
	var row = $("#table-list").datagrid('getSelections');
	// console.log(row);
	if (row) {
		for (var i = 0; i < row.length; i++) {
			// console.log("i====="+row[i]);
			var rowIndex = $('#table-list').datagrid('getRowIndex', row[i]);
			// console.log("rowIndex====="+rowIndex);
			$('#table-list').datagrid('deleteRow', rowIndex);
		}
		var rows = $('#table-list').datagrid("getRows");
		$('#table-list').datagrid("loadData", rows);
	}
}

// 导入元数据页面显示已有表信息
function showTableList(url) {
	$('#table-list').datagrid({
		url : url,
		rownumbers : true,
		singleSelect : false,
		pagination : false,// 分页
		id : connectionId,
		// pageSize: 10,
		// pageList: [10,20,30,40,50],
		remoteSort : false,
		columns : [ [ {
			field : 'tableId',
			hidden : true
		}, {
			field : 'ifNew',
			hidden : true
		}, {
			field : 'otherName',
			hidden : true
		}, {
			field : 'connectionId',
			checkbox : true
		}, {
			field : 'tableName',
			title : '表名',
			width : '30%',
			sortable : true
		}, {
			field : 'mdType',
			title : '表类型',
			width : '7%',
			sortable : true,
			formatter : function(value, row, index) {
				if (row.mdType == 'T')
					return '表';
				else if (row.mdType == 'V')
					return '视图';
				else
					return mdType;
			}
		}, {
			field : 'tableCat',
			title : '目录',
			width : '15%',
			sortable : true
		}, {
			field : 'schemName',
			title : '模式',
			width : '18%',
			sortable : true
		}, {
			field : 'tableDesc',
			title : '备注',
			width : '20%',
			sortable : true
		} ] ]
	})
}

// 保存表信息
function saveTableInfo() {
	// 在from中将查询条件（如driveid等设置为隐参）
	var data = formToString($("#newTableForm").get(0));
	// console.log(data);
	$.ajax({
		type : "POST",
		url : "tbMdTable/saveNew.action",
		data : data,
		success : function(data) {
			// alert(data.info);
			$.messager.alert('提示', data.info, 'info');
			showList();
			// 关闭窗口
			// TODO 暂时屏蔽
			// $('#Modal-newtable').modal('toggle');
			$('#Modal-newtable').window('close');
		}
	});
}

// -------------------------------------------------------------------------------
