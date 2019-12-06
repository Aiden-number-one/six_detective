//执行脚本信息
$("#btn-save").click(function() {
	if ($("#editForm").form('validate')) {
		var scriptInfo = $('#scriptInfo').val();
		if(scriptInfo == null || scriptInfo == ""){
			Peony.alert('提示', "执行脚本不能为空", 'info');
		}else{
			var varstr = $('#version_before').val();
			var version = $('#version').val();
			var data = {};
			data.scriptInfo=scriptInfo;
			data.befVersion=varstr;
			data.version=version;
			$("#show_tips").text('正在执行中，请稍候...');
			$("#btn-save").linkbutton("disable");//按钮不可用
			$.ajax('verInfo/executeInfo.action', {
				type : 'post',
				dataType : 'json',
				data : data,
				success : function(data) {
					$("#show_tips").text('');
					$("#btn-save").linkbutton('enable');
					searchBefore();
					if(data.rInfo=="s"){
						$.messager.alert('提示', data.info, 'info');
					}else{
						alert(data.info);
//						$.messager.alert("操作提示", "执行升级脚本出错！", "error", function () {
//				            data.info
//				        });
					}
				},
				error : function() {
					$("#show_tips").text('');
					$("#btn-save").linkbutton('enable');
					$.messager.alert('错误', data.info, 'error');
				}
			});
		}
		}
		
});

//清空脚本
$("#btn-remove").click(function() {
	$('#scriptInfo').val("");
});

//查询现有信息
function searchBefore(){
	var data = {};
	//获取已有信息
	$.ajax('verInfo/dataInfo.action', {
		type : 'post',
		dataType : 'json',
		data : data,
		success : function(data) {
//			alert(JSON.stringify(data.rows.version));
//			alert(JSON.stringify(data.rows.upgradetime));
			$("#version_before").val(data.rows.version);
			$("#upgradetime_before").val(data.rows.upgradetime);
		},
		error : function() {
			Peony.alert('错误', '查询信息失败！', 'error');
		}
	});
}

