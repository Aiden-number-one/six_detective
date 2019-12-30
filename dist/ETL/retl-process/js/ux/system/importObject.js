//导入信息
//function importInfo2() {
////	var fileName=$("#froFile").val();
////	if (fileName == "" || fileName == null ) {
////		Peony.alert('警告', '请选择待上传文件.', 'warning');
////	}else{
////		var data = {};
////		data : $( '#searchForm').serialize();
////		data.fileName=fileName;
//		$.ajax( {
//			cache: true,
//			type: "post",
//			url:'allObjects/uploadFile.action',
//			data:$('#searchForm').serialize(),// 你的formid
//			async: false,
//			success : function(data) {
//				if(data.info == ""){
//					Peony.alert('提示', '导入文件信息成功', 'info');
//					showdata("");
//					$('#tt').datagrid('loadData', eval(data.dataList));
//				}else{
//					Peony.alert('错误', data.info, 'error');
//					$("#ttdiv").empty();
//				}
//			},
//			error : function() {
//				Peony.alert('错误', data.info, 'error');
//				$("#ttdiv").empty();
//			}
//		});
//		
////	}
//};
////选择xml文件
//function importInfoXML(){
//	var filename=$("#file").val()
//	var filetype=filename.substring(filename.length-3,filename.length);
//	if (fileName == "" || fileName == null ) {
//		Peony.alert('警告', '请选择待上传文件.', 'warning');
//		return false;
//	}
//	if(filetype != "xml"){
//		Peony.alert('警告', '只能选择xml格式文件.', 'warning');
//	}else{
//		var formData = new FormData();
//		formData.append('file', $('#file')[0].files[0]);
//		$.ajax({
//		    url: 'allObjects/importXML.action',
//		    type: 'POST',
//		    cache: false,
//		    data: formData,
//		    processData: false,
//		    contentType: false
//		}).done(function(res) {
//			if(res.info == ""){
//				$("#div1").hide();
//				$("#ttdiv").show();
//				Peony.alert('提示', '导入文件信息成功', 'info');
//				showdata("");
//				$('#tt').datagrid('loadData', eval(res.dataList));
//			}else if(res.info == "1"){
//				Peony.alert('提示', '导入的文件中没有对应的对象资料信息，请检查文件内容。', 'warning');
//				$("#div1").empty();
//				showdata("");
//				$('#tt').datagrid('loadData', eval(res.dataList));
//			}else{
////				Peony.alert('错误', res.info, 'error');
//				$("#div1").show();
//				$("#ttdiv").hide();
//				$("#div1").empty();
//				$("#div1").html(res.info);
//			}
//		}).fail(function(res) {
////			Peony.alert('错误', res.info, 'error');
//			$("#div1").show();
//			$("#ttdiv").hide();
//			$("#div1").empty();
//			$("#div1").html(res.info);
//		});
//	}
////	
//}

//选择txt格式文件
function importInfo(){
	var filename=$("#file").val()
	var filetype=filename.substring(filename.length-3,filename.length);
	if(filetype != "txt"){
		Peony.alert('警告', '只能选择txt格式文件.', 'warning');
	}else{
		var formData = new FormData();
		formData.append('file', $('#file')[0].files[0]);
		$.ajax({
		    url: 'allObjects/importTXT.action',
		    type: 'POST',
		    cache: false,
		    data: formData,
		    processData: false,
		    contentType: false
		}).done(function(res) {
			if(res.info == ""){
				$("#div1").hide();
				$("#ttdiv").show();
				Peony.alert('提示', '导入文件信息成功', 'info');
				showdata("");
				$('#tt').datagrid('loadData', eval(res.dataList));
			}else if(res.info == "1"){
				Peony.alert('提示', '导入的文件中没有对应的对象资料信息，请检查文件内容。', 'warning');
				$("#div1").empty();
				showdata("");
				$('#tt').datagrid('loadData', eval(res.dataList));
			}else{
				$("#div1").show();
				$("#ttdiv").hide();
				$("#div1").empty();
				$("#div1").html(res.info);
			}
		}).fail(function(res) {
			$("#div1").show();
			$("#ttdiv").hide();
			$("#div1").empty();
			$("#div1").html(res.info);
		});
	}
//	
}

//查询信息
$("#btn-search").click(function() {
	var objectName=$('#search_objectName').val();
	var objectType=$('#search_objectType').combobox("getValue");
	var surl="allObjects/dataList2.action?objectName="+objectName+"&objectType="+objectType;
	surl = surl+"&random="+Math.random();//在这里。用encodeURI进行两次转码。后台Action接收的时候。在进行一次。就不会出现乱码问题
	surl = encodeURI(surl);
	surl = encodeURI(surl);
	showdata(surl);
});

//查询现有信息
function loadInfo(){
	var surl="allObjects/dataList.action";
	showdata(surl);
}
//展示待选择对象信息
function showdata(url){
	$('#tt').datagrid({
        url: url,
        rownumbers: true,
        singleSelect: false,
        pagination: true,//分页控件
        pageSize: 100,//每页显示的记录条数，默认为10 
	    pageList: [10, 30, 50, 100],  
        fitColumns: true,
        striped : true,//奇偶行显示不同背景色
        remoteSort : false,//前端排序
		columns : [ [ {
			title : '序号',
			field : 'objectId',
//			checkbox : true
			hidden : true
		},{
			field : 'objectType',
			hidden : true
		}, {
			field : 'objectTypeName',
			title : '对象类型',
			width : 120,
			sortable : true
		},{
			field : 'objectName',
			title : '对象名称',
			width : 140,
			sortable : true
		},{
			field : 'modifiedTime',
			title : '对象时间',
			width : 140,
			sortable : true
		}
		] ],
		 onClickRow:function(index,row){ //单击行事件  
	         //---------for TEST 结合SHIFT,CTRL,ALT键实现单选或多选------------  
	         if(index != selectIndexs.firstSelectRowIndex && !inputFlags.isShiftDown1 ){    
	             selectIndexs.firstSelectRowIndex = index; //alert('firstSelectRowIndex, sfhit = ' + index);  
	         }             
	         if(inputFlags.isShiftDown1 ) {  
	             $('#tt').datagrid('clearSelections');  
	             selectIndexs.lastSelectRowIndex = index;  
	             var tempIndex = 0;  
	             if(selectIndexs.firstSelectRowIndex > selectIndexs.lastSelectRowIndex ){  
	                 tempIndex = selectIndexs.firstSelectRowIndex;  
	                 selectIndexs.firstSelectRowIndex = selectIndexs.lastSelectRowIndex;  
	                 selectIndexs.lastSelectRowIndex = tempIndex;  
	             }  
	             for(var i = selectIndexs.firstSelectRowIndex ; i <= selectIndexs.lastSelectRowIndex ; i++){  
	                 $('#tt').datagrid('selectRow', i);     
	             }     
	         }             
	         //---------for TEST 结合SHIFT,CTRL,ALT键实现单选或多选------------  
	     }/*,
	     onLoadSuccess:function(){
             $('#tt').datagrid('selectAll');
         }*/
     })
}

function insertTitle(path){  
	   var test1 = path.lastIndexOf("/");  //对路径进行截取
	   var test2 = path.lastIndexOf("\\");  //对路径进行截取
	   var test= Math.max(test1, test2)
	   if(test<0){  
	     document.getElementById("test").value = path;
	   }else{
	    document.getElementById("test").value = path.substring(test + 1); //赋值文件名
	   }  
}
