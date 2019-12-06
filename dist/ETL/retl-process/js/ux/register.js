$("#sub_reg").click(function() {
	var form = $("#registerForm");
	if (form.form('validate')) {
		Peony.progress();
		form.attr('action', "register.action");
		Peony.submitForm(form, function(data) {
			Peony.closeProgress();
			if (data.success) {
				window.location= "index";
			} else {
				Peony.alert('提示', data.msg, 'warning');
			}
		});
	}
});

// ------------------------------发送手机验证码
var InterValObj; // timer变量，控制时间
var count = 60; // 间隔函数，1秒执行
var curCount;// 当前剩余秒数
var code = ""; // 验证码
function sendMessage() {
	curCount = count;
	if ($("#name").val() == "") {
		Peony.alert('错误', '手机号码不能为空！', 'error');
		return false;
	}
	if ($("#pwd").val() == "") {
		Peony.alert('错误', '密码不能为空！', 'error');
		return false;
	}
	// 向后台发送处理数据
	$.ajax({
		type : "POST", // 用POST方式传输
		dataType : "text", // 数据格式:JSON
		url : 'register/sendSMS.action?name=' + $("#name").val() + '&pwd=' + $("#pwd").val(), // 目标地址
		error : function(XMLHttpRequest, textStatus, errorThrown) {
		},
		success : function(msg) {
		}
	});
	// 设置button效果，开始计时
	$("#btnSendCode").attr("disabled", "true");
	$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
	InterValObj = window.setInterval(setRemainTime, 1000); // 启动计时器，1秒执行一次
}
// timer处理函数
function setRemainTime() {
	if (curCount == 0) {
		window.clearInterval(InterValObj);// 停止计时器
		$("#btnSendCode").removeAttr("disabled");// 启用按钮
		$("#btnSendCode").val("重新发送验证码");
		code = ""; // 清除验证码。如果不清除，过时间后，输入收到的验证码依然有效
	} else {
		curCount--;
		$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
	}
}