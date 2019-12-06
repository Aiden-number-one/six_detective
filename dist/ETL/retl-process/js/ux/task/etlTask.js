$package('Peony.etlTask');
Peony.etlTask = function() {
	var _box = null;
	var _this = {
	config : {
		action : {
			save : 'etlTask/save.action', //新增&修改 保存Action  
			getId : 'etlTask/getId.action',//编辑获取的Action
			remove : 'etlTask/delete.action'//删除数据的Action
		},
		dataGrid : {
			title : '任务信息',
			url : 'etlTask/dataList.action',
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
				field : 'taskTypeValue',
				title : '任务类型',
				width : 80,
				sortable : true
			}, {
				field : 'isValid',
				title : '是否有效',
				width : 80,
				sortable : true,
				formatter : function(value, row, index) {
					if (row.isValid == 0)
						return '否';
					else if (row.isValid == 1)
						return '是';
				}
			}
		] ],
			toolbar : [ {
				id : 'btnadd',
				text : '新增',
				btnType : 'add'
			}, {
				id : 'btnedit',
				text : '编辑',
				btnType : 'edit'
			},{
				id : 'btndelete',
				text : '删除',
				btnType : 'remove'
			}
			
			]
		}
	},
	init : function() {
//		_this.initForm();
		_box = new YDataGrid(_this.config);
		_box.init();
	}
	}
	return _this;
}();

$(function() {
	Peony.etlTask.init();
});

