var count_graphic = 1;
$(document).ready(function() {
	$('#list_jobflow').tree({ // 双击作业事件
		onDblClick : function(node) {
				var ttype=node.taskType;
				var folderId;
				if(ttype != '7'){//本身是文件，不做任何操作
					folderId=node.folderId;//需要处理
					addTab(node.text, "job/initJobFlow.action?jobId=" + node.jobId+"&folderId="+folderId);
				}
		}
	});

	//新建job
	$('#jf_btn_newJob').click(function() {
		var text = '新建作业' + count_graphic;
		addTab(text, "job/addJobFlow.action");
		count_graphic++;
	});

	//关闭画布按钮处理
	$('#jf_tabs_svg').tabs({
		onBeforeClose : function(title, index) {
			var target = this;
			$.messager.confirm('关闭该作业', '关闭并丢弃作业！', function(r) {
				if (r) {
					var opts = $(target).tabs('options');
					var bc = opts.onBeforeClose;
					opts.onBeforeClose = function() {
					}; // allowed to close now
					$(target).tabs('close', index);
					opts.onBeforeClose = bc; // restore the event function
					$("#jf_tabs_svg").attr("style","display:none;");//画布
					$("#forList").attr("style","display:block;");//列表数据信息
					//获取第一层文件夹id,默认记载第一层文件夹下数据 wfy 20170321
//					$.ajax({  
//						type: "get",  
//						url: "job/getFistFile.action?id=NULL&fileType=1",  
//						success: function(result){  
//							showdataGrid("");
////							var surl="job/dataList.action?fid="+result.data.folderId+"&jobNo="+"&jobName=";
//							var surl="job/viewdataList.action?fid="+result.data.folderId+"&jobNo="+"&jobName=";
//							showdataGrid(surl);
//							$("#search_folderId").val(result.data.folderId);
//							$("#forFileName").text(result.data.folderName);
//						}  
//					}); 
					//改为查询编辑前的文件夹下的信息 20170511
					 var fid=$("#search_folderId").val();
					 showdataGrid("");
					 var surl="job/viewdataList.action?fid="+fid+"&jobNo="+"&jobName=";
					 showdataGrid(surl);
				}
			});
			return false;
		}
	});
	
	

});
// 工作流右键菜单点击事件--JOB
function jf_rightmenuJobHandler(item) {
	var itemText = item.text;
	if (itemText == '新建作业') { // 编辑作业和新建作业的区别，url传当前作业的id，然后svg-base.js根据id取xml，然后进行重现.如果id为空，前端生成uuid赋给id（item_id）
			var text = '新建作业' + count_graphic;
			addTab(text, 'job/addJobFlow.action?'); // 新作业的名字
			count_graphic++;
	} else {
		var job_tree = $('#list_jobflow');
		var node = job_tree.tree('getSelected');
		var jobId = node.jobId;
		var folderId=node.folderId;
		if (itemText == '编辑作业') {
			addTab(node.text, 'job/initJobFlow.action?jobId=' + jobId+"&folderId="+folderId);
			count_graphic++;
		} else if (itemText == '重命名作业') {
			var data = {
				'jobId' : jobId
			};
			Peony.getById("job/getJob.action", data, function(result) {
				$("#form_newJob").form('myLoad', result.data);
				$('#jf_win_updataJob').window('open');
			});
		} else if (itemText == '删除作业') {
			$.messager.confirm('确认提示', '您确定要删除记录？', function(r) {
				if (r) {
					var data = {
						'jobId' : jobId
					};
					Peony.deleteForm("job/delete.action", data, function(result) {
						var surl = "job/treeList2.action?id=NULL&vartype=''";
						showTree(surl);
					});
				}
			});
		}else if(itemText == '新建文件夹'){
			$('#t_newFolder').window('open');
			$("#fromResultF").trigger("click");
			$('#saveType').val("1");//新增
			$(".validatebox-tip").remove();
			$(".validatebox-invalid").removeClass("validatebox-invalid");
		}else if(itemText == '重命名文件夹'){
			editFolder();
		}else if(itemText == '删除文件夹'){
			deleteFolder();
		}
	}
}

//-----------------文件夹信息处理  start-----------

//保存文件夹
function saveFolder(){
	var node = $('#list_jobflow').tree('getSelected');
	if (node){
		var nodes ={};
		var fid=$('#folderId').val();
		var fname=$('#folderName').val();
		var ttype=node.taskType;
		var savetype=$('#saveType').val();
		var pid;
//		if(ttype == '7'){//本身是文件，获取本身id
//			pid=node.id;//需要处理
//		}else{//job，获取父类id
//			pid=node.folderId;//需要处理
//		}
		if(savetype== '1'){//新增
			pid=node.id;
		}else{//编辑
			pid=node.folderId;//需要处理
		}
		nodes.folderId=fid;
		nodes.folderName=fname;
		nodes.parentId=pid;
		nodes.fileType='1';//JOB
		$.ajax({  
			type: "POST",  
			url: "job/saveFiles.action",  
			data: nodes,  
			success: function(msg){  
				if(msg.flag == '1'){
					$.messager.alert('提示', msg.info, 'info');
					$("#fromResultF").trigger("click");
					$('#t_newFolder').window('close');
					//查询
					var surl = "job/treeList2.action?id=NULL&vartype=''";
					showTree(surl);
				}else{
					$.messager.alert('提示', msg.info, 'info');
				}
			}  
		});
	}
}

//取消重命名
function canleFolder(){
	$.messager.confirm('确认', '您确定要关闭窗口吗？', function(r) {
		if(r){ 
			$("#fromResultF").trigger("click");
			$('#t_newFolder').window('close');
		}
	});
}

//编辑文件夹
function  editFolder(){
	   $('#t_newFolder').window('open');
	   $("#fromResultF").trigger("click");
		var node = $('#list_jobflow').tree('getSelected');
		if (node){
			var fid=node.id;
			$.ajax({  
				type: "get",  
				url: "job/getFolder.action?folderId="+fid,  
				success: function(result){  
					$('#saveType').val("2");//编辑
					$('#folderId').val(result.data.folderId);
					$('#folderName').val(result.data.folderName);
				}  
			});
		}
	}

//删除文件夹
function  deleteFolder(){
	var node = $('#list_jobflow').tree('getSelected');
	if(node.parentId === ''){
		$.messager.alert('提示', "该文件夹为根目录，不可删除！", 'warning');
		return false;
	}
	if(node.taskType == '7'){
		if (node){
			$.messager.confirm('确认', '您确定要该删除文件夹吗？', function(r) {
			   if(r){ 
				$.ajax({  
					type: "get",  
//					dataType : 'json',
					url: "job/ifLast.action?id="+node.id,  
					success: function(msg){  
						if(msg == false){//含有子节点
							$.messager.alert('提示',"该文件夹下含有文件夹或者任务，请先清空该文件夹才可以删除！",'warning');
//							$.messager.confirm('确认','该文件夹下含有文件夹或者任务，确定要删除吗？', function(r) {
//								if(r){ 							
//									$.ajax({  
//										type: "get",  
//	//									dataType : 'json',
//										url: "job/deleteFolder.action?id="+node.id,  
//										success: function(msg){  
//											$.messager.alert('提示', "删除成功", 'info');
//											var surl = "job/treeList2.action?id=NULL&vartype=''";
//											showTree(surl);
//										}  
//									}); 
//								}else{
//									return false;
//								}
//							})
						}else{
							//删除文件夹操作
							$.ajax({  
								type: "get",  
//								dataType : 'json',
								url: "job/deleteFolder.action?id="+node.id,  
								success: function(msg){  
									$.messager.alert('提示', "删除成功", 'info');
									var surl = "job/treeList2.action?id=NULL&vartype=''";
									showTree(surl);
								}  
							}); 
						}
					}  
				}); 
				
			}})
		}
	}else{
		$.messager.alert('提示', "该文件非文件夹，请选择待删除文件夹", 'warning');
	}
	
}

//-----------------文件夹信息处理  end-----------
// 增加画布tab
function addTab(title, url) {
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
