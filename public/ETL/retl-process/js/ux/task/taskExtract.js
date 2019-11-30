var mappingDataNo,mappingDataName;
var newDataArr=[];
var resultAllInfo=[];
var targetList=[];//目标表字段
var sourceList=[];//源表字段
var transScriptEditor,deleteSqlEditor,createTableScriptEditor;
$(function() {
//	$('#createTableScript').textareafullscreen();
	// 新增数据抽取
	$('#addE').unbind('click').click(function() {
		addTaskE();
	});
	_taskEType=$("#_taskEType").val();//页面数据来源-转换任务或作业流程
	$('#mappingDiv').hide();
//	loadDatagrid(targetList,sourceList);
	//codemirror
	//源表查询语句
	transScriptEditor = CodeMirror.fromTextArea(document.getElementById('transScript'), {
		    lineNumbers: false,//显示行数
		    mode: 'text/x-sql',//模式
		    smartIndent: true,//自动缩进是否开启
		    matchBrackets : true,//括号匹配
		    autofocus: true, //是否在初始化时自动获取焦点
		    tabSize : 2, 
		    lineWrapping : true,
		    scrollbarStyle :null//不显示滚动条
		  });
	transScriptEditor.setOption("extraKeys", {
	        // F11键切换全屏
	        "F11": function(cm) {
	        	var maxFlag=$('#t_newTask_data').window('options')["maximized"];//是否最大化
	        	if(maxFlag){
	        		if(cm.getOption("fullScreen")){
	        			$("#t_newTask_data").window('restore');
	        			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        		}else{
	        			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        		}
	        	}else{
	        		$("#t_newTask_data").window('maximize');
					cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	        	}
	        },
	        // Esc键退出全屏
	        "Esc": function(cm) {
	        	$("#t_newTask_data").window('restore');
	            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	        }
	    });
	//目标表删除语句
	deleteSqlEditor = CodeMirror.fromTextArea(document.getElementById('deleteSql'), {
	    lineNumbers: false,//显示行数
	    mode: 'text/x-sql',//模式
	    smartIndent: true,//自动缩进是否开启
	    matchBrackets : true,//括号匹配
	    autofocus: false, //是否在初始化时自动获取焦点
	    tabSize : 2, 
	    lineWrapping : true,
	    scrollbarStyle :null//不显示滚动条
	  });
	deleteSqlEditor.setOption("extraKeys", {
        // F11键切换全屏
        "F11": function(cm) {
        	var maxFlag=$('#t_newTask_data').window('options')["maximized"];//是否最大化
        	if(maxFlag){
	            if(cm.getOption("fullScreen")){
        			$("#t_newTask_data").window('restore');
        			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        		}else{
        			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        		}
        	}else{
        		$("#t_newTask_data").window('maximize');
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        	}
        },
        // Esc键退出全屏
        "Esc": function(cm) {
        	$("#t_newTask_data").window('restore');
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
    });
	//目标表创建语句
	createTableScriptEditor = CodeMirror.fromTextArea(document.getElementById('createTableScript'), {
	    lineNumbers: false,//显示行数
	    mode: 'text/x-sql',//模式
	    smartIndent: true,//自动缩进是否开启
	    matchBrackets : true,//括号匹配
	    autofocus: false, //是否在初始化时自动获取焦点
	    tabSize : 2, 
	    lineWrapping : true,
	    scrollbarStyle :null//不显示滚动条
	  });
	createTableScriptEditor.setOption("extraKeys", {
        // F11键切换全屏
        "F11": function(cm) {
        	var maxFlag=$('#t_newTask_data').window('options')["maximized"];//是否最大化
        	if(maxFlag){
	            if(cm.getOption("fullScreen")){
        			$("#t_newTask_data").window('restore');
        			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        		}else{
        			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        		}
        	}else{
        		$("#t_newTask_data").window('maximize');
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        	}
        },
        // Esc键退出全屏
        "Esc": function(cm) {
        	$("#t_newTask_data").window('restore');
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
    });
	  $('#t_newTask_data').window({
			onResize :function(){
				var h=$('#t_newTask_data').height();
				transScriptEditor.setSize('auto',h-270);
				deleteSqlEditor.setSize('auto',(h-420)/2);
				createTableScriptEditor.setSize('auto',(h-420)/2);
			}
		});
	   $('#etabs').tabs({//处理点击才显示的问题
		    onSelect:function(title,index){
		    	transScriptEditor.refresh();
		    	deleteSqlEditor.refresh();
		    	createTableScriptEditor.refresh();
		    }
		});
});

//新增弹出窗口
function addTaskE() {
	$("#fromResultE").trigger("click");
	initEInfo();
	$('#t_newTask_data').window('open');
	$("#etabs").tabs('select', "基本信息");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	var sfolderId = $("#search_folderId").val();// 获取当前数据所属文件夹
	var sfolderName=$("#search_folderName").val();//当前所属文件夹名称
	_id = sfolderId;
	_text= sfolderName;
	getTreeInfo("folderId");
	getTreeFolder("folderId");
//	$('#deleteSql').textareafullscreen();
//	$('#transScript').textareafullscreen();
	transScriptEditor.setValue('');
	deleteSqlEditor.setValue('');
	createTableScriptEditor.setValue('');
	loadDatagrid('','');
	//清空映射数据
	$('#mapping-list').datagrid('loadData', {total : 0,rows : []});
	$('#mappingDiv').hide();
}
// 保存数据抽取信息
function saveEInfo() {
	//判断dataGrid目标字段是否有重复值
	var alertStr="";
	var mappingColumnList=[];
	var rows ;
	//获取映射信息
//	if(!$('#mappingDiv').is(':hidden')){//没有隐藏，有信息
		rows = $('#mapping-list').datagrid('getRows');
		if(rows != undefined){//datagrid有数据信息
			var rowsStr=JSON.stringify(rows);
			for(var i=0;i<rows.length;i++){
				var tc=rows[i].targetCloumn;
				var tar='"targetCloumn":"'+tc+'"';
				if(rowsStr.split(tar).length-1 >1){//重复值
					//判断该字段在重复值字段alertStr中是否已存在
					if(alertStr.indexOf(tc) == -1){
						if(alertStr == ''){
							alertStr=alertStr+tc;
						}else{
							alertStr=alertStr+','+tc;
						}
					}
				}
			}
		}
//	}
	if(alertStr != ""){
		$.messager.show({
			title:'重复值提示信息',
			msg:"目标表字段"+alertStr+"存在重复值，请检查.",
			width : 400,
			height:250,
			showType:null,
			timeout :0,
			style:{}
		});
	}else{
		var _taskEType=$("#_taskEType").val(); 
		var taskNo;
		var taskName;
		var NoName;
		var taskId;
		//赋值index信息
		if(rows != undefined){
			if(rows.length >0){
				for(var i=0;i<rows.length;i++){
					rows[i].no=i+1;
				}
				mappingColumnList=rows;
//				$('#mappingColumn').val(JSON.stringify(rows));
			}
		}
		$('#mappingColumn').val(JSON.stringify(mappingColumnList));
//		console.log(JSON.stringify(mappingColumnList));
		$('#targetColumn').val(JSON.stringify(targetList));
		$('#sourceColumn').val(JSON.stringify(sourceList));
		if(_taskEType == 'forJob'){//来自作业流程页面
			 taskNo = $("#taskNo").val();
			 taskName = $("#taskName").val();
			 NoName = "【" + taskNo + "】" + taskName;
			 taskId = $("#taskId").val();
		}
		if ($("#formE").form('validate')) {// 启用校验
			editIndex = undefined;//行编辑焦点问题
			transScriptEditor.save();
			deleteSqlEditor.save();
			createTableScriptEditor.save();
			var data = $('#formE').serialize();
			$.ajax({
				type : "POST",
				url : "task/saveE.action",
				data : data,
				success : function(msg) {
					$.messager.alert('提示', "保存成功", 'info');
					// 清空form信息
					$("#fromResultE").trigger("click");
					$('#t_newTask_data').window('close');
					//保存后信息处理
					if(_taskEType == 'forTask'){
						sqlWhere();
					}else if(_taskEType == 'forJob'){
						var tid = msg.taskId;
						// 判断是否需要重新加载下拉框数据
						var taskNoName = $("#taskNoName1").val();
						if (taskNoName != NoName) {
							// 重新加载下拉框信息
							$("#i_nodeItem_id1").combobox(
									{
										valueField : 'id',
										textField : 'name',
										editable : true,
										url : 'job/taskList.action?type=1',
										onLoadSuccess : function() {
											var data = $('#i_nodeItem_id1').combobox(
													'getData');
											if (data.length > 0) {
												$('#i_nodeItem_id1').combobox('select',
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
	
	
}
// 取消
function cancelEInfo() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$("#fromResultE").trigger("click");
			$('#t_newTask_data').window('close');
		}
	});
}

//编辑变量
function editTaskE(tid, ttype,url) {
	$.ajax({
		type : "get",
		dataType : 'json',
		url : url+ "&category=" + $('#category').val(),
		success : function(data) {
			_id = data.data.folderId;
			_text = data.data.folderIdName;
			$("#fromResultE").trigger("click");
			$('#t_newTask_data').window('open');
			getTreeInfo("folderId");
			$("#targetCon").val(data.data.targetConnection);
			loadEInfo(data.data);
			$("#formE").form('myLoad', data.data);
			$("#taskId").val(data.data.taskId);
			$("#sourceConnection").combobox('setValue',data.data.sourceConnection);
			$("#targetConnection").combobox('setValue',data.data.targetConnection);
			if (data.data.sourceTables) {
				$("#sourceTables").combobox('setValues',data.data.sourceTables.split(","));
			}
			$("#targetTable").combobox('setValue', data.data.targetTable);
			$("#brforeRule").combobox('setValue', data.data.brforeRule);
			$('#keyField').combobox('setValue', data.data.keyField);
			$('#folderId').combotree('setValue', data.data.folderId);
			$("#kId").val(data.data.keyField);
			$("#ForKeyField").val(data.data.keyField);
			ttableInfo(data.data.brforeRule);
			// 全屏
			// $('#deleteSql').fseditor();
//			$('#deleteSql').textareafullscreen();
//			$('#transScript').textareafullscreen();
			transScriptEditor.setValue(data.data.transScript);
			if (data.data.createTableScript!=null) 
				createTableScriptEditor.setValue(data.data.createTableScript);
			if (data.data.brforeRule != '1') {
//				$("#deleteSql").val(data.data.deleteSql);
				deleteSqlEditor.setValue(data.data.deleteSql);
			}
			$("#submitNum").combobox({onLoadSuccess : function() {
					$('#submitNum').combobox('setValue',data.data.submitNum);
				}
			});
			$("#rollbackFlag").combobox({onLoadSuccess : function() {
					$('#rollbackFlag').combobox('setValue',data.data.rollbackFlag);
				}
			});
			$('#forRModuleNameE').val('TASKE');
			$('#forRTableNameE').val('TB_TASK_E');
			targetList=data.targetList;
			sourceList=data.sourceList;
			// 行编辑下拉框数据
			loadDatagrid(data.targetList,data.sourceList);
			$('#mapping-list').datagrid('loadData', {total : 0,rows : []});
			//映射字段回显
			if(data.mappingStr != "" && data.mappingStr != null && data.mappingStr != "[]"){//历史数据中该字段为null
				$('#mappingDiv').show();
				//清空映射数据
				$('#mapping-list').datagrid('loadData', JSON.parse(data.mappingStr));
				$('#mapping-list').datagrid("unselectAll");
			}else{
				$('#mappingDiv').hide();
			}
		}
	});
}
//查询预览
function searchPreviw() {
	$('#t_test_variate').window('open');
	$('#datanulldiv').hide();// 隐藏
	$("#_taskType").val("1");
	$("#_preview, #_execRes").show();
//	var transScript = $('#transScript').val();
	var transScript = transScriptEditor.getValue();
	getVariable(transScript);
	$("#fordatagrid").hide();
}
/**
 * 获取变量信息
 * 
 * @param transScript
 */
function getVariable(transScript) {
	$("#variableInfo").val("");// 清空之前的赋值信息
	$.ajax('task/getVariable.action',{
			type : 'post',
			dataType : 'json',
			data : {
				transScript : transScript
			},
			success : function(data) {
				jsonData = "";
				jsonData = data;
				var table = $("#btn-tb");
				table.html("");
				var table1 = $("#str-list");
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
					$("#variableInfo").val(String);// 变量测试时用于变量查询结果的列名显示
				});
			}
		});
}

//新增加载信息
function initEInfo() {
	// 数据连接--来源
	$("#sourceConnection").combobox(
			{
				valueField : 'connectionId',
				textField : 'connectionName',
				editable : false,// 不可编辑
				url : 'tbMdTable/listConnnectAll.action',
				onChange : function(newValue, oldValue) {
					$.get('tbMdTable/connnectTable.action', {
						id : newValue
					}, function(data) {
						var sinfo = $("#sourceTables").combobox('getText');// 当前table值信息
						if (sinfo != "") {
							sourceTables.combobox("clear").combobox('loadData',
									data).combobox('setValue', sinfo);
						} else {
							sourceTables.combobox("clear").combobox('loadData',
									data);
						}
					}, 'json');

					handleCategory(newValue);
				}
			});
	// 数据连接--目标
	$("#targetConnection").combobox(
			{
				valueField : 'connectionId',
				textField : 'connectionName',
				editable : false,// 不可编辑
				url : 'tbMdTable/listConnnect.action',
				onChange : function(newValue, oldValue) {
					$("#targetCon").val(newValue);
					$.get('tbMdTable/connnectTable.action', {
						id : newValue
					}, function(data) {
						var tinfo = $("#targetTable").combobox('getText');// 当前table值信息
						var kId = $("#keyField").combobox('getText');// 当前关键字信息
						$("#kId").val(kId);
						if (tinfo != "") {
							targetTable.combobox("clear").combobox('loadData',
									data).combobox('setValue', tinfo);
						} else {
							targetTable.combobox("clear").combobox('loadData',
									data);
						}
					}, 'json');
				}
			});
	// 目标写入前的操作
	$("#brforeRule").combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		url : 'sysDictionaryData/getValues.action?dictValue=BEFORE_RULE',
		onChange : function(newValue, oldValue) {
			ttableInfo(newValue);
		},
		onLoadSuccess : onLoadSuccess
	});

	$("#submitNum").combobox({
		onLoadSuccess : function() {
			$("#submitNum").combobox("select", "5000");
			$("#submitNum").combobox("setValue", 5000);
		}
	});

	$("#rollbackFlag").combobox({
		onLoadSuccess : onLoadSuccess
	});

	// 来源表
	var sourceTables = $("#sourceTables").combobox(
			{
				method : 'get',
				valueField : 'tableName',
				textField : 'stname',
				panelHeight : '150',
				multiple : true,
				formatter : function(row) {
					var opts = $(this).combobox('options');
					return '<input type="checkbox" class="combobox-checkbox">'
							+ row[opts.textField]
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
	// 目标表
	var targetTable = $("#targetTable").combobox(
			{
				// editable : false,
				valueField : 'stname',
				textField : 'stname',
				onChange : function(newValue, oldValue) {
					var tCon = $("#targetCon").val();
					// var kId=$("#kId").val();
					var kId = $("#keyField").combobox('getText');
					$.get('tbMdTable/getColumns.action', {
						tableName : newValue,
						connectionId : tCon
					}, function(data) {
						if (kId != "") {
							keyField.combobox("clear").combobox('loadData',data).combobox('setText', kId);
							$('#ForKeyField').val(kId);
						} else {
							keyField.combobox("clear").combobox('loadData',data);
						}
					}, 'json');
				}
			});
	// 关键字
	var keyField = $("#keyField").combobox({
		valueField : 'columnName',
		textField : 'columnName',
		onChange : function(newValue, oldValue) {
			keyInfo();
			$('#ForKeyField').val(newValue);
		}
	});
}

/**
 * 处理驱动类型相关联信息
 * 
 * @param id
 */
function handleCategory(connectionId) {
	$.get('dbConnection/getDriverInfoByConnectionId.action', {
		connectionId : connectionId
	}, function(data) {
		if (data.category === '14') { // SAP
			$(".nonSAP").hide();
			$('#category').val('14');
		} else if (data.category === '15') { // OLAP
			$(".nonSAP").hide();
			$('#category').val('15');
		} else {
			$(".nonSAP").show();
			$('#category').val("");
		}
	});
}


function onLoadSuccess() {
	var id = $("#taskId").val();
	if (id == null || id == "") { // 当新增表单时
		var target = $(this);
		var data = target.combobox("getData");
		var options = target.combobox("options");
		if (data && data.length > 0) {
			var fs = data[0];
			target.combobox("setValue", fs[options.valueField]);
		}
	}
}
//目标表删除语句--删除前操作类型和关键字是否为必填项变化
function ttableInfo(id) {
	var str;
	var ttable = $("#targetTable").combobox('getText');
	var tkey = $("#keyField").combobox('getText');
	var kId = $("#kId").val();
	// var fordeleteSql=$("#fordeleteSql").val();
	if (id == '1') {// 不删除
//		$("#deleteSql").val("");// 删除语句为空且不可编辑
		deleteSqlEditor.setValue("");
		$('#deleteSql').attr("disabled", true);
		// $("#keyField").combobox({required:false,value : tkey});
		$('#keyField').combobox('setValue', '').combobox('setText', '');// 关键批次字段为空，且不可选择编辑
		$('#keyField').combobox("disable");
	} else if (id == '2') {// 清空目标表
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
//		$("#deleteSql").val(str);
		deleteSqlEditor.setValue(str);
		$('#deleteSql').attr("disabled", false);// 删除语句可编辑
		// $("#keyField").combobox({required:false,value : tkey});
		$('#keyField').combobox('setValue', '').combobox('setText', '');// 关键批次字段为空，且不可选择编辑
		$('#keyField').combobox("disable");
	} else if (id == '3') {// 删除已有
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		if (tkey == null || tkey == '') {
			if (kId == null || kId == '') {
				str = str + " WHERE 关键字段  IN (SELECT 关键字段  FROM (源表查询语句))";
			} else {
				str = str + " WHERE " + kId + "  IN (SELECT " + kId
						+ "  FROM (源表查询语句))";
			}
		} else {
			str = str + " WHERE " + tkey + "  IN (SELECT " + tkey
					+ "  FROM (源表查询语句))";
		}
		// if(fordeleteSql == null || fordeleteSql == ''){
		// $("#deleteSql").val(str);
		// }else{
		// $("#deleteSql").val(fordeleteSql);
		// }
//		$("#deleteSql").val(str);
		deleteSqlEditor.setValue(str);
		$('#deleteSql').attr("disabled", false);// 删除语句可编辑
		$('#keyField').combobox("enable");// 关键批次可选择编辑
		if (tkey == null || tkey == '') {
			$('#keyField').combobox('setValue', kId).combobox('setText', kId);
		} else {
			$('#keyField').combobox('setValue', tkey).combobox('setText', tkey);
		}
		// $("#keyField").combobox({required:true,value : tkey});
	} else if (id == '4') {// 删除本批次
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		if (tkey == null || tkey == '') {
			if (kId == null || kId == '') {
				str = str + " WHERE 关键字段  = ${HDIBATCHNO}";
			} else {
				str = str + " WHERE " + kId + " =  ${HDIBATCHNO}";
			}
		} else {
			str = str + " WHERE " + tkey + " =  ${HDIBATCHNO}";
		}
//		$("#deleteSql").val(str);
		deleteSqlEditor.setValue(str);
		$('#deleteSql').attr("disabled", false);// 删除语句可编辑
		$('#keyField').combobox("enable");// 关键批次可选择编辑
		if (tkey == null || tkey == '') {
			$('#keyField').combobox('setValue', kId).combobox('setText', kId);
		} else {
			$('#keyField').combobox('setValue', tkey).combobox('setText', tkey);
		}
		// $("#keyField").combobox({required:true,value : tkey});
	} else if (id == '5') {// 自定义
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		$("#deleteSql").val(str);
		deleteSqlEditor.setValue(str);
		$('#deleteSql').attr("disabled", false);// 删除语句可编辑
		$('#keyField').combobox("disable");// 关键批次不可选择编辑
		// $('#keyField').combobox({required:false});
		// $("#keyField").combobox({required:true,value : tkey});
		$('#keyField').combobox('setValue', '').combobox('setText', '');// 关键批次字段为空，且不可选择编辑
	}
}
// 目标表删除语句--关键字变化
function keyInfo() {
	var str;
	var id = $("#brforeRule").combobox('getValue');
	var ttable = $("#targetTable").combobox('getText');
	var tkey = $("#keyField").combobox('getText');
	var kId = $("#kId").val();
	if (id == '1') {// 不删除
//		$("#deleteSql").val("");
		deleteSqlEditor.setValue("");
	} else if (id == '2') {// 清空目标表
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
//		$("#deleteSql").val(str);
		deleteSqlEditor.setValue(str);
	} else if (id == '3') {// 删除已有
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		if (tkey == null || tkey == '') {
			if (kId == null || kId == '') {
				str = str + " WHERE 关键字段  IN (SELECT 关键字段  FROM (源表查询语句))";
			} else {
				str = str + " WHERE " + kId + "  IN (SELECT " + kId
						+ "  FROM (源表查询语句))";
			}
		} else {
			str = str + " WHERE " + tkey + "  IN (SELECT " + tkey
					+ "  FROM (源表查询语句))";
		}
//		$("#deleteSql").val(str);
		deleteSqlEditor.setValue(str);
	} else if (id == '4') {// 删除本批次
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
		if (tkey == null || tkey == '') {
			if (kId == null || kId == '') {
				str = str + " WHERE 关键字段  = ${HDIBATCHNO}";
			} else {
				str = str + " WHERE " + kId + " =  ${HDIBATCHNO}";
			}
		} else {
			str = str + " WHERE " + tkey + " =  ${HDIBATCHNO}";
		}
//		$("#deleteSql").val(str);
		deleteSqlEditor.setValue(str);
	} else if (id == '5') {// 自定义
		str = "";
		if (ttable == null || ttable == '') {
			str = "DELETE  FROM  目标表名";
		} else {
			str = "DELETE  FROM  " + ttable;
		}
//		$("#deleteSql").val(str);
		deleteSqlEditor.setValue(str);
	}
}
//编辑时加载数据信息
function loadEInfo(data) {
	var sourceConnection = data.sourceConnection; // 源连接
	var targetConnection = data.targetConnection; // 目标连接
	var ttable = data.targetTable;// 目标表
	var b = data;

	handleCategory(sourceConnection);

	// 数据连接--来源
	$("#sourceConnection").combobox(
			{
				valueField : 'connectionId',
				textField : 'connectionName',
				editable : false,// 不可编辑
				url : 'tbMdTable/listConnnectAll.action',
				onChange : function(newValue, oldValue) {
					$.get('tbMdTable/connnectTable.action', {
						id : newValue
					}, function(data) {
						var sinfo = $("#sourceTables").combobox('getText');// 当前table值信息
						if (sinfo != "") {
							sourceTables.combobox("clear").combobox('loadData',data).combobox('setValue', sinfo);
						} else {
							sourceTables.combobox("clear").combobox('loadData',data);
						}
						// sourceTables.combobox("clear").combobox('loadData',
						// data);
					}, 'json');

					handleCategory(newValue);
				}
			});
	// 数据连接--目标
	$("#targetConnection").combobox(
			{
				valueField : 'connectionId',
				textField : 'connectionName',
				editable : false,// 不可编辑
				url : 'tbMdTable/listConnnect.action',
				onChange : function(newValue, oldValue) {
					$("#targetCon").val(newValue);
					$.get('tbMdTable/connnectTable.action', {
						id : newValue
					}, function(data) {
						var tinfo = $("#targetTable").combobox('getText');// 当前table值信息
						var kId = $("#keyField").combobox('getText');// 当前关键字信息
						$("#kId").val(kId);
						if (tinfo != "") {
							targetTable.combobox("clear").combobox('loadData',data).combobox('setValue', tinfo);
						} else {
							targetTable.combobox("clear").combobox('loadData',data);
						}
						// targetTable.combobox("clear").combobox('loadData',
						// data);
					}, 'json');
				}
			});
	// 目标写入前的操作
	$("#brforeRule").combobox({
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		url : 'sysDictionaryData/getValues.action?dictValue=BEFORE_RULE',
		onChange : function(newValue, oldValue) {
			ttableInfo(newValue);
		}
	});
	// 来源表
	var sourceTables = $("#sourceTables").combobox(
			{
				method : 'get',
				url : 'tbMdTable/connnectTable.action?id=' + sourceConnection,
				valueField : 'tableName',
				textField : 'stname',
				// panelHeight : 'auto',
				multiple : true,
				formatter : function(row) {
					var opts = $(this).combobox('options');
					return '<input type="checkbox" class="combobox-checkbox">'
							+ row[opts.textField]
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
	// 目标表
	var targetTable = $("#targetTable").combobox(
			{
				// editable : false,
				valueField : 'stname',
				textField : 'stname',
				url : 'tbMdTable/connnectTable.action?id=' + targetConnection,
				onChange : function(newValue, oldValue) {
					var tCon = $("#targetCon").val();
					var kId = $("#kId").val();
					$.get('tbMdTable/getColumns.action', {
						tableName : newValue,
						connectionId : tCon
					}, function(data) {
						if (kId != "") {
							keyField.combobox("clear").combobox('loadData',
									data).combobox('setText', kId);
							$('#ForKeyField').val(kId);
						} else {
							keyField.combobox("clear").combobox('loadData',
									data);
						}
					}, 'json');
				}
			});
	// 关键字
	var keyField = $("#keyField").combobox(
			{
				url : 'tbMdTable/getColumns.action?tableName=' + ttable
						+ '&connectionId=' + targetConnection,
				valueField : 'columnName',
				textField : 'columnName',
				onChange : function(newValue, oldValue) {
					keyInfo();
					$('#ForKeyField').val(newValue);
				}
			});
}
/**
 * 生成查询语句
 */
$("#btn_generate_select").click(function() {
	// 根据源表的第一个表的表结构产生 select 语句，把每个字段都写上去且独占一行
	var conn = $("#sourceConnection").combobox('getValue');
	var table = $("#sourceTables").combobox('getText');
	if (conn.length == 0) {
		Peony.alert('提示', '请先选择一个“来源数据连接”。', 'warning');
		return false;
	}
	if (table.length == 0) {
		Peony.alert('提示', '请先选择一个“源表”。', 'warning');
		return false;
	}
	var tab = table.split(",")[0];
	$.get("task/generateSelectScript?connection=" + conn + "&table=" + tab, function(data) {
		if (data.success) {
//			$("#transScript").val(data.msg);
			transScriptEditor.setValue(data.msg);
		} else {
			Peony.alert('提示', data.msg, 'error');
		}
	});
});

/**
 * 生成建表语句
 */
$("#btn_generate_table").click(function() {
	// --------------源
	var sourceConnection = $("#sourceConnection").combobox('getValue');
	var sourceTables = $("#sourceTables").combobox('getText');
//	var transScript = $("#transScript").val();
	var transScript =transScriptEditor.getValue();
	if (sourceConnection.length == 0) {
		Peony.alert('提示', '请先选择一个“来源数据连接”。', 'warning');
		return false;
	}
	if (transScript.length == 0) {
		Peony.alert('提示', '“源表查询语句”不能为空。', 'warning');
		return false;
	}
	var sourceTable = sourceTables.split(",")[0];

	// --------------目标
	var targetConnection = $("#targetConnection").combobox('getValue');
	var targetTable = $("#targetTable").combobox('getText');

	if (targetConnection.length == 0) {
		Peony.alert('提示', '请先选择一个“目标数据连接”。', 'warning');
		return false;
	}
	if (targetTable.length == 0) {
		Peony.alert('提示', '请先选择一个“目标表”。', 'warning');
		return false;
	}
	var data = {};
	data.sourceConnection = sourceConnection;
	data.sourceTable = sourceTable;
	data.transScript = transScript;
	data.targetConnection = targetConnection;
	data.targetTable = targetTable;
	$.post("task/generateCreateScript", data, function(data) {
		if (data.success) {
//			$("#createTableScript").val(data.msg);
			createTableScriptEditor.setValue(data.msg);
		} else {
			Peony.alert('提示', data.msg, 'error');
		}
	});
});

// 执行查询
$("#stopQuery").hide();
$("#showInfo").click(function() {
	$("#showInfo").hide();
	$("#stopQuery").show();
	var datanulldiv = $('#datanulldiv');
	datanulldiv.empty();// 清除以前提醒数据
	datanulldiv.show();
	datanulldiv.append('<span>正在查询中...</span>');
	var variableInfo = $("#variableInfo").val();
	var arr = new Array();
	arr = jsonData;
	var transScript; // 转换脚本
	var sourceConnection;
	var sourceTable;
	var _taskType = $("#_taskType").val();
	if (_taskType === '3') { // 变量
		sourceConnection = $('#dbConnection3').combobox('getValue');
		sourceTable = "";
//		transScript = $("#variableScript3").val();
		transScript = variableEditor.getValue();
	} else if (_taskType === '1') { // 异构
		sourceConnection = $('#sourceConnection').combobox('getValue');
		sourceTable = $('#sourceTables').combobox('getValue');
//		transScript = $("#transScript").val();
		transScript = transScriptEditor.getValue();
	}
	var varKey = "";
	var varValue = "";
	for (var i = 0; i < arr.length; i++) {
		var v = JSON.stringify(arr[i]).replace('"', '').replace('"', '');
		varKey += v + ",";
		varValue += $("#" + v).val() + ",";
	}
	// showPreviewList("");
	// $('#str-list').datagrid('loadData', {
	// total : 0,
	// rows : []
	// });
	var array = [];
	var columns = [];
	// var sum=0

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
			$("#showInfo").show();
			$("#stopQuery").hide();
			datanulldiv.empty();
			$("#fordatagrid").show();
			var info = data.info;
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
				$(metaLsit).each(function(index, el) {
					columns[0][index]['field'] = el;
					columns[0][index]['title'] = el;
					columns[0][index]['width'] = 100;
					columns[0][index]['sortable'] = true;
					columns[0][index]['formatter'] = function(value, row, index) {
						return '<span title=' + value + '>' + value + '</span>';
					};
				});
				var url = "task/preview.action";
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
});

// 展示表数据信息
function showPreviewList(columns, url, params) {
	var category = $('#category').val();
	// 对于SAP/OLAP后台查询时不便分页的，采用一次性查出在前台分页
	if (category === '14' || category === '15') {
		$.post(url, params, function(data) {
			$('#str-list').datagrid({
				data : data,
				view : scrollview, // 虚拟滚动
				rownumbers : true,
				singleSelect : false,
				remoteSort : false,
				pageSize : 20,
				height : 280,
				columns : columns
			});
		}).error(function(data) {
			Peony.alert('提示', data.responseText, 'error');
		});
	} else {
		$('#str-list').datagrid({
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
		})/*.datagrid('loadData', {
			total : 0,
			rows : []
		})*/;
	}
}

// 停止查询
$("#stopQuery").click(function() {
	$("#showInfo").show();
	$("#stopQuery").hide();
	var datanulldiv = $('#datanulldiv');
	datanulldiv.empty();
	datanulldiv.show();
	datanulldiv.append('<span>执行查询中止中...</span>');
	$.ajax('task/stopQueryForPreview.action', {
		type : 'post',
		dataType : 'json',
		data : {},
		success : function(data) {
			// alert('执行查询已中止！');
			// $.messager.alert('提示', "执行查询已中止！", 'info');
			datanulldiv.empty();// 清除以前提醒数据
			datanulldiv.append('<span>执行查询已中止</span>');
		},
		error : function(data) {
			// alert('执行失败！');
			// $.messager.alert('提示', "执行失败——" + data, 'info');
			datanulldiv.empty();// 清除以前提醒数据
			datanulldiv.append('<span>执行失败——' + data.error + '</span>');
		}
	});
});

// 取消查询预览
$("#cancelQueryInfo").click(function() {
	$('#t_test_variate').window('close');
});


//获取字段最新方法
$("#getMappingColumns").unbind('click').click(function() {
	getMappingInfo('1');
});
//按顺序
$("#orderByNo").unbind('click').click(function() {
	getMappingInfo('2');
});
//按名称
$("#orderByName").unbind('click').click(function() {
	getMappingInfo('3');
});
//刷新字段
$("#reloadList").unbind('click').click(function() {
	reloadDataList();
});
//获取信息--最终
function getMappingInfo(searchType){
	//改为从查询语句中查询信息，若是查询语句为空，则继续之前的操作-从源表中查询数据
	var arr = new Array();
	var transScript,sourceConnection,sourceTable; // 转换脚本
	var targetConnection,targetTable;
	sourceConnection = $('#sourceConnection').combobox('getValue');
	sourceTable = $('#sourceTables').combobox('getValue');
//	transScript = $("#transScript").val();
	transScript = transScriptEditor.getValue();
	if (sourceConnection.length == 0) {
		$.messager.alert('提示', '请先选择一个“来源数据连接”。', 'warning');
		return false;
	}
	targetConnection = $("#targetConnection").combobox('getValue');
	targetTable = $("#targetTable").combobox('getText');

	if (targetConnection.length == 0) {
		$.messager.alert('提示', '请先选择一个“目标数据连接”。', 'warning');
		return false;
	}
	if (targetTable.length == 0) {
		$.messager.alert('提示', '请先选择一个“目标表”。', 'warning');
		return false;
	}
	if(transScript != ""){//有查询语句
		$.messager.progress({title : '请等待',msg : '正在加载中...'});
		$.ajax('task/getVariable.action',{
			type : 'post',
			dataType : 'json',
			data : {transScript : transScript},
			success : function(data) {
				jsonData = "";
				jsonData = data;
				arr = jsonData;
				var varKey = "";
				var varValue = "";
				for (var i = 0; i < arr.length; i++) {
					var v = JSON.stringify(arr[i]).replace('"', '').replace('"', '');
					varKey += v + ",";
					varValue += 'null' + ",";
				}
				var array = [];
				if (sourceTable == undefined) {
					sourceTable = ' ';
				}
				var _data = {};
				_data.sourceConnection = sourceConnection;
				_data.sourceTables = sourceTable;
				_data.transScript = transScript;
				_data.targetConnection = targetConnection;
				_data.targetTable = targetTable;
				_data.varKey = varKey;
				_data.varValue = varValue;
				_data.category = $('#category').val();//驱动类型
				_data.searchType = searchType;//查询类型
				// ajax提交form
				$.ajax({
					type : 'post',
					dataType : 'json',
					url: 'task/getMapping.action', 
					data : _data,
					success : function(result) {
						loadCloumnDatagridInfo(result);
					}
				});
				
			}
		})
	}else{//根据源表名称查询
		$.messager.progress({title : '请等待',msg : '正在加载中...'});
		var data = {};
		data.sourceConnection = sourceConnection;
		data.sourceTables = sourceTable; 
		data.targetConnection = targetConnection;
		data.targetTable = targetTable; 
		data.searchType = searchType;//查询类型
		var surl='';
		if(searchType == '1' || searchType == '2'){//【获取字段】、【按顺序查询】
			surl='task/getMappingColumns.action';
		}else{//【按名称查询】
			surl='task/getMappingColumnsName.action';
		}
		$.ajax({
			type : 'post',
			dataType : 'json',
			url: surl,
			data : data,
			success : function(result) {
				loadCloumnDatagridInfo(result);
			}
		});
	}
}

function loadCloumnDatagridInfo(result){
	if(result.info == ''){
		//查询到的所有的数据
		resultAllInfo=[];
		targetList=[];
		sourceList=[];
		resultAllInfo=result.data;
		targetList=result.targetList;
		sourceList=result.sourceList;
		var datas = $('#mapping-list').datagrid('getData');
		var total=datas.total;
		newDataArr=[];//清空之前信息
		$('#mappingDiv').show();
		if(total == 0 || result.searchType == '2' || result.searchType == '3'){//第一次查询，页面上没有数据或
			loadDatagrid(targetList,sourceList);
			$('#mapping-list').datagrid('loadData', result.data);
			mappingDataNo=result.data;
		}else{
			var noData=datas.rows;
			//判断是否有新增的数据
			var loaclData=JSON.stringify(noData);//本地现有数据
			for(var i=0;i<result.data.length;i++){
				var resultData=JSON.stringify(result.data[i]);
				var tar=result.data[i].targetCloumn;
				var tarStr='"targetCloumn":"'+tar+'"';
				if(loaclData.indexOf(tarStr) == -1){//不存在
					newDataArr.push(resultData);
				}
			}
			loadDatagrid(targetList,sourceList);
			$('#forDataDialog').dialog({ content : "表中已经有"+total+"行数据，如何处理新找到的"+result.data.length+"列" }).dialog('open');
		}
	}else{
		$.messager.alert('警告', result.info, 'warning');
	}
	$.messager.progress('close');
}


//增加信息的字段
function appendNewInfo(){
	appendDataGridInfo(newDataArr,'1');
}

//增加所有的字段
function appendAllInfo(){
	appendDataGridInfo(resultAllInfo,'2');
}

//删除之前信息并新增所有字段
function deleteAndAppendInfo(){
	$('#mapping-list').datagrid('loadData', {total : 0,rows : []});
	appendDataGridInfo(resultAllInfo,'2');
}
//取消字段操作
function cancelAddInfo(){
	$('#forDataDialog').dialog('close');
}

//删除字段信息
$("#deleteColumn").unbind('click').click(function() {
	// 获取选中行
	var nodes = $('#mapping-list').datagrid('getChecked');
	var len=nodes.length;
	if (nodes.length == 0) {
		$.messager.alert('警告', '请选择待删除记录.', 'warning');
	} else {
		$.messager.confirm('确认提示', '您确定要删除字段信息吗？', function(r) {
			//获取选中行的index信息，删除该行信息
			if (r) {
				for(var i=0;i<len;i++){
					 var row=$("#mapping-list").datagrid('getChecked'); 
			         var rowIndex = $('#mapping-list').datagrid('getRowIndex', row[0]);//第一条数据
			         $('#mapping-list').datagrid('deleteRow', rowIndex);
			         var rows = $('#mapping-list').datagrid("getRows");
			         $('#mapping-list').datagrid("loadData", rows); //重新加载当前数据
				}
			}
		});
	}
});

//增加新的字段信息
function  appendDataGridInfo(dataGridArr,stype){
	//当前datagrid的行数
	var datas = $('#mapping-list').datagrid('getData');
	var total=datas.total;
	//循环添加新增字段
	for(var i=0;i<dataGridArr.length;i++){
		var data;
		if(stype == '1'){
			data=JSON.parse(dataGridArr[i]);
		}else{
			data=dataGridArr[i];
		}
		$('#mapping-list').datagrid('appendRow', {
			sourceCloumn : data.sourceCloumn,
			targetCloumn : data.targetCloumn,
			no : total+i+1
		});
	}
	$('#forDataDialog').dialog('close');
}

//映射字段展示信息
function loadDatagrid(targetList,sourceList){
	$('#mapping-list').datagrid({
			url : "",
			idField : 'no',
			pagination : false, // 分页
			rownumbers : true, // 行号
			singleSelect : false,// 单选
			checkOnSelect : true,
			autoRowHeight : false,// 是否设置基于该行内容的行高度
			remoteSort : false,
			striped : true,// 奇偶行显示不同背景色
			fitColumns : false,// 自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动。
//			height : 296,
			columns : [ [ {
					field : 'no',
					checkbox : true,
	                },{
						field : 'targetCloumn',
						title : '目标表字段',
						 width : '48%',
						sortable : true,
						editor:{
							type:'combobox',
							options:{
								data: targetList, 
	                            valueField: "columnId",  
	                            textField: "columnName",  
	                            editable: true,  
	                            required: true,  
	                            onChange :function(newValue, oldValue){
//	                            	  var varSelect = $(this).combobox('getValue');
//	                            	  console.log(varSelect);
	                            	  var row = $('#mapping-list').datagrid('getSelected');
	                            	  row.targetCloumn=newValue;
	                            }
							}
						}
					},{
						field : 'sourceCloumn',
						title : '源表字段',
						 width : '48%',
						sortable : true,
						editor:{
							type:'combobox',
							options:{
								data: sourceList, 
	                            valueField: "columnId",  
	                            textField: "columnName",  
	                            editable: true ,
	                            onChange :function(newValue, oldValue){
	                            	  var row = $('#mapping-list').datagrid('getSelected');
	                            	  row.sourceCloumn=newValue;
	                            }
							}
						}
					}] ],
					onClickRow: onClickRow
		});
 }

var editIndex = undefined;  
function endEditing() { 
    if (editIndex == undefined) { return true }  
    if ($('#mapping-list').datagrid('validateRow', editIndex)) {  
        var ed = $('#mapping-list').datagrid('getEditor', { index: editIndex, field: 'targetCloumn' });  
        $('#mapping-list').datagrid('endEdit', editIndex);  
        editIndex = undefined;  
        return true;  
    } else {  
        return false;  
    }  
}  
function onClickRow(index) {  
//	console.log('-------editIndex----'+editIndex);
	$('#mapping-list').datagrid("checkAll");
	$('#mapping-list').datagrid("unselectAll"); //为了保持一个信息选中状态 
    if (editIndex != index) {  
        if (endEditing()) {  
            $('#mapping-list').datagrid('selectRow', index)  
                    .datagrid('beginEdit', index);  
            editIndex = index;  
        } else {  
            $('#mapping-list').datagrid('selectRow', editIndex);  
        }  
    }  
}  

//刷新下拉框字段信息
function reloadDataList(){
	//改为从查询语句中查询信息，若是查询语句为空，则继续之前的操作-从源表中查询数据
	var arr = new Array();
	var transScript,sourceConnection,sourceTable; // 转换脚本
	var targetConnection,targetTable;
	sourceConnection = $('#sourceConnection').combobox('getValue');
	sourceTable = $('#sourceTables').combobox('getValue');
//	transScript = $("#transScript").val();
	transScript = transScriptEditor.getValue();
	if (sourceConnection.length == 0) {
		$.messager.alert('提示', '请先选择一个“来源数据连接”。', 'warning');
		return false;
	}
	targetConnection = $("#targetConnection").combobox('getValue');
	targetTable = $("#targetTable").combobox('getText');

	if (targetConnection.length == 0) {
		$.messager.alert('提示', '请先选择一个“目标数据连接”。', 'warning');
		return false;
	}
	if (targetTable.length == 0) {
		$.messager.alert('提示', '请先选择一个“目标表”。', 'warning');
		return false;
	}
	$.messager.progress({title : '请等待',msg : '正在加载中...'});
	var _data = {};
	_data.sourceConnection = sourceConnection;
	_data.sourceTables = sourceTable;
	_data.transScript = transScript;
	_data.targetConnection = targetConnection;
	_data.targetTable = targetTable;
	_data.category = $('#category').val();//驱动类型
	// ajax提交form
	$.ajax({
		type : 'post',
		dataType : 'json',
		url: 'task/reloadDataList.action', 
		data : _data,
		success : function(result) {
//			console.log(result);
			if(result.info == ''){
				loadDatagrid(result.targetList,result.sourceList);
			}else{
				$.messager.alert('警告', result.info, 'warning');
			}
			$.messager.progress('close');
		}
	});
}
