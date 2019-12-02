$package('Peony.task');
Peony.task = function() {
	var _box = null;
	var _this = {
		config : {
			action : {
				save : 'task/save.action', // 新增&修改 保存Action
				getId : 'task/getId.action',// 编辑获取的Action
				remove : 'task/delete.action',// 删除数据的Action
			},
			dataGrid : {
				title : '任务设置信息',
				url : 'task/dataList.action',
				idField : 'taskId',
				columns : [ [ {
					field : 'taskId',
					checkbox : true
				}, {
					field : 'taskNo',
					title : '任务编号',
					width : 80,
					sortable : true
				}, {
					field : 'taskName',
					title : '任务名称',
					width : 80,
					sortable : true
				}, {
					field : 'taskType',
					title : '任务类型',
					width : 80,
					sortable : true,
					formatter : function(value, row, index) {
						if (row.taskType == '1') {
							var path = getContextPath() + "/images/task/icon03.png";
							return '<img src=' + path + ' />  异构抽取';
						} else if (row.taskType == '2') {
							var path = getContextPath() + "/images/task/icon02.png";
							return '<img src=' + path + ' />  同构转换';
						} else if (row.taskType == '3') {
							var path = getContextPath() + "/images/task/icon01.png";
							return '<img src=' + path + ' />  变量设置';
						}
					}
				}, {
					field : 'sourceConnection',
					title : '源连接',
					width : 80,
					sortable : true
				}, {
					field : 'targetConnection',
					title : '目标连接',
					width : 80,
					sortable : true
				}, {
					field : 'targetTable',
					title : '目标表',
					width : 80,
					sortable : true
				}, {
					field : 'transRule',
					title : '转换类型',
					width : 40,
					sortable : true
				}, {
					field : 'validFlag',
					title : '有效是否',
					width : 40,
					sortable : true,
					formatter : function(value, row, index) {
						if (row.validFlag == 'T') {
							var path = getContextPath() + "/images/task/a91.png";
							return '<img src=' + path + ' />';
						} else if (row.validFlag == 'F') {
							var path = getContextPath() + "/images/task/a11.png";
							return '<img src=' + path + ' />';
						}
					}
				}, {
					field : 'validStartTime',
					title : '有效开始时间',
					width : 80,
					sortable : true
				}, {
					field : 'validEndTime',
					title : '有效结束时间',
					width : 80,
					sortable : true
				}, {
					field : 'modifiedTime',
					title : '最后修改时间',
					width : 80,
					sortable : true
				} ] ],
				toolbar : [ {
					text : '新增异构任务',
					btnType : 'add'
				}, {
					text : '新增同构任务',
					btnType : 'add'
				}, {
					text : '新增变量设置',
					btnType : 'add',
					handler : function() {
						addVariable();
					}
				}, {
					id : 'btnedit',
					text : '编辑',
					btnType : 'edit'
				}, {
					id : 'btndelete',
					text : '删除',
					btnType : 'remove'
				} ]
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
	Peony.task.init();
});

/**
 * 新增变量设置
 */
function addVariable() {
	$("#variable-win").window({
		title : '新增变量设置',
		href : 'task/addVariable.action',
		width : 700,
		height : 500,
		iconCls : 'icon-save',
		modal : true,
		maximizable : true,
		resizable : true,
		onLoad : function() {
			$('#editForm').form('clear');
		}
	});
}

/*
 * 获取应用根路径 @return {TypeName}
 */
function getContextPath() {
	var pathname = location.pathname;
	return pathname.substr(0, pathname.indexOf('/', 1));
}
