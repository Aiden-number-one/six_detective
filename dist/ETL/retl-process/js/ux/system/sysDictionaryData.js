$package('Peony.sysDictionaryData');
Peony.sysDictionaryData = function() {
	var _box = null;
	var _this = {
		//设置默认按钮数据
		addDefBtns : function() {
			for ( var i = 0; i < 5; i++) {
				_this.addLine();
			}
		},
		addLine : function(data) {
			var table = $("#btn-tb");
			var html = "<tr class='tb-line'>";
			html += "	<td align='center'><span  class='newFlag red'>*</span></td>";
			html += "	<td><input name=\"dictdataValue\" class=\"easyui-validatebox text-name\" style=\"width:100%\" data-options=\"required:true\"></td>";
			html += "	<td><input name=\"dictdataName\" class=\"easyui-validatebox text-name\" style=\"width:100%\" data-options=\"required:true\"></td>";
			html += "	<td align='center'><a class=\"easyui-linkbutton remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
			html += "	<input class=\"hidden\" name=\"deleteFlag\">";
			html += "	</td>";
			html += "</tr>";
			var line = $(html);
			//绑定删除按钮事件
		$(".remove-btn", line).click(function() {
			_this.delLine(line);
		});
		if (data) {
			if (data.id) {
				$(".newFlag", line).html(''); //清空新增标记
			}
			$("input[name='dictdataValue']", line).val(data.name);
		}
		$.parser.parse(line);//解析esayui标签
		table.append(line);

	},
	//删除全部
		delAllLine : function(b) {
			if (b) {
				$(".tb-line").remove();
			} else {
				$(".tb-line").each(function(i, line) {
					_this.delLine($(line));
				});
			}
		},
		//删除单行
		delLine : function(line) {
			if (line) {
				var btnId = $("input[name='btnId']", line).val();
				if (btnId) {
					$("input[name='deleteFlag']", line).val(1); //设置删除状态
					line.fadeOut();
				} else {
					line.fadeOut("fast", function() {
						$(this).remove();
					});
				}
			}
		},
		config : {
			action : {
				save : 'sysDictionaryData/save.action', //新增&修改 保存Action  
				getId : 'sysDictionaryData/getId.action',//编辑获取的Action
				remove : 'sysDictionaryData/delete.action'//删除数据的Action
			},
			event : {
				add : function() {
					$("#frm_add").show();
					$("#frm_edit").hide();
					_this.delAllLine(true); //清空已有的数据
				_box.handler.add(); //调用add方法
			},
			edit : function() {
				$("#frm_add").hide();
				$("#frm_edit").show();
				_this.delAllLine(true);
				_box.handler.edit();
			}
			},
			dataGrid : {
				title : '字典数据信息',
				url : 'sysDictionaryData/dataList.action',
				idField : 'dataId',
				columns : [ [ {
					field : 'dataId',
					checkbox : true
				}, {
					field : 'valueName',
					title : '所属字典',
					width : 20,
					sortable : true
				}, {
					field : 'dictdataValue',
					title : '数据值',
					width : 20,
					sortable : true
				}, {
					field : 'dictdataName',
					title : '数据名称',
					width : 20,
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
				}, {
					id : 'btnback',
					text : '返回',
					iconCls : 'icon-back',
					handler : function() {
						window.history.back();
					}
				} ]
			}
		},
		init : function() {
			_box = new YDataGrid(_this.config);
			_box.init();
			$('#addLine_btn').click(_this.addLine);
			$('#addDefLine_btn').click(_this.addDefBtns);
			$('#delAllLine_btn').click(function() {
				Peony.confirm('确认提示', '您确定要删除记录？', function(r) {
					_this.delAllLine(false);
				});
			});

		}
	}
	return _this;
}();

$(function() {
	Peony.sysDictionaryData.init();
});
