$package('Peony.sysDictionary');
Peony.sysDictionary = function() {
	var _box = null;
	var _this = {
	config : {
		//查询子菜单个数信息
		toList:function(parentId){
			_box.form.search.resetForm();
			if(parentId){
//				$('#search_parentId').val(parentId);
				$('#btnback').linkbutton('enable');
				_box.grid.datagrid('hideColumn','childMenus');
			}else{
				$('#btnback').linkbutton('disable');
				_box.grid.datagrid('showColumn','childMenus');
			}
			_box.handler.refresh();
		},
		action : {
			save : 'sysDictionary/save.action', //新增&修改 保存Action  
			getId : 'sysDictionary/getId.action',//编辑获取的Action
			remove : 'sysDictionary/delete.action'//删除数据的Action
		},
		dataGrid : {
			title : '系统字典信息',
			url : 'sysDictionary/dataList.action',
			idField : 'dictId',
			columns : [ [ {
				field : 'dictId',
				checkbox : true
			}, {
				field : 'dictValue',
				title : '字典值',
				width : 120,
				sortable : true
			}, {
				field : 'dictName',
				title : '字典名称',
				width : 120,
				sortable : true
			},{
				field:'childMenus',
				title:'子菜单',
				width:80,
				align:'center',
				formatter:function(value,row,index){
//					var html ="<a href='javascript:Peony.dbConnection.toList(\""+row.connectionId+"\")'>子菜单管理("+row.subCount+")</a>";
					var html = "<a href='sysDictionaryData/init.action?pid=" + row.dictValue + "'>子分类管理(" + row.subCount + ")</a>";
					return html;
			}}
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
		},
		event : {
			remove : function() {
				var records = _box.utils.getCheckedRows();
				if (_box.utils.checkSelect(records)) {
					if (records[0].subCount > 0) {
						Peony.alert('警告', '请先删除该字典下的数据信息再删除字典信息.', 'warning');
					} else {
						_box.handler.remove();
					}
				}
			}
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
	Peony.sysDictionary.init();
});

