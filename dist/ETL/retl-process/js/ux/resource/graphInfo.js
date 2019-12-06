var allNodesMap;  //圆圈信息
var allSLinksMap;//连接信息源表--下游信息
var allTLinksMap;//连接信息目标表--上游信息
var dataNodes;//查询条件为空时的全部node值
var backInfoDb=[];//历史查询条件，【返回】时使用
var backInfoTable=[];
var backInfoCheck=[];
var index=1;
var clickDb;//双击选中的数据连接信息
var clickTable;//双击选中的表信息
$(function() {
//	showGraphList();
//	backInfoDb.push('');
//	backInfoTable.push('');
//	backInfoCheck.push('true-true-false-false');//上游-下游-直接节点-大小写
	$('#search_dbConnection').combobox("setValue",sourcedb);
	$('#search_dbConnection').combobox("setText",sourcedbName);
	$('#search_sourceTables').val(sourcetab);
	$('#btn-backInfo').attr('disabled',"true");
	var dbconn=$('#search_dbConnection').combobox("getValue");
	var dbname=$('#search_dbConnection').combobox("getText");
	var stable=$('#search_sourceTables').val();
	backInfoDb.push(sourcedbName);
	backInfoTable.push(sourcetab)
	searchData(sourcedb,sourcedbName,sourcetab);
	//$(".validatebox-tip").remove();
	//$(".validatebox-invalid").removeClass("validatebox-invalid");
	
});

function addFirstNode(dbname,key,firstNode,ifUpcase){
	if(dbname != ''){
		if(!ifUpcase){//不选中
			dbname=dbname.toUpperCase();
		}
		if(key.split(".\n")[0] == dbname){ 
			firstNode.push(key);
		}
	}else{
		firstNode.push(key);
	}
	return firstNode;
}

function addLastNode(dbname,key,fornodes,lastNode,ifUpcase){
	if(dbname != ''){
		if(!ifUpcase){//不选中
			dbname=dbname.toUpperCase();
		}
		if(key.split(".\n")[0] == dbname){ 
			lastNode.push(fornodes);
		}
	}else{
		lastNode.push(fornodes);
	}
	
	return lastNode;
}

//得到的node值是不包含@符号的
function getFirstNode(dbname,stable,allNodesMap,ifUpcase){
	var firstNode=[];//第一层直接关联表名称
	var dbTable=dbname+'.\n'+stable;
	var n = (stable.split('%')).length-1;
	for(var key in allNodesMap){
		 if(key.indexOf('@') != -1){//存在
			 key = key.split("@")[1];
		 }
		if(stable != ''){
			//区分大小写判断
			if(!ifUpcase){//不选中
				stable=stable.toUpperCase();
				key=key.toUpperCase();
			}
			if(n > 0 ){//LIKE查询
				//1-%+字符串，2-字符串+%，3-%+字符串+%
				if(n==2){//前后包含%+字符串+%
					var likestable=stable.replace(/%/g, "");
					if(key.split(".\n")[1].indexOf(likestable) != -1){ //包含
						firstNode=addFirstNode(dbname,key,firstNode,ifUpcase);
					}
				}else{
					if(stable.indexOf('%') == 0){//%+字符串
						var s=stable.replace(/%/g, "");
						var k=key.split(".\n")[1];
//						console.log(k.substr(k.length-s.length,k.length-1));
						if(k.substr(k.length-s.length,k.length-1) == s){
							firstNode=addFirstNode(dbname,key,firstNode,ifUpcase);
						}
					}else{//字符串+%
						var s=stable.replace(/%/g, "");
						var k=key.split(".\n")[1];
//						console.log(k.substr(0,s.length));
						if(k.substr(0,s.length) == s){
							firstNode=addFirstNode(dbname,key,firstNode,ifUpcase);
						}
					}
				}
			}else{//等于
				if(key.split(".\n")[1] == stable){ //包含
					if(dbname != ''){
						if(!ifUpcase){//不选中
							dbname=dbname.toUpperCase();
						}
						if(key.split(".\n")[0] == dbname){ 
							firstNode.push(key);
						}
					}else{
						firstNode.push(key);
					}
				}
			}
		}else if(dbname != ''){
			if(!ifUpcase){//不选中
				dbname=dbname.toUpperCase();
				key=key.toUpperCase();
			}
			if(key.split(".\n")[0] == dbname){
				firstNode.push(key);
			}
		}else{//全部为空时查询所有
			firstNode.push(key);
		}
	}
//	console.log("----------firstNode--------");
//	console.log(firstNode);
	return firstNode;
}

//只查询圆圈信息
function forLastNode(dbname,stable,fornodes,ifUpcase){
	var lastNode=[];
	if(fornodes != null && fornodes.length>0){
		var n = (stable.split('%')).length-1;
		for(var i =0;i<fornodes.length;i++){
			var key=fornodes[i].name;//CSV-A.↵测试1
			if(stable != ''){
				if(!ifUpcase){//不选中
					stable=stable.toUpperCase();
					key=key.toUpperCase();
				}
				if(n > 0 ){//LIKE查询
					//1-%+字符串，2-字符串+%，3-%+字符串+%
					if(n==2){//前后包含%+字符串+%
						var likestable=stable.replace(/%/g, "");
						if(key.split(".\n")[1].indexOf(likestable) != -1){ //包含
							lastNode=addLastNode(dbname,key,fornodes[i],lastNode,ifUpcase);
						}
					}else{
						if(stable.indexOf('%') == 0){//%+字符串
							var s=stable.replace(/%/g, "");
							var k=key.split(".\n")[1];
//							console.log(k.substr(k.length-s.length,k.length-1));
							if(k.substr(k.length-s.length,k.length-1) == s){
								lastNode=addLastNode(dbname,key,fornodes[i],lastNode,ifUpcase);
							}
						}else{//字符串+%
							var s=stable.replace(/%/g, "");
							var k=key.split(".\n")[1];
//							console.log(k.substr(0,s.length));
							if(k.substr(0,s.length) == s){
								lastNode=addLastNode(dbname,key,fornodes[i],lastNode,ifUpcase);
							}
						}
					}
				}else{//等于
					if(key.split(".\n")[1] == stable){ //包含
						if(dbname != ''){
							if(!ifUpcase){//不选中
								dbname=dbname.toUpperCase();
							}
							if(key.split(".\n")[0] == dbname){ 
								lastNode.push(fornodes[i]);
							}
						}else{
							lastNode.push(fornodes[i]);
						}
					}
				}
			}else if(dbname != ''){
				if(!ifUpcase){//不选中
					dbname=dbname.toUpperCase();
					key=key.toUpperCase();
				}
				if(key.split(".\n")[0] == dbname){
					lastNode.push(fornodes[i]);
				}
			}else{//全部为空时查询所有
				return fornodes;
			}
		 }
	}
	return lastNode;
}


//查询下游信息
function findChildData(map,sNode,allNodesMap,allSLinksMap,ifDirect,ifUpcase){
	 var forslink=[];//下次循环的源，本次的目标
	 var fordb=[];//下次循环的连接
	 var forsearchNode=[];
	 var otherlink=[];
	 var lmap = {};
	 var alls=allSLinksMap;
	 var lastNodeList = map['node'];
	 var lastLinkList = map['link'];
//	 console.log("待查询表名称 -----下游---------");
//	 console.log(sNode);
	 if(sNode != null && sNode.length > 0 ){
		 for(var i=0;i<sNode.length;i++){
			 var dbtable=sNode[i];
			 //遍历map和传入的表名称比较，如果包含，则将其对应的对象放入到连接list和源list中
			 //将两个list存入到map中最终返回到调用函数
				//目标表
				 for(var key in alls){//直到传入的源表名称在源表map中不存在时退出循环,带@
					 var k;
					 if(key.indexOf('@') != -1){//存在
						 k = key.split("@")[1];
					 }else{
						 k=key;
					 }
					 if(!ifUpcase){//不选中
							k=k.toUpperCase();
							dbtable=dbtable.toUpperCase();
					 }
					 if( k == dbtable){
						 var linkValue = alls[key];
						 //下次需要循环的表名称信息
						 var tl=linkValue.target;//H2-s.↵test1
						 var sl=linkValue.source;
						 if(tl.toUpperCase() == sl.toUpperCase()){
							 continue;
						 }
						 //保存连接信息
						 if(JSON.stringify(lastLinkList).indexOf(JSON.stringify(linkValue)) == -1){//不存在
							 lastLinkList.push(linkValue);
							 if(forsearchNode.indexOf(tl) == -1){//不存在
								 forsearchNode.push(tl);
							 }
							 //查询对应的圆信息,源+目标
							 //保存圆信息
							 var nodeValue = allNodesMap[sl];//待保存的对象
							 if(JSON.stringify(lastNodeList).indexOf(JSON.stringify(nodeValue)) == -1){//不存在
								 lastNodeList.push(nodeValue);
							 }
							 var nodeValue2 = allNodesMap[tl];
							 if(JSON.stringify(lastNodeList).indexOf(JSON.stringify(nodeValue2)) == -1){//不存在
								 lastNodeList.push(nodeValue2);
							 }
						 }
						 
					 }
				 }
		 }
		 map['node']=lastNodeList;
		 map['link']=lastLinkList;
		 if(!ifDirect){
			 findChildData(map,forsearchNode,allNodesMap,allSLinksMap,ifDirect,ifUpcase);
		 }
	 }else{
		 return map;
	 }
	 return map;
}

//查询上游信息
function findParentData(map,sNode,allNodesMap,allTLinksMap,ifDirect,ifUpcase){
	 var forslink=[];//下次循环的源，本次的目标
	 var fordb=[];//下次循环的连接
	 var forsearchNode=[];
	 var otherlink=[];
	 var lmap = {};
	 var talls=allTLinksMap;
	 var lastNodeList = map['node'];
	 var lastLinkList = map['link'];
	 var lastNewNodeList = map['newNode'];
//	 console.log("待查询表名称---------");
//	 console.log(sNode);
	 if(sNode != null && sNode.length > 0 ){
		 for(var i=0;i<sNode.length;i++){
			 var dbtable=sNode[i];
			 //遍历map和传入的表名称比较，如果包含，则将其对应的对象放入到连接list和源list中
			 //将两个list存入到map中最终返回到调用函数
				//目标表
				 for(var key in talls){//直到传入的源表名称在源表map中不存在时退出循环,带@
					 var k;
					 if(key.indexOf('@') != -1){//存在
						 k = key.split("@")[1];
					 }else{
						 k=key;
					 }
					 if(!ifUpcase){//不选中
							k=k.toUpperCase();
							dbtable=dbtable.toUpperCase();
					 }
					 if( k == dbtable){
						 var linkValue = talls[key];
						 //下次需要循环的表名称信息
						 var tl=linkValue.target;//H2-s.↵test1
						 var sl=linkValue.source;
						 if(tl.toUpperCase() == sl.toUpperCase()){
							 continue;
						 }
						 //保存连接信息
						 if(JSON.stringify(lastLinkList).indexOf(JSON.stringify(linkValue)) == -1){//不存在
							 lastLinkList.push(linkValue);
							 //判断是否已存在
							 if(forsearchNode.indexOf(sl) == -1){//不存在
								 forsearchNode.push(sl);
							 }
							 //查询对应的圆信息,源+目标
							 //保存圆信息
							 var nodeValue = allNodesMap[sl];//待保存的对象
							 if(JSON.stringify(lastNodeList).indexOf(JSON.stringify(nodeValue)) == -1){//不存在
								 lastNodeList.push(nodeValue);
							 }
							 var nodeValue2 = allNodesMap[tl];
							 if(JSON.stringify(lastNodeList).indexOf(JSON.stringify(nodeValue2)) == -1){//不存在
								 lastNodeList.push(nodeValue2);
							 }
						 }
//						 forslink.push(sl.split(".\n")[1]);//下次表名称
//						 fordb.push(sl.split(".\n")[0]);//下次连接名称
					 }
				 }
		 }
		 map['node']=lastNodeList;
		 map['link']=lastLinkList;
		 if(!ifDirect){
			 findParentData(map,forsearchNode,allNodesMap,allTLinksMap,ifDirect,ifUpcase);
		 }
	 }else{
		 return map;
	 }
	 return map;
}


//查询信息
$('#btn-search').unbind('click').click(function() {
	var b=$("#btn-backInfo").prop("disabled") ;
	if(b){
		$('#btn-backInfo').removeAttr("disabled");
	}
	var dbconn=$('#search_dbConnection').combobox("getValue");
	var dbname=$('#search_dbConnection').combobox("getText");
	var stable=$('#search_sourceTables').val();
	if(dbconn == ''){
		dbname='';
	}
	backInfoDb.push(dbname);
	backInfoTable.push(stable)
//	console.log("backInfoDb----"+backInfoDb.length+"--backInfoTable--"+backInfoTable.length);
	searchData(dbconn,dbname,stable);
});

//查询信息
function searchData(dbconn,dbname,stable){
	var ifUpcase=$('#ifUpcase').is(':checked');//是否选中--大小写
	//数据库查询所有圆圈和关联信息，防止其他人同时进行新增操作而本页面无法查询到数据信息
	var firstData={};
	firstData.ifUpcase=ifUpcase;
	$.ajax('graphInfo/getDatas.action', {
			type : 'post',
			data : firstData,
			success : function(result) {
				allNodesMap=result.allNodes;
				allSLinksMap=result.allSLinks;
				allTLinksMap=result.allTLinks;
				dataNodes=result.nodes;
//				console.log(allNodesMap);
				//改为AJAX传参
				var data = {};
				data.sourceConnection=dbconn;
				data.sourceTables=stable;
				data.ifUpcase=ifUpcase;
				$.ajax('graphInfo/getDatas.action', {
					type : 'post',
					data : data,
					success : function(data) {
						var ifDirect=$('#ifCheck').is(':checked');//是否选中--直接节点
						var ifafter=$('#ifAfter').is(':checked');//是否选中--下游
						var ifBefore=$('#ifBefore').is(':checked');//是否选中--上游
						
						var searchNode=getFirstNode(dbname,stable,allNodesMap,ifUpcase);//第一层名称查询结果
//						console.log(searchNode);
						//小写处理
						backInfoCheck.push(ifBefore+"-"+ifafter+"-"+ifDirect+"-"+ifUpcase);
						var lastNodeList=[];
						var lastLinkList=[];
						var map = {};
						map['node']=lastNodeList;
						map['link']=lastLinkList;
						if(ifafter){
							var formap1=findChildData(map,searchNode,allNodesMap,allSLinksMap,ifDirect,ifUpcase);
							map['node']=formap1['node'];
							map['link']=formap1['link'];
							//		Array.prototype.push.apply(lastNodeList, formap['node']);
							//		Array.prototype.push.apply(lastLinkList, formap['link']);
						}
						if(ifBefore){//上游
							var formap2=findParentData(map,searchNode,allNodesMap,allTLinksMap,ifDirect,ifUpcase);
							map['node']=formap2['node'];
							map['link']=formap2['link'];
						}
						//如果没有上游信息，则显示本圆圈节点--20180320
						if(ifafter || ifBefore){
							if(map['node'].length == 0){
								var ss=forLastNode(dbname,stable,dataNodes,ifUpcase);
								map['node']=ss;
								map['link']=data.nodes;
							}
						}
						if(!ifafter && !ifBefore){//只查询圆圈信息
//							console.log(dataNodes);
							var ss=forLastNode(dbname,stable,dataNodes,ifUpcase);
							map['node']=ss;
							map['link']=data.nodes;
						}
						loadData(map['node'],map['link']);
					}
				});
			}
	});
}




//右键菜单查询功能
function searchInfo(type){
	var b=$("#btn-backInfo").prop("disabled") ;
	if(b){
		$('#btn-backInfo').removeAttr("disabled");
	}
	var dbtable=$("#dbTableInfo").val();
	var db=dbtable.split(".\n")[0];
	var t=dbtable.split(".\n")[1];
//	console.log(db);
//	console.log(t);
	backInfoDb.push(db);
	backInfoTable.push(t)
//	console.log("backInfoDb----"+backInfoDb.length+"--backInfoTable--"+backInfoTable.length);
	var lastNodeList=[];
	var lastLinkList=[];
	var map = {};
	map['node']=lastNodeList;
	map['link']=lastLinkList;
	var ifDirect=$('#ifCheck').is(':checked');//是否选中--直接节点
	var ifUpcase=$('#ifUpcase').is(':checked');//是否选中--大小写
	var searchNode=getFirstNode(db,t,allNodesMap,ifUpcase);//第一层名称查询结果
	var formap={};
	if(type == '1'){//上游
		formap=findParentData(map,searchNode,allNodesMap,allTLinksMap,ifDirect,ifUpcase);
		map['node']=formap['node'];
		map['link']=formap['link'];
	}else if(type == '2'){//下游
		formap=findChildData(map,searchNode,allNodesMap,allSLinksMap,ifDirect,ifUpcase);
		map['node']=formap['node'];
		map['link']=formap['link'];
	}else if(type == '3'){//全部
		var bmap=findParentData(map,searchNode,allNodesMap,allTLinksMap,false,ifUpcase);
		map['node']=bmap['node'];
		map['link']=bmap['link'];
		var amap=findChildData(map,searchNode,allNodesMap,allSLinksMap,false,ifUpcase);
		map['node']=amap['node'];
		map['link']=amap['link'];
	}else if(type == '4'){//直接节点
		var bmap=findParentData(map,searchNode,allNodesMap,allTLinksMap,true,ifUpcase);
		map['node']=bmap['node'];
		map['link']=bmap['link'];
		var amap=findChildData(map,searchNode,allNodesMap,allSLinksMap,true,ifUpcase);
		map['node']=amap['node'];
		map['link']=amap['link'];
	}
	loadData(map['node'],map['link']);
	//更改现有的查询条件--数据连接，表名，上下游选项
	$('#search_dbConnection').combobox("setText",db);
	$('#search_sourceTables').val(t);
	//TODO 大小写
	if(type == '1'){//上游
//		document.getElementById("ifBefore").checked = true;
//		document.getElementById("ifAfter").checked = false;
//		backInfoCheck.push("true-false-"+ifDirect);
		ToCheck(true,false,ifDirect,ifUpcase);
	}else if(type == '2'){
		ToCheck(false,true,ifDirect,ifUpcase);
	}else if(type == '3'){//全部
		ToCheck(true,true,false,ifUpcase);
	}else if(type == '4'){//直接节点
		ToCheck(true,true,true,ifUpcase);
	}
	document.getElementById("menuuu").style.display = "none";
	
}

function ToCheck(ifBefore,ifAfter,ifCheck,ifUpcase){
	document.getElementById("ifBefore").checked = ifBefore;
	document.getElementById("ifAfter").checked = ifAfter;
	document.getElementById("ifCheck").checked = ifCheck;
	document.getElementById("ifUpcase").checked = ifUpcase;
	backInfoCheck.push(ifBefore+"-"+ifAfter+"-"+ifCheck+"-"+ifUpcase);
}

//返回
$('#btn-backInfo').unbind('click').click(function() {
//	backInfoDb.push(db);
//	backInfoTable.push(t)
//	if(backInfoDb.length == 1){//初次进入
//		alert("当前页面为初始页面，无法返回");
//		$('#btn-backInfo').attr('disabled',"true");
//	} 
	var len=backInfoDb.length;
//	console.log('开始len------'+len);
	var d=backInfoDb[len-2];
	var t=backInfoTable[len-2];
	var c=backInfoCheck[len-2];
//	console.log(d);
//	console.log(t);
//	console.log(c);
	
//	$('#btn-backInfo').attr('disabled',"true");
	if(d == ''){
		$('#search_dbConnection').combobox('setValue','');
	}else{
		$('#search_dbConnection').combobox('setText',d);
	}
	$('#search_sourceTables').val(t);
	var cArr=c.split('-');
	backCheck('ifBefore',cArr[0]);
	backCheck('ifAfter',cArr[1]);
	backCheck('ifCheck',cArr[2]);
	backCheck('ifUpcase',cArr[3]);
	var dbconn=$('#search_dbConnection').combobox("getValue");
	searchData(dbconn,d,t);
	backInfoDb.pop();
	backInfoTable.pop();
	backInfoCheck.pop();
//	console.log('之后len------'+backInfoDb.length);
	if(backInfoDb.length == 1){
		$('#btn-backInfo').attr('disabled',"true");
	}
});

function backCheck(forid,status){
	if(status == 'true'){
		document.getElementById(forid).checked = true;
	}else{
		document.getElementById(forid).checked = false;
	}
}


function showGraphList(){
	
    $.ajax({  
		type: "get",  
		url: "graphInfo/getDatas.action",  
		success: function(data){  
			if(data != null){
				loadData(data.nodes,data.links);
				allNodesMap=data.allNodes;
				allSLinksMap=data.allSLinks;
				allTLinksMap=data.allTLinks;
				dataNodes=data.nodes;
//				console.log(allNodesMap);
//				console.log(allSLinksMap);
//				console.log(allTLinksMap);
//				console.log(data.nodes);
//				console.log(data.links);
//				getFirstNode('HYDW','EMP',allNodesMap)
//				var firstArray = [1,2,3];  
//				var secondArray = [4,5,6];  
//				Array.prototype.push.apply(secondArray, firstArray);  
//				console.log(secondArray);  
			}
		}  
	});  
}

//填充信息
function loadData(fornodes,forlinks){
	//初始化echarts实例
	var myChart = echarts.init(document.getElementById('main'));
	myChart.clear();
	// 指定图表的配置项和数据
	var option = {
			title: { text: '' },
			tooltip: {//设置鼠标移动到人物处显示人物简介tooltip
				formatter: function (x) {
					//console.log(x.name);
					return x.data.des;
				},
				textStyle:{//提示框浮层的文本样式
					//color:'red'
				}
				//backgroundColor:'blue'
			},
			series: [//series[i]-graph.
			         {
			        	 type: 'graph',
			        	 layout: 'force',
			        	 focusNodeAdjacency: true,
			        	 //none:不采用任何布局，使用节点中提供的 x， y 作为节点的位置
			        	 //'circular' 采用环形布局。
			        	 //'force' 采用力引导布局。
//			        	 edgeSymbol:['roundRect', 'arrow'],
			        	 symbolSize: [100,60],//圆圈大小
			        	 roam: true,
			        	 edgeSymbol: ['circle', 'arrow'],//边两端的标记类型，显示为圆和箭头circle
			        	 edgeSymbolSize: [4, 10],//边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定。
			        	 force: {
			        		 repulsion: 600,//节点之间的斥力因子。
			        		 // edgeLength: [10, 50],// 值最大的边长度会趋向于 10，值最小的边长度会趋向于 50
			        		 edgeLength: 200 // 默认距离,两个圆圈之间的距离，即线的长度
			        		 // repulsion: 5 //斥力
			        		 //layoutAnimation :true//默认为true，是否关闭迭代时的动画效果
			        	 },
			        	 
			        	 draggable: true,//节点是否可拖拽
			        	 itemStyle: {
			        		 normal: {
			        			 color: 'blue',//整体圆圈颜色
			        			 opacity: 0.5//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
			        		 }
			        	 },
			        	 lineStyle: {
			        		 normal: {
			        			 width: 2,//线宽
			        			 color: 'source',//整体线的颜色，支持设置为'source'或者'target'特殊值，此时边会自动取源节点或目标节点的颜色作为自己的颜色。
			        			 opacity: 0.5,//线透明度
			        			 curveness: 0//边的曲度，支持从 0 到 1 的值，值越大曲度越大。
			        		 }
			        	 },
			        	 edgeLabel: {
			        		 normal: {
			        			 show: true,
			        			 formatter: function (x) {
			        				 return x.data.name;
			        			 }
			        		 }
			        	 },
			        	 label: {//图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等
			        		 normal: {
			        			 show: true,//是否显示标签。
			        			 textStyle: {
			        				 color:'#000000', //auto
			        				 width :'100%'
			        			 }
			        		 }
			        	 },
			        	 nodes: fornodes,
			        	 links: forlinks 
			         } ]            
	} 
	
	//去除默认的鼠标事件
	var tree = document.getElementById("main");
	tree.oncontextmenu = function() { return false; };
	
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option, true); 
	myChart.on('dblclick',function(param){
		var cloudid=param.data.value;
//		console.log(param.data);
		
		if (typeof cloudid != 'undefined') {
			foropen(param.data);
		} 
	});
	
	myChart.on('contextmenu',function(param){
//		console.log('p==============',param);
		var menu = document.getElementById("menuuu");
		var event = param.event;
		menu.style.left = event.offsetX+ 'px';
		menu.style.top = event.offsetY + 20 + 'px';
		menu.style.display = "block";
//		console.log(param.name);
		$("#dbTableInfo").val(param.name);
	});
	
}

//弹出信息
function foropen(data){
	$("#testInfo").window({
		onMaximize:function() {
			$('#data-list').datagrid('resize', {
				width : $("#width_title").width() + 25
//				height : $(window).height() - 125
			});
        },
        onRestore:function(){
        	$('#data-list').datagrid('resize', {
				width : 895
			});
        }
    });
//	console.log(data)
//	$('#testInfo').window({left:"850px", top:"100px"});
	$('#testInfo').window('open');
	$("#fromResultE").trigger("click");
	$(".validatebox-tip").remove();
	$(".validatebox-invalid").removeClass("validatebox-invalid");
	var bothInfo=data.name;
	$("#bothInfo").val(bothInfo);
	var db=bothInfo.split(".\n")[0];
	var t=bothInfo.split(".\n")[1];
	clickDb=db;
	clickTable=t;
	$("#fordbName").val(db);
	$("#fortableName").val(t);
//	$('#fordbName').attr("disabled", "disabled");
//	$('#fortableName').attr("disabled", "disabled");
	var sid;
	if(db == data.sConnName){
		sid=data.sConnId;
	}else{
		sid=data.tConnId;
	}
	var ifUpcase=$('#ifUpcase').is(':checked');
	//查询血缘关系datagrid信息
	var surl = "graphInfo/taskDataList.action?sourceConnection="+sid+"&sourceTables=" + t+"&ifUpcase=" + ifUpcase;
	showdataGrid(surl);
}

function cancelEInfo(){
	$('#testInfo').window('close');
}

function showdataGrid(url) {
	$('#data-list').datagrid(
			{
				title : '血缘关系信息',
				url : url,
				idField : 'taskId',
				pagination : false, // 分页
				rownumbers : true, // 行号
				singleSelect : true,// 单选
				checkOnSelect : true,
				autoRowHeight : false,// 是否设置基于该行内容的行高度
				remoteSort : false,
				striped : true,// 奇偶行显示不同背景色
				fitColumns : true,// 自动扩大或缩小列的尺寸以适应网格的宽度并且防止水平滚动。
				pageSize : 30,// 每页显示的记录条数
//				resizable :true,//允许该列可调整尺寸
//				resizable :true,//允许该列可调整尺寸
				pageList : [ 10, 30, 50, 100 ],
				columns : [ [
						{
							field : 'taskId',
							hidden : true
						},
						{
							field : 'srcConnName',
							title : '源数据连接',
							width : 150,
							sortable : true,
							formatter : function(value, row, index) {
								if((row.srcConnName == clickDb) &&(row.sourceTables == clickTable) ){
									return '<strong style="color:blue">'+row.srcConnName+'</strong>';
								}else{
									return row.srcConnName;
								}
							}
						},
						{
							field : 'sourceTables',
							title : '源表',
							width : 200,
							sortable : true,
							formatter : function(value, row, index) {
								if((row.srcConnName == clickDb) &&(row.sourceTables == clickTable) ){
									return '<strong style="color: blue">'+row.sourceTables+'</strong>';
								}else{
									return row.sourceTables;
								}
							}
						},
						{
							field : 'tarConnName',
							title : '目标数据连接',
							width : 150,
							sortable : true,
							formatter : function(value, row, index) {
								if((row.tarConnName == clickDb) &&(row.targetTable == clickTable) ){
									return '<strong style="color: blue">'+row.tarConnName+'</strong>';
								}else{
									return row.tarConnName;
								}
							}
						},
						{
							field : 'targetTable',
							title : '目标表',
							width : 200,
							sortable : true,
							formatter : function(value, row, index) {
								if((row.tarConnName == clickDb) &&(row.targetTable == clickTable) ){
									return '<strong style="color: blue">'+row.targetTable+'</strong>';
								}else{
									return row.targetTable;
								}
							}
						},
						{
							field : 'taskNo',
							title : '任务编号',
							width : 80,
							sortable : true
						}, {
							field : 'taskName',
							title : '任务名称',
							width : 120,
							sortable : true
						}
						] ]
			});
}

