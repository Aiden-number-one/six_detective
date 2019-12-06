var Spare_w = 0;
var heights = 0;
var states = 0;
var states_click, states_index = 0;
var Form = {
	edita : $("#editFormAdd"),
}
// Win 窗口
var Win = {
	edita : $("#edit-win-add"),
}

var isrefresh=false;

// meican---- 初始化界面数据信息
var arc = new Arc();
var batch = [], task = [], jobrq = null; // 圆环数组、task二维数组、左侧job信息
var count_time_t = null; // 执行时间计时器
var _h = 0, _m = 0, _s = 0; // 执行时间计时器-辅助变量--计时开始时的时分秒
var fristBatchNo = ''; // 自动执行时圆环批次号信息 wfy 20170509
var execId = '';
var cstarttime = new Date();
//双击展示执行信息
function showMsg(obj){
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
$(document).ready(
		function() {
			Peony.progress();
			// 加载左侧下拉框信息-搜索功能
			$('#language').combobox(
					{
						valueField : 'jobId',
						textField : 'jobNoName',
						editable : true,
						url : 'etlSchedule/listJob.action',
						onChange : function() {
							// 获取id选中信息
							// var t = $('#language').combotree('tree');
							// var n = t.tree('getSelected');
							var n = $('#language').combobox('getValue');
							var select_node = $("#m-navbox>li").find(
									'i[jobid=' + n + ']');
							select_node.parent().trigger('click');
						}
					});

			// 初始化task-li-body的高度
			var h_task = $('#monitor_wrap').height();
//			var m_task_wrapul = $('#m-task-wrap');
			$('#m-task-wrap').height(h_task - $('#topslidewrapper').height() - 66);
			$('#m-graph-wrap').height(h_task - $('#topslidewrapper').height() - 66);

			// 圆环next pre按钮事件
			// job上部信息收起--按钮
			var topslidewrapper = $('#topslidewrapper');
			var gotop = $("#gotop");
			gotop.click(function() {
						topslidewrapper.slideToggle();
						gotop.toggleClass('godownbtn');
						gotop.toggleClass('gotopbtn');
						if (gotop.attr('class') == 'gotopbtn') {//展开
							$('#m-task-wrap').height(document.body.clientHeight - 250);
							$('#m-graph-wrap').height(document.body.clientHeight - 250);
							$("#svgbox").css("height",document.body.clientHeight - 250);
							heights = 0;
							$('#data-list').treegrid('resize', {
								width : $("#topslidewrapper").width()-10,
								height : $(window).height() - $('#topslidewrapper').height()-250
							});
						} else {//收起
							heights = 195;
							$('#m-task-wrap').height(document.body.clientHeight - 55);
							$('#m-graph-wrap').height(document.body.clientHeight - 55);
							$("#svgbox").css("height",document.body.clientHeight - 55);
							loadDatagrid('');
							$('#data-list').treegrid('resize',{
								   width : $("#topslidewrapper").width()-10,
								   height : $(window).height()-50
							 });
						}
					});

			// 画布和表格视图切换
			$('#m-task-wrap').css('display', 'block');
			$('#switchDisplay').click(function() {
				var task_view1 = $('#m-task-wrap');//数据信息
				var task_view2 = $('#m-graph-wrap');//画布信息
				task_view1.toggle();
				task_view2.toggle();
				$('#data-list').treegrid('resize',{
					   width : $("#m-mainf-head").width(),
					   height:$('#m-task-wrap').height()
				 });

			});

			// job头部启动按钮绑定事件
			$('#m-ppbtn').click(playBtnClick);

			// ajax请求初始化数据-job
			var xmlhttp = getajaxHttp();
			xmlhttp.open("GET", "tbDiMonitor/dwrList.action", true);
			xmlhttp.send();
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					var rq = xmlhttp.responseText || null;
					if (rq) {
						jobrq = JSON.parse(rq);//返回的JOB信息
						var t_leftjob = $('#t_left_job').html();
						var m_navbox = $('#m-navbox');//左侧job信息
						if (jobrq.length == "0") {
							Peony.closeProgress();
						}
						var dt = 0;
						for (i = 0; i < jobrq.length; i++) {
							if (jobrq[i].executeFlag == ''|| jobrq[i].executeFlag == 'R') {
								dt = dt + 1
							}
						}
						if (jobrq.length == dt) {
							Peony.closeProgress();
						}
						//加载左侧job信息
						m_navbox.html(doT.template(t_leftjob)(jobrq));

						// var leftnavscroll = new IScroll('#leftnavscrolls');

						var m_navbox_lis = m_navbox.children('li');
						m_navbox_lis.bind('click', leftNodeClick);
						m_navbox_lis.eq(0).trigger("click");
					} else {
						alert('请检查job全量数据！');
					}
				}
			}

			// ----------------任务部分执行方式切换 wfy 20170210 start----------
			var executeWay = $('input:radio[name="executeWay"]');
			executeWay.eq(0).trigger('click');
			// ----------------任务部分执行方式切换 wfy 20170210 end----------
			$(window).resize(function() {
				$('#data-list').treegrid('resize', {
					width : $("#topslidewrapper").width()-10,
					height : $(window).height() - $('#topslidewrapper').height()-75
				});
				$("#m-task-wrap").css("height",document.body.clientHeight - 250 + heights);
				$("#svgbox").css("height",document.body.clientHeight - 250 + heights);
				$('#m-graph-wrap').height(document.body.clientHeight - 250 + heights);
			});
		});

// 其他函数====
// 左侧job节点点击事件
function leftNodeClick() {
	var win = $.messager.progress({
		title : '请等待',
		msg : '正在加载中...'
	});
	isrefresh=true;
	var _this = $(this);
	if (_this.hasClass('m-on')) {
		$.messager.progress('close');
		isrefresh=false;
		return;
	} else {
		_this.addClass('m-on');
		_this.siblings('li').removeClass('m-on');
		var index = _this.index();
		// 清空上一个job的信息
		alterJobRemove();
		// 请求新的job相关信息
		init_jobhead_batch(jobrq[index]);
	}

}
// 执行按钮
function playBtnClick(event) {
	var _this = $(this);
	// 这是执行按钮 在这里添加 弹出form
	if (_this.hasClass('m-pausebtn')) { // 点击停止按钮
		var ejobId = _this.attr('jobId');
		var eflag = _this.attr('executeFlag');
		var etype = _this.attr('executeType');
		stopMonitor(ejobId, eflag, etype, _this);
	} else if (_this.hasClass('m-playbtn')) { // 点击执行按钮
		var ejobId = _this.attr('jobId');
		var jobName = _this.attr('jobName');
		var etype = _this.attr('executeType');
		var ejobNo = _this.attr('jobNo');// 作业编号，wfy 20170213
		openMonitor(ejobId, jobName, etype, ejobNo);
	}
}
// 初始化头部和圆环
function init_jobhead_batch(jobInfo) {
	//重新加载信息
	$.ajax('tbDiMonitor/getMonitorByJobId.action?jobId='+ jobInfo.jobId,{
				type : 'get',
				dataType : 'json',
				success : function(result) {
					var job=result.data[0];
					//更新左侧信息
					var node = $('#m-navbox>li>i[jobId="'+ job.jobId + '"]');
					if (node.length) {
						node.attr('executeFlag', job.executeFlag);
						node.attr('title', job.executeMsg);
						var classbtn = '';
						var executeFlag = job.executeFlag, errornum = job.errorNum;
						if (executeFlag == 'R'
								|| executeFlag == 'E') {
							classbtn = 'm-ef-run';
							if (errornum > 0) {
								classbtn += ' m-p-y';
							} else {
								classbtn += ' m-p-g';
							}
						} else if (executeFlag == 'F') {
							classbtn = 'm-ef-right m-p-y';
						} else if (executeFlag == 'B') {
							classbtn = 'm-ef-error m-p-r';
						} else if (executeFlag == 'S') {
							classbtn = 'm-ef-right m-p-g';
						} else if (executeFlag == 'I') {
							classbtn = 'm-ef-tanhao m-p-y';
						} else if (executeFlag == '') {
							classbtn = 'm-ef-right';
//							alert('请检查增量job的executeFlag');
						}
						classbtn = 'iconfont ' + classbtn;
						node.removeClass();
						node.addClass(classbtn);
					}
					
					// 填充job head
					var job_info_wrap = $("#m-r-task-top");
					var jno,jname;
					var task_top_num = $("#m-r-task-top>span"), task_top_name = $("#m-r-task-top>em");
					// 作业名称显示修改 wfy 201705058
					if (job.jobName.indexOf('】') != -1) {// 包含
						var add = job.jobName.indexOf('】');
						jno = job.jobName.substr(1, add - 1);
						jname = job.jobName.substr(add + 1);
						task_top_num.text(jno);
						task_top_name.text(jname);
					} else {
						jno = job.jobNo;
						jname = job.jobName;
						task_top_num.text(job.jobNo);
						task_top_name.text(job.jobName);
					}
					
					if (job.executeFlag == 'F' || job.executeFlag == 'I') {
						job_info_wrap.css('background', '#f2b968');
					} else if (job.executeFlag == 'B') {
						job_info_wrap.css('background', '#DD4B39');
					} else if (job.executeFlag == 'E') {
						if (job.errorNum > 0) {
							job_info_wrap.css('background', '#f2b968');
						} else {
							job_info_wrap.css('background', '#00A65A');
						}
					} else if (job.executeFlag == 'S') {
						job_info_wrap.css('background', '#00A65A');
					} else if (job.executeFlag == 'R' || job.executeFlag == '') {
						$.messager.progress('close');
						job_info_wrap.css('background', '#95B8E7');
					}
					
					if (job.batchSum == 0 || isNaN(job.batchSum)) {
						$('#progress-bar1').css("width", 0);
					} else {
						$('#progress-bar1').css("width",(job.batchNum / job.batchSum * 100).toFixed(0) + '%');
					}
					if (job.taskSum == 0 || isNaN(job.taskSum)) {
						$('#progress-bar2').css("width", 0);
					} else {
						$('#progress-bar2').css("width",(job.taskNum / job.taskSum * 100).toFixed(0) + '%');
					}
					
					$("#taskjd").html(job.taskNum + '/' + job.taskSum);
					$("#batchjd").html(job.batchNum + '/' + job.batchSum);
					var ppclass = '';
					if (job.executeFlag == 'R') {
						ppclass = 'm-pausebtn';
					} else if (job.executeFlag == 'E') {
						ppclass = 'm-pingbtn';
					} else {
						ppclass = 'm-playbtn';
					}
					var m_ppbtn = $('#m-ppbtn');
					m_ppbtn.removeClass().addClass(ppclass);
					m_ppbtn.attr('executeType', job.executeType);
					m_ppbtn.attr('jobId', job.jobId);
					m_ppbtn.attr('executeFlag', job.executeFlag);
					m_ppbtn.attr('jobName', jname);
					m_ppbtn.attr('jobNo', jno);
					// time
					if (job.executeFlag == '' || job.executeFlag == null) {
						$('#m-starttime').text('未执行过');
						$('#m-endtime').text('未执行过');
						isrefresh=false;
					} else {
						if (job.startTime && job.startTime.time) {
							var serverstartTime = new Date(job.startTime.time);
							$('#m-starttime').text(serverstartTime.Format());
							if (job.executeFlag == 'R' || job.executeFlag == 'E') {
								$('#m-endtime').text('运行中...');
								if (count_time_t == null) { // 主要用于再次点击左侧node重开始处的时间开始计时
									var timeall = (new Date()).getTime() - cstarttime.getTime();
									getHMStime_num(timeall);
									startcoutTime();
								}
							} else {
								if (job.endTime && job.endTime.time) {
									var endTime = new Date(job.endTime.time);
									$('#m-endtime').text(endTime.Format());
									var timeall = Date.parse(endTime)
											- Date.parse(serverstartTime);
									$('#m-alltime').text(getHMStime(timeall));
									if (count_time_t) {
										stopCountTime(count_time_t);
										count_time_t = null;
									}
								} else {
									alert('请检查全量job的endtime');
								}
							}
						}else {
							alert('请检查全量job的starttime');
						}
					}
					
					// 请求圆环全量
					$.ajax('tbDiMonitor/getBatchId.action?jobId='+ jobInfo.jobId,{
						type : 'get',
						dataType : 'json',
						success : function(data) {
							if (batch.length>0) {
								return;								
							}
							batch = data;
							// fristBatchNo赋默认值，为清空自动执行圆环信息做准备 wfy 20170509
							if (batch.length > 0) {
								fristBatchNo = batch[0].batchNo;
							} else {
								fristBatchNo = '';
							}
							var arclibox = $('#m-mainm-boxt');
							var indexs = 0;
							$.each(batch,function(index) {
									var text = '<li batchNo='+ this.batchNo
										+ '><span class="m_state'+ this.batchNo + '">'
										+ this.batchNo
										+ '</span></li>';
									arclibox.append(text);
									var M_state = $(".m_state"+ this.batchNo);
											if (this.executeFlag == 'F'|| this.executeFlag == 'I') {
												M_state.css('color','#f2b968');
											} else if (this.executeFlag == 'B') {
												M_state.css('color','#DD4B39');
											} else if (this.executeFlag == 'E') {
												if (this.errorNum > 0) {
													M_state.css('color','#f2b968');
												} else {
													M_state.css('color','#00A65A');
												}
											} else if (this.executeFlag == 'S') {
												M_state.css('color','#00A65A');
											} else if (this.executeFlag == 'R'|| job.executeFlag == '') {
												M_state.css('color','#95B8E7');
											}
									if (isNaN(this.taskSum) || this.taskSum<this.taskNum) this.taskSum=this.taskNum;
									
									var pe_batch = this.taskSum > 0 && (!isNaN(this.taskSum)) 
										&& (!isNaN(this.taskNum)) ? this.taskNum/ this.taskSum : 0;
									var error_batch = this.taskSum > 0
									&& (!isNaN(this.taskSum)) ? (this.taskNum - this.errorNum)/ this.taskSum : 0;
									var text = (pe_batch * 100).toFixed(0);
									var error = '#DD4B39';
									arc.creat_ring(
											(pe_batch * 280 + 220),
											(error_batch * 280 + 220),
											this.successNum,
											this.errorNum,
											this.batchNo,
											index, error,
											this);
								});
							
							// 给batch绑定点击事件，显示task
							arclibox.children('li').unbind('click');
							arclibox.children('li').click(click_batch);
							// 初始化task
							if (data.length) {
								arclibox.children('li').eq(0).trigger('click');
							} else {// 清空画布信息
								graphic.xmlDoc = '';
								graphic.reappearXmlDoc();
								graphic.initCanvas();
								graphic.update();
							}
						},
						error : function(XMLHttpRequest) {
							alert('请求batch全量数据出错,错误码：' + XMLHttpRequest.status);
						}
					});
				}
	})
	// task头部作业编号初始化
	$("#jkjginfo1").html(jobInfo.jobNo);
}
// batch点击事件
function click_batch() {
	var index = $(this).index();
	var win = $.messager.progress({
		title : '请等待',
		msg : '正在加载中...'
	});
	$('#m-mainm-boxt>li').removeClass('m-jt').eq(index).addClass('m-jt');
	// 初始化task表格和画布信息
	if (index == 0) {
		states_index = 1;
	} else {
		states_index = 0;
	}
	init_graph(index);
	init_task(index);
}
// 初始化task
function init_task(index) {
	if (batch.length) {//圆环数组
		executorId = batch[index].executorId;
		monitorId = batch[index].monitorId;// 新增
		batchNo = batch[index].batchNo;
		$("#jkjginfo").html("(" + batchNo + ")");
		$("#jkjg-st").html("开始:" + new Date(batch[index].startTime.time).Format());
		$("#jkjg-et").html("结束:" + new Date(batch[index].endTime.time).Format());
		$("#jkjg-error").html("错误数:" + batch[index].errorNum);
		var aurl='tbDiMonitor/getTaskInfoTree.action?executorId='+ executorId + '&batchNo=' + batchNo
				+ '&monitorId=' + monitorId;
		$.ajax({
				type : 'get',
				dataType : 'json',
				url : aurl,
				success : function(result) {
					if (result.rows.length) {
						$('#data-list').treegrid('loadData',result);
						$('#data-list').treegrid('resize',{
							   height:$('#m-task-wrap').height()
						 });
					}
					Peony.closeProgress();
					isrefresh=false;
				}
			});
	}

}
//去掉结点前面的文件及文件夹小图标
function init(){
    $(".tree-icon,.tree-file").removeClass("tree-icon tree-file");
    $(".tree-icon,.tree-folder").removeClass("tree-icon tree-folder tree-folder-open tree-folder-closed"); 
}
function loadDatagrid(url){
	$('#data-list').treegrid({
			url : '',
			idField : 'monitorId',
			treeField : 'orderNo',
			pagination : false, // 分页
			rownumbers : true, // 行号
			singleSelect : true,// 单选
			checkOnSelect : true,
			autoRowHeight : false,// 是否设置基于该行内容的行高度
			remoteSort : false,
			striped : true,// 奇偶行显示不同背景色
			fitColumns : false,// 自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动。
//			height : 440,
			columns : [ [ 
						{
							field : 'monitorId',
							hidden :true
						}, {
							field : 'orderNo',
							title : '节点',
							width : '20%',
							formatter : function(value, row, index) {
								 if(value == '0'){
									 var path = getContextPath()+ "/svg/images/icon_type_"+row.memberType+".png";
									 return '<img style="width:17px;height:17px;" src=' + path+ ' />  '+row.nodeName;
								 }else{
									 var path = getContextPath()+ "/svg/images/icon_type_"+row.memberType+".png";
									 return '<img style="width:17px;height:17px;" src=' + path+ ' />  '+value+"."+row.nodeName;
								 }
							 },
							sortable : true
						},{
							field : 'jobName',
							title : '任务名称',
							 width : '13%',
							sortable : true
						},{
							field : 'memberType',
							title : '任务类型',
							 width : '70',
							sortable : true,
							formatter : function(value, row, index) {
								if (value == '1') {
									return task_name = '数据抽取';
								} else if (value == '2') {
									return task_name = '执行SQL';
								} else if (value == '3') {
									return task_name = '变量设置';
								} else if (value == '4') {
									return task_name = '作业流程';
								} else if (value == '5') {
									return task_name = '存储过程';
								} else if (value == '6') {
									return task_name = '外部程序';
								} else if (value == '8') {
									return task_name = '导出文本';
								} else if (value == '9') {
									return task_name = '发送邮件';
								} else if (value == '10') {
									return task_name = '执行Kettle';
								} else if (value == '11') {
									return task_name = '执行JS语句';
								} else if (value == '12') {
									return task_name = '执行Webservice';
								} else if (value == '13') {
									return task_name = '数据剖析';
								} else if (value == '14') {
									return task_name = 'FTP文件';
								}else if (value == 'S') {
									return task_name = '开始组件';
								}else if (value == 'L') {
									return task_name = '阻塞';
								}else if (value == 'G') {
									return task_name = '等待';
								}else if (value == 'I') {
									return task_name = '中止';
								}else if (value == 'F') {
									return task_name = '检查文件';
								}else if (value == 'C') {
									return task_name = '条件判断';
								}else if (value == 'U') {
									return task_name = '成功组件';
								}
							}
						},{
							field : 'deleteNum',
							title : '删除',
							 width : '80',
							sortable : true
						},{
							field : 'insertNum',
							title : '插入',
							 width : '80',
							sortable : true
						},{
							field : 'startTime',
							title : '开始时间',
							width : '135',
							formatter : function(value, row, index) {
								var serverstartTime = new Date(row.startTime);
								return serverstartTime.Format();
							 },
							sortable : true
						},{
							field : 'zxsj',
							title : '执行时长',
							width : '11%',
							formatter : function(value, row, index) {
//								return "<div class='m-taskli-pro'><p title='"+value+"秒'><i class='m-progress-bar' style='max-width:100%;height:10px;width:"+getBarWidth(row.zxsj)+"'></i></p>"+value+"'</div>";
								var s = '<div style="width:100%;border:1px solid #ccc">' +//边框
										'<div style="width:' + getBarWidth(row.zxsj) + ';background:#F2B968;color:#212121">' + value + '\'' + '</div>'
										'</div>';
								return s;
							},
							sortable : true
						},{
							field : 'executeFlag',
							title : '执行状态',
							width : '70',
							formatter : function(value, row, index) {
								if (value == 'R') {
									return task_name = '执行中';
								} else if (value == 'S') {
									return task_name = '成功完成';
								} else if (value == 'F') {
									return task_name = '出错完成';
								} else if (value == 'I') {
									return task_name = '中断执行';
								} else if (value == 'E') {
									return task_name = '中断执行中';
								} else if (value == '') {
									return task_name = '未执行';
								} else if (value == 'B') {
									return task_name = '出错中断';
								} else if (value == 'A') {
									return task_name = '判断为假';
								}
							},
							sortable : true
						},{
							field : 'executeMsg',
							title : '执行信息(双击显示全部信息)',
							width : '1024',
							formatter : function(value, row, index) {
								if(row.memberType == '13' && (row.executeFlag == 'S' || row.executeFlag == 'A')){
									return "<a href='javascript:void(0)' onclick='showDetail(\""+value+"\")'><font color='blue'>剖析结果<img src='images/right.png' class='right_img' /></font></a>"
								}else{
									return ' <span title='+value+' ondblclick ="showMsg(this)">'+value+' </span>';
								}
							},
							sortable : true
						}
					] ],
					rowStyler : function(row) {
						var executeFlag = row.executeFlag;
						if (executeFlag == 'F' || executeFlag == 'B' || executeFlag == 'A' || executeFlag == 'I' || executeFlag == 'E') {
							return 'background:#DD6E78;color:#333;';
						}
						if (executeFlag == 'R') {
							return 'background:#95B8E7;color:#333;';
						}
					},
					onLoadSuccess:function(){
						init(); 
					}
					
		});
 }

function getContextPath() {
	var pathname = location.pathname;
	return pathname.substr(0, pathname.indexOf('/', 1));
}


// 画布全量初始化 --- 获取全量xml
function init_graph(index) {
	var jobId = $('#m-ppbtn').attr('jobId');
	var executorId = batch[index].executorId;
	var batchNo = batch[index].batchNo;
	$.ajax({
		type : "get",
		url : "tbDiMonitor/getMonitorXML.action?executorId=" + executorId
				+ "&jobId=" + jobId + "&batchNo=" + batchNo,
		success : function(xmls) {
			var xml_text = '';
			if (xmls) {
				if (xmls.length) {
					states_click = 1;
					xml_text = xmls[0].XMLString;
					graphic.xmlDoc = xml_text;
					graphic.reappearXmlDoc();
					graphic.initCanvas();
					graphic.update();
				} else {
					alert('请求全量xml为空');
				}
			} else {
				alert('请求全量xml出错');
			}
		}
	});
}

// 清空job信息
// 重新执行job时清空数据-执行按钮，自动执行时候的推送数据进行清空
function reRunJobRemove() {
	$('#m-endtime').html('');
	$('#m-starttime').html('');
	$('#m-alltime').html('0:00:00');
	$('#progress-bar1').css("width", 0);
	$('#progress-bar2').css("width", 0);
	$('#batchjd').html('');
	$('#taskjd').html('');
	$('#jkjginfo').html('');
	$('#m-mainm-boxt').html('');
	stopCountTime(count_time_t);
	count_time_t = null;
	_h = 0;
	_m = 0;
	_s = 0;
	batch = []; // 清空圆环
	arc.removeAll();
	// 清空task内容
	$('#data-list').treegrid('loadData', {total : 0,rows : []});
	$("#jkjg-st").html("");
	$("#jkjg-et").html("");
	$("#jkjg-error").html('');
}
// 左侧点击另外一个job时，清空当下job信息，全部数据
function alterJobRemove() {
	batch = []; // 清空圆环
	$('#m-endtime').html('');
	$('#m-starttime').html('');
	$('#m-alltime').html('0:00:00');
	$('#progress-bar1').css("width", 0);
	$('#progress-bar2').css("width", 0);
	$('#batchjd').html('');
	$('#taskjd').html('');
	$('#jkjginfo').html('');
	$('#m-mainm-boxt').html('');
	stopCountTime(count_time_t);
	count_time_t = null;
	_h = 0;
	_m = 0;
	_s = 0;

	arc.removeAll();
	loadDatagrid('');
	// 清空task内容
	$('#data-list').treegrid('loadData', {total : 0,rows : []});
	$("#jkjg-st").html("");
	$("#jkjg-et").html("");
	$("#jkjg-error").html('');

	$("#jkjginfo1").html("");
	$('#m-ppbtn').removeAttr('executeFlag jobId jobName executeType');
	$("#m-r-task-top>span").html('');
	$("#m-r-task-top>em").html('');
}
// task 时长分段 进度条
function getBarWidth(num) {
	num = parseInt(num);
	if (num == 0) {
		return '0%';
	} else if (num > 0 && num <= 1) {
		return '10%';
	} else if (num > 1 && num <= 5) {
		return '20%';
	} else if (num > 5 && num <= 30) {
		return '30%';
	} else if (num > 30 && num <= 60) {
		return '40%';
	} else if (num > 60 && num <= 300) {
		return '50%';
	} else if (num > 300 && num <= 600) {
		return '60%';
	} else if (num > 600 && num <= 1800) {
		return '70%';
	} else if (num > 1800 && num <= 3600) {
		return '80%';
	} else if (num > 3600 && num <= 7200) {
		return '90%';
	} else if (num > 7200) {
		return '100%';
	}
}

// 时间格式
Date.prototype.Format = function() {
	var datetime = this;
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1)
			: datetime.getMonth() + 1;
	var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime
			.getDate();
	var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime
			.getHours();
	var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes()
			: datetime.getMinutes();
	var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds()
			: datetime.getSeconds();
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":"
			+ second;
}
// ajax对象获取
function getajaxHttp() {
	var xmlHttp = null;
	try {
		xmlHttp = new XMLHttpRequest();
	} catch (e) {
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				alert("您的浏览器不支持AJAX！");
				return false;
			}
		}
	}
	return xmlHttp;
}
// 获得00:00:00的时间格式
function getHMStime(time) {
	if (time < 0) {
		return '00:00:00';
	}
	time = parseFloat(time) / 1000;
	if (time < 60) {
		var second = parseInt(time);
		if (second < 10) {
			second = '0' + second;
		}
		return time = '0:00:' + second;
	} else if (time >= 60 && time < 3600) {
		var minute = parseInt(time / 60);
		if (minute < 10) {
			minute = '0' + minute;
		}
		var second = parseInt((parseFloat(time / 60) - parseInt(time / 60)) * 60);
		if (second < 10) {
			second = '0' + second;
		}
		return time = '0:' + minute + ':' + second;
	} else if (time >= 3600) {
		var hour = parseInt(time / 3600);
		var minute = parseInt((parseFloat(time / 3600) - parseInt(time / 3600)) * 60);
		if (hour < 10) {
			hour = '0' + hour;
		}
		if (minute < 10) {
			minute = '0' + minute;
		}
		var second = parseInt((parseFloat((parseFloat(time / 3600) - parseInt(time / 3600)) * 60) - parseInt((parseFloat(time / 3600) - parseInt(time / 3600)) * 60)) * 60);
		if (second < 10) {
			second = '0' + second;
		}
		return time = hour + ':' + minute + ':' + second;
	}
}

// 计时时间增长初始值（已经执行了多久了，在此基础上往上加）
function getHMStime_num(time) {
	if (time < 0) {
		_s = 0;
		_m = 0;
		_h = 0;
		return;
	}
	time = parseFloat(time) / 1000;
	if (time < 60) {
		_s = parseInt(time);
	} else if (time >= 60 && time < 60 * 60) {
		_m = parseInt(time / 60);
		_s = parseInt((parseFloat(time / 60) - parseInt(time / 60)) * 60);
	} else if (time >= 3600) {
		_h = parseInt(time / 3600);
		_m = parseInt((parseFloat(time / 3600) - parseInt(time / 3600)) * 60);
		_s = parseInt((parseFloat((parseFloat(time / 3600) - parseInt(time / 3600)) * 60) - parseInt((parseFloat(time / 3600) - parseInt(time / 3600)) * 60)) * 60);
	}
}
//执行时长
function startcoutTime() {
	var m_time = $('#m-alltime');
	_s++;
	if (_s == 60) {
		_s = 0;
		_m++;
		if (_m == 60) {
			_m = 0;
			_h++;
		}
	}
	var s_s = '', s_m = '', s_h = '';
	if (_s < 10) {
		s_s = '0' + _s;
	} else {
		s_s = _s;
	}
	if (_h < 10) {
		s_h = '0' + _h;
	} else {
		s_h = _h;
	}
	if (_m < 10) {
		s_m = '0' + _m;
	} else {
		s_m = _m;
	}
	m_time.text(s_h + ':' + s_m + ':' + s_s);
	count_time_t = setTimeout(startcoutTime, 1000);

}
function stopCountTime(t) {
	clearTimeout(t);
	_s = 0;
	_m = 0;
	_h = 0;
}

// the end --- 增量开始
// batch增量
function dwrMonitorBatch(data) {
	var odata = JSON.parse(data);
	if(!isNaN(odata.taskSum) && (odata.taskNum > odata.taskSum)){
		odata.taskSum=odata.taskNum;
	}
	var jobid = $("#m-navbox>li.m-on>i").attr('jobId');
	if (jobid == odata.jobId) { // 是否属于当前job，如果不一样不做处理
		// 自动执行时新增批次，清空之前的批次信息 wfy 20170509
		if (odata.executeType == 'A' && execId != odata.executorId) {
			reRunJobRemove();
			fristBatchNo = odata.batchNo;
			execId = odata.executorId;
		}
		var m_mainm_boxt = $('#m-mainm-boxt');
		if (isrefresh) return;
		if (batch.length) { // 如果已经有batch信息过来
			var exist = false;
			$.each(batch,function(index) {
					if (this.batchNo == odata.batchNo) {// 需要更新已有圓環
						batch[index] = odata;
						exist = true;
						// 更新圆环即可
						$.each(arc.rings,function(index) {
								if (this.id == odata.batchNo) {
									var pe_batch = odata.taskSum > 0
											&& (!isNaN(odata.taskSum))
											&& (!isNaN(odata.taskNum)) ? odata.taskNum
											/ odata.taskSum
											: 0;
									var error_batch = odata.taskSum > 0
											&& (!isNaN(odata.taskSum)) ? (odata.taskNum - odata.errorNum)
											/ odata.taskSum
											: 0;
									var text = (pe_batch * 100).toFixed(0);
									var error = odata.errorNum > 0 ? '#DD4B39' : '#95B8E7';
									arc.update(this,(pe_batch * 280 + 220),(error_batch * 280 + 220),
													odata.successNum,odata.errorNum,error);
									// 是否是被选中的圆环，如果是的话
									// 更新task头部的batch信息
									if ($('#m-mainm-boxt>li.m-jt').attr('batchno') == odata.batchNo) {
										if (odata.startTime&& odata.startTime.time) {
											$("#jkjg-st").html("开始时间："+ new Date(odata.startTime.time).Format());
											if (odata.executeFlag == 'R') {
												$("#jkjg-et").html("结束时间：执行中");
											} else {
												if (odata.startTime&& odata.startTime.time) {
													$("#jkjg-et").html("结束时间："+ new Date(odata.endTime.time).Format());
												} else {
													alert('请检查增量batch的endtime数据');
												}
											}
										} else {
											alert('请检查增量batch的starttime数据');
										}
										$("#jkjg-error").html("错误数："+ odata.errorNum);
									}
									return false;
								}
							})
						return false;
					}
				});
			if (!exist) { // 与其他圆环不一样，增量新增圆环
				batch.unshift(odata);
				var text = '<li batchNo=' + odata.batchNo
						+ '><span class="m_state' + odata.batchNo + '">'
						+ odata.batchNo + '</span></li>';
				m_mainm_boxt.prepend(text);
				var M_state = $(".m_state" + odata.batchNo)
				if (odata.executeFlag == 'F' || odata.executeFlag == 'I' ) {
					M_state.css('color', '#f2b968');
				} else if (odata.executeFlag == 'B') {
					M_state.css('color', '#DD4B39');
				} else if (odata.executeFlag == 'E') {
					if (odata.errorNum > 0) {
						M_state.css('color', '#f2b968');
					} else {
						M_state.css('color', '#00A65A');
					}
				} else if (odata.executeFlag == 'S') {
					M_state.css('color', '#00A65A');
				} else if (odata.executeFlag == 'R' || job.executeFlag == '') {
					M_state.css('color', '#95B8E7');
				}
				m_mainm_boxt.children('li').unbind('click');
				m_mainm_boxt.children('li').click(click_batch);
				var pe_batch = odata.taskSum > 0 && (!isNaN(odata.taskSum))&& (!isNaN(odata.taskNum)) ? odata.taskNum/ odata.taskSum : 0;
				var error_batch = odata.taskSum > 0 && (!isNaN(odata.taskSum)) ? (odata.taskNum - odata.errorNum)/ odata.taskSum: 0;
				var text = (pe_batch * 100).toFixed(0);
				var error = odata.errorNum > 0 ? '#DD4B39' : '#95B8E7';
				arc.update_loc();
				// successNum
				arc.creat_ring((pe_batch * 280 + 220),(error_batch * 280 + 220),(odata.taskNum - odata.errorNum),
							odata.errorNum,odata.batchNo, 0, error, odata);
				// 新增圆环获取选中焦点
				if (states_click == 1) {
					if (states_index == 1) {
						$('#m-mainm-boxt>li').removeClass('m-jt').eq(0)
								.addClass('m-jt');
						//清空该圆环下的任务信息
						$('#data-list').treegrid('loadData', {total : 0,rows : []});
					}
				} else {
					$('#m-mainm-boxt>li').removeClass('m-jt').eq(0).addClass(
							'm-jt');
					//清空该圆环下的任务信息
					$('#data-list').treegrid('loadData', {total : 0,rows : []});
				}
				// 修改task头部对应的batch信息
				$("#jkjginfo").html("(" + odata.batchNo + ")");
				$("#jkjg-error").html("错误数：" + odata.errorNum);
				if (odata.startTime && odata.startTime.time) {
					$("#jkjg-st").html("开始时间：" + new Date(odata.startTime.time).Format());
					if (odata.executeFlag == 'R' || odata.executeFlag == 'E') {
						$("#jkjg-et").html("结束时间：执行中");
					} else {
						if (odata.startTime && odata.startTime.time) {
							$("#jkjg-et").html("结束时间："+ new Date(odata.endTime.time).Format());
						} else {
							alert('请检查增量batch的endtime数据');
						}
					}
				} else {
					alert('请检查增量batch的starttime数据');
				}
			}
		} else { // 空batch，新增batch 开始后执行
			batch.unshift(odata);
			var text = '<li batchNo=' + odata.batchNo + '><span class="m_state'
					+ odata.batchNo + '">' + odata.batchNo + '</span></li>';
			m_mainm_boxt.prepend(text);
			var M_state = $(".m_state" + odata.batchNo)
			if (odata.executeFlag == 'F' || odata.executeFlag == 'I') {
				M_state.css('color', '#f2b968');
			} else if (odata.executeFlag == 'B') {
				M_state.css('color', '#DD4B39');
			} else if (odata.executeFlag == 'E') {
				if (odata.errorNum > 0) {
					M_state.css('color', '#f2b968');
				} else {
					M_state.css('color', '#00A65A');
				}
			} else if (odata.executeFlag == 'S') {
				M_state.css('color', '#00A65A');
			} else if (odata.executeFlag == 'R' || job.executeFlag == '') {
				M_state.css('color', '#95B8E7');
			}
			m_mainm_boxt.children('li').unbind('click');
			m_mainm_boxt.children('li').click(click_batch);
			var pe_batch = odata.taskSum > 0 && (!isNaN(odata.taskSum))&& (!isNaN(odata.taskNum)) ? odata.taskNum / odata.taskSum : 0;
			var error_batch = odata.taskSum > 0 && (!isNaN(odata.taskSum)) ? (odata.taskNum - odata.errorNum)/ odata.taskSum : 0;
			var text = (pe_batch * 100).toFixed(0);
			var error = odata.errorNum > 0 ? '#DD4B39' : '#95B8E7';

			arc.creat_ring((pe_batch * 280 + 220), (error_batch * 280 + 220),
					(odata.taskNum - odata.errorNum), odata.errorNum,
					odata.batchNo, 0, error, odata);
			$('#m-mainm-boxt>li').removeClass('m-jt').eq(0).addClass('m-jt');
			//清空该圆环下的任务信息
			$('#data-list').treegrid('loadData', {total : 0,rows : []});
			// m_mainm_boxt.children('li').eq(0).trigger('click'); //不可以被触发
			$("#jkjginfo").html("(" + odata.batchNo + ")");
			$("#jkjg-error").html("错误数：" + odata.errorNum);
			// 更新task头部的batch信息
			if (odata.startTime && odata.startTime.time) {
				$("#jkjg-st").html("开始时间：" + new Date(odata.startTime.time).Format());
				if (odata.executeFlag == 'R' || odata.executeFlag == 'E') {
					$("#jkjg-et").html("结束时间：执行中");
				} else {
					if (odata.startTime && odata.startTime.time) {
						$("#jkjg-et").html("结束时间："+ new Date(odata.endTime.time).Format());
					} else {
						alert('请检查增量batch的endtime数据');
					}
				}
			} else {
				alert('请检查增量batch的starttime数据');
			}
		}
	}
}

//是否删除之前的信息
function dwrParameterInfo(data) {
	var odata = JSON.parse(data);
	if (odata.deleteFlag) {
		// 清空原来的batch和task---meican
		reRunJobRemove();
	}
}


function dwrExcuteNum(data) {
	var arr = data.split(",");
	var id = arr[0];
	var value = arr[1];
	$("#" + id).html(value);
}

// task 增量
function dwrMonitorTask(data) {
	var odata = JSON.parse(data);//字符串转成json对象
	var jobid = $("#m-navbox>li.m-on>i").attr('jobId');
	var batchno = $('#m-mainm-boxt>li.m-jt').attr('batchNo');
	if (odata.jobId == jobid) {
		if (odata.batchNo == batchno) { // 匹配当前job和batch的task增量;
			if (odata.startTime && odata.startTime.time) {
				var stime=odata.startTime.time;
				odata.startTime=stime;
				if (odata.endTime && odata.endTime.time) {
					var etime=odata.endTime.time;
					odata.endTime=odata.endTime.time;
					var startt = Date.parse(new Date(stime));
					var endt = Date.parse(new Date(etime));
					var zxsj = (etime - stime) / 1000;
					zxsj=parseInt(zxsj);
					odata.zxsj=zxsj;
					odata.zxsjw = getBarWidth(odata.zxsj);
				}else{
					odata.zxsj=0;
					odata.zxsjw = 0;
				}
			}else{
				odata.zxsj=0;
				odata.zxsjw = 0;
			}
			rowindex=$('#data-list').treegrid('find', odata.monitorId);
			if(rowindex == undefined || rowindex == null){//新增
				var jsonArr = new Array();
				jsonArr[0]=odata;
				$('#data-list').treegrid('append',{
					parent: odata.parentMonitorId, 
					data:jsonArr
				});
			}else{
				$('#data-list').treegrid('update',{
					id: odata.monitorId, 
					row:odata
				});
			}
			init();
		}
	}
}
// job增量
function dwrMonitorInfo(data) {
	var odata = JSON.parse(data);
	var flag = true;
	if (jobrq.length) {
		$.each(jobrq,function(index) {
							if (this.jobId == odata.jobId) {
								jobrq[index] = odata;
								var node = $('#m-navbox>li>i[jobId="'+ odata.jobId + '"]');
								if (node.length) {
									node.attr('executeFlag', odata.executeFlag);
									node.attr('title', odata.executeMsg);
									var classbtn = '';
									var executeFlag = odata.executeFlag, errornum = odata.errorNum;
									if (executeFlag == 'R' || executeFlag == 'E') {
										classbtn = 'm-ef-run';
										if (errornum > 0) {
											classbtn += ' m-p-y';
										} else {
											classbtn += ' m-p-g';
										}
									} else if (executeFlag == 'F') {
										classbtn = 'm-ef-right m-p-y';
									} else if (executeFlag == 'B') {
										classbtn = 'm-ef-error m-p-r';
									} else if (executeFlag == 'S') {
										classbtn = 'm-ef-right m-p-g';
									} else if (executeFlag == 'I') {
										classbtn = 'm-ef-tanhao m-p-y';
									} else if (executeFlag == '') {
										alert('请检查增量job的executeFlag');
									}
									classbtn = 'iconfont ' + classbtn;
									node.removeClass();
									node.addClass(classbtn);
									flag = false;
									return false;
								}
							}
						});
		if (flag) {
			jobrq.push(odata);
		}
	}
	// 更新当前选中job信息
	var m_ppbtn = $('#m-ppbtn');
	if (m_ppbtn.attr('jobId') == odata.jobId) {
		// 更新按钮
		var ppclass = '';
		if (odata.executeFlag == 'R') {
			ppclass = 'm-pausebtn';
			states = 1;
		} else if (odata.executeFlag == 'E') {
			states = 0;
			ppclass = 'm-pingbtn';
		} else {
			states = 0;
			ppclass = 'm-playbtn';
		}
		m_ppbtn.removeClass().addClass(ppclass);
		m_ppbtn.attr('executeType', odata.executeType);
		m_ppbtn.attr('executeFlag', odata.executeFlag);

		// 更新进度 数字 滚动条
		$("#taskjd").html(odata.taskNum + '/' + odata.taskSum);
		$("#batchjd").html(odata.batchNum + '/' + odata.batchSum);
		if (odata.batchSum == 0 || isNaN(odata.batchSum)) {
			$('#progress-bar1').css("width", 0);
		} else {
			$('#progress-bar1').css("width",(odata.batchNum / odata.batchSum * 100).toFixed(0) + '%');
		}
		if (odata.taskSum == 0 || isNaN(odata.taskSum)) {
			$('#progress-bar2').css("width", 0);
		} else {
			$('#progress-bar2').css("width",(odata.taskNum / odata.taskSum * 100).toFixed(0) + '%');
		}
		// 更新底色
		var job_info_wrap = $('#m-r-task-top');
		if (odata.executeFlag == 'F' || odata.executeFlag == 'I') {
			job_info_wrap.css('background', '#f2b968');
		} else if (odata.executeFlag == 'B') {
			job_info_wrap.css('background', '#DD4B39');
		} else if (odata.executeFlag == 'E') {
			if (odata.errorNum > 0) {
				job_info_wrap.css('background', '#f2b968');
			} else {
				job_info_wrap.css('background', '#00A65A');
			}
		} else if (odata.executeFlag == 'S') {
			job_info_wrap.css('background', '#00A65A');
		} else if (odata.executeFlag == 'R' || job.executeFlag == '') {
			job_info_wrap.css('background', '#95B8E7');
		}

		// 更新开始结束时间
		if (odata.startTime != null && odata.startTime.time) {
			var serverstartTime = new Date(odata.startTime.time);
			$('#m-starttime').text(serverstartTime.Format());
			if (odata.executeFlag == 'R' || odata.executeFlag == 'E') {
				$('#m-endtime').text('运行中...');
				if (!count_time_t) {
					cstarttime = new Date();
					var timeall = (new Date()).getTime() - Date.parse(cstarttime);
					getHMStime_num(timeall);
					startcoutTime();
				}
			} else {
				if (odata.endTime != null && odata.endTime.time) {
					var endTime = new Date(odata.endTime.time);
					$('#m-endtime').text(endTime.Format());
					var timeall = Date.parse(endTime)- Date.parse(serverstartTime);
					$('#m-alltime').text(getHMStime(timeall));
					if (count_time_t) {
						stopCountTime(count_time_t);
						count_time_t = null;
					}
					// var text = '<li batchNo='+odata.batchNo+'><span
					// class="m_state'+odata.batchNo+'">' + odata.batchNo +
					// '</span></li>';
					// m_mainm_boxt.prepend(text);
					var M_state = $(".m_state" + odata.batchNo)
					if (odata.executeFlag == 'F' || odata.executeFlag == 'I') {
						M_state.css('color', '#f2b968');
					} else if (odata.executeFlag == 'B') {
						M_state.css('color', '#DD4B39');
					} else if (odata.executeFlag == 'E') {
						if (odata.errorNum > 0) {
							M_state.css('color', '#f2b968');
						} else {
							M_state.css('color', '#00A65A');
						}
					} else if (odata.executeFlag == 'S') {
						M_state.css('color', '#00A65A');
					} else if (odata.executeFlag == 'R'
							|| job.executeFlag == '') {
						M_state.css('color', '#95B8E7');
					}
				} else {
					alert('请检查增量job的endTime数据');
				}
			}
		} else {
			alert('请检查增量job的startTime数据！');
		}

		// 更新总时长
		// var timeall = Date.parse(new Date(odata.endTime))-Date.parse(new
		// Date(odata.startTime));
		// $('#m-alltime').text(getHMStime(timeall));
	}
}

// 获取xml增量信息
function dwrCanvasInfo(data) {
	var odata = JSON.parse(data);
	if (!odata.jobId) return false;
	var jobid = $("#m-navbox>li.m-on>i").attr('jobId');
	var batchno = $('#m-mainm-boxt>li.m-jt').attr('batchNo');
	if (odata.jobId == jobid && odata.batchNo == batchno) {
		if (states_click == 1 && states == 1) {
			if (states_index == 1) {
				if (odata.xml && odata.xml != '') {
					graphic.xmlDoc = odata.xml;
					graphic.reappearXmlDoc();
					graphic.update();
				}
			}
		} else {
			if (odata.xml && odata.xml != '') {
				graphic.xmlDoc = odata.xml;
				graphic.reappearXmlDoc();
				graphic.update();
			}
		}
	}
}

// 打开执行页面
function openMonitor(ejobId, jobName, executeType, ejobNo) {
	// 删除之前的参数信息
	delAllLine(true);
	// 清除datagrid数据--任务列表
	showdata("");
	$('#tt').datagrid('loadData', {
		total : 0,
		rows : []
	});
	Win.edita.dialog('open');
	Form.edita.resetForm();
	initSelectEvents(ejobId);// 加载频次数据
	// 加载第二部分datagrid数据信息
	// var surl1="tbDiMonitor/jobIdTasks.action?parentJobId="+ejobId;
	// showdata(surl1);
	// ------------------datagrid数据显示隐藏设置--------------------
	var executeWay = $('input:radio[name="executeWay"]');
	executeWay.unbind('change').change(function() {
		var flag = $(this).val();
		if (flag == "1") {
			// $("#box_executePart").attr("style","display:none;");//隐藏
			$("#box_executePart").hide();
		} else if (flag == "2") {
			// $("#box_executePart").attr("style","display:block;");//显示div
			$("#box_executePart").show();
			var surl1 = "tbDiMonitor/jobIdTasks.action?parentJobId=" + ejobId;
			showdata(surl1);
		}
	});
	// --------------------------------------
	var jname = '【' + ejobNo + '】' + jobName;
	$("#jobName").val(jname);// 页面加载作业流程信息等
	$("#jobId").val(ejobId);
	$("#executeType").val(executeType); // 执行方式
	$('#addLine_btn').unbind('click').click(addLine); // 新增一行
	$('#delAllLine_btn').unbind('click').click(function() {// 删除全部
		var table = $("#btn-tb1"); // 待操作表单
		var tab = document.getElementById("btn-tb1");
		var rows = tab.rows.length;
		if (rows > 1) {// 表头信息
			Peony.confirm('确认提示', '您确定要删除记录？', function(r) {
				delAllLine(r);
			});
		} else {
			Peony.alert('警告', '无待删除信息.', 'warning');
		}
	});
	$('#startInfo').unbind('click').click(function() {
		states_click = 0;
		startMonitor();
	});
	$('#cancelInfo').unbind('click').click(function() {
		Win.edita.dialog('close');
	});
	$('#productInfo').unbind('click').click(function() {// 批次号预览
		productInfo();
	});
	/** 获取昨天的时期--用于设置默认日期 start */
	var d = new Date();
	var d1 = new Date();
	d1.setTime(d1.getTime() - 24 * 60 * 60 * 1000);// 昨天，如果变成+则为明天
	d.setTime(d.getTime());
	var s1 = d1.getFullYear() + "-" + (d1.getMonth() + 1) + "-" + d1.getDate();
	var s = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
	$('#bStartTime,#bEndTime').datetimebox({
		onChange : function() {
			productInfo();
		},
		showSeconds : true
	});
	/** 获取昨天的时期--用于设置默认日期 end */
	// $('#bStartTime,#bEndTime').datetimebox({
	// showSeconds:true
	// });
	$('#bStartTime').datetimebox('setValue', s1);
	$('#bEndTime').datetimebox('setValue', s);

	// $('#bEndTime').datetimebox({
	// onChange: function() {
	// //以下写onchange的逻辑
	// productInfo();
	// }
	// });
}

// 开始执行方法
function startMonitor() {
	var checkval = $('input:radio[name="executeWay"]:checked').val();
	// alert(checkval);
	// 时间条件不能为空
	var bStartTime = $("#bStartTime").datetimebox('getValue');
	var bEndTime = $("#bEndTime").datetimebox('getValue');
	cstarttime = new Date();
	var scheduleId = $("#select_scheduleId").combobox('getValue');// 调度计划
	var scheduleName = $("#select_scheduleId").combobox('getText');// 调度计划名称
	var sjobId = $("#jobId").val();// 作业流程
	var executeType = $("#executeType").val();// 执行类型
	var hdiBatchNos = $("#hdiBatchNos").val();// 执行号列表
	var batchFormat = $("#batchFormat").combobox('getValue');// 批号格式
	if (sjobId == '') {
		alert("请选择作业流程");
		return false;
	}
	if (bStartTime == '') {
		alert("开始时间不能为空");
		return false;
	}
	if (bEndTime == '') {
		alert("截止时间不能为空");
		return false;
	}
	var checkNo = null;
	var checkType = null;
	var nodeName = null;
	var data = {};
	if (checkval == '2') { // 获取datagrid选中信息
		var tchecks = $('#tt').datagrid('getChecked'); // 获取选中的任务编号
		if (tchecks.length == 0) {
			Peony.alert('警告', '未选择记录.', 'warning');
			return false;
		} else {
			for (var i = 0; i < tchecks.length; i++) {
				if (i == 0) {
					checkNo = tchecks[0].taskId;
					checkType = tchecks[0].taskType;
					nodeName = tchecks[0].nodeName;
				} else {
					checkNo = checkNo + "," + tchecks[i].taskId;
					checkType = checkType + "," + tchecks[i].taskType;
					nodeName = nodeName + "," + tchecks[i].nodeName;
				}
			}

		}
		data.chooseType = '2';
	} else {// 从某个节点开始
		checkNo = $("#startTask").combobox('getValue');// 选中的taskid
		nodeName = $("#startTask").combobox('getText');
		data.chooseType = '1';
	}
	// 关闭当前页面
	Win.edita.dialog('close');
	// 获取填写的参数信息
	var vName = $("*[name='vname']").map(function() {
		return $(this).val()
	}).get().join(",");
	var vValue = $("*[name='vvalue']").map(function() {
		return $(this).val()
	}).get().join(",");

	data.jobId = sjobId;
	data.executeType = executeType;
	data.checkNo = checkNo;
	data.nodeName = nodeName;
	data.bStartTime = bStartTime;
	data.bEndTime = bEndTime;
	data.scheduleId = scheduleId;
	data.scheduleName = scheduleName;
	data.vName = vName;
	data.vValue = vValue;
	data.checkType = checkType;
	data.hdiBatchNostr = hdiBatchNos;
	data.batchFormat = batchFormat;
	tbDiMonitorController.startMonitor(data, {
		// dwr 异常信息处理
		errorHandler : function(message) {
			Peony.alert('错误', '后台程序报错-' + message, 'error');
		}
	});
	startcoutTime(); // 点击执行监控就开始启动计时--------------
}

// 停止执行实现方法
function stopMonitor(ejobId, eflag, executeType, obj) {
	if (eflag == "E") {
		Peony.alert('警告', '该作业目前正在中断执行中.', 'warning');
	} else if (eflag != "E" && eflag != "R") {
		Peony.alert('警告', '该作业已经停止.', 'warning');
	} else if (eflag == "R") {
		$.messager.confirm('确认提示', '您确定要停止吗？', function(r) {
			if (r) {
				$('#m-ppbtn').removeClass().addClass('m-pingbtn');
				var data = {};
				data.jobId = ejobId;
				data.executeType = executeType; // 执行方式
				$.ajax('tbDiMonitor/stopMonitor.action', {
					type : 'post',
					dataType : 'json',
					data : data,
					success : function(data) {
						// Peony.alert('提示', '停止监控成功，下一批次将不再执行.', 'info');
						// obj.removeClass().addClass('iconfont m-playbtn');
					},
					error : function() {
						Peony.alert('错误', '执行失败,请联系系统管理员.', 'error');
					}
				});
			}
		});
	}
}

// 生成批次号方法
function productInfo() {
	// 清空原有数据
	$("#hdiBatchNo").val("");
	// 时间条件不能为空
	var bStartTime = $("#bStartTime").datetimebox('getValue');
	var bEndTime = $("#bEndTime").datetimebox('getValue');
	var scheduleId = $("#select_scheduleId").combobox('getValue');// 调度计划
	var batchFormat = $("#batchFormat").combobox('getValue');// 批号格式
	// if(bStartTime == ''){
	// alert("开始时间不能为空");
	// return false;
	// }
	// if(bEndTime == ''){
	// alert("截止时间不能为空");
	// return false;
	// }
	if(bStartTime != '' && bEndTime != ''){
		var data = {};
		data.bStartTime = bStartTime;
		data.bEndTime = bEndTime;
		data.scheduleId = scheduleId;
		data.batchFormat = batchFormat;
		
		$.ajax({
			type : "post",
			url : "tbDiMonitor/queryBatchNumber.action",
			data : data,
			success : function(result) {
				var str = "";
				if (result != null && result.length > 0) {
					for (var i = 0; i < result.length; i++) {
						str += result[i] + "\n";
					}
				}
				$("#hdiBatchNo").val(str);
				$("#hdiBatchNos").val(result);
			}
		});
	}
}

// 加载下拉框数据信息
function initSelectEvents(ejobId) {
	// 批次执行频率
	$("#select_scheduleId").combobox({
		valueField : 'scheduleId',
		textField : 'scheduleName',
		editable : false,// 可编辑
		url : 'etlSchedule/listEtlSchedule1.action',
		onChange : function(newValue, oldValue) {
			keyInfo(newValue);
			productInfo();
		},
		onLoadSuccess : onLoadSuccess
	});
	// 执行格式
	$("#batchFormat").combobox({
		valueField : 'dictdataName',
		textField : 'dictdataName',
		editable : false,// 不可编辑
		url : 'sysDictionaryData/getValues.action?dictValue=BATCH_FORMAT',
		onChange : function(newValue, oldValue) {
			productInfo();
		},
		onLoadSuccess : function() {
			$("#batchFormat").combobox('setValue','YYYYMMDD');//默认值
			$("#batchFormat").combobox('setText','YYYYMMDD');//默认值
		}
	});
	// 加载第一部分可选择任务信息
	$("#startTask").combobox({
		valueField : 'taskId',
		textField : 'nodeName',
		editable : false,// 不可编辑
		url : "tbDiMonitor/jobIdTasks2.action?parentJobId=" + ejobId,
		onLoadSuccess : onLoadSuccess
	});
}
// 批次格式是否可以编辑
function keyInfo(keyid) {
	if (keyid == "") {
		$("#batchFormat").combobox({
			disabled : false
		});
	} else {
		$("#batchFormat").combobox({
			disabled : true
		});
	}
}
/*
 * 默认第一项选中 @memberOf {TypeName}
 */
function onLoadSuccess() {
	var target = $(this);
	var data = target.combobox("getData");
	var options = target.combobox("options");
	if (data && data.length > 0) {
		var fs = data[0];
		target.combobox("setValue", fs[options.valueField]);
	}
}
/*
 * 展示待选择任务组成信息
 */
function showdata(url) {
	$('#tt').datagrid({
			url : url,
			rownumbers : true,
			singleSelect : false,
			pagination : false,// 分页控件
			fitColumns : true,
			remoteSort : false,
			columns : [ [ {
				title : '序号',
				field : 'taskId',
				checkbox : true
			}, {
				field : 'nodeName',
				title : '节点名称',
				width : 120,
				sortable : true
			}, {
				field : 'taskName',
				title : '任务名称',
				width : 140,
				sortable : true
			}, {
				field : 'taskType',
				title : '任务类型',
				width : 80,
				sortable : true,
				formatter : function(value, row, index) {
					if (row.taskType == '1') {
						return '数据抽取';
					} else if (row.taskType == '2') {
						return '执行SQL';
					} else if (row.taskType == '3') {
						return '变量设置';
					} else if (row.taskType == '5') {
						return '存储过程';
					} else if (row.taskType == '6') {
						return '外部程序';
					} else if (row.taskType == '4') {
						return '作业流程';
					} else if (row.taskType == '8') {
						return '导出文本';
					} else if (row.taskType == '9') {
						return '发送邮件';
					} else if (row.taskType == '10') {
						return '执行Kettle';
					} else if (row.taskType == '11') {
						return '执行JS语句';
					}else if (row.taskType == '12') {
						return '执行Webservice';
					}else if (row.taskType == '13') {
						return '数据剖析';
					}else if (row.taskType == '14') {
						return 'FTP文件';
					}
				}
			} ] ],
			onClickRow : function(index, row) { // 单击行事件
				if (index != selectIndexs.firstSelectRowIndex
						&& !inputFlags.isShiftDown1) {
					selectIndexs.firstSelectRowIndex = index; 
				}
				if (inputFlags.isShiftDown1) {
					$('#tt').datagrid('clearSelections');
					selectIndexs.lastSelectRowIndex = index;
					var tempIndex = 0;
					if (selectIndexs.firstSelectRowIndex > selectIndexs.lastSelectRowIndex) {
						tempIndex = selectIndexs.firstSelectRowIndex;
						selectIndexs.firstSelectRowIndex = selectIndexs.lastSelectRowIndex;
						selectIndexs.lastSelectRowIndex = tempIndex;
					}
					for (var i = selectIndexs.firstSelectRowIndex; i <= selectIndexs.lastSelectRowIndex; i++) {
						$('#tt').datagrid('selectRow', i);
					}
				}
			},
			onLoadSuccess : function() {
				$('#tt').datagrid('selectAll');
			}
		})
}

function addLine(i, data) {
	var table = $("#btn-tb1"); // 待操作表单
	var tab = document.getElementById("btn-tb1");
	var rows = tab.rows.length;
	var html = "<tr class='tb-line'>";
	html += "  <td width=\"10%\"><input name=\"vno\" class=\"easyui-validatebox text-name\" style=\"width:100%;border-style: none;text-align: center; \" value=\""
			+ rows + "\" data-options=\"required:true,editable :false\"></td>";
	html += "  <td width=\"35%\"><input name=\"vname\"  type=\"text\" style=\"width:90%\" ></td>";
	html += "  <td width=\"35%\"><input name=\"vvalue\" type=\"text\" style=\"width:90%\" ></td>";
	html += "  <td width=\"15%\" align='center'><a class=\"easyui-linkbutton remove-btn\"  iconCls=\"icon-remove\" plain=\"true\"></a>";
	html += "  </td>";
	html += "</tr>";
	var line = $(html);
	// 版定删除按钮事件
	$(".remove-btn", line).click(function() {
		Peony.confirm('确认提示', '您确定要删除记录？', function(r) {
			if (r) {
				delLine(line);
			}
		})
	});
	if (data) {
		$("input[name='vno']", line).val(data.vno);
		$("input[name='vname']", line).val(data.vname);
	}
	$.parser.parse(line);// 解析esayui标签
	table.append(line);

}
// 删除全部
function delAllLine(b) {
	if (b) {// true时删除
		// $(".tb-line").remove();
		// }else{
		$(".tb-line").each(function(i, line) {
			delLine($(line));
		});
	}
}
// 删除单行
function delLine(line) {
	if (line) {
		line.fadeOut("fast", function() {
			$(this).remove();
		});
	}
}

// 刷新
function Refresh() {
	// 加载左侧下拉框信息-搜索功能
	var xmlhttp = getajaxHttp();
	xmlhttp.open("GET", "tbDiMonitor/dwrList.action", true);
	xmlhttp.send();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var rq = xmlhttp.responseText || null;
			if (rq) {
				jobrq = JSON.parse(rq);
				var t_leftjob = $('#t_left_job').html();
				var m_navbox = $('#m-navbox');
				if (jobrq.length == '0') {
					Peony.closeProgress();
				}
				var dt = 0;
				for (i = 0; i < jobrq.length; i++) {
					if (jobrq[i].executeFlag == ''
							|| jobrq[i].executeFlag == 'R') {
						dt = dt + 1
					}
				}
				if (jobrq.length == dt) {
					Peony.closeProgress();
				}
				m_navbox.html(doT.template(t_leftjob)(jobrq));
				var m_navbox_lis = m_navbox.children('li');
				m_navbox_lis.bind('click', leftNodeClick);
				m_navbox_lis.eq(0).trigger("click");
			} else {
				alert('请检查job全量数据！');
			}
		}
	}
}

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
