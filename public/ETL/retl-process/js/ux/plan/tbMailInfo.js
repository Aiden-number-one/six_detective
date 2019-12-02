$package('Peony.tbMailInfo');
Peony.tbMailInfo = function() {
	var _box = null;
	var _this = {
	config : {
		action : {
			save : 'tbMailInfo/save.action', //新增&修改 保存Action  
			getId : 'tbMailInfo/getId.action',//编辑获取的Action
			remove : 'tbMailInfo/delete.action',//删除数据的Action
			testAction : 'tbMailInfo/testInfo.action'//测试的Action
		},
		dataGrid : {
			title : '邮件信息',
			url : 'tbMailInfo/dataList.action',
			idField : 'mailId',
			columns : [ [ {
				field : 'mailId',
				checkbox : true
			}, {
				field : 'mailName',
				title : '邮件名称',
				width : 70,
				sortable : true
			}, {
				field : 'recieveAddress',
				title : '收件人地址',
				width : 80,
				sortable : true
			}, {
				field : 'ccAddress',
				title : '抄送人地址',
				width : 80,
				sortable : true
			}, {
				field : 'sendAddress',
				title : '发件人地址',
				width : 80,
				sortable : true
			}, 
			/*{
				field : 'smtpServer',
				title : 'SMTP服务器',
				width : 70,
				sortable : true
			}, {
				field : 'smtpPort',
				title : 'SMTP端口',
				width : 50,
				sortable : true
			},*/
			{
				field : 'validateFlag',
    				title : '是否用户验证',
				width : 45,
				sortable : true,
				formatter : function(value, row, index) {
					if (row.validateFlag == 'Y')
						return '是';
					else if (row.validateFlag == 'N')
						return '否';
				}
			}, {
				field : 'userName',
				title : '用户名',
				width : 40,
				sortable : true
			},{
				field : 'safeValidate',
				title : '使用安全验证',
				width : 45,
				sortable : true,
				formatter : function(value, row, index) {
					if (row.safeValidate == 'Y')
						return '是';
					else if (row.safeValidate == 'N')
						return '否';
				}
			}, {
				field : 'safeConnectTypeName',
				title : '安全连接类型',
				width : 40,
				sortable : true
			}
		] ],
		toolbar : [ {
			id : 'btnadd',
			text : '新增',
			btnType : 'add',
			handler : function() {
				_box.win.edit.dialog({
					buttons : [ {
						text : '测试',
						handler : function() {
							if (_box.form.edit.form('validate')) {
								_box.form.edit.attr('action', _this.config.action.testAction);
								Peony.progress('请稍候', '连接中...');
								//ajax提交form
								Peony.submitForm(_box.form.edit, function(data) {
									Peony.closeProgress();
									if (data.success) {
										Peony.alert('提示', data.msg, 'info');
										if (callback) {
											callback(data);
										}
									} else {
										Peony.alert('提示', data.msg, 'error');
									}
								});
							}
						}
					}, {
						text : '保存',
//						handler : _box.events.save
						handler : function() {
							var recieveAddress = $('#recieveAddress').val();
							var ccAddress = $('#ccAddress').val();
							if(recieveAddress == "多个收件人以逗号分隔"){
								$('#recieveAddress').val('');
								$('#recieveAddress').focus();
							}
							if(ccAddress == "多个抄送人以逗号分隔"){
								$('#ccAddress').val('');
							}
							if(recieveAddress != "多个收件人以逗号分隔" && ccAddress != "多个收件人以逗号分隔"){
								if (_box.form.edit.form('validate')) {
										Peony.progress();
										_box.form.edit.attr('action', _this.config.action.save);
										//判断输入内容
										Peony.saveForm(_box.form.edit, function(data) {
											Peony.closeProgress();
											_box.win.edit.dialog('close');
											_box.events.refresh();
											_box.form.edit.resetForm();
//											// 回调函数
//											if (jQuery.isFunction(callback)) {
//												callback(data);
//											}
									});
								}
							}
						}
					}, {
						text : '关闭',
						handler : _box.events.close
					} ]
				});
				_box.win.edit.dialog('open');
				 $(".validatebox-tip").remove();
				 $(".validatebox-invalid").removeClass("validatebox-invalid");
				_box.form.edit.resetForm();
				initSelectEvents();
			}
		}, {
			id : 'btnedit',
			text : '编辑',
			btnType : 'edit',
			handler : function() {
				_box.win.edit.dialog({
					buttons : [ {
						text : '测试',
						handler : function() {
							if (_box.form.edit.form('validate')) {
								_box.form.edit.attr('action', _this.config.action.testAction);
								Peony.progress('请稍候', '连接中...');
								//ajax提交form
								Peony.submitForm(_box.form.edit, function(data) {
									Peony.closeProgress();
									if (data.success) {
										Peony.alert('提示', data.msg, 'info');
										if (callback) {
											callback(data);
										}
									} else {
										Peony.alert('提示', data.msg, 'error');
									}
								});
							}
						}
					}, {
						text : '保存',
						handler : _box.events.save
					}, {
						text : '关闭',
						handler : _box.events.close
					} ]
				});
				var records = _box.utils.getCheckedRows();
				if (_box.utils.checkSelectOne(records)) {
					Peony.progress();
					var data = {};
					data.mailId = records[0].mailId;
					$("#mailId").val(data.mailId);
					Peony.getById(_this.config.action.getId, data,
							function(result) {
								onloadSelectEvents();
								keyInfo(result.data.validateFlag);
								keyInfo1(result.data.safeValidate);
								Peony.closeProgress();
								_box.win.edit.form('myLoad', result.data);
								_box.win.edit.dialog('open');
							});
				}
			}
		},{
			id : 'btndelete',
			text : '删除',
			btnType : 'remove'
		}]
		}
	},
	init : function() {
		_box = new YDataGrid(_this.config);
		_box.init();
	}
	}
	return _this;
}();

$(function() {
	Peony.tbMailInfo.init();
});

/*
 * 初始化下拉框联动事件
 */
function initSelectEvents() {
	//安全连接类型
	var safeConnectType = $("#safeConnectType").combobox( {
		url: 'sysDictionaryData/getValues.action?dictValue=SAFE_CONNECT_TYPE',
        valueField:'dictdataValue',
        textField:'dictdataName',
        panelHeight:'auto',
        disabled:'disabled',
        onLoadSuccess : onLoadSuccess
	});
	//是否用户验证
	var validateFlag = $("#validateFlag").combobox( {
		url: 'sysDictionaryData/getValues.action?dictValue=IF_YES',
        valueField:'dictdataValue',
        textField:'dictdataName',
        panelHeight:'auto',
        onChange : function(newValue, oldValue) {
			keyInfo(newValue);
		},
        onLoadSuccess : onLoadSuccess
	});
	//使用安全验证
	var safeValidate = $("#safeValidate").combobox( {
		url: 'sysDictionaryData/getValues.action?dictValue=IF_YES',
        valueField:'dictdataValue',
        textField:'dictdataName',
        panelHeight:'auto',
//        required:'true',
        onChange : function(newValue, oldValue) {
			keyInfo1(newValue);
		},
        onLoadSuccess : onLoadSuccess
	});
}
/*
 * 加载下拉框联动事件
 */
function onloadSelectEvents() {
	//安全连接类型
	var safeConnectType = $("#safeConnectType").combobox( {
		url: 'sysDictionaryData/getValues.action?dictValue=SAFE_CONNECT_TYPE',
        valueField:'dictdataValue',
        textField:'dictdataName',
        panelHeight:'auto',
	});
	//是否用户验证
	var validateFlag = $("#validateFlag").combobox( {
		url: 'sysDictionaryData/getValues.action?dictValue=IF_YES',
        valueField:'dictdataValue',
        textField:'dictdataName',
        panelHeight:'auto',
        onChange : function(newValue, oldValue) {
			keyInfo(newValue);
		}
	});
	//使用安全验证
	var safeValidate = $("#safeValidate").combobox( {
		url: 'sysDictionaryData/getValues.action?dictValue=IF_YES',
        valueField:'dictdataValue',
        textField:'dictdataName',
        panelHeight:'auto',
        onChange : function(newValue, oldValue) {
			keyInfo1(newValue);
		}
	});
}
/*
 * 用户信息是否只读
 * @memberOf {TypeName} 
 */
function keyInfo(id){
//	alert("id="+id);
	if (id == 'Y') { // 是-可以输入
		$("#userName").removeAttr("disabled");
		$("#password").removeAttr("disabled"); 
	}else {
		$("#userName").attr("disabled","disabled");
		$("#password").attr("disabled","disabled");
	}
}
/*
 * 验证方式是否只读
 * @memberOf {TypeName} 
 */
function keyInfo1(id){
	if (id == 'Y') { // 是-可以输入
		$("#safeConnectType").combobox({ disabled: false }); 
	}else {
		$("#safeConnectType").combobox({ disabled: true }); 
	}
}
/*
 * 默认第一项选中
 * @memberOf {TypeName} 
 */
function onLoadSuccess() {
	var id = $("#mailId").val();
//	alert("id===="+id);
	if (id == null || id === "") { // 当新增表单时
		var target = $(this);
		var data = target.combobox("getData");
		var options = target.combobox("options");
		if (data && data.length > 0) {
			var fs = data[0];
			target.combobox("setValue", fs[options.valueField]);
		}
	}
}

