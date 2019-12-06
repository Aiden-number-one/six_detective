$package('Peony.sysMenu');
Peony.sysMenu = function() {
	var _box = null;
	var _this = {
		toList:function(parentId){
				_box.form.search.resetForm();
				if(parentId){
					$('#search_parentId').val(parentId);
					$('#btnback').linkbutton('enable');
					_box.grid.datagrid('hideColumn','childMenus');
				}else{
					$('#btnback').linkbutton('disable');
					_box.grid.datagrid('showColumn','childMenus');
				}
				_box.handler.refresh();
		},
		//设置默认按钮数据
		addDefBtns:function(){
			var defaultBtns= [
				{"btnname":"添加","menuid":2,"actionurls":"save.action","btntype":"add"},
				{"btnname":"编辑","menuid":2,"actionurls":"getId.action|save.action","btntype":"edit"},
				{"btnname":"删除","menuid":2,"actionurls":"delete.action","btntype":"remove"}
			];
			var tbline = $(".tb-line:visible");
			var btntype = $("input[name='btntype']",tbline);
			$.each(defaultBtns,function(i,btn){
				var isExists = false;
				//判断按钮类型是否存在
				if(btntype.length > 0){
					for(var i =0; i < btntype.length; i++){
						if(btntype.eq(i).val() == btn.btntype){
							isExists = true;
							break;
						}
					}
				}
				if(!isExists){
					_this.addLine(btn);
				}
			});
		},
		addLine: function(data){
			var table = $("#btn-tb");
			var	html = "<tr class='tb-line'>";
			html+=	   "	<td align='center'><span  class='newFlag red'>*</span></td>";
			html+=	   "	<td><input name=\"btnname\" class=\"easyui-validatebox text-name\" style=\"width:100%\" data-options=\"required:true\"></td>";
			html+=	   "	<td><input name=\"btntype\" class=\"easyui-validatebox text-name\" style=\"width:100%\" data-options=\"required:true\"></td>";
			html+=	   "	<td><input name=\"actionurls\" class=\"easyui-validatebox text-desc\" style=\"width:100%\"  ></td>";
			html+=	   "	<td align='center'><a class=\"easyui-linkbutton remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
			html+=	   "	<input class=\"hidden\" name=\"btnId\">";
			html+=	   "	<input class=\"hidden\" name=\"deleteFlag\">";
			html+=	   "	</td>";
			html+=	   "</tr>";
			var line = $(html);
			//版定删除按钮事件
			$(".remove-btn",line).click(function(){
				Peony.confirm('确认提示', '您确定要删除记录？',function(r){
					if(r){
						_this.delLine(line);
					}
				})
			});
			if(data){
				if(data.btnId){
					$(".newFlag",line).html(''); //清空新增标记
				}
				$("input[name='btnId']",line).val(data.btnId);
				$("input[name='btnname']",line).val(data.btnname);
				$("input[name='btntype']",line).val(data.btntype);
				$("input[name='actionurls']",line).val(data.actionurls);
			}
			$.parser.parse(line);//解析esayui标签
			table.append(line);
			
		},
		//删除全部
		delAllLine:function(b){
			if(b){
				$(".tb-line").remove();
			}else{
				$(".tb-line").each(function(i,line){
					_this.delLine($(line));
				});
			}
		},
		//删除单行
		delLine:function(line){
			if(line){
				var btnId = $("input[name='btnId']",line).val();
				if(btnId){
					$("input[name='deleteFlag']",line).val(1); //设置删除状态
					line.fadeOut();
				}else{
					line.fadeOut("fast",function(){
						 $(this).remove();
					});
				}
			}
		},
		config:{
  			action:{
  				save:'sysMenu/save.action', //新增&修改 保存Action  
  				getId:'sysMenu/getId.action',//编辑获取的Action
  				remove:'sysMenu/delete.action'//删除数据的Action
  			},
  			event:{
  				add : function(){
  					_this.delAllLine(true);//清空已有的数据
  					_box.handler.add();//调用add方法
					var parentId =$('#search_parentId').val();
					if(parentId){
						$("#edit_parentId").val(parentId);
					}
				},
				edit:function(){
					_this.delAllLine(true);
					_box.handler.edit(function(result){
						$.each(result.data.btns,function(i,btn){
							_this.addLine(btn);
						});
					});
				}
  			},
  			dataGrid:{
  				title:'菜单列表',
	   			url:'sysMenu/list.action',
	   			columns:[[
					{field:'id',checkbox:true},
					{field:'name',title:'名称',width:120,sortable:true},
					{field:'rank',title:'排序',align:'right',width:80,sortable:true},
					{field:'url',title:'URL',width:220,sortable:true},
					{field:'icon',title:'图标',width:120,sortable:true},
					{field:'createtime',title:'创建时间',width:120,sortable:true},
					{field:'updatetime',title:'修改时间',width:120,sortable:true},
					{field:'childMenus',title:'子菜单',width:120,align:'center',formatter:function(value,row,index){
						var html ="<a href='javascript:Peony.sysMenu.toList(\""+row.id+"\")'>子菜单管理("+row.subCount+")</a>";
						return html;
					}}
				]],
				toolbar:[
					{id:'btnadd',text:'新增',btnType:'add'},
					{id:'btnedit',text:'编辑',btnType:'edit'},
					{id:'btndelete',text:'删除',btnType:'remove'},
					{
						id:'btnback',
						text:'返回',
						disabled: true,
						iconCls:'icon-back',
						handler:function(){
							_this.toList();
						}
					}
				]
			}
		},
		init:function(){
			_box = new YDataGrid(_this.config); 
			_box.init();
			$('#addLine_btn').click(_this.addLine);
			$('#addDefLine_btn').click(_this.addDefBtns);
			$('#delAllLine_btn').click(function(){
				Peony.confirm('确认提示', '您确定要删除记录？',function(r){
					_this.delAllLine(false);
				});
			});
		}
	}
	return _this;
}();

$(function() {
	Peony.sysMenu.init();
});
