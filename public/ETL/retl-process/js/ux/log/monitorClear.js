
//清除日志信息
$("#btn-clear").click(function () {
	if ($("#editForm").form('validate')) {
		var jid = $('#jobId').combobox('getValue');
		var batchStrat = $('#batchStrat').val();
		var batchEnd = $('#batchEnd').val();
		var timeStart = $('#timeStart').datetimebox('getValue');
		var timeEnd = $('#timeEnd').datetimebox('getValue');
		var strr = ""; // 提示信息
		if (jid == '' || jid == null) {
			strr = '如果不选择作业信息，将会清除所有的日志信息，确认删除吗？';
		} else {
			strr = '确实要删除该作业日志信息吗？';
		}
		$.messager.confirm('确认提示', strr, function (r) {
			if (r) {
				$("#show_tips").text('正在执行中，请稍候...');
				//				$("#btn-clear").linkbutton("disable");// 按钮不可用
				$("#btn-clear").attr('disabled', true);
				$.ajax({
					type: 'get',
					//					dataType : 'json',
					url: 'monitorClear/dClear.action?jid=' + jid + "&batchStrat=" + batchStrat + "&batchEnd=" + batchEnd + "&timeStart=" + timeStart + "&timeEnd=" + timeEnd,
					success: function success(data) {
						if (data.info == '') {
							$("#show_tips").text('');
							//							$("#btn-clear").linkbutton('enable');
							$("#btn-clear").attr('disabled', false);
							Peony.alert('提示', '监控信息清除成功！', 'info');
						} else {
							Peony.alert('提示', data.info, 'error');
						}
					},
					error: function error() {
						$("#show_tips").text('');
						$("#btn-clear").attr('disabled', false);
						Peony.alert('错误', '执行失败！', 'error');
					}
				});
			}
		});
	}
});

/**
 * 强制复位
 */
$("#btn-reset").click(function () {
	if ($("#editForm").form('validate')) {
		var jid = $('#jobId').combobox('getValue');
		var strr = ""; // 提示信息
		if (jid == '' || jid == null) {
			strr = '如果不选择作业信息，将会复位所有的监控信息，确认复位吗？';
		} else {
			strr = '确实要复位该作业监控信息吗？';
		}
		$.messager.confirm('确认提示', strr, function (r) {
			if (r) {
				$("#show_tips").text('正在执行中，请稍候...');
				//				$("#btn-reset").linkbutton("disable");// 按钮不可用
				$.ajax('monitorClear/doReset.action', {
					type: 'post',
					dataType: 'json',
					data: {
						jid: jid
					},
					success: function success(data) {
						$("#show_tips").text('');
						//						$("#btn-reset").linkbutton('enable');
						Peony.alert('提示', '监控信息复位成功！', 'info');
					},
					error: function error() {
						$("#show_tips").text('');
						//						$("#btn-reset").linkbutton('enable');
						Peony.alert('错误', '执行失败！', 'error');
					}
				});
			}
		});
	}
});

//导出CSV文件信息
function exportCSV() {
	if ($("#editForm").form('validate')) {
		var jid = $('#jobId').combobox('getValue');
		var batchStrat = $('#batchStrat').val();
		var batchEnd = $('#batchEnd').val();
		var timeStart = $('#timeStart').datetimebox('getValue');
		var timeEnd = $('#timeEnd').datetimebox('getValue');
		var strr = ""; // 提示信息
		if (jid == '' || jid == null) {
			strr = '如果不选择作业信息，将会导出所有的日志信息，确认导出吗？';
		} else {
			strr = '确实要导出该作业日志信息吗？';
		}
		$.messager.confirm('确认提示', strr, function (r) {
			if (r) {
				//				$("#show_tips").text('正在执行中，请稍候...');
				//				$("#btn-export").attr('disabled',true);
				//				$.ajax({
				//					type : 'get',
				////					dataType : 'json',
				//					url : 'monitorClear/exportCSV.action?jid='+jid+"&batchStrat="+batchStrat+"&batchEnd="+batchEnd
				//						+"&timeStart="+timeStart+"&timeEnd="+timeEnd,
				//					success : function(data) {
				//						console.log(data);
				//					}
				//				});
				//				$.ajax('allObjects/exportXMLURL.action', {
				//					type : 'post',
				//					dataType : 'json',
				//					data : data,
				//					success : function(result) {
				//						if(result){
				window.location.href = 'monitorClear/exportCSV.action?jid=' + jid + "&batchStrat=" + batchStrat + "&batchEnd=" + batchEnd + "&timeStart=" + timeStart + "&timeEnd=" + timeEnd;
				//						}
				//					}
				//				});
			}
		});
	}
}