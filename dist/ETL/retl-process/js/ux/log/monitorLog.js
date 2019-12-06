var condition = "1=1";
$(function() {
	initSearchData();//加载查询条件
	showdataGrid(condition);
	$('#ril').unbind('click').click(function() {
		$(location).attr('href', getRealPath() + "/task/cale.action");
	});
	// 柱形图页面跳转
	$('#tx').unbind('click').click(function() {
		$(location).attr('href',getRealPath() + "/tbDiMonitorLog/imageInfo.action");
	});
	//展开
	$("#Stop_s").click(function() {
		$("#formSearch").addClass('shrink_bottom').removeClass('shrink_screen_where');
		$('#data-list').datagrid('resize', {
			width : $("#m-query").width() + 5,
			height : document.body.clientHeight - 150,
		});
	})
	//折叠
	$("#Stop_x").click(function() {
		$("#formSearch").addClass('shrink_screen_where').removeClass('shrink_bottom');
		$('#data-list').datagrid('resize', {
			width : $("#m-query").width() + 5,
			height : document.body.clientHeight - 80,
		});
	})

});

/**
 * 根据条件查询数据
 * 
 * @param condition
 */
function showdataGrid(condition) {
	if (condition == undefined)
		condition = "";
	condition = encodeURI(condition);
	condition = encodeURI(condition);
	Peony.progress();
	$('#data-list').datagrid({
			url : "tbDiMonitorLog/logDataList.action?condition="
					+ condition,
			idField : 'monitorId',
			view : scrollview, // 虚拟滚动
			rownumbers : true, // 行号
			singleSelect : true,// 单选
			checkOnSelect : true,
			width : '100%',
			autoRowHeight : false,// 是否设置基于该行内容的行高度
			remoteSort : false,
			striped : true,// 奇偶行显示不同背景色
			multiSort : true,// 多列排序
			pageNumber :1,
			// fitColumns : false,//
			// 自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动。
			pageSize : 50,
			columns : [ [
					{
						field : 'monitorId',
						hidden : true
					},
					{
						title : '作业执行ID',
						field : 'executorId',
						width : 130,
						sortable : true
					},
					{
						title : '层',
						field : 'monitorLevel',
						width : 30,
						sortable : true
					},
					{
						field : 'nodeName',
						title : '节点名称',
						width : 150,
						sortable : true
					},
					{
						field : 'memberType',
						title : '节点类型',
						width : 90,
						sortable : true
					},
					{
						title : '序',
						field : 'orderNo',
						width : 30,
						sortable : true
					},
					{
						title : '任务编号',
						field : 'memberNo',
						width : 200,
						sortable : true
					},
					{
						field : 'memberName',
						title : '任务名称',
						width : 200,
						sortable : true
					},
					{
						field : 'batchNo',
						title : '批号',
						width : 100,
						sortable : true
					},
					{
						field : 'scheduleName',
						title : '调度计划',
						width : 130,
						sortable : true
					},
					{
						field : 'executeType',
						title : '方式',
						width : 50,
						sortable : true
					},
					{
						field : 'startTime',
						title : '开始时间',
						width : 130,
						sortable : true
					},
					{
						field : 'endTime',
						title : '结束时间',
						width : 130,
						sortable : true
					},
					{
						field : 'duration',
						title : '时长(秒)',
						width : 70,
						sortable : true
					},
					{
						field : 'deleteNum',
						title : '删除行数',
						width : 70,
						sortable : true
					},
					{
						field : 'insertNum',
						title : '插入行数',
						width : 70,
						sortable : true
					},
					{
						field : 'executeFlag',
						title : '执行状态',
						width : 70,
						sortable : true
					},
					{
						field : 'executeMsg',
						title : '执行信息',
						width : 500,
						formatter : function(value, row, index) {
							if ("数据剖析任务" == row.memberType) {
								return "<a href=\"javascript:void(0)\" onclick=\"showDetail('"
										+ value
										+ "')\"><font color='blue'>剖析结果<img src='images/right.png' class='right_img' /></font></a>";
							} else {
								return "<span title='" + value
										+ "' ondblclick ='showMsg(this)'>" + value + "</span>";
							}

						},
						sortable : true
					} ] ],
			rowStyler : function(index, row) {
				var executeFlag = row.executeFlagId;
				if (executeFlag == 'F' || executeFlag == 'B'|| executeFlag == 'A' || executeFlag == 'I') {
					return 'font-weight:16px;font-weight:bold;color:#f00;';
				}
			},
			onLoadSuccess : function() {
				Peony.closeProgress();
			}
		});
}

//双击展示执行信息
function showMsg(obj){
//	console.log($(obj));
	var str=$(obj).text();
	var h,w,r,c;
	if(str.length > 100){
		 h=490;
		 w=600;
		 r=22;
		 c=92
	}else{
		h=300;
		w=400;
		r=10;
		c=57
	}
	$.messager.show({
		title:'执行信息',
		msg:"<textarea style='border: 0;word-wrap:normal;white-space:nowrap;resize:none;' rows='"+r+"' cols='"+c+"'>"+$(obj)[0].innerHTML,
		width : w,
		height:h,
		showType:null,
		timeout :0,
		style:{}
	});
}

function getRealPath() {
	var localObj = window.location;
	var contextPath = localObj.pathname.split("/")[1];
	var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
	return basePath;
};

function showDetail(path) {
	// window.open("task/getSummery.action?path=" + encodeURI(path));
	openWindowWithPost("task/getSummary.action", "blank", "path", path);
}

/**
 * window.open模拟表单POST提交
 * @param url 请求地址
 * @param targetName window.open targetName
 * @param inputName 文本域名称类似 ?path=xxx
 * @param inputValue 文本域值
 */
function openWindowWithPost(url, targetName, inputName, inputValue) {
	var tempForm = document.createElement("form");
	tempForm.id = "tempForm";
	tempForm.method = "post";
	tempForm.action = url;
	tempForm.target = targetName;
	var hideInput = document.createElement("input");
	hideInput.type = "hidden";
	hideInput.name = inputName;
	hideInput.value = inputValue;
	tempForm.appendChild(hideInput);
	if (tempForm.attachEvent) { // IE   
		tempForm.attachEvent("onsubmit", function() {
			window.open('about:blank', 'blank');
		});
	} else if (tempForm.addEventListener) { // DOM Level 2 standard    
		tempForm.addEventListener("onsubmit", function() {
			window.open('about:blank', 'blank');
		});
	}
	document.body.appendChild(tempForm);
	if (document.createEvent) { // DOM Level 2 standard    
		evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("submit", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		tempForm.dispatchEvent(evt);
	} else if (tempForm.fireEvent) { // IE    
		tempForm.fireEvent('onsubmit');
	}
	//必须手动的触发          
	tempForm.submit();
	document.body.removeChild(tempForm);
}

