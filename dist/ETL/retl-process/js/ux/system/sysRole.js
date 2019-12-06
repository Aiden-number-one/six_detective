$package('Peony.sysRole');
Peony.sysRole = function() {
	var _box = null;
	var _this = {
		menu : $('#menu-tree'),
		fun : $('#fun-tree'),
		buildTreeData : function(nodes) {
			$.each(nodes, function(i, note) {
				if (note.id != '-1') {
					var id = note.attributes.id;
					var type = note.attributes.type;
					var $id = $("<input type='hidden' name='menuIds' class='c_menus'>");
					if (type == 0) {
						$id.attr('name', 'menuIds');
					} else if (type == 1) {
						$id.attr('name', 'btnIds');
					}
					$id.val(id);
					_box.form.edit.append($id);
				}
			});
		},
		buildFunTreeData : function(nodes) {
			$.each(nodes, function(i, note) {
				if (note.id != '-1') {
					var id = note.id;
					var $id = $("<input type='hidden' name='funIds' class='c_funs'>");
					$id.attr('name', 'funIds');
					$id.val(id);
					_box.form.edit.append($id);
				}
			});
		},
		setTreeValue : function(id) {
			var node = _this.menu.tree("find", id);
			if (node && node.target) {
				// 判断是否选择或者半选状态
				if ($(node.target).find(".tree-checkbox0")[0]) {
					_this.menu.tree('check', node.target);
				}
			}
		},
		setFunTreeValue : function(id) {
			var node = _this.fun.tree("find", id);
			if (node && node.target) {
				// 判断是否选择或者半选状态
				if ($(node.target).find(".tree-checkbox0")[0]) {
					_this.fun.tree('check', node.target);
				}
			}
		},
		clearTreeData : function() {
			$(".tree-checkbox1", _this.menu).removeClass("tree-checkbox1").addClass("tree-checkbox0");
			$(".tree-checkbox2", _this.menu).removeClass("tree-checkbox2").addClass("tree-checkbox0");
			$('.c_menus').remove();
			_this.menu.tree('reload');

			$(".tree-checkbox1", _this.fun).removeClass("tree-checkbox1").addClass("tree-checkbox0");
			$(".tree-checkbox2", _this.fun).removeClass("tree-checkbox2").addClass("tree-checkbox0");
			$('.c_funs').remove();
			_this.fun.tree('reload');
		},
		save : function() {
			var checknodes = _this.menu.tree('getChecked');
			var innodes = _this.menu.tree('getChecked', 'indeterminate');
			_this.buildTreeData(checknodes);
			_this.buildTreeData(innodes);

			var checknodes2 = _this.fun.tree('getChecked');
			var innodes2 = _this.fun.tree('getChecked', 'indeterminate');
			_this.buildFunTreeData(checknodes2);
			_this.buildFunTreeData(innodes2);
			_box.handler.save();
		},
		config : {
			action : {
				save : 'sysRole/save.action', // 新增&修改 保存Action
				getId : 'sysRole/getId.action',// 编辑获取的Action
				remove : 'sysRole/delete.action'// 删除数据的Action
			},
			event : {
				add : function() {
					_this.clearTreeData();
					_box.handler.add();
				},
				edit : function() {
					_this.clearTreeData();
					_box.handler.edit(function(result) {
						var btnIds = result.data.btnIds;
						var menuIds = result.data.menuIds;
						var funIds = result.data.funIds;
						$.each(btnIds, function(i, id) {
							_this.setTreeValue("btn_" + id);
						});
						$.each(menuIds, function(i, id) {
							_this.setTreeValue("menu_" + id);
						});
						$.each(funIds, function(i, id) {
							_this.setFunTreeValue(id);
						});
					});
				},
				save : function() {
					// 判断是否被禁用帐号
					var state = $("input[name='state']", _box.form.edit).val();
					if (state != 0) {
						Peony.confirm("提示", "禁用角色将会自动解除关联的用户授权,是否确定?", function(r) {
							if (r) {
								_this.save();
							}
						});
					} else {
						_this.save();
					}
				}
			},
			dataGrid : {
				title : '角色列表',
				url : 'sysRole/dataList.action',
				columns : [ [ {
					field : 'id',
					checkbox : true
				}, {
					field : 'roleName',
					title : '角色名称',
					width : 80,
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
					field : 'createTime',
					title : '创建时间',
					width : 120,
					sortable : true
				}, {
					field : 'updateTime',
					title : '修改时间',
					width : 120,
					sortable : true
				}, {
					field : 'descr',
					title : '角色描述',
					width : 120,
					sortable : true
				} ] ],
				toolbar : [ {
					id : 'btnadd',
					text : '新增',
					btnType : 'add'
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

			_this.menu.tree({
				url : 'sysMenu/getMenuTree.action',
				checkbox : true,
				loadFilter : function(data) { // 添加根节点
					var root = [];
					var node = {
						"id" : "-1",
						"text" : "系统菜单",
						"iconCls" : "glyphicon glyphicon-home",
					};
					node.children = data;
					root.push(node);
					return root;
				}
			});

			_this.fun.tree({
				url : 'sysRole/getFunTree.action',
				checkbox : true,
				loadFilter : function(data) { // 添加根节点
					var root = [];
					var node = {
						"id" : "-1",
						"text" : "功能菜单",
						"iconCls" : "glyphicon glyphicon-home",
					};
					node.children = data;
					root.push(node);
					return root;
				}
			});
		}
	}
	return _this;
}();

$(function() {
	Peony.sysRole.init();
});