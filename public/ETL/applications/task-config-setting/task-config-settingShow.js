var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e};define(function(require,exports,module){require("plugins/jstree/dist/jstree"),require("plugins/jstree/dist/themes/default/style.css"),require("plugins/select2/js/select2.js"),require("plugins/select2/css/select2.css"),require("plugins/bootstrap-fileinput/bootstrap-fileinput.js"),require("plugins/bootstrap-fileinput/bootstrap-fileinput.css"),require("plugins/codemirror/codemirror.css"),require("plugins/codemirror/codemirror.js"),require("plugins/select2/css/select2-compatible.css"),require("plugins/codemirror/addon/hint/show-hint.css"),require("plugins/codemirror/addon/hint/show-hint.js"),require("plugins/codemirror/addon/hint/sql-hint.js"),require("plugins/codemirror/clike"),require("plugins/codemirror/sql"),require("plugins/drag/kd_drag.js"),require("plugins/sql-formatter-2.3.0/sql-formatter");var f=location.hash.split("?")[0].replace("#",".page-"),e=new(require("assets/js/global/treeCommon"))(f,"#J_foldname_tree","#J_foldname_query_btn","#J_foldname_query","2"),p={};function t(e,t,a,r){return new n(e,t,a,r)}function n(o,i,a,e){var l=this;this.option={mode:"text/x-plsql",lineNumbers:!0,lineWiseCopyCut:!0,extraKeys:{"Ctrl-Space":"autocomplete"},hintOptions:{tables:{}}},p[o]=CodeMirror.fromTextArea(document.getElementById(a),this.option),p[o].on("change",function(e,t){$("#"+a).val(p[o].getValue()).change()}),p[o].on("keyup",function(e,t){var a=$(i).val(),r=p[o].getCursor(),n=p[o].getLine(r.line).replace(/ /g,"\t");l.autoComplete(e,t,a,r,n)}),$(e).click(function(){p[o]&&setTimeout(function(){p[o].refresh()},10)}),$("#"+a).closest(".modal").on("shown.bs.modal",function(){setTimeout(function(){p[o].refresh()},10)}),$("#"+a).on("change",function(){$(this).closest("form").validate().element(this)})}p.sourceTables=null,p.targetTable=null,p.procedureName=null,p.dataFildItems=null,p.parentFolderId=null,p.applyParam=null,p.successParam=null,p._load=function(){$.each($("input[type=text]:not([maxlength],[readonly])"),function(){$(this).attr("maxlength","32")}),$("input[name=exportPath]").removeAttr("maxlength"),$("input[name=exportName]").removeAttr("maxlength"),$("input[name=fileName]").removeAttr("maxlength"),$.each($("textarea:not([maxlength],[readonly])"),function(){$(this).attr("maxlength","256")}),$("[name=submitNum]").val("4096"),p.initForm(),App.initUniform(),e.getTask(),$.kingdom.getDict("TASK_TYPE","#J_task_type"),$.kingdom.getDict("TASK_TYPE","#J_task_option_1","","task-config-setting/template/task-option.handlebars"),$.kingdom.getDict("ROLLBACK_FLAG","[name=rollbackFlag]"),$.kingdom.getDict("BEFORE_RULE","[name=beforeRule]"),new Promise(function(e,t){$.kingdom.getDict("FILETYPE","select[name=fileType]",e)}).then(function(e){}),$.kingdom.getDict("OPER_TYPE","[fakename=operation]"),new Promise(function(e,t){$.kingdom.getDict("EXTEND_NAME","[name=extendName]",e)}).then(function(e){$("#J_form_TF [name=extendName]").find("option:contains('txt')").siblings().css("display","none")}),$.kingdom.getDict("CON_SEPARATOR","[name=taskSeparator]"),$.kingdom.getDict("FILE_CHARSET","[name=codeType]"),$.kingdom.getDict("SAFE_CONNECT_TYPE","[name=safeConnectType]"),$.kingdom.getDict("COMPRESS_TYPE","[name=compressType]"),$.kingdom.getDict("OPER_TYPE","[fakename=operator]"),t("cm_TE","#J_select2_single_tab_1_1","J_cm_TE",f+' a[href="#tab_1_2"]'),t("cm_TE_2","#J_select2_single_tab_1_2","J_cm_TE_2",f+' a[href="#tab_1_3"]'),t("cm_TE_3","#J_select2_single_tab_1_3","J_cm_TE_3",f+' a[href="#tab_1_3"]'),t("cm_TT","#J_modal_TT [name=connectionId]","J_cm_TT",f+' a[href="#tab_2_2"]'),t("cm_TV","#J_modal_TV [name=dbConnection]","J_cm_TV",f+' a[href="#tab_3_2"]'),t("cm_TP","#J_data_source_select2","J_cm_TP",f+' a[href="#tab_4_2"]'),t("cm_TF","#J_select2_single_tab_6_2","J_cm_TF",f+' a[href="#tab_6_2"]'),t("cm_TI","#J_select2_single_tab_1_9","J_cm_TI",f+' a[href="#tab_9_2"]')},p.getTaskList=function(e){var t={folderId:$("#J_foldname_tree li[aria-selected=true]").attr("folderId")};t=_extends(t,e),$.kingdom.getList({apiName:"bayconnect.superlop.get_task_info",apiVision:"v4.0",params:t,tableId:"J_task_table",pageId:"J_task_page",template:"task-config-setting/template/task-list.handlebars",formName:"J_task_form",cb:p.getTaskList})},p.setOptions=function(e){var a="";$.each($("#J_store_params tr:not([data-clone-sample]) [fakename=name]"),function(){var e=$(this).val(),t=$(this).parent().siblings().find("[fakename=direction]").val();e&&t.includes("OUT")&&(a+='<option value="'+e+'">'+e+"</option>")}),$("[name=returnVariable], [fakename=variable]").html(a),e&&$("[name=returnVariable], [fakename=variable]").val(e)},p.getTaskInfo=function(_){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_task_detail_info","v4.0",_,function(e){if("1"==e.bcjson.flag){var t=e.bcjson.items[0],a=$("#J_task_option_1 a[data-id="+_.taskType+"]").data("target"),r=$(a).find("form[type=main]").attr("name");if(App.setFormData(r,t),"#J_modal_TE"===a){p.sourceTables=t.sourceTables,p.targetTable=t.targetTable,$("#J_select2_single_tab_1_1").change(),$("#J_select2_single_tab_1_3").change(),$("[name=submitNum]").val(t.submitNum),t.transScript&&p.cm_TE.setValue(sqlFormatter.format(t.transScript,{language:"n1ql",indent:"    "})),t.createTableScript&&p.cm_TE_2.setValue(sqlFormatter.format(t.createTableScript)),t.deleteSql&&p.cm_TE_3.setValue(sqlFormatter.format(t.deleteSql)),$("[name=beforeRule]").change();var n=JSON.parse(t.mappingInfo).mappingColumn;0<n.length&&require.async("./template/data-field-list.handlebars",function(e){$("#J_data_field_tbody").html(e(n)),p.haddleDataField.init(n),App.initCheckableTable($("#J_data_field_table"))})}if("#J_modal_TT"===a&&($("#J_select2_single_tab_2_2").change(),t.command&&p.cm_TT.setValue(t.command)),"#J_modal_TV"===a&&($("#J_select2_single_tab_3_2").change(),t.variableScript&&p.cm_TV.setValue(sqlFormatter.format(t.variableScript))),"#J_modal_TP"===a){p.procedureName=t.procedureName,$("#J_data_source_select2").change();var o=JSON.parse(t.taskParameters);p.haddleParams.setData(o.parameters),p.setOptions(t.returnVariable),$("[fakename=rvariable]").val(o.returnmessage.rvariable),$.each($("#J_success_condition [fakename]"),function(){var e=$(this).attr("fakename");$(this).val(o.successcondition[e])})}if("#J_modal_TI"===a){t.fileUrl&&($("[data-provides=fileinput]").removeClass("fileinput-new").addClass("fileinput-exists"),$(".fileinput-filename").html(t.fileName+" "),$("[data-importtype] [name=fileUrl]").val(t.fileUrl),$("[data-importtype] [name=fileType]").val(t.fileType),$("[data-importtype] [name=fileName]").val(t.fileName),$(f+" select[name=fileType]").change()),p.targetTable=t.targetTable,$("#J_select2_single_tab_1_9").val(t.targetConnectionId).change(),$("[name=submitNum]").val(t.submitNum).change(),$("[name=beforeRule]").change(),$("[name=fileClass]").val("TASK"),t.startImportLine&&"1"!==t.startImportLine?($("#J_import_txt_start_line input")[1].click(),$("[name=startImportLine]").val(t.startImportLine)):$("#J_import_txt_start_line input")[0].click(),t.deleteSql&&p.cm_TI.setValue(sqlFormatter.format(t.deleteSql));var i=JSON.parse(t.mappingInfo).mappingColumn;if(0<i.length){var l=!0,s=!1,d=void 0;try{for(var c,u=i[Symbol.iterator]();!(l=(c=u.next()).done);l=!0){var m=c.value;m.columnName=m.targetColumn}}catch(e){s=!0,d=e}finally{try{!l&&u.return&&u.return()}finally{if(s)throw d}}require.async("./template/data-field-list-2.handlebars",function(e){$("#J_data_field_tbody_2").html(e(i)),p.haddleDataField_2.init(i),App.initCheckableTable($("#J_data_field_table_2"))})}}"#J_modal_TF"===a&&($("#J_select2_single_tab_6_2").change(),t.command&&p.cm_TF.setValue(sqlFormatter.format(t.command)),$("[name=headFlag]").change()),"#J_modal_DQ"===a&&(p.applyParam=t.applyParam,$("#J_select2_single_tab_11_1").val(t.ruleFolderId).change()),"#J_modal_DR"===a&&($("#J_modify_filename").html(""),"all"!==t.sourceUrl?($("#tab_12_3 .zdy").click(),$("[name=a1006FilesPath]").val(t.sourceUrl)):$("#tab_12_3 .all").click(),"0"===t.isRename&&($("[name=targetFileName]").hide().attr("type","hidden"),$("[name=sourceFileName]").hide().attr("type","hidden"),$("#modify_file_content").hide()),$("#modify_file_content [name=targetFileName]").val()&&$("#modify_file_content [name=targetFileName]").blur()),"#J_modal_TZ"===a&&(t.a1005FilesPath?$("#J_TZ_file_range input")[1].click():$("#J_TZ_file_range input")[0].click()),App.updateUniform(),$(a+" [type=jstree]").jstree(!0).open_all(),$(a+" [type=jstree] [folderid="+t.folderId+"]>.jstree-anchor").click(),$(a+" .J_save").data("tasktype",_.taskType).data("type","edit"),$(a+" [name=userPassword]").removeAttr("changed"),$(a).modal("show")}})},p.moveTaskInfo=function(t){App.blockUI({boxed:!0,message:"处理中..."}),$.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_task_folder_trans","v4.0",t,function(e){"1"==e.bcjson.flag?(toastr.success(e.bcjson.msg),$("#J_foldname_tree li[folderId="+t.targetFolderId+"]>a").click(),p.getTaskList(),$("#J_task_move_modal").modal("hide")):toastr.error(e.bcjson.msg),App.unblockUI()})},p.delTaskInfo=function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_task_info_del","v4.0",e,function(e){"1"==e.bcjson.flag?(App.unblockUI(),toastr.success(e.bcjson.msg),p.getTaskList()):toastr.error(e.bcjson.msg)})},p.copyTaskInfo=function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_set_task_info_copy","v4.0",e,function(e){"1"==e.bcjson.flag?(App.unblockUI(),toastr.success(e.bcjson.msg),p.getTaskList()):toastr.error(e.bcjson.msg)})},p.checkRelateJob=function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_relate_job_info","v4.0",e,function(t){"1"==t.bcjson.flag?0<t.bcjson.lengths?require.async("./template/job-list.handlebars",function(e){$("#J_relate_job_list").html(e(t.bcjson.items))}):$("#J_relate_job_list").html('<tr><td colspan="2" class="text-center">暂无数据</td></tr>'):toastr.error(t.bcjson.msg)})},p.setTaskInfo=function(e,t,a){App.blockUI({boxed:!0,message:"处理中..."});var r="add"===t?"bayconnect.superlop.set_task_info":"bayconnect.superlop.set_task_info_modify";$.kingdom.doKoauthAdminAPI(r,"v4.0",e,function(e){App.unblockUI(),"1"==e.bcjson.flag?(toastr.success(e.bcjson.msg),"function"==typeof a&&a(e)):toastr.error(e.bcjson.msg)})},p.setEditTaskInfo=function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_task_info_modify","v4.0",e,function(e){})},p.clearData=function(){$.each($(".modal form[type=main]"),function(){var e=$(this).attr("name");App.clearForm(e)}),p.haddleParams.delAllRow(),$(".select2-hidden-accessible").empty().clearInputs(),$("[name=returnVariable]").html(""),$("[name=submitNum]").val("4096"),$(".modal input").prop("checked",!1).parent().removeClass("checked"),$("#J_sql_preview_table, #J_data_field_tbody, #J_sql_preview_thead, #J_data_field_tbody_2, #J_query_datafield_result_table").html(""),$("[name=importType]")[0].click(),$("#J_import_txt_start_line input")[0].click(),$("#tab_12_3 .zdy").click(),$("#J_is_modify_file input[name=isRename]:eq(0)").val("0"),$("#J_is_modify_file input[name=isRename]:eq(1)").val("1"),$("#J_modify_filename").html(""),$("#J_is_modify_file input")[1].click(),$("#J_TZ_file_range input")[0].click(),$("[data-provides=fileinput]").addClass("fileinput-new").removeClass("fileinput-exists"),$(".fileinput-filename").html(""),$("[name=fileClass]").val("TASK"),p.cm_TE.setValue(""),p.cm_TE_2.setValue(""),p.cm_TE_3.setValue(""),p.cm_TT.setValue(""),p.cm_TV.setValue(""),p.cm_TP.setValue(""),p.cm_TI.setValue(""),p.cm_TF.setValue(""),$("[name=beforeRule]").change(),App.updateUniform()},p.getDataSourceList=function(d){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_source_config","v4.0",{},function(e){if("1"==e.bcjson.flag){var t=e.bcjson.items,a=[{id:"",text:""}];if(t&&0<t.length){var r=!0,n=!1,o=void 0;try{for(var i,l=t[Symbol.iterator]();!(r=(i=l.next()).done);r=!0){var s=i.value;a.push({id:s.connectionId,text:s.connectionName})}}catch(e){n=!0,o=e}finally{try{!r&&l.return&&l.return()}finally{if(n)throw o}}}$("#J_select2_single_tab_1_1").select2({data:a,placeholder:"- 请选择 -"}),$("#J_select2_single_tab_1_3").select2({data:a,placeholder:"- 请选择 -"}),$("#J_select2_single_tab_2_2").select2({data:a,placeholder:"- 请选择 -"}),$("#J_select2_single_tab_3_2").select2({data:a,placeholder:"- 请选择 -"}),$("#J_data_source_select2").select2({data:a,placeholder:"- 请选择 -"}),$("#J_select2_single_tab_1_9").select2({data:a,placeholder:"- 请选择 -"}),$("#J_select2_single_tab_6_2").select2({data:a,placeholder:"- 请选择 -"}),"function"==typeof d&&d()}})},p.getTableList=function(e,c,u,m){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_metadata_table_info","v4.0",e,function(e){if("1"==e.bcjson.flag){var t=e.bcjson.items,a=[{id:"",text:""}],r=[];if(t){var n=!0,o=!1,i=void 0;try{for(var l,s=t[Symbol.iterator]();!(n=(l=s.next()).done);n=!0){var d=l.value;a.push({id:d.tableId,text:d.schemName+"."+d.tableName+"("+(d.tableDesc||d.mdType)+")"}),r.push({id:d.tableId,text:d.schemName+"."+d.tableName})}}catch(e){o=!0,i=e}finally{try{!n&&s.return&&s.return()}finally{if(o)throw i}}}$(c).empty().clearInputs(),$(c).select2({data:a,placeholder:"- 请选择 -",tags:u}),$(c).data("origin",r),"function"==typeof m&&m()}})},p.getRuleFolder=function(d){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_folder_menu","v4.0",{fileType:"3"},function(e){if("1"==e.bcjson.flag){var t=e.bcjson.items,a=[{id:"",text:""}];if(t&&0<t.length){var r=!0,n=!1,o=void 0;try{for(var i,l=t[Symbol.iterator]();!(r=(i=l.next()).done);r=!0){var s=i.value;a.push({id:s.folderId,text:s.foldName})}}catch(e){n=!0,o=e}finally{try{!r&&l.return&&l.return()}finally{if(n)throw o}}}$("#J_select2_single_tab_11_1").select2({data:a,placeholder:"- 请选择 -"}),"function"==typeof d&&d()}})},p.getRuleList=function(e,d){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_rule_info","v4.0",e,function(e){if("1"==e.bcjson.flag){var t=e.bcjson.items,a=[];if(t&&0<t.length){var r=!0,n=!1,o=void 0;try{for(var i,l=t[Symbol.iterator]();!(r=(i=l.next()).done);r=!0){var s=i.value;a.push({id:s.ruleId,text:s.ruleName})}}catch(e){n=!0,o=e}finally{try{!r&&l.return&&l.return()}finally{if(n)throw o}}}$("#J_select2_multi_tab_11_1").empty().clearInputs(),$("#J_select2_multi_tab_11_1").select2({data:a,placeholder:"- 请选择 -",multiple:!0}).data("obj",t),"function"==typeof d&&d()}})},p.getSQL=function(e,a){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_qry_statement","v4.0",e,function(e){if("1"==e.bcjson.flag){var t=e.bcjson.items[0].qryStatement;p.cm_TE.setValue(t),"function"==typeof a&&a(t)}})},p.getPreviewSQL=function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_qry_statement_result","v4.0",e,function(e){if("1"==e.bcjson.flag){var t=e.bcjson.items;if(!t||0===t.length)return void toastr.info("没有查询到数据");for(var a='<thead><tr><th style="width: 40px"> 序号 </th>',r="<tbody>",n=t.length,o=0;o<n;o++){var i=t[o],l="<tr><td> "+(o+1)+" </td>";for(var s in i)0===o&&(a+="<th> "+s+" </th>"),l+="<td> "+i[s]+" </td>";r+=l+="</tr>"}var d='<div class="table-scrollable mt10" style="max-height:500px;">\n                    <table class="table table-striped table-bordered table-hover order-column">\n                        '+(a+="</tr></thead>")+"\n                        "+(r+="</tbody>")+"\n                    </table>\n                </div>";$("#J_sql_preview_table, #J_query_datafield_result_table").html(d)}})},p.getBuildTableSQL=function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_create_statement","v4.0",e,function(e){"1"==e.bcjson.flag&&p.cm_TE_2.setValue(e.bcjson.items[0].createStatement.replace(/\([\u4e00-\u9fa5]+\)/g,""))})},p.getDataField=function(_,f){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_column_mapping_info","v4.0",_,function(e){if("1"==e.bcjson.flag){var a=e.bcjson.items;if(0===a.length)return void toastr.info("没有查询到映射字段");var t=$("#J_select2_multi_tab_1_3").data("origin"),r=!0,n=!0,o=!1,i=void 0;try{for(var l,s=t[Symbol.iterator]();!(n=(l=s.next()).done);n=!0){l.value.id===_.targetTableId&&(r=!1)}}catch(e){o=!0,i=e}finally{try{!n&&s.return&&s.return()}finally{if(o)throw i}}if(r){var d=$("#J_cm_TE_2").val().replace(/[\n]/g," ").replace(/[\t]/g," ");if(!d)return void toastr.info("生成对象语句不能为空");for(var c=function(e){return e.match(/(\(\s+|,\s+)\w+\s/g).map(function(e,t){return e.replace(/(\(|,|\s)/g,"")})}(d),u=0,m=a.length;u<m;u++)c[u]&&(a[u].targetColumn=c[u])}require.async("./template/data-field-list.handlebars",function(e){p.dataFildItems=a;var t=p.haddleDataField.getRow();0===t||"2"===_.searchType||"3"===_.searchType||"refresh"===f?($("#J_data_field_tbody").html(e(a)),p.haddleDataField.init(a),App.initCheckableTable($("#J_data_field_table"))):($("#J_haddle_new_data .colored-red").html(t),$("#J_haddle_new_data .colored-blue").html(a.length),$("#J_haddle_new_data").css({height:"auto",opacity:"1",padding:"8px 10px",transition:".5s ease-in-out"}))})}})},p.haddleDataField={init:function(e){var t='<select class="form-control input-sm"><option value="">- 请选择 -</option>',a='<select class="form-control input-sm"><option value="">- 请选择 -</option>',r=!0,n=!1,o=void 0;try{for(var i,l=e[Symbol.iterator]();!(r=(i=l.next()).done);r=!0){var s=i.value;s.targetColumn&&(t+='<option value="'+s.targetColumn+'">'+s.targetColumn+"</option>"),a+='<option value="'+s.sourceColumn+'">'+s.sourceColumn+"</option>"}}catch(e){n=!0,o=e}finally{try{!r&&l.return&&l.return()}finally{if(n)throw o}}t+="</select>",a+="</select>",$.each($("#J_data_field_tbody [data-type=target]:not([inited])"),function(){var e=$.trim($(this).html());e&&$(this).html(t).attr("inited","inited").children().val(e)}),$.each($("#J_data_field_tbody [data-type=source]:not([inited])"),function(){var e=$.trim($(this).html());e?$(this).html(a).attr("inited","inited").children().val(e):$(this).html('<input class="form-control" type="text">')}),$("#J_data_field_tbody [data-type=target] select:first").change()},refresh:function(){$.each($("#J_data_field_tbody tr td[data-type]"),function(){var e=$(this).data("origin");$(this).children().val(e)})},getRow:function(){return $("#J_data_field_tbody tr").length},appendNew:function(){var t=[],a=[];$.each($("#J_data_field_tbody tr [data-type=target]"),function(){var e=$(this).children().val();t.push(e)});var e=p.dataFildItems,r=!0,n=!1,o=void 0;try{for(var i,l=e[Symbol.iterator]();!(r=(i=l.next()).done);r=!0){var s=i.value;t.includes(s.targetColumn)||a.push(s)}}catch(e){n=!0,o=e}finally{try{!r&&l.return&&l.return()}finally{if(n)throw o}}require.async("./template/data-field-list.handlebars",function(e){$("#J_data_field_tbody").append(e(a)),p.haddleDataField.init(a),p.haddleDataField.reorder(),App.initCheckableTable($("#J_data_field_table"))}),p.haddleDataField.reorder()},appendAll:function(){require.async("./template/data-field-list.handlebars",function(e){$("#J_data_field_tbody").append(e(p.dataFildItems)),p.haddleDataField.init(p.dataFildItems),p.haddleDataField.reorder(),App.initCheckableTable($("#J_data_field_table"))})},clearAppendAll:function(){require.async("./template/data-field-list.handlebars",function(e){$("#J_data_field_tbody").html(e(p.dataFildItems)),p.haddleDataField.init(p.dataFildItems),App.initCheckableTable($("#J_data_field_table"))})},delCheckedRow:function(){0===$("#J_data_field_tbody input[type=checkbox]:checked").length&&toastr.info("请勾选要删除的行"),$.each($("#J_data_field_tbody input[type=checkbox]:checked"),function(e){$(this).closest("tr").remove()}),p.haddleDataField.reorder()},reorder:function(){$.each($("#J_data_field_tbody tr"),function(e){$(this).find("td:first").text(e+1)})},getData:function(){var n=new Array;return $.each($("#J_data_field_tbody tr"),function(e){var t=$(this).find("[data-type=source] select").val(),a=$(this).find("[data-type=target] select").data("v"),r={no:(e+1).toString(),sourceColumn:t,targetColumn:a};t&&a&&n.push(r)}),JSON.stringify({mappingColumn:n})}},p.getStoredProcedure=function(e,d){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_qry_statement_result","v4.0",e,function(e){if("1"==e.bcjson.flag){var t=e.bcjson.items,a=[{id:"",text:""}];if(t&&0<t.length){var r=!0,n=!1,o=void 0;try{for(var i,l=t[Symbol.iterator]();!(r=(i=l.next()).done);r=!0){var s=i.value.OBJECTNAME;a.push({id:s,text:s})}}catch(e){n=!0,o=e}finally{try{!r&&l.return&&l.return()}finally{if(n)throw o}}}$("#J_stored_procedure_select2").empty().clearInputs(),$("#J_stored_procedure_select2").select2({data:a,placeholder:"- 请选择 -"}),$("#J_stored_procedure_select2").data("origin",a),"function"==typeof d&&d()}})},p.getStoredProcedurePreview=function(e,t){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_proc_statement","v4.0",e,function(e){"1"==e.bcjson.flag?"function"==typeof t&&t(e):toastr.error(e.bcjson.msg)})},p.testStore=function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_proc_test_info","v4.0",e,function(e){"1"==e.bcjson.flag?toastr.success(e.bcjson.msg):toastr.error(e.bcjson.msg),App.unblockUI()})},p.getDataField_2=function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_metadata_column_info","v4.0",e,function(e){if("1"==e.bcjson.flag){var t=e.bcjson.items;if(0===t.length)return void toastr.info("没有查询到映射字段");require.async("./template/data-field-list-2.handlebars",function(e){$("#J_data_field_tbody_2").html(e(t)),p.haddleDataField_2.init(t),App.initCheckableTable($("#J_data_field_table_2"))})}})},p.haddleDataField_2={init:function(e){var t='<select class="form-control input-sm"><option value="">- 请选择 -</option>',a=!0,r=!1,n=void 0;try{for(var o,i=e[Symbol.iterator]();!(a=(o=i.next()).done);a=!0){var l=o.value;t+='<option value="'+l.columnName+'">'+l.columnName+"</option>"}}catch(e){r=!0,n=e}finally{try{!a&&i.return&&i.return()}finally{if(r)throw n}}t+="</select>",$.each($("#J_data_field_tbody_2 [data-type=target]:not([inited])"),function(){var e=$.trim($(this).data("origin"));$(this).html(t).attr("inited","inited").children().val(e)}),$("#J_data_field_tbody_2 [data-type=target] select:first").change()},refresh:function(){$.each($("#J_data_field_tbody_2 tr td[data-type]"),function(){var e=$(this).data("origin");$(this).children().val(e)})},getRow:function(){return $("#J_data_field_tbody_2 tr").length},delCheckedRow:function(){0===$("#J_data_field_tbody_2 input[type=checkbox]:checked").length&&toastr.info("请勾选要删除的行"),$.each($("#J_data_field_tbody_2 input[type=checkbox]:checked"),function(e){$(this).closest("tr").remove()}),p.haddleDataField_2.reorder()},reorder:function(){$.each($("#J_data_field_tbody_2 tr"),function(e){$(this).find("td:first").text(e+1),$(this).find("td[data-type=import]").html(" 第 "+(e+1)+" 列 ")})},getData:function(){var r=new Array;return $.each($("#J_data_field_tbody_2 tr"),function(e){var t=$(this).find("[data-type=target] select").data("v"),a={no:(e+1).toString(),sourceColumn:(e+1).toString(),targetColumn:t};r.push(a)}),JSON.stringify({mappingColumn:r})}},p.getDictShield=function(){},p.initForm=function(){$("#J_form_TE").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{taskName:{required:!0},folderName:{required:!0},sourceConnection:{required:!0},sourceTables:{required:!0},targetConnection:{required:!0},targetTable:{required:!0},submitNum:{required:!0,numCheck:!0},deleteSql:{required:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$("#J_form_TT").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{taskName:{required:!0},folderName:{required:!0},connectionId:{required:!0},transRule:{required:!0},command:{required:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$("#J_form_TV").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{taskName:{required:!0},folderName:{required:!0},variableName:{required:!0,specialCharacter:!0},connectionId:{required:!0},variableScript:{required:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$("#J_form_TP").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{taskName:{required:!0},folderName:{required:!0},dbConnection:{required:!0},procedureName:{required:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$("#J_form_TF").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{taskName:{required:!0},folderName:{required:!0},dbConnection:{required:!0},command:{required:!0},extendName:{required:!0},exportPath:{required:!0,maxlength:128},exportName:{required:!0,maxlength:128},catalogFlag:{required:!0},addFlag:{required:!0},headFlag:{required:!0},taskSeparator:{required:!0},headerContent:{required:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$("#J_form_TM").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{taskName:{required:!0},folderName:{required:!0},recieveAddress:{required:!0},codeType:{required:!0},mailTopic:{required:!0},mailNote:{required:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$("#J_form_TI").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{taskName:{required:!0},folderName:{required:!0},fileType:{required:!0},fileUrl:{required:!0,maxlength:64},fileName:{required:!0,maxlength:64},taskSeparator:{required:!0},submitNum:{required:!0,numCheck:!0},beforeRule:{required:!0},deleteFileFlag:{required:!0},deleteSql:{required:!0},targetConnectionId:{required:!0},targetTable:{required:!0},startImportLine:{required:!0,startImportLineCheck:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$("#J_form_TZ").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{taskName:{required:!0},folderName:{required:!0},compressType:{required:!0},filePath:{required:!0},fileName:{required:!0,maxlength:64},a1005FilesPath:{required:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$("#J_form_DQ").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{taskName:{required:!0},folderName:{required:!0},ruleFolderId:{required:!0},ruleids:{required:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$("#J_form_DR").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{taskName:{required:!0},folderName:{required:!0},uploadUrl:{required:!0},sourceUrl:{required:!0},isRename:{required:!0},targetFileName:{required:!0},sourceFileName:{required:!0},a1006FilesPath:{required:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$.validator.addMethod("startImportLineCheck",function(e){return/^([1-9]\d+|[2-9])$/.test(e)},"请输入大于1的整数")},n.prototype.getTable=function(d,c){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_db_metadata_tables","v4.0",d,function(e){if("1"==e.bcjson.flag){var t=e.bcjson.items,a={};if(0===t.length)return;var r=!0,n=!1,o=void 0;try{for(var i,l=t[Symbol.iterator]();!(r=(i=l.next()).done);r=!0){var s=i.value;a[d.schema+"."+s.TABLE_NAME]=[]}}catch(e){n=!0,o=e}finally{try{!r&&l.return&&l.return()}finally{if(n)throw o}}c(a)}})},n.prototype.autoComplete=function(t,e,a,r,n){var o=this;if(!t.state.completionActive&&(65<=e.keyCode&&e.keyCode<=90||52==e.keyCode||219==e.keyCode)&&CodeMirror.commands.autocomplete(t,null,{completeSingle:!1}),190===e.keyCode){var i;if(n.split("\t").forEach(function(e,t){n.lastIndexOf(e)+e.length===r.ch&&(i=e.replace(/[.\s\t]/g,""))}),!i)return;this.getTable({schema:i,connection_id:a},function(e){o.option.hintOptions.tables=e,CodeMirror.commands.autocomplete(t,null,{completeSingle:!1})})}},module.exports=p});