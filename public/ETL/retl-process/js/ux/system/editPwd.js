$(function() {
	$("#fromResult").trigger("click");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	
});
//修改密码功能
function savePwd(){
	if ($("#pwdForm").form('validate')) {//启用校验
		var data=$('#pwdForm').serialize();
		$.ajax({  
			type: "POST",  
			url: "sysIndex/updatePwd.action",  
			data: data,  
			success: function(msg){  
				if(msg.flag == false){
					$.messager.alert('提示', msg.info, 'info');
					$("#oldPwd").val("").focus();
				}else{
					$.messager.alert('提示', msg.info, 'info');
					$("#fromResult").trigger("click");
				}
			}  
		});
	}
	
}

