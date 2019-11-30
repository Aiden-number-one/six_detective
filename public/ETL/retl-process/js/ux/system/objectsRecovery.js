$(function() {
	Date.prototype.Format = function(fmt) { // author: lizhiyang
		var o = {
			"M+" : this.getMonth() + 1, // 月份
			"d+" : this.getDate(), // 日
			"h+" : this.getHours(), // 小时
			"m+" : this.getMinutes(), // 分
			"s+" : this.getSeconds(), // 秒
			"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
			"S" : this.getMilliseconds()
		// 毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
					.substr(4 - RegExp.$1.length));
		for ( var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
						: (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	$("body").click(function() {
		showOrHide();
	})
});

// 彻底删除信息
function delReComplete() {
	var ids = [];
	var rows = $('#tt').datagrid('getSelections');
	if (rows.length == 0) {
		alert("没有选择任何数据");
		return;
	}
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].id + ";" + rows[i].tableName + ";" + rows[i].columnId);
	}
	var ids = ids.join(',');
	$.ajax({
		type : "GET",
		url : "allObjects_Recovery/delObjsRecovery.action",
		data : {
			ids : ids
		},
		dataType : "text",
		success : function(data) {
			loadDate();
		}
	});
}

function loadDate() {
	var objectName = $('#search_objectName').val();
	var objectType = $('#search_objectType').combobox("getValue");
	var bStartTime = $('#bStartTime').datetimebox('getValue');
	var bEndTime = $('#bEndTime').datetimebox('getValue');
	var surl = "allObjects_Recovery/getLoadList.action?name="
			+ encodeURI(objectName) + "&type=" + objectType + "&btime="
			+ bStartTime + "&etime=" + bEndTime;
	showdata(surl);
	showOrHide();
}

// 控制按钮是否显示
function showOrHide() {
	var rowInfo = $("#tt").datagrid('getSelected');
	if (rowInfo) {
		$("#btn-recovery,#btn-delete").show();
	} else {
		$("#btn-recovery,#btn-delete").hide();
	}
}

// 恢复数据
function recoveryRecords() {
	var ids = [];
	var rows = $('#tt').datagrid('getSelections');
	if (rows.length == 0) {
		alert("没有选择任何数据");
		return;
	}
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].id + ";" + rows[i].tableName + ";" + rows[i].columnId
				+ ";" + rows[i].folderid+ ";" + rows[i].objectType);
	}
	var ids = ids.join(',');
	$.ajax({
		type : "GET",
		url : "allObjects_Recovery/recoveryRecords.action",
		data : {
			ids : ids
		},
		dataType : "text",
		success : function(data) {
			loadDate();
		}
	});
}

// 查询信息
$('#btn-search').unbind('click').click(function() {
			forGetData();
});

function forGetData(){
	var objectName = $('#search_objectName').val();
	var objectType = $('#search_objectType').combobox("getValue");
	var bStartTime = $('#bStartTime').datetimebox('getValue');
	var bEndTime = $('#bEndTime').datetimebox('getValue');
//	var surl = "allObjects_Recovery/getLoadList.action?name="
//			+ encodeURI(objectName) + "&type=" + objectType + "&btime="
//			+ bStartTime + "&etime=" + bEndTime;
	//获取分页参数
	var psize =$('#tt').datagrid('getPager').data("pagination").options.pageSize;
	//改为AJAX传参
	var data = {};
	data.objectName=objectName;
	data.objectType=objectType;
	data.bStartTime=bStartTime;
	data.bEndTime=bEndTime;
	data.psize=psize;
	$.ajax('allObjects_Recovery/getLoadList.action', {
		type : 'post',
		dataType : 'json',
		data : data,
		success : function(data) {
			$('#tt').datagrid('loadData', { total: 0, rows: [] }); 
			$('#tt').datagrid('loadData', eval(data));
			showOrHide();
		}
	});
}

$('#search_objectType').combobox(
		{
			onChange : function(n, o) {
				forGetData();
			}
		});

$('#bStartTime').datetimebox(
		{
			onChange : function(n, o) {
				forGetData();
			}
		}

);

$('#bEndTime').datetimebox({
	onChange : function(n, o) {
		forGetData();
	}
}

);

// 查询现有信息
function loadInfo() {
	var surl = "allObjects_Recovery/getLoadList.action";
	showdata(surl);
}
// 展示待选择对象信息
function showdata(url) {
	$('#tt').datagrid({
			url : url,
			rownumbers : true,
			singleSelect : false,
			pagination : true,// 分页控件
			pageSize : 100,// 每页显示的记录条数，默认为100
			pageList : [ 50, 100, 500 ],
			striped : true,// 奇偶行显示不同背景色，wfy 20170608
			fitColumns : false,
			remoteSort : false,// 前端排序
			columns : [ [
					{
						field : 'tableName',
						hidden : true
					},
					{
						field : 'columnId',
						hidden : true
					},
					{
						title : '序号',
						field : 'objectId',
						checkbox : true
					},
					{
						field : 'objectType',
						hidden : true
					},
					{
						field : 'folderid',
						hidden : true
					},
					{
						field : 'objectTypeName',
						title : '对象类型',
						width : '20%',
						sortable : true
					},
					{
						field : 'objectName',
						title : '对象名称',
						width : '22%',
						sortable : true
					},
					{
						field : 'folderName',
						title : '原位置',
						width : '36%',
						sortable : true
					},
					{
						field : 'modifiedTime',
						title : '对象时间',
						width : '20%',
						sortable : true,
						formatter : function(value) {
							var date = new Date(value);
							var y = date.getFullYear();
							var m = date.getMonth() + 1;
							var d = date.getDate();
							return new Date(value)
									.Format("yyyy-MM-dd hh:mm:ss");
						}
					} ] ],
			onClickRow : function(index, row) { // 单击行事件
				// ---------for TEST
				// 结合SHIFT,CTRL,ALT键实现单选或多选------------
				if (index != selectIndexs.firstSelectRowIndex
						&& !inputFlags.isShiftDown1) {
					selectIndexs.firstSelectRowIndex = index; 
				}
				if (inputFlags.isShiftDown1) {
					$('#tt').datagrid('clearSelections');
					selectIndexs.lastSelectRowIndex = index;
					var tempIndex = 0;
					if (selectIndexs.firstSelectRowIndex > selectIndexs.lastSelectRowIndex) {
						tempIndex = selectIndexs.firstSelectRowIndex;
						selectIndexs.firstSelectRowIndex = selectIndexs.lastSelectRowIndex;
						selectIndexs.lastSelectRowIndex = tempIndex;
					}
					for (var i = selectIndexs.firstSelectRowIndex; i <= selectIndexs.lastSelectRowIndex; i++) {
						$('#tt').datagrid('selectRow', i);
					}
				}
				// ---------for TEST
				// 结合SHIFT,CTRL,ALT键实现单选或多选------------
			},
			onCheck : function(index, row) {
				// console.log("选中了");
			},
			onCheckAll : function(rows) {
				showOrHide();
			},
			onUncheckAll : function(rows) {
				showOrHide();
			}
		})
	/** ---------------鼠标事件------------** */
	var KEY = {
		SHIFT : 16,
		CTRL : 17,
		ALT : 18,
		DOWN : 40,
		RIGHT : 39,
		UP : 38,
		LEFT : 37
	};
	var selectIndexs = {
		firstSelectRowIndex : 0,
		lastSelectRowIndex : 0
	};
	var inputFlags = {
		isShiftDown1 : false,
		isCtrlDown1 : false,
		isAltDown : false
	}

	function keyPress(event) {// 响应键盘按下事件
		var e = event || window.event;
		var code = e.keyCode | e.which | e.charCode;
		switch (code) {
		case KEY.SHIFT:
			inputFlags.isShiftDown1 = true;
			$('#tt').datagrid('options').singleSelect = false;
			break;
		case KEY.CTRL:
			inputFlags.isCtrlDown1 = true;
			$('#tt').datagrid('options').singleSelect = false;
			break;
		default:
		}
	}
	function keyRelease(event) { // 响应键盘按键放开的事件
		var e = event || window.event;
		var code = e.keyCode | e.which | e.charCode;
		switch (code) {
		case KEY.SHIFT:
			inputFlags.isShiftDown1 = false;
			selectIndexs.firstSelectRowIndex = 0;
			$('#tt').datagrid('options').singleSelect = true;
			break;
		case KEY.CTRL:
			inputFlags.isCtrlDown1 = false;
			selectIndexs.firstSelectRowIndex = 0;
			$('#tt').datagrid('options').singleSelect = true;
			break;
		default:
		}
	}
}
