//查询帮助信息里提示信息
function searchRemarks(obj){
	var rModuleName='';//所属模块
	var rTableName='';//所属表名称
	var forId=$(obj).attr("id");//所属ID
//	var formName=$(obj).attr("data-form");
	var formName=$(obj).parents('form').attr('id');
//	console.log(formName);
	var data = $('#'+formName).serializeArray();
//	console.log(data);
//	console.log($("#updateFormb").serialize());
	for(var i=0;i<data.length;i++){
		if(data[i].name == 'rModuleName'){
			rModuleName=data[i].value;
		}
		if(data[i].name == 'rTableName'){
			rTableName=data[i].value;
		}
		if(rModuleName != '' && rTableName != ''){
			break;
		}
	}
//	DomElement=document.getElementById(forId);
//	var cid=DomElement.getAttribute('id');
//	console.log(rModuleName+"------"+rTableName+"----------"+forId);
	$.ajax({
		type : "get",
		dataType : 'json',
		url : "verInfo/searchRemarks.action?moduleName=" + rModuleName + "&tableName=" +rTableName+ "&columnName="+forId,
		success : function(reslut) {
			if(reslut.remarksInfo != '' && reslut.remarksInfo != null){
				$('#'+forId).tooltip({
					position: 'right',
					content: '<span style="color:black;border:0px solid blue;width:200px;display:inline-block;">'+reslut.remarksInfo+'.</span>',
					onShow: function(){
						$(this).tooltip('tip').css({
							backgroundColor: '#FFFFE0',
							borderColor: '#778899'
						});
					}
				});
//				console.log(reslut.remarksInfo);
				$('#'+forId).tooltip("show");
			}
		}
	});
}

function destroyShow(obj){
	var forId=$(obj).attr("id");
//	console.log("destroy-------"+forId);
	$('#'+forId).tooltip("destroy");
}
