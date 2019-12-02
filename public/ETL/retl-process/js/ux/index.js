$(function() {
	//查询第一块内容
	searchInfo();
	$('#task').html(20);
	// 加载第二部分调度计划信息
	showdataGrid("");
	var surl="etlSchedule/dataList.action?scheduleName=null";
	showdataGrid(surl);
	//第三部分
	showDataList();
	
});

function showDataList(){
	var data={};
	$.ajax({  
		type: "POST",  
		url: "etlSchedule/dataList.action?scheduleName=null",  
		data: data,  
		success: function(data){ 
			//加载第三部分信息
			showBatchInfo(data.rows[0].scheduleId,data.rows[0].scheduleName);
			//当前选中调度计划ID
			$("#for_scheduleId").val(data.rows[0].scheduleId);
		}  
	});
}
//查询模块数量信息
function searchInfo(){
	var data={};
	$.ajax({  
		type: "POST",  
		url: "sysIndex/sumInfo.action",  
		data: data,  
		success: function(data){  
			$('#db').html(data.dbSum);
			$('#task').html(data.taskSum);
			$('#job').html(data.jobSum);
			$('#schedule').html(data.sSunm);
		}  
	});
}

//查询第三部分信息
function showBatchInfo(sid,sname){
	$("#forName").html("计划执行日志分析/"+sname);
	 // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    myChart.clear();
//    myChart.dispose();
    myChart.hideLoading();
    $.ajax({  
		type: "get",  
		url: "sysIndex/getBatchById.action?scheduleId="+sid,  
//		data: data,  
		success: function(data){  
			var dlength=data.data.length;
			var startInfo;
			if (dlength > 9) {
				startInfo = (dlength - 9) / dlength * 100; // 设置默认显示10条数据的位置
			} else {
				startInfo = dlength;
			}
//			console.log("startInfo----="+startInfo);
			if(data.data != null && dlength >0){
				// 元数据处理，e.g. metadata.init().xxx
			    var metadata = {
			        flag: true,
			        quarter: [],
			        xinfo: [],
			        ySuccessinfo: [],
			        yErrorinfo: [],
			        yRinfo: [],
			        yOtherinfo :[],
			        yinfo:[],
			        testInfo:[],//自定义参数数据，存储了executorId字段信息
			        flagInfo:[],//自定义参数数据，存储了executeFlag字段信息
			        x_major_offset: dlength,
			        init: function() {
			            // 首次初始化
			            if (metadata.flag) {
			                // 数据遍历
			                for (var i = 0; i < dlength; i++) {
//			                	if(i<2){
				                    //debugger;
				                    if (i === 0) {
				                        metadata.quarter.push(data.data[i]);
				                    } else {
				                        // 与子分类列匹配
				                        metadata.quarter.push(data.data[i - 1] === data.data[i] ? '' : data.data[i]);
				                    }
				                    //Y数据中每一个类型的个数都需要和X中的个数相对应，否则数据无法正确匹配，
				                    //因此分类型的Y轴数据不能用push赋值，需要对应i进行赋值 wfy 20170512
				                    //数组显示赋空值时，不能为0，可以设置为-
				                    if(data.data[i].executeFlag =="S"){
				                    	metadata.yRinfo[i]='-';
				                    	metadata.yErrorinfo[i]='-';
				                    	metadata.yOtherinfo[i]='-';
				                    	metadata.ySuccessinfo[i]=data.data[i].batchTime;
				                    	metadata.testInfo[i]=data.data[i].executorId;
				                    	metadata.flagInfo[i]=data.data[i].executeFlag;
				                    }else if(data.data[i].executeFlag =="F"){
				                    	metadata.yRinfo[i]='-';
				                    	metadata.yErrorinfo[i]=data.data[i].batchTime;
				                    	metadata.yOtherinfo[i]='-';
				                    	metadata.ySuccessinfo[i]='-';
				                    	metadata.testInfo[i]=data.data[i].executorId;
				                    	metadata.flagInfo[i]=data.data[i].executeFlag;
				                    }else if(data.data[i].executeFlag =="R" || data.data[i].executeFlag =="E"){
				                    	metadata.yRinfo[i]=data.data[i].batchTime;
				                    	metadata.yErrorinfo[i]='-';
				                    	metadata.yOtherinfo[i]='-';
				                    	metadata.ySuccessinfo[i]='-';
				                    	metadata.testInfo[i]=data.data[i].executorId;
				                    	metadata.flagInfo[i]=data.data[i].executeFlag;
				                    }else if(data.data[i].executeFlag =="B" || data.data[i].executeFlag =="I"){
				                    	metadata.yRinfo[i]='-';
				                    	metadata.yErrorinfo[i]='-';
				                    	metadata.yOtherinfo[i]=data.data[i].batchTime;
				                    	metadata.ySuccessinfo[i]='-';
				                    	metadata.testInfo[i]=data.data[i].executorId;
				                    	metadata.flagInfo[i]=data.data[i].executeFlag;
				                    }
				                    metadata.xinfo.push(data.data[i].batchNo);
				                    // 计算子分类字符长度（按汉字计算，*12号字体）
				                    metadata.x_major_offset = metadata.x_major_offset > data.data[i].length ? metadata.x_major_offset : data.data[i].length;
				                    
//			                	}
			                }
			                metadata.flag = false;
			            }
			            return metadata;
			        }
			    };
			 // 指定图表的配置项和数据
			    var option = {
			    	tooltip: {},
//			        title: {
//			            text: '批次执行时长'
//			        },
//			        toolbox: {
//			            show : true,//显示策略
//			            feature : {//启用功能
//			                mark : {show: true},//辅助线标志
//			                dataView : {show: true, readOnly: false},//数据视图
//			                magicType: {show: true, type: ['line', 'bar']},//magicType，动态类型切换，支持直角系下的折线图、柱状图、堆积、平铺转换 
//			                restore : {show: true},//还原，复位原始图标
//			                saveAsImage : {show: true}//保存图片
//			            }
//			        },
			    	//是否启用拖拽重计算特性，默认关闭(即值为false)  
			        calculable : true,
			        legend: {
			        	 //legend的data: 用于设置图例，data内的字符串数组需要与sereis数组内每一个series的name值对应    
			        	 data:['成功完成','出错完成','执行中','中断']
			        },
			        xAxis: {
			        	type: 'category',
			        	show: true,
			        	data:  metadata.init().xinfo
			        },
			        yAxis: {
//			        	name:"执行时长：(秒)",
			        	show: true,
			        	axisLabel: {//显示格式化
		                     formatter: '{value} s'
		                 }
			        	},
			        dataZoom: [
		                   {
		                       show: true,
		                       start: startInfo,//下侧拖拽显示开始位置
		                       end: 100
		                   },
		                   {
		                       type: 'inside',
		                       start: 94,
		                       end: 100
		                   },
		                   {
		                       show: false,//Y轴拖拽是否显示问题，如果为true则显示
		                       yAxisIndex: 0,
		                       filterMode: 'empty',
		                       width: 30,
		                       height: '100%',//可以影响拖拽时显示的个数
		                       showDataShadow: false,
		                       left: '93%'
		                   }
		               ],
			        //用于设置图表数据之
			        series: [
			        {
			            name:'成功完成',
			            type:'bar',
			            stack: '状态',
			            barWidth : 35,//柱图宽度
			            barGap:'20%',//两个柱型之间的距离
			            barMinHeight : 10,
			            itemStyle: {                // 系列级个性化
			                normal: {
//			                    barBorderWidth: 6,
//			                    barBorderColor:'#7CCD7C',//柱状图颜色-绿色
			                    color: '#7CCD7C'//鼠标以及上侧方框显示颜色
			                }
			            },
			            data:metadata.init().ySuccessinfo,
			            rawdate: metadata.init().testInfo,  //添加了自定义rawdate参数
			            flagdate:metadata.init().flagInfo
			        },
			        {
			            name:'出错完成',
			            type:'bar',
			            stack: '状态',
			            barWidth : 35,
			            barGap:'20%',
			            barMinHeight : 10,
			            itemStyle: { 
			                normal: {
			                    barBorderColor:'#f2b968',
			                    color: '#f2b968'
			                }
			            },
			            data: metadata.init().yErrorinfo,
			            rawdate: metadata.init().testInfo,  //添加了自定义rawdate参数
			            flagdate:metadata.init().flagInfo
			        },
			        {
			            name:'执行中',
			            type:'bar',
			            stack: '状态',
			            barWidth : 35,
			            barGap:'20%',
			            barMinHeight : 10,
			            itemStyle: {              
			                normal: {
			                    barBorderColor:'#63B8FF',//--蓝色
			                    color: '#63B8FF'
			                }
			            },
			            data: metadata.init().yRinfo,
			            rawdate: metadata.init().testInfo,  //添加了自定义rawdate参数
			            flagdate:metadata.init().flagInfo
			        } ,
			        {
			            name:'中断',
			            type:'bar',
			            stack: '状态',
			            barWidth : 35,
			            barGap:'20%',
			            barMinHeight : 10,
			            itemStyle: { 
			                normal: {
//			                    barBorderWidth: 6,
//			                    barBorderColor:'#8B2323',
			                    color: '#dd6e78'
			                }
			            },
			            data: metadata.init().yOtherinfo,
			            rawdate: metadata.init().testInfo,  //添加了自定义rawdate参数
			            flagdate:metadata.init().flagInfo
			        }   
			     ]
			    };
			    // 使用刚指定的配置项和数据显示图表。
			    try{
			    	myChart.setOption(option); 
			    }catch (err) {};
			    myChart.on('click',function(param){
		    	    var cloudid;
		            if (typeof param.seriesIndex != 'undefined') {
		                cloudid = option.series[param.seriesIndex].rawdate[param.dataIndex];//执行ID
		                eflag = option.series[param.seriesIndex].flagdate[param.dataIndex];//执行ID
		                //调度计划ID,执行状态，批次编号，执行ID
		                //跳转日志信息柱形图页面
		                var sid= $("#for_scheduleId").val();//调度计划ID
		                
		            		var jq = top.jQuery;
		            		var _this = jq('#main_nav');
//		            		console.log(_this.find("li").eq(0).html())
		            		_this.find("li").eq(0).removeClass('active_gai');
		            		_this.find("li").eq(0).removeClass('moveout');
		            		_this.find("li").eq(7).addClass('active_gai');
		            		_this.find("li").eq(9).addClass('active_gai');
		            		addTab("柱形图信息",getRealPath() + "/tbDiMonitorLog/imageInfo.action?scheduleId="+sid+"&batchNo="+param.name
			                		+"&executorId="+cloudid+"&executeFlag="+eflag);
		            				
		               // $(location).attr('href', getRealPath() + "/tbDiMonitorLog/forimageInfo.action?scheduleId="+sid+"&batchNo="+param.name
		                		//+"&executorId="+cloudid+"&executeFlag="+eflag);
		            }
		    })
			}
			
		}  
	});
    
}
//调度计划数据显示
function showdataGrid(url){
	$('#data-list').datagrid({
		url : url,
		idField : 'scheduleId',
		pagination:true, //分页
		rownumbers :true, //行号
		singleSelect:true,//单选 
		checkOnSelect:true,
		autoRowHeight : false,//是否设置基于该行内容的行高度
		remoteSort : false,
		fitColumns : true,//自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动。
		pageSize: 5,//每页显示的记录条数，默认为10 
	    pageList: [5, 10, 30, 50],  
		columns : [ [ {
			field : 'scheduleId',
			hidden : true
		}, {
			field : 'scheduleName',
			title : '计划名称',
			width : 80,
			sortable : true
		}, {
			field : 'jobNo',
			title : '作业编号 ',
			width : 80,
			sortable : true
		}, {
			field : 'jobName',
			title : '作业名称',
			width : 80,
			sortable : true
		}, {
			field : 'beforeTime',
			title : '上次执行时间',
			width : 100,
			sortable : true
		}, {
			field : 'lastExecStateName',
			title : '最后一次执行状态',
			width : 60,
			sortable : true
		}, {
			field : 'nextTime',
			title : '下次执行时间',
			width : 100,
			sortable : true
		}, {
			field : 'startFlagName',
			title : '运行状态',
			width : 60,
			sortable : true,
			formatter : function(value, row, index) {
				if (row.startFlagName == '开启')
					return '<strong><font color="green">开启</font></strong>';
				else
					return row.startFlagName;
			}
		}
		
	] ],
	onClickRow: function (index, row) {
//		console.log("sid==="+row.scheduleId);
//		console.log("sname==="+row.scheduleName);
		showBatchInfo(row.scheduleId,row.scheduleName);
		//当前选中调度计划ID
		$("#for_scheduleId").val(row.scheduleId);
		
	}
	});
}



	$('#Sjlj').unbind('click').click(function(){
		var jq = top.jQuery;
		var _this = jq('#main_nav');
		_this.find("li").removeClass('active_gai');
		_this.find("li").eq(2).addClass('active_gai');
		_this.find("li").eq(1).addClass('active_gai');
		addTabs_main("数据连接",'dbConnection/list2.action');
				
	});
	$('#Zhrw').unbind('click').click(function(){
		var jq = top.jQuery;
		var _this = jq('#main_nav');
		_this.children().siblings('li').removeClass('active_gai');
		_this.children().eq(2).addClass('active_gai');
		addTabs_main("转换任务",'task/list.action');
				
	});
	$('#Zylc').unbind('click').click(function(){
		var jq = top.jQuery;
		var _this = jq('#main_nav');
		_this.children().siblings('li').removeClass('active_gai');
		_this.children().eq(3).addClass('active_gai');
		addTabs_main("作业流程",'job/list.action');
				
	});
	$('#Ddjh').unbind('click').click(function(){
		var jq = top.jQuery;
		var _this = jq('#main_nav');
		_this.children().siblings('li').removeClass('active_gai');
		_this.children().eq(4).addClass('active_gai');
		addTabs_main("调度计划",'etlSchedule/list.action');
				
	});
	function addTabs_main(title,url){
		var jq = top.jQuery;
		var tab_wrap = jq('#main_tab_box');
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

function addTab(title,url){
	var jq = top.jQuery;
	var tab_wrap = jq('#main_tab_box');
	var content = '<iframe  frameborder="0" src="'
		+ url
		+ '" style="display:block;width:100%;height:100%;" border="0" marginwidth="0" marginheight="0" scrolling="no" ></iframe>';
	tab_wrap.tabs('add', {
		title : title,
		content : content,
		closable : true
	});
}
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


