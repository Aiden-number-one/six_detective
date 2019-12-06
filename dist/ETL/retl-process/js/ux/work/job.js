var transfer=[]
var urlId=''
var condition = "1=1";// 修改后的查询条件
var sqlWhereNum=0;//查询条件加载次数
$(function() {
	// 加载左侧作业流程信息
	var surl = "job/treeList2.action?id=NULL&vartype=''";
	showTree("");
	showTree(surl);

	// 新增作业流程
	$('#jf_btn_newJob').click(function() {
//		$('#jf_win_newJob').window('open');
		$(location).attr('href', getRealPath() + "/job/addJobFlow.action");
	});
	
	$("#jf_tabs_svg").attr("style","display:none;");//显示
	$("#forList").attr("style","display:block;");//列表数据信息
	if (window.sessionStorage.getItem('_folderId') != undefined) {
		$('#search_folderId').val(window.sessionStorage.getItem('_folderId'));
	}
	if (window.sessionStorage.getItem('_ifCheck') != undefined) {
		var _ifCheck = window.sessionStorage.getItem('_ifCheck');
		if (_ifCheck === 'Y') {
			$("#ifCheck").attr("checked", true);
		} else {
			$("#ifCheck").attr("checked", false);
		}
	}
	if(window.sessionStorage.getItem('chooseInfo')!=undefined){
		urlId=window.sessionStorage.getItem('chooseInfo');
		 showdataGrid(condition);
		 sessionStorage.removeItem('chooseInfo')
	}else{
	//获取第一层文件夹id,默认记载第一层文件夹下数据 wfy 20170303
		$.ajax({  
			type: "get",  
			url: "job/getFistFile.action?id=NULL&fileType=1",  
			success: function(result){  
				$('#search_folderId').val(result.data.folderId);
				showdataGrid(condition);
				$("#forFileName").text(" / "+result.data.folderName);
			}  
		}); 
	}
	//右侧数据列表的按钮信息 wfy 20170303
	$('#data-list').datagrid({
		toolbar: '#tb'
	});
	//隐藏查询条件
	$('#for_search').hide();
	//折叠
	$("#Stop_x").click(function() {
		stopStyle('shrink_screen_where','shrink_bottom',80,90,125);
	})
	// 展开
	$("#Stop_s").click(function() {
		stopStyle('shrink_bottom','shrink_screen_where',140,160,200);
	})
	
	//datagrid跟随浏览器调整大小
	 $(window).resize(function () {
		$("#cc").css("height", document.body.clientHeight-10).css("width", document.body.clientWidth);
		$("#west").css("height", document.body.clientHeight-40)
		$("#center").css("width", document.body.clientWidth-$("#west").width()); 
		$("#width_title").css("width", document.body.clientWidth-$("#west").width()-20); 
	    $('#data-list').datagrid('resize', {
	    	  width : document.body.clientWidth-$("#west").width()-45,
			  height : document.body.clientHeight-80
	      });
	 });
	// datagrid跟随layout调整大小
	 $('#cc').layout({
		  onCollapse: function(){//折叠后
			  $("#width_title").css("width", $("#cc").width()-37); 
			  $('#data-list').datagrid('resize', {
					width : $("#cc").width()-45,
				});
		  },
		  onExpand: function(){
			  $("#width_title").css("width", $("#cc").width()-$("#west").width()-37); 
			  $('#data-list').datagrid('resize', {
					width : $("#cc").width()-$("#west").width()-45,
				});
		  }
	});
	 //左右拖拽调整大小
	 $('#cc').layout('panel', 'west').panel({
		 onResize:function(){
			 $("#width_title").css("width", $("#cc").width()-$("#west").width()-37); 
			 $('#data-list').datagrid('resize', {
					width : $("#cc").width()-$("#west").width()-45,
				});
		 }
	 }); 
});

//是否显示搜索
function searchShow(){
	var state=document.getElementById('for_search').style.display;
	if(state == 'none'){
		showStyle(125,sqlWhereNum);
		sqlWhereNum=sqlWhereNum+1;
	}else{
		hideStyle(40,80);
	}
}
//查询子目录按钮事件
function checkSearch(){
	sqlWhere();
}
//右侧画布中的事件执行后更新job页面数据信息
function dwrJobTree(data){
	var odata = JSON.parse(data);
	if(odata.refreshFlag){//更新左侧树
		var surl = "job/treeList2.action?id=NULL&vartype=''";
		showTree(surl);
	}
//	var titlename="【"+odata.jobNo+"】"+odata.jobName;
	var titlename=odata.jobName;
	//更新tab名称
	var tab = $('#jf_tabs_svg').tabs('getSelected'); //获取选中面板
	var index = $('#jf_tabs_svg').tabs('getTabIndex',tab);
	var selecttab = $('#jf_tabs_svg').tabs('getTab',index);  // 取得第一个tab 
//	console.log(selecttab.title);
//	alert(odata.folderId);
	var url = "job/initJobFlow.action?jobId=" + odata.jobId+"&folderId="+odata.folderId;
	var content = '<iframe  frameborder="0" src="'
		+ url
		+ '" style="display:block;width:100%;height:100%;" border="0" marginwidth="0" marginheight="0" scrolling="no" ></iframe>';
	$('#jf_tabs_svg').tabs('update', { 
        tab: selecttab, 
        options: { 
            title: titlename,
            content : content
        } 
    });
}
//左侧树形显示
function showTree(url) {
	$('#list_jobflow').tree({
		url : url,
		method : 'get',
		animate : true,
		checkbox : false,
		cascadeCheck : false,// 层叠选中
		onlyLeafCheck : true,
		lines : true,// 显示虚线效果
		onClick : function(node) {
				 //该文件夹下任务信息
				 var fid=node.id;
				 urlId=node.id
				 $("#search_folderId").val(fid);
				 $("#forFileName").text(" / "+node.text);
				 sqlWhere();
		},
		onLoadSuccess:function(){
			if(urlId.length>0){
				var node = $('#list_jobflow').tree('find',urlId);
				$('#list_jobflow').tree('select', node.target);
			}
		},
		onContextMenu : function(e, node) {
			e.preventDefault();
			$(this).tree('select', node.target);
			$('#jobflow_right_menu_job').menu('show', {
				left : e.pageX,
				top : e.pageY
			});
		}
	}); 
}


// 增加画布tab
function addTab(title, url) {
	$("#jf_tabs_svg").attr("style","display:block;");//显示
	$("#forList").attr("style","display:none;");//列表数据信息
	var tab_wrap = $('#jf_tabs_svg');
	if (tab_wrap.tabs('exists', title)) {
		tab_wrap.tabs('select', title);
	} else {
		var content = '<iframe  frameborder="0" src="'
				+ url
				+ '" style="display:block;width:100%;height:100%;" border="0" marginwidth="0" marginheight="0" scrolling="no" ></iframe>';
		tab_wrap.tabs('add', {
			title : title,
			content : content,
			closable : true
		});
	}
}

/*
 * 重命名作业保存
 */
$("#jf_btn_saveSubmit").unbind('click').click(function() {
	if ($("#formInfo").form('validate')) {// 启用校验
		Peony.progress();
		var data = $('#form_newJob').serialize();
		$.ajax({
			type : "post",
			url : "job/saveJobFlow.action",
			data : data,
			success : function(data) {
				var surl = "job/treeList.action?id=NULL&vartype=''";
				showTree(surl);
				Peony.closeProgress();
				$('#jf_win_updataJob').window('close');
				sqlWhere();
			}
		});
	}else {
		$.messager.alert('提示', "有非空字段需要填写，请检查.", 'waring');
	}
});
/*
 * 重命名作业关闭
 */
$("#btn-jobFlow-close").click(function() {
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if(r){ 
			$('#jf_win_updataJob').window('close');
		}
	});
});

/**
 * 获取项目的绝对路径
 * 
 * @returns {String}
 */
function getRealPath() {
	var localObj = window.location;
	var contextPath = localObj.pathname.split("/")[1];
	var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
	return basePath;
};

// 右侧列表显示数据及事件处理---------------start-------- wfy 20170303
//页面事件处理------------------------start----------
//新增addjob
$('#addjob').click(function(){
	$(location).attr('href', getRealPath() + "/job/addJobFlow.action");
//	var text = '新建作业' + count_graphic;
////	addTab(text, "job/addJobFlow.action?&jobName="+text);//保存时默认作业名称
//	addTab(text, "job/addJobFlow.action");
//	count_graphic++;
});
//编辑按钮
$('#editJob').click(function(){
	//获取选中行
	var node=$('#data-list').datagrid('getChecked');
	if(node.length == 0){
		$.messager.alert('警告', '未选择记录.', 'warning');
	}else if(node.length > 1){
		$.messager.alert('警告', '只能选择一条待编辑作业信息.', 'warning');
	}else{
//		console.log("jobName--"+node[0].jobName);
//		console.log("folderId--"+node[0].folderId);
		//打开画布信息

		folderId=node[0].folderId;//需要处理
		var ifCheck;
		 var rep=$('#ifCheck').is(':checked');//是否选中
		 if(rep){
			 ifCheck="Y";
		 }else{
			 ifCheck="N";
		 }
		$(location).attr('href', getRealPath() + "/job/initJobFlow.action?jobId=" + node[0].jobId+"&folderId="+folderId+"&jobNo="+encodeURI(encodeURI(node[0].jobNo))+"&jobName="+encodeURI(encodeURI(node[0].jobName))+"&ifCheck="+ifCheck);
//		addTab(node[0].jobName, "job/initJobFlow.action?jobId=" + node[0].jobId+"&folderId="+folderId+"&jobName="+node[0].jobName);	
	}
});
//移动文件夹
$('#movejob').click(function(){
	//获取选中行
	var node=$('#data-list').datagrid('getChecked');
	if(node.length == 0){
		$.messager.alert('警告', '未选择记录.', 'warning');
	}else{
		//获取选中的信息
		$("#fromResultM").trigger("click");
		$('#t_moveTask_file').window('open');
		getTreeInfo("folderIdM");//加载树形信息
		transfer=[]
		$.each(node,function(i){
			transfer.push(node[i])
			$('#folderIdM').combotree('setValue', node[i].folderId);
			$('#jobId').val(node[i].jobId);
		})
	}
});
//重命名作业
$('#reNamejob').click(function(){
	//获取选中行
	var node=$('#data-list').datagrid('getChecked');
	if(node.length == 0){
		$.messager.alert('警告', '未选择记录.', 'warning');
	}else if(node.length > 1){
		$.messager.alert('警告', '只能选择一条待移动作业信息.', 'warning');
	}else{
		var data = {};
		var jid=node[0].jobId;
//		console.log("jobId--"+node[0].jobId);
		data.jobId=jid;
		$.ajax({  
			type: "post",  
			url: "job/getJob.action",
			data :data,
			success: function(result){  
				$("#form_newJob").form('myLoad', result.data);
				$('#jf_win_updataJob').window('open');
			}  
		});
	}
});
//复制 
$('#copyjob').click(function(){
	var records1= $('#data-list').datagrid('getSelections'); //获取所有选中的行
	if(records1 == null || records1 == ''){
		Peony.alert('警告', '请选择待复制的记录.', 'warning');
	}else{
		var data = {};
		$.each(records1, function(i, record) {
			if(i==0){
				data.jobId=record.jobId;
			}else{
				var t=record.jobId;
				data.jobId=data.jobId+","+t;
			}
		});
		$.ajax({  
			type: "post",  
			dataType : 'json',
			url: "job/copyInfo.action",  
			data : data,
			success: function(msg){  
				var sfolderId=$("#search_folderId").val();//获取当前数据所属文件夹
				$("#data-list").datagrid( {
					url : "job/viewdataList.action?fid="+sfolderId+"&jobNo="+"&jobName=&ifCheck=",
					onLoadSuccess: function () { 
						var jobIdList=msg.jobIdList;
						if(jobIdList != null && jobIdList.length >0){
//							for(var i=0;i<jobIdList.length;i++){
							    var i=jobIdList.length-1; 
								$('#data-list').datagrid('selectRecord', jobIdList[i]);
//							}
						}
					}
				});
			}  
		}); 
	}
});
//删除
$('#deletejob').click(function(){
	//获取选中行
	var nodes=$('#data-list').datagrid('getChecked');
	if(nodes.length == 0){
		$.messager.alert('警告', '请选择待删除记录.', 'warning');
	}else{
		$.messager.confirm('确认提示', '您确定要删除该作业信息吗？', function(r) {
			var arr = [];
			$.each(nodes, function(i, node) {
				arr.push('id=' + node["jobId"]);
			});
			var data = arr.join("&");
			if (r) {
				$.ajax({  
					type: "post",  
					dataType : 'json',
					url: "job/delete.action?id="+data,  
					data : data,
					success: function(msg){  
						$.messager.alert('提示', "删除成功", 'info');
						sqlWhere();
					}  
				}); 
			}
		});
	}
});
//页面事件处理------------------------start----------
//移动文件夹事件处理-------------start-----------
//保存移动文件夹信息
function saveMove(){
	if ($("#formMove").form('validate')) {//启用校验
//		console.log(transfer)
		$.each(transfer,function(j){
			var jobId=transfer[j].jobId;
			var folderId=$('#folderIdM').combotree('getValue');
			$.ajax({  
				type: "get",  
				url: "job/saveMove.action?folderId="+folderId+"&jobId="+jobId,  
				success: function(msg){  
					if(msg.success==false){
						$.messager.alert('提示', transfer[j].data.taskName+"保存失败", 'info');
					}
					$("#fromResultM").trigger("click");
					$('#t_moveTask_file').window('close');
					//更新右侧 信息
					sqlWhere();
				}  
			});
		})
		$.messager.alert('提示', '保存成功', 'info');
	}	
}
//取消
function canleMove(){
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if(r){ 
			$("#fromResultM").trigger("click");
			$('#t_moveTask_file').window('close');
		}
	});
}
//移动文件夹事件处理-------------end-----------

//查询方法
function search_event(){
	var fid=$("#search_folderId").val();
	 var jobNo=$("#search_jobNo").val();
	 jobNo = encodeURI(jobNo);
	 jobNo = encodeURI(jobNo);
	 var jobName=$("#search_jobName").val();
	 jobName = encodeURI(jobName);
	 jobName = encodeURI(jobName);
	 var ifCheck;
	 var rep=$('#ifCheck').is(':checked');//是否选中
	 if(rep){
		 ifCheck="Y";
	 }else{
		 ifCheck="N";
	 }
	 showdataGrid("");
//	 var surl="job/dataList.action?fid="+fid+"&jobNo="+jobNo+"&jobName="+jobName;
	 var surl="job/viewdataList.action?fid="+fid+"&jobNo="+jobNo+"&jobName="+jobName+"&ifCheck="+ifCheck;
	 showdataGrid(surl);
}

//树形下拉框加载
function getTreeInfo(id){
	$('#'+id).combotree({
		  url:"job/treeFolder.action?id=NULL",
		  required: true
	   }); 
}
//右侧数据显示
function showdataGrid(condition){
	if (condition == undefined || condition == "")
		condition = " 1=1 ";
	var ifCheck;
	var rep = $('#ifCheck').is(':checked');// 是否选中
	if (rep) {
		ifCheck = "Y";
	} else {
		ifCheck = "N";
	}
	var fid = $("#search_folderId").val();
	condition = encodeURI(condition);
	condition = encodeURI(condition);
	$.ajax({  //获取导出数据
		type: "get",  
		url: "job/viewdataListWhere.action?condition=" + condition
			+ "&ifCheck=" + ifCheck + "&fid=" + fid,
		success: function(data){  
			var noHtml;
			if(data.rows!=undefined){
//				console.log(data)
				$.each(data.rows, function(i, dc) {
					noHtml=noHtml+"<tr><td>"+ dc.folderName +"</td><td>"+ dc.jobNo +"</td><td>"+ dc.jobName +"</td><td>"+ dc.jobDesc +"</td> <td>"+ dc.modifiedTime +"</td></tr>";
				})
				$("#data-none").html(noHtml)
			}
		}  
	});
	$('#data-list').datagrid({
		title : '作业信息',
		url: "job/viewdataListWhere.action?condition=" + condition
		+ "&ifCheck=" + ifCheck + "&fid=" + fid,
		idField : 'jobId',
		pagination:true, //分页
		rownumbers :true, //行号
		singleSelect:true,//单选 
		checkOnSelect:true,
		selectOnCheck :true,
		autoRowHeight : false,//是否设置基于该行内容的行高度
		remoteSort : false,
		striped : true,//奇偶行显示不同背景色
		fitColumns : false,//自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动。
		pageSize: 30,//每页显示的记录条数，默认为10 
	    pageList: [10, 30, 50, 100],  
		columns : [ [ {
			field : 'folderId',
			hidden : true
		},{
			field : 'jobId',
			checkbox : true
		}, {
			field : 'folderName',
			title : '所属文件夹',
			width : '20%',
			sortable : true
		},{
			field : 'jobNo',
			title : '作业编号',
			width : '20%',
			sortable : true
		},  {
			field : 'jobName',
			title : '作业名称',
			width : '15%',
			sortable : true
		}, {
			field : 'jobDesc',
			title : '作业描述',
			width : '20%',
			sortable : true
		}, {
			field : 'modifiedTime',
			title : '最后修改时间',
			width : '13%',
			sortable : true
		}, {
			field : 'modifieder',
			title : '修改人',
			width : '9%',
			sortable : true
		}
	] ],
	 onClickRow:function(index,row){ //单击行事件  
         //---------for TEST 结合SHIFT,CTRL,ALT键实现单选或多选------------  
         if(index != selectIndexs.firstSelectRowIndex && !inputFlags.isShiftDown1 ){    
             selectIndexs.firstSelectRowIndex = index; //alert('firstSelectRowIndex, sfhit = ' + index);  
         }             
         if(inputFlags.isShiftDown1 ) {  
             $('#data-list').datagrid('clearSelections');  
             selectIndexs.lastSelectRowIndex = index;  
             var tempIndex = 0;  
             if(selectIndexs.firstSelectRowIndex > selectIndexs.lastSelectRowIndex ){  
                 tempIndex = selectIndexs.firstSelectRowIndex;  
                 selectIndexs.firstSelectRowIndex = selectIndexs.lastSelectRowIndex;  
                 selectIndexs.lastSelectRowIndex = tempIndex;  
             }  
             for(var i = selectIndexs.firstSelectRowIndex ; i <= selectIndexs.lastSelectRowIndex ; i++){  
                 $('#data-list').datagrid('selectRow', i);     
             }     
         }             
         //---------for TEST 结合SHIFT,CTRL,ALT键实现单选或多选------------  
     }
	});
}

//-------------------------------------------------------------------------------  
//结合SHIFT,CTRL,ALT键实现单选或多选  
//-------------------------------------------------------------------------------  
	var KEY = { SHIFT:16, CTRL:17, ALT:18, DOWN:40, RIGHT:39, UP:38, LEFT:37};    
	var selectIndexs = {firstSelectRowIndex:0, lastSelectRowIndex:0};  
	var inputFlags = {isShiftDown:false, isCtrlDown:false, isAltDown:false}  
	
	function keyPress(event){//响应键盘按下事件  
		var e = event || window.event;    
		var code = e.keyCode | e.which | e.charCode;        
		switch(code) {    
		 case KEY.SHIFT:    
		 inputFlags.isShiftDown = true;  
		 $('#data-list').datagrid('options').singleSelect = false;             
		 break;  
		case KEY.CTRL:  
		 inputFlags.isCtrlDown = true;  
		 $('#data-list').datagrid('options').singleSelect = false;             
		 break;  
		default:          
		}  
	}  
	function keyRelease(event) { //响应键盘按键放开的事件  
		var e = event || window.event;    
		var code = e.keyCode | e.which | e.charCode;        
		switch(code) {    
		 case KEY.SHIFT:   
		 inputFlags.isShiftDown = false;  
		 selectIndexs.firstSelectRowIndex = 0;  
		 $('#data-list').datagrid('options').singleSelect = true;              
		 break;  
		case KEY.CTRL:  
		 inputFlags.isCtrlDown = false;  
		 selectIndexs.firstSelectRowIndex = 0;  
		 $('#data-list').datagrid('options').singleSelect = true;  
		 break;  
		default:          
		}  
	}  

	
//导出
	 $("#btn-none").click(function(){
			$("#export").window('open')
		})
		$("#Excellent").click(function(){
			var nameText=$("#name_text").val();
			var CSV_cc=$("#cc_csv").combobox('getValue')
			var csv_excel
			if(CSV_cc=='excel'){
				csv_excel='xls'
			}else{
				csv_excel='csv'
			}
			$(this).attr('download',nameText+'.'+csv_excel)
			if(CSV_cc=='excel'){
				return ExcellentExport.excel(this, 'data_excel')
			}else{
				return ExcellentExport.csv(this, 'data_excel')
			}
		})
		$("#Excellent_cancel").click(function(){
			$("#export").window('close')
		})	 
//解析URL	 
 var urlToObject = function(url) { 
		var urlObject = {}; 
		if (/\?/.test(url)) { 
			var urlString = url.substring(url.indexOf("?")+1); 
			var urlArray = urlString.split("&"); 
				for (var i=0, len=urlArray.length; i<len; i++) { 
				var urlItem = urlArray[i]; 
				var item = urlItem.split("="); 
				urlObject[item[0]] = item[1]; 
				} 
			return urlObject; 
		} 
	}; 	 
	 
	//分页
	function getData(){
		var rows = [];
		for(var i=1; i<=800; i++){
			var amount = Math.floor(Math.random()*1000);
			var price = Math.floor(Math.random()*1000);
			rows.push({
				inv: 'Inv No '+i,
				date: $.fn.datebox.defaults.formatter(new Date()),
				name: 'Name '+i,
				amount: amount,
				price: price,
				cost: amount*price,
				note: 'Note '+i
			});
		}
		return rows;
	}

	function pagerFilter(data){
		if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
			data = {
				total: data.length,
				rows: data
			}
		}
		var dg = $(this);
		var opts = dg.datagrid('options');
		var pager = dg.datagrid('getPager');
		pager.pagination({
			onSelectPage:function(pageNum, pageSize){
				opts.pageNumber = pageNum;
				opts.pageSize = pageSize;
				pager.pagination('refresh',{
					pageNumber:pageNum,
					pageSize:pageSize
				});
				dg.datagrid('loadData',data);
			}
		});
		if (!data.originalRows){
			data.originalRows = (data.rows);
		}
		var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
		var end = start + parseInt(opts.pageSize);
		data.rows = (data.originalRows.slice(start, end));
		return data;
	}

	$(function(){
		$('#data-list').datagrid({loadFilter:pagerFilter}).datagrid('loadData', getData());
	});