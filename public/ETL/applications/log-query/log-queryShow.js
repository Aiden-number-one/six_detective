var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};define(function(require,exports,module){require("assets/js/global/tableTree"),require("assets/plugins/fullcalendar/fullcalendar.min.js");var j={};function F(e,t){var a;return"B"===t?a="#ed6b75":"R"===t?a="#659be0":"S"===t?a="#3fc9d5":"F"===t?a="#F1C40F":"N"===t&&(a="#bac3d0"),'<span style="color:'+a+'">'+e+"</span>"}function T(e,t,a){return'<span style="margin-right: 10px;" title=\''+e+"' >"+e+("F,B".includes(t)?"<i class='fa fa-info-circle' title='"+a.substring(0,100)+"'></i>":"")+"</span>"}function D(e){return'<span class="execute-error-msg" msg=\''+e.replace(/\'/g,'"')+'\' style="color:#3fc9d5;cursor:pointer;">'+e.substring(0,100)+"</span>"}function r(S){var e=!0,t=!1,a=void 0;try{function r(){var a=I.value;if(!a.parentMonitorId){var o=[{id:a.monitorId,pId:"-1",columns:{"Task Sequence No.":a.orderNo,Node:{formatter:function(){return T(a.nodeName,a.executeFlag,a.executeMsg)}},"Task Name":a.jobname,"Task Type":a.memberTypeName,"Delete Count":a.deleteNum,"Insert Count":a.insertNum,"Start Time":$.kingdom.toDateTime(a.startTime),Duration:$.kingdom.formatMillisecond(a.zxsj),"Execution Status":{formatter:function(){return F(a.executeFlagName,a.executeFlag)}},"Execution Info.(Click to view all Info.)":{formatter:function(){return D(a.executeMsg)}}},children:[]}],e=!0,t=!1,r=void 0;try{function n(){var e=i.value;if(e.parentMonitorId===a.monitorId){var t={id:e.monitorId,pId:e.parentMonitorId,attr:{obj:JSON.stringify(e)},columns:{"Task Sequence No.":e.orderNo,Node:{formatter:function(){return T(e.nodeName,e.executeFlag,e.executeMsg)}},"Task Name":e.jobname,"Task Type":e.memberTypeName,"Delete Count":e.deleteNum,"Insert Count":e.successNum,"Start Time":$.kingdom.toDateTime(e.startTime),Duration:$.kingdom.formatMillisecond(e.zxsj),"Execution Status":{formatter:function(){return F(e.executeFlagName,e.executeFlag)}},"Execution Info.(Click to view all Info.)":{formatter:function(){return D(e.executeMsg)}}},children:[]};o[0].children.push(t)}}for(var i,l=S[Symbol.iterator]();!(e=(i=l.next()).done);e=!0)n()}catch(e){t=!0,r=e}finally{try{!e&&l.return&&l.return()}finally{if(t)throw r}}for(var c=o[0].children,s=0,u=c.length;s<u;s++){var d=!0,m=!1,g=void 0;try{function f(){var e=h.value;if(e.parentMonitorId===c[s].id){var t={id:e.monitorId,pId:e.parentMonitorId,attr:{obj:JSON.stringify(e)},columns:{"Task Sequence No.":e.orderNo,Node:{formatter:function(){return T(e.nodeName,e.executeFlag,e.executeMsg)}},"Task Name":e.jobname,"Task Type":e.memberTypeName,"Delete Count":e.deleteNum,"Insert Count":e.successNum,"Start Time":$.kingdom.toDateTime(e.startTime),Duration:$.kingdom.formatMillisecond(e.zxsj),"Execution Status":{formatter:function(){return F(e.executeFlagName,e.executeFlag)}},"Execution Info.(Click to view all Info.)":{formatter:function(){return D(e.executeMsg)}}},children:[]};o[0].children[s].children.push(t)}}for(var h,b=S[Symbol.iterator]();!(d=(h=b.next()).done);d=!0)f()}catch(e){m=!0,g=e}finally{try{!d&&b.return&&b.return()}finally{if(m)throw g}}var p=o[0].children[s].children,v=!0,y=!1,x=void 0;try{function _(){for(var e=N.value,t=0,a=p.length;t<a;t++)if(e.parentMonitorId===p[t].id){var r={id:e.monitorId,pId:e.parentMonitorId,attr:{obj:JSON.stringify(e)},columns:{"Task Sequence No.":e.orderNo,Node:{formatter:function(){return T(e.nodeName,e.executeFlag,e.executeMsg)}},"Task Name":e.jobname,"Task Type":e.memberTypeName,"Delete Count":e.deleteNum,"Insert Count":e.successNum,"Start Time":$.kingdom.toDateTime(e.startTime),Duration:$.kingdom.formatMillisecond(e.zxsj),"Execution Status":{formatter:function(){return F(e.executeFlagName,e.executeFlag)}},"Execution Info.(Click to view all Info.)":{formatter:function(){return D(e.executeMsg)}}},children:[]};o[0].children[s].children[t].children.push(r)}}for(var N,k=S[Symbol.iterator]();!(v=(N=k.next()).done);v=!0)_()}catch(e){y=!0,x=e}finally{try{!v&&k.return&&k.return()}finally{if(y)throw x}}}return{v:o}}}for(var I,o=S[Symbol.iterator]();!(e=(I=o.next()).done);e=!0){var n=r();if("object"===(void 0===n?"undefined":_typeof(n)))return n.v}}catch(e){t=!0,a=e}finally{try{!e&&o.return&&o.return()}finally{if(t)throw a}}}saveJobid="",saveBatchNo="",j._load=function(){App.initUniform(),App.handleDatePickers(),App.handleDateTimePickers();var e=$("#local-data").data("params");e?(j.getWorkChart2(e),$("#local-data").data("params","")):j.getWorkChart({});var t=sessionStorage.getItem("isJump");$("#header_notification_bar").mouseout(),t?($("#Id-statistics-cat a:nth-child(2)").click().find("label").addClass("active"),$("#Id-statistics-cat a:nth-child(2)").siblings().find("label").removeClass("active"),$("#lg-tab_0-2 .collapse-control").click(),sessionStorage.setItem("isJump",""),$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_sys_current_date","v4.0",{},function(e){if("1"===e.bcjson.flag&&e.bcjson.items[0]){var t=e.bcjson.items[0].currentDate.substring(0,8),a=t.substring(0,4)+"-"+t.substring(4,6)+"-"+t.substring(6,8);$("#J_lq_tab2_query_form [name=beginDate]").val(a+" 00:00:00"),$("#J_lq_tab2_query_form [name=endDate]").val(a+" 23:59:59"),$("#J_lq_tab2_query_form [type=submit]").click()}})):j.getLogBatchList(),$("#lq-calendar").fullCalendar(j.options),j.getScheduleList(),j.getExecuteFlag()},j.getWorkChart=function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_monitor_log_info","v4.0",e,function(e){var t=e.bcjson.items||e.bcjson;j.workListFirst=t;var a=[],r=[],o=[],n=[],i={xAxis:a,series:r,legendData:n};if("1"==e.bcjson.flag&&t&&0<t.length){saveJobid=t[0].jobId,saveBatchNo=t[0].batchNo,$("#grapy_work_name").html(t[0].jobName),$("#grapy_batch_no").html(t[0].batchNo),j.getThirdBoardData(t[0]);var l={};l.batchNo=t[0].batchNo,l.jobId=t[0].jobId,j.getScheduleSomeList(l);var c={S:"#3fc9d5",F:"#F1C40F",R:"#659be0",B:"#ed6b75",N:"#bac3d0"},s=!0,u=!(j.jobNameArr=[]),d=void 0;try{for(var m,g=t[Symbol.iterator]();!(s=(m=g.next()).done);s=!0){var f=m.value;if(!o[f.executeFlag]){o[f.executeFlag]={};var h={executeFlag:f.executeFlag,name:f.executeFlagName,type:"bar",stack:"Time",label:{},data:[],itemStyle:{normal:{color:c[f.executeFlag]}}};r.push(h),n.push(f.executeFlagName)}}}catch(e){u=!0,d=e}finally{try{!s&&g.return&&g.return()}finally{if(u)throw d}}var b=!0,p=!1,v=void 0;try{for(var y,x=t[Symbol.iterator]();!(b=(y=x.next()).done);b=!0){var _=y.value;if(j.jobNameArr.push("【"+_.batchNo+"】"+_.jobName),a.push($.kingdom.toDateTime(_.endTime)),o[_.executeFlag]){var N=!0,k=!1,S=void 0;try{for(var I,F=r[Symbol.iterator]();!(N=(I=F.next()).done);N=!0){var T=I.value;_.executeFlag==T.executeFlag?T.data.push(_.duration/1e3||0):T.data.push("-")}}catch(e){k=!0,S=e}finally{try{!N&&F.return&&F.return()}finally{if(k)throw S}}}}}catch(e){p=!0,v=e}finally{try{!b&&x.return&&x.return()}finally{if(p)throw v}}j.createWorkGraph(i)}else $("#work_log_grapy").html("<span style='margin-left:410px'>No Data</span>")})},j.createWorkGraph=function(e){var t=echarts.init(document.getElementById("work_log_grapy")),a={title:{text:"Schedule Log Analysis[Click the bar to view the detail]",left:10,textStyle:{fontSize:14}},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:function(e){for(var t={dataIndex:0,seriesName:"",name:"",value:""},a=0;a<e.length;a++)"-"!=e[a].value&&(t=e[a]);return j.jobNameArr[t.dataIndex]+"<br/>"+t.seriesName+"<br/>"+t.name+" ： "+t.value}},legend:{data:e.legendData,top:30},calculable:!0,xAxis:[{type:"category",axisTick:{show:!1},data:e.xAxis}],yAxis:[{type:"value",splitLine:{show:!1},axisLabel:{formatter:"{value} s"}}],dataZoom:[{type:"inside",xAxisIndex:[0],start:0,end:10},{type:"slider",show:!0,xAxisIndex:[0],start:0,end:100}],series:e.series};t.setOption(a),window.onresize=t.resize,t.on("click",function(a){var r={},o="";$.each(j.workListFirst,function(e,t){$.kingdom.toDateTime(t.endTime)==a.name&&(r.batchNo=t.batchNo,r.jobId=t.jobId,o=t.jobName,j.getThirdBoardData(t),saveJobid=t.jobId,saveBatchNo=t.batchNo)}),j.getWorkChart2(r),j.tab1SearchParamsCurrent=r,j.getScheduleSomeList($.extend({pageNumber:"1"},j.tab1SearchParamsCurrent)),$("#grapy_work_name").html(o),$("#grapy_batch_no").html(r.batchNo)})},j.getWorkChart2=function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_current_job_monitor_log_info","v4.0",e,function(e){var t=e.bcjson.items||e.bcjson;j.workListSecond=t;var a=[],r=[],o=[],n=[],i={xAxis:a,series:r};if("1"==e.bcjson.flag&&t&&0<t.length){var l={S:"#3fc9d5",F:"#F1C40F",R:"#659be0",B:"#ed6b75",N:"#bac3d0"},c=!0,s=!(j.jobNameArr=[]),u=void 0;try{for(var d,m=t[Symbol.iterator]();!(c=(d=m.next()).done);c=!0){var g=d.value;if(!o[g.executeFlag]){o[g.executeFlag]={};var f={executeFlag:g.executeFlag,name:g.executeFlagName,type:"bar",stack:"Count",label:{},data:[],itemStyle:{normal:{color:l[g.executeFlag]}}};r.push(f),n.push(g.executeFlagName)}}}catch(e){s=!0,u=e}finally{try{!c&&m.return&&m.return()}finally{if(s)throw u}}var h=!0,b=!1,p=void 0;try{for(var v,y=t[Symbol.iterator]();!(h=(v=y.next()).done);h=!0){var x=v.value;if(j.jobNameArr.push("【"+x.batchNo+"】"+x.jobName),a.push(x.nodeName),o[x.executeFlag]){var _=!0,N=!1,k=void 0;try{for(var S,I=r[Symbol.iterator]();!(_=(S=I.next()).done);_=!0){var F=S.value;x.executeFlag==F.executeFlag?F.data.push(x.duration/1e3||0):F.data.push("-")}}catch(e){N=!0,k=e}finally{try{!_&&I.return&&I.return()}finally{if(N)throw k}}}}}catch(e){b=!0,p=e}finally{try{!h&&y.return&&y.return()}finally{if(b)throw p}}j.createWorkGraph2(i)}else $("#work_log_grapy").html("<span style='margin-left:410px'>No Data</span>")})},j.createWorkGraph2=function(e){var t=echarts.init(document.getElementById("work_log_grapy")),a={title:{text:"Schedule Log Analysis[Click the bar to back]",left:10,textStyle:{fontSize:14}},color:["#7ccd7c","#f1b967","#63b8fd","#dd6e78"],tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:function(e){for(var t={dataIndex:0,seriesName:"",name:"",value:""},a=0;a<e.length;a++)"-"!=e[a].value&&(t=e[a]);return j.jobNameArr[t.dataIndex]+"<br/>"+t.seriesName+"<br/>"+t.name+" ：  "+t.value}},legend:{data:e.legendData,top:30},calculable:!0,xAxis:[{type:"category",axisTick:{show:!1},data:e.xAxis}],yAxis:[{type:"value",axisLabel:{formatter:"{value} s"}}],dataZoom:[{show:!0,start:0,end:100,zoomOnMouseWheel:!0}],series:e.series};t.setOption(a),window.onresize=t.resize,t.on("click",function(e){var a={};$.each(j.workListSecond,function(e,t){t.executeMsg==t.name&&(a.batchNo=t.batchNo,a.jobId=t.jobId,t.jobName)}),j.getWorkChart(a)})},j.getScheduleSomeList=function(e){var t=e;t.logType="2",$.kingdom.getList({apiName:"bayconnect.superlop.get_monitor_log_detail_info",apiVision:"v4.0",params:t,tableId:"J_lq_tab1_query_table",template:"log-query/template/single-job-log-list.handlebars",pageSize:"999"})},j.getLogBatchList=function(e){var t=$.extend({},e),a=sessionStorage.getItem("calendarJumpParams");sessionStorage.getItem("calendarJumpParams")&&(t=$.extend({},e,JSON.parse(a))),t.logType="1",$.kingdom.getList({apiName:"bayconnect.superlop.get_monitor_log_detail_info",apiVision:"v4.0",params:t,tableId:"log_batch_query_list",pageId:"log_query_pages",formName:"J_lq_tab2_query_form",template:"log-query/template/log_batch_list.handlebars",cb:j.getLogBatchList})},j.eventStartTime="",j.eventEndTime="",j.eventCallback="",j.eventScheduleId="",j.eventExecuteStatus="",j.options={header:{right:"prev,next today",left:"title"},defaultDate:(new Date).Format("yyyy-mm-dd"),editable:!0,monthNames:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],eventLimit:!1,eventStartEditable:!0,dayClick:function(e,t,a){console.log("Clicked on: "+e.format()),console.log("Coordinates: "+t.pageX+","+t.pageY),console.log("Current view: "+a.name)},eventClick:function(e){j.displayDetail(e)},eventMouseover:function(){$(this).find(".fc-title").attr("title",$(this).find(".fc-title").html())},eventDrop:function(e,t,a,r,o,n,i,l){console.log(e+t+a+r+o+n+i+l)},events:function(e,t,a,r){var o=e._d.getFullYear().toString()+(e._d.getMonth()+1<10?"0"+(e._d.getMonth()+1):e._d.getMonth()+1)+(e._d.getDate()<10?"0"+e._d.getDate():e._d.getDate()),n=t._d.getFullYear().toString()+(t._d.getMonth()+1<10?"0"+(t._d.getMonth()+1):t._d.getMonth()+1)+(t._d.getDate()<10?"0"+t._d.getDate():t._d.getDate());j.eventStartTime=o,j.eventEndTime=n,j.eventCallback=r;var i={};i.startTime=o,i.endTime=n,i.scheduleId=j.eventScheduleId,i.executeFlag=j.eventExecuteStatus,j.requestScheduleCalendarInfo(i)}},j.requestScheduleCalendarInfo=function(e,a){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_schedule_calendar_info","v4.0",e,function(e){if("1"===e.bcjson.flag){var s=[],t=e.bcjson.items||[];0<t.length&&$.each(t,function(e,t){var a=t.scheduleInfo;if(0!==a.length){var r=0,o=[],n=0,i=[],l=0,c=[];$.each(a,function(e,t){"B"==t.executeFlag?(l++,c.push(t)):"F"==t.executeFlag?(n++,i.push(t)):"S"==t.executeFlag&&(r++,o.push(t))}),0!==r&&s.push({start:t.scheduleDate,end:t.scheduleDate,title:"Succeed("+r+")",currentAllData:o,className:"success-complete"}),0!==n&&s.push({start:t.scheduleDate,end:t.scheduleDate,title:"Error completed("+n+")",currentAllData:i,className:"error-complete"}),0!==l&&s.push({start:t.scheduleDate,end:t.scheduleDate,title:"Error Interrupt("+l+")",currentAllData:c,className:"error-suspend"})}})}a?$("#lq-calendar").fullCalendar("refetchEvents"):j.eventCallback(s)})},j.getScheduleList=function(){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_schedule_info","v4.0",{pageNumber:"1",pageSize:"999"},function(e){if("1"===e.bcjson.flag){var t=e.bcjson.items||[];if(0<t.length){var a="";$.each(t,function(e,t){a=a+"<div style='padding: 4px 12px' scheduleId='"+t.scheduleId+"'>"+t.scheduleName+"</div>"}),$("#lg-schedule-list-menu-calendar").html(a)}}})},j.getExecuteFlag=function(){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_dict_data_list","v4.0",{},function(e){if("1"===e.bcjson.flag){var t=(e.bcjson.items||[])[0].EXECUTE_FLAG;if(t){var a="";$.each(t,function(e,t){"B"!==e&&"F"!==e&&"S"!=e||(a=a+"<div style='padding: 4px 12px;' flagId='"+e+"'>"+t+"</div>")}),$("#lg-flag-list-menu-calendar").html(a)}}})},j.displayDetail=function(e){var t="";0<e.currentAllData.length&&(t=e.currentAllData[0].startTimeStr);var a=App.getFormParams("J_lq_tab2_query_form"),r=t.substring(0,4)+"-"+t.slice(4,6)+"-"+t.slice(6,8)+" 00:00:00",o=t.substring(0,4)+"-"+t.slice(4,6)+"-"+t.slice(6,8)+" 23:59:00";$("#J_lq_tab2_query_form input[name=beginDate]").val(r),$("#J_lq_tab2_query_form input[name=endDate]").val(o),$("#Id-statistics-cat [href=#lg-tab_0-2]").click().find("label").addClass("active"),$("#Id-statistics-cat [href=#lg-tab_0-3]").find("label").removeClass("active"),$("#lg-tab_0-2 div[href=#J_lq_tab2_query_block]").click();var n=$.extend({executeFlagName:e.currentAllData[0].executeFlagName},{executeType:"A"});sessionStorage.setItem("calendarJumpParams",JSON.stringify(n)),j.getLogBatchList($.extend(a,n))},j.getTableData=function(e){$("#bottom-content-table").show();var t=$.extend({},e);$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_detail_flow_info","v4.0",t,function(e){var t=e.bcjson.items||e.bcjson;if("1"==e.bcjson.flag)if($("#J_tableList").jstree("destroy"),0<t.length){j.currentMsgCollection={},$.each(t,function(e,t){j.currentMsgCollection[e]=t.executeMsg,t.errorIndex=e});var a=r(t);$("#log-query-table-tree").tableTree({data:a}),$("#log-query-table-tree").tableTree({widthScale:2,data:a}).openNode($('[pkey="-1"]').attr("key"))}else $("#J_tableList").html("<image src='assets/img/nonedata.png'/>").css("text-align","center");else toastr.error(e.bcjson.msg)})},j.getThirdBoardData=function(t){var e={};e.batchNo=t.batchNo,e.jobId=t.jobId,j.getTableData(e),require.async("./template/perform-rightMiddle-tast.handlebars",function(e){$(".page-log-query #right-content-middle-tast").html(e([t]))})},module.exports=j});