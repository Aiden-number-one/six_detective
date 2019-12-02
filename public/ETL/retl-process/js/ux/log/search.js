var condition = "1=1";
var data_;
var height_bg = 85;


$(function() {
	width_sx();
	//重置查询条件
	$("#ResetInfo").click(function() {
		initSearchData();
	})
	
	//搜索查询数据
	$("#searchInfo").click(function() {
		sqlWhere();
	})
	//展开
//	$("#Stop_s").click(function() {
//		$("#formSearch").addClass('shrink_bottom').removeClass('shrink_screen_where');
//	})
//	//折叠
//	$("#Stop_x").click(function() {
//		$("#formSearch").addClass('shrink_screen_where').removeClass('shrink_bottom');
//	})

	var time = setTimeout(function() {
		if ($(".m-mainbox").width() > '1075') {
			$('.group').combobox('resize', {
				width : $(".screen_left").width() * 0.15,
			});
			$('.qu').combobox('resize', {
				width : $(".screen_left").width() * 0.22,
			});
			$('.Multiselect').combobox('resize', {
				width : $(".screen_left").width() * 0.18,
			});
			$('.xuanze').combobox('resize', {
				width : $(".screen_left").width() * 0.40,
			});
		} else {
			$('.group').combobox('resize', {
				width : $(".screen_left").width() * 0.12,
			});
			$('.qu').combobox('resize', {
				width : $(".screen_left").width() * 0.20,
			});
			$('.Multiselect').combobox('resize', {
				width : $(".screen_left").width() * 0.18,
			});
			$('.xuanze').combobox('resize', {
				width : $(".screen_left").width() * 0.28,
			});

		}
	}, 500)

});

//搜索展开时的样式
function showStyle(heightNum,sqlWhereNum){
	if(sqlWhereNum == 0){//初次加载时显示
		var win = $.messager.progress({
			title : '请稍后',
			msg : '正在加载数据...'
		});
	}
	//设置搜索字样背景色
	document.getElementById('searchShow').style.backgroundColor = '#bac4d2';
	//查询条件处理
	document.getElementById('for_search').style.display = 'block';
	//class样式，默认折叠样式
	$("#formSearch").addClass('shrink_screen_where').removeClass('shrink_bottom');
//	document.getElementById('forArrow').style.display = 'block';
	document.getElementById('for_search').style.height = 80;
	document.getElementById('mainDiv').style.top = 90;
	$('#data-list').datagrid('resize', {
		width : $("#width_title").width() + 5,
		height : document.body.clientHeight - heightNum,
	});
	if(sqlWhereNum == 0){
		initSearchData();
		$.messager.progress('close');
	}
}

//搜索隐藏时的样式
function hideStyle(topNum,heightNum){
	document.getElementById('searchShow').style.backgroundColor = '';
	document.getElementById('for_search').style.display = 'none';
//	document.getElementById('forArrow').style.display = 'none';
//	document.getElementById('for_search').style.height = 80;
	document.getElementById('mainDiv').style.top = topNum;
	$('#data-list').datagrid('resize', {
		width : $("#width_title").width() + 5,
		height : document.body.clientHeight - heightNum,
	});
}

//折叠查询样式
function stopStyle(addClassName,removeClassName,heightNum,topNum,heightNum){
	$("#formSearch").addClass(addClassName).removeClass(removeClassName);
	document.getElementById('for_search').style.height = heightNum;
	document.getElementById('mainDiv').style.top = topNum;
	$('#data-list').datagrid('resize', {
		width : $("#width_title").width() + 5,
		height : document.body.clientHeight - heightNum,
	});
}


//拼接SQL语句
function sqlWhere(){
	//根据名字序列化
	var data = $('#formSearch').serializeObject();
//	console.log(data);
	var where1='';//第一组查询
	var where2='';//第二组查询
	var whereLast;
	var ccArr=[];//对应=或like
	var characterArr=[];//数据类型,对应type：S或N
	var nameArr=[];//对应field
	var soArr=[];//每个查询条件之间的关系，AND 或OR
	var sos=data.sos;//两组查询条件间的关系，AND 或OR
	var typesArr=[];//选择的查询条件
	
	for(var i=0;i<6;i++){
		nameArr[i]=$('input[name="name'+i+'"]').val();
		ccArr[i]=$('input[name="cc'+i+'"]').val();
		characterArr[i]=$('input[name="character'+i+'"]').val();
		soArr[i]=($('input[name="so'+i+'"]').val() == undefined ? '' : $('input[name="so'+i+'"]').val());
		typesArr[i]=$('input[name="types'+i+'"]').val();
	}
//	console.log(ccArr);
//	console.log(characterArr);
//	console.log(nameArr);
//	console.log(soArr);
//	console.log(typesArr);
	//第一组where查询条件处理
	where1='(';
	for(var i=0;i<3;i++){
		if(typesArr[i]){
			if (characterArr[i] == 'N') {//数字型
				if (ccArr[i] == 'like' || ccArr[i] == 'not like') {
					if(i != 0 && where1 !='('){
						where1 = where1 +" " +soArr[i]+" "+nameArr[i] + " " + ccArr[i] + " '%" + typesArr[i] + "%'";
					}else{
						where1 = where1 +nameArr[i] + " " + ccArr[i] + " '%" + typesArr[i] + "%'";
					}
				} else {
//					console.log(characterArr[i]);
					if(i != 0 && where1 !='('){
						where1 = where1 +" " +soArr[i]+" "+nameArr[i] + " " + ccArr[i] + " " + typesArr[i];
					}else{
						where1 = where1 + nameArr[i] + " " + ccArr[i] + " " + typesArr[i];
					}
				}
			} else {
				if (ccArr[i] == 'like' || ccArr[i] == 'not like') {
					if(i != 0 && where1 !='('){
						where1 = where1 +" " +soArr[i]+" Upper("+nameArr[i] + ") " + ccArr[i] + " '%" + typesArr[i].toUpperCase() + "%'";
					}else{
						where1 = where1 +" Upper("+ nameArr[i] + ") " + ccArr[i] + " '%" + typesArr[i].toUpperCase() + "%'";
					}
				} else {
					if(i != 0 && where1 !='('){
						where1 = where1 +" " +soArr[i]+" Upper("+nameArr[i] + ") " + ccArr[i] + " '" + typesArr[i].toUpperCase() + "'";
					}else{
						where1 = where1 +" Upper("+ nameArr[i] + ") " + ccArr[i] + " '" + typesArr[i].toUpperCase() + "'";
					}
				}
			}
		} 
	}
	//第二组where查询条件处理
	where2 ='(';
	for(var i=3;i<6;i++){
		if(typesArr[i]){
			if (characterArr[i] == 'N') {//数字型
				if (ccArr[i] == 'like' || ccArr[i] == 'not like') {
					if(i != 3 && where2 !='('){
						where2 = where2 +" " +soArr[i]+" "+nameArr[i] + " " + ccArr[i] + " '%" + typesArr[i] + "%'";
					}else{
						where2 = where2 +nameArr[i] + " " + ccArr[i] + " '%" + typesArr[i] + "%'";
					}
				} else {
					if(i != 3 && where2 !='('){
						where2 = where2 +" " +soArr[i]+" "+nameArr[i] + " " + ccArr[i] + " " + typesArr[i];
					}else{
						where2 = where2 + nameArr[i] + " " + ccArr[i] + " " + typesArr[i];
					}
				}
			} else {
				if (ccArr[i] == 'like' || ccArr[i] == 'not like') {
					if(i != 3 && where2 !='('){
						where2 = where2 +"  " +soArr[i]+" Upper("+nameArr[i] + ") " + ccArr[i] + " '%" + typesArr[i].toUpperCase() + "%'";
					}else{
						where2 = where2 +" Upper("+ nameArr[i] + ") " + ccArr[i] + " '%" + typesArr[i].toUpperCase() + "%'";
					}
				} else {
					if(i != 3 && where2 !='('){
						where2 = where2 +" " +soArr[i]+"  Upper("+nameArr[i] + ") " + ccArr[i] + " '" + typesArr[i].toUpperCase() + "'";
					}else{
						where2 = where2 +" Upper("+ nameArr[i] + ") " + ccArr[i] + " '" + typesArr[i].toUpperCase() + "'";
					}
				}
			}
		} 
	}
	
	if(where1 != '(' && where2 != '('){//第一、二组数据中有选择项
		whereLast = where1 + "  ) " + " " + data.sos + " " + where2 + " ) ";
	}else if(where1 != '('){//第一组数据中有选择项
		whereLast = where1 + "  ) ";
	}else if(where2 != '('){//第一组数据中有选择项
		whereLast = where2 + "  ) ";
	}
	condition = whereLast;
//	console.log(condition);
	showdataGrid(whereLast);
}

/**
 * 初始化筛选框数据
 */
function initSearchData() {
	$.ajax("tbDiMonitorLog/getLogDetailFilter.action", {
		type : 'post',
		dataType : 'json',
		data : 'source=' + $("#_source").val(),
		success : function(data) {
			data_ = data
			var data_index = 1
			$('.qu').combobox({
				editable : true,
				// hasDownArrow:false,
				valueField : 'field',
				textField : 'label',
				data : data.conditions,
				onChange : function() {
					// $('#name').combotree('hidePanel');
//					console.log(this.id);
					//获取参数位置
					var str=this.id;
					var index=str.substr(str.length-1,1);
					var n = $(this).combotree('getValue');
					var types = $(this).parent().children("select.xuanze");
					loadInfo(n, data, types,index)
				},
				onLoadSuccess : function() {
					for (var i = 0; i < data.conditions.length; i++) {
						if (data.conditions[i].priority == data_index) {
							$('#name' + (data_index-1)).combobox('setValue', data.conditions[i].field);
							
							$('#character' + (data_index-1)).val(data.conditions[i].type);
						}
					}
					data_index = data_index + 1;
					width_sx();
				}
			});

		}
	});
}

//下拉框信息加载n-字段名称，datas-后台返回数据信息
function loadInfo(n, datas, types,index) {
	for(var i=0;i<datas.conditions.length;i++){
		if(n == datas.conditions[i].field){
			if(datas.conditions[i].data != ''){//判断是否是下拉框
//				if(n == 'task_no' || n == 'SRC'  || n == 'TAR' ){
				if(datas.conditions[i].editable == 'T'  ){//下拉框是否允许手动输入
					select_tet(datas.conditions[i].data, 'name', 'name', types, false,true);
				}else{
					select_tet(datas.conditions[i].data, 'name', 'name', types, false,false);
				}
				break;
			}else{
				types.combobox({
					editable : true,
					hasDownArrow : false,
					panelHeight : '0',
					onChange : function() {
						$(this).combotree('hidePanel');
					},
					icons : [ {
						iconCls : 'icon-no'
					} ]
				});
				$(".icon-no").unbind('click').click(function() {
					var no = $(this).parent().parent().parent().children("select.qu").combotree('getValue');
					var typea = $(this).parent().parent().parent().children("select.xuanze")
					loadInfo(no, data_, typea,index)
				});
				break;
			}
			//加载信息
			if(index != ''){
				$('#character' + index).val(datas.conditions[i].type)
			}
		}
	}
}

//select_tet(datas.conditions[i].data, 'name', 'name', types, false,true);
function select_tet(data, name, value, type, tf,foreditable) {
//	 console.log(value);
//	 console.log(data);
	type.combobox({
//		editable : true,
		hasDownArrow : true,
		multiple : tf,
		panelHeight : '200',
		editable : foreditable,
		valueField : value,
		textField : value,
		data : data,
		icons : [ {
			iconCls : 'icon-no'
		} ]
	});
	
	$(".icon-no").unbind('click').click(function() {
		var no = $(this).parent().parent().parent().children("select.qu").combotree('getValue');
		var typea = $(this).parent().parent().parent().children("select.xuanze")
		loadInfo(no, data_, typea,'')
	})
}

$("#Stop").click(function() {
	if ($("#Stop_left").css('left') == '0px') {
		$("#Stop_left").animate({
			left : "-170px"
		});
		$(this).animate({
			left : "100%"
		});
		$("#m-query").animate({
			left : "20px"
		});
		$("#m-query").css("width", "calc(100% - 20px)");
		$("#Stop_img").attr('src', 'images/left.png');
		$('#data-list').datagrid('resize', {
			width : $("#m-query").width(),
		}).datagrid('resize', {
			width : $("#m-query").width(),
		});
	} else {
		$("#Stop_left").animate({
			left : "0px"
		});
		$(this).animate({
			left : "91%"
		});
		$("#m-query").animate({
			left : "180px"
		});
		$("#m-query").css("width", "calc(100% - 190px)");
		$("#Stop_img").attr('src', 'images/right1.png');
		$('#data-list').datagrid('resize', {
			width : $("#m-query").width(),
		}).datagrid('resize', {
			width : $("#m-query").width(),
		});
	}
})


$(window).resize(function() {
	width_sx()
	$('#data-list').datagrid('resize', {
		width : $("#mainDiv").width() - 10,
		height : $("#Stop_left").height() - height_bg
	}).datagrid('resize', {
		width : $("#mainDiv").width() - 10,
		height : $("#Stop_left").height() - height_bg
	});
})
function width_sx() {// 重置筛选器宽度
	if ($(".m-mainbox").width() > '1075') {
		$('.group').combobox('resize', {
			width : $(".screen_left").width() * 0.15,
		});
		$('.qu').combobox('resize', {
			width : $(".screen_left").width() * 0.22,
		});
		$('.Multiselect').combobox('resize', {
			width : $(".screen_left").width() * 0.18,
		});
		$('.xuanze').combobox('resize', {
			width : $(".screen_left").width() * 0.40,
		});
	} else {
		$('.group').combobox('resize', {
			width : $(".screen_left").width() * 0.12,
		});
		$('.qu').combobox('resize', {
			width : $(".screen_left").width() * 0.20,
		});
		$('.Multiselect').combobox('resize', {
			width : $(".screen_left").width() * 0.18,
		});
		$('.xuanze').combobox('resize', {
			width : $(".screen_left").width() * 0.28,
		});
	}
}

$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [ o[this.name] ];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};
