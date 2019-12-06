//导出信息
function exportInfo() {
	var tchecks=$('#tt').datagrid('getChecked'); //获取选中的任务编号
	var checkNo=null;
	var checkType=null;
	var checkName=null;
	var checktName=null;
	var checkColumnId=null;
	if (tchecks.length == 0) {
		Peony.alert('警告', '未选择记录.', 'warning');
	}else{
		for(var i=0;i<tchecks.length;i++){
			if(i==0){
				checkNo=tchecks[0].objectId;
				checkType=tchecks[0].objectType;
				checkName=tchecks[0].objectName;
				checktName=tchecks[0].tableName;
				checkColumnId=tchecks[0].columnId;
			}else{
				checkNo=checkNo+","+tchecks[i].objectId;
				checkType=checkType+","+tchecks[i].objectType;
				checkName=checkName+","+tchecks[i].objectName;
				checktName=checktName+","+tchecks[i].tableName;
				checkColumnId=checkColumnId+","+tchecks[i].columnId;
			}
		}
		checkName = encodeURI(checkName);
		checkName = encodeURI(checkName);
		var data = {};
		data.checkNo=checkNo;
		data.checkType=checkType;
		data.checkName=checkName;
		data.checktName=checktName;
		data.checkColumnId=checkColumnId;
//		window.location.href = 'allObjects/exportXML.action?checkNo='+checkNo+"&checkType="+checkType
//			+"&checkName="+checkName+"&checktName="+checktName+"&checkColumnId="+checkColumnId;
		$.ajax('allObjects/exportXMLURL.action', {
			type : 'post',
			dataType : 'json',
			data : data,
			success : function(result) {
				if(result){
					window.location.href = 'allObjects/exportXML.action';
				}
			}
		});
		
	}
};

//查询信息
$('#btn-search').unbind('click').click(function() {
	var objectName=$('#search_objectName').val();
	var objectType=$('#search_objectType').combobox("getValue");
	var bStartTime = $('#bStartTime').datetimebox('getValue');
	var bEndTime = $('#bEndTime').datetimebox('getValue');
//	var surl="allObjects/dataList2.action?objectName="+objectName+"&objectType="+objectType+"&bStartTime="+bStartTime+"&bEndTime="+bEndTime;
//	surl = surl+"&random="+Math.random();//在这里。用encodeURI进行两次转码。后台Action接收的时候。在进行一次。就不会出现乱码问题
//	surl = encodeURI(surl);
//	surl = encodeURI(surl);
//	showdata(surl);
	//获取分页参数
	var psize =$('#tt').datagrid('getPager').data("pagination").options.pageSize;
	//改为AJAX传参
	var data = {};
	data.objectName=objectName;
	data.objectType=objectType;
	data.bStartTime=bStartTime;
	data.bEndTime=bEndTime;
	data.psize=psize;
	$.ajax('allObjects/dataList2.action', {
		type : 'post',
		dataType : 'json',
		data : data,
		success : function(data) {
			$('#tt').datagrid('loadData', { total: 0, rows: [] }); 
			$('#tt').datagrid('loadData', eval(data));
		}
	});
});

//查询现有信息
function loadInfo(){
	/**获取昨天的时期--用于设置默认日期 start*/
//	 var d = new Date();
//	 var d1 = new Date();
//	     d1.setTime(d1.getTime()-30*24*60*60*1000);//昨天，如果变成+则为明天
//	 	 d.setTime(d.getTime());
//	 var s1 = d1.getFullYear()+"-" + (d1.getMonth()+1) + "-" + d1.getDate();
//	 var s = d.getFullYear()+"-" + (d.getMonth()+1) + "-" + d.getDate();
//	 /**获取昨天的时期--用于设置默认日期 end*/
//	 $('#bStartTime,#bEndTime').datetimebox({    
//		 showSeconds:true
//	});  
//	 $('#bStartTime').datetimebox('setValue', s1);
//	 $('#bEndTime').datetimebox('setValue', s);
	var surl="allObjects/dataList.action";
	showdata(surl);
}
//展示待选择对象信息
function showdata(url){
	$('#tt').datagrid({
        url: url,
        rownumbers: true,
        singleSelect: false,
        pagination: true,//分页控件
        pageSize: 100,//每页显示的记录条数，默认为100
	    pageList: [50,100,500],  
        fitColumns: true,
        striped : true,//奇偶行显示不同背景色
        remoteSort : false,//前端排序
		columns : [ [  {
			field : 'tableName',
			hidden : true
		},{
			field : 'columnId',
			hidden : true
		},{
			title : '序号',
			field : 'objectId',
			checkbox : true
		},{
			field : 'objectType',
			hidden : true
		}, {
			field : 'objectTypeName',
			title : '对象类型',
			width : 120,
			sortable : true
		},{
			field : 'objectName',
			title : '对象名称',
			width : 140,
			sortable : true
		},{
			field : 'modifiedTime',
			title : '对象时间',
			width : 140,
			sortable : true
		}
		] ],
		 onClickRow:function(index,row){ //单击行事件  
	         //---------for TEST 结合SHIFT,CTRL,ALT键实现单选或多选------------  
	         if(index != selectIndexs.firstSelectRowIndex && !inputFlags.isShiftDown1 ){    
	             selectIndexs.firstSelectRowIndex = index; //alert('firstSelectRowIndex, sfhit = ' + index);  
	         }             
	         if(inputFlags.isShiftDown1 ) {  
	             $('#tt').datagrid('clearSelections');  
	             selectIndexs.lastSelectRowIndex = index;  
	             var tempIndex = 0;  
	             if(selectIndexs.firstSelectRowIndex > selectIndexs.lastSelectRowIndex ){  
	                 tempIndex = selectIndexs.firstSelectRowIndex;  
	                 selectIndexs.firstSelectRowIndex = selectIndexs.lastSelectRowIndex;  
	                 selectIndexs.lastSelectRowIndex = tempIndex;  
	             }  
	             for(var i = selectIndexs.firstSelectRowIndex ; i <= selectIndexs.lastSelectRowIndex ; i++){  
	                 $('#tt').datagrid('selectRow', i);     
	             }     
	         }             
	         //---------for TEST 结合SHIFT,CTRL,ALT键实现单选或多选------------  
	     }
     })
}

/**---------------鼠标事件------------***/
var KEY = { SHIFT:16, CTRL:17, ALT:18, DOWN:40, RIGHT:39, UP:38, LEFT:37};    
var selectIndexs = {firstSelectRowIndex:0, lastSelectRowIndex:0};  
var inputFlags = {isShiftDown1:false, isCtrlDown1:false, isAltDown:false}  
  
function keyPress(event){//响应键盘按下事件  
    var e = event || window.event;    
    var code = e.keyCode | e.which | e.charCode;        
    switch(code) {    
        case KEY.SHIFT:    
        inputFlags.isShiftDown1 = true;  
        $('#tt').datagrid('options').singleSelect = false;             
        break;  
    case KEY.CTRL:  
        inputFlags.isCtrlDown1 = true;  
        $('#tt').datagrid('options').singleSelect = false;             
        break;  
    default:          
    }  
}  
function keyRelease(event) { //响应键盘按键放开的事件  
    var e = event || window.event;    
    var code = e.keyCode | e.which | e.charCode;        
    switch(code) {    
        case KEY.SHIFT:   
        inputFlags.isShiftDown1 = false;  
        selectIndexs.firstSelectRowIndex = 0;  
        $('#tt').datagrid('options').singleSelect = true;              
        break;  
    case KEY.CTRL:  
        inputFlags.isCtrlDown1 = false;  
        selectIndexs.firstSelectRowIndex = 0;  
        $('#tt').datagrid('options').singleSelect = true;  
        break;  
    default:          
    }  
}  

