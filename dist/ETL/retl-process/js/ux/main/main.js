
$(function() {
	$('#main_nav li').click(function(){
		var _this = $(this);
		if(!_this.hasClass('active_gai moveout')){
			_this.addClass('active_gai moveout');
			_this.siblings('li').removeClass('active_gai moveout');
		}
		var title = '';
		var url = '';
		if(!_this.hasClass('dropdown')){
			var url = _this.find('a').attr('urls');
			var title = _this.find('a').text();
			addTabs_main(title,url);
		}
		//console.log();
	});
	$('#main_nav li ul').mouseleave(function(e){
		$('#main_nav li').removeClass('active_gai').removeClass('open');
	});
	$('#main_nav2 li ul').mouseleave(function(e){
		$('#main_nav2 li').removeClass('active').removeClass('open');
	});
	$('#main_nav2 li').click(function(){
		var _this = $(this);
		if(!_this.hasClass('active menus')){
			_this.addClass('active menus');
			_this.siblings('li').removeClass('active menus');
		}
		var title = '';
		var url = '';
		if(!_this.hasClass('dropdown')){
			var url = _this.find('a').attr('urls');
			var title = _this.find('a').text();
			addTabs_main(title,url);
		}
		//console.log();
	});
	function addTabs_main(title,url){
		var tab_wrap = $('#main_tab_box');
		if(title == '关于'){
			showVersion();
		}else if (tab_wrap.tabs('exists', title)) {
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
	addInfo();
	//清空本地存储的复制版信息
	localStorage.clear();
});
//推送数据信息
function dwrWaringInfo(data){
	var odata = JSON.parse(data);
//	console.log("信息数量---------");
//	console.log(odata.amount)//未读信息总数
	$("#waringSum").text(odata.amount);
}
function addInfo(){
	var data={};
	$.ajax('sysIndex/waringDataList.action', {
		type : 'post',
		dataType : 'json',
		data : data,
		success : function(result) {
			$("#waringSum").text(result.rows.length);
			$("#groupresource > li").each(function(){ 
				$(this).remove();
			});
			if(result.rows != null && result.rows.length >0){
				for(var i = 0; i < result.rows.length; i++){
					if(i<9){
						var resorceInfo='<li waringId="'+result.rows[i].waringId+'" class="test">'
						+'<a>&nbsp;<span id="'+result.rows[i].waringId+'">'+(i+1)+'.&nbsp;&nbsp;&nbsp;'
						+result.rows[i].waringTitile+'<span>'+'&nbsp;&nbsp;&nbsp;' 
						+result.rows[i].modifiedTime+'</a></li>';
					}else{
						var resorceInfo='<li waringId="'+result.rows[i].waringId+'" class="test">'
						+'<a>&nbsp;<span id="'+result.rows[i].waringId+'">'+(i+1)+'.&nbsp;&nbsp;&nbsp;'
						+'<span id="'+result.rows[i].waringId+'">'+result.rows[i].waringTitile+'<span>'+'&nbsp;&nbsp;&nbsp;' 
						+result.rows[i].modifiedTime+'</a></li>';
					}
					$("#groupresource").append(resorceInfo);
				}
				$("#groupresource").append('<li><div style="text-align: center;"><input type="button" onclick="clearInfo();" value="清空"/></div></li>');
				$('#groupresource > li.test').bind('click',searchById);
			}
		}
	});
}
//点击查询错误信息
function searchById(){
	var waringId=$(this).attr('waringId');
	//改变字体颜色
	$('#'+waringId).css('color','red');
	showWaringList("");
	$.ajax({  
		type: "get",  
		dataType : 'json',
		url: "sysIndex/getWaringById.action?waringId="+waringId,  
		success: function(result){  
			$('#t_newWaringInfo').window('open');
			$('#t_newWaringInfo').panel({title:result.data.waringTitile});
			//清空table内容
//			$('#tab_waringInfo tr').empty();
			$('#tab_waringInfo').datagrid('loadData', { total: 0, rows: [] }); 
			var infoArr=[];
			if(result.data.waringMsg != "" && result.data.waringMsg != null){
				infoArr=result.data.waringMsg.split("|");
				for(var i=0;i<infoArr.length;i++){
//					var tr = "<tr height='15px;'><td width='5%'>"+(i+1)+"</td><td width='95%'>"+infoArr[i]+"</td></tr>";
//					$("#tab_waringInfo").append(tr);
					$('#tab_waringInfo').datagrid('appendRow',{
						waringMsg : infoArr[i]
					});
				}
				$("#fortaskjob").show();
				showWaringList("");
				$("#othertaskjob").hide();
			}else{
				$("#fortaskjob").hide();
				$("#othertaskjob").show();
			}
		}  
	});  
}
//清空数据信息
function clearInfo(){
	var data={};
	$.ajax('sysIndex/clearInfo.action', {
		type : 'post',
		dataType : 'json',
		data : data,
		success : function(result) {
			$("#groupresource > li").each(function(){ 
				$(this).remove();
			});
			$.messager.alert('提示', result.info, 'info');
			$("#waringSum").text('0');
		}
	});
}
//显示错误详细信息
function showWaringList(url){
	$('#tab_waringInfo').datagrid({
        url: url,
        rownumbers: true,
        singleSelect: false,
        pagination: false,//分页
        nowrap:false,   //内容过长时自动换行，默认为不自动换行-true
//        id:connectionId,
        remoteSort : false,
		columns : [ [ /*{
			field : 'waringId',
			hidden : true
		},*/{
			field : 'waringMsg',
			title : '错误信息',
			width : '100%',
			sortable : true
		}] ]
     })
}
//查询版本信息
function showVersion(){
	$.ajax({  
		type: "get",  
		dataType : 'json',
		url: "verInfo/getLastVerInfo.action",  
		success: function(result){  
			$('#t_newVsersion').window('open');
			$('#version').html('版本号：' + result.version + "<br>" + '使用期限截至到：' + result.notAfter);
		}  
	});  
}

function dwrMonitorInfo(data){
//	console.log("--------dwrMonitorInfo");
}
function dwrMonitorBatch(data){
//	console.log("---------dwrMonitorBatch");
}
function dwrMonitorTask(data){
//	console.log("----------dwrMonitorTask");
}
function dwrCanvasInfo(data){
//	console.log("----------dwrCanvasInfo");
}
function dwrParameterInfo(data){
//	console.log("----------dwrParameterInfo");
}
function dwrJobTree(data){
//	console.log("----------dwrJobTree");
}
//-----------wfy 加载警告信息  end------------
