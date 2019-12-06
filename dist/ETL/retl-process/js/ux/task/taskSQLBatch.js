
$(function(){
	var win = $.messager.progress({
		title:'请稍后',
		msg:'正在加载数据...'
	});
	$.ajax({  
		type: "get",  
		dataType : 'json',
		url: "task/taskListBatch.action?floderId=038d570fe3554ffca136d52988abf479",  
		success: function(data){
				delAllLine(true);
//				btnAdd();
				$.each(data.rows,function(i,btn){
					addLine(i,btn);
				});
				$.messager.progress('close');
			}
	})
});

//新增一行
$('#addLine_btn').unbind('click').click(function(){
	var rows = document.getElementById("btn-tb1").rows.length ;
	addLine(rows-1,'');
});
//删除全部
$('#delAllLine_btn').unbind('click').click(function(){
var table = $("#btn-tb1"); //待操作表单
var tab= document.getElementById("btn-tb1") ;
var rows = tab.rows.length ;
if(rows >1){//表头信息
	$.messager.confirm('确认', '您确定要删除记录？', function(r) {
		if(r){ 
			delAllLine(true);
		}
	});
}else{
	$.messager.alert('提示', "无待删除信息！", 'info');
	}
});

//保存数据-数据抽取
function saveSQLBacth(){
   if ($("#formSQLBatch").form('validate')) {//启用校验
	   var rows = document.getElementById("btn-tb1").rows.length ;
	   for(var i=0;i<rows-1;i++){
		   var del=$("#command"+i).val(); //目标删除语句
		   if(del != null && del != ''){
			   if(del.indexOf(",") > 0 ){//包含逗号，暂时替换为中文逗号
				   del= del.replace(/,/g,"，");
			   }
			   $("#commandx"+i).val(del);
		   }
	   }
	   var data=$('#formSQLBatch').serialize();
//	   var data=$("#formSQLBatch").serializeArray();
		if(data == null || data == ''){
			$.messager.alert('提示', "请添加待保存任务信息.", 'waring');
		}else{
			$.ajax({  
				type: "POST",  
				url: "task/saveTaskSQLBatch.action",  
				data: data,  
				success: function(msg){  
					$.messager.alert('提示', "保存成功", 'info');
					window.location.href = "task/list.action";
				}  
			});
		}
	}else{
		$.messager.alert('提示', "有非空字段需要填写，请检查.", 'waring');
	}
}
//返回主页面
function gobackTask(){
//	window.history.back();
//	location.reload();//返回上一页并强制刷新数据
	this.location.href="task/list.action";//兼容火狐
}

function addLine(i,data){
	var table = $("#btn-tb1");
	var tab= document.getElementById("btn-tb1") ;
	var rows = tab.rows.length ;
	var	html = "<tr class='tb-line bor_no'>";
	//序号
	html+=	   "	<td width=\"40px\"><span style=\"width:40px;display:block;text-align: center\">"+rows+"</span></td>";
	//所属目录
	html+=	   "	<td width=\"10%\">" +
				"<input class=\"easyui-combotree\" name=\"folderId\" id=\"folderId"+i+"\" type=\"text\" "
				+"data-options=\"\" " +
				" style=\"width:150px;height:25px;\">"+
			"</td>";
	//编号
	html+=	  "	<td width=\"10%\"><input name=\"taskNo\" id=\"taskNo"+i+"\" class=\"easyui-validatebox Task-number form-control\" type=\"text\" style=\"width:130px;\" data-options=\"required:true\"></td>";
	//名称
	html+=	   "<td width=\"10%\">" +
			"<input name=\"taskName\" id=\"taskName"+i+"\" class=\"easyui-validatebox Task-number form-control\" type=\"text\" style=\"width:130px;\" data-options=\"required:true\"></td>";
	//数据连接
	html+=	   "<td width=\"10%\">" +
			"<input class=\"easyui-combobox  form-control\" name=\"connectionId\" id=\"connectionId"+i+"\" type=\"text\" "
				+"data-options=\" \" " +
				" style=\"width:150px;height:25px;\">"+
			"</td>";
	//执行方式
	html+=	   "<td width=\"10%\">" +
			"<input class=\"easyui-combobox  form-control\" name=\"transRule\" id=\"transRule"+i+"\" type=\"text\" "
				+"data-options=\"\" " +
				" style=\"width:150px;height:25px;\">"+
			"</td>";
	//执行脚本
	html+=	   "<td width=\"10%\">" +
	    "<input class=\"hidden\" type=\"text\" name=\"command\" id=\"commandx"+i+"\" value=\"0\"> "+
			"<textarea class=\"form-control text_control\"  id=\"command"+i+"\" rows=\"3\" style=\"width:270px;height:25px;\"></textarea>" +
		"</td>";
	html+=	   "	<td width=\"10%\"><a class=\"easyui-linkbutton remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
	html+=	   "	</td>";
	html+=	   "</tr>";
	var line = $(html);
	//版定删除按钮事件
	$(".remove-btn",line).click(function(){
		$.messager.confirm('确认', '您确定要删除记录？', function(r) {
			if(r){ 
				delLine(line);
			}
		});
	});
	
	$.parser.parse(line);//解析esayui标签
	table.append(line);
	//加载下拉框信息
	if(i==0){
		initSQLInfoFirst(i);
	}else{
		initSQLInfo(i);
	}
	$("#commandx"+i).val("0");//默认值为0，为后台拼接字符串使用
}

//删除全部
function delAllLine(b){
	if(b){
		$(".tb-line").each(function(i,line){
			delLine($(line));
		});
	}
}
//删除单行
function delLine(line){
	if(line){
		line.fadeOut("fast",function(){
			 $(this).remove();
		});
	}
}

function initSQLInfoFirst(i){
	//所属目录
	$('#folderId'+i).combotree({
		  url:"task/treeFolder.action?id=NULL",
		  required: true
	}); 
	// 数据连接
	$("#connectionId"+i).combobox( {
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,//不可编辑 
		url : 'tbMdTable/listConnnect.action'
	});
	// 执行方式
	$("#transRule"+i).combobox( {
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,//不可编辑 
		url : 'sysDictionaryData/getValues.action?dictValue=SQL_TYPE'
	});
	
}
function initSQLInfo(i){
	//所属目录
	$('#folderId'+i).combotree({
		  url:"task/treeFolderBatch.action?id=NULL",
//		  value:'-1',
		  required: true,
		  onLoadSuccess: function () { 
				$('#folderId'+i).combotree('setValue', '-1').combotree('setText', '同上');
		  }
	}); 
	// 数据连接
	$("#connectionId"+i).combobox( {
		valueField : 'connectionId',
		textField : 'connectionName',
		editable : false,//不可编辑 
		required:true,
		url : 'tbMdTable/listConnnectBatch.action',
//		value:'-1'
		onLoadSuccess: function () { 
			$('#connectionId'+i).combobox('setValue', '-1').combobox('setText', '同上');
		}
	});
	// 执行方式
	$("#transRule"+i).combobox( {
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,//不可编辑 
		required: true,
		url : 'sysDictionaryData/getValuesBatch.action?dictValue=SQL_TYPE',
//		value:'-1'
		onLoadSuccess: function () { 
			$('#transRule'+i).combobox('setValue', '-1').combobox('setText', '同上');
		 }
	});
}
