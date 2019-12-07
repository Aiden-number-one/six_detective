$("#btn-clear").click(function() {
	if ($("#editForm").form('validate')) {
		$("#show_tips").text('正在执行中，请稍候...');
		$("#btn-clear").linkbutton("disable");
		$.ajax('logClear/dc.action', {
			type : 'post',
			dataType : 'json',
			data : {
				startDate : $("#startDate").datetimebox('getValue'),
				endDate : $("#endDate").datetimebox('getValue')
			},
			success : function(data) {
				$("#show_tips").text('');
				$("#btn-clear").linkbutton('enable');
				Peony.alert('提示', '执行日志清除成功！', 'info');
			},
			error : function() {
				$("#show_tips").text('');
				$("#btn-clear").linkbutton('enable');
				Peony.alert('错误', '执行失败！', 'error');
			}
		});
	}
});
