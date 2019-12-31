var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

$package('Peony.jobFlow');
Peony.jobFlow = function () {
	var _this = {
		saveAction: 'job/saveJobFlow.action',
		editForm: function editForm() {
			return $("#form_newJob");
		},
		editWin: function editWin() {
			return $("#jf_win_newJob");
		},
		save: function save() {
			// 判断节点编号是否重复
			//			var nodes = graphic.nodes;
			//			var _array = [];
			//			for (var i = 0; i < nodes.length; i++) {
			//				_array.push(nodes[i].name);
			//			}
			//			console.log(_array);
			//			var nary = _array.sort();
			//			var flag = true;
			//			for (var i = 0; i < nary.length - 1; i++) {
			//				if (nary[i] == nary[i + 1]) {
			//					Peony.alert('提示', '存在重复节点编号 "' + nary[i] + '"，请修改后再提交！',
			//							'error');
			//					flag = false;
			//					break;
			//				}
			//			}
			//			if (!flag)
			//				return false;
			//
			//			graphic.saveJobFlowXmlDoc(); // 获取画布 XML 内容，保存到表单
			//			// alert($('#jobFlow_xml').val());
			//			if (_this.editForm().form('validate')) {
			//				Peony.progress();
			//				_this.editForm().attr('action', _this.saveAction);
			//				Peony.saveForm(_this.editForm(), function(data) {
			//					Peony.closeProgress();
			//					_this.editWin().window('close');
			//					// 当另存为时
			//					if ($("#_saveJobType").val() === '2'
			//							|| $("#_ifNew").val() == 'true') {
			//						var url = getRealPath()
			//								+ "/job/initJobFlow.action?jobId="
			//								+ $("#job_item_id").val()
			//								+ "&folderId="
			//								+ $('#folderId_input').combobox('getValue')
			//								+ "&jobNo="
			//								+ encodeURI(encodeURI($("#jf_jobId_input")
			//										.val()))
			//								+ "&jobName="
			//								+ encodeURI(encodeURI($("#jf_jobName_input")
			//										.val()));
			//						$(location).attr('href', url);
			//					}
			//				});
			//			}
		},
		initForm: function initForm() {
			//			_this.editWin().find("#jf_btn_saveSubmit").click(function() {
			//				// $("#t-save").click(function() {
			//				var t = $('#ifBack').val();
			//				_this.save();
			//				if (t == '1') {
			//					setTimeout("remainTime()", 500);
			//					// window.location.href="job/list.action";
			//				}
			//			});
			//			_this.editWin().find("#btn-jobFlow-close").click(function() {
			//				$.messager.confirm('确认', '您确定要关闭窗口？', function(r) {
			//					if (r) {
			//						_this.editWin().window('close');
			//					}
			//				});
			//			});
		},
		initSave: function initSave() {
			//			_this.save();
			//			if ($('#ifBack').val() == '1') {
			//				setTimeout("remainTime()", 500);
			//			}
		},
		init: function init() {
			_this.initForm();
			initConditionComp();
		}
	};
	return _this;
}();
var jobId = GetQueryString("jobId"); // 编辑作业时传递----通过url获取jobId的值
var folderId = GetQueryString("folderId"); // 编辑作业时传递----通过url获取jobId的值
$(function () {
	Peony.jobFlow.init();
	// $("body").on("click","#jf_btn_saveSubmit",function(){
	// 	sessionStorage.setItem("jumpjobId",folderId);
	// 	window.location.href("/index.html#report-table-info-manage");
	// })
});
var getApi = function getApi(api_name, api_version, api_params, cbfunc) {
	var param = getAjaxParams(api_name, api_version, api_params);
	var reqUrl = "/retl/rest/admin/" + $.trim(api_version) + "/" + $.trim(api_name) + ".json";
	$.ajax({
		type: "post",
		url: reqUrl,
		dataType: 'json',
		data: param,
		async: true
	}).done(function (data) {
		if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) != "object") {
			data = eval("(" + data + ")");
		}
		if (cbfunc) {
			cbfunc(data);
		}
	});
};

function remainTime() {
	var Rid = $('#folderId_input').combotree('getValue');
	$(location).attr('href', "job/list.action");
	window.sessionStorage.setItem('chooseInfo', Rid);
}

//画布中保存信息是【保存】按钮操作
$("#jf_btn_saveSubmit").click(function () {
	if ($("#form_newJob").form('validate')) {
		// 启用校验
		saveFlowInfo();
	} else {
		$.messager.alert('Tips', "Param is Missing，Please Check.", 'waring');
	}
});
function saveFlowInfo() {
	// 判断节点编号是否重复
	var nodes = graphic.nodes;
	var _array = [];
	for (var i = 0; i < nodes.length; i++) {
		_array.push(nodes[i].name);
	}
	//	console.log(_array);
	var nary = _array.sort();
	var flag = true;
	for (var i = 0; i < nary.length - 1; i++) {
		if (nary[i] == nary[i + 1]) {
			Peony.alert('Tips', '"' + nary[i] + '"is repeated，Please Check', 'error');
			flag = false;
			break;
		}
	}
	if (!flag) {
		return false;
	}
	graphic.saveJobFlowXmlDoc(); // 获取画布 XML 内容，保存到表单

	Peony.progress();
	var data = $('#form_newJob').serialize();
	// var jobInfo = sessionStorage.getItem("jobInfo");
	// if (jobInfo) jobInfo = JSON.parse(jobInfo);
	var params = {};
	params.job_id = jobId || graphic.item_id;
	params.job_no = $("[name=jobNo]").val();
	params.job_name = $("[name=jobName]").val();
	params.folder_id = $("[name=folderId]").val();
	params.job_desc = $("[name=jobDesc]").val();
	params.xml_msg = thisd.xmlDoc;
	params.max_parallel = "";
	params.fault_type = "";
	params.valid_flag = "";
	params.creator = localStorage.getItem('loginName');
	if ($("#_saveJobType").val() === '2' || $("#_ifNew").val() == 'true') {
		params.operType = "ADD";
	} else {
		params.operType = "UPD";
	}
	$.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_job_info", "v4.0", params, function (data) {
		if (data.bcjson.flag === "1") {
			// alert("新增成功");
			// $("#J_job_info_modal").modal("hide");
			// 	}
			// });
			// $.ajax({
			// 	type : "post",
			// 	url : "job/saveJobFlow.action",
			// 	data : data,
			// 	success : function(data) {
			Peony.closeProgress();
			if ($("#_saveJobType").val() === '2') {
				$.messager.alert('Tips', "Successful", 'info');
			} else {
				$.messager.alert('Tips', data.bcjson.msg, 'info', function () {
					setTimeout(function () {
						window.opener.location.href = "/ETL/index.html?folderId=" + params.folder_id + "#report-table-info-manage";
						setTimeout(function () {
							window.opener.location.reload();
							window.close();
						}, 200);
					}, 200);
				});
			}
			$('#jf_win_newJob').window('close');
			//			console.log($('#_saveJobType').val());
			// 当另存为时
			// if ($("#_saveJobType").val() === '2' || $("#_ifNew").val() == 'true') {
			// 	var url = getRealPath()
			// 			+ "/job/initJobFlow.action?jobId="
			// 			+ $("#job_item_id").val()
			// 			+ "&folderId="
			// 			+ $('#folderId_input').combobox('getValue')
			// 			+ "&jobNo="
			// 			+ encodeURI(encodeURI($("#jf_jobId_input")
			// 					.val()))
			// 			+ "&jobName="
			// 			+ encodeURI(encodeURI($("#jf_jobName_input")
			// 					.val()));
			// 	$(location).attr('href', url);
			// }
			// var t = $('#ifBack').val();
			// if (t == '1') {
			// 	setTimeout("remainTime()", 500);
			// }
		}
	});
}
//画布中保存信息是【关闭】按钮操作
$("#btn-jobFlow-close").unbind('click').click(function () {
	$.messager.confirm('Confirm', 'Please Confirm to colse window', function (r) {
		if (r) {
			$('#jf_win_newJob').window('close');
		}
	});
});

$("#Stop1").click(function () {
	if ($(".nodelistbox-wrap").css('marginLeft') == '0px') {
		$(".nodelistbox-wrap").animate({
			marginLeft: "-250px"
		});
		$(this).animate({
			left: "0"
		});
		$("#svgbox").animate({
			marginLeft: "0px"
		});
		$("#tab_Label").animate({
			left: "-250px"
		});
		$("#ssou").animate({
			left: "-250px"
		});
		$(".toolbox").animate({
			left: "0px"
		});
		$("#Stop_img").attr('src', 'images/left.png');
	} else {
		$(".nodelistbox-wrap").animate({
			marginLeft: "0px"
		});
		$(this).animate({
			left: "248px"
		});
		$("#svgbox").animate({
			marginLeft: "250px"
		});
		$("#tab_Label").animate({
			left: "0px"
		});
		$("#ssou").animate({
			left: "0px"
		});
		$(".toolbox").animate({
			left: "250px"
		});
		$("#Stop_img").attr('src', 'images/right1.png');
	}
});
function addTab(title, url) {
	var jq = top.jQuery;
	var tab_wrap = jq('#main_tab_box');
	var content = '<iframe  frameborder="0" src="' + url + '" style="display:block;width:100%;height:100%;" border="0" marginwidth="0" marginheight="0" scrolling="no" ></iframe>';
	tab_wrap.tabs('add', {
		title: title,
		content: content,
		closable: true
	});
}
/**
 * 获取项目的绝对路径
 * 
 * @returns {String}
 */
function getRealPath() {
	var localObj = window.location;
	var contextPath = localObj.pathname.split("/")[1];
	var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
	return basePath;
};

var rowCount = 0;
/**
 * 初始化条件组件
 */
function initConditionComp() {
	rowCount = 0;
	delAllLine(true);
	btnAddCondition();
}

function btnAddCondition() {
	$('#addLineC').unbind('click').click(addLineCondition); // 新增一行
	$('#delAllLineC').unbind('click').click(function () {
		// 删除全部
		var tab = document.getElementById("tbC");
		var rows = tab.rows.length;
		if (rows > 1) {
			// 表头信息
			$.messager.confirm('Confirm', 'Please confirm that you want to delete this record.', function (r) {
				if (r) {
					rowCount = 0;
					delAllLine(true);
				}
			});
		} else {
			$.messager.alert('Tips', "No Data", 'info');
		}
	});
}

function addLineCondition(i, data) {
	rowCount++;
	var table = $("#tbC");
	var html = '<tr class="tb-line">';
	html += '<td width="5%"><input name="no" class="easyui-validatebox text-name" style="width: 100%; border-style: none; text-align: center;" value="' + rowCount + '" data-options="editable :false"></td>';
	html += '  <td><input type="text" class="form-control" name="i_variable_name" id="i_variable_name' + i + '"></td>';
	html += '  <td><select name="i_variable_type" class="form-control" id="i_variable_type' + i + '">';
	html += '      <option value="1">String</option>';
	html += '      <option value="2">Number</option>';
	// html += '      <option value="3">DateTime</option>';
	// html += '      <option value="4">Boolean</option>';
	html += '    </select></td>';
	html += '  <td><select name="i_success_condition" class="form-control" id="i_success_condition' + i + '" style="width: 100%; height: 34px;">';
	html += '      <option value="1">=</option>';
	html += '      <option value="2">≠</option>';
	// html += '      <option value="3">为空</option>';
	// html += '      <option value="4">不为空</option>';
	// html += '      <option value="5">包含</option>';
	// html += '      <option value="6">不包含</option>';
	// html += '      <option value="7">开始是</option>';
	// html += '      <option value="8">开始不是</option>';
	// html += '      <option value="9">结尾是</option>';
	// html += '      <option value="10">结尾不是</option>';
	// html += '      <option value="11">在列表中</option>';
	// html += '      <option value="12">不在列表中</option>';
	// html += '      <option value="13">大于</option>';
	// html += '      <option value="14">大于等于</option>';
	// html += '      <option value="15">小于</option>';
	// html += '      <option value="16">小于等于</option>';
	html += '    </select></td>';
	html += '  <td><input type="text" class="form-control" id="i_variable_value' + i + '" name="i_variable_value"></td>';
	html += '  <td><select name="i_operation" class="form-control" id="i_operation' + i + '">';
	html += '      <option value="1">AND</option>';
	html += '      <option value="2">OR</option>';
	html += '    </select></td>';
	html += '  <td width="10%"><a id="J_process_del" class="btn-operate remove-btn"><i class="widget-thumb-icon bg-red fa icon-trash"></i>DELETE</a></td>';
	html += '</tr>';
	var line = $(html);
	// 版定删除按钮事件
	$(".remove-btn", line).click(function () {
		$.messager.confirm('Confirm', 'Please confirm that you want to delete this record.', function (r) {
			if (r) {
				rowCount--;
				delLine(line);
			}
		});
	});
	$.parser.parse(line); // 解析esayui标签
	table.append(line);
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	if (data) {
		$("input[name='i_variable_name']", line).val(data.variableName);
		$("#i_variable_type" + i + " option").each(function (j) {
			if (this.value == data.variableType) {
				this.selected = true;
			}
		});
		$("#i_success_condition" + i + " option").each(function (j) {
			if (this.value == data.successCondition) {
				this.selected = true;
			}
		});
		$("input[name='i_variable_value']", line).val(data.value);
		$("#i_operation" + i + " option").each(function (j) {
			if (this.value == data.operation) {
				this.selected = true;
			}
		});
	}
}

// 删除全部
function delAllLine(b) {
	if (b) {
		$(".tb-line").each(function (i, line) {
			delLine($(line));
		});
	}
}
// 删除单行
function delLine(line) {
	if (line) {
		line.fadeOut("fast", function () {
			$(this).remove();
		});
	}
}