$package('Peony.sysUser');
Peony.sysUser = function() {
	var _box = null;
	var _this = {
		initForm : function() {
			$("#roleIds").combobox(
					{
						url : 'sysRole/loadRoleList.action',
						valueField : 'id',
						textField : 'roleName',
						multiple : true,
						formatter : function(row) {
							var s = "<span><input type='checkbox' class='selectId' "
									+ "style='vertical-align: middle' " + "id='selectId_" + row.id + "'>"
									+ row.roleName + "<span>"
							return s;
						},
						onSelect : function(record) {
							$("#selectId_" + record.id).attr("checked", true);
						},
						onUnselect : function(record) {
							$("#selectId_" + record.id).attr("checked", false);
						}
					});
		},
		openAddRole : function(record) {
			$("#roleIds").combobox('clear'); // 清空选择框
			$(".selectId").attr('checked', false); // checkbox 取消选中
			_box.handler.edit(function(result) {
				$.each(result.data.roleIds, function(i, roleId) {
					$("#selectId_" + roleId).attr("checked", true);
				});
			});
		},
		config : {
			action : {
				save : 'sysUser/save.action', // 新增&修改 保存Action
				getId : 'sysUser/getId.action',// 编辑获取的Action
				remove : 'sysUser/delete.action'// 删除数据的Action
			},
			dataGrid : {
				title : '操作员信息',
				url : 'sysUser/dataList.action',
				idField : 'id',
				columns : [ [ {
					field : 'id',
					checkbox : true
				}, {
					field : 'name',
					title : '用户名',
					width : 80,
					sortable : true
				}, {
					field : 'nickName',
					title : '昵称',
					width : 80,
					sortable : true
				}, {
					field : 'createTime',
					title : '创建时间',
					width : 80,
					sortable : true
				}, {
					field : 'updateTime',
					title : '修改时间',
					width : 80,
					sortable : true
				}, {
					field : 'loginTime',
					title : '登录时间',
					width : 80,
					sortable : true
				}, {
					field : 'loginCount',
					title : '登录次数',
					align : 'right',
					width : 60,
					sortable : true
				}, {
					field : 'state',
					title : '状态',
					width : 80,
					align : 'center',
					sortable : true,
					styler : function(value, row, index) {
						if (value == 1) {
							return 'color:red;';
						}
					},
					formatter : function(value, row, index) {
						if (value == 0) {
							return "可用";
						}
						if (value == 1) {
							return "禁用";
						}
					}
				}, {
					field : 'roleStr',
					title : '授权项',
					width : 150,
					sortable : true
				} ] ],
				toolbar : [ {
					id : 'btnadd',
					text : '新增',
					btnType : 'add'
				}, {
					id : 'btnedit',
					text : '编辑',
					btnType : 'edit',
					handler : function() {
						var records = _box.utils.getCheckedRows();
						if (_box.utils.checkSelectOne(records)) {
							Peony.progress();
							_this.openAddRole(records);
							var data = {};
							data.id = records[0].id;
							Peony.getById(_this.config.action.getId, data, function(result) {
								Peony.closeProgress();
								_box.win.edit.form('load', result.data);
								_box.win.edit.dialog('open');
							});
						}
					}
				}, {
					id : 'btndelete',
					text : '删除',
					btnType : 'remove'
				} ]
			}
		},
		init : function() {
			_this.initForm();
			_box = new YDataGrid(_this.config);
			_box.init();
		}
	}
	return _this;
}();

$(function() {
	Peony.sysUser.init();
});
