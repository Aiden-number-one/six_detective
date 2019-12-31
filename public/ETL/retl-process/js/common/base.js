var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

$package('Peony');
var Peony = {
	/* Json 工具类 */
	isJson: function isJson(str) {
		var obj = null;
		try {
			obj = Peony.paserJson(str);
		} catch (e) {
			return false;
		}
		var result = (typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		return result;
	},
	paserJson: function paserJson(str) {
		return eval("(" + str + ")");
	},
	/* 弹出框 */
	alert: function alert(title, msg, icon, callback) {
		$.messager.alert(title, msg, icon, callback);
	},
	/* 弹出框 */
	confirm: function confirm(title, msg, callback) {
		$.messager.confirm(title, msg, callback);
	},
	progress: function progress(title, msg) {
		var win = $.messager.progress({
			title: title || 'Wating',
			msg: msg || 'Loading...'
		});
	},
	closeProgress: function closeProgress() {
		$.messager.progress('close');
	},
	/* 重新登录页面 */
	toLogin: function toLogin() {
		window.top.location = "login.action";
	},
	checkLogin: function checkLogin(data) {
		// 检查是否登录超时
		if (data.logoutFlag) {
			Peony.closeProgress();
			Peony.alert('提示', "登录超时,点击确定重新登录.", 'error', Peony.toLogin);
			return false;
		}
		return true;
	},
	ajaxSubmit: function ajaxSubmit(form, option) {
		form.ajaxSubmit(option);
	},
	ajaxJson: function ajaxJson(url, option, callback) {
		$.ajax(url, {
			type: 'post',
			dataType: 'json',
			data: option,
			success: function success(data) {
				// 坚持登录
				if (!Peony.checkLogin(data)) {
					return false;
				}
				if ($.isFunction(callback)) {
					callback(data);
				}
			},
			error: function error(response, textStatus, errorThrown) {
				try {
					Peony.closeProgress();
					var data = $.parseJSON(response.responseText);
					// 检查登录
					if (!Peony.checkLogin(data)) {
						return false;
					} else {
						Peony.alert('提示', data.msg || "请求出现异常,请联系管理员", 'error');
					}
				} catch (e) {
					Peony.alert('提示', "请求出现异常,请联系管理员.", 'error');
				}
			},
			complete: function complete() {}
		});
	},
	submitForm: function submitForm(form, callback, dataType) {
		var option = {
			type: 'post',
			dataType: dataType || 'json',
			success: function success(data) {
				if ($.isFunction(callback)) {
					callback(data);
				}
			},
			error: function error(response, textStatus, errorThrown) {
				try {
					Peony.closeProgress();
					var data = $.parseJSON(response.responseText);
					// 检查登录
					if (!Peony.checkLogin(data)) {
						return false;
					} else {
						Peony.alert('提示', data.msg || "请求出现异常,请联系管理员", 'error');
					}
				} catch (e) {
					Peony.alert('提示', "请求出现异常,请联系管理员.", 'error');
				}
			},
			complete: function complete() {}
		};
		Peony.ajaxSubmit(form, option);
	},
	saveForm: function saveForm(form, callback) {
		if (form.form('validate')) {
			Peony.progress('Wating', 'Saving...');
			// ajax提交form
			Peony.submitForm(form, function (data) {
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
	},
	/**
  * 
  * @param {}
  *            url
  * @param {}
  *            option {id:''}
  */
	getById: function getById(url, option, callback) {
		Peony.progress();
		Peony.ajaxJson(url, option, function (data) {
			Peony.closeProgress();
			if (data.success) {
				if (callback) {
					callback(data);
				}
			} else {
				Peony.alert('提示', data.msg, 'error');
			}
		});
	},
	deleteForm: function deleteForm(url, option, callback) {
		Peony.progress();
		Peony.ajaxJson(url, option, function (data) {
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

	/* 扩展easyui表单的验证 */
};$.extend($.fn.validatebox.defaults.rules, {
	// 验证密码是否相等
	equals: {
		validator: function validator(value, param) {
			return value == $(param[0]).val();
		},
		message: '字段不匹配.'
	},
	// 验证汉字
	CHS: {
		validator: function validator(value) {
			return (/^[\u0391-\uFFE5]+$/.test(value)
			);
		},
		message: '只能输入汉字'
	},
	intOrFloat: { // 验证整数或小数
		validator: function validator(value) {
			return (/^\d+(\.\d+)?$/i.test(value)
			);
		},
		message: '请输入数字，并确保格式正确'
	},
	integer: { // 验证整数
		validator: function validator(value) {
			return (/^[+]?[1-9]+\d*$/i.test(value)
			);
		},
		message: '请输入整数'
	},
	integerTen: { // 验证整数--最大值为10
		validator: function validator(value) {
			return (/^(10|[1-9])$/i.test(value)
			);
		},
		message: '请输入不超过10的整数'
	},
	zeroOrInteger: { // 验证非负整数
		validator: function validator(value) {
			return (/^([1-9]\d{0,}|0)$/i.test(value)
			);
		},
		message: '请输入非负整数'
	},
	phone: { // 验证电话号码
		validator: function validator(value) {
			return (/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value)
			);
		},
		message: '格式不正确,请使用下面格式:020-88888888'
	},
	// 移动手机号码验证
	mobile: { // value值为文本框中的值
		validator: function validator(value) {
			var reg = /^1[3|4|5|8|9]\d{9}$/;
			return reg.test(value);
		},
		message: '输入手机号码格式不准确.'
	},
	phoneAndMobile: { // 电话号码或手机号码
		validator: function validator(value) {
			return (/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value) || /^(13|15|18)\d{9}$/i.test(value)
			);
		},
		message: '电话号码或手机号码格式不正确'
	},
	idcard: { // 验证身份证
		validator: function validator(value) {
			return (/^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value) || /^\d{18}(\d{2}[A-Za-z0-9])?$/i.test(value)
			);
		},
		message: '身份证号码格式不正确'
	},
	// 国内邮编验证
	zipcode: {
		validator: function validator(value) {
			var reg = /^[1-9]\d{5}$/;
			return reg.test(value);
		},
		message: '邮编必须是非0开始的6位数字.'
	},
	// 用户账号验证(只能包括 _ 数字 字母)
	account: { // param的值为[]中值
		validator: function validator(value, param) {
			if (value.length < param[0] || value.length > param[1]) {
				$.fn.validatebox.defaults.rules.account.message = '用户名长度必须在' + param[0] + '至' + param[1] + '范围';
				return false;
			} else {
				if (!/^[\w]+$/.test(value)) {
					$.fn.validatebox.defaults.rules.account.message = '用户名只能数字、字母、下划线组成.';
					return false;
				} else {
					return true;
				}
			}
		},
		message: ''
	},
	checkIp: { // 验证IP地址
		validator: function validator(value) {
			var reg = /^((1?\d?\d|(2([0-4]\d|5[0-5])))\.){3}(1?\d?\d|(2([0-4]\d|5[0-5])))$/;
			return reg.test(value);
		},
		message: 'IP地址格式不正确'
	},
	remote: { // 远程验证
		validator: function validator(value, param) {
			var postdata = {};
			postdata[param[1]] = value;
			postdata[param[2]] = $("#" + param[2]).val();
			// alert(JSON.stringify(postdata));
			var m_result = $.ajax({
				type: "POST", // http请求方式
				url: param[0], // 服务器段url地址
				data: postdata, // 发送给服务器段的数据
				dataType: "type", // 告诉JQuery返回的数据格式
				async: false
			}).responseText;
			if (m_result == "False") {
				$.fn.validatebox.defaults.rules.remote.message = param[3];
				return false;
			} else {
				return true;
			}
		},
		message: ''
	},
	md: { // 验证开始时间小于结束时间
		validator: function validator(value, param) {
			startTime = $(param[0]).datetimebox('getValue');
			// // var d1 =
			// $.fn.datebox.defaults.parser(startTime);
			// // var d2 = $.fn.datebox.defaults.parser(value);
			// // varify=d2>d1;
			// // return varify;
			var d1 = new Date(startTime.replace("-", "/").replace("-", "/"));
			var d2 = new Date(value.replace("-", "/").replace("-", "/"));
			varify = d2 > d1;
			return varify;
		},
		message: '结束时间要大于开始时间！'
	},
	// 只包含数字或字母，不能包含特殊字符和汉字
	intOrLetter: {
		validator: function validator(value) {
			var strExp = /^[A-Za-z0-9]+$/;
			return strExp.test(value);
		},
		message: '只能输入数字或字母'
	},
	// 验证电话号码或手机号码
	phoneOrMobile: {
		validator: function validator(value) {
			var r = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
			return (/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?|(1[3|4|5|8|9]\d{9})$/i.test(value)
			);
		},
		message: '格式不正确,请使用下面格式电话号码:020-88888888或手机号码'
	},
	// 邮箱验证
	checkMail: {
		validator: function validator(value) {
			var strExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return strExp.test(value);
		},
		message: '邮箱格式不正确'
	},
	checkTime: { // 验证时间格式
		validator: function validator(value) {
			return (/^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/i.test(value)
			);
		},
		message: '时间格式不正确，应为：yyyy-MM-dd HH:mm:ss'
	},
	mdother: { // 调度执行时间时间小于结束时间
		validator: function validator(value, param) {
			startTime = $(param[0]).datetimebox('getValue');
			var d1 = new Date(startTime.replace("-", "/").replace("-", "/"));
			var d2 = new Date(value.replace("-", "/").replace("-", "/"));
			varify = d2 > d1;
			return varify;
		},
		message: '结束时间要大于调度执行时间！'
	},
	checkVersion: { // 验证时间格式，年月日
		validator: function validator(value) {
			var strExp = /(19|20)\d\d(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])$/;
			return strExp.test(value);
		},
		message: '版本格式不正确，应为：yyyymmdd'
	},
	checkOnly: { // 检查值是否唯一
		validator: function validator(value, param) {
			var nodeIdDom = param[1];
			var nodeId = $(nodeIdDom).val();
			// console.log(nodeId);
			var isexist = false;
			for (var i = 0; i < param[0].length; i++) {
				if (param[0][i].name == value && param[0][i].id != nodeId) {
					isexist = true;
					break;
				}
			}
			if (isexist) {
				// bu存在
				$.messager.alert('提示', '该名字已存在');
				$.fn.validatebox.defaults.rules.checkOnly.message = '该名字已存在,请重新输入';
				return false;
			} else {
				return true;
			}
		},
		message: ''
	}

});

/* 表单转成json数据 */
$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

/* easyui datagrid 添加和删除按钮方法 */
$.extend($.fn.datagrid.methods, {
	addToolbarItem: function addToolbarItem(jq, items) {
		return jq.each(function () {
			var toolbar = $(this).parent().prev("div.datagrid-toolbar");
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item === "-") {
					toolbar.append('<div class="datagrid-btn-separator"></div>');
				} else {
					var btn = $("<a href=\"javascript:void(0)\"></a>");
					btn[0].onclick = eval(item.handler || function () {});
					btn.css("float", "left").appendTo(toolbar).linkbutton($.extend({}, item, {
						plain: true
					}));
				}
			}
			toolbar = null;
		});
	},
	removeToolbarItem: function removeToolbarItem(jq, param) {
		return jq.each(function () {
			var btns = $(this).parent().prev("div.datagrid-toolbar").children("a");
			var cbtn = null;
			if (typeof param == "number") {
				cbtn = btns.eq(param);
			} else if (typeof param == "string") {
				var text = null;
				btns.each(function () {
					text = $(this).data().linkbutton.options.text;
					if (text == param) {
						cbtn = $(this);
						text = null;
						return;
					}
				});
			}
			if (cbtn) {
				var prev = cbtn.prev()[0];
				var next = cbtn.next()[0];
				if (prev && next && prev.nodeName == "DIV" && prev.nodeName == next.nodeName) {
					$(prev).remove();
				} else if (next && next.nodeName == "DIV") {
					$(next).remove();
				} else if (prev && prev.nodeName == "DIV") {
					$(prev).remove();
				}
				cbtn.remove();
				cbtn = null;
			}
		});
	}
});

/**
 * easyUI datagrid 列宽自适应
 * 
 * @see http://blog.csdn.net/yanghongchang_/article/details/7633517
 */
function columnWidthAutoResize() {
	var cls = arguments[0]; // 需要自适应的列的名称
	var $grid = arguments[1]; // datagrid ID
	$grid.datagrid({
		onLoadSuccess: function onLoadSuccess(data) {
			var rows = data.rows; // 得到行数据
			var columnMaxCharacter = new Array(); // 该列最大字符数
			// 遍历所有行数据,获得该列数据的最大字符数
			for (var i = 0; i < rows.length; i++) {
				for (var j = 0; j < cls.length; j++) {
					// 遍历需要设置的列
					var s = eval("rows[" + i + "]." + cls[j]) || '';
					// 屏蔽html标签
					s = s.replace("<center>", "");
					s = s.replace("</center>", "");
					if (typeof columnMaxCharacter[cls[j]] == 'undefined') {
						columnMaxCharacter[cls[j]] = 0;
					}

					if (s.length > columnMaxCharacter[cls[j]]) {
						columnMaxCharacter[cls[j]] = s.length;
					}
				}
			}

			// 设置列宽度和字体
			for (var j = 0; j < cls.length; j++) {
				// 得到该列的字体
				// alert($("td[field='"+cls[j]+"'] div").get(0).currentStyle);
				// var fontSize=$("td[field='"+cls[j]+"']
				// div").get(0).currentStyle.fontSize;//获得字体大小
				// fontSize= fontSize.replace("px","");//去掉px方便运算
				var fontSize = 12;
				var w = fontSize * (columnMaxCharacter[cls[j]] + 1); // 求出宽度
				// 设定该列的宽度
				$("td[field='" + cls[j] + "'] div").width(w);
			}
		}
	});
}