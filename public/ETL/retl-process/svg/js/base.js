var graphic;
var localtion_base_x =100;
var localtion_base_y =100;
$(document).ready(function() {

	$('body').css("opacity", "1");		
	var headerH = 0;//头部标签高度
	var bottomH = 40;
	var leftW = 45;  //左侧宽度 + nodelist




	//图表区域初始化、xml解析
	var svg = d3.select('#svgbox').append('svg')
				.attr('class','s-svg');
	var edges = [], nodes = [];
	var xmlDoc;
	var jobXml = '';

	var jobName = GetQueryString("jobName");    // 新建作业时传递----通过url获取jobName的值
	var jobId = GetQueryString("jobId"); // 编辑作业时传递----通过url获取jobId的值
	var logShow = false;
    var logout = function(cbfunc) {
        var api_name = "kingdom.retl.set_sys_logout";
        var api_version = "v4.0";
        var api_params = {
            "loginName": sessionStorage.getItem("loginName")
        };
        var $this = this;
        var param = $.kingdom.getAjaxParams(api_name, api_version, api_params);
        var url = "/admin_api";
        url = "/retl/rest/admin/" + $.trim(api_version) + "/" + $.trim(api_name) + ".json";
        $.ajax({
            type: "get",
            url: url,
            dataType: 'json',
            data: param,
            async: false,
            beforeSend: function(request) {
                request.setRequestHeader("X-Kweb-Menu-Id", "id1122333");
                request.setRequestHeader("X-Kweb-Op-Id", "op_id1122333");
                request.setRequestHeader("X-Kweb-Req-Trace-Id", "rt1122333");
                request.setRequestHeader("X-Kweb-Location-Href", document.location.href);

                request.setRequestHeader("X-Kweb-Timestamp", new Date().getTime() + "");
                request.setRequestHeader("X-Kweb-Sign", $.md5(document.location.href));

                request.setRequestHeader("X-Kweb-Api-Name", $.trim(api_name));
                request.setRequestHeader("X-Kweb-Api-Version", $.trim(api_version));
                request.setRequestHeader("X-Kweb-Api-Async", false);
            },
        }).done(function(data) {

            if (data && data.bcjson && data.bcjson.flag) {
                var flag = data.bcjson.flag;
                if (flag == "0" && console) {
                }
            }

            if (typeof data != "object") {
                data = eval("(" + data + ")")
            }
            if (cbfunc && data) {
                if (data.bcjson) {
                    var flag = data.bcjson.flag;
                } else {
                    return false;
                }

                if (flag != "0" && flag != "1") {
                    logout(function() {
                        document.location.href = "/login.html";
                    });
                    return false;
                }
            }
        });
    }; //logout
	var get16 = function(a, v, p) {
	    var pp = {};
	    var _t = new Date().getTime() + "";
	    var _p = JSON.stringify(p);
	    pp._0x0111 = $.base64.encode(_t);
	    pp._0x1011 = $.base64.encode(a);
	    pp._0x1100 = $.base64.encode(v);
	    pp._0x1110 = $.base64.encode(encodeURIComponent(_p));
	    pp._0x1001 = $.md5(pp._0x0111 + pp._0x1011 + pp._0x1100 + pp._0x1110).toUpperCase()
	    pp._0x1101 = $.base64.encode(document.location.href);
	    return pp;
	} //get16
	var getK = function(a, v, p) { //_params.._version .. _timestamp .. _api_name
	    var pp = {};
	    var _t = new Date().getTime() + "";
	    var _p = JSON.stringify(p);
	    pp.KInGDOM = $.base64.encode(_t);
	    pp.KINGdOM = $.base64.encode(a);
	    pp.KINGDoM = $.base64.encode(v);
	    pp.KiNGDOM = $.base64.encode(encodeURIComponent(_p));
	    pp.kINGDOM = $.md5(pp.KiNGDOM + pp.KINGDoM + pp.KInGDOM + pp.KINGdOM).toUpperCase()
	    pp.KINgDOM = $.base64.encode(document.location.href);
	    pp.KINGDOm = $.base64.encode(document.location.protocol);
	    return pp;
	} //getK
	var getL = function(a, v, p) {
	    var pp = {};
	    var _t = new Date().getTime() + "";
	    var _p = JSON.stringify(p);
	    pp.css = $.base64.encode(_t);
	    pp.android = $.base64.encode(a);
	    pp.html = $.base64.encode(v);
	    pp.ios = $.base64.encode(encodeURIComponent(_p));
	    pp.js = $.md5(pp.ios + pp.android + pp.css + pp.html).toUpperCase()
	    pp.wp = $.base64.encode(document.location.href);
	    return pp;
	} //getL
	var getAjaxParams = function(a, v, p) {
	    var test_param = {};
	    // test_param.a = a;
	    //  test_param.v = v;
	    test_param.p = JSON.stringify(p);
	    test_param._ts = new Date().getTime();
	    //  test_param.href = document.location.href;
	    return test_param;
	    
	} //getAjaxParams
	var kd = {
		menus : [],
		generateTreeData: function(id, arry, name, attrName) {
            var childArry = this.getChildArry(id, arry, name);
            if (childArry.length > 0) {
                this.menus += ',"children":[';
                for (var i in childArry) {
                    this.menus += `{"id":"${childArry[i][attrName]}","text":"${childArry[i][name].replace(id,'')}"`;
                    this.generateTreeData(childArry[i][name] + "/", arry, name, attrName);
                    this.menus += '},';
                }
                this.menus += ']';
                return this.menus;
            }
        },
        // 根据 id 获取下级菜单
        // id：判断是否有下级菜单的标识
        // arry：菜单数组信息
        getChildArry: function(id, arry, name) {
            var newArry = new Array(); // 用来存放子菜单
            for (var i in arry) {
                if (arry[i][name].replace(id, "").indexOf("/") === -1 && arry[i][name].indexOf(id) !== -1) {
                    newArry.push(arry[i]);
                }
            }
            return newArry;
        },
	};
	// 查询作业菜单
    (function getWorkTree() {
    	$.kingdom.doKoauthAdminAPI("kingdom.retl.get_folder_menu", "v4.0", {
            fileType: "1", 
        }, function(data) {
            if (data.bcjson.flag == "1") {
                var menus = kd.generateTreeData("", data.bcjson.items, "foldName", "folderId");
                menus = menus.replace(',"children":', '').replace(/},]/g, "}]");
                $('#folderId_input').combotree({ data: JSON.parse(menus),
                });
            }
        });
    })();
    
	// 新增/编辑作业时传递
	if(jobId){
	    $.kingdom.doKoauthAdminAPI("kingdom.retl.get_job_info", "v4.0" , { 
			job_id: jobId
		}, function(data) {
		
      		if(data.bcjson.flag === "1") {
      			jobXml = data.bcjson.items[0].xmlMsg;
      			if(jobXml == '') {
					xmlDoc = null;
				}else{
					xmlDoc = jobXml;
				}
				var jobNo = data.bcjson.items[0].jobNo;
				graphic = new Graphic(svg,xmlDoc);
				graphic.jobNo = jobNo;
				graphic.update();
				graphic.commands();
      		} else {
         		alert(data.bcjson.msg);
         	}
        });
	    //}
	} else {
		graphic = new Graphic(svg,xmlDoc);
		var startNode = {
				id:graphic.getNodeId(),
				name:'START',
				type:'S',
				title:'START',
				item_id:'',
				isAdd: false,
				x:150,
				y:300
		};
		graphic.nodes.push(startNode);   
		graphic.update();
		
		graphic.commands();
		if(jobName){
			graphic.name = jobName;
		}
	}

	//节点类型调取事件
	$('#menu_nodeType>li').click(function(){
		var types = $(this).attr('type');
		$.ajax({
		    url:'job/moduleList.action?type=' + types,
		    type:'GET', 
		    timeout:5000,    //超时时间
		    dataType:'json', 
		    success:function(data,textStatus,jqXHR){
		    	initNodeType(data,types);
		    },
		    error:function(xhr,textStatus){
		        console.log('读取错误')
		    }
		})
	});
	function initNodeType(data,types){
		var temp_html = $('#temp_nodeList_drag').html();
        var temp_list = '';
        for(var i=0; i<data.length; i++){
        	temp_list += temp_html.temp(data[i]);
        }
        $('#nodeList_drag').html(temp_list);
        //绑定拖拽事件
	}
	
	//初始化拖拽节点
	$('#menu_nodeType>li').eq(0).trigger('click');


	
//添加节点拖拽功能
	var drag_domnode = null;  // 被拖拽的当前dom节点
////拖拽添加节点
	
$("#nodeType").combobox({    
	valueField: 'id',
    textField: 'text',
	data: [{
        "id": "S",
        "selected":true,
        "text":"结果为真执行下一步"
    },{
        "id": "F",
        "text":"结果为假执行下一步"
    },{
        "id": "N",
        "text":"无条件执行下一步",
    }]
});
	
//----------------- 导入功能- start wangfy-------------------
//工具栏-导入功能
	$('#t-import').click(function(){
		$('#importTasks').window({
            minimizable: false,
        }).window("open");
		showTree();
		showTableList();
		$("#importTasks").parent().css("top","0px");
	});
});
//查询任务树信息--任务名称
function doSearch(value){
	value = encodeURI(value);
	value = encodeURI(value);
	// var surl = "task/treeList3.action?id=NULL&taskName="+value;
	showTree();
}

//批量导入
$('#saveInfo').click(function(){
	//获取右侧datagrid的值
	var dlist=$('#table-list').datagrid('getData');
	if(dlist != null && dlist.rows.length >0){
		//TODO 节点连线类型    S-成功  F- 失败  N-无条件  D-无连线
		var hopType=$("#nodeType").combobox("getValue");
		var addNodes = [];//将导入的node生成node对象放入这个数组
		var x_loc = localtion_base_x;
		var _array = [];
		var job_moduleObj = {};
		var job_module = JSON.parse(sessionStorage.getItem("job_module"));
		for (let item of job_module) {
			job_moduleObj[item.title] = item.type;
		}
		for(var i=0;i<dlist.rows.length;i++){
			var type=job_moduleObj[dlist.rows[i].taskTypeName];
			var title=dlist.rows[i].taskTypeName;
			var taskNo=dlist.rows[i].taskNo;
			var item_id = dlist.rows[i].taskId;
			var item_name = dlist.rows[i].taskName;
			if ($.inArray(item_id, _array) != -1) { // 去重
				item_id += '2';
			}
			_array.push(item_id);
			var newNode = {
				id:graphic.getNodeId(),
				type:type,
				title:title,
				name:graphic.getImportTaskName(title) + i,
				item_id:item_id,
				item_name:item_name,
				x:x_loc,
				y:localtion_base_y,
			};
			addNodes.push(newNode);
			x_loc +=110;
		}
//		console.log(x_loc)
		if(x_loc > graphic.canvas._w){
			graphic.canvas._w = x_loc + 50;
		}
		graphic.getImportTaskHop(addNodes,hopType);
		graphic.nodes = $.merge(graphic.nodes, addNodes);
		graphic.update();
		graphic.selectNodesStyle(addNodes);
		graphic.commands();
//		graphic.reappearXmlDoc();
		graphic.initCanvas();
//		graphic.update()
		$('#importTasks').window('close');
	}else{
		$.messager.alert('提示', "请选择待导入任务信息！", 'waring');
	}
});

//取消操作
$('#cancelInfo').click(function(){
	$.messager.confirm('确认提示', '您确定要关闭窗口吗？', function(r) {
		if (r) {
			$('#importTasks').window('close');
			 $('#tt>ul').tree('loadData', { total: 0, rows: [] }); 
			 $('#table-list').datagrid('loadData', { total: 0, rows: [] }); 
		}
	});
});


//加载任务树信息
function showTree() {
        $.kingdom.doKoauthAdminAPI("kingdom.retl.get_folder_menu", "v4.0", {
            fileType: "2", // 1 作业, 2 任务
        }, data => {
            if (data.bcjson.flag == "1") {
                let items = data.bcjson.items;
                let html = new $.kingdom.generateTreeData().init("", items, "foldName", "folderId");
                $("#tt").html(html);
                $("#tt>ul").tree({
                    onlyLeafCheck: false,//仅叶子节点可以被选中
                	checkbox: true,//开启多选框
	            	onClick: function(node) {
	            		if (node.attributes && node.attributes.hasOwnProperty("taskNo")) return;
	            		if (node.children) {
	            			var cnode = node.children[node.children.length - 1];
	            			if (cnode.attributes && cnode.attributes.hasOwnProperty("taskNo")) return;
	            			getTask({ folderId: node.id });
	            		} else {
							getTask({ folderId: node.id });
	            		}
					}
                });
            }
        })
}

function getTask(params) {
	$.kingdom.doKoauthAdminAPI("kingdom.retl.get_task_info", "v4.0", params, data => {
        if (data.bcjson.flag == "1") {
        	var items = data.bcjson.items;
        	var selected = $('#tt>ul').tree('getSelected');
			$('#tt>ul').tree('append', {
				parent: selected.target,
				data: items.map(function(item, i) {
					return { 
						text: item.taskName,
						attributes: {
							taskNo: item.taskNo,
							taskId: item.taskId,
							taskName: item.taskName,
							taskType: item.taskType,
							folderName: item.folderName,
							taskTypeName: item.taskTypeName
						},
					}
				})
			});
        }
    })
}

/*
 * 获取应用根路径 @return {TypeName}
 */
function getContextPath() {
	var pathname = location.pathname;
	return pathname.substr(0, pathname.indexOf('/', 1));
}
//右移数据
function moveRight(){
	//获取原有功能
	//获取选中的信息
	showTableList();
	var tname=$("#tt>ul").tree('getChecked');
	//获取右侧datagrid现有值
	var dlist=$('#table-list').datagrid('getData');
	var exist=0;
	for(var i=0;i<tname.length;i++){
		exist=0;
		if (!tname[i].hasOwnProperty("attributes")) {
			continue;
		}
		var otherName=tname[i].attributes.taskName
		var otherNo=tname[i].attributes.taskNo
		if(dlist.rows.length >0){
			for(var k=0;k<dlist.rows.length;k++){//判断数据是否已在右侧存在
				if((dlist.rows[k].taskName==otherName && dlist.rows[k].taskNo==otherNo) || dlist.rows[k].taskName==tname[i].text){
					exist=1;
					break;
				}
			}
		}
		if(exist == 0){
			var taskType = tname[i].attributes.taskType;
			if(taskType != undefined && taskType != '7'){
				$('#table-list').datagrid('appendRow',{
					taskId : tname[i].attributes.taskId,
//					taskNOName: tname[i].text,
					// taskNo: tname[i].attributes.taskNo,
					taskName: tname[i].attributes.taskName,
					taskType: taskType,
					folderName: tname[i].attributes.folderName,
					taskTypeName: tname[i].attributes.taskTypeName
				});
			}/*else{
				$.messager.alert('提示', "【"+tname[i].text+"】为文件夹", 'waring');
			}*/
			
		}
	}
	$('#table-list').datagrid('enableDnd');
}
//左移数据
function moveLeft(){
	var rows=$("#table-list").datagrid('getSelections');
	var len=rows.length;
	if (rows) {
		for(var i=0;i<len;i++){
			var row=$("#table-list").datagrid('getSelected');
			var rowIndex = $('#table-list').datagrid('getRowIndex', row);
			$('#table-list').datagrid('deleteRow', rowIndex);
			 var rows = $('#table-list').datagrid("getRows");
			  $('#table-list').datagrid("loadData", rows);
		}
	 }
}
//右侧数据表显示
function showTableList(){
	$('#table-list').datagrid({
        url: '',
        rownumbers: true,
        singleSelect: false,
        pagination: false,//分页
        idField:'taskId',
        checkOnSelect:true,
        remoteSort : false,
		columns : [ [ {
			field : 'taskId',
			hidden : true,
			formatter:function(value, row, index) {
				return '<span title=' + value + '>' + value + '</span>';
			}
		},{
			field : 'folderName',
			title : '所属文件夹',
			width : '25%',
			sortable : true,
			formatter:function(value, row, index) {
				return '<span title=' + value + '>' + value + '</span>';
			}
		},{
			field : 'taskName',
			title : '任务名称',
			width : '25%',
			sortable : true,
			formatter:function(value, row, index) {
				return '<span title=' + value + '>' + value + '</span>';
			}
		},{
			field : 'taskTypeName',
			title : '任务类型',
			width : '25%',
			sortable : true,
		}] ],
		onLoadSuccess:function(){
			$(this).datagrid('enableDnd');
		}
     })
}

//----------------- 导入功能- end-------------------
function getXmlDoc(text){
	var xmlDoc;
	try //Internet Explorer
	  {
	  	xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	  	xmlDoc.async="false";
 		xmlDoc.loadXML(text);
	  }
	catch(e)
	  {
	    try //Firefox, Mozilla, Opera, etc.
		    {
		    	var parser =new DOMParser();
   				xmlDoc=parser.parseFromString(text,"text/xml");
		    }
	    catch(e) {alert(e.message)}
	  }
	return xmlDoc;
}

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


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
//string方法扩展、用于组装html片段
String.prototype.temp = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
        var returns = obj[matchs.replace(/\$/g, "")];		
        return (returns + "") == "undefined"? "": returns;
    });
};


    