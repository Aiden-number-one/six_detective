var conId="";
$(function() {
	showDriveList();
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	$('#data-list2').datagrid({
		toolbar : '#tb2'
	});
	//datagrid跟随浏览器调整大小
	$(window).resize(function() {
//		$("#cc").css("height", document.body.clientHeight-5);
//		$("#west").css("height", document.body.clientHeight-48); 
////		$("#center").css("height", document.body.clientHeight-5);
//		$("#center").css("width", document.body.clientWidth-$("#west").width()-50); 
//		$("#databasetype2").css("width",$("#driveName2").width());
////		$("#width_title").css("width", document.body.clientWidth-$("#west").width()-10); 
//		$("#updateFormb").css("height", document.body.clientHeight-110).css("width", document.body.clientWidth-$("#west").width()-10);
		$("#updateFormb").css("height", document.body.clientHeight-110); 
//		$('#data-list,data-list2').datagrid('resize', {
//			width : $(window).width() - $("#west").width()-25
//		});
	});
	
	$("#addJarInfo2").unbind('click').click(function(){
		$('#forImportJarWin').window('open');
		$("#libraries").val("");
		$("#ifADD").val("2");//编辑时
	});
	$("#addJarInfo").unbind('click').click(function(){
		$('#forImportJarWin').window('open');
		$("#libraries").val("");
		$("#ifADD").val("1");//新增
	});
});

function importData(){
	alert('点击编辑db');
}
//---------------------------------------驱动信息----------------
//加载驱动列表信息
function showDriveList(){
	var data={};
	$.ajax('driverInfo/dataList.action', {
		type : 'post',
		dataType : 'json',
		data : data,
		success : function(data) {
			//清除原有信息
			$("#groupdrive > li").each(function(){ 
					$(this).remove();
			});
			for(var i = 0; i < data.rows.length; i++){
				//console.log(data.rows[i].iconName);//图标信息
				var style=data.rows[i].statetype;
				var disableds = style == 1 ? 'disabled' : '';
			   var driveInfo='<li class="list-group-item clearfix" driveId="'+data.rows[i].driveId+'" statetype="'+data.rows[i].statetype+'">'
//				   		+'<i class="glyphicon glyphicon-random pull-left"></i>'
			   			+'<img src="images/db/'+data.rows[i].iconName+'.jpg" class="pull_img" />'
			   			+'<h5 class="text-nowrap pull-left">'+data.rows[i].driveName+'</h5>'
			   			+'<button driveId="'+data.rows[i].driveId+'" '+disableds+'  class="glyphicon glyphicon-trash pull-right" ></button>  ';
				$("#groupdrive").append(driveInfo);
			}
			//点击编辑驱动信息
			$('#driveManager ul>li').bind('click',load_driveManager);
			//点击删除信息
			$('#driveManager ul li button').bind('click',delDriveInfo);
			//默认查询第一条信息
			//改为初次加载第一个，其他加载之前选中的信息
			var forSearchId=$("#forSearchId").val();
			var lastId;//当前选中的connectionId
			var index;//待选中li个数
			if(forSearchId == '' || forSearchId == 'undefined'){
				lastId=data.rows[0].driveId;
			}else{
				lastId=forSearchId;
			}
			var connections =document.getElementsByTagName('li');
			for(var i=0;i<connections.length;i++){
				if($(connections[i]).attr('driveId')==lastId){
					index=i;
				}
			}
//			DriveInfoById(driveid,"");
			$('#groupdrive>li').eq(index).trigger('click');//添加背景色
			$("#driveId2").val(lastId);
			$("#ifADD").val("2");//编辑
		},
		error : function() {
			$.messager.alert('提示', '执行失败,请联系系统管理员.', 'error');
		}
	});
	
}

//检查驱动名称唯一性
function checkName(){
	var driveName=$("#driveName").val();
	//判断是否为空
	if(driveName != ''){
		//查询是否已有该名称,不区分大小写
		$.ajax({  
			type: "get",  
			url: "driverInfo/existName.action?driveName="+driveName,  
			success: function(data){ 
				if(data){
					$.messager.alert('提示', '该驱动名称已存在，请重新输入', 'warning');
					$("#driveName").focus();
				}
			}
		});
	}
	
}
//检查驱动名称唯一性,编辑时
function checkName2(){
	var driveName=$("#driveName2").val();
	var befdriveName=$("#befdriveName").val();
	//判断是否为空
	if(driveName != '' && driveName != befdriveName){
		//查询是否已有该名称,不区分大小写
		$.ajax({  
			type: "get",  
			url: "driverInfo/existName.action?driveName="+driveName,  
			success: function(data){ 
				if(data){
					$("#driveName2").focus();
					$.messager.alert('提示', '该驱动名称已存在，请重新输入', 'warning');
				}
			}
		});
	}
}

//新增驱动
function forAddInfo(){
	$('#driveAdmin').window('open');
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	$("#fromResult").trigger("click");
	$("#forName").text("");
	$("#driveId").val("");
	$("#statetype").val("");
	initData("databasetype");//数据库类型
	initCategory("category");//驱动类型
	$("#databasetype").combobox('setValue','1');//默认选中
	changePost('1','category');
	$("#category").combobox('setValue','13');
	$("#ifADD").val("1");//新增
	$('#data-list').datagrid({
		toolbar : '#tb'
	});
	$('#data-list').datagrid('loadData', {
		total : 0,
		rows : []
	});
}

function initData(id){
	$("#"+id).combobox( {
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,//不可编辑 
		url : 'sysDictionaryData/getValues.action?dictValue=DATABASETYPE',
		onChange : function(newValue, oldValue) {
			changePost(newValue,id);
		},
	});
}
function initCategory(id){
	$("#"+id).combobox( {
		valueField : 'dictdataValue',
		textField : 'dictdataName',
		editable : false,//不可编辑 
		url : 'sysDictionaryData/getValues.action?dictValue=CATEGORY'
	});
}
//端口号是否为必填项判断
function changePost(idValue,id){
//	console.log(idValue);
	if(idValue == '1'){//关系型数据库
		if(id.indexOf('2') == -1){//新增时
			$('#post2,#maxtime2').validatebox({ 
				required : false, 
			});
		}else{
			$('#post2,#maxtime2').validatebox({ 
				required : true, 
			});
		}
	}else{//文本型数据库
		$('#post2,#maxtime2').validatebox({ 
			required : false, 
		});
	}
}
//保存--新增时
function saveDriveInfo(){
	if ($("#editFormb").form('validate')) {//启用校验
		$.ajax({  
			type: "POST",  
			url: "driverInfo/save.action",  
			data: $("#editFormb").serialize(),  
			success: function(data){  
				$.messager.alert('提示', '保存成功', 'info');
				$("#fromResult").trigger("click");
				$('#driveAdmin').window('close');
				showDriveList();
				//编辑或新增时保存，驱动链接回显时使用
				$("#forSearchId").val(data.driveId);
			},
			error : function(data) {
				$.messager.alert('提示', data.info, 'error');
			}
		});
	}
}
//保存--编辑时
function saveDriveInfo2(){
	if ($("#updateFormb").form('validate')) {//启用校验
		$.ajax({  
			type: "POST",  
			url: "driverInfo/save.action",  
			data: $("#updateFormb").serialize(),  
			success: function(data){  
				$.messager.alert('提示', '保存成功', 'info');
				$("#fromResult2").trigger("click");
				showDriveList();
				//编辑或新增时保存，驱动链接回显时使用
				$("#forSearchId").val(data.driveId);
			},
			error : function(data) {
				$.messager.alert('提示', '执行失败:'+data.info, 'error');
			}
		});
	}
}

//重置
function resetDriveInfo(){
//	$("#fromResult2").trigger("click");
	$("#fromResult2").empty();
	var category=$("#category2").combobox("getValue");
	$.ajax({  
		type: "get",  
		dataType : 'json',
		url: "driverInfo/getDefalultById.action?category="+category,  
		success: function(data){
			displayDriverIcon(data);
			if(data){
				$("#updateFormb").form('myLoad', data);
				$("#forName").text(data.driveName);
				$("#befdriveName").val(data.driveName);
//				if(data.address != ''){
//					$("#forAddr").show();
					$("#address2").val(data.address);
//				}else{
//					$("#forAddr").hide();
//				}
				$("#databasetype2").combobox('setValue',data.databasetype);
				changePost(data.databasetype,'category2');
				$("#category2").combobox('setValue',data.category);
				if(data.post=='0'){
					$("#post2").val("");
				}
				if(data.maxtime=='0'){
					$("#maxtime2").val("");
				}
			}
		}  
	});  
}

/**
 * 显示驱动图标
 * @param data
 */
function displayDriverIcon(data) {
	if (data.category == 1) {
		$("#forName-img").attr('src', 'images/db/mysql_name.jpg')
	} else if (data.category == 2) {
		$("#forName-img").attr('src', 'images/db/oracle_name.jpg')
	} else if (data.category == 3) {
		$("#forName-img").attr('src', 'images/db/sqlserver_name.jpg')
	} else if (data.category == 4) {
		$("#forName-img").attr('src', 'images/db/h2_name.jpg')
	} else if (data.category == 5) {
		$("#forName-img").attr('src', 'images/db/db2_name.jpg')
	} else if (data.category == 6) {
		$("#forName-img").attr('src', 'images/db/access_name.jpg')
	} else if (data.category == 7) {
		$("#forName-img").attr('src', 'images/db/hsqldb_name.jpg')
	} else if (data.category == 8) {
		$("#forName-img").attr('src', 'images/db/csv_name.jpg')
	} else if (data.category == 9) {
		$("#forName-img").attr('src', 'images/db/txt_name.jpg')
	} else if (data.category == 10) {
		$("#forName-img").attr('src', 'images/db/xls_name.jpg')
	} else if (data.category == 11) {
		$("#forName-img").attr('src', 'images/db/PostgreSQL_name.jpg')
	} else if (data.category == 12) {
		$("#forName-img").attr('src', 'images/db/sybase_name.jpg')
	} else if (data.category == 13) {
		$("#forName-img").attr('src', 'images/db/other_name.jpg')
	} else if (data.category == 14) {
		$("#forName-img").attr('src', 'images/db/sap_name.jpg');
	} else if (data.category == 15) {
		$("#forName-img").attr('src', 'images/db/olap_name.jpg');
	}
}

//取消
function cancleDriveInfo(){
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if(r){ 
			$("#fromResult").trigger("click");
			$('#driveAdmin').window('close');
		}
	});
}

//添加背景色
function load_driveManager(){
	var _this = $(this);
	if(!_this.hasClass('c-li-active')){
		_this.addClass('c-li-active');
		_this.siblings('li').removeClass('c-li-active');
	}
	editDriveInfo(_this);
}

//driverManager li 点击事件--编辑
function editDriveInfo(_this){
	$("#fromResult2").trigger("click");
//	var driveId=$(this).attr('driveId');
	var driveId=$(_this).attr('driveId');
	var style=$(_this).attr('statetype');
	$.ajax({  
		type: "get",  
		dataType : 'json',
		url: "driverInfo/getId.action?driveId="+driveId+"&stateType="+style,  
		success: function(data){  
			loadAjaxInfo(data);
		}  
	});  
}
//查询后加载信息
function loadAjaxInfo(data){
	displayDriverIcon(data);
	initData("databasetype2");
	initCategory("category2");//驱动类型
	$("#updateFormb").form('myLoad', data);
	$("#forName").text(data.driveName);
	$("#befdriveName").val(data.driveName);
	$("#TopnString2").val(data.TopnString);
//	if(data.address != ''){
//		$("#forAddr").show();
		$("#address2").val(data.address);
		$("#beforeAddress2").val(data.address);
//	}else{
//		$("#forAddr").hide();
//	}
	$("#databasetype2").combobox('setValue',data.databasetype);
	changePost(data.databasetype,'category2');
	$("#category2").combobox('setValue',data.category);
	if(data.post=='0'){
		$("#post2").val("");
	}
	if(data.maxtime=='0'){
		$("#maxtime2").val("");
	}
	$("#forRModuleName").val("DRIVEINFO");
	$("#forRTableName").val("TB_DRIVEINFO");
	$('#data-list2').datagrid('loadData', data.jarInfoMap);
	$("#ifADD").val("2");//编辑
}

//编辑--传参查询方法
function DriveInfoById(id,style){
	$.ajax({  
		type: "get",  
		dataType : 'json',
		url: "driverInfo/getId.action?driveId="+id+"&stateType="+style,  
		success: function(data){ 
			loadAjaxInfo(data);
		}  
	});  
}

//删除--驱动
function delDriveInfo(){
	var driveId=$(this).attr('driveId');
	$.messager.confirm('确认', '您确定要删除信息吗？', function(r) {
		if(r){ 
			$.ajax({  
				type: "get",  
				dataType : 'json',
				url: "driverInfo/delete.action?driveId="+driveId,  
				success: function(msg){  
					$.messager.alert('提示', msg.info, 'info');
					showDriveList();
				}  
			}); 
		}
	});
}


//上传信息
function importInfo(){
	var ifAdd=$("#ifADD").val();
	var filename=$("#libraries").val();
//	var filetype=filename.substring(filename.length-3,filename.length);
	if(filename == ""){
		$.messager.alert('提示', '请选择待上传文件!', 'warning');
	}else{
//		if(filetype != "jar"){
//			$.messager.alert('提示', '只能选择.jar文件!', 'warning');
//		}else{
			var formData = new FormData();
			formData.append('file', $('#libraries')[0].files[0]);
			if(ifAdd == '2'){//编辑时
				formData.append('driveId', $('#driveId2').val());
			}else{
				formData.append('driveId', '');//新增
			}
			$.ajax({
			    url: 'driverInfo/importJAR.action',
			    type: 'POST',
			    cache: false,
			    data: formData,
			    processData: false,
			    contentType: false
			}).done(function(res) {
				if(res.info == ""){
					$.messager.alert('提示', '导入成功', 'info');
					var fname='';
					if(filename.indexOf('C:\\fakepath\\') == -1){
						fname=filename;
					}else{
						fname=filename.replace('C:\\fakepath\\','');
					}
//					console.log(fname);
					if(ifAdd == '2'){
						var dId=$('#driveId2').val();
						//追加数据
						$('#data-list2').datagrid('appendRow', {
							driveId : dId,
							addressInfo : fname,
							_operate : '<button class="btn btn-xs ibtn" type="button" onclick="deleteJar(\'' + fname
							+ '\',\'' + dId
							+ '\')"><i class="glyphicon glyphicon-remove"></i></button>'
						});
						var bname=$("#beforeAddress2").val();
						if(bname != null && bname != ""){
							filename=bname+","+filename;
						}
						$("#address2").val(filename);
					}else{
						var dId="";
						//追加数据
						$('#data-list').datagrid('appendRow', {
							driveId : dId,
							addressInfo : fname,
							_operate : '<button class="btn btn-xs ibtn" type="button" onclick="deleteJar(\'' + fname
							+ '\',\'' + dId
							+ '\')"><i class="glyphicon glyphicon-remove"></i></button>'
						});
						var bname=$("#address").val();
						if(bname != null && bname != ""){
							filename=bname+","+filename;
						}
						$("#address").val(filename);
					}
				
				}else{
					$.messager.alert('提示', "导入失败，原因是："+res.info, 'error');
				}
			}).fail(function(res) {
				$.messager.alert('提示', "导入失败，原因是："+res.info, 'error');
			});
		}
		$('#forImportJarWin').window('close');
//	}
}

$('#data-list2').datagrid({
//			title : 'Jar包',
			url :'',
			idField : 'defaultAddress',
			pagination : false,// 分页
			rownumbers : true,
			singleSelect : true,
			striped : true,// 奇偶行显示不同背景色
			checkOnSelect : true,
			fitColumns : true,
			remoteSort : false,
			columns : [ [
					{
						field : 'driveId',
						hidden : true
					},
					{
						field : 'addressInfo',
						title : 'Jar文件名',
						width : '87%',
						sortable : true
					},
					{
						field : '_operate',
						title : '操作',
						width : '13%',
						formatter : function(value, row, index) {
							return '<button class="btn btn-xs ibtn" type="button" onclick="deleteJar(\'' + row.addressInfo
									+ '\',\'' + row.driveId
									+ '\')"><i class="glyphicon glyphicon-remove"></i></button>';
						}
					} ] ]
})

// 删除JAR包信息
function deleteJar(addressInfo, driveId) {
	var ifAdd=$("#ifADD").val();
	addressInfo = encodeURI(addressInfo);
	addressInfo = encodeURI(addressInfo);
	$.messager.confirm('确认', '您确定要删除信息吗？', function(r) {
		if (r) {
			$.ajax({
				type : "get",
				dataType : 'json',
				url : "driverInfo/deleteJar.action?addressInfo=" + addressInfo+"&driveId="+driveId+"&ifAdd="+ifAdd,
				success : function(result) {
					if(result.msg !=""){//删除不成功
						$.messager.alert('提示', result.msg, 'warning');
					}
					if(ifAdd == '2'){
						$('#data-list2').datagrid('loadData', result.data.jarInfoMap);
						$("#beforeAddress2").val(result.data.beforeAddress);
						$("#address2").val(result.data.beforeAddress);
					}else{
						//datagrid显示
						var row = $("#data-list").datagrid('getSelected');//选中的信息
						if (row) {
							var rowIndex = $('#data-list').datagrid('getRowIndex', row);
//							console.log("rowIndex====="+rowIndex);
							$('#data-list').datagrid('deleteRow', rowIndex);
							var rowsss = $('#data-list').datagrid("getRows");
							$('#data-list').datagrid("loadData", rowsss);
							//文件名称处理
							var deAddr=row.addressInfo;//删除的文件名称
							var forAddr=$("#address").val();
							if(forAddr.indexOf(",") == -1){
								forAddr=forAddr.replace('C:\\fakepath\\'+deAddr,'');
							}else{
								//TODO 首位时处理
								forAddr=forAddr.replace(',C:\\fakepath\\'+deAddr,'');
							}
							$("#address").val(forAddr);
//							console.log("address-----"+forAddr);
						}
					}
				}
			});
		}
	});
}

$('#data-list').datagrid({
			url :'',
			idField : 'addressInfo',
			pagination : false,// 分页
			rownumbers : true,
			singleSelect : true,
			striped : true,// 奇偶行显示不同背景色
			checkOnSelect : true,
			fitColumns : true,
			remoteSort : false,
			columns : [ [
					{
						field : 'driveId',
						hidden : true
					},
					{
						field : 'addressInfo',
						title : 'Jar文件名',
						width : '87%',
						sortable : true
					},
					{
						field : '_operate',
						title : '操作',
						width : '13%',
						formatter : function(value, row, index) {
							return '<button class="btn btn-xs ibtn" type="button" onclick="deleteJar(\'' + row.addressInfo
									+ '\',\'' + row.driveId
									+ '\')"><i class="glyphicon glyphicon-remove"></i></button>';
						}
					} ] ]
	})